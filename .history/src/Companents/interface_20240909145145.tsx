// export interface LoadingProps {
//   commentsCount: number;
//   newComment: string;
//   setNewComment: (text: string) => void;
//   toggleBoldFormatting: (id: string) => void;
//   toggleItalicFormatting: (id: string) => void;
//   toggleLinkFormatting: (id: string) => void;
//   handleAddComment: () => void;
// }

export interface LoadingProps {
  commentsCount: number;
  newComment: string;
  setNewComment: (value: string) => void;
  toggleBoldFormatting: (field: string) => void;
  toggleItalicFormatting: (field: string) => void;
  toggleLinkFormatting: (field: string) => void;
  handleAddComment: () => void;
}

export interface CommentProps {
  comment: Comment;
  replies: Reply[];
  handleDeleteComment: (id: string) => void;
  handleLikeOrUnlike: (id: string, action: 'like' | 'unlike') => void;
  handleReply: (commentId: string) => void;
  replyTo: string | null;
  setReplyTo: (id: string | null) => void;
  replyText: string;
  setReplyText: (text: string) => void;
}

export interface Comment {
  id: string;
  img: string;
  author: string;
  text: string;
  timestamp: string;
  liked: boolean;
  isbold: boolean;
  isItalic: boolean;
  isLink: boolean;
  color: string;
  replies: Reply[];
}

export interface Reply {
  id: string;
  img: string;
  author: string;
  text: string;
  timestamp: string;
  liked: boolean;
  isbold: boolean;
  isItalic: boolean;
  isLink: boolean;
  color: string;
  commentId: string;
  replies: Reply[];
}
