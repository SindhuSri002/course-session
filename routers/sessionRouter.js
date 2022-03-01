const express = require('express');
const sessionController = require('../controllers/sessionController');
//creating router
const router = express.Router({mergeParams: true});

router
  .route('/')
  .post(sessionController.addSession)
  .get(sessionController.getAllSessionsOfACourse);

router.route('/:sessionId')
  .patch(sessionController.updateSession)
  .delete(sessionController.deleteSession);

module.exports = router;