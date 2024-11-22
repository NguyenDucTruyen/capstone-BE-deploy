import env from 'dotenv';
env.config();
export  const mailConfig = {
  service: process.env.MAIL_SERVICE,
  auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
  }
  };