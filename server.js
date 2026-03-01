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
  const { 
    tripType, from, to, departureDate, returnDate,
    adults, children, infants,
    phone, email,
    extraBaggage, specialMeal, wheelchair, flexibleDates,
    additionalRequests
  } = req.body;
  
  // Format passenger lists with full details
  const formatPassengers = (list, label) => {
    if (!list || list.length === 0) return '';
    const formatted = list.map((p, i) => {
      let info = `  ${i + 1}. ${p.name}`;
      if (p.dob) info += `\n     Date of Birth: ${p.dob}`;
      if (p.passport) info += `\n     Passport/ID: ${p.passport}`;
      return info;
    }).join('\n\n');
    return `\n${label}:\n${formatted}`;
  };
  
  const adultsText = formatPassengers(adults, 'ADULTS (12+ Years)');
  const childrenText = formatPassengers(children, 'CHILDREN (2-11 Years)');
  const infantsText = formatPassengers(infants, 'INFANTS (0-23 Months)');
  
  // Format special requests
  const specialRequests = [];
  if (extraBaggage) specialRequests.push('Extra Baggage');
  if (specialMeal) specialRequests.push('Special Meal');
  if (wheelchair) specialRequests.push('Wheelchair');
  if (flexibleDates) specialRequests.push('Flexible Dates');
  
  const specialRequestsText = specialRequests.length > 0 
    ? `\n\nSPECIAL REQUESTS:\n${specialRequests.map(r => `✓ ${r}`).join('\n')}`
    : '';
  
  const additionalText = additionalRequests 
    ? `\n\nADDITIONAL NOTES:\n${additionalRequests}`
    : '';
  
  // Create email body
  const emailBody = `
╔════════════════════════════════════════════════════════════╗
║          FLIGHT BOOKING REQUEST FORM                       ║
║          Fish ALHATEMI Travel Agent                        ║
╚════════════════════════════════════════════════════════════╝

TRIP TYPE: ${tripType}

FLIGHT DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
From: ${from}
To: ${to}
Departure Date: ${departureDate}
Return Date: ${returnDate || 'N/A'}

PASSENGER INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${adultsText}${childrenText}${infantsText}

CONTACT INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phone: ${phone}
Email: ${email}${specialRequestsText}${additionalText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Addis_Ababa' })}
  `;
  
  // Configure email transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'fishtravel45@gmail.com',
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER || 'fishtravel45@gmail.com',
    to: 'fishtravel45@gmail.com',
    replyTo: email,
    subject: `✈️ New Flight Booking Request - ${from} to ${to} | ${tripType}`,
    text: emailBody,
    html: `<pre style="font-family: monospace; font-size: 14px; line-height: 1.6;">${emailBody}</pre>`
  };

  try {
    // Check if email password is configured
    if (!process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your-app-password-here') {
      console.log('Email not configured. Booking details:');
      console.log(emailBody);
      res.json({ 
        success: true, 
        message: 'Booking request received! We will contact you shortly via phone or WhatsApp.' 
      });
    } else {
      await transporter.sendMail(mailOptions);
      res.json({ 
        success: true, 
        message: 'Your booking request has been sent successfully! We will contact you within 24 hours.' 
      });
    }
  } catch (error) {
    console.error('Email error:', error);
    console.log('Booking details:');
    console.log(emailBody);
    res.json({ 
      success: true, 
      message: 'Booking request received! We will contact you shortly. For urgent requests, please call +251 977 20 90 90' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Fish ALHATEMI Travel Agent server running on http://localhost:${PORT}`);
});
