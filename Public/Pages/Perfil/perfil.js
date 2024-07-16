window.onload = () => {

    infoUsuario();
    ajustarNavBar();
    interacoesUsuario();
}

const infoUsuario = () => {

    let idPerfil = 0;
    if(sessionStorage.ID_VISITANTE == sessionStorage.ID_USUARIO || sessionStorage.ID_VISITANTE == undefined){
        idPerfil = sessionStorage.ID_USUARIO;
    } else{
        idPerfil = sessionStorage.ID_VISITANTE;
    }

    fetch(`/usuarios/perfil/${idPerfil}`, {
        method: 'GET',
        mode: 'cors'
    }).then((res) => {
        if(res.ok){
            res.json().then((data) => {
                
                div_numCurtidas.innerHTML = `${data.likesPosts + data.likesComments}`;
                div_numPostagens.innerHTML = data.posts;
                div_numComentarios.innerHTML = data.coments;

                if(sessionStorage.ID_USUARIO == sessionStorage.ID_VISITANTE || sessionStorage.ID_VISITANTE == undefined){

                    let dtFormatada = new Date(data.dtNasc);
                    let mes = dtFormatada.getMonth() + 1;
                    mes = mes < 10 ? '0' + mes : mes;

                    div_informacoesUsuario.innerHTML = `
                        <h2>Suas Informações:</h2>
                        <input type="text" placeholder="Nome de usuário" id="inp_nome" value="${data.nome}">
                        <input type="text" placeholder="Email do usuário" id="inp_email" value="${data.email}">
                        <input type="date" id="inp_nascimento" value="${dtFormatada.getFullYear()}-${mes}-${dtFormatada.getDate()}">
                        <span class="span-inscricao">${dataInscricao(new Date(data.dtContaCriada))}</span>
                        <div class="box-eventos">
                            <button class="btn-salvar" onclick="atualizarPerfil()">Salvar</button>
                            <button class="btn-descartar" onclick="infoUsuario()">Descartar</button>
                        </div>
                    `;
                } else{
                    div_informacoesUsuario.innerHTML = `
                        <h1 style="font-size: 3em">${data.nome}</h1>
                        <span>${data.email}</span>
                        <span class="span-inscricao" style="width: 35%; margin-top: 2%;">${dataInscricao(new Date(data.dtContaCriada))}</span>
                    `;
                }
            })
        } else{
            res.text().then((err) => {
                console.log(err);
            })
        }
    })
}

const dataInscricao = (ContaCriada) => {

    const dt = new Date(ContaCriada);

    const meses = [ 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    const msg = `Na plataforma desde ${meses[dt.getMonth()]} de ${dt.getFullYear()}`;
    return msg;
}

const ajustarNavBar = () => {

    if(sessionStorage.ID_USUARIO != undefined){
        ul_linksNav.innerHTML += `
            <li><a href="../Quizzes/quizzes.html" onclick="sessionStorage.removeItem('ID_VISITANTE')">Quiz</a></li>
            <li>|</li>
            <li><a href="../../index.html" onclick="sessionStorage.clear()">Sair</a></li>
        `;  
    } else{
        ul_linksNav.innerHTML += `
            <li><a href="../Login/login.html">Login</a></li>
            <li>|</li>
            <li><a href="../Cadastro/cadastro.html">Cadastro</a></li>
        `;
    }
}

const interacoesUsuario = () => {

    let idPerfil = 0;
    if(sessionStorage.ID_VISITANTE == sessionStorage.ID_USUARIO || sessionStorage.ID_VISITANTE == undefined){
        idPerfil = sessionStorage.ID_USUARIO;
    } else{
        idPerfil = sessionStorage.ID_VISITANTE;
    }

    fetch(`/usuarios/publicacoes/${idPerfil}`, {
        method: 'GET',
        mode: 'cors'
    }).then((res) => {
        if(res.ok){
            res.json().then((data) => {

                data.postagens.map((item) => {

                    let dt = new Date(item.dtPostagem);
                    let mes = dt.getMonth() + 1;
                    mes = mes < 10 ? '0' + mes : mes;

                    let minuto = dt.getMinutes();
                    minuto = minuto < 10 ? '0' + minuto : minuto;

                    div_conteudoPosts.innerHTML += `
                        <div class="info-conteudo">
                            <h3>${item.titulo}</h3>
                            <div>
                                <ul>
                                    <li>Curtidas: ${item.curtidas}</li>
                                    <li>|</li>
                                    <li>Postagem: ${dt.getDate()}/${mes}/${dt.getFullYear()} às ${dt.getHours()}:${minuto}</li>
                                </ul>
                            </div>
                        </div>
                    `;
                })
                data.comentarios.map((item) => {
                    let dt = new Date(item.dtPostagem);
                    let mes = dt.getMonth() + 1;
                    mes = mes < 10 ? '0' + mes : mes;

                    let minuto = dt.getMinutes();
                    minuto = minuto < 10 ? '0' + minuto : minuto;

                    div_conteudoComments.innerHTML += `
                        <div class="info-conteudo">
                            <h3>${item.comentario}</h3>
                            <div>
                                <ul>
                                    <li>Curtidas: ${item.curtidas}</li>
                                    <li>|</li>
                                    <li>Postagem: ${dt.getDate()}/${mes}/${dt.getFullYear()} às ${dt.getHours()}:${minuto}</li>
                                </ul>
                            </div>
                        </div>
                    `;
                })
            })
        } else{
            res.text().then((err) => {
                console.error(err)
            })
        }
    })
}

const atualizarPerfil = () => {

    Swal.fire({
        title: 'Informe a senha para continuar',
        text: 'A alteração não poderá ser desfeita!',
        icon: 'warning',
        input: 'password',
        inputAttributes: {
            autocapitalize: "off"
        },
        confirmButtonText: 'Alterar dados',
        showLoaderOnConfirm: true, 
        preConfirm: async (senha) => {

            console.log(senha);

            await fetch(`/usuarios/editar-perfil/${sessionStorage.ID_USUARIO}`, {
                method: 'PUT',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: document.getElementById('inp_nome').value,
                    email: document.getElementById('inp_email').value,
                    senha,
                    nascimento: new Date(document.getElementById('inp_nascimento').value)
                })
            }).then((res) => {
                if(res.ok){
                    Swal.fire({
                        title: 'Alterações confirmadas!',
                        icon: 'success'
                    })

                    sessionStorage.NOME = document.getElementById('inp_nome').value;

                    setTimeout(() => {
                        infoUsuario();
                    }, 2000);
                } else{
                    res.text().then((err) => {
                        Swal.fire({
                            title: 'Ops! Algo deu errado!',
                            text: err,
                            icon: 'error'
                        })
                        infoUsuario();
                    })
                }
            })
        }
    });
}