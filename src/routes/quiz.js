var express = require("express");
var router = express.Router();

const quizController = require('../controllers/quizController');

router.get('/quizzes/:idUsuario', (req, res) => {
    quizController.buscarQuizzes(req, res);
})

router.get('/perguntas/:idQuiz', (req, res) => {
    quizController.buscarPerguntas(req, res);
})

router.post('/responder/:idUsuario/:idQuiz', (req, res) => {
    quizController.finalizarQuiz(req, res);
})

module.exports = router