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

const deletarComentario = async (req, res) => {

    const idUsuario = req.params.idUsuario;
    const idComentario = req.params.idComentario;
    
    const usuarioValido = await usuarioModels.buscarUsuarioId(idUsuario).then((data) => {
        return data.length > 0 ? true : false;
    }) 

    const comentarioValido = await comentarioModels.buscarComentarioId(idComentario);
    if(idComentario <= 0 || idUsuario <= 0){
        res.status(400).send('Valores inválidos');
    } else if(!usuarioValido){
        res.status(400).send('Este usuário não foi encontrado');
    } else if(comentarioValido[0].fkAutorComentario != idUsuario){
        res.status(400).send('Você não tem permissão para excluir este comentário');
    } else {

        await comentarioModels.buscarRespostasComentario(idComentario).then((respostas) => {
            if(respostas.length > 0){
                respostas.map(async (item) => {
                    await comentarioModels.apagarCurtidasComentario(item.id_comentario);
                    await comentarioModels.deletarComentario(item.id_comentario);
                })
            }
        });

        await comentarioModels.apagarCurtidasComentario(idComentario);
        await comentarioModels.deletarComentario(idComentario).then(() => {
            res.status(200).send("Comentário apagado com sucesso!");
        });
    }
}

const editarComentario = async (req, res) => {

    const idUsuario = req.params.idUsuario;
    const idComentario = req.params.idComentario;
    const alteracoes = req.body.comentario;

    const dadosUsuario = await usuarioModels.buscarUsuarioId(idUsuario);
    const dadosComentario = await comentarioModels.buscarComentarioId(idComentario);

    if(idUsuario <= 0 || idComentario <= 0){
        res.status(400).send("Valores inválidos");
    } else if(dadosUsuario.length <= 0){
        res.status(400).send("Usuário não encontrado");
    } else if(dadosComentario.length <= 0){
        res.status(400).send("Comentário não encontrado");
    } else if(dadosUsuario[0].id_usuario != dadosComentario[0].fkAutorComentario){
        res.status(400).send("Você não tem permissão para editar este comentário!");
    } else if(alteracoes.substr(alteracoes.indexOf(" ")).trim() == ""){
        res.status(400).send("Campo comentário está vazio");
    } else{
        comentarioModels.editarComentario(idComentario, alteracoes).then((data) => {
            res.status(203).json(data);
        })
    }
}

module.exports = {
    responderComentario,
    curtirComentario,
    descurtirComentario,
    deletarComentario,
    editarComentario
}