import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostRepository } from './repository/posts.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schema/posts.schema';
import { IPostServiceToken } from '../../contracts/posts/post.interface';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],

  controllers: [PostsController],
  providers: [
    PostsService,
    PostRepository,
    {
      provide: IPostServiceToken,
      useExisting: PostsService,
    },
  ],
  exports: [IPostServiceToken, PostsService],
})
export class PostsModule {}
