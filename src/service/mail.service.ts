import nodemailer from 'nodemailer';
import {mailConfig} from '../database/config'
  const mailService = {
    async sendMail (emailTo: any, subject: string, html: string) {
      const transporter = nodemailer.createTransport(mailConfig);
  
      transporter.sendMail({
        from: process.env.MAIL_USER,
        to: emailTo,
        subject,
        html: html || ''
      }, (err: any, info: any) => {
        if (err) {
          console.log(err);
          throw new Error('Error');
        }
      }
      );
    }
  }

export default mailService;