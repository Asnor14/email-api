import { firestore } from '../../utils/firebaseAdmin';

export default async function handler(req, res) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, code, type } = req.body;

    if (!email || !code || !type) {
        return res.status(400).json({ error: 'Email, code, and type are required' });
    }

    try {
        const docRef = firestore.collection('otps').doc(email.toLowerCase());
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(200).json({
                success: false,
                error: 'No verification code found. Please request a new one.'
            });
        }

        const stored = doc.data();

        // Check type match
        if (stored.type !== type) {
            return res.status(200).json({
                success: false,
                error: 'Invalid verification type.'
            });
        }

        // Check expiry
        if (Date.now() > stored.expiresAt) {
            await docRef.delete();
            return res.status(200).json({
                success: false,
                error: 'Code has expired. Please request a new one.'
            });
        }

        // Check code match
        if (stored.code !== code) {
            return res.status(200).json({
                success: false,
                error: 'Invalid verification code.'
            });
        }

        // Success - DO NOT delete code here, as it might be needed for the actual action (like update password)
        // Or if it is registration, maybe we can delete it. 
        // For now, let's keep it until expiry or final action consumes it.

        return res.status(200).json({ success: true, message: 'Code verified' });

    } catch (error) {
        console.error('Verify error:', error);
        return res.status(500).json({ error: 'Verification failed' });
    }
}
