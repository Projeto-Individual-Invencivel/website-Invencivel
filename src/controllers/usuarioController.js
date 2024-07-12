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

function perfil(req, res){
    usuarioModel.buscarInteracoesUsuario(req.params.idUsuario).then((data) => {
        res.status(203).json(data[0]);
    })
}

async function publicacoesUsuario(req, res){

    const idUsuario = req.params.idUsuario;
    const interacoes = {
        postagens: [],
        comentarios: []
    }

    await usuarioModel.buscarPostagens(idUsuario).then((data) =>  {
        data.forEach(post => {
            interacoes.postagens.push(post);
        });
    })
    usuarioModel.buscarComentarios(idUsuario).then((data) => {
        data.forEach(comments => {
            interacoes.comentarios.push(comments);
        })
        res.status(203).json(interacoes);
    })
}

function editarPerfil(req, res){

    const idUsuario = req.params.idUsuario;
    const nome = req.body.nome;
    const email = req.body.email;
    const nascimento = new Date(req.body.nascimento);
    const senha = req.body.senha;

    usuarioModel.buscarUsuarioId(idUsuario).then(async (usuario) => {
        
        const emailUsado = await usuarioModel.buscarEmail(email).then((emailUsuario) => {
            return emailUsuario[0];
        })

        let idUsuarioEmail = emailUsado != null ? emailUsado.id_usuario : true;

        if(usuario[0].senha != senha){
            res.status(404).send("Senha incorreta");
        } else if(idUsuario <= 0 || usuario.length == 0){
            res.status(404).send('Este usuário não existe ou não foi encontrado')
        } else if(nome == "" || email == "" || nascimento == ""){
            res.status(404).send("Preencha todos os campos para continuar")
        } else if(emailUsado != undefined && idUsuarioEmail != idUsuario){
            res.status(404).send("Este email já está em uso");
        } else if(email.indexOf("@") == -1 || email.indexOf(".") == -1){
            res.status(400).send("Este email é inválido");
        } else if((new Date().getFullYear() - nascimento.getFullYear()) < 13){
            res.status(404).send("Data de nascimento inválida")
        } else{
            
            let mes = nascimento.getMonth() + 1;
            mes = mes < 10 ? '0' + mes : mes;

            const nascFormatado = `${nascimento.getFullYear()}-${mes}-${nascimento.getDate()}`;
            usuarioModel.atualizarPerfil(idUsuario, nome, email, nascFormatado).then((perfilAtualizado) => {
                res.status(203).json(perfilAtualizado);
            })
        }
    })    
}

module.exports = {
    login,
    cadastrar,
    idadePublico,
    perfil,
    publicacoesUsuario,
    editarPerfil
}