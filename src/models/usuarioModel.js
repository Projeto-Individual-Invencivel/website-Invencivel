var database = require("../database/config")

function login(email, senha){

    var script = `SELECT * FROM tb_usuario where email = '${email}' AND senha = '${senha}'`
    return database.executar(script)
}

module.exports = {
    login
};