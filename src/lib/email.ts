import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import path from 'path';
import { ENV } from './env';

const siteUrl = ENV.SITE_URL;

const mailGenerator = new Mailgen({
  theme: {
    path: path.join(process.cwd(), 'node_modules/mailgen/themes/default/index.html'),
    plaintextPath: path.join(process.cwd(), 'node_modules/mailgen/themes/default/index.txt'),
  },
  product: {
    name: 'Shree Shyam Precision',
    link: siteUrl,
    copyright: `Copyright © ${new Date().getFullYear()} Shree Shyam Precision. All rights reserved.`,
  },
});

const transporter = nodemailer.createTransport({
  host: ENV.SMTP_HOST,
  port: ENV.SMTP_PORT,
  secure: false,
  auth: {
    user: ENV.SMTP_USER,
    pass: ENV.SMTP_PASS,
  },
});

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const GREEN = '#22BC66';

export async function sendContactNotification(data: ContactFormData): Promise<void> {
  const emailContent = mailGenerator.generate({
    body: {
      name: 'Shree Shyam Precision Team',
      title: `New Contact Form Submission`,
      intro: [
        `You have received a new inquiry from ${data.name}.`,
        `Here are the details:`,
      ],
      table: {
        data: [
          { 'Full Name': data.name },
          { 'Email Address': data.email },
          { 'Subject': data.subject },
        ],
      },
      action: {
        instructions: `Message from ${data.name}:`,
        button: {
          color: GREEN,
          text: `Reply to ${data.name}`,
          link: `mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject)}`,
        },
      },
      outro: [
        `---`,
        data.message,
        `---`,
        `You can reply directly to this email to respond to the sender.`,
      ],
    },
  });

  await transporter.sendMail({
    from: `"Shree Shyam Precision Contact" <${ENV.SMTP_USER}>`,
    to: ENV.CONTACT_EMAIL,
    subject: `New Inquiry: ${data.subject} from ${data.name}`,
    html: emailContent,
    replyTo: data.email,
  });
}

export async function sendSubmissionAcknowledgment(data: ContactFormData): Promise<void> {
  const emailContent = mailGenerator.generate({
    body: {
      name: data.name,
      title: 'Thank You for Reaching Out!',
      intro: [
        `We have successfully received your inquiry and wanted to let you know that it is now with our team.`,
        `Here is a summary of what you submitted:`,
      ],
      table: {
        data: [
          { 'Subject': data.subject },
          { 'Message': data.message },
        ],
      },
      action: {
        instructions: `We will review your inquiry and get back to you at ${data.email} as soon as possible.`,
        button: {
          color: GREEN,
          text: 'Visit Our Website',
          link: siteUrl,
        },
      },
      outro: [
        `If you have any urgent concerns, feel free to call us at +91 9728797360.`,
        `Thank you for choosing Shree Shyam Precision.`,
      ],
    },
  });

  await transporter.sendMail({
    from: `"Shree Shyam Precision" <${ENV.SMTP_USER}>`,
    to: data.email,
    subject: `Thank You for Contacting Shree Shyam Precision`,
    html: emailContent,
  });
}
