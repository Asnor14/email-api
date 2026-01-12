# PillPal Email API

Simple API for sending verification emails. Deploy to Vercel for free!

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local`:
```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

3. Run locally:
```bash
npm run dev
```

## Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repo
4. Add environment variables in Vercel dashboard
5. Deploy!

## API Endpoints

### POST /api/send-code
```json
{
  "email": "user@example.com",
  "type": "registration" | "password_reset"
}
```

### POST /api/verify-code
```json
{
  "email": "user@example.com",
  "code": "123456",
  "type": "registration" | "password_reset"
}
```
