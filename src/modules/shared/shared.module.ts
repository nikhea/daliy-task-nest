import { Global, Module } from '@nestjs/common';
import { PostsModule } from '../posts/posts.module';
import { CommentsModule } from '../comments/comments.module';

@Global()
@Module({
  imports: [PostsModule, CommentsModule],
  exports: [PostsModule, CommentsModule],
})
export class SharedModule {}
