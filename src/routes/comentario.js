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

module.exports = router;