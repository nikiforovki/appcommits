import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Comment, Reply } from './types';

const rtkQueryApi = createApi({
  reducerPath: 'commentApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
  tagTypes: ['Comment'],
  endpoints: (builder) => ({
    getSomeData: builder.query<Comment[], void>({
      query: () => 'comments',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Comment' as const, id })),
              { type: 'Comment' as const, id: 'LIST' },
            ]
          : [{ type: 'Comment' as const, id: 'LIST' }],
    }),
    addCommit: builder.mutation<Comment, Partial<Comment>>({
      query: (body) => ({
        url: 'comments',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Comment' as const, id: 'LIST' }],
    }),
    deleteCommit: builder.mutation<void, string>({
      query: (id) => ({
        url: `comments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Comment' as const, id },
      ],
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
    addReply: builder.mutation<
      Comment,
      { commentId: string; author: string; text: string; timestamp: string }
    >({
      query: ({ commentId, author, text, timestamp }) => ({
        url: `comments/${commentId}/replies`,
        method: 'POST',
        body: {
          author,
          text,
          timestamp,
        },
      }),
      invalidatesTags: (result, error, { commentId }) => [
        { type: 'Comment' as const, id: commentId },
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
  useGetSomeDataQuery,
  useAddCommitMutation,
  useDeleteCommitMutation,
  useLikeCommentMutation,
  useUnlikeCommentMutation,
  useAddReplyMutation,
  useUpdateCommentMutation,
} = rtkQueryApi;
export default rtkQueryApi;

// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { Comment, Reply } from './types';

// const rtkQueryApi = createApi({
//   reducerPath: 'commentApi',
//   baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
//   tagTypes: ['Comment'],
//   endpoints: (builder) => ({
//     getSomeData: builder.query<Comment[], void>({
//       query: () => 'comments',
//       providesTags: (result) =>
//         result
//           ? [
//               ...result.map(({ id }) => ({ type: 'Comment' as const, id })),
//               { type: 'Comment' as const, id: 'LIST' },
//             ]
//           : [{ type: 'Comment' as const, id: 'LIST' }],
//     }),
//     addCommit: builder.mutation<Comment, Partial<Comment>>({
//       query: (body) => ({
//         url: 'comments',
//         method: 'POST',
//         body,
//       }),
//       invalidatesTags: [{ type: 'Comment' as const, id: 'LIST' }],
//     }),
//     deleteCommit: builder.mutation<void, string>({
//       query: (id) => ({
//         url: `comments/${id}`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: (result, error, id) => [
//         { type: 'Comment' as const, id },
//       ],
//     }),
//     likeComment: builder.mutation<Comment, string>({
//       query: (id) => ({
//         url: `comments/${id}`,
//         method: 'PATCH',
//         body: { liked: true },
//       }),
//       invalidatesTags: (result, error, id) => [
//         { type: 'Comment' as const, id },
//       ],
//     }),
//     unlikeComment: builder.mutation<Comment, string>({
//       query: (id) => ({
//         url: `comments/${id}`,
//         method: 'PATCH',
//         body: { liked: false },
//       }),
//       invalidatesTags: (result, error, id) => [
//         { type: 'Comment' as const, id },
//       ],
//     }),
//     addReply: builder.mutation<Comment, Partial<Reply>>({
//       query: (body) => ({
//         url: `comments/${body.commentId}/replies`,
//         method: 'POST',
//         body: {
//           author: body.author,
//           text: body.text,
//           timestamp: new Date().toISOString(),
//         },
//       }),
//       invalidatesTags: (result, error, { commentId }) => [
//         { type: 'Comment' as const, id: commentId },
//       ],
//     }),
//     updateComment: builder.mutation<Comment, Partial<Comment>>({
//       query: (body) => ({
//         url: `comments/${body.id}`,
//         method: 'PATCH',
//         body,
//       }),
//       invalidatesTags: (result, error, { id }) => [
//         { type: 'Comment' as const, id },
//       ],
//     }),
//   }),
// });

// export const {
//   useGetSomeDataQuery,
//   useAddCommitMutation,
//   useDeleteCommitMutation,
//   useLikeCommentMutation,
//   useUnlikeCommentMutation,
//   useAddReplyMutation,
//   useUpdateCommentMutation,
// } = rtkQueryApi;
// export default rtkQueryApi;
