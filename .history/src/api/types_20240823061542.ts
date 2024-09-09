export interface Comment {
  id: string;
  img?: string;
  author: string;
  text: string;
  isBold: boolean;
  timestamp: string;
  liked: boolean;
  likes?: number;
  replies?: Reply[];
}

export interface Reply {
  id: string;
  img?: string;
  author: string;
  text: string;
  isBold: boolean;
  timestamp: string;
  liked: boolean;
  likes?: number;
  replies?: Reply[];
}
