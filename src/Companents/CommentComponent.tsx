import React from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { formatDistanceToNow } from 'date-fns';
import { Comment, Reply } from './interface';
import { CommentProps } from './interface';

const parseDate = (dateString: string) => {
  const parsed = Date.parse(dateString.replace(',', ''));
  return isNaN(parsed) ? null : new Date(parsed);
};

const StyledUserContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
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

const CommentComponent: React.FC<CommentProps> = ({
  comment,
  replies,
  handleDeleteComment,
  handleLikeOrUnlike,
  handleReply,
  replyTo,
  setReplyTo,
  replyText,
  setReplyText,
}) => {
  const parsedDate = parseDate(comment.timestamp);
  const commentReplies = replies.filter(
    (reply) => reply.commentId === comment.id,
  );

  return (
    <StyledCommentContainer key={comment.id}>
      <StyledUserContainer>
        {comment.img ? (
          <img src={comment.img} alt="Commit Image" />
        ) : (
          <Skeleton circle width={40} height={40} />
        )}
        {comment.author ? (
          <StyledCommentName>{comment.author}</StyledCommentName>
        ) : (
          <Skeleton width={80} height={20} />
        )}
      </StyledUserContainer>
      <StyledCommentText
        isBold={comment.isBold}
        isItalic={comment.isItalic}
        isLink={comment.isLink}
      >
        {comment.text}
      </StyledCommentText>
      <StyledButtoncontainerComment>
        {replyTo === comment.id ? (
          <>
            <StyledReplyContainer>
              <StyledReplyTextarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <StyledReplyButton onClick={() => handleReply(comment.id)}>
                Отправить ответ
              </StyledReplyButton>
            </StyledReplyContainer>
          </>
        ) : (
          <>
            <StyledReplyButton onClick={() => setReplyTo(comment.id)}>
              Ответить
            </StyledReplyButton>
            {!replyTo && (
              <>
                <StyledDeleteButton
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  Удалить
                </StyledDeleteButton>
                <StyledLikeButton
                  liked={comment.liked}
                  onClick={() =>
                    handleLikeOrUnlike(
                      comment.id,
                      comment.liked ? 'unlike' : 'like',
                    )
                  }
                >
                  {comment.liked ? 'Unlike' : 'Like'}
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
              <StyledReplyId key={`${comment.id}-${reply.id}`}>
                <div>
                  <StyledCommentName>{reply.author}</StyledCommentName>
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
};

export default CommentComponent;
