import { CreatePostDto } from '../../modules/posts/dto/create-post.dto';

export const IPostServiceToken = Symbol('IPostService');

export interface IPostService {
  getPostById(
    userId: string,
  ): Promise<{ message: string; statusCode: string; data: CreatePostDto }>;
}
