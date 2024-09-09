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

// Маршрут для добавления нового комментария
app.post('/comments', (req, res) => {
  const newComment = req.body;
  if (!newComment || !newComment.text) {
    return res.status(400).json({ error: 'Comment text is required' });
  }
  newComment.id = uuidv4();
  newComment.replies = [];

  const comments = db.get('comments').value();
  comments.push(newComment);
  db.set('comments', comments).write();

  res.status(201).json(newComment);
});

// Маршрут для обработки лайков на комментарии
app.post('/comments/:id/like', (req, res) => {
  const commentId = req.params.id;
  let comments = db.get('comments').value();
  let comment = comments.find((c) => c.id === commentId);

  if (!comment) {
    comment = { id: commentId, likes: 0, liked: false };
    comments.push(comment);
  }

  if (!comment.likes) {
    comment.likes = 0;
  }
  if (comment.liked) {
    comment.likes -= 1;
  } else {
    comment.likes += 1;
  }
  comment.liked = !comment.liked;

  db.set('comments', comments).write();
  res.json(comment);
});

// Маршрут для добавления ответа к комментарию
app.post('/comments/:commentId', (req, res) => {
  const commentId = req.params.commentId;
  const replyData = req.body;
  replyData.id = uuidv4(); // Генерация уникального ID для ответа
  replyData.timestamp = new Date().toISOString();

  const comments = db.get('comments').value();
  const comment = comments.find((c) => c.id === commentId);

  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  if (!comment.replies) {
    comment.replies = [];
  }

  comment.replies.push(replyData);
  db.set('comments', comments).write();

  res.status(201).json(replyData);
});

// Маршрут для получения конкретного ответа к комментарию
app.get('/comments/:commentId/replies/:replyId', (req, res) => {
  const commentId = req.params.commentId;
  const replyId = req.params.replyId;
  const comments = db.get('comments').value();
  const comment = comments.find(
    (c) => c.id === commentId && c.replies.some((r) => r.id === replyId),
  );

  if (!comment) {
    return res.status(404).json({ error: 'Comment or reply not found' });
  }

  const reply = comment.replies.find((r) => r.id === replyId);
  res.json(reply);
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
