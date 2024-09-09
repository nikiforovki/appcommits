import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Comment, Reply } from './types';

const rtkQueryApi = createApi({
  reducerPath: 'commentApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  tagTypes: ['Comment', 'Reply'],
  endpoints: (builder) => ({
    getComments: builder.query<Comment[], void>({
      query: () => 'comments',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Comment' as const, id })),
              { type: 'Comment' as const, id: 'LIST' },
            ]
          : [{ type: 'Comment' as const, id: 'LIST' }],
    }),
    getReplies: builder.query<Reply[], void>({
      query: () => 'replies',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Reply' as const, id })),
              { type: 'Reply' as const, id: 'LIST' },
            ]
          : [{ type: 'Reply' as const, id: 'LIST' }],
    }),
    addComment: builder.mutation<Comment, Partial<Comment>>({
      query: (body) => ({
        url: 'comments',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Comment' as const, id: 'LIST' }],
    }),
    addReply: builder.mutation<Reply, Partial<Reply>>({
      query: (body) => ({
        url: 'replies',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Reply' as const, id: 'LIST' }],
    }),
    deleteComment: builder.mutation<void, string>({
      query: (id) => ({
        url: `comments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Comment' as const, id },
      ],
    }),
    deleteReply: builder.mutation<void, string>({
      query: (id) => ({
        url: `replies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Reply' as const, id }],
    }),
    likeComment: builder.mutation<Comment, string>({
      query: (id) => ({
        url: `comments/${id}`,
        method: 'PATCH',
        body: { liked: true },
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Comment' as const, id },
      ],
    }),
    unlikeComment: builder.mutation<Comment, string>({
      query: (id) => ({
        url: `comments/${id}`,
        method: 'PATCH',
        body: { liked: false },
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Comment' as const, id },
      ],
    }),
    updateComment: builder.mutation<Comment, Partial<Comment>>({
      query: (body) => ({
        url: `comments/${body.id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Comment' as const, id },
      ],
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useGetRepliesQuery,
  useAddCommentMutation,
  useAddReplyMutation,
  useDeleteCommentMutation,
  useDeleteReplyMutation,
  useLikeCommentMutation,
  useUnlikeCommentMutation,
  useUpdateCommentMutation,
} = rtkQueryApi;
export default rtkQueryApi;
