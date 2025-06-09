/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/mail/mail.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;
  private readonly EMAIL_SERVICE = process.env.EMAIL_SERVICE;
  private readonly EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
  private readonly EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: this.EMAIL_SERVICE,
      auth: {
        user: this.EMAIL_ADDRESS,
        pass: this.EMAIL_PASSWORD,
      },
      //   debug: true,
      //   logger: true,
    });
  }

  async sendMail(to: string, subject: string, html: string | object) {
    try {
      const info = await this.transporter.sendMail({
        from: this.EMAIL_ADDRESS,
        to: 'imonikheaugbodaga@gmail.com',
        subject,
        html,
      });
      this.logger.log(`Email sent to ${to}: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }
}
