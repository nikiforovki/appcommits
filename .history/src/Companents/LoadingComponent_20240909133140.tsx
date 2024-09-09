import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styled from 'styled-components';
import { LoadingProps } from './interface';

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
  font-weight: ${({ isbold }) => (isbold ? 'bold' : 'normal')};
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

// const StyledTextarea = styled.textarea<{
//   isBold: boolean;
//   isItalic: boolean;
//   isLink: boolean;
// }>`
//   font-size: 16px;
//   font-weight: ${({ isBold }) => (isBold ? 'bold' : 'normal')};
//   font-style: ${({ isItalic }) => (isItalic ? 'italic' : 'normal')};
//   text-decoration: ${({ isLink }) => (isLink ? 'underline' : 'none')};
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

const StyledButtoncontainerComment = styled.div`
  display: flex;
  align-items: flex-end;
  word-break: break-word;
  gap: 15px;
`;

const LoadingComponent: React.FC<LoadingProps> = ({
  commentsCount,
  newComment,
  setNewComment,
  toggleBoldFormatting,
  toggleItalicFormatting,
  toggleLinkFormatting,
  handleAddComment,
}) => {
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
            isBold={false}
            isItalic={false}
            isLink={false}
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
              <Skeleton circle width={40} height={40} />
              <Skeleton width={80} height={20} />
            </StyledUserContainer>
            <Skeleton width="100%" height={60} />
            <StyledButtoncontainerComment>
              <Skeleton width={80} height={30} />
              <Skeleton width={80} height={30} />
              <Skeleton width={50} height={30} />
              <Skeleton width={100} height={30} />
            </StyledButtoncontainerComment>
          </StyledCommentContainer>
        ))}
      </StyledContainer>
    </div>
  );
};

export default LoadingComponent;

// import React from 'react';
// import Skeleton from 'react-loading-skeleton';
// import 'react-loading-skeleton/dist/skeleton.css';
// import styled from 'styled-components';
// import { LoadingProps } from './interface';

// // interface LoadingProps {
// //   commentsCount: number;
// //   newComment: string;
// //   setNewComment: (text: string) => void;
// //   toggleBoldFormatting: (id: string) => void;
// //   toggleItalicFormatting: (id: string) => void;
// //   toggleLinkFormatting: (id: string) => void;
// //   handleAddComment: () => void;
// // }

// const StyledContainer = styled.div<{ commentsCount: number }>`
//   width: 600px;
//   height: ${(props) => `${props.commentsCount * 300}px`};
//   min-height: 671px;
//   position: absolute;
//   top: 79px;
//   left: 261px;
//   border-radius: 8px;
//   font-size: 28px;
//   background-color: #ffffff;
//   color: #0e0d0d;
// `;

// const StyledTitle = styled.div`
//   font-family: SourceSansPro-Black;
//   font-weight: 600;
//   font-size: 28px;
//   margin-top: 30px;
//   margin-left: 30px;
//   color: black;
// `;

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

// const StyledUserContainer = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   margin-bottom: 15px;
// `;

// const StyledName = styled.div`
//   font-family: SourceSansPro-Black;
//   font-weight: 600;
//   font-size: 20px;
//   position: relative;
//   font-size: 20px;
//   color: #101010;
// `;

// const StyledTextarea = styled.textarea<{
//   isBold: boolean;
//   isItalic: boolean;
//   isLink: boolean;
// }>`
//   font-size: 16px;
//   font-weight: ${({ isBold }) => (isBold ? 'bold' : 'normal')};
//   font-style: ${({ isItalic }) => (isItalic ? 'italic' : 'normal')};
//   text-decoration: ${({ isLink }) => (isLink ? 'underline' : 'none')};
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

// const StyledLine = styled.div`
//   width: 100%;
//   height: 2px;
//   border-top: 1px solid #000000;
//   margin-top: 15px;
// `;

// const IconsAndButtonContainer = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 12px;
//   margin-top: 27px;
// `;

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

// const StyledCommentContainer = styled.div`
//   width: 500px;
//   height: auto;
//   margin-left: 30px;
//   margin-bottom: 20px;
//   padding: 20px;
//   font-size: 16px;
// `;

// const StyledButtoncontainerComment = styled.div`
//   display: flex;
//   align-items: flex-end;
//   word-break: break-word;
//   gap: 15px;
// `;

// const LoadingComponent: React.FC<LoadingProps> = ({
//   commentsCount,
//   newComment,
//   setNewComment,
//   toggleBoldFormatting,
//   toggleItalicFormatting,
//   toggleLinkFormatting,
//   handleAddComment,
// }) => {
//   return (
//     <div style={{ position: 'relative' }}>
//       <StyledContainer>
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

//           <IconsAndButtonContainer>
//             <img
//               src="/img/IconBoldText.svg"
//               alt="Иконка форматирования текста"
//               width="20"
//               height="20"
//               onClick={() => toggleBoldFormatting('newComment')}
//               style={{ cursor: 'pointer' }}
//             />
//             <img
//               src="/img/IconItalicText.svg"
//               alt="Иконка курсива"
//               width="20"
//               height="20"
//               onClick={() => toggleItalicFormatting('newComment')}
//               style={{ cursor: 'pointer' }}
//             />
//             <img
//               src="/img/IconLink.svg"
//               alt="Иконка ссылка"
//               width="20"
//               height="20"
//               onClick={() => toggleLinkFormatting('newComment')}
//               style={{ cursor: 'pointer' }}
//             />

//             <StyledButtonComment onClick={handleAddComment}>
//               Comment
//             </StyledButtonComment>
//           </IconsAndButtonContainer>
//         </StyledCommentBorder>

//         {[...Array(commentsCount || 0)].map((_, index) => (
//           <StyledCommentContainer key={index}>
//             <StyledUserContainer>
//               <Skeleton circle width={40} height={40} color="darkgray" />
//               <Skeleton width={80} height={20} color="darkgray" />
//             </StyledUserContainer>
//             <Skeleton width="100%" height={60} color="darkgray" />
//             <StyledButtoncontainerComment>
//               <Skeleton width={80} height={30} color="darkgray" />
//               <Skeleton width={80} height={30} color="darkgray" />
//               <Skeleton width={50} height={30} color="darkgray" />
//               <Skeleton width={100} height={30} color="darkgray" />
//             </StyledButtoncontainerComment>
//           </StyledCommentContainer>
//         ))}
//       </StyledContainer>
//     </div>
//   );
// };

// export default LoadingComponent;
