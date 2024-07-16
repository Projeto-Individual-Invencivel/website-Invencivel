const express = require('express');
const router = express.Router()

const comentarioController = require('../controllers/comentarioController');

router.post('/responder/:idAutorDiscussao/:idDiscussao/:idAutorComentario/:idRespostaComentario', (req, res) => {
    comentarioController.responderComentario(req, res);
})

router.post('/curtir/:idUsuario/:idComentario', (req, res) => {
    comentarioController.curtirComentario(req, res);
})

router.delete('/descurtir/:idUsuario/:idComentario', (req, res) => {
    comentarioController.descurtirComentario(req, res);
})

router.delete('/apagar/:idUsuario/:idComentario', (req, res) => {
    comentarioController.deletarComentario(req, res);
})

router.put('/editar/:idUsuario/:idComentario', (req, res) => {
    comentarioController.editarComentario(req, res);
})

module.exports = router;