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

router.get('/perfil/:idUsuario', (req, res) => {
    usuarioController.perfil(req, res);
})

router.get('/publicacoes/:idUsuario', (req, res) => {
    usuarioController.publicacoesUsuario(req, res);
})

router.put('/editar-perfil/:idUsuario', (req, res) => {
    usuarioController.editarPerfil(req, res);
})

module.exports = router;