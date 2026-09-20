import nodemailer from "nodemailer";

// Server-side only — never import this from a "use client" file, since Gmail
// credentials and app passwords must stay on the server.
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailAppPassword) {
    console.warn("GMAIL_USER or GMAIL_APP_PASSWORD is not set; skipping email send.");
    return false;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"MAPOLY CS Notices" <${gmailUser}>`,
      to,
      subject,
      html,
    });

    console.log(`Email sent via Gmail SMTP to ${to}: ${info.messageId}`);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Gmail SMTP send to ${to} failed:`, message);
    return false;
  }
}