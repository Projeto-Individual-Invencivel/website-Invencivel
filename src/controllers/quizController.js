const quizModels = require('../models/quizModels');

const buscarQuizzes = (req, res) => {

    quizModels.listarQuizzes(req.params.idUsuario).then((data) => {
        res.status(203).json(data);
    })
}

const buscarPerguntas = (req, res) => {

    quizModels.listarPerguntasQuiz(req.params.idQuiz).then((data) => {
        res.status(203).json(data);
    })
}

module.exports = {
    buscarQuizzes,
    buscarPerguntas
}