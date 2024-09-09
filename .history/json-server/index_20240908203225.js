import express from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const app = express();
app.use(bodyParser.json());

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({
  comments: [],
  replies: [],
}).write();

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

app.get('/comments', (req, res) => {
  const comments = db.get('comments').value();
  res.json(comments);
});

app.get('/replies', (req, res) => {
  const replies = db.get('replies').value();
  res.json(replies);
});

app.delete('/comments/:id', (req, res) => {
  const commentId = req.params.id;

  db.get('comments').remove({ id: commentId }).write();

  db.get('replies')
    .remove((reply) => reply.commentId === commentId)
    .write();

  res.status(200).json({ message: 'Комментарий и связанные ответы удалены' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
