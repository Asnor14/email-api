import admin, { firestore } from '../../utils/firebaseAdmin';

export default async function handler(req, res) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Require code in the body
    const { email, newPassword, code } = req.body;

    if (!email || !newPassword || !code) {
        return res.status(400).json({ error: 'Email, new password, and verification code are required' });
    }

    try {
        // 1. Verify OTP first (Security Check)
        const docRef = firestore.collection('otps').doc(email.toLowerCase());
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(403).json({ error: 'No verification code found. Please request a new code.' });
        }

        const stored = doc.data();

        // Check if code matches
        if (stored.code !== code) {
            return res.status(403).json({ error: 'Invalid verification code.' });
        }

        // Check expiry
        if (Date.now() > stored.expiresAt) {
            await docRef.delete();
            return res.status(403).json({ error: 'Verification code expired.' });
        }

        // Check type (should be password_reset)
        if (stored.type !== 'password_reset') {
            return res.status(403).json({ error: 'Invalid verification code type.' });
        }

        // 2. Get user by email
        const user = await admin.auth().getUserByEmail(email);

        // 3. Update password
        await admin.auth().updateUser(user.uid, {
            password: newPassword,
        });

        // 4. Mark email as verified
        await admin.auth().updateUser(user.uid, {
            emailVerified: true,
        });

        // 5. Consume the code (Security: Prevent reuse)
        await docRef.delete();

        return res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Update password error:', error);
        return res.status(500).json({
            error: 'Failed to update password',
            details: error.message
        });
    }
}
