import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
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
} from '../api/rtkQuery';
import { Comment } from '../api/types';
import { formatDistanceToNow } from 'date-fns';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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
  isBold: boolean;
  isItalic: boolean;
  isLink: boolean;
}>`
  font-size: 16px;
  font-weight: ${({ isBold }) => (isBold ? 'bold' : 'normal')};
  font-style: ${({ isItalic }) => (isItalic ? 'italic' : 'normal')};
  text-decoration: ${({ isLink }) => (isLink ? 'underline' : 'none')};
  height: 84px;
  padding: 10px 10px 0 10px;
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

const StyledCommentContainer = styled.div`
  width: 500px;
  height: auto;
  margin-left: 30px;
  margin-bottom: 20px;
  padding: 20px;
  font-size: 16px;
`;

const StyledCommentName = styled.div`
  font-family: SourceSansPro-Black;
  font-weight: 600;
  font-size: 20px;
  color: #101010;
  margin-bottom: 10px;
`;

const StyledCommentText = styled.div<{
  isBold: boolean;
  isItalic: boolean;
  isLink: boolean;
}>`
  font-weight: ${({ isBold }) => (isBold ? 'bold' : 'normal')};
  font-style: ${({ isItalic }) => (isItalic ? 'italic' : 'normal')};
  text-decoration: ${({ isLink }) => (isLink ? 'underline' : 'none')};
  display: block;
  width: 100%;
  word-break: break-word;
  margin-bottom: 15px;
`;

const StyledButtoncontainerComment = styled.div`
  display: flex;
  align-items: flex-end;
  word-break: break-word;
  gap: 15px;
`;

const StyledCommentTimestamp = styled.div`
  // font-family: SourceSansPro-Black;
  // font-weight: 600;
  font-size: 14px;
  color: #888;
  margin-top: 10px;
`;

const StyledDeleteButton = styled.button`
  background-color: #ff0000;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
  align-self: flex-end;
  &:hover {
    background-color: #cc0000;
  }
`;

const StyledLikeButton = styled.button<{ liked: boolean }>`
  background-color: ${({ liked }) => (liked ? 'red' : 'blue')};
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
  align-self: flex-end;
`;

const StyledReplyContainer = styled.div`
  margin-top: 10px;
  padding-left: 20px;
`;

const StyledReplyTextarea = styled.textarea`
  width: 100%;
  height: 60px;
  border-radius: 5px;
  outline: none;
  resize: none;
  &:focus {
    border-color: #007bff;
  }
`;

const StyledReplyButton = styled.button`
  background-color: #0089ff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    background-color: #0056b3;
  }
`;

const StyledReplyId = styled.div`
  margin-top: 10px;
  padding-left: 10px;
  border-left: 2px solid #ccc;
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
      if (error.status === 404) {
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

          {[...Array(commentsCount || 0)].map((_, index) => (
            <StyledCommentContainer key={index}>
              <StyledUserContainer>
                <Skeleton circle width={40} height={40} color="darkgray" />
                <Skeleton width={80} height={20} color="darkgray" />
              </StyledUserContainer>
              <Skeleton width="100%" height={60} color="darkgray" />
              <StyledButtoncontainerComment>
                <Skeleton width={80} height={30} color="darkgray" />
                <Skeleton width={80} height={30} color="darkgray" />
                <Skeleton width={50} height={30} color="darkgray" />
                <Skeleton width={100} height={30} color="darkgray" />
              </StyledButtoncontainerComment>
            </StyledCommentContainer>
          ))}
        </StyledContainer>
      </div>
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
          .map((item) => {
            const parsedDate = parseDate(item.timestamp);
            const commentReplies = replies.filter(
              (reply) => reply.commentId === item.id,
            );
            return (
              <StyledCommentContainer key={item.id}>
                <StyledUserContainer>
                  {item.img ? (
                    <img src={item.img} alt="Commit Image" />
                  ) : (
                    <Skeleton circle width={40} height={40} color="red" />
                  )}
                  {item.author ? (
                    <StyledCommentName>{item.author}</StyledCommentName>
                  ) : (
                    <Skeleton width={80} height={20} color="red" />
                  )}
                </StyledUserContainer>
                <StyledCommentText
                  isBold={item.isBold}
                  isItalic={item.isItalic}
                  isLink={item.isLink}
                >
                  {item.text}
                </StyledCommentText>
                <StyledButtoncontainerComment>
                  {replyTo === item.id ? (
                    <>
                      <StyledReplyContainer>
                        <StyledReplyTextarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <StyledReplyButton onClick={() => handleReply(item.id)}>
                          Отправить ответ
                        </StyledReplyButton>
                      </StyledReplyContainer>
                    </>
                  ) : (
                    <>
                      <StyledReplyButton onClick={() => setReplyTo(item.id)}>
                        Ответить
                      </StyledReplyButton>
                      {!replyTo && (
                        <>
                          <StyledDeleteButton
                            onClick={() => handleDeleteComment(item.id)}
                          >
                            Удалить
                          </StyledDeleteButton>
                          <StyledLikeButton
                            liked={item.liked}
                            onClick={() =>
                              handleLikeOrUnlike(
                                item.id,
                                item.liked ? 'unlike' : 'like',
                              )
                            }
                          >
                            {item.liked ? 'Unlike' : 'Like'} {item.likes}
                          </StyledLikeButton>
                          <StyledCommentTimestamp>
                            {parsedDate &&
                              formatDistanceToNow(parsedDate, {
                                addSuffix: true,
                              })}
                          </StyledCommentTimestamp>
                        </>
                      )}
                    </>
                  )}
                </StyledButtoncontainerComment>
                {commentReplies.length > 0 && (
                  <StyledReplyContainer>
                    {commentReplies.map((reply) => {
                      const parsedReplyDate = parseDate(reply.timestamp);
                      return (
                        <StyledReplyId>
                          <div key={reply.id}>
                            <StyledCommentName>
                              {reply.author}
                            </StyledCommentName>
                            <StyledCommentText
                              isBold={reply.isBold}
                              isItalic={reply.isItalic}
                              isLink={reply.isLink}
                            >
                              {reply.text}
                            </StyledCommentText>
                            <StyledCommentTimestamp>
                              {parsedReplyDate &&
                                formatDistanceToNow(parsedReplyDate, {
                                  addSuffix: true,
                                })}
                            </StyledCommentTimestamp>
                          </div>
                        </StyledReplyId>
                      );
                    })}
                  </StyledReplyContainer>
                )}
              </StyledCommentContainer>
            );
          })}
      </StyledContainer>
    </div>
  );
};

export default MainLayout;
