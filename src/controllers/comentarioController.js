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

module.exports = {
    responderComentario
}