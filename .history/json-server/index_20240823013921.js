const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();
const dbPath = path.join(__dirname, 'json-server', 'db.json');
console.log('DB Path:', dbPath);
const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(cors());

server.post('/comments', (req, res) => {
  const newComment = req.body;
  newComment.id = uuidv4();
  newComment.replies = [];
  const comments = router.db.get('comments').value();
  comments.push(newComment);
  try {
    router.db.write();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to write to database' });
  }
});

server.post('/comments/:id/like', (req, res) => {
  const commentId = req.params.id;
  const comments = router.db.get('comments').value();
  let comment = comments.find((c) => c.id === commentId);

  if (!comment) {
    comment = { id: commentId, likes: 0, liked: false, replies: [] };
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

  try {
    router.db.write();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to write to database' });
  }
});

server.post('/comments/:id/replies', (req, res) => {
  const commentId = req.params.id;
  const newReply = req.body;
  const comments = router.db.get('comments').value();

  const commentIndex = comments.findIndex((c) => c.id === commentId);

  if (commentIndex !== -1) {
    if (!comments[commentIndex].replies) {
      comments[commentIndex].replies = [];
    }
    newReply.id = uuidv4();
    comments[commentIndex].replies.push(newReply);
    try {
      router.db.write();
      res.status(201).json(newReply);
    } catch (error) {
      res.status(500).json({ error: 'Failed to write to database' });
    }
  } else {
    res.status(404).json({ error: 'Comment not found' });
  }
});

server.use(router);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
