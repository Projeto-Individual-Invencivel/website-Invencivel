const database = require('../database/config');

const listarQuizzes = (idUser) => {

    const script = `SELECT tb_quiz.*, 
    COUNT(tb_pontuacao_quiz.id_pontuacao_quiz) AS tentativas 
	FROM tb_quiz
	LEFT JOIN tb_pontuacao_quiz 
    ON tb_quiz.id_quiz = tb_pontuacao_quiz.fkQuiz 
    AND tb_pontuacao_quiz.fkUsuario = ${idUser}
	GROUP BY tb_quiz.id_quiz;`;
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

const buscarRespostasUsuario = (Tentativa, idUser, idQuiz) => {

    const script = `SELECT tb_resposta_usuario.id_resposta_usuario AS 'Tentativa',
	tb_resposta_usuario.fkQuiz AS 'Quiz',
    tb_pergunta.pergunta AS 'Pergunta',
	tb_resposta_usuario.resposta AS 'Resposta_usuario',
	tb_pergunta.resposta AS 'Resposta_pergunta'
    from tb_resposta_usuario
    JOIN tb_pergunta
    ON tb_pergunta.id_pergunta = tb_resposta_usuario.fkPergunta
    WHERE id_resposta_usuario = ${Tentativa} AND tb_resposta_usuario.fkUsuario = ${idUser} AND tb_resposta_usuario.fkQuiz = ${idQuiz}`;
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

const buscarHistorico = (idUser, idQuiz) => {

    const script = `select	distinct(tb_pontuacao_quiz.id_pontuacao_quiz) as 'Tentativa',
	tb_pontuacao_quiz.fkUsuario as 'IdUsuario',
    tb_pontuacao_quiz.fkQuiz as 'IdQuiz',
	tb_pontuacao_quiz.qtdAcertos as 'Pontuacao'
	from tb_pontuacao_quiz
    where fkUsuario = ${idUser}
    and fkQuiz = ${idQuiz}`;
    return database.executar(script);
}

const buscarAlternativasQuiz = (idQuiz) => {

    const script = `SELECT alternativa FROM tb_alternativas WHERE fkQuiz = ${idQuiz}`;
    return database.executar(script);
}

const getIdFirstQuestionQuiz = (idQuiz) => {

    const script = `SELECT id_pergunta FROM tb_pergunta WHERE fkQuiz = ${idQuiz} LIMIT 1`;
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
    buscarRespostaQuiz,
    buscarHistorico,
    buscarAlternativasQuiz,
    getIdFirstQuestionQuiz
}
