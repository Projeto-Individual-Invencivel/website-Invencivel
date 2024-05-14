const forumModels = require('../models/forumModels');

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

module.exports = {
    Forum,
    Publicar
}