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

module.exports = {
    login,
    cadastrar,
    buscarEmail,
    buscarUsuarioId,
    buscarIdadePublic
};