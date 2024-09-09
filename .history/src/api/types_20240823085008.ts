export interface Comment {
  id: string;
  img: string;
  author: string;
  text: string;
  timestamp: string;
  liked: boolean;
  isBold: boolean;
  isItalic: boolean;
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
  replies: Reply[];
}

commentId: string;
