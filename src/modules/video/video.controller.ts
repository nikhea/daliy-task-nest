import { InjectQueue } from '@nestjs/bullmq';
import { Controller, Post } from '@nestjs/common';
import { Queue } from 'bullmq';

@Controller('video')
export class VideoController {
  constructor(@InjectQueue('video') private readonly videoQueue: Queue) {}
  @Post('process')
  async processVideo() {
    await this.videoQueue.add('processVideo', {
      fileName: 'winter',
      formate: 'mp4',
    });
    return {
      message: 'Video processing started',
      status: 'success',
    };
  }
}
