const database = require('../database/config');

function listarForuns(){

    const script = `
        select discussao.id_discussao,  
            discussao.fkDiscussaoUsuario as IDautor,
            usuario.nome as Autor,
            discussao.titulo,
            discussao.descricao,
            discussao.dtPostagem,
            (select count(tb_curtida_discussao.fkDiscussao) 
                from tb_curtida_discussao
                WHERE tb_curtida_discussao.fkDiscussao = discussao.id_discussao
                and discussao.fkDiscussaoUsuario = tb_curtida_discussao.fkAutorDiscussao
            ) as curtidas,
            (select count(tb_comentario.id_comentario) 
                from tb_comentario
                WHERE tb_comentario.fkDiscussao = discussao.id_discussao
                and tb_comentario.fkAutorDiscussao = discussao.fkDiscussaoUsuario
            ) as comentarios
            from tb_discussao as discussao
            join tb_usuario as usuario
                on usuario.id_usuario = discussao.fkDiscussaoUsuario
            group by discussao.id_discussao, discussao.fkDiscussaoUsuario, 
                discussao.titulo, discussao.descricao, discussao.dtPostagem
            order by curtidas desc;
    `;
    return database.executar(script);
}

async function listarPostsUser(idUser){

    const script = `select * from tb_discussao where fkDiscussaoUsuario = ${idUser};`
    return database.executar(script);
}

function postarConteudo(idAutor, idPost, titulo, descricao, dtPost){

    const script = `INSERT INTO tb_discussao (id_discussao, fkDiscussaoUsuario, titulo, descricao, dtPostagem) VALUES (${idPost}, ${idAutor}, '${titulo}', '${descricao}', '${dtPost}');`;
    return database.executar(script);
}

function buscarPostId(idUser, idDiscussao){

    const script = `SELECT discussao.*, (select tb_usuario.nome from tb_usuario where id_usuario = ${idUser}) as autor, (select count(tb_curtida_discussao.fkDiscussao) from tb_curtida_discussao WHERE tb_curtida_discussao.fkDiscussao = discussao.id_discussao and discussao.fkDiscussaoUsuario = tb_curtida_discussao.fkAutorDiscussao) as curtidas FROM tb_discussao as discussao WHERE id_discussao = ${idDiscussao} AND fkDiscussaoUsuario = ${idUser};`;
    return database.executar(script);
}

function buscarCurtidaPostagem(idPost, idAutorPost, idUsuario){

    const script = `SELECT * FROM tb_curtida_discussao 
	WHERE fkDiscussao = ${idPost} 
    AND fkAutorDiscussao = ${idAutorPost} 
    AND fkAutorCurtida = ${idUsuario}`;
    return database.executar(script);
}

function curtirPostagem(idUser, idAutor, idPost){

    const script = `INSERT INTO tb_curtida_discussao values(${idPost}, ${idAutor}, ${idUser})`;
    return database.executar(script);
}

function descurtirPostagem(idUser, idAutor, idPost){

    const script = `DELETE FROM tb_curtida_discussao 
	WHERE fkDiscussao = ${idPost} 
    AND fkAutorDiscussao = ${idAutor} 
    AND fkAutorCurtida = ${idUser}`;
    return database.executar(script);
}

module.exports = {
    listarForuns,
    listarPostsUser,
    postarConteudo,
    buscarPostId,
    buscarCurtidaPostagem,
    curtirPostagem,
    descurtirPostagem
}