const quizModels = require('../models/quizModels');
const usuarioModels = require('../models/usuarioModel');

const buscarQuizzes = (req, res) => {

    quizModels.listarQuizzes(req.params.idUsuario).then((data) => {
        res.status(203).json(data);
    })
}

const buscarPerguntas = (req, res) => {

    quizModels.listarPerguntasQuiz(req.params.idQuiz).then((data) => {
        res.status(203).json(data);
    })
}

const finalizarQuiz = async (req, res) => {

    const idQuiz = req.params.idQuiz;
    const idUsuario = req.params.idUsuario;
    const respostas = req.body.respostas;

    const getQuiz = await quizModels.buscarQuizId(idQuiz).then((data) => {
        return data.length <= 0 ? true : false;
    }) 

    const getUsuario = await usuarioModels.buscarUsuarioId(idUsuario).then((data) => {
        return data.length <= 0 ? true : false;
    })

    if(getQuiz){
        res.status(400).send('Este quiz não existe ou não foi encontrado');
    } else if(getUsuario){
        res.status(400).send('Este usuário não existe ou não foi encontrado');
    } else{
        let tentativa = 0;
        let insert = ``;
    
        for(let idPergunta = 1; idPergunta <= respostas.length; idPergunta++){
    
            let getLastId = await quizModels.buscarUltimaResposta(idUsuario, idPergunta, idQuiz).then((data) => {
                return data[0] == undefined ? 1 : data[0].id_resposta_usuario + 1;
            })
            tentativa = getLastId;

            if(idPergunta < respostas.length){
                insert += `\n (${getLastId}, '${respostas[idPergunta - 1]}', ${idUsuario}, ${idPergunta}, ${idQuiz}),`;
            } else{
                insert += `\n (${getLastId}, '${respostas[idPergunta - 1]}', ${idUsuario}, ${idPergunta}, ${idQuiz});`;
            }
        }
    
        await quizModels.finalizarQuiz(insert);
        const replicaRespostas = await quizModels.buscarRespostasUsuario(tentativa);

        let pontuacao = 0;
        for(let i = 0; i < replicaRespostas.length; i++){
            
            const gabarito = replicaRespostas[i];
            if(gabarito.Resposta_usuario == gabarito.Resposta_pergunta){
                pontuacao++;
            }
        }

        quizModels.salvarPontuacao(tentativa, pontuacao, idUsuario, idQuiz).then((data) => {
            res.status(203).json(data);
        })
    }
}

module.exports = {
    buscarQuizzes,
    buscarPerguntas,
    finalizarQuiz
}