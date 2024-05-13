var express = require("express");
var router = express.Router();

const usuarioController = require('../controllers/forumController');

router.get("/listar", (req, res) => {
    usuarioController.Forum(req, res);
})

module.exports = router;