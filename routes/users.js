var express = require('express');
var router = express.Router();
var usersCtrl = require('../controllers/users');
var securityMiddleware = require('../middlewares/security');

/* POST signup users */ 
router.post('/signup', usersCtrl.signUpUser)

/* GET signin details */
router.get('/signin', usersCtrl.getSignInDetails)

/* GET user details */
router.get('/:user_id', usersCtrl.getUser)

/* POST signin details */
router.post("/signin", usersCtrl.signInUser);

/* POST checkSignIn */
router.post("/checkSignin", securityMiddleware.checkSignIn, usersCtrl.checkSignIn);

/* POST checkPermission */
router.post("/checkpermission", securityMiddleware.checkPermission, usersCtrl.checkPermission);

/* POST signOut */
router.post("/signout", securityMiddleware.checkPermission, usersCtrl.signOutUser);

/* POST sendTicketForm */
router.post("/ticket", usersCtrl.sendTicketForm);

module.exports = router;