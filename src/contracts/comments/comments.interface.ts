/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
export const ICommentsServiceToken = Symbol('ICommentsService');

export interface ICommentsService {
  getPostComments(
    postId: string,
  ): Promise<{ _id: string; userId: string } | any>;
}
