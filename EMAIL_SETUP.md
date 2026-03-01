# Email Configuration Guide

## Setting Up Gmail for Sending Booking Requests

To enable email notifications for booking requests, follow these steps:

### Step 1: Generate Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "How you sign in to Google", enable "2-Step Verification" (if not already enabled)
4. After enabling 2-Step Verification, go back to Security
5. Click on "2-Step Verification"
6. Scroll down and click on "App passwords"
7. Select "Mail" and "Windows Computer" (or Other)
8. Click "Generate"
9. Copy the 16-character password (it will look like: xxxx xxxx xxxx xxxx)

### Step 2: Update .env File

1. Open the `.env` file in your project root
2. Replace `your-app-password-here` with the app password you generated:

```
EMAIL_USER=fishtravel45@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
PORT=3000
```

**Important:** Remove the spaces from the app password, so it becomes: `abcdefghijklmnop`

### Step 3: Test the Configuration

1. Restart your server:
```bash
npm run dev
```

2. Submit a test booking through the website
3. Check your inbox at fishtravel45@gmail.com

## Email Format

When a customer submits a booking request, you'll receive an email with:

- **Subject:** ✈️ New Flight Booking Request - [From] to [To] | [Trip Type]
- **Body:** Formatted booking details including:
  - Trip type (One Way/Round Trip)
  - Flight details (From, To, Dates)
  - All passenger names (Adults, Children, Infants)
  - Contact information (Phone, Email)
  - Special requests (Extra Baggage, Wheelchair, etc.)
  - Additional notes

## Troubleshooting

If emails are not sending:

1. **Check App Password:** Make sure you're using an App Password, not your regular Gmail password
2. **2-Step Verification:** Ensure 2-Step Verification is enabled on your Google account
3. **Less Secure Apps:** This is no longer needed with App Passwords
4. **Check Console:** Look at the server console for error messages
5. **Firewall:** Ensure your firewall allows outgoing connections on port 587

## Fallback Mode

If email is not configured, the system will:
- Still accept booking requests
- Log them to the server console
- Show a success message to customers
- Recommend they call for urgent requests

This ensures customers can always submit bookings even if email isn't set up yet.

## Alternative: Using Another Email Service

If you prefer to use a different email service (Outlook, Yahoo, etc.), update the transporter configuration in `server.js`:

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@example.com',
    pass: 'your-password'
  }
});
```
