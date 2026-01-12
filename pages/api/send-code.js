const nodemailer = require('nodemailer');

// In-memory code storage (for serverless, consider using Redis/Upstash)
const codes = new Map();

// Generate 6-digit code
function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

// Email template
function getEmailTemplate(code, type) {
    const title = type === 'registration' ? 'Verify Your Email' : 'Reset Your Password';
    const message = type === 'registration'
        ? 'Thank you for registering with PillPal. Use the code below to verify your email.'
        : 'Use the code below to reset your password.';

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f5f9ff;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="500" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
          <tr>
            <td align="center" style="padding:40px 40px 20px;">
              <div style="background:linear-gradient(135deg,#1565C0,#42A5F5);padding:16px 24px;border-radius:12px;display:inline-block;">
                <span style="font-size:28px;">💊</span>
                <span style="color:#fff;font-size:24px;font-weight:bold;margin-left:8px;">PillPal</span>
              </div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 40px 10px;">
              <h1 style="margin:0;color:#1565C0;font-size:24px;">${title}</h1>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 40px 30px;">
              <p style="margin:0;color:#666;font-size:15px;">${message}</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 40px 30px;">
              <div style="background:#f8f9fa;border:2px dashed #1565C0;border-radius:12px;padding:20px;">
                <p style="margin:0 0 8px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:2px;">
                  Your Verification Code
                </p>
                <p style="margin:0;font-size:36px;font-weight:bold;letter-spacing:8px;color:#1565C0;font-family:monospace;">
                  ${code}
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 40px 30px;">
              <div style="background:#fff3e0;border-radius:8px;padding:12px 16px;display:inline-block;">
                <span style="color:#e65100;font-size:14px;">
                  ⏱️ This code expires in <strong>5 minutes</strong>
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:20px 40px 40px;border-top:1px solid #eee;">
              <p style="margin:0;color:#999;font-size:13px;">
                If you didn't request this, ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export default async function handler(req, res) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, type } = req.body;

    if (!email || !type) {
        return res.status(400).json({ error: 'Email and type are required' });
    }

    if (!['registration', 'password_reset'].includes(type)) {
        return res.status(400).json({ error: 'Invalid type' });
    }

    try {
        const code = generateCode();
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

        // Store code
        codes.set(`${email.toLowerCase()}_${type}`, { code, expiresAt });

        // Send email
        await transporter.sendMail({
            from: `"PillPal" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: type === 'registration'
                ? 'PillPal - Verify Your Email'
                : 'PillPal - Password Reset Code',
            html: getEmailTemplate(code, type),
        });

        return res.status(200).json({ success: true, message: 'Code sent' });
    } catch (error) {
        console.error('Email error:', error);
        return res.status(500).json({ error: 'Failed to send email' });
    }
}

// Export codes map for verify-code endpoint
export { codes };
