import express from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const app = express();
app.use(bodyParser.json());

// Настройка LowDB
const adapter = new FileSync('db.json');
const db = low(adapter);

// Инициализация базы данных
db.defaults({
  comments: [],
  replies: [],
}).write();

// Маршрут для добавления нового комментария
app.post('/comments', (req, res) => {
  const { postId, text } = req.body;

  const post = db.posts.find((p) => p.id === postId);

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const newComment = {
    id: uuidv4(),
    postId: postId,
    text: text,
  };

  db.get('comments').push(newComment).write();

  res.status(201).json(newComment);
});

// Маршрут для добавления ответа на комментарий
app.post('/replies', (req, res) => {
  const { commentId, text } = req.body;

  const comment = db.get('comments').find({ id: commentId }).value();

  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  const newReply = {
    id: uuidv4(),
    commentId: commentId,
    text: text,
  };

  db.get('replies').push(newReply).write();

  res.status(201).json(newReply);
});

// Маршрут для получения всех комментариев
app.get('/comments', (req, res) => {
  const comments = db.get('comments').value();
  res.json(comments);
});

// Маршрут для получения всех ответов на комментарии
app.get('/replies', (req, res) => {
  const replies = db.get('replies').value();
  res.json(replies);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// server.post('/comments', (req, res) => {
//   const newComment = req.body;
//   newComment.id = uuidv4();
//   newComment.replies = [];
//   const comments = router.db.get('comments').value();
//   comments.push(newComment);
//   try {
//     router.db.write();
//     console.log('New comment added:', newComment);
//     res.status(201).json(newComment);
//   } catch (error) {
//     console.error('Failed to write to database:', error);
//     res.status(500).json({ error: 'Failed to write to database' });
//   }
// });

// server.post('/comments/:id/replies', (req, res) => {
//   const commentId = req.params.id;
//   const newReply = req.body;
//   const comments = router.db.get('comments').value();

//   const commentIndex = comments.findIndex((c) => c.id === commentId);

//   if (commentIndex !== -1) {
//     if (!comments[commentIndex].replies) {
//       comments[commentIndex].replies = [];
//     }
//     newReply.id = uuidv4();
//     comments[commentIndex].replies.push(newReply);
//     try {
//       router.db.write();
//       console.log('New reply added:', newReply);
//       res.status(201).json(newReply);
//     } catch (error) {
//       console.error('Failed to write to database:', error);
//       res.status(500).json({ error: 'Failed to write to database' });
//     }
//   } else {
//     res.status(404).json({ error: 'Comment not found' });
//   }
// });
