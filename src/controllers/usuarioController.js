var usuarioModel = require("../models/usuarioModel");

function login(req, res){

    var email = req.body.emailUser;
    var senha = req.body.senhaUser;

    if(email == undefined){
        res.status(400).send('Campo email vazio')
    } else if(senha == undefined){
        res.status(400).send('Campo senha vazio')
    } else{
        
        usuarioModel.login(email, senha).then((usuario) => {
    
            console.log(res.json(usuario))
        })    
    }

}

module.exports = {
    login
}