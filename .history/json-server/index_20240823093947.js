server.post('/comments', (req, res) => {
  const newComment = req.body;
  newComment.id = uuidv4();
  newComment.replies = [];
  const comments = router.db.get('comments').value();
  comments.push(newComment);
  try {
    router.db.write();
    console.log('New comment added:', newComment);
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Failed to write to database:', error);
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
      console.log('New reply added:', newReply);
      res.status(201).json(newReply);
    } catch (error) {
      console.error('Failed to write to database:', error);
      res.status(500).json({ error: 'Failed to write to database' });
    }
  } else {
    res.status(404).json({ error: 'Comment not found' });
  }
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
