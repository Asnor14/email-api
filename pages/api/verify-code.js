import { codes } from './send-code';

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
        const key = `${email.toLowerCase()}_${type}`;
        const stored = codes.get(key);

        if (!stored) {
            return res.status(200).json({
                success: false,
                error: 'No verification code found. Please request a new one.'
            });
        }

        // Check expiry
        if (Date.now() > stored.expiresAt) {
            codes.delete(key);
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

        // Success - remove code
        codes.delete(key);
        return res.status(200).json({ success: true, message: 'Code verified' });

    } catch (error) {
        console.error('Verify error:', error);
        return res.status(500).json({ error: 'Verification failed' });
    }
}
