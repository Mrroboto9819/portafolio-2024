import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  const JWT_SECRET = process.env.JWT_SECRET;
  const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
  const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
  const CONTACT_RECEIVER_EMAIL = process.env.CONTACT_RECEIVER_EMAIL;

  const { name, email, message } = await req.json();
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';

  if (!email || !name || !message) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  }

  const tokenCookie = req.cookies.get('contact_token')?.value;

  if (tokenCookie) {
    try {
      jwt.verify(tokenCookie, JWT_SECRET);
      return NextResponse.json({ message: 'You already sent a message. Please wait.' }, { status: 429 });
    } catch (err) {
      if (err.name !== 'TokenExpiredError') {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }
    }
  }

  const payload = new URLSearchParams({
    from: `${name} <contact@${MAILGUN_DOMAIN}>`,
    to: CONTACT_RECEIVER_EMAIL,
    subject: `New Contact from ${name}`,
    text: `From: ${email}\nIP: ${ip}\n\n${message}`,
  });

  const res = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: payload,
  });

  if (!res.ok) {
    return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
  }

  const newToken = jwt.sign({ email, ip }, JWT_SECRET, { expiresIn: '1h' });

  const response = NextResponse.json({ success: true });
  response.cookies.set('contact_token', newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 60 * 60, // 1 hour
    path: '/',
  });

  return response;
}
