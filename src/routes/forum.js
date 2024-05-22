var express = require("express");
var router = express.Router();

const forumController = require('../controllers/forumController');

router.get("/listar", (req, res) => {
    forumController.Forum(req, res);
})

router.post('/publicar/:idUsuario', (req, res) => {
    forumController.Publicar(req, res);
})

router.get('/discussao/:idUsuario/:idDiscussao', (req, res) => {
    forumController.detalhesDiscussao(req, res);  
})

router.post('/responder/:idPostagem/:idAutor/:idUsuario', (req, res) => {
    forumController.responderPostagem(req, res);
})


module.exports = router;