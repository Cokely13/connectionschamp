// // server/api/messages.js

// const router = require('express').Router();
// const {  models: {Message, User, Answer}, } = require('../db');

// router.get('/:answer.number', async (req, res, next) => {
//   try {
//     const messages = await Message.findAll({
//       where: { messageId: req.params.answer.number},
//       include: [{ model: User, attributes: ['id', 'username', 'image'] }]
//     });
//     res.json(messages);
//   } catch (err) {
//     next(err);
//   }
// });

// router.post('/', async (req, res, next) => {
//   try {
//     const message = await Message.create(req.body);
//     res.status(201).json(message);
//   } catch (err) {
//     next(err);
//   }
// });

// router.delete('/:id', async (req, res, next) => {
//   try {
//     const message = await Message.findByPk(req.params.id);
//     await message.destroy();
//     res.sendStatus(204);
//   } catch (err) {
//     next(err);
//   }
// });

// module.exports = router;

const router = require('express').Router();
const {
  models: { Message, User },
} = require('../db');

// Get messages for a puzzle number
router.get('/:puzzleNumber', async (req, res, next) => {
  try {
    const messages = await Message.findAll({
      where: { puzzleNumber: req.params.puzzleNumber },
      include: [{ model: User, attributes: ['id', 'userName', 'image'] }],
      order: [['createdAt', 'ASC']],
    });
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

// Post a new message
router.post('/', async (req, res, next) => {
  try {
    const { content, puzzleNumber } = req.body;
    const userId = req.user.id; // Ensure req.user is set by authentication middleware

    const message = await Message.create({ content, puzzleNumber, userId });
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
});

// Delete a message
router.delete('/:id', async (req, res, next) => {
  try {
    const message = await Message.findByPk(req.params.id);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const userId = req.user.id; // Ensure req.user is set by authentication middleware

    if (message.userId !== userId /* && !req.user.isAdmin */) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await message.destroy();
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
