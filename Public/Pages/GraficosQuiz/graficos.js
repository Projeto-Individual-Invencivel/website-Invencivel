window.onload = async () => {

    montarGraficos();
};

const Refazer = () => {
    window.location.href = "../RealizarQuiz/quiz.html";
}

const montarGraficos = () => {

    let url = `/quiz/respostas/${sessionStorage.ID_USUARIO}/${sessionStorage.ID_QUIZ}/${sessionStorage.ID_TENTATIVA}`;
    fetch(url, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res) => {

        if(res.ok){
            res.json().then(async (data) => {

                showPontuacao(data.length);
                await historicoTentativas(data.length);
                let estatisticas = await respostasUsuarios(data.length);

                for (let i = 0; i < data.length; i++) {
        
                    let opcoes = estatisticas[i];

                    const teste = document.getElementById('teste');
                    const div = document.createElement('div');

                    div.classList.add('bloco');
                    div.innerHTML = `<canvas id="GraficoPergunta${i}"></canvas>`;
                    teste.appendChild(div);

                    const ctx = document.getElementById(`GraficoPergunta${i}`);
                    new Chart(ctx, {
                        type: 'doughnut',
                        data: {
                            labels: opcoes.alternativas,
                            datasets: [{
                                label: 'Porcentagem de',
                                data: opcoes.porcentagem,
                                backgroundColor: opcoes.cores
                            }]
                        },
                        options: {
                            plugins: {
                                title: {
                                    display: true,
                                    text: `${data[i].Pergunta}`,
                                    font: {
                                        size: 20,
                                        weight: '700'
                                    }
                                },
                                legend: {
                                    position: 'bottom'
                                },
                                subtitle: {
                                    display: true,
                                    text: `Sua Resposta: ${data[i].Resposta_usuario}`,
                                    padding: {
                                        bottom: 10
                                    },
                                    font: {
                                        size: 15
                                    }
                                }
                            }
                        }
                    });
                }
            })
        } else{
            res.text().then((err) => {
                Swal.fire({
                    title: 'Ops... Algo deu errado!',
                    text: err,
                    icon: 'error'
                })
            })
        }
    })
}

const historicoTentativas = (PontuacaoMax) => {

    let url = `/quiz/historico/${sessionStorage.ID_USUARIO}/${sessionStorage.ID_QUIZ}`;
    fetch(url, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res) => {
        if(res.ok){

            res.json().then(data => {

                const historico = {
                    tentativa: [],
                    pontuacao: []
                };

                for(let i = 0; i < data.length; i++){

                    historico.tentativa.push(`${i + 1}° Tentativa`);
                    historico.pontuacao.push(data[i].Pontuacao);
                }

                const graHistorico = document.getElementById('GraficoBarra');
                graHistorico.width = '100%'

                new Chart(graHistorico, {
                    type: 'bar',
                    data:{
                        labels: historico.tentativa,
                        datasets: [{
                            label: `Acertos`,
                            data: historico.pontuacao,
                            backgroundColor: [
                                '#9C2348'
                            ]
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                min: 0,
                                max: PontuacaoMax
                            }
                        }
                    }
                })
            })
        } else{
            res.text().then(err => {
                Swal.fire({
                    title: 'Ops... Algo deu errado!',
                    text: err,
                    icon: 'error'
                })
            })
        }
    })
}

const respostasUsuarios = async (numPerguntas) => {

    const escolhas = [];

    let url = `/quiz/respostas/${sessionStorage.ID_QUIZ}`;
    await fetch(url, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    }).then(async (res) => {

        if(res.ok){
            await res.json().then((data) => {

                let model = {
                    idPergunta: 0,
                    alternativas: [],
                    porcentagem: [],
                    cores: ['#9C2348', '#33BFE7', '#F7E953', '#F68E1B', '#EA5E77', '#09090D']
                }
                for(let i = 1; i <= numPerguntas; i++){

                    model.idPergunta = i;
                    let opcoes = data.filter(x => x.Pergunta == data[i-1].Pergunta);

                    for(let item = 0; item < opcoes.length; item++){

                        let alt = opcoes[item];
                        model.alternativas.push(alt.Resposta);

                        let pontosTotais = 0;
                        opcoes.map(x => {''
                            pontosTotais += x.qtdOpcaoSelecionada;
                        })

                        let porcentagem = (alt.qtdOpcaoSelecionada / pontosTotais) * 100;

                        model.porcentagem.push(porcentagem.toFixed(2));
                        model.cores = model.cores.slice(0, opcoes.length);
                    }
                    escolhas.push(model);

                    model = {
                        idPergunta: 0,
                        alternativas: [],
                        porcentagem: [],
                        cores: ['#9C2348', '#33BFE7', '#F7E953', '#09090D', '#EA5E77', '#F68E1B']
                    }
                }
            })
        } else{
            res.text().then((err) => {
                Swal.fire({
                    title: 'Ops... Algo deu errado!',
                    text: err,
                    icon: 'error'
                })
            })
        }
    })
    return escolhas;
}

const showPontuacao = (pontuacaoMax) => {
    
    const pontuacao = sessionStorage.PONTUACAO;
    span_pontuacao.innerHTML = `${pontuacao}/${pontuacaoMax}`;
    if(pontuacao < 4){
        span_pontuacao.style.backgroundColor = "red";
        span_pontuacao.style.color = "white";
    } else if(pontuacao < 7){
        span_pontuacao.style.backgroundColor = "yellow";
        span_pontuacao.style.color = "black";
    } else {
        span_pontuacao.style.backgroundColor = "green";
        span_pontuacao.style.color = "white";
    }
}