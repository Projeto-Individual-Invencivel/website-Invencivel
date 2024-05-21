const express = require('express');
const router = express.Router()

const comentarioController = require('../controllers/comentarioController');

router.post('/responder/:idAutorDiscussao/:idDiscussao/:idAutorComentario/:idRespostaComentario', (req, res) => {
    comentarioController.responderComentario(req, res);
})

module.exports = router;