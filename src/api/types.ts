export interface Comment {
  id: string;
  img: string;
  author: string;
  text: string;
  timestamp: string;
  liked: boolean;
  isBold: boolean;
  isItalic: boolean;
  isLink: boolean;
  replies: Reply[];
}

export interface Reply {
  id: string;
  img: string;
  author: string;
  text: string;
  timestamp: string;
  liked: boolean;
  isBold: boolean;
  isItalic: boolean;
  isLink: boolean;
  commentId: string;
  replies: Reply[];
}
