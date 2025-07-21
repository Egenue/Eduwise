const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.patch('/:id/promote', userController.promoteUser);
router.patch('/:id/demote', userController.demoteUser);
router.delete('/:id', userController.deleteUser);

module.exports = router; 