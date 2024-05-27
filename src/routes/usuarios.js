var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.post("/login", (req, res) => {
    usuarioController.login(req, res);
})

router.post('/cadastrar', (req, res) => {
    usuarioController.cadastrar(req, res);
})

router.get('/idade-publico', (req, res) => {
    usuarioController.idadePublico(req, res);
})

module.exports = router;