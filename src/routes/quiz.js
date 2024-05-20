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

router.get('/respostas/:idUsuario/:idQuiz/:idTentativa', (req, res) => {
    quizController.buscarRespostas(req, res);
})

router.get('/respostas/:idQuiz', (req, res) => {
    quizController.buscarRespostasQuiz(req, res);
})

router.get('/historico/:idUsuario/:idQuiz', (req, res) => {
    quizController.historicoTentativasUsuario(req, res);
})

module.exports = router