import React from 'react';
import MainLayout from './Companents/MainLayout';
import './styles/GlobalStyles.css';

const App = () => {
  return <MainLayout />;
};

export default App;

// import React, { useState } from 'react';
// import MainLayout from '../src/Companents/MainLayout';
// import './styles/GlobalStyles.css';
// import {
//   useGetSomeDataQuery,
//   useAddCommitMutation,
//   useDeleteCommitMutation,
// } from '../api/rtkQuery';
//
// const App: React.FC = () => {
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
//         console.error('Failed to add commit: ', error);
//       }
//     }
//   };
//
//   const handleDeleteCommit = async (id: string) => {
//     try {
//       await deleteCommit(id).unwrap();
//     } catch (error) {
//       console.error('Failed to delete commit: ', error);
//     }
//   };
//
//   if (isLoading) return <h1>Loading...</h1>;
//
//   return (
//     <div>
//       <input
//         type="text"
//         value={newCommit}
//         onChange={(e) => setNewCommit(e.target.value)}
//       />
//       <button onClick={handleAddCommit}>Add Commit</button>
//       <div>
//         {/*<MainLayout />*/}
//         <ul>
//           {data.map((item) => (
//             <li key={item.id} onClick={() => handleDeleteCommit(item.id)}>
//               {item.name}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };
//
// export default App;

// import React, { useState } from 'react';
// import MainLayout from '../src/Companents/MainLayout';
// import './styles/GlobalStyles.css';
// import { useGetSomeDataQuery, useAddCommitMutation } from '../api/rtkQuery';
//
// const App: React.FC = () => {
//   const [count, setCount] = useState('');
//   const [newCommit, setNewCommit] = useState('');
//   const { data = [], isLoading } = useGetSomeDataQuery(count);
//   const [addCommit, { isError }] = useAddCommitMutation();
//
//   const handleAddCommit = async () => {
//     if ( newCommit) {
//       await addCommit({name: newCommit}.unwrap();
//       setNewCommit('')
//       )
//     }
//   }
//
//   if (isLoading) return <h1>Loading...</h1>;
//
//   return (
//     <div>
//       <input
//         type='text'
//         value={newCommit}
//         onChange={(e) => {handleAddCommit(e.target.value)}
//           />
//        <button onClick= {handleAddCommit}>Add Commit</button>
//     </div>
//     <div>
//       {/*<MainLayout />*/}
//       <ul>
//         {data.map((item) => (
//           <li key={item.id}>{item.name}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };
//
// export default App;
