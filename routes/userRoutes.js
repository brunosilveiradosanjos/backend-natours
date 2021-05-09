const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// users
router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser)

router.route('/:id')
    .get(userController.getOneUser)
    .post(userController.createUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;