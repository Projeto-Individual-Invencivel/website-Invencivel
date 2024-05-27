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

async function cadastrar(req, res){

    var nome = req.body.nomeUser;
    var nascimento = new Date(req.body.nascUser);
    var email = req.body.emailUser;
    var senha = req.body.senhaUser;

    let validarEmail = await usuarioModel.buscarEmail(email).then((data) => {
        return data[0];
    })

    if(nome == undefined){
        res.status(400).send("Campo nome vazio");
    } else if(nascimento == ""){
        res.status(400).send("Campo Data de nascimento inválido");
    } else if(email == undefined || email.indexOf("@") == -1 || email.indexOf(".") == -1){
        res.status(400).send("Este email é inválido");
    } else if(senha == undefined){
        res.status(400).send("Campo senha vazio");
    } else if(senha.length < 8){
        res.status(400).send("A senha precisa ter no minímo 8 caracteres");
    } else if(senha.indexOf("@") == -1 && senha.indexOf("#") == -1 && senha.indexOf("$") == -1 && senha.indexOf("!")){
        res.status(400).send("A senha precisa ter um caracter especial");        
    } else if(validarEmail != undefined){
        res.status(400).send("Este email já está em uso");
    } else{

        usuarioModel.cadastrar(nome, nascimento, email, senha).then((data) => {

            res.status(203).json(data)
        })
    }
}

function idadePublico(req, res) {

    usuarioModel.buscarIdadePublic().then((data) => {
        res.status(200).json(data);
    })
}

module.exports = {
    login,
    cadastrar,
    idadePublico
}