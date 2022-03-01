const express = require('express');
const courseController = require('../controllers/courseController');
const sessionRouter = require('./sessionRouter');

//creating router
const router = express.Router();

router.use('/:id/sessions',sessionRouter);

router
  .route('/')
  .get(courseController.getAllCourses)
  .post(courseController.addCourse);

router.route('/:name')
  .get(courseController.getCourse)
  .patch(courseController.updateCourse)
  .delete(courseController.deleteCourse);

module.exports = router;