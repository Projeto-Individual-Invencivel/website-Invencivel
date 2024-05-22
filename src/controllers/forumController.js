const forumModels = require('../models/forumModels');
const usuarioModels = require('../models/usuarioModel');
const comentariosModels = require('../models/comentarioModels');

function Forum(req, res){

    forumModels.listarForuns().then((data) => {
        res.status(203).json(data);
    })
}

async function Publicar(req, res){

    const idAutor = req.params.idUsuario;
    const titulo = req.body.tituloUser;
    const descricao = req.body.descUser;
    
    const dtAtual = new Date();
    const dtPost = `${dtAtual.getFullYear()}-${dtAtual.getMonth() + 1}-${dtAtual.getDate()} ${dtAtual.getHours()}:${dtAtual.getMinutes()}:${dtAtual.getSeconds()}`;

    if(titulo.trim() == ""){
        res.status(400).send("Campo titulo vazio");
    } else if(descricao.trim() == ""){
        res.status(400).send("Campo descrição vazio");
    } else {
        
        const idPost = await forumModels.listarPostsUser(idAutor).then((posts => {
            return posts.length == 0 ? 1 : posts.length + 1;
        }));

        await forumModels.postarConteudo(idAutor, idPost, titulo, descricao, dtPost);
        forumModels.buscarPostId(idAutor, idPost).then((data) => {
            res.status(203).json(data);
        })
    }
}

async function detalhesDiscussao(req, res){

    const idDiscussao = req.params.idDiscussao;
    const idUsuario = req.params.idUsuario;

    const usuario = await usuarioModels.buscarUsuarioId(idUsuario).then((data) => {
        return data.length == 0 ? true : false;
    })

    if(idDiscussao == undefined){
        res.status(400).send("Está discussão não foi encontrada")
    } else if(usuario){
        res.status(400).send("O autor da postagem não existe")
    } else{
        const comentarios = await comentariosModels.comentariosPost(idUsuario, idDiscussao);
        await forumModels.buscarPostId(idUsuario, idDiscussao).then((data) => {
            data[0].comentarios = comentarios;
            res.status(203).json(data[0]);
        })
    }
}

async function responderPostagem(req, res){

    const comentario = req.body.comentario;
    const idPost = req.params.idPostagem;
    const idAutor = req.params.idAutor;
    const idAutorComentario = req.params.idUsuario;

    const getPost = await forumModels.buscarPostId(idAutor, idPost).then((data) => {
        return data[0];
    })

    const getUsuario = await usuarioModels.buscarUsuarioId(idAutorComentario).then((data) => {
        return data[0];
    })

    if(comentario.trim() == ""){
        res.status(400).send("Campo comentário está vazio");
    } else if(getPost == undefined){
        res.status(400).send("Houve um problema ao localizar a sua postagem");
    } else if(getUsuario == undefined){
        res.status(400).send("Houve um problema ao localizar o seu usuário");
    } else {
        comentariosModels.responderComentario(comentario, idPost, idAutor, idAutorComentario, null).then((data) => {
            res.status(203).json(data);
        })
    }
}

module.exports = {
    Forum,
    Publicar,
    detalhesDiscussao,
    responderPostagem
}