var express = require("express");
var router = express.Router();

const forumController = require('../controllers/forumController');

router.get("/listar/:filtro", (req, res) => {
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

router.post('/curtir/:idUsuario/:idAutor/:idPostagem', (req, res) => {
    forumController.curtirPostagem(req, res);
})

router.delete('/descurtir/:idUsuario/:idAutor/:idPostagem', (req, res) => {
    forumController.descurtirPostagem(req, res);
})

module.exports = router;