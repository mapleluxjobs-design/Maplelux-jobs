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
    if (formattedPhone.startsWith('0')) formattedPhone = '254' + formattedPhone.substring(1);
    else if (formattedPhone.startsWith('7') || formattedPhone.startsWith('1')) formattedPhone = '254' + formattedPhone;

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
    res.status(500).json({ error: error.response?.data?.errorMessage || "Error" });
  }
});

app.post('/api/mpesa/callback', (req, res) => {
  const callbackData = req.body.Body.stkCallback;
  const checkoutId = callbackData.CheckoutRequestID;
  const resultCode = callbackData.ResultCode;

  if (resultCode === 0) paymentStatus[checkoutId] = { status: 'success' };
  else paymentStatus[checkoutId] = { status: 'failed', reason: callbackData.ResultDesc };

  res.json({ ResultCode: 0, ResultDesc: 'Success' });
});

app.get('/api/mpesa/status/:id', (req, res) => {
  res.json(paymentStatus[req.params.id] || { status: 'not_found' });
});

app.post('/api/send-email', async (req, res) => {
  const { to, name, jobTitle, date, time, missingDocs } = req.body;

  let missingDocsMessage = '';
  if (missingDocs && missingDocs.length > 0) {
    const docListHTML = missingDocs.map(doc => `<li style="margin-bottom: 5px;"><strong>${doc}</strong></li>`).join('');
    missingDocsMessage = `
      <div style="background: #fff8ec; border: 1px solid #ffe1b3; padding: 20px; border-radius: 12px; margin-top: 20px;">
        <h4 style="margin-top: 0; color: #8a5300;">Documents you are missing:</h4>
        <ul style="color: #8a5300; margin-bottom: 0; padding-left: 20px;">${docListHTML}</ul>
      </div>
    `;
  } else if (missingDocs && missingDocs.length === 0) {
    missingDocsMessage = `
      <div style="background: #e5f3ee; border: 1px solid #cbe6dc; padding: 20px; border-radius: 12px; margin-top: 20px;">
        <h4 style="margin-top: 0; color: #1e6f5c;">You have all required documents!</h4>
      </div>
    `;
  }

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e6f5c;">Appointment Confirmed</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Your interview for <strong>${jobTitle}</strong> is booked for <strong>${date} at ${time}</strong>.</p>
      <p><strong>Location:</strong> Rainbow Tower, 2nd Floor, 32 Muthithi Rd, Nairobi</p>
      ${missingDocsMessage}
      <p>MapleLux Jobs Team</p>
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
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Backend running on http://localhost:${process.env.PORT}`);
});