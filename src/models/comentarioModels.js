const database = require('../database/config');

const comentariosPost = (idAutor, idDiscussao) => {

    const script = `
        SELECT tb_comentario.*,
        tb_usuario.nome as autor,
        (SELECT count(tb_curtida_comentario.fkComentario) 
            FROM tb_curtida_comentario 
            WHERE tb_curtida_comentario.fkComentario = tb_comentario.id_comentario) as curtidas
        FROM tb_comentario 
        JOIN tb_usuario
        ON tb_comentario.fkAutorComentario = tb_usuario.id_usuario
        WHERE fkDiscussao = ${idDiscussao} AND fkAutorDiscussao = ${idAutor};
    `;

    return database.executar(script);
}

const responderComentario = (comentario, idDiscussao, idAutorDiscussao, idAutorComentario, idRespostaComentario) => {

    const script = `insert into tb_comentario values (default, '${comentario}', default, ${idDiscussao}, ${idAutorDiscussao}, ${idAutorComentario}, ${idRespostaComentario})`;
    return database.executar(script);
}

const buscarCurtidaComentarioId = (idComentario, idAutorCurtida) => {

    const script = `SELECT * FROM tb_curtida_comentario WHERE fkComentario = ${idComentario} AND fkAutorCurtida = ${idAutorCurtida};`;
    return database.executar(script);
}

const curtirComentario = (idComentario, idAutorCurtida) => {

    const script = `INSERT INTO tb_curtida_comentario VALUES(${idComentario}, ${idAutorCurtida})`;
    return database.executar(script);
}

const descurtirComentario = (idComentario, idAutorCurtida) => {

    const script = `DELETE FROM tb_curtida_comentario WHERE fkComentario = ${idComentario} AND fkAutorCurtida = ${idAutorCurtida}`;
    return database.executar(script);
}

module.exports = {
    comentariosPost,
    responderComentario,
    buscarCurtidaComentarioId,
    curtirComentario,
    descurtirComentario
}