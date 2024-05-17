const database = require('../database/config');

const comentariosPost = (idAutor, idDiscussao) => {

    const script = `
        SELECT tb_comentario.*,
        tb_usuario.nome as autor,
        (SELECT count(tb_curtida_comentario.id_curtida_comentario) 
            FROM tb_curtida_comentario 
            WHERE tb_curtida_comentario.fkComentario = tb_comentario.id_comentario) as curtidas
        FROM tb_comentario 
        JOIN tb_usuario
        ON tb_comentario.fkAutorComentario = tb_usuario.id_usuario
        WHERE fkDiscussao = ${idDiscussao} AND fkAutorDiscussao = ${idAutor};
    `;

    return database.executar(script);
}

module.exports = {
    comentariosPost
}