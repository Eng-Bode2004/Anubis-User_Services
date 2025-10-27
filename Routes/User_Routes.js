const UserController = require( "../Controllers/User_Controllers" )
const createUserMiddleware = require( "../Middlewares/Create-User_Middleware" )
const AssignRoleMiddleware = require( "../Middlewares/Assigning-Role_Middleware" )


const express = require('express');
const router = express.Router();

// Create new User

router.post('/register', createUserMiddleware,UserController.createUser);
router.put('/:userId/assign-role',AssignRoleMiddleware,UserController.AssignRole)


module.exports = router;