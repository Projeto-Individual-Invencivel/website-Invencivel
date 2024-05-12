var usuarioModel = require("../models/usuarioModel");

function login(req, res){

    var email = req.body.emailUser;
    var senha = req.body.senhaUser;

    if(email.trim() == ""){
        res.status(400).send('Campo email vazio')
    } else if(senha.trim() == ""){
        res.status(400).send('Campo senha vazio')
    } else{
        
        usuarioModel.login(email, senha).then((usuario) => {
            
            if(usuario.length > 0){
                res.status(203).json(usuario[0]);
            } else{
                res.status(400).send("Email e/ou senha estão incorretos")
            }
        })
    }

}

module.exports = {
    login
}