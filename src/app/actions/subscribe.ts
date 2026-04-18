'use server';

import connectToDatabase from '@/lib/mongoose';
import { Subscriber } from '@/models/Subscriber';
import nodemailer from 'nodemailer';

export async function subscribe(formData: FormData) {
  const email = formData.get('email');

  if (!email || typeof email !== 'string') {
    return { error: 'Valid email is required', success: false };
  }

  try {
    await connectToDatabase();

    // Check if already subscribed
    const existing = await Subscriber.findOne({ email: email.toLowerCase() });

    if (existing) {
      return { error: 'You are already subscribed!', success: false };
    }

    await Subscriber.create({ email });

    // Send confirmation email
    await sendConfirmationEmail(email.toLowerCase());

    return { success: true, message: 'Thanks for subscribing! Check your email.' };
  } catch (error: any) {
    // MongoDB duplicate key error
    if (error.code === 11000) {
      return { error: 'You are already subscribed!', success: false };
    }
    console.error('Subscription error:', error);
    return { error: 'Failed to subscribe. Please try again.', success: false };
  }
}

async function sendConfirmationEmail(userEmail: string) {
  try {
    // Generate a test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // In production, replace with real SMTP credentials from env vars
    let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.ethereal.email",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true' || false,
      auth: {
        user: process.env.SMTP_USER || testAccount.user,
        pass: process.env.SMTP_PASS || testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: '"BeatFlow Music" <hello@beatflow.space>',
      to: userEmail,
      subject: "Thanks for Subscribing! 🎵",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background:#111; color:#fff; border-radius:16px; overflow:hidden; border:1px solid #222;">
      
      <!-- Header -->
      <div style="text-align:center; padding:30px 20px; background:linear-gradient(135deg,#111,#0f172a);">
        <img src="https://beatflow.space/icon.png" alt="BeatFlow Logo" width="70" height="70" style="border-radius:18px; margin-bottom:15px;" />
        <h1 style="margin:0; font-size:28px; color:#10B981;">BeatFlow</h1>
        <p style="margin:8px 0 0; color:#aaa;">Royalty-Free Music for Creators</p>
      </div>

      <!-- Body -->
      <div style="padding:35px 25px;">
        <h2 style="color:#10B981; margin-top:0;">Welcome to BeatFlow 🎉</h2>

        <p style="font-size:16px; line-height:1.7; color:#ddd;">
          Hi there,
        </p>

        <p style="font-size:16px; line-height:1.7; color:#ddd;">
          Thanks for subscribing to our newsletter. You'll now receive fresh royalty-free tracks directly in your inbox weekly.
        </p>

        <p style="font-size:16px; line-height:1.7; color:#ddd;">
          Discover music for YouTube videos, reels, podcasts, vlogs, ads, and more.
        </p>

        <div style="text-align:center; margin:35px 0;">
          <a href="https://beatflow.space"
             style="background:#10B981; color:#000; padding:14px 28px; text-decoration:none; border-radius:999px; font-weight:bold; display:inline-block; font-size:16px;">
             Browse Free Tracks
          </a>
        </div>

        <p style="font-size:15px; color:#aaa; line-height:1.6;">
          Stay inspired,<br/>
          <strong style="color:#10B981;">The BeatFlow Team</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="padding:20px; text-align:center; border-top:1px solid #222; color:#777; font-size:13px;">
        © 2026 BeatFlow • Legal Royalty-Free Audio <br/>
        <a href="https://beatflow.space" style="color:#10B981; text-decoration:none;">beatflow.space</a>
      </div>

    </div>
  `,
    });

    console.log("Confirmation Email sent: %s", info.messageId);

    // Preview URL only available when sending through an Ethereal test account
    if (!process.env.SMTP_HOST) {
      console.log("EMAIL PREVIEW URL: %s", nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
