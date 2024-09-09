import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Comment, Reply } from './types.ts'; // Предполагается, что у вас есть определение типов Comment и Reply

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
    // Изменяем мутацию toggleLikeComment на две отдельные мутации для лайка и антилайка
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
    addReply: builder.mutation<Comment, Partial<Reply>>({
      query: (body) => ({
        url: `comments/${body.commentId}/replies`,
        method: 'POST',
        body: {
          author: body.author,
          text: body.text,
          timestamp: new Date().toISOString(),
        },
      }),
      invalidatesTags: (result, error, { commentId }) => [
        { type: 'Comment' as const, id: commentId },
      ],
    }),
  }),
});

export const {
  useGetSomeDataQuery,
  useAddCommitMutation,
  useDeleteCommitMutation,
  useLikeCommentMutation, // Изменяем имя экспортированной мутации
  useUnlikeCommentMutation, // Добавляем новую мутацию
  useAddReplyMutation,
} = rtkQueryApi;
export default rtkQueryApi;

// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { Comment, Reply } from './types'; // Предполагается, что у вас есть определение типов Comment и Reply
//
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
//     toggleLikeComment: builder.mutation<Comment, string>({
//       query: (id) => ({
//         url: `comments/${id}`,
//         method: 'PATCH',
//         body: { liked: true }, // или false, в зависимости от текущего состояния
//       }),
//       invalidatesTags: (result, error, id) => [
//         { type: 'Comment' as const, id },
//       ],
//     }),
//     addReply: builder.mutation<Comment, Partial<Reply>>({
//       query: (body) => ({
//         url: `comments/${body.commentId}/replies`,
//         method: 'POST', // Используйте POST для добавления нового ответа
//         body: {
//           author: body.author,
//           text: body.text,
//           timestamp: new Date().toISOString(), // Убедитесь, что формат даты соответствует ожидаемому сервером
//         },
//       }),
//       invalidatesTags: (result, error, { commentId }) => [
//         { type: 'Comment' as const, id: commentId },
//       ],
//     }),
//   }),
// });
//
// export const {
//   useGetSomeDataQuery,
//   useAddCommitMutation,
//   useDeleteCommitMutation,
//   useToggleLikeCommentMutation,
//   useAddReplyMutation, // Экспортируем новую мутацию
// } = rtkQueryApi;
// export default rtkQueryApi;
///Rabotet Delet

// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { Comment } from './types'; // Предполагается, что у вас есть определение типа Comment
//
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
//     toggleLikeComment: builder.mutation<Comment, string>({
//       query: (id) => ({
//         url: `comments/${id}/like`,
//         method: 'POST',
//       }),
//       invalidatesTags: (result, error, id) => [
//         { type: 'Comment' as const, id },
//       ],
//     }),
//   }),
// });
//
// export const {
//   useGetSomeDataQuery,
//   useAddCommitMutation,
//   useDeleteCommitMutation,
//   useToggleLikeCommentMutation,
// } = rtkQueryApi;
// export default rtkQueryApi;

// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
//
// const rtkQueryApi = createApi({
//   reducerPath: 'commentApi',
//   baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
//   tagTypes: ['Comment'],
//   endpoints: (builder) => ({
//     getSomeData: builder.query({
//       query: () => 'comments',
//       providesTags: (result) =>
//         result
//           ? [
//               ...result.map(({ id }) => ({ type: 'Comment', id })),
//               { type: 'Comment', id: 'LIST' },
//             ]
//           : [{ type: 'Comment', id: 'LIST' }],
//     }),
//     addCommit: builder.mutation({
//       query: (body) => ({
//         url: 'comments',
//         method: 'POST',
//         body,
//       }),
//       invalidatesTags: [{ type: 'Comment', id: 'LIST' }],
//     }),
//     deleteCommit: builder.mutation({
//       query: (id) => ({
//         url: `comments/${id}`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: (result, error, id) => [{ type: 'Comment', id }],
//     }),
//     toggleLikeComment: builder.mutation({
//       query: (id) => ({
//         url: `comments/${id}/like`,
//         method: 'POST',
//       }),
//       invalidatesTags: (result, error, id) => [{ type: 'Comment', id }],
//     }),
//   }),
// });
//
// export const {
//   useGetSomeDataQuery,
//   useAddCommitMutation,
//   useDeleteCommitMutation,
//   useToggleLikeCommentMutation,
// } = rtkQueryApi;
// export default rtkQueryApi;

// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
//
// const rtkQueryApi = createApi({
//   reducerPath: 'commentApi',
//   baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
//   endpoints: (builder) => ({
//     getSomeData: builder.query({
//       query: () => 'comments',
//     }),
//     addCommit: builder.mutation({
//       query: (body) => ({
//         url: 'comments',
//         methods: 'POST',
//         body,
//       }),
//     }),
//   }),
// });
//
// export const { apiRef, useGetSomeDataQuery, useAddCommitMutation } =
//   rtkQueryApi;
// export default rtkQueryApi;
