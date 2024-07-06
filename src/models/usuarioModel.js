var database = require("../database/config")

function login(email, senha){

    var script = `SELECT * FROM tb_usuario where email = '${email}' AND senha = '${senha}'`
    return database.executar(script)
}

function cadastrar(nome, nasc, email, senha){

    const formatarData = `${nasc.getFullYear()}-${nasc.getMonth() + 1}-${nasc.getDate() + 1}`;

    var script = `INSERT INTO tb_usuario values(null, '${nome}', '${formatarData}', '${email}', '${senha}')`;
    return database.executar(script)
}

async function buscarEmail(email){

    var script = `SELECT * FROM tb_usuario WHERE email = '${email}'`
    return database.executar(script)
}

function buscarUsuarioId(idUser){

    var script = `SELECT * FROM tb_usuario WHERE id_usuario = ${idUser}`;
    return database.executar(script);
}

function buscarIdadePublic(){

    var script = `select year(dtNasc) as 'anoNascimento'from tb_usuario`;
    return database.executar(script);
}

function buscarInteracoesUsuario(idUsuario){

    var script = `
    select tb_usuario.id_usuario,
	tb_usuario.nome, 
	tb_usuario.email,
    tb_usuario.dtNasc,
    tb_usuario.dtContaCriada,
	(select count(id_discussao) from tb_discussao where fkDiscussaoUsuario = tb_usuario.id_usuario) as posts,
    (select count(id_comentario) from tb_comentario where fkAutorComentario = tb_usuario.id_usuario) as coments,
    (select count(fkAutorCurtida) from tb_curtida_discussao where fkAutorDiscussao = tb_usuario.id_usuario) as likesPosts,
    (select count(fkAutorCurtida) from tb_curtida_comentario join tb_comentario on id_comentario = fkComentario
     where tb_usuario.id_usuario = tb_comentario.fkAutorComentario) as likesComments
    from tb_usuario
    left join tb_discussao on tb_discussao.fkDiscussaoUsuario = tb_usuario.id_usuario
    left join tb_comentario on tb_comentario.id_comentario = tb_usuario.id_usuario
    where id_usuario = ${idUsuario}
    group by id_usuario, nome, email, dtNasc, posts, coments, likesPosts, likesComments;`;
    return database.executar(script);
}

module.exports = {
    login,
    cadastrar,
    buscarEmail,
    buscarUsuarioId,
    buscarIdadePublic,
    buscarInteracoesUsuario
};