const express = require('express');

const router = express.Router();

const verifyToken = require('../middlewares/authMiddleware');
const services = require('../services');
const middlewares = require('../middlewares');

router.get('/talker', services.returnTalkers);

router.post('/login', services.signup);

router.post('/talker',
  verifyToken,
  middlewares.validateName,
  middlewares.validateAge,
  middlewares.validateTalk,
  middlewares.validadeRate,
  middlewares.validateWatchedAt,
  services.addTalker);

router.get('/talker/search', verifyToken, services.searchTalker);

router.get('/talker/:id', services.getTalkersById);

router.put('/talker/:id',
  verifyToken,
  middlewares.validateName,
  middlewares.validateAge,
  middlewares.validateTalk,
  middlewares.validadeRate,
  middlewares.validateWatchedAt,
  services.editTalker);

router.delete('/talker/:id', verifyToken, services.deleteTalker);

module.exports = router;