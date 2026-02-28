const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message, service } = req.body;
  
  // Configure email transporter (update with actual credentials)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'fishtravel45@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });

  const mailOptions = {
    from: email,
    to: 'fishtravel45@gmail.com',
    subject: `New ${service} Inquiry from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\n\nMessage:\n${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Your inquiry has been sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send inquiry. Please contact us directly.' });
  }
});

app.listen(PORT, () => {
  console.log(`Fish ALHATEMI Travel Agent server running on http://localhost:${PORT}`);
});
