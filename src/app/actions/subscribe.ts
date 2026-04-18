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
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #10B981;">Welcome to BeatFlow! 🎉</h2>
          <p>Hi there,</p>
          <p>Thanks for subscribing to our newsletter. You'll now receive fresh royalty-free tracks directly in your inbox weekly!</p>
          <p>Start finding your perfect soundtracks today.</p>
          <br/>
          <a href="https://beatflow.space" style="background-color: #10B981; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 999px; font-weight: bold; display: inline-block; margin-top: 10px;">Browse Free Tracks</a>
          <br/><br/>
          <p style="color: #666; font-size: 14px;">Stay inspired,<br/>The BeatFlow Team</p>
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
