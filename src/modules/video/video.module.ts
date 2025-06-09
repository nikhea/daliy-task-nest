import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { BullModule } from '@nestjs/bullmq';
import { VideoProcessor } from './video.worker';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'video',
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
        // removeOnComplete: 1000,
        // removeOnFail: 3000,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    }),
  ],
  providers: [VideoService, VideoProcessor],
  controllers: [VideoController],
})
export class VideoModule {}
