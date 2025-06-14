import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment, CommentSchema } from './schema/comments.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentRepository } from './repository/comments.repository';
// import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    CommentRepository,
    // {
    //   provide: ICommentsServiceToken,
    //   useExisting: CommentsService,
    // },
  ],
})
export class CommentsModule {}
