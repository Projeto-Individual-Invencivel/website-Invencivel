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
    
        const getFirstId = await quizModels.getIdFirstQuestionQuiz(idQuiz).then((data) => {
            return data[0].id_pergunta;
        })
    
        let idPergunta = getFirstId;
        for(let cont = 1; cont <= respostas.length; cont++){
    
            let getLastId = await quizModels.buscarUltimaResposta(idUsuario, idPergunta, idQuiz).then((data) => {
                return data[0] == undefined ? 1 : data[0].id_resposta_usuario + 1;
            })
            tentativa = getLastId;

            if(cont < respostas.length){
                insert += `\n (${getLastId}, '${respostas[cont - 1]}', ${idUsuario}, ${idPergunta}, ${idQuiz}),`;
                idPergunta++;
            } else{
                insert += `\n (${getLastId}, '${respostas[cont - 1]}', ${idUsuario}, ${idPergunta}, ${idQuiz});`;
                idPergunta++
            }
        }
    
        await quizModels.finalizarQuiz(insert);
        const replicaRespostas = await quizModels.buscarRespostasUsuario(tentativa, idUsuario, idQuiz);

        let pontuacao = 0;
        for(let i = 0; i < replicaRespostas.length; i++){
            
            const gabarito = replicaRespostas[i];
            if(gabarito.Resposta_usuario == gabarito.Resposta_pergunta){
                pontuacao++;
            }
        }

        quizModels.salvarPontuacao(tentativa, pontuacao, idUsuario, idQuiz).then((data) => {
            data.idTentativa = tentativa;
            data.pontuacao = pontuacao;
            res.status(203).json(data);
        })
    }
}

const buscarRespostas = async (req, res) => {
    
    const idQuiz = req.params.idQuiz;
    const idUsuario = req.params.idUsuario;
    const idTentativa = req.params.idTentativa;

    const getQuiz = await quizModels.buscarQuizId(idQuiz).then((data) => {
        return data.length <= 0 ? true : false;
    }) 

    const getUsuario = await usuarioModels.buscarUsuarioId(idUsuario).then((data) => {
        return data.length <= 0 ? true : false;
    })

    let getTentativa = await quizModels.buscarRespostasUsuario(idTentativa, idUsuario, idQuiz).then((data) => {
        return data.length <= 0 ? true : data;
    })

    if(getQuiz){
        res.status(400).send('Este quiz não existe ou não foi encontrado');
    } else if(getUsuario){
        res.status(400).send('Este usuário não existe ou não foi encontrado');
    } else if(getTentativa == true){
        res.status(400).send('Você ainda não realizou nenhuma tentativa');
    } else {
        res.status(203).json(getTentativa);
    }
}

const buscarRespostasQuiz = (req, res) => {

    const idQuiz = req.params.idQuiz;

    quizModels.buscarRespostaQuiz(idQuiz).then((data) => {
        res.status(203).json(data);
    })
}

const historicoTentativasUsuario = (req, res) => {

    const idUsuario = req.params.idUsuario;
    const idQuiz = req.params.idQuiz;

    quizModels.buscarHistorico(idUsuario, idQuiz).then((data) => {
        if(data.length == 0){
            res.status(400).send('Nenhum histórico de pontuação foi encontrado');
        } else {
            res.status(203).json(data);
        }
    })
}

const buscarAlternativasQuiz = (req, res) => {

    const idQuiz = req.params.idQuiz;

    quizModels.buscarAlternativasQuiz(idQuiz).then((alternativas) => {
        res.status(200).json(alternativas);
    })
}

module.exports = {
    buscarQuizzes,
    buscarPerguntas,
    finalizarQuiz,
    buscarRespostas,
    buscarRespostasQuiz,
    historicoTentativasUsuario,
    buscarAlternativasQuiz
}