import React, { useState, useEffect } from 'react';
import {
  useGetCommentsQuery,
  useGetRepliesQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useDeleteReplyMutation,
  useLikeCommentMutation,
  useUnlikeCommentMutation,
  useAddReplyMutation,
  useUpdateCommentMutation,
} from './../api/rtkQuery';
import CommentComponent from './CommentComponent';
import LoadingComponent from './LoadingComponent';
import styled from 'styled-components';
import { Comment } from './interface';

const StyledContainer = styled.div<{ commentsCount: number }>`
  width: 600px;
  height: ${(props) => `${props.commentsCount * 300}px`};
  min-height: 671px;
  position: absolute;
  top: 79px;
  left: 261px;
  border-radius: 8px;
  font-size: 28px;
  background-color: #ffffff;
  color: #0e0d0d;
`;

const StyledTitle = styled.div`
  font-family: SourceSansPro-Black;
  font-weight: 600;
  font-size: 28px;
  margin-top: 30px;
  margin-left: 30px;
  color: black;
`;

const StyledCommentBorder = styled.div`
  width: 500px;
  height: 254px;
  margin-top: 20px;
  margin-left: 30px;
  margin-right: 30px;
  margin-bottom: 40px;
  border-radius: 8px;
  border: 1px solid blue;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  color: #333;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledUserContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const StyledName = styled.div`
  font-family: SourceSansPro-Black;
  font-weight: 600;
  font-size: 20px;
  position: relative;
  font-size: 20px;
  color: #101010;
`;

const StyledTextarea = styled.textarea<{
  isBold?: boolean;
  isItalic?: boolean;
  isLink?: boolean;
}>`
  font-size: 16px;
  font-weight: ${({ isBold }) => (isBold ? 'bold' : 'normal')};
  font-style: ${({ isItalic }) => (isItalic ? 'italic' : 'normal')};
  text-decoration: ${({ isLink }) => (isLink ? 'underline' : 'none')};
  height: 84px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  word-break: break-all;
  white-space: pre-wrap;
  resize: none;
  &:focus {
    border-color: #007bff;
  }
`;

const StyledLine = styled.div`
  width: 100%;
  height: 2px;
  border-top: 1px solid #000000;
  margin-top: 15px;
`;

const IconsAndButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 27px;
`;

const StyledButtonComment = styled.button`
  width: 108px;
  height: 44px;
  background-color: #0089ff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  margin-left: 300px;
  &:hover {
    background-color: #0056b3;
  }
`;

const MainLayout: React.FC = () => {
  const [newComment, setNewComment] = useState('');
  const {
    data: comments = [],
    isLoading: isCommentsLoading,
    refetch: refetchComments,
  } = useGetCommentsQuery();
  const {
    data: replies = [],
    isLoading: isRepliesLoading,
    refetch: refetchReplies,
  } = useGetRepliesQuery();
  const [addComment, { isError }] = useAddCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [deleteReply] = useDeleteReplyMutation();
  const [likeComment] = useLikeCommentMutation();
  const [unlikeComment] = useUnlikeCommentMutation();
  const [addReply] = useAddReplyMutation();
  const [updateComment] = useUpdateCommentMutation();
  const [commentsCount, setCommentsCount] = useState(0);
  const [replyText, setReplyText] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [textFormatting, setTextFormatting] = useState<{
    [key: string]: { isBold: boolean; isItalic: boolean; isLink: boolean };
  }>({});
  const [isLocalLoading, setIsLocalLoading] = useState(true);

  useEffect(() => {
    setCommentsCount(comments.length);
    if (!isCommentsLoading && !isRepliesLoading) {
      setIsLocalLoading(false);
    }
  }, [comments, isCommentsLoading, replies, isRepliesLoading]);

  const handleAddComment = async () => {
    if (newComment) {
      try {
        const commitData: Partial<Comment> = {
          id: Date.now().toString(),
          img: '/img/IconMan.svg',
          author: 'John Doe',
          text: newComment,
          timestamp: new Date().toISOString(),
          liked: false,
          isBold: textFormatting['newComment']?.isBold || false,
          isItalic: textFormatting['newComment']?.isItalic || false,
          isLink: textFormatting['newComment']?.isLink || false,
          replies: [],
        };
        await addComment(commitData).unwrap();
        setNewComment('');
        refetchComments();
      } catch (error) {
        console.error('Не удалось добавить коммит: ', error);
      }
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      await deleteComment(id).unwrap();
      replies.forEach(async (reply) => {
        if (reply.commentId === id) {
          await deleteReply(reply.id).unwrap();
        }
      });
      refetchComments();
      refetchReplies();
    } catch (error) {
      console.error('Не удалось удалить коммит: ', error);
    }
  };

  const handleLikeOrUnlike = async (id: string, action: 'like' | 'unlike') => {
    try {
      const commentIndex = comments.findIndex((c) => c.id === id);
      if (commentIndex !== -1) {
        let newLikedState = comments[commentIndex].liked;
        if (action === 'like') {
          newLikedState = true;
          await likeComment(id).unwrap();
        } else if (action === 'unlike') {
          newLikedState = false;
          await unlikeComment(id).unwrap();
        }
        const updatedData = [...comments];
        updatedData[commentIndex] = {
          ...updatedData[commentIndex],
          liked: newLikedState,
        };
        refetchComments();
      }
    } catch (error) {
      if (
        error instanceof Error &&
        'status' in error &&
        typeof error.status === 'number' &&
        error.status === 404
      ) {
        console.error(`Комментарий ${id} не найден`);
      } else {
        console.error(
          `${action === 'like' ? 'Лайк' : 'Антилайк'} не удалось: `,
          error,
        );
      }
    }
  };

  const handleReply = async (commentId: string) => {
    if (replyText) {
      try {
        const replyData = {
          author: 'John Doe',
          text: replyText,
          timestamp: new Date().toISOString(),
        };
        await addReply({ commentId, ...replyData }).unwrap();
        setReplyText('');
        setReplyTo(null);
        refetchReplies();
      } catch (error) {
        console.error('Failed to add reply:', error);
      }
    }
  };

  const toggleBoldFormatting = (id: string) => {
    setTextFormatting((prevFormatting) => ({
      ...prevFormatting,
      [id]: {
        ...prevFormatting[id],
        isBold: !prevFormatting[id]?.isBold,
      },
    }));
  };

  const toggleItalicFormatting = (id: string) => {
    setTextFormatting((prevFormatting) => ({
      ...prevFormatting,
      [id]: {
        ...prevFormatting[id],
        isItalic: !prevFormatting[id]?.isItalic,
      },
    }));
  };

  const toggleLinkFormatting = (id: string) => {
    setTextFormatting((prevFormatting) => ({
      ...prevFormatting,
      [id]: {
        ...prevFormatting[id],
        isLink: !prevFormatting[id]?.isLink,
      },
    }));
  };

  const parseDate = (dateString: string) => {
    const parsed = Date.parse(dateString.replace(',', ''));
    return isNaN(parsed) ? null : new Date(parsed);
  };

  if (isLocalLoading) {
    return (
      <LoadingComponent
        commentsCount={commentsCount}
        newComment={newComment}
        setNewComment={setNewComment}
        toggleBoldFormatting={toggleBoldFormatting}
        toggleItalicFormatting={toggleItalicFormatting}
        toggleLinkFormatting={toggleLinkFormatting}
        handleAddComment={handleAddComment}
      />
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <StyledContainer commentsCount={setCommentsCount}>
        <StyledTitle>Comments</StyledTitle>
        <StyledCommentBorder>
          <StyledUserContainer>
            <img
              src="/img/IconMan.svg"
              alt="Описание изображения"
              width="40"
              height="40"
            />
            <StyledName>John Doe</StyledName>
          </StyledUserContainer>
          <StyledTextarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            isBold={textFormatting['newComment']?.isBold || false}
            isItalic={textFormatting['newComment']?.isItalic || false}
            isLink={textFormatting['newComment']?.isLink || false}
          />
          <StyledLine />

          <IconsAndButtonContainer>
            <img
              src="/img/IconBoldText.svg"
              alt="Иконка форматирования текста"
              width="20"
              height="20"
              onClick={() => toggleBoldFormatting('newComment')}
              style={{ cursor: 'pointer' }}
            />
            <img
              src="/img/IconItalicText.svg"
              alt="Иконка курсива"
              width="20"
              height="20"
              onClick={() => toggleItalicFormatting('newComment')}
              style={{ cursor: 'pointer' }}
            />
            <img
              src="/img/IconLink.svg"
              alt="Иконка ссылка"
              width="20"
              height="20"
              onClick={() => toggleLinkFormatting('newComment')}
              style={{ cursor: 'pointer' }}
            />

            <StyledButtonComment onClick={handleAddComment}>
              Comment
            </StyledButtonComment>
          </IconsAndButtonContainer>
        </StyledCommentBorder>

        {comments
          .slice()
          .reverse()
          .map((comment) => (
            <CommentComponent
              key={comment.id}
              comment={comment}
              replies={replies}
              handleDeleteComment={handleDeleteComment}
              handleLikeOrUnlike={handleLikeOrUnlike}
              handleReply={handleReply}
              replyTo={replyTo}
              setReplyTo={setReplyTo}
              replyText={replyText}
              setReplyText={setReplyText}
            />
          ))}
      </StyledContainer>
    </div>
  );
};

export default MainLayout;
