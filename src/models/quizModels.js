const database = require('../database/config');

const listarQuizzes = (idUser) => {

    const script = `SELECT tb_quiz.*, (select count(tb_pontuacao_quiz.id_pontuacao_quiz) FROM tb_pontuacao_quiz WHERE fkUsuario = ${idUser}) AS tentativas FROM tb_quiz`;
    return database.executar(script);
}

const listarPerguntasQuiz = (idQuiz) => {

    const script = `SELECT * FROM tb_pergunta WHERE fkQuiz = ${idQuiz}`;
    return database.executar(script);
}

module.exports = {
    listarQuizzes,
    listarPerguntasQuiz
}