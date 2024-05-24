const comentarioModels = require('../models/comentarioModels');
const usuarioModels = require('../models/usuarioModel');

const responderComentario = (req, res) => {

    const comentario = req.body.comentario; 
    const idDiscussao = req.params.idDiscussao; 
    const idAutor = req.params.idAutorDiscussao;
    const idAutorComentario = req.params.idAutorComentario;
    const idRespostaComentario = req.params.idRespostaComentario;

    const getComentario = comentarioModels.comentariosPost(idAutor, idDiscussao).then((data) => {
        return data.find(x => x.id_comentario == idRespostaComentario);
    })

    const getUsuario = usuarioModels.buscarUsuarioId(idAutorComentario).then((data) => {
        console.log(data.length);
        return data.length <= 0 ? true : false;
    })

    if(comentario.substr(comentario.indexOf(" ")).trim() == ""){
        res.status(400).send('Campo comentário está vazio');
    } else if(getComentario == undefined){
        res.status(400).send('Este comentário não foi encontrado');
    } else if(getUsuario == true){
        res.status(400).send('Houve um erro ao tentar localizar o seu usuário');
    } else {
        comentarioModels.responderComentario(comentario, idDiscussao, idAutor, idAutorComentario, idRespostaComentario).then((data) => {
            res.status(203).json(data);
        })
    }
}

const curtirComentario = async (req, res) => {
 
    const idAutorCurtida = req.params.idUsuario;
    const idComentario = req.params.idComentario;

    const usuario = await usuarioModels.buscarUsuarioId(idAutorCurtida).then(data => {
        return data[0];
    })

    const comentario = await comentarioModels.buscarCurtidaComentarioId(idComentario, idAutorCurtida).then(data => {
        return data[0];
    })
    
    if(idAutorCurtida == 0 || idComentario == 0){
        res.status(400).send("Não foi possível curtir este comentário");
    } else if(usuario == undefined){
        res.status(400).send("Houve um erro ao localizar o seu usuário");
    } else if(comentario != undefined){
        res.status(400).send("Você não pode recurtir este comentário");
    } else{
        comentarioModels.curtirComentario(idComentario, idAutorCurtida).then((data) => {
            res.status(200).json(data);
        })
    }
}

const descurtirComentario = async (req, res) => {

    const idAutorCurtida = req.params.idUsuario;
    const idComentario = req.params.idComentario;

    const comentario = await comentarioModels.buscarCurtidaComentarioId(idComentario, idAutorCurtida).then(data => {
        return data[0];
    })

    if(idAutorCurtida == 0 || idComentario == 0){
        res.status(400).send("Não foi possível descurtir este comentário");
    } else if(comentario == undefined){
        res.status(400).send("Você não pode descurtir este comentário");
    } else{
        comentarioModels.descurtirComentario(idComentario, idAutorCurtida).then((data) => {
            res.status(200).json(data);
        })
    }
}

module.exports = {
    responderComentario,
    curtirComentario,
    descurtirComentario
}