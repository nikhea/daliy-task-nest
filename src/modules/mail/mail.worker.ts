/* eslint-disable no-case-declarations */

/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailService } from './mail.service';
import { Injectable, Logger } from '@nestjs/common';

@Processor('mails', { limiter: { duration: 1000, max: 4 } })
@Injectable()
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private readonly mailService: MailService) {
    super();
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.logger.log(`Processing email job: ${job.id}`);
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job) {
    this.logger.log(`Email job ${job.id}: ${job.progress}% completed`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Email job completed: ${job.id}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    this.logger.error(`Email job failed: ${job.id}`, err.stack);
    this.logger.error(`Attempt number: ${job.attemptsMade}`);
  }

  async process(job: Job): Promise<any> {
    switch (job.name) {
      case 'resetPassword':
        const { email, subject, html } = job.data as {
          email: string;
          subject: string;
          html: string;
        };
        await this.mailService.sendMail(email, subject, html);
        break;

      default:
        console.log(`Unknown job name: ${job.name}`);
        break;
    }
  }

  async runTaskWithProgress(job: Job) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log(job);
    return { status: 'success', message: 'Video processed successfully' };
  }
}
