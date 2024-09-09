const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('json-server/db.json');
const middlewares = jsonServer.defaults();
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
// C:\Users\BAZA\Desktop\Git\AppCommits512\json-server\db.json

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(cors());

server.post('/comments', (req, res) => {
  const newComment = req.body;
  newComment.id = uuidv4();
  newComment.replies = [];
  const comments = router.db.get('comments').value();
  comments.push(newComment);
  router.db.write();
  res.status(201).json(newComment);
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

  router.db.write();
  res.json(comment);
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
    router.db.write();
    res.status(201).json(newReply);
  } else {
    res.status(404).json({ error: 'Comment not found' });
  }
});

server.use(router);

const PORT = 3000;
server.listen(PORT, () => {});
