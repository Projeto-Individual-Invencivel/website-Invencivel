const database = require('../database/config');

function listarForuns(){

    const script = `
        select discussao.id_discussao,  
            discussao.fkDiscussaoUsuario as IDautor,
            usuario.nome as Autor,
            discussao.titulo,
            discussao.descricao,
            discussao.dtPostagem,
            (select count(tb_curtida_discussao.id_curtida_discussao) 
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
                discussao.titulo, discussao.descricao, discussao.dtPostagem;
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

module.exports = {
    listarForuns,
    listarPostsUser,
    postarConteudo
}