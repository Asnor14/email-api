import admin from 'firebase-admin';

if (!admin.apps.length) {
    if (process.env.FIREBASE_PRIVATE_KEY) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                }),
            });
        } catch (error) {
            console.error('Firebase admin initialization error', error);
        }
    }
}

export default async function handler(req, res) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ error: 'Email and new password are required' });
    }

    try {
        // 1. Get user by email
        const user = await admin.auth().getUserByEmail(email);

        // 2. Update password
        await admin.auth().updateUser(user.uid, {
            password: newPassword,
        });

        // 3. Mark email as verified (optional, but good since we did OTP)
        await admin.auth().updateUser(user.uid, {
            emailVerified: true,
        });

        return res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Update password error:', error);
        return res.status(500).json({
            error: 'Failed to update password',
            details: error.message
        });
    }
}
