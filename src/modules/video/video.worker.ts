/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-base-to-string */
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
//  { concurrency: 3 }
// { limiter: { duration: 1000, max: 4 } }
@Processor('video', { concurrency: 3 })
export class VideoProcessor extends WorkerHost {
  @OnWorkerEvent('active')
  onAdded(job: Job) {
    console.log(`Processing actived video: ${job.id}`, job.data);
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job) {
    console.log(`Video with: ${job.id}, ${job.progress}% completed`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Video processed completed: ${job.id}`, job.data);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    console.log(`Video processed failed: ${job.id}`);
    console.log(`Video processed Attempt Number: ${job.attemptsMade}`);
  }

  async process(job: Job): Promise<any> {
    const totalSteps = 5;

    switch (job.name) {
      case 'processVideo':
        console.log('starting process');
        await this.runTaskWithProgress(job, totalSteps);
        break;
      case 'compressVideo':
        console.log('starting compress');
        await this.runTaskWithProgress(job, totalSteps);
        break;

      default:
        console.log(`Unknown job name: ${job.name}`);
        break;
    }
  }
  async runTaskWithProgress(job: Job, totalSteps: number) {
    for (let step = 0; step <= totalSteps; step++) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const progress = Math.round((step / totalSteps) * 100);
      await job.updateProgress(progress);
    }
    // console.log(`Processing video: ${job.id}`, job.data);
    // Simulate video processing
    // throw new Error('file corrupted');
    return { status: 'success', message: 'Video processed successfully' };
  }
}
