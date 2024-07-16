const styleElement = document.createElement('style');
    let numRadio = 1;

    window.onload = () => {

        fetch(`/quiz/alternativas/${sessionStorage.ID_QUIZ}`, {
            method: 'GET',
            headers: {
                "Content-Type": 'application/json'
            }
        }).then(resposta => {
            resposta.json().then((data) => {
                
                let listaAlternativas = [];
                for(let i = 0; i < data.length; i++){
                    listaAlternativas.push(data[i].alternativa);
                }

                montarQuiz(listaAlternativas);        
            })
        })
    }

    const montarQuiz = async (listaAlternativas) => {
        h1_titulo.innerHTML = `Quiz: ${sessionStorage.TITULO}`;
        span_descricao.innerHTML = `${sessionStorage.DESCRICAO}`;

        let url = `/quiz/perguntas/${sessionStorage.ID_QUIZ}`;
        fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": 'application'
            }
        }).then((res) => {
            if(res.ok){
                res.json().then(async (data) => {
                    
                    for(let i = 0; i < data.length; i++){

                        let pergunta = data[i];
                        div_perguntas.innerHTML += `
                            <div class="pergunta-quiz">
                                <span class="pergunta">${i + 1}. ${pergunta.pergunta}</span>
                                <div class="alternativas" id="pergunta${i}">
                                </div>
                            </div>
                        `;

                        let numOpcoes = 1;
                        let opcoes = [];
                        while(numOpcoes <= 3){ // este laço vai embaralhar aleatoriamente as opcoes

                            let alternativa = Math.random() * (listaAlternativas.length - 1) + 0;
                            let opt = listaAlternativas[alternativa.toFixed()];

                            if(pergunta.resposta != opt && opt != opcoes.find(x => x == opt)){
                                opcoes.push(opt);
                                numOpcoes++
                            }
                        }
                        opcoes.push(pergunta.resposta);

                        let numAlternativas = 1;
                        let opcoesAdicionadas = [];
                        while(numAlternativas <= 4){ // este laço vai montar as alternativas de forma embaralhada

                            let alternativa = Math.random() * (opcoes.length - 1) + 0;
                            let opt = opcoes[alternativa.toFixed()];

                            let letra = numAlternativas == 1 ? 'A' : numAlternativas == 2 ? 'B' : numAlternativas == 3 ? 'C' : 'D'; 

                            if(opcoesAdicionadas.find(x => x == opt) == undefined){

                                document.getElementById(`pergunta${i}`).innerHTML += `
                                    <div class="opcao">
                                        <input type="radio" name="Pergunta${i}" id="radio${numRadio}">
                                        <div class="box-label">
                                            <label for="radio${numRadio}" class="label">${letra}. ${opt}</label>
                                        </div>
                                    </div>
                                `;

                                let css = `
                                    #radio${numRadio}:checked ~ .box-label .label{
                                        transition: 0.2s;
                                        background-color: #cc2e5d;
                                    }
                                `;

                                // isto aqui ira criar uma classe para cada radio de cada pergunta do quiz, permitindo com que ele tenha uma animacao de checked
                                numRadio++;
                                styleElement.textContent += css;
                                document.body.appendChild(styleElement);

                                opcoesAdicionadas.push(opt);
                                numAlternativas++;
                            }
                        }
                    }
                })
            } else{
                res.text().then((err) => {
                    console.log(err);
                })
            }
        })
    }

    const montarRespostasQuiz = () => {

        const respostasUser = [];
        const qtdPerguntas = (numRadio/4).toFixed();

        for(let i = 0; i < qtdPerguntas; i++){

            let escolha = document.querySelector(`input[name="Pergunta${i}"]:checked`);
            if(escolha == null){
                Swal.fire({
                    html: `Você esqueceu de selecionar uma opção da <strong>pergunta ${i + 1}</strong>`,
                    icon: 'error'
                })
                break;
            } else {
                let opcao = document.querySelector(`label[for="${escolha.id}"]`).textContent.substr(3);
                respostasUser.push(opcao);
            }
        }
        
        if(respostasUser.length == qtdPerguntas){
            finalizarQuiz(respostasUser);
        }
    }

    const finalizarQuiz = (respostasUser) => {
        
        let url = `/quiz/responder/${sessionStorage.ID_USUARIO}/${sessionStorage.ID_QUIZ}`;
        fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                respostas: respostasUser
            })
        }).then((res) => {

            if(res.ok){
                res.json().then((data) => {

                    sessionStorage.ID_TENTATIVA = data.idTentativa;
                    sessionStorage.PONTUACAO = data.pontuacao;

                    window.location.href = "../GraficosQuiz/graficos.html";
                })
            } else{
                res.text().then((err) => {
                    Swal.fire({
                        text: err,
                        icon: 'error'
                    })
                })
            }
        })
    }