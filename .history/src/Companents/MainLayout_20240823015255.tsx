import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  useGetSomeDataQuery,
  useAddCommitMutation,
  useDeleteCommitMutation,
  useLikeCommentMutation,
  useUnlikeCommentMutation,
  useAddReplyMutation,
} from '../../api/rtkQuery';
import { Comment } from '../../api/types';
import { formatDistanceToNow } from 'date-fns';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const StyledContainer = styled.div`
  width: 590px;
  height: ${(props) =>
    `${props.setCommentsCount * 300}px`}; // Используем динамическую высоту
  min-height: 671px; // Минимальная высота
  position: absolute;
  top: 79px;
  left: 261px;
  border-radius: 8px;
  font-size: 28px;
  background-color: #ffffff;
  color: #0e0d0d;
  //overflow-y: auto; // Добавляем прокрутку, если контент превышает высоту контейнера
`;

const StyledTitle = styled.div`
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
  position: relative;
  font-size: 20px;
  color: #101010;
`;

const StyledTextarea = styled.textarea`
  font-size: 16px;
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
  //border: 1px solid black;
`;

const StyledCommentName = styled.div`
  font-size: 20px;
  color: #101010;
  margin-bottom: 10px;
`;

const StyledCommentText = styled.span`
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

const StyledLikeButton = styled.button`
  background-color: ${({ liked }) => (liked ? 'blue' : 'red')};
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
  align-self: flex-end;
  &:hover {
    background-color: ${({ liked }) => (liked ? 'red' : 'darkgray')};
  }
`;

const StyledReplyContainer = styled.div`
  margin-top: 10px;
  padding-left: 20px;
  border-left: 2px solid #ccc;
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

const MainLayout: React.FC = () => {
  const [newComment, setNewComment] = useState('');
  const { data = [], isLoading, refetch } = useGetSomeDataQuery();
  const [addComment, { isError }] = useAddCommitMutation();
  const [deleteComment] = useDeleteCommitMutation();
  const [likeComment] = useLikeCommentMutation();
  const [unlikeComment] = useUnlikeCommentMutation();
  const [addReply] = useAddReplyMutation();
  const [commentsCount, setCommentsCount] = useState(0); // Переменная для подсчета количества комментариев
  console.log('sdsdsd', commentsCount);
  const [replyText, setReplyText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [textFormatting, setTextFormatting] = useState({});
  const [isLocalLoading, setIsLocalLoading] = useState(true);

  useEffect(() => {
    setCommentsCount(data.length);
    if (!isLoading) {
      setIsLocalLoading(false);
    }
  }, [data, isLoading]);

  const handleAddComment = async () => {
    if (newComment) {
      try {
        const commitData: Partial<Comment> = {
          id: Date.now().toString(),
          img: '/img/IconMan.svg',
          author: 'Jane Smith',
          text: newComment,
          timestamp: new Date().toISOString(),
          liked: false,
          replies: [],
        };
        await addComment(commitData).unwrap();
        setNewComment('');
        refetch();
      } catch (error) {
        console.error('Не удалось добавить коммит: ', error);
      }
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      await deleteComment(id).unwrap();
      refetch();
    } catch (error) {
      console.error('Не удалось удалить коммит: ', error);
    }
  };

  const handleLikeOrUnlike = async (id: string, action: 'like' | 'unlike') => {
    try {
      const commentIndex = data.findIndex((c) => c.id === id);
      if (commentIndex !== -1) {
        let newLikedState = data[commentIndex].liked;
        if (action === 'like') {
          newLikedState = true;
          await likeComment(id).unwrap();
        } else if (action === 'unlike') {
          newLikedState = false;
          await unlikeComment(id).unwrap();
        }
        const updatedData = [...data];
        updatedData[commentIndex] = {
          ...updatedData[commentIndex],
          liked: newLikedState,
        };
        refetch();
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
          timestamp: new Date().toISOString(), // Сохраняем в формате ISO
        };
        console.log('Sending reply:', commentId, replyData); // Логирование перед отправкой запроса
        await addReply({ commentId, ...replyData }).unwrap();
        setReplyText('');
        setReplyTo(null);
        refetch();
      } catch (error) {
        console.error('Не удалось добавить ответ: ', error);
      }
    }
  };

  const toggleBoldFormatting = (id) => {
    setTextFormatting((prevFormatting) => ({
      ...prevFormatting,
      [id]: !prevFormatting[id],
    }));
  };

  const parseDate = (dateString) => {
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
            />
            <StyledLine />

            <IconsAndButtonContainer>
              <img
                src="/img/IconBoldText.svg"
                alt="Иконка форматирования текста"
                width="20"
                height="20"
                onClick={() => toggleBoldFormatting(item.id)} // item.id — это идентификатор комментария
                style={{ cursor: 'pointer' }}
              />
              <img
                src="/img/IconItalicText.svg"
                alt="Иконка курсива"
                width="20"
                height="20"
              />
              <img
                src="/img/IconLink.svg"
                alt="Иконка ссылка"
                width="20"
                height="20"
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
      <StyledContainer commentsCount={commentsCount}>
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
          />
          <StyledLine />

          <IconsAndButtonContainer>
            <img
              src="/img/IconBoldText.svg"
              alt="Иконка форматирования текста"
              width="20"
              height="20"
              onClick={() => toggleBoldFormatting(item.id)} // item.id — это идентификатор комментария
              style={{ cursor: 'pointer' }}
            />
            <img
              src="/img/IconItalicText.svg"
              alt="Иконка курсива"
              width="20"
              height="20"
            />
            <img
              src="/img/IconLink.svg"
              alt="Иконка ссылка"
              width="20"
              height="20"
            />

            <StyledButtonComment onClick={handleAddComment}>
              Comment
            </StyledButtonComment>
          </IconsAndButtonContainer>
        </StyledCommentBorder>

        {data
          .slice()
          .reverse()
          .map((item) => {
            const parsedDate = parseDate(item.timestamp);
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
                <StyledCommentText>{item.text}</StyledCommentText>
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
                {item.replies && item.replies.length > 0 && (
                  <StyledReplyContainer>
                    {item.replies.map((reply) => {
                      const parsedReplyDate = parseDate(reply.timestamp);
                      return (
                        <div key={reply.id}>
                          <StyledCommentName>{reply.author}</StyledCommentName>
                          <StyledCommentText>{reply.text}</StyledCommentText>
                          <StyledCommentTimestamp>
                            {parsedReplyDate &&
                              formatDistanceToNow(parsedReplyDate, {
                                addSuffix: true,
                              })}
                          </StyledCommentTimestamp>
                        </div>
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

// import React, { useState, useEffect, useRef } from 'react';
// import styled from 'styled-components';
// import {
//   useGetSomeDataQuery,
//   useAddCommitMutation,
//   useDeleteCommitMutation,
//   useLikeCommentMutation,
//   useUnlikeCommentMutation,
//   useAddReplyMutation,
// } from '../../api/rtkQuery'; // При необходимости скорректируйте путь
// import { Comment } from '../../api/types'; // Импортируйте тип Comment
// import { formatDistanceToNow } from 'date-fns';
// import Skeleton from 'react-loading-skeleton';
// import 'react-loading-skeleton/dist/skeleton.css';
//
// const StyledContainer = styled.div`
//   width: 590px;
//   height: ${(props) =>
//     `${props.commentsCount * 254}px`}; // Используем динамическую высоту
//   min-height: 900px; // Минимальная высота
//   position: absolute;
//   top: 79px;
//   left: 261px;
//   border-radius: 8px;
//   font-size: 28px;
//   background-color: #ffffff;
//   color: #0e0d0d;
//   //overflow-y: auto; // Добавляем прокрутку, если контент превышает высоту контейнера
// `;
//
// const StyledTitle = styled.div`
//   margin-top: 30px;
//   margin-left: 30px;
//   color: black;
// `;
//
// const StyledCommentBorder = styled.div`
//   width: 500px;
//   height: 254px;
//   margin-top: 20px;
//   margin-left: 30px;
//   margin-right: 30px;
//   margin-bottom: 40px;
//   border-radius: 8px;
//   border: 1px solid blue;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//   padding: 20px;
//   color: #333;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
// `;
//
// const StyledUserContainer = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   margin-bottom: 15px;
// `;
//
// const StyledName = styled.div`
//   position: relative;
//   font-size: 20px;
//   color: #101010;
// `;
//
// const StyledTextarea = styled.textarea`
//   height: 84px;
//   padding: 10px 10px 0 10px;
//   border: 1px solid #ccc;
//   border-radius: 5px;
//   outline: none;
//   word-break: break-all;
//   white-space: pre-wrap;
//   resize: none;
//   &:focus {
//     border-color: #007bff;
//   }
// `;
//
// const StyledLine = styled.div`
//   width: 100%;
//   height: 2px;
//   border-top: 1px solid #000000;
//   margin-top: 15px;
// `;
//
// const IconsAndButtonContainer = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 12px;
//   margin-top: 27px;
// `;
//
// const StyledButtonComment = styled.button`
//   width: 108px;
//   height: 44px;
//   background-color: #0089ff;
//   color: white;
//   border: none;
//   padding: 10px 20px;
//   border-radius: 8px;
//   cursor: pointer;
//   margin-left: 300px;
//   &:hover {
//     background-color: #0056b3;
//   }
// `;
//
// const StyledCommentContainer = styled.div`
//   width: 500px;
//   height: auto;
//   margin-left: 30px;
//   margin-bottom: 20px;
//   padding: 20px;
//   font-size: 16px;
// `;
//
// const StyledCommentName = styled.div`
//   font-size: 20px;
//   color: #101010;
// `;
//
// const StyledCommentText = styled.span`
//   display: block;
//   width: 100%;
//   word-break: break-word;
//   margin-bottom: 15px;
// `;
//
// const StyledButtoncontainerComment = styled.div`
//   display: flex;
//   align-items: flex-end;
//   word-break: break-word;
//   gap: 15px;
// `;
//
// const StyledCommentTimestamp = styled.div`
//   font-size: 14px;
//   color: #888;
//   margin-top: 10px;
// `;
//
// const StyledDeleteButton = styled.button`
//   background-color: #ff0000;
//   color: white;
//   border: none;
//   padding: 5px 10px;
//   border-radius: 8px;
//   cursor: pointer;
//   margin-top: 10px;
//   align-self: flex-end;
//   &:hover {
//     background-color: #cc0000;
//   }
// `;
//
// const StyledLikeButton = styled.button`
//   background-color: ${({ liked }) => (liked ? 'blue' : 'red')};
//   color: white;
//   border: none;
//   padding: 5px 10px;
//   border-radius: 8px;
//   cursor: pointer;
//   margin-top: 10px;
//   align-self: flex-end;
//   &:hover {
//     background-color: ${({ liked }) => (liked ? 'red' : 'darkgray')};
//   }
// `;
//
// const StyledReplyContainer = styled.div`
//   margin-top: 10px;
//   padding-left: 20px;
//   border-left: 2px solid #ccc;
// `;
//
// const StyledReplyTextarea = styled.textarea`
//   width: 100%;
//   height: 60px;
//   border-radius: 5px;
//   outline: none;
//   resize: none;
//   &:focus {
//     border-color: #007bff;
//   }
// `;
//
// const StyledReplyButton = styled.button`
//   background-color: #0089ff;
//   color: white;
//   border: none;
//   padding: 5px 10px;
//   border-radius: 8px;
//   cursor: pointer;
//   margin-top: 10px;
//   &:hover {
//     background-color: #0056b3;
//   }
// `;
//
// const MainLayout: React.FC = () => {
//   const [newComment, setNewComment] = useState('');
//   const { data = [], isLoading, refetch } = useGetSomeDataQuery();
//   const [addComment, { isError }] = useAddCommitMutation();
//   const [deleteComment] = useDeleteCommitMutation();
//   const [likeComment] = useLikeCommentMutation();
//   const [unlikeComment] = useUnlikeCommentMutation();
//   const [addReply] = useAddReplyMutation();
//   const [commentsCount, setCommentsCount] = useState(data.length);
//   const [replyText, setReplyText] = useState('');
//   const [replyTo, setReplyTo] = useState(null);
//   const [textFormatting, setTextFormatting] = useState({});
//
//   useEffect(() => {
//     setCommentsCount(data.length);
//   }, [data]);
//   console.log(setCommentsCount);
//
//   // Добавление задержки перед получением данных
//   useEffect(() => {
//     setTimeout(() => {
//       refetch(); // Вызываем refetch после задержки
//     }, 3000); // Задержка в 3 секунды
//   }, []);
//
//   const handleAddComment = async () => {
//     if (newComment) {
//       try {
//         const commitData: Partial<Comment> = {
//           id: Date.now().toString(),
//           img: '/img/IconMan.svg',
//           author: 'Jane Smith',
//           text: newComment,
//           timestamp: new Date().toLocaleString(),
//           liked: false,
//           replies: [],
//         };
//         await addComment(commitData).unwrap();
//         setNewComment('');
//         refetch();
//       } catch (error) {
//         console.error('Не удалось добавить коммит: ', error);
//       }
//     }
//   };
//
//   const handleDeleteComment = async (id: string) => {
//     try {
//       await deleteComment(id).unwrap();
//       refetch();
//     } catch (error) {
//       console.error('Не удалось удалить коммит: ', error);
//     }
//   };
//
//   const handleLikeOrUnlike = async (id: string, action: 'like' | 'unlike') => {
//     try {
//       const commentIndex = data.findIndex((c) => c.id === id);
//       if (commentIndex !== -1) {
//         let newLikedState = data[commentIndex].liked;
//         if (action === 'like') {
//           newLikedState = true;
//           await likeComment(id).unwrap();
//         } else if (action === 'unlike') {
//           newLikedState = false;
//           await unlikeComment(id).unwrap();
//         }
//         const updatedData = [...data];
//         updatedData[commentIndex] = {
//           ...updatedData[commentIndex],
//           liked: newLikedState,
//         };
//         refetch();
//       }
//     } catch (error) {
//       if (error.status === 404) {
//         console.error(`Комментарий ${id} не найден`);
//       } else {
//         console.error(
//           `${action === 'like' ? 'Лайк' : 'Антилайк'} не удалось: `,
//           error,
//         );
//       }
//     }
//   };
//
//   const handleReply = async (commentId: string) => {
//     if (replyText) {
//       try {
//         const replyData = {
//           author: 'John Doe',
//           text: replyText,
//           timestamp: new Date().toISOString(),
//         };
//         await addReply({ commentId, ...replyData }).unwrap();
//         setReplyText('');
//         setReplyTo(null);
//         refetch();
//       } catch (error) {
//         console.error('Не удалось добавить ответ: ', error);
//       }
//     }
//   };
//
//   const toggleBoldFormatting = (id) => {
//     setTextFormatting((prevFormatting) => ({
//       ...prevFormatting,
//       [id]: !prevFormatting[id],
//     }));
//   };
//
//   if (isLoading) return <h1>Загрузка...</h1>;
//
//   return (
//     <div style={{ position: 'relative' }}>
//       <StyledContainer commentsCount={commentsCount}>
//         <StyledTitle>Comments</StyledTitle>
//         <StyledCommentBorder>
//           <StyledUserContainer>
//             <img
//               src="/img/IconMan.svg"
//               alt="Описание изображения"
//               width="40"
//               height="40"
//             />
//             <StyledName>John Doe</StyledName>
//           </StyledUserContainer>
//           <StyledTextarea
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//           />
//           <StyledLine />
//
//           <IconsAndButtonContainer>
//             <img
//               src="/img/IconBoldText.svg"
//               alt="Иконка форматирования текста"
//               width="20"
//               height="20"
//               onClick={() => toggleBoldFormatting(item.id)} // item.id — это идентификатор комментария
//               style={{ cursor: 'pointer' }}
//             />
//             <img
//               src="/img/IconItalicText.svg"
//               alt="Иконка курсива"
//               width="20"
//               height="20"
//             />
//             <img
//               src="/img/IconLink.svg"
//               alt="Иконка ссылка"
//               width="20"
//               height="20"
//             />
//
//             <StyledButtonComment onClick={handleAddComment}>
//               Comment
//             </StyledButtonComment>
//           </IconsAndButtonContainer>
//         </StyledCommentBorder>
//
//         {data.map((item) => (
//           <StyledCommentContainer key={item.id}>
//             {/*<StyledUserContainer>*/}
//             {/*  {item.img && <img src={item.img} alt="Commit Image" />}*/}
//             {/*  <StyledCommentName>{item.author}</StyledCommentName>*/}
//             {/*</StyledUserContainer>*/}
//             <StyledUserContainer>
//               {item.img ? (
//                 <img src={item.img} alt="Commit Image" />
//               ) : (
//                 <Skeleton circle width={40} height={40} color="red" />
//               )}
//               {item.author ? (
//                 <StyledCommentName>{item.author}</StyledCommentName>
//               ) : (
//                 <Skeleton width={80} height={20} color="red" />
//               )}
//             </StyledUserContainer>
//             <StyledCommentText>{item.text}</StyledCommentText>
//             <StyledButtoncontainerComment>
//               {replyTo === item.id ? (
//                 <>
//                   <StyledReplyContainer>
//                     <StyledReplyTextarea
//                       value={replyText}
//                       onChange={(e) => setReplyText(e.target.value)}
//                     />
//                     <StyledReplyButton onClick={() => handleReply(item.id)}>
//                       Отправить ответ
//                     </StyledReplyButton>
//                   </StyledReplyContainer>
//                 </>
//               ) : (
//                 <>
//                   <StyledReplyButton onClick={() => setReplyTo(item.id)}>
//                     Ответить
//                   </StyledReplyButton>
//                   {!replyTo && (
//                     <>
//                       <StyledDeleteButton
//                         onClick={() => handleDeleteComment(item.id)}
//                       >
//                         Удалить
//                       </StyledDeleteButton>
//                       <StyledLikeButton
//                         liked={item.liked}
//                         onClick={() =>
//                           handleLikeOrUnlike(
//                             item.id,
//                             item.liked ? 'unlike' : 'like',
//                           )
//                         }
//                       >
//                         {item.liked ? 'Unlike' : 'Like'} {item.likes}
//                       </StyledLikeButton>
//                       <StyledCommentTimestamp>
//                         {item.timestamp}
//                       </StyledCommentTimestamp>
//                     </>
//                   )}
//                 </>
//               )}
//             </StyledButtoncontainerComment>
//             {item.replies && item.replies.length > 0 && (
//               <StyledReplyContainer>
//                 {item.replies.map((reply) => (
//                   <div key={reply.id}>
//                     <StyledCommentName>{reply.author}</StyledCommentName>
//                     <StyledCommentText>{reply.text}</StyledCommentText>
//                     <StyledCommentTimestamp>
//                       {formatDistanceToNow(new Date(reply.timestamp), {
//                         addSuffix: true,
//                       })}
//                     </StyledCommentTimestamp>
//                   </div>
//                 ))}
//               </StyledReplyContainer>
//             )}
//           </StyledCommentContainer>
//         ))}
//       </StyledContainer>
//     </div>
//   );
// };
//
// export default MainLayout;

//   return (
//     <div style={{ position: 'relative' }}>
//       <StyledContainer commentsCount={commentsCount}>
//         <StyledTitle>Comments</StyledTitle>
//         <StyledCommentBorder>
//           <StyledUserContainer>
//             <img
//               src="/img/IconMan.svg"
//               alt="Описание изображения"
//               width="40"
//               height="40"
//             />
//             <StyledName>John Doe</StyledName>
//           </StyledUserContainer>
//           <StyledTextarea
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//           />
//           <StyledLine />
//
//           <IconsAndButtonContainer>
//             <img
//               src="/img/IconBoldText.svg"
//               alt="Иконка жирного текста"
//               width="20"
//               height="20"
//             />
//             <img
//               src="/img/IconItalicText.svg"
//               alt="Иконка курсива"
//               width="20"
//               height="20"
//             />
//             <img
//               src="/img/IconLink.svg"
//               alt="Иконка ссылка"
//               width="20"
//               height="20"
//             />
//
//             <StyledButtonComment onClick={handleAddComment}>
//               Comment
//             </StyledButtonComment>
//           </IconsAndButtonContainer>
//         </StyledCommentBorder>
//
//         {data.map((item) => (
//           <StyledCommentContainer key={item.id}>
//             <StyledUserContainer>
//               {item.img && <img src={item.img} alt="Commit Image" />}
//               <StyledCommentName>{item.author}</StyledCommentName>
//             </StyledUserContainer>
//             <StyledCommentText>{item.text}</StyledCommentText>
//             <StyledButtoncontainerComment>
//               {/*<StyledCommentTimestamp>{item.timestamp}</StyledCommentTimestamp>*/}
//
//               {/*<StyledDeleteButton onClick={() => handleDeleteComment(item.id)}>*/}
//               {/*  Удалить*/}
//               {/*</StyledDeleteButton>*/}
//               {/*<StyledLikeButton*/}
//               {/*  liked={item.liked}*/}
//               {/*  onClick={() =>*/}
//               {/*    handleLikeOrUnlike(item.id, item.liked ? 'unlike' : 'like')*/}
//               {/*  }*/}
//               {/*>*/}
//               {/*  {item.liked ? 'Unlike' : 'Like'} {item.likes}*/}
//               {/*</StyledLikeButton>*/}
//
//               {replyTo === item.id ? (
//                 <StyledReplyContainer>
//                   <StyledReplyTextarea
//                     value={replyText}
//                     onChange={(e) => setReplyText(e.target.value)}
//                   />
//                   <StyledReplyButton onClick={() => handleReply(item.id)}>
//                     Отправить ответ
//                   </StyledReplyButton>
//                 </StyledReplyContainer>
//               ) : (
//                 <StyledReplyButton onClick={() => setReplyTo(item.id)}>
//                   Ответить
//                 </StyledReplyButton>
//               )}
//
//               <StyledDeleteButton onClick={() => handleDeleteComment(item.id)}>
//                 Удалить
//               </StyledDeleteButton>
//               <StyledLikeButton
//                 liked={item.liked}
//                 onClick={() =>
//                   handleLikeOrUnlike(item.id, item.liked ? 'unlike' : 'like')
//                 }
//               >
//                 {item.liked ? 'Unlike' : 'Like'} {item.likes}
//               </StyledLikeButton>
//               <StyledCommentTimestamp>{item.timestamp}</StyledCommentTimestamp>
//             </StyledButtoncontainerComment>
//             {item.replies && item.replies.length > 0 && (
//               <StyledReplyContainer>
//                 {item.replies.map((reply) => (
//                   <div key={reply.id}>
//                     <StyledCommentName>{reply.author}</StyledCommentName>
//                     <StyledCommentText>{reply.text}</StyledCommentText>
//                     <StyledCommentTimestamp>
//                       {reply.timestamp}
//                     </StyledCommentTimestamp>
//                   </div>
//                 ))}
//               </StyledReplyContainer>
//             )}
//           </StyledCommentContainer>
//         ))}
//       </StyledContainer>
//     </div>
//   );
// };

// export default MainLayout;

//Работает (Лайки и удаление) 21.08 1:25
// import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';
// import {
//   useGetSomeDataQuery,
//   useAddCommitMutation,
//   useDeleteCommitMutation,
//   useLikeCommentMutation,
//   useUnlikeCommentMutation,
//   useAddReplyMutation,
// } from '../../api/rtkQuery'; // При необходимости скорректируйте путь
// import { Comment } from '../../api/types'; // Импортируйте тип Comment
//
// const StyledContainer = styled.div`
//   width: 590px;
//   height: ${(props) =>
//     `${props.commentsCount * 254}px`}; // Используем динамическую высоту
//   min-height: 900px; // Минимальная высота
//   position: absolute;
//   top: 79px;
//   left: 261px;
//   border-radius: 8px;
//   font-size: 28px;
//   background-color: #ffffff;
//   color: #0e0d0d;
//   overflow-y: auto; // Добавляем прокрутку, если контент превышает высоту контейнера
// `;
//
// const StyledTitle = styled.div`
//   margin-top: 30px;
//   margin-left: 30px;
//   color: black;
// `;
//
// const StyledCommentBorder = styled.div`
//   width: 500px;
//   height: 254px;
//   margin-top: 20px;
//   margin-left: 30px;
//   margin-right: 30px;
//   margin-bottom: 40px;
//   border-radius: 8px;
//   border: 1px solid blue;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//   padding: 20px;
//   color: #333;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
// `;
//
// const StyledUserContainer = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   margin-bottom: 15px;
// `;
//
// const StyledName = styled.div`
//   position: relative;
//   font-size: 20px;
//   color: #101010;
// `;
//
// const StyledTextarea = styled.textarea`
//   height: 84px;
//   padding: 10px 10px 0 10px;
//   border: 1px solid #ccc;
//   border-radius: 5px;
//   outline: none;
//   word-break: break-all;
//   white-space: pre-wrap;
//   resize: none;
//   &:focus {
//     border-color: #007bff;
//   }
// `;
//
// const StyledLine = styled.div`
//   width: 100%;
//   height: 2px;
//   border-top: 1px solid #000000;
//   margin-top: 15px;
// `;
//
// const IconsAndButtonContainer = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 12px;
//   margin-top: 27px;
// `;
//
// const StyledButtonComment = styled.button`
//   width: 108px;
//   height: 44px;
//   background-color: #0089ff;
//   color: white;
//   border: none;
//   padding: 10px 20px;
//   border-radius: 8px;
//   cursor: pointer;
//   margin-left: 300px;
//   &:hover {
//     background-color: #0056b3;
//   }
// `;
//
// const StyledCommentContainer = styled.div`
//   width: 500px;
//   height: auto;
//   margin-left: 30px;
//   margin-bottom: 20px;
//   padding: 20px;
//   font-size: 16px;
// `;
//
// const StyledCommentName = styled.div`
//   font-size: 20px;
//   color: #101010;
//   margin-bottom: 10px;
// `;
//
// const StyledCommentText = styled.span`
//   display: block;
//   width: 100%;
//   word-break: break-word;
//   margin-bottom: 15px;
// `;
//
// const StyledButtoncontainerComment = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: flex-end;
//   width: 80%;
//   word-break: break-word;
// `;
//
// const StyledCommentTimestamp = styled.div`
//   font-size: 14px;
//   color: #888;
//   margin-top: 10px;
// `;
//
// const StyledDeleteButton = styled.button`
//   background-color: #ff0000;
//   color: white;
//   border: none;
//   padding: 5px 10px;
//   border-radius: 8px;
//   cursor: pointer;
//   margin-top: 10px;
//   align-self: flex-end;
//   &:hover {
//     background-color: #cc0000;
//   }
// `;
//
// const StyledLikeButton = styled.button`
//   background-color: ${({ liked }) => (liked ? 'blue' : 'red')};
//   color: white;
//   border: none;
//   padding: 5px 10px;
//   border-radius: 8px;
//   cursor: pointer;
//   margin-top: 10px;
//   align-self: flex-end;
//   &:hover {
//     background-color: ${({ liked }) => (liked ? 'red' : 'darkgray')};
//   }
// `;
//
// const StyledReplyContainer = styled.div`
//   margin-top: 10px;
//   padding-left: 20px;
//   border-left: 2px solid #ccc;
// `;
//
// const StyledReplyTextarea = styled.textarea`
//   width: 100%;
//   height: 60px;
//   border-radius: 5px;
//   outline: none;
//   resize: none;
//   &:focus {
//     border-color: #007bff;
//   }
// `;
//
// const StyledReplyButton = styled.button`
//   background-color: #0089ff;
//   color: white;
//   border: none;
//   padding: 5px 10px;
//   border-radius: 8px;
//   cursor: pointer;
//   margin-top: 10px;
//   &:hover {
//     background-color: #0056b3;
//   }
// `;
//
// const MainLayout: React.FC = () => {
//   const [newComment, setNewComment] = useState('');
//   const { data = [], isLoading, refetch } = useGetSomeDataQuery();
//   const [addComment, { isError }] = useAddCommitMutation();
//   const [deleteComment] = useDeleteCommitMutation();
//   const [likeComment] = useLikeCommentMutation();
//   const [unlikeComment] = useUnlikeCommentMutation();
//   const [addReply] = useAddReplyMutation();
//   const [commentsCount, setCommentsCount] = useState(data.length);
//   const [replyText, setReplyText] = useState('');
//   const [replyTo, setReplyTo] = useState(null);
//
//   useEffect(() => {
//     setCommentsCount(data.length);
//   }, [data]);
//
//   const handleAddComment = async () => {
//     if (newComment) {
//       try {
//         const commitData: Partial<Comment> = {
//           id: Date.now().toString(),
//           img: '/img/IconMan.svg',
//           author: 'Jane Smith',
//           text: newComment,
//           timestamp: new Date().toLocaleString(),
//           liked: false,
//         };
//         await addComment(commitData).unwrap();
//         setNewComment('');
//         refetch();
//       } catch (error) {
//         console.error('Не удалось добавить коммит: ', error);
//       }
//     }
//   };
//
//   const handleDeleteComment = async (id: string) => {
//     try {
//       await deleteComment(id).unwrap();
//       refetch();
//     } catch (error) {
//       console.error('Не удалось удалить коммит: ', error);
//     }
//   };
//
//   const handleLikeOrUnlike = async (id: string, action: 'like' | 'unlike') => {
//     try {
//       const commentIndex = data.findIndex((c) => c.id === id);
//       if (commentIndex !== -1) {
//         let newLikedState = data[commentIndex].liked;
//         if (action === 'like') {
//           newLikedState = true;
//           await likeComment(id).unwrap();
//         } else if (action === 'unlike') {
//           newLikedState = false;
//           await unlikeComment(id).unwrap();
//         }
//         const updatedData = [...data];
//         updatedData[commentIndex].liked = newLikedState;
//         refetch();
//       }
//     } catch (error) {
//       if (error.status === 404) {
//         console.error(`Комментарий ${id} не найден`);
//       } else {
//         console.error(
//           `${action === 'like' ? 'Лайк' : 'Антилайк'} не удалось: `,
//           error,
//         );
//       }
//     }
//   };
//
//   const handleReply = async (commentId: string) => {
//     if (replyText) {
//       try {
//         const replyData = {
//           commentId,
//           author: 'John Doe',
//           text: replyText,
//           timestamp: new Date().toLocaleString(),
//         };
//         await addReply(replyData).unwrap();
//         setReplyText('');
//         setReplyTo(null);
//         refetch();
//       } catch (error) {
//         console.error('Не удалось добавить ответ: ', error);
//       }
//     }
//   };
//
//   if (isLoading) return <h1>Загрузка...</h1>;
//
//   return (
//     <div style={{ position: 'relative' }}>
//       <StyledContainer commentsCount={commentsCount}>
//         <StyledTitle>Comments</StyledTitle>
//         <StyledCommentBorder>
//           <StyledUserContainer>
//             <img
//               src="/img/IconMan.svg"
//               alt="Описание изображения"
//               width="40"
//               height="40"
//             />
//             <StyledName>John Doe</StyledName>
//           </StyledUserContainer>
//           <StyledTextarea
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//           />
//           <StyledLine />
//
//           <IconsAndButtonContainer>
//             <img
//               src="/img/IconBoldText.svg"
//               alt="Иконка жирного текста"
//               width="20"
//               height="20"
//             />
//             <img
//               src="/img/IconItalicText.svg"
//               alt="Иконка курсива"
//               width="20"
//               height="20"
//             />
//             <img
//               src="/img/IconLink.svg"
//               alt="Иконка ссылка"
//               width="20"
//               height="20"
//             />
//
//             <StyledButtonComment onClick={handleAddComment}>
//               Comment
//             </StyledButtonComment>
//           </IconsAndButtonContainer>
//         </StyledCommentBorder>
//
//         {data.map((item) => (
//           <StyledCommentContainer key={item.id}>
//             <StyledUserContainer>
//               {item.img && <img src={item.img} alt="Commit Image" />}
//               <StyledCommentName>{item.author}</StyledCommentName>
//             </StyledUserContainer>
//             <StyledCommentText>{item.text}</StyledCommentText>
//             <StyledButtoncontainerComment>
//               <StyledCommentTimestamp>{item.timestamp}</StyledCommentTimestamp>
//               <StyledDeleteButton onClick={() => handleDeleteComment(item.id)}>
//                 Удалить
//               </StyledDeleteButton>
//               <StyledLikeButton
//                 liked={item.liked}
//                 onClick={() =>
//                   handleLikeOrUnlike(item.id, item.liked ? 'unlike' : 'like')
//                 }
//               >
//                 {item.liked ? 'like' : 'Unlike'} {item.likes}
//               </StyledLikeButton>
//
//               {replyTo === item.id ? (
//                 <StyledReplyContainer>
//                   <StyledReplyTextarea
//                     value={replyText}
//                     onChange={(e) => setReplyText(e.target.value)}
//                   />
//                   <StyledReplyButton onClick={() => handleReply(item.id)}>
//                     Отправить ответ
//                   </StyledReplyButton>
//                 </StyledReplyContainer>
//               ) : (
//                 <StyledReplyButton onClick={() => setReplyTo(item.id)}>
//                   Ответить
//                 </StyledReplyButton>
//               )}
//             </StyledButtoncontainerComment>
//
//             {item.replies && item.replies.length > 0 && (
//               <StyledReplyContainer>
//                 {item.replies.map((reply) => (
//                   <div key={reply.id}>
//                     <StyledCommentName>{reply.author}</StyledCommentName>
//                     <StyledCommentText>{reply.text}</StyledCommentText>
//                     <StyledCommentTimestamp>
//                       {reply.timestamp}
//                     </StyledCommentTimestamp>
//                   </div>
//                 ))}
//               </StyledReplyContainer>
//             )}
//           </StyledCommentContainer>
//         ))}
//       </StyledContainer>
//     </div>
//   );
// };
//
// export default MainLayout;

// Rabotaet

// import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';
// import {
//   useGetSomeDataQuery,
//   useAddCommitMutation,
//   useDeleteCommitMutation,
//   useToggleLikeCommentMutation,
//   useAddReplyMutation, // Предполагаем, что у вас есть мутация для добавления ответа
// } from '../../api/rtkQuery'; // При необходимости скорректируйте путь
// import { Comment } from '../../api/types'; // Импортируйте тип Comment
//
// const StyledContainer = styled.div`
//   width: 590px;
//   height: ${(props) =>
//     `${props.commentsCount * 254}px`}; // Используем динамическую высоту
//   min-height: 900px; // Минимальная высота
//   position: absolute;
//   top: 79px;
//   left: 261px;
//   border-radius: 8px;
//   font-size: 28px;
//   background-color: #ffffff;
//   color: #0e0d0d;
//   overflow-y: auto; // Добавляем прокрутку, если контент превышает высоту контейнера
// `;
//
// const StyledTitle = styled.div`
//   margin-top: 30px;
//   margin-left: 30px;
//   color: black;
// `;
//
// const StyledCommentBorder = styled.div`
//   width: 500px;
//   height: 254px;
//   margin-top: 20px;
//   margin-left: 30px;
//   margin-right: 30px;
//   margin-bottom: 40px;
//   border-radius: 8px;
//   border: 1px solid blue;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//   padding: 20px;
//   color: #333;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
// `;
//
// const StyledUserContainer = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   //bottom: 20px;
//   margin-bottom: 15px;
// `;
//
// const StyledName = styled.div`
//   position: relative;
//   font-size: 20px;
//   color: #101010;
// `;
//
// const StyledTextarea = styled.textarea`
//   height: 84px;
//   padding: 10px 10px 0 10px;
//   border: 1px solid #ccc;
//   border-radius: 5px;
//   outline: none;
//   word-break: break-all;
//   white-space: pre-wrap;
//   resize: none;
//   &:focus {
//     border-color: #007bff;
//   }
// `;
//
// const StyledLine = styled.div`
//   width: 100%;
//   height: 2px;
//   border-top: 1px solid #000000;
//   margin-top: 15px;
// `;
//
// const IconsAndButtonContainer = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 12px;
//   margin-top: 27px;
// `;
//
// const StyledButtonComment = styled.button`
//   width: 108px;
//   height: 44px;
//   background-color: #0089ff;
//   color: white;
//   border: none;
//   padding: 10px 20px;
//   border-radius: 8px;
//   cursor: pointer;
//   margin-left: 300px;
//   &:hover {
//     background-color: #0056b3;
//   }
// `;
//
// const StyledCommentContainer = styled.div`
//   width: 500px;
//   height: auto;
//   margin-left: 30px;
//   margin-bottom: 20px;
//   padding: 20px;
//   font-size: 16px;
//   //border: 1px solid #000000;
// `;
//
// const StyledCommentName = styled.div`
//   font-size: 20px;
//   color: #101010;
//   margin-bottom: 10px;
// `;
//
// const StyledCommentText = styled.span`
//   display: block;
//   width: 100%;
//   word-break: break-word;
//   margin-bottom: 15px;
// `;
// const StyledButtoncontainerComment = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: flex-end;
//   width: 80%;
//   word-break: break-word;
// `;
// const StyledCommentTimestamp = styled.div`
//   font-size: 14px;
//   color: #888;
//   margin-top: 10px;
// `;
//
// const StyledDeleteButton = styled.button`
//   background-color: #ff0000;
//   color: white;
//   border: none;
//   padding: 5px 10px;
//   border-radius: 8px;
//   cursor: pointer;
//   margin-top: 10px;
//   align-self: flex-end;
//   &:hover {
//     background-color: #cc0000;
//   }
// `;
//
// const StyledLikeButton = styled.button<{ liked: boolean }>`
//   background-color: ${({ liked }) => (liked ? 'blue' : 'gray')};
//   color: white;
//   border: none;
//   padding: 5px 10px;
//   border-radius: 8px;
//   cursor: pointer;
//   margin-top: 10px;
//   // margin-left: 250px;
//   align-self: flex-end;
//   &:hover {
//     background-color: ${({ liked }) => (liked ? 'darkblue' : 'darkgray')};
//   }
// `;
//
// const StyledReplyContainer = styled.div`
//   margin-top: 10px;
//   padding-left: 20px;
//   border-left: 2px solid #ccc;
// `;
//
// const StyledReplyTextarea = styled.textarea`
//   width: 100%;
//   height: 60px;
//   // border: 1px solid #ccc;
//   border-radius: 5px;
//   outline: none;
//   resize: none;
//   &:focus {
//     border-color: #007bff;
//   }
// `;
//
// const StyledReplyButton = styled.button`
//   background-color: #0089ff;
//   color: white;
//   border: none;
//   padding: 5px 10px;
//   border-radius: 8px;
//   cursor: pointer;
//   margin-top: 10px;
//   &:hover {
//     background-color: #0056b3;
//   }
// `;
//
// const MainLayout: React.FC = () => {
//   const [newComment, setNewComment] = useState('');
//   const { data = [], isLoading, refetch } = useGetSomeDataQuery();
//   const [addComment, { isError }] = useAddCommitMutation();
//   const [deleteComment] = useDeleteCommitMutation();
//   const [toggleLikeComment] = useToggleLikeCommentMutation();
//   const [addReply] = useAddReplyMutation();
//   const [commentsCount, setCommentsCount] = useState(data.length);
//   const [replyText, setReplyText] = useState('');
//   const [replyTo, setReplyTo] = useState(null);
//
//   useEffect(() => {
//     setCommentsCount(data.length);
//   }, [data]);
//
//   const handleAddComment = async () => {
//     if (newComment) {
//       try {
//         const commitData: Partial<Comment> = {
//           id: Date.now().toString(),
//           img: '/img/IconMan.svg',
//           author: 'Jane Smith',
//           text: newComment,
//           timestamp: new Date().toLocaleString(),
//           liked: false,
//         };
//         await addComment(commitData).unwrap();
//         setNewComment('');
//         refetch();
//       } catch (error) {
//         console.error('Не удалось добавить коммит: ', error);
//       }
//     }
//   };
//
//   const handleDeleteComment = async (id: string) => {
//     try {
//       await deleteComment(id).unwrap();
//       refetch();
//     } catch (error) {
//       console.error('Не удалось удалить коммит: ', error);
//     }
//   };
//
//   const handleLike = async (id: string) => {
//     try {
//       const comment = data.find((c) => c.id === id);
//       if (comment) {
//         await toggleLikeComment(id).unwrap();
//         refetch(); // Обновляем данные после лайка комментария
//       }
//     } catch (error) {
//       if (error.status === 404) {
//         console.error(`Комментарий ${id} не найден`);
//       } else {
//         console.error('Не удалось поставить лайк:', error);
//       }
//     }
//   };
//
//   const handleReply = async (commentId: string) => {
//     if (replyText) {
//       try {
//         const replyData = {
//           commentId,
//           author: 'John Doe',
//           text: replyText,
//           timestamp: new Date().toLocaleString(),
//         };
//         await addReply(replyData).unwrap();
//         setReplyText('');
//         setReplyTo(null);
//         refetch();
//       } catch (error) {
//         console.error('Не удалось добавить ответ: ', error);
//       }
//     }
//   };
//
//   if (isLoading) return <h1>Загрузка...</h1>;
//
//   return (
//     <div style={{ position: 'relative' }}>
//       <StyledContainer commentsCount={commentsCount}>
//         <StyledTitle>Comments</StyledTitle>
//         <StyledCommentBorder>
//           <StyledUserContainer>
//             <img
//               src="/img/IconMan.svg"
//               alt="Описание изображения"
//               width="40"
//               height="40"
//             />
//             <StyledName>John Doe</StyledName>
//           </StyledUserContainer>
//           <StyledTextarea
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//           />
//           <StyledLine />
//
//           <IconsAndButtonContainer>
//             <img
//               src="/img/IconBoldText.svg"
//               alt="Иконка жирного текста"
//               width="20"
//               height="20"
//             />
//             <img
//               src="/img/IconItalicText.svg"
//               alt="Иконка курсчив"
//               width="20"
//               height="20"
//             />
//             <img
//               src="/img/IconLink.svg"
//               alt="Иконка ссылка"
//               width="20"
//               height="20"
//             />
//
//             <StyledButtonComment onClick={handleAddComment}>
//               Comment
//             </StyledButtonComment>
//           </IconsAndButtonContainer>
//         </StyledCommentBorder>
//
//         {data.map((item) => (
//           <StyledCommentContainer key={item.id}>
//             <StyledUserContainer>
//               {item.img && <img src={item.img} alt="Commit Image" />}
//               <StyledCommentName>{item.author}</StyledCommentName>
//             </StyledUserContainer>
//             <StyledCommentText>{item.text}</StyledCommentText>
//             <StyledButtoncontainerComment>
//               <StyledCommentTimestamp>{item.timestamp}</StyledCommentTimestamp>
//               <StyledDeleteButton onClick={() => handleDeleteComment(item.id)}>
//                 Удалить
//               </StyledDeleteButton>
//               <StyledLikeButton
//                 liked={item.liked.toString()}
//                 onClick={() => handleLike(item.id)}
//               >
//                 Like ({item.likes || 0})
//               </StyledLikeButton>
//
//               {/* Интерфейс для ответа на комментарий */}
//               {replyTo === item.id ? (
//                 <StyledReplyContainer>
//                   <StyledReplyTextarea
//                     value={replyText}
//                     onChange={(e) => setReplyText(e.target.value)}
//                   />
//                   <StyledReplyButton onClick={() => handleReply(item.id)}>
//                     Отправить ответ
//                   </StyledReplyButton>
//                 </StyledReplyContainer>
//               ) : (
//                 <StyledReplyButton onClick={() => setReplyTo(item.id)}>
//                   Ответить
//                 </StyledReplyButton>
//               )}
//             </StyledButtoncontainerComment>
//
//             {/* Отображение ответов */}
//             {item.replies && item.replies.length > 0 && (
//               <StyledReplyContainer>
//                 {item.replies.map((reply) => (
//                   <div key={reply.id}>
//                     <StyledCommentName>{reply.author}</StyledCommentName>
//                     <StyledCommentText>{reply.text}</StyledCommentText>
//                     <StyledCommentTimestamp>
//                       {reply.timestamp}
//                     </StyledCommentTimestamp>
//                   </div>
//                 ))}
//               </StyledReplyContainer>
//             )}
//           </StyledCommentContainer>
//         ))}
//       </StyledContainer>
//     </div>
//   );
// };
//
// export default MainLayout;

// import React, { useState } from 'react';
// import styled from 'styled-components';
// import {
//   useGetSomeDataQuery,
//   useAddCommitMutation,
//   useDeleteCommitMutation,
//   useToggleLikeCommentMutation,
// } from '../../api/rtkQuery'; // При необходимости скорректируйте путь
//
// const StyledContainer = styled.div`;
//   width: 653px;
//   height: 871px;
//   position: absolute;
//   top: 79px;
//   left: 261px;
//   border-radius: 8px;
//   font-size: 28px;
//   background-color: #ffffff;
//   color: #0e0d0d;
// `;
//
// const StyledTitle = styled.div`
//   margin-top: 30px;
//   margin-left: 30px;
//   color: black;
// `;
//
// const StyledCommit = styled.div`
//   position: fixed;
//   width: 500px;
//   height: 254px;
//   margin-top: 20px;
//   margin-left: 30px;
//   border-radius: 8px;
//   border: 1px solid blue;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//   padding: 20px;
//   color: #333;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
// `;
//
// const UserContainer = styled.div`
//   display: flex;
//   align-items: center; // Выравниваем элементы по центру по вертикали
//   gap: 10px; // Добавляем небольшой отступ между элементами
// `;
//
// const StyledName = styled.div`
//   position: relative;
//   font-size: 20px;
//   color: #101010;
// `;
//
// const StyledTextarea = styled.textarea`
//   height: 84px;
//   padding: 10px 10px 0 10px; /* Изменено для выравнивания текста с верхней границы */
//   border: 1px solid #ccc;
//   border-radius: 5px;
//   outline: none;
//   word-break: break-all; /* Добавлено для переноса текста */
//   white-space: pre-wrap; /* Добавлено для переноса текста */
//   resize: none; /* Запрещает изменение размеров textarea */
//   &:focus {
//     border-color: #007bff;
//   }
// `;
//
// const StyledLine = styled.div`
//   width: 100%; // Установите ширину в 100% для корректного отображения
//   height: 2px; // Увеличьте высоту линии
//   border-top: 1px solid #000000; // Используйте borderTop для создания линии
//   margin-top: 15px;
// `;
//
// const StyledButton = styled.button`
//   background-color: #0089ff;
//   color: white;
//   border: none;
//   padding: 10px 20px;
//   border-radius: 8px;
//   cursor: pointer;
//   margin-left: auto;
//   &:hover {
//     background-color: #0056b3;
//   }
// `;
//
// const StyledCommentContainer = styled.div`
//   position: relative;
//   width: 500px;
//   height: auto;
//   left: 30px;
//   top: 379px;
//   border: 1px solid black;
//   margin-bottom: 20px;
//   padding: 20px;
//   font-size: 16px;
// `;
//
// const StyledCommentName = styled.div`
//   font-size: 20px;
//   color: #101010;
//   margin-bottom: 10px;
// `;
//
// const StyledCommentText = styled.span`
//   display: block;
//   width: 100%;
//   word-break: break-word;
// `;
//
// const StyledCommentTimestamp = styled.div`
//   font-size: 14px;
//   color: #888;
//   margin-top: 10px;
// `;
//
// const StyledDeleteButton = styled.button`
//   background-color: #ff0000;
//   color: white;
//   border: none;
//   padding: 5px 10px;
//   border-radius: 8px;
//   cursor: pointer;
//   margin-top: 10px;
//   align-self: flex-end;
//   &:hover {
//     background-color: #cc0000;
//   }
// `;
//
// const StyledLikeButton = styled.button<{ liked: boolean }>`
//   background-color: ${({ liked }) => (liked ? 'blue' : 'gray')};
//   color: white;
//   border: none;
//   padding: 5px 10px;
//   border-radius: 8px;
//   cursor: pointer;
//   margin-top: 10px;
//   align-self: flex-end;
//   &:hover {
//     background-color: ${({ liked }) => (liked ? 'darkblue' : 'darkgray')};
//   }
// `;
//
// const MainLayout: React.FC = () => {
//   const [newComment, setNewComment] = useState('');
//   const { data = [], isLoading, refetch } = useGetSomeDataQuery();
//   const [addComment, { isError }] = useAddCommitMutation();
//   const [deleteComment] = useDeleteCommitMutation();
//   const [toggleLikeComment] = useToggleLikeCommentMutation();
//
//   const handleAddComment = async () => {
//     if (newComment) {
//       try {
//         const commitData = {
//           id: Date.now(),
//           img: '/img/IconMan.svg',
//           author: 'Jane Smith',
//           text: newComment,
//           timestamp: new Date().toLocaleString(),
//           liked: false,
//         };
//         await addComment(commitData).unwrap();
//         setNewComment('');
//       } catch (error) {
//         console.error('Не удалось добавить коммит: ', error);
//       }
//     }
//   };
//
//   const handleDeleteComment = async (id: string) => {
//     try {
//       await deleteComment(id).unwrap();
//       refetch(); // Обновляем данные после удаления комментария
//     } catch (error) {
//       console.error('Не удалось удалить коммит: ', error);
//     }
//   };
//
//   const handleLike = async (id: string) => {
//     try {
//       await toggleLikeComment(id).unwrap();
//       refetch(); // Обновляем данные после лайка комментария
//     } catch (error) {
//       console.error('Не удалось поставить лайк: ', error);
//     }
//   };
//
//   if (isLoading) return <h1>Загрузка...</h1>;
//
//   return (
//     <div style={{ position: 'relative' }}>
//       <StyledContainer>
//         <StyledTitle>Comments</StyledTitle>
//         <StyledCommit>
//           <UserContainer>
//             <img
//               src="/img/IconMan.svg"
//               alt="Описание изображения"
//               width="40"
//               height="40"
//             />
//             <StyledName>John Doe</StyledName>
//           </UserContainer>
//           <StyledTextarea
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//           />
//           <StyledLine />
//           <StyledButton onClick={handleAddComment}>Commit</StyledButton>
//         </StyledCommit>
//
//         {data.map((item) => (
//           <StyledCommentContainer key={item.id}>
//             <StyledCommentName>{item.author}</StyledCommentName>
//             {item.img && <img src={item.img} alt="Commit Image" />}
//             <StyledCommentText>{item.text}</StyledCommentText>
//             <StyledCommentTimestamp>{item.timestamp}</StyledCommentTimestamp>
//             <StyledDeleteButton onClick={() => handleDeleteComment(item.id)}>
//               Удалить
//             </StyledDeleteButton>
//             <StyledLikeButton
//               liked={item.liked || false}
//               onClick={() => handleLike(item.id)}
//             >
//               Like ({item.likes || 0})
//             </StyledLikeButton>
//           </StyledCommentContainer>
//         ))}
//       </StyledContainer>
//     </div>
//   );
// };
//
// export default MainLayout;

// import React, { useState } from 'react';
// import styled from 'styled-components';
// import {
//   useGetSomeDataQuery,
//   useAddCommitMutation,
//   useDeleteCommitMutation,
//   useToggleLikeCommentMutation,
// } from '../../api/rtkQuery'; // При необходимости скорректируйте путь
//
// const StyledContainer = styled.div`
//   width: 653px;
//   height: 871px;
//   position: absolute;
//   top: 79px;
//   left: 261px;
//   border-radius: 8px;
//   font-size: 28px;
//   background-color: #ffffff;
//   color: #0e0d0d;
// `;
//
// const StyledTitle = styled.div`
//   margin-top: 30px;
//   margin-left: 30px;
//   color: black;
// `;
//
// const StyledCommit = styled.div`
//   position: fixed;
//   width: 500px;
//   height: 254px;
//   margin-top: 20px;
//   margin-left: 30px;
//   border-radius: 8px;
//   border: 1px solid blue;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//   padding: 20px;
//   color: #333;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
// `;
//
// const UserContainer = styled.div`
//   display: flex;
//   align-items: center; // Выравниваем элементы по центру по вертикали
//   gap: 10px; // Добавляем небольшой отступ между элементами
// `;
//
// const StyledName = styled.div`
//   position: relative;
//   font-size: 20px;
//   color: #101010;
// `;
//
// const StyledTextarea = styled.textarea`
//   height: 84px;
//   padding: 10px 10px 0 10px; /* Изменено для выравнивания текста с верхней границы */
//   border: 1px solid #ccc;
//   border-radius: 5px;
//   outline: none;
//   word-break: break-all; /* Добавлено для переноса текста */
//   white-space: pre-wrap; /* Добавлено для переноса текста */
//   resize: none; /* Запрещает изменение размеров textarea */
//   &:focus {
//     border-color: #007bff;
//   }
// `;
//
// const StyledLine = styled.div`
//   width: 100%; // Установите ширину в 100% для корректного отображения
//   height: 2px; // Увеличьте высоту линии
//   border-top: 1px solid #000000; // Используйте borderTop для создания линии
//   margin-top: 15px;
// `;
//
// const StyledButton = styled.button`
//   background-color: #0089ff;
//   color: white;
//   border: none;
//   padding: 10px 20px;
//   border-radius: 8px;
//   cursor: pointer;
//   margin-left: auto;
//   &:hover {
//     background-color: #0056b3;
//   }
// `;
//
// const StyledCommentContainer = styled.div`
//   position: relative;
//   width: 500px;
//   height: auto;
//   left: 30px;
//   top: 379px;
//   border: 1px solid black;
//   margin-bottom: 20px;
//   padding: 20px;
//   font-size: 16px;
// `;
//
// const StyledCommentName = styled.div`
//   font-size: 20px;
//   color: #101010;
//   margin-bottom: 10px;
// `;
//
// const StyledCommentText = styled.span`
//   display: block;
//   width: 100%;
//   word-break: break-word;
// `;
//
// const StyledCommentTimestamp = styled.div`
//   font-size: 14px;
//   color: #888;
//   margin-top: 10px;
// `;
//
// const StyledDeleteButton = styled.button`
//   background-color: #ff0000;
//   color: white;
//   border: none;
//   padding: 5px 10px;
//   border-radius: 8px;
//   cursor: pointer;
//   margin-top: 10px;
//   align-self: flex-end;
//   &:hover {
//     background-color: #cc0000;
//   }
// `;
//
// const StyledLikeButton = styled.button<{ liked: boolean }>`
//   background-color: ${({ liked }) => (liked ? 'blue' : 'gray')};
//   color: white;
//   border: none;
//   padding: 5px 10px;
//   border-radius: 8px;
//   cursor: pointer;
//   margin-top: 10px;
//   align-self: flex-end;
//   &:hover {
//     background-color: ${({ liked }) => (liked ? 'darkblue' : 'darkgray')};
//   }
// `;
//
// const MainLayout: React.FC = () => {
//   const [newComment, setNewComment] = useState('');
//   const { data = [], isLoading, refetch } = useGetSomeDataQuery();
//   const [addComment, { isError }] = useAddCommitMutation();
//   const [deleteComment] = useDeleteCommitMutation();
//   const [toggleLikeComment] = useToggleLikeCommentMutation();
//
//   const handleAddComment = async () => {
//     if (newComment) {
//       try {
//         const commitData = {
//           id: Date.now(),
//           img: '/img/IconMan.svg',
//           author: 'Jane Smith',
//           text: newComment,
//           timestamp: new Date().toLocaleString(),
//           liked: false,
//         };
//         await addComment(commitData).unwrap();
//         setNewComment('');
//       } catch (error) {
//         console.error('Не удалось добавить коммит: ', error);
//       }
//     }
//   };
//
//   const handleDeleteComment = async (id: string) => {
//     try {
//       await deleteComment(id).unwrap();
//       refetch(); // Обновляем данные после удаления комментария
//     } catch (error) {
//       console.error('Не удалось удалить коммит: ', error);
//     }
//   };
//
//   const handleLike = (id: string) => {
//     toggleLikeComment(id);
//   };
//
//   if (isLoading) return <h1>Загрузка...</h1>;
//
//   return (
//     <div style={{ position: 'relative' }}>
//       <StyledContainer>
//         <StyledTitle>Comments</StyledTitle>
//         <StyledCommit>
//           <UserContainer>
//             <img
//               src="/img/IconMan.svg"
//               alt="Описание изображения"
//               width="40"
//               height="40"
//             />
//             <StyledName>John Doe</StyledName>
//           </UserContainer>
//           <StyledTextarea
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//           />
//           <StyledLine />
//           <StyledButton onClick={handleAddComment}>Commit</StyledButton>
//         </StyledCommit>
//
//         {data.map((item) => (
//           <StyledCommentContainer key={item.id}>
//             <StyledCommentName>{item.author}</StyledCommentName>
//             {item.img && <img src={item.img} alt="Commit Image" />}
//             <StyledCommentText>{item.text}</StyledCommentText>
//             <StyledCommentTimestamp>{item.timestamp}</StyledCommentTimestamp>
//             <StyledDeleteButton onClick={() => handleDeleteComment(item.id)}>
//               Удалить
//             </StyledDeleteButton>
//             <StyledLikeButton
//               liked={item.liked || false}
//               onClick={() => handleLike(item.id)}
//             >
//               Like ({item.likes || 0})
//             </StyledLikeButton>
//           </StyledCommentContainer>
//         ))}
//       </StyledContainer>
//     </div>
//   );
// };
//
// export default MainLayout;

// import React, { useState } from 'react';
// import styled from 'styled-components';
// import {
//   useGetSomeDataQuery,
//   useAddCommitMutation,
//   useDeleteCommitMutation,
//   useToggleLikeCommentMutation,
// } from '../../api/rtkQuery'; // При необходимости скорректируйте путь
//
// const StyledContainer = styled.div`
//   width: 653px;
//   height: 871px;
//   position: absolute;
//   top: 79px;
//   left: 261px;
//   border-radius: 8px;
//   font-size: 28px;
//   background-color: #ffffff;
//   color: #0e0d0d;
// `;
//
// const StyledTitle = styled.div`
//   margin-top: 30px;
//   margin-left: 30px;
//   color: black;
// `;
//
// const StyledCommit = styled.div`
//   position: fixed;
//   width: 500px;
//   height: 254px;
//   margin-top: 20px;
//   margin-left: 30px;
//   border-radius: 8px;
//   border: 1px solid blue;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//   padding: 20px;
//   color: #333;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
// `;
//
// const UserContainer = styled.div`
//   display: flex;
//   align-items: center; // Выравниваем элементы по центру по вертикали
//   gap: 10px; // Добавляем небольшой отступ между элементами
// `;
//
// const StyledName = styled.div`
//   position: relative;
//   font-size: 20px;
//   color: #101010;
// `;
//
// const StyledTextarea = styled.textarea`
//   height: 84px;
//   padding: 10px 10px 0 10px; /* Изменено для выравнивания текста с верхней границы */
//   border: 1px solid #ccc;
//   border-radius: 5px;
//   outline: none;
//   word-break: break-all; /* Добавлено для переноса текста */
//   white-space: pre-wrap; /* Добавлено для переноса текста */
//   resize: none; /* Запрещает изменение размеров textarea */
//   &:focus {
//     border-color: #007bff;
//   }
// `;
//
// const StyledLine = styled.div`
//   width: 100%; // Установите ширину в 100% для корректного отображения
//   height: 2px; // Увеличьте высоту линии
//   border-top: 1px solid #000000; // Используйте borderTop для создания линии
//   margin-top: 15px;
// `;
//
// const StyledButton = styled.button`
//   background-color: #0089ff;
//   color: white;
//   border: none;
//   padding: 10px 20px;
//   border-radius: 8px;
//   cursor: pointer;
//   margin-left: auto;
//   &:hover {
//     background-color: #0056b3;
//   }
// `;
//
// const StyledCommentContainer = styled.div`
//   position: relative;
//   width: 500px;
//   height: auto;
//   left: 30px;
//   top: 379px;
//   border: 1px solid black;
//   margin-bottom: 20px;
//   padding: 20px;
//   font-size: 16px;
// `;
//
// const StyledCommentName = styled.div`
//   font-size: 20px;
//   color: #101010;
//   margin-bottom: 10px;
// `;
//
// const StyledCommentText = styled.span`
//   display: block;
//   width: 100%;
//   word-break: break-word;
// `;
//
// const StyledCommentTimestamp = styled.div`
//   font-size: 14px;
//   color: #888;
//   margin-top: 10px;
// `;
//
// const StyledDeleteButton = styled.button`
//   background-color: #ff0000;
//   color: white;
//   border: none;
//   padding: 5px 10px;
//   border-radius: 8px;
//   cursor: pointer;
//   margin-top: 10px;
//   align-self: flex-end;
//   &:hover {
//     background-color: #cc0000;
//   }
// `;
//
// const MainLayout: React.FC = () => {
//   const [newComment, setNewComment] = useState('');
//   const { data = [], isLoading, refetch } = useGetSomeDataQuery();
//   const [addComment, { isError }] = useAddCommitMutation();
//   const [deleteComment] = useDeleteCommitMutation();
//   const [toggleLikeComment] = useToggleLikeCommentMutation();
//
//   const handleAddComment = async () => {
//     if (newComment) {
//       try {
//         const commitData = {
//           id: Date.now(),
//           img: '/img/IconMan.svg',
//           author: 'Jane Smith',
//           text: newComment,
//           timestamp: new Date().toLocaleString(),
//           liked: false,
//         };
//         await addComment(commitData).unwrap();
//         setNewComment('');
//       } catch (error) {
//         console.error('Не удалось добавить коммит: ', error);
//       }
//     }
//   };
//
//   const handleDeleteComment = async (id: string) => {
//     try {
//       await deleteComment(id).unwrap();
//       refetch(); // Обновляем данные после удаления комментария
//     } catch (error) {
//       console.error('Не удалось удалить коммит: ', error);
//     }
//   };
//
//   const handleLike = () => {
//     toggleLikeComment(comment.id);
//   };
//
//   if (isLoading) return <h1>Загрузка...</h1>;
//
//   return (
//     <div style={{ position: 'relative' }}>
//       <StyledContainer>
//         <StyledTitle>Comments</StyledTitle>
//         <StyledCommit>
//           <UserContainer>
//             <img
//               src="/img/IconMan.svg"
//               alt="Описание изображения"
//               width="40"
//               height="40"
//             />
//             <StyledName>John Doe</StyledName>
//           </UserContainer>
//           <StyledTextarea
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//           />
//           <StyledLine />
//           <StyledButton onClick={handleAddComment}>Commit</StyledButton>
//         </StyledCommit>
//
//         {data.map((item) => (
//           <StyledCommentContainer key={item.id}>
//             <StyledCommentName>{item.author}</StyledCommentName>
//             {item.img && <img src={item.img} alt="Commit Image" />}
//             <StyledCommentText>{item.text}</StyledCommentText>
//             <StyledCommentTimestamp>{item.timestamp}</StyledCommentTimestamp>
//             <StyledDeleteButton onClick={() => handleDeleteComment(item.id)}>
//               Удалить
//             </StyledDeleteButton>
//             <button onClick={handleLike}>Like</button>
//           </StyledCommentContainer>
//         ))}
//       </StyledContainer>
//     </div>
//   );
// };
//
// export default MainLayout;

// import React, { useState } from 'react';
// import styled from 'styled-components';
// import {
//   useGetSomeDataQuery,
//   useAddCommitMutation,
//   useDeleteCommitMutation,
// } from '../../api/rtkQuery';
//
// const StyledContainer = styled.div`
//   width: 653px;
//   height: 871px;
//   position: absolute;
//   top: 79px;
//   left: 261px;
//   border-radius: 8px;
//   font-size: 28px;
//   background-color: #ffffff;
//   color: #0e0d0d;
// `;
//
// const StyledTitle = styled.div`
//   margin-top: 30px;
//   margin-left: 30px;
//   color: black;
// `;
//
// const StyledCommit = styled.div`
//   position: fixed;
//   width: 500px;
//   height: 254px;
//   margin-top: 20px;
//   margin-left: 30px;
//   border-radius: 8px;
//   border: 1px solid blue;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//   padding: 20px;
//   color: #333;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
// `;
//
// const UserContainer = styled.div`
//   display: flex;
//   align-items: center; // Выравниваем элементы по центру по вертикали
//   gap: 10px; // Добавляем небольшой отступ между элементами
// `;
//
// const StyledName = styled.div`
//   position: relative;
//   font-size: 20px;
//   color: #101010;
// `;
//
// const StyledTextarea = styled.textarea`
//   height: 84px;
//   padding: 10px 10px 0 10px; /* Изменено для выравнивания текста с верхней границы */
//   border: 1px solid #ccc;
//   border-radius: 5px;
//   outline: none;
//   word-break: break-all; /* Добавлено для переноса текста */
//   white-space: pre-wrap; /* Добавлено для переноса текста */
//   resize: none; /* Запрещает изменение размеров textarea */
//   &:focus {
//     border-color: #007bff;
//   }
// `;
//
// const StyledLine = styled.div`
//   width: 100%; // Установите ширину в 100% для корректного отображения
//   height: 2px; // Увеличьте высоту линии
//   border-top: 1px solid #000000; // Используйте borderTop для создания линии
//   margin-top: 15px;
// `;
//
// const StyledButton = styled.button`
//   background-color: #0089ff;
//   color: white;
//   border: none;
//   padding: 10px 20px;
//   border-radius: 8px;
//   cursor: pointer;
//   margin-left: auto;
//   &:hover {
//     background-color: #0056b3;
//   }
// `;
//
// const StyledCommentContainer = styled.div`
//   position: relative;
//   width: 500px;
//   height: auto;
//   left: 30px;
//   top: 379px;
//   border: 1px solid black;
//   margin-bottom: 20px;
//   padding: 20px;
//   font-size: 16px;
// `;
//
// const StyledCommentName = styled.div`
//   font-size: 20px;
//   color: #101010;
//   margin-bottom: 10px;
// `;
//
// const StyledCommentText = styled.span`
//   display: block;
//   width: 100%;
//   word-break: break-word;
// `;
//
// const StyledCommentTimestamp = styled.div`
//   font-size: 14px;
//   color: #888;
//   margin-top: 10px;
// `;
//
// const StyledDeleteButton = styled.button`
//   background-color: #ff0000;
//   color: white;
//   border: none;
//   padding: 5px 10px;
//   border-radius: 8px;
//   cursor: pointer;
//   margin-top: 10px;
//   align-self: flex-end;
//   &:hover {
//     background-color: #cc0000;
//   }
// `;
//
// // rabotaet;
// const MainLayout: React.FC = () => {
//   const [newCommit, setNewCommit] = useState('');
//   const { data = [], isLoading } = useGetSomeDataQuery();
//   const [addCommit, { isError }] = useAddCommitMutation();
//   const [deleteCommit] = useDeleteCommitMutation();
//
//   const handleAddCommit = async () => {
//     if (newCommit) {
//       try {
//         const commitData = {
//           id: Date.now(),
//           img: '/img/IconMan.svg',
//           author: 'Jane Smith',
//           text: newCommit,
//           timestamp: new Date().toLocaleString(),
//         };
//         await addCommit(commitData).unwrap();
//         setNewCommit('');
//       } catch (error) {
//         console.error('Не удалось добавить коммит: ', error);
//       }
//     }
//   };
//
//   const handleDeleteCommit = async (id: string) => {
//     try {
//       await deleteCommit(id).unwrap();
//     } catch (error) {
//       console.error('Не удалось удалить коммит: ', error);
//     }
//   };
//
//   if (isLoading) return <h1>Загрузка...</h1>;
//
//   return (
//     <div style={{ position: 'relative' }}>
//       <StyledContainer>
//         <StyledTitle>Comments</StyledTitle>
//         <StyledCommit>
//           <UserContainer>
//             <img
//               src="/img/IconMan.svg"
//               alt="Описание изображения"
//               width="40"
//               height="40"
//             />
//             <StyledName>John Doe</StyledName>
//           </UserContainer>
//           <StyledTextarea
//             value={newCommit}
//             onChange={(e) => setNewCommit(e.target.value)}
//           />
//           <StyledLine />
//           <StyledButton onClick={handleAddCommit}>Commit</StyledButton>
//         </StyledCommit>
//
//         {data.map((item) => (
//           <StyledCommentContainer key={item.id}>
//             <StyledCommentName>{item.author}</StyledCommentName>
//             {item.img && <img src={item.img} alt="Commit Image" />}
//             <StyledCommentText>{item.text}</StyledCommentText>
//             <StyledCommentTimestamp>{item.timestamp}</StyledCommentTimestamp>
//             <StyledDeleteButton onClick={() => handleDeleteCommit(item.id)}>
//               Удалить
//             </StyledDeleteButton>
//           </StyledCommentContainer>
//         ))}
//       </StyledContainer>
//     </div>
//   );
// };
//
// export default MainLayout;

// import React, { useState } from 'react';
// import styled from 'styled-components';
// import { CardComments } from './CardComents';
// import {
//   useGetSomeDataQuery,
//   useAddCommitMutation,
//   useDeleteCommitMutation,
// } from '../../api/rtkQuery'; // При необходимости скорректируйте путь
//
// const StyledContainer = styled.div`
//   width: 653px;
//   height: 871px;
//   position: absolute;
//   top: 79px;
//   left: 261px;
//   border-radius: 8px;
//   font-size: 28px;
//   background-color: #ffffff;
//   color: #0e0d0d;
// `;
//
// const StyledTitle = styled.div`
//   margin-top: 30px;
//   margin-left: 30px;
//   color: black;
// `;
//
// const StyledCommit = styled.div`
//   position: fixed;
//   width: 500px;
//   height: 254px;
//   margin-top: 20px;
//   margin-left: 30px;
//   border-radius: 8px;
//   border: 1px solid blue;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//   padding: 20px;
//   color: #333;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
// `;
//
// const UserContainer = styled.div`
//   display: flex;
//   align-items: center; // Выравниваем элементы по центру по вертикали
//   gap: 10px; // Добавляем небольшой отступ между элементами
// `;
//
// const StyledName = styled.div`
//   position: relative;
//   font-size: 20px;
//   color: #101010;
// `;
//
// const StyledTextarea = styled.textarea`
//   height: 84px;
//   padding: 10px 10px 0 10px; /* Изменено для выравнивания текста с верхней границы */
//   border: 1px solid #ccc;
//   border-radius: 5px;
//   outline: none;
//   word-break: break-all; /* Добавлено для переноса текста */
//   white-space: pre-wrap; /* Добавлено для переноса текста */
//   resize: none; /* Запрещает изменение размеров textarea */
//   &:focus {
//     border-color: #007bff;
//   }
// `;
//
// const StyledLine = styled.div`
//   width: 100%; // Установите ширину в 100% для корректного отображения
//   height: 2px; // Увеличьте высоту линии
//   border-top: 1px solid #000000; // Используйте borderTop для создания линии
//   margin-top: 15px;
// `;
//
// const StyledButton = styled.button`
//   background-color: #0089ff;
//   color: white;
//   border: none;
//   padding: 10px 20px;
//   border-radius: 8px;
//   cursor: pointer;
//   margin-left: auto;
//   &:hover {
//     background-color: #0056b3;
//   }
// `;
//
// const MainLayout: React.FC = () => {
//   const [newCommit, setNewCommit] = useState('');
//   const { data = [], isLoading } = useGetSomeDataQuery();
//   const [addCommit, { isError }] = useAddCommitMutation();
//   const [deleteCommit] = useDeleteCommitMutation();
//
//   const handleAddCommit = async () => {
//     if (newCommit) {
//       try {
//         await addCommit({ name: newCommit }).unwrap();
//         setNewCommit('');
//       } catch (error) {
//         console.error('Не удалось добавить коммит: ', error);
//       }
//     }
//   };
//
//   const handleDeleteCommit = async (id: string) => {
//     try {
//       await deleteCommit(id).unwrap();
//     } catch (error) {
//       console.error('Не удалось удалить коммит: ', error);
//     }
//   };
//
//   if (isLoading) return <h1>Загрузка...</h1>;
//
//   return (
//     <div style={{ position: 'relative' }}>
//       <StyledContainer>
//         <StyledTitle>Comments</StyledTitle>
//         <StyledCommit>
//           <UserContainer>
//             <img
//               src="/img/IconMan.svg"
//               alt="Описание изображения"
//               width="40"
//               height="40"
//             />
//             <StyledName>John Doe</StyledName>
//           </UserContainer>
//           <StyledTextarea
//             value={newCommit}
//             onChange={(e) => setNewCommit(e.target.value)}
//           />
//           <StyledLine />
//           <StyledButton onClick={handleAddCommit}>Commit</StyledButton>
//         </StyledCommit>
//         <CardComments />
//
//         {/*<ul>*/}
//         {/*  {data.map((item) => (*/}
//         {/*    <li key={item.id} onClick={() => handleDeleteCommit(item.id)}>*/}
//         {/*      {item.name}*/}
//         {/*    </li>*/}
//         {/*  ))}*/}
//         {/*</ul>*/}
//       </StyledContainer>
//     </div>
//   );
// };
//
// export default MainLayout;
