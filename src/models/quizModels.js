const database = require('../database/config');

const listarQuizzes = (idUser) => {

    const script = `SELECT tb_quiz.*, (select count(tb_pontuacao_quiz.id_pontuacao_quiz) FROM tb_pontuacao_quiz WHERE fkUsuario = ${idUser}) AS tentativas FROM tb_quiz`;
    return database.executar(script);
}

const listarPerguntasQuiz = (idQuiz) => {

    const script = `SELECT * FROM tb_pergunta WHERE fkQuiz = ${idQuiz}`;
    return database.executar(script);
}

const buscarQuizId = (idQuiz) => {

    const script = `SELECT * FROM tb_quiz WHERE id_quiz = ${idQuiz}`;
    return database.executar(script);
}

const buscarUltimaResposta = (idUser, idPergunta, idQuiz) => {

    const script = `SELECT * FROM tb_resposta_usuario WHERE fkUsuario = ${idUser} AND fkPergunta = ${idPergunta} AND fkQuiz = ${idQuiz} ORDER BY id_resposta_usuario DESC LIMIT 1`;
    return database.executar(script);

}

const finalizarQuiz = (respostas) => {

    const script = `INSERT INTO tb_resposta_usuario VALUES ${respostas}`;
    return database.executar(script);
}

const buscarRespostasUsuario = (Tentativa, idUser) => {

    const script = `SELECT tb_resposta_usuario.id_resposta_usuario AS 'Tentativa',
	tb_resposta_usuario.fkQuiz AS 'Quiz',
    tb_pergunta.pergunta AS 'Pergunta',
	tb_resposta_usuario.resposta AS 'Resposta_usuario',
	tb_pergunta.resposta AS 'Resposta_pergunta'
    from tb_resposta_usuario
    JOIN tb_pergunta
    ON tb_pergunta.id_pergunta = tb_resposta_usuario.fkPergunta
    WHERE id_resposta_usuario = ${Tentativa} AND tb_resposta_usuario.fkUsuario = ${idUser}`;
    return database.executar(script);
}

const salvarPontuacao = (tentativa, pontuacao, idUsuario, idQuiz) => {

    const script = `INSERT INTO tb_pontuacao_quiz VALUES (${tentativa}, ${pontuacao}, ${idUsuario}, ${idQuiz})`;
    return database.executar(script);
}

const buscarRespostaQuiz = (idQuiz) => {

    const script = `SELECT tb_resposta_usuario.fkQuiz AS 'Quiz',
	tb_resposta_usuario.fkPergunta AS 'Pergunta',
    tb_resposta_usuario.resposta AS 'Resposta', 
	COUNT(tb_resposta_usuario.resposta) AS 'qtdOpcaoSelecionada'
    FROM tb_resposta_usuario 
    WHERE fkQuiz = ${idQuiz}
    GROUP BY resposta, fkPergunta, fkQuiz`;
    return database.executar(script);
}

module.exports = {
    listarQuizzes,
    listarPerguntasQuiz,
    buscarUltimaResposta,
    finalizarQuiz,
    buscarQuizId,
    buscarRespostasUsuario,
    salvarPontuacao,
    buscarRespostaQuiz
}