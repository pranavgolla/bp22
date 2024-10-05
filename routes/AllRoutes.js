const admin=require("../controllers/admincontrollers")
const express = require('express');

const router = express.Router();

router.post('/register',admin.register)
router.post('/login',admin.login)


module.exports = router;
