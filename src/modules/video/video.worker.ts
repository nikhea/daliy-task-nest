import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('video', { concurrency: 3 })
export class VideoProcessor extends WorkerHost {
  @OnWorkerEvent('active')
  onAdded(job: Job) {
    // console.log(`Processing actived video: ${job.id}`, job.data);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    // console.log(`Video processed completed: ${job.id}`, job.data);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    console.log(`Video processed failed: ${job.id}`);
    console.log(`Video processed Attempt Number: ${job.attemptsMade}`);
  }

  async process(job: Job): Promise<any> {
    console.log(`Processing video: ${job.id}`, job.data);
    // Simulate video processing
    await new Promise((resolve) => setTimeout(resolve, 5000));
    throw new Error('');

    // return { status: 'success', message: 'Video processed successfully' };
  }
}
