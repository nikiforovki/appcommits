const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./db.json');
const middlewares = jsonServer.defaults();
const { v4: uuidv4 } = require('uuid');
const cors = require('cors'); // Импорт плагина для CORS

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(cors()); // Добавление middleware для CORS

// Маршрут для добавления нового комментария
server.post('/comments', (req, res) => {
  const newComment = req.body;
  newComment.id = uuidv4(); // Генерируем уникальный ID для комментария
  newComment.replies = []; // Добавляем поле replies
  const comments = router.db.get('comments').value();
  comments.push(newComment);
  router.db.write();
  res.status(201).json(newComment);
});

// Маршрут для обработки лайков на комментарии
server.post('/comments/:id/like', (req, res) => {
  const commentId = req.params.id;
  const comments = router.db.get('comments').value();
  let comment = comments.find((c) => c.id === commentId);

  if (!comment) {
    comment = { id: commentId, likes: 0, liked: false, replies: [] }; // Создаем комментарий, если его нет
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

// Маршрут для добавления ответа на комментарий
server.post('/comments/:id/replies', (req, res) => {
  console.log('Received request to add reply:', req.params.id, req.body);
  const commentId = req.params.id;
  const newReply = req.body;
  const comments = router.db.get('comments').value();

  const commentIndex = comments.findIndex((c) => c.id === commentId);

  if (commentIndex !== -1) {
    if (!comments[commentIndex].replies) {
      comments[commentIndex].replies = [];
    }
    newReply.id = uuidv4(); // Генерируем уникальный ID для ответа
    comments[commentIndex].replies.push(newReply);
    console.log('Before saving:', comments); // Логирование перед сохранением
    router.db.write();
    console.log('After saving:', comments); // Логирование после сохранения
    console.log('Reply added:', newReply);
    res.status(201).json(newReply);
  } else {
    console.error('Comment not found:', commentId);
    res.status(404).json({ error: 'Comment not found' });
  }
});

server.use(router);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});

// const jsonServer = require('json-server');
// const server = jsonServer.create();
// const router = jsonServer.router('db.json');
// const middlewares = jsonServer.defaults();
// const { v4: uuidv4 } = require('uuid');
//
// server.use(middlewares);
// server.use(jsonServer.bodyParser);
//
// // Маршрут для добавления нового комментария
// server.post('/comments', (req, res) => {
//   const newComment = req.body;
//   newComment.id = uuidv4(); // Генерируем уникальный ID для комментария
//   newComment.replies = []; // Добавляем поле replies
//   const comments = router.db.get('comments').value();
//   comments.push(newComment);
//   router.db.write();
//   res.status(201).json(newComment);
// });
//
// // Маршрут для обработки лайков на комментарии
// server.post('/comments/:id/like', (req, res) => {
//   const commentId = req.params.id;
//   const comments = router.db.get('comments').value();
//   let comment = comments.find((c) => c.id === commentId);
//
//   if (!comment) {
//     comment = { id: commentId, likes: 0, liked: false, replies: [] }; // Создаем комментарий, если его нет
//     comments.push(comment);
//   }
//
//   if (!comment.likes) {
//     comment.likes = 0;
//   }
//   if (comment.liked) {
//     comment.likes -= 1;
//   } else {
//     comment.likes += 1;
//   }
//   comment.liked = !comment.liked;
//
//   router.db.write();
//   res.json(comment);
// });
//
// // Маршрут для добавления ответа на комментарий
// server.post('/comments/:id/replies', (req, res) => {
//   console.log('Received request to add reply:', req.params.id, req.body);
//   const commentId = req.params.id;
//   const newReply = req.body;
//   const comments = router.db.get('comments').value();
//
//   const commentIndex = comments.findIndex((c) => c.id === commentId);
//
//   if (commentIndex !== -1) {
//     if (!comments[commentIndex].replies) {
//       comments[commentIndex].replies = [];
//     }
//     // newReply.id = uuidv4(); // Генерируем уникальный ID для ответа
//     comments[commentIndex].replies.push(newReply);
//     console.log('Before saving:', comments); // Логирование перед сохранением
//     router.db.write();
//     console.log('After saving:', comments); // Логирование после сохранения
//     console.log('Reply added:', newReply);
//     res.status(201).json(newReply);
//   } else {
//     console.error('Comment not found:', commentId);
//     res.status(404).json({ error: 'Comment not found' });
//   }
// });
//
// server.use(router);
//
// const PORT = 3000;
// server.listen(PORT, () => {
//   console.log(`JSON Server is running on port ${PORT}`);
// });

// const jsonServer = require('json-server');
// const server = jsonServer.create();
// const router = jsonServer.router('db.json');
// const middlewares = jsonServer.defaults();
//
// server.use(middlewares);
// server.use(jsonServer.bodyParser);
//
// // Маршрут для обработки лайков на комментарии
// server.post('/comments/:id/like', (req, res) => {
//   const commentId = req.params.id;
//   const comments = router.db.get('comments').value();
//   let comment = comments.find((c) => c.id === commentId);
//
//   if (!comment) {
//     comment = { id: commentId, likes: 0, liked: false }; // Создаем комментарий, если его нет
//     comments.push(comment);
//   }
//
//   if (!comment.likes) {
//     comment.likes = 0;
//   }
//   if (comment.liked) {
//     comment.likes -= 1;
//   } else {
//     comment.likes += 1;
//   }
//   comment.liked = !comment.liked;
//
//   router.db.write();
//   res.json(comment);
// });
//
// // Маршрут для добавления ответа на комментарий
// server.post('/comments/:id/replies', (req, res) => {
//   console.log('Received request to add reply:', req.params.id, req.body);
//   const commentId = req.params.id;
//   const newReply = req.body;
//   const comments = router.db.get('comments').value();
//
//   const commentIndex = comments.findIndex((c) => c.id === commentId);
//
//   if (commentIndex !== -1) {
//     if (!comments[commentIndex].replies) {
//       comments[commentIndex].replies = [];
//     }
//     comments[commentIndex].replies.push(newReply);
//     router.db.write();
//     res.json(comments[commentIndex]);
//   } else {
//     res.status(404).json({ error: 'Comment not found' });
//   }
// });
//
// server.use(router);
//
// const PORT = 3000;
// server.listen(PORT, () => {
//   console.log(`JSON Server is running on port ${PORT}`);
// });
