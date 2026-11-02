const express = require('express');
const axios = require('axios');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const paymentStatus = {}; 

// ==========================================
// SMART EMAIL CONFIGURATION
// ==========================================
let useGmail = false;
let transporter;
let resend;

if (process.env.EMAIL_USER) {
  useGmail = true;
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  console.log("📧 Using Gmail for local email sending");
} else {
  resend = new Resend(process.env.RESEND_API_KEY);
  console.log("📧 Using Resend for live email sending");
}

// --- M-PESA CONFIGURATION ---
const MPESA_BASE_URL = 'https://sandbox.safaricom.co.ke'; 

async function getAccessToken() {
  const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
  const res = await axios.get(`${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` }
  });
  return res.data.access_token;
}

app.post('/api/mpesa/stkpush', async (req, res) => {
  const { phone, amount } = req.body;
  try {
    const token = await getAccessToken();
    
    const eatTime = new Date(Date.now() + 3 * 60 * 60 * 1000);
    const timestamp = eatTime.toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
    
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');
    
    let formattedPhone = phone.replace(/\D/g, ''); 
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith('7') || formattedPhone.startsWith('1')) {
      formattedPhone = '254' + formattedPhone;
    }

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.ceil(amount),
        PartyA: formattedPhone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: 'MapleLuxJobs',
        TransactionDesc: 'Registration Fee'
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const checkoutId = response.data.CheckoutRequestID;
    paymentStatus[checkoutId] = { status: 'pending' };

    res.json(response.data);
  } catch (error) {
    console.error("--- SAFARICOM EXACT ERROR ---");
    console.error(JSON.stringify(error.response?.data, null, 2));
    const errorMessage = error.response?.data?.errorMessage || "Check VS Code terminal for exact error";
    res.status(500).json({ error: errorMessage });
  }
});

app.post('/api/mpesa/callback', (req, res) => {
  console.log('--- M-PESA CALLBACK RECEIVED ---');
  const callbackData = req.body.Body.stkCallback;
  const checkoutId = callbackData.CheckoutRequestID;
  const resultCode = callbackData.ResultCode;

  if (resultCode === 0) {
    paymentStatus[checkoutId] = { status: 'success' };
    console.log(`✅ Payment Successful for ${checkoutId}`);
  } else {
    paymentStatus[checkoutId] = { status: 'failed', reason: callbackData.ResultDesc };
    console.log(`❌ Payment Failed for ${checkoutId}: ${callbackData.ResultDesc}`);
  }

  res.json({ ResultCode: 0, ResultDesc: 'Success' });
});

app.get('/api/mpesa/status/:id', (req, res) => {
  const checkoutId = req.params.id;
  const status = paymentStatus[checkoutId] || { status: 'not_found' };
  res.json(status);
});

// --- CLIENT CONFIRMATION EMAIL (Sent manually by Admin) ---
app.post('/api/send-email', async (req, res) => {
  const { to, name, jobTitle, date, time, missingDocs, officeLocation } = req.body;

  let missingDocsMessage = '';
  
  if (missingDocs && missingDocs.length > 0) {
    const docListHTML = missingDocs.map(doc => `<li style="margin-bottom: 5px;"><strong>${doc}</strong></li>`).join('');
    missingDocsMessage = `
      <div style="background: #fff8ec; border: 1px solid #ffe1b3; padding: 20px; border-radius: 12px; margin-top: 20px;">
        <h4 style="margin-top: 0; color: #8a5300;">Documents you are missing:</h4>
        <p style="color: #8a5300; font-size: 0.9rem;">Don't worry! Our experts will guide you on how to obtain these during your appointment.</p>
        <ul style="color: #8a5300; margin-bottom: 0; padding-left: 20px;">${docListHTML}</ul>
      </div>
    `;
  } else if (missingDocs && missingDocs.length === 0) {
    missingDocsMessage = `
      <div style="background: #e5f3ee; border: 1px solid #cbe6dc; padding: 20px; border-radius: 12px; margin-top: 20px;">
        <h4 style="margin-top: 0; color: #1e6f5c;">You have all required documents!</h4>
        <p style="color: #1e6f5c; font-size: 0.9rem; margin-bottom: 0;">Excellent! Please bring all of them to our office for verification.</p>
      </div>
    `;
  }

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a2b3c; line-height: 1.6;">
      <h2 style="color: #1e6f5c;">Your Appointment is Confirmed!</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Thank you for your payment. Your in-person interview for <strong>${jobTitle}</strong> has been successfully booked.</p>
      
      <div style="background: #f9fdfb; border: 1px solid #e2f0ea; padding: 20px; border-radius: 12px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #0b2b26; border-bottom: 1px solid #e2f0ea; padding-bottom: 10px;">Appointment Details</h3>
        <p style="margin: 10px 0;"><strong>Date:</strong> ${date}</p>
        <p style="margin: 10px 0;"><strong>Time:</strong> ${time}</p>
        <p style="margin: 10px 0;"><strong>Location:</strong> ${officeLocation}</p>
      </div>

      <div style="background: #ffffff; border-left: 4px solid #1e6f5c; padding: 15px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.02);">
        <h4 style="margin-top: 0; color: #0b2b26;">What to bring with you:</h4>
        <ul style="margin: 0; padding-left: 20px; color: #4b6560;">
          <li>Your physical Passport or National ID.</li>
          <li>A digital or printed copy of this confirmation email (as proof of payment).</li>
          <li>Your updated CV and any educational certificates.</li>
        </ul>
      </div>

      ${missingDocsMessage}

      <p style="margin-top: 30px; font-size: 0.9rem; color: #6b8f86;">If you need to reschedule, please reply directly to this email at least 24 hours before your appointment.</p>
      <br>
      <p style="margin: 0; font-weight: bold; color: #1e6f5c;">MapleLux Jobs Team</p>
    </div>
  `;

  try {
    if (useGmail) {
      await transporter.sendMail({
        from: `"MapleLux Jobs" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: `Appointment Confirmed: ${jobTitle}`,
        html: emailHtml
      });
    } else {
      const { error } = await resend.emails.send({
        from: 'MapleLux Jobs <onboarding@resend.dev>',
        to: [to],
        subject: `Appointment Confirmed: ${jobTitle}`,
        html: emailHtml,
      });
      if (error) throw new Error(error.message);
    }
    res.json({ success: true, message: 'Email sent' });
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

// --- ADMIN ALERT (When client clicks "I Have Paid") ---
app.post('/api/send-admin-alert', async (req, res) => {
  const { name, email, phone, jobTitle, date, time, country, officeLocation } = req.body;

  const adminEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a2b3c;">
      <h2 style="color: #d63031;">🚨 Action Required: Verify Payment</h2>
      <p>A client has clicked "I Have Paid" for a manual payment. Please check your ${country === 'Uganda' ? 'MTN' : 'Sendwave'} account for the funds.</p>
      
      <div style="background: #f9fdfb; border: 1px solid #e2f0ea; padding: 20px; border-radius: 12px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Client Details</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Job Applied:</strong> ${jobTitle}</p>
        <p><strong>Appointment:</strong> ${date} at ${time}</p>
        <p><strong>Office:</strong> ${officeLocation}</p>
      </div>

      <p>Once you have verified the payment, click the button below to send the official confirmation email to the client:</p>
      <a href="mailto:${email}?subject=Appointment Confirmed: ${jobTitle}&body=Hi ${name}, we have verified your payment. Your interview is confirmed for ${date} at ${time} at ${officeLocation}." style="display: inline-block; background: #1e6f5c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">
        Send Confirmation Email
      </a>
    </div>
  `;

  try {
    if (useGmail) {
      await transporter.sendMail({
        from: `"MapleLux System" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, // Send to yourself
        subject: `🚨 Verify Payment: ${name} (${country})`,
        html: adminEmailHtml
      });
    } else {
      await resend.emails.send({
        from: 'MapleLux System <onboarding@resend.dev>',
        to: [process.env.EMAIL_USER || 'briandefirmino@gmail.com'], // Your Resend email
        subject: `🚨 Verify Payment: ${name} (${country})`,
        html: adminEmailHtml,
      });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Backend running on http://localhost:${process.env.PORT}`);
});