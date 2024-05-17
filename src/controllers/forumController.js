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

        forumModels.postarConteudo(idAutor, idPost, titulo, descricao, dtPost).then((data) => {
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

module.exports = {
    Forum,
    Publicar,
    detalhesDiscussao
}