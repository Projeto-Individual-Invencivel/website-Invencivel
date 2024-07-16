window.onload = () => {

    montarPostagem();
    ajustarLayout();
    btn_publicar.style.display = "none";
}

btn_publicar.onclick = () => {
    
    const respostaPost = txt_resposta.value;
    const idAutor = sessionStorage.ID_AUTOR;
    const idDiscussao = sessionStorage.ID_DISCUSSAO;
    const idUsuario = sessionStorage.ID_USUARIO;

    if(respostaPost == ""){
        Swal.fire({
            title: 'Ops... algo deu errado!',
            text: 'Campo comentário vazio',
            icon: 'error'
        })
    } else{
        let url = `/forum/responder/${idDiscussao}/${idAutor}/${idUsuario}`;
        fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                comentario: respostaPost
            })
        }).then((res) => {
            if(res.ok){
                res.json().then((data) => {
                    
                    btn_publicar.style.display = "none";
                    btn_resposta.style.display = "flex";

                    txt_resposta.value = "";
                    txt_resposta.style.display = 'none';
                    div_comentarios.innerHTML = ``;
                    window.onload();
                })
            } else {
                res.text().then((err) => {
                    Swal.fire({
                        title: 'Ops... algo de errado!',
                        text: err,
                        icon: 'error'
                    })
                })
            }
        })
    }
}

btn_resposta.onclick = () => {
    btn_cancelar.style.display = 'flex';
    txt_resposta.style.display = "flex";
    btn_resposta.style.display = "none";
    btn_publicar.style.display = "flex";
} 
btn_cancelar.onclick = () => {

    btn_resposta.innerHTML = "Responder";
    txt_resposta.style.display = "none";
    btn_resposta.style.display = "flex";
    btn_publicar.style.display = "none";
    btn_cancelar.style.display = 'none';
}

function Curtir(){
    
    if(sessionStorage.ID_USUARIO == undefined){
        Swal.fire({
            text: 'Você precisa entrar na plataforma para interagir nas publicações',
            icon: 'error',
            showCancelButton: false,
            showDenyButton: true,
            confirmButtonText: 'Entrar',
            denyButtonText: 'Cancelar'
        }).then((resultado) => {
            if(resultado.isConfirmed){
                window.location.href = "../Login/login.html";
            }
        })
    } else {
        let url = `/forum/curtir/${sessionStorage.ID_USUARIO}/${sessionStorage.ID_AUTOR}/${sessionStorage.ID_DISCUSSAO}`;
        fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }
        }).then((resposta) => {
            if(resposta.ok){

                buttonLike = document.getElementById('btn_curtir');

                buttonLike.disabled = true;
                buttonLike.style.backgroundColor = "#DBDBDB";

                buttonDislike = document.getElementById('btn_descurtir');
                buttonDislike.disabled = false;
                buttonDislike.style.backgroundColor = "";

                numeroCurtidas.innerHTML = parseInt(numeroCurtidas.textContent) + 1;
            } else{
                resposta.text().then((err) => {
                    Swal.fire({
                        text: err
                    })
                })
            }
        })
    }
}

function Descurtir(){
    if(sessionStorage.ID_USUARIO == undefined){
        Swal.fire({
            text: 'Você precisa entrar na plataforma para interagir nas publicações',
            icon: 'error',
            showCancelButton: false,
            showDenyButton: true,
            confirmButtonText: 'Entrar',
            denyButtonText: 'Cancelar'
        }).then((resultado) => {
            if(resultado.isConfirmed){
                window.location.href = "../Login/login.html";
            }
        })
    } else{
        let url = `/forum/descurtir/${sessionStorage.ID_USUARIO}/${sessionStorage.ID_AUTOR}/${sessionStorage.ID_DISCUSSAO}`;
        fetch(url, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            }
        }).then((resposta) => {
            if(resposta.ok){

                buttonDislike = document.getElementById('btn_descurtir');

                buttonDislike.disabled = true;
                buttonDislike.style.backgroundColor = "#DBDBDB";

                buttonLike = document.getElementById('btn_curtir');
                buttonLike.disabled = false;
                buttonLike.style.backgroundColor = "";

                numeroCurtidas.innerHTML = numeroCurtidas.textContent - 1;
            } else{
                resposta.text().then((err) => {
                    Swal.fire({
                        text: err
                    })
                })
            }
        })
    }
}

function montarPostagem() {
    let url = `/forum/discussao/${sessionStorage.ID_AUTOR}/${sessionStorage.ID_DISCUSSAO}`;
    fetch(url, {
        method: 'GET',
        headers: {
            "Content-Type": 'application/json'
        }
    }).then(res => {

        if(res.ok){
            res.json().then((data) => {
                
                let newData = new Date(data.dtPostagem);

                let dia = newData.getDate() < 10 ? '0' + newData.getDate() : newData.getDate();
                let minuto = newData.getMinutes() < 10 ? '0' + newData.getMinutes() : newData.getMinutes();

                let formData = `${dia}/${newData.getMonth() + 1}/${newData.getFullYear()} às ${newData.getHours()}:${minuto}`; 

                div_postagem.innerHTML = `
                    <div class="box-likes">
                        <button onclick="Curtir()" id="btn_curtir"><img src="../../Assets/Images/arrow-top.png" height="20em" alt="seta para cima"></button>
                        <span id="numeroCurtidas">${data.curtidas}</span>
                        <button onclick="Descurtir()" id="btn_descurtir"><img src="../../Assets/Images/arrow-bottom.png" height="20em" alt="seta para baixo"></button>
                    </div>
                    <div class="box-topico">
                        <div class="box-dados-post">
                            <span onclick="visitarPerfil(${data.fkDiscussaoUsuario})">${data.autor}</span>
                            <span>Postagem: ${formData}</span>
                        </div>
                        <div class="box-titulo-post">
                            <h1>${data.titulo}</h1>
                        </div>
                        <div class="box-conteudo-post">
                            <span>
                                ${data.descricao}
                            </span>
                        </div>
                    </div>
                `;
                organizarComentarios(data.comentarios)
            })
        } else{
            res.text().then((data) => {
                console.error(data);
            })
        }
    })
}

function organizarComentarios(comentarios){

    const exibirBtnResponder = sessionStorage.ID_USUARIO != undefined ? 'display: flex;' : 'display: none';

    const comentariosPrincipais = [];
    for(let i = 0; i < comentarios.length; i++){
        if(comentarios[i].fkRespostaComentario == null){
            
            let box = comentarios.filter(x => x.fkRespostaComentario == comentarios[i].id_comentario);
            comentarios[i].respostas = box;

            comentariosPrincipais.push(comentarios[i]);
        }
    }

    for(let i = 0; i < comentariosPrincipais.length; i++){

        let newData = new Date(comentariosPrincipais[i].dtPostagem);

        let dia = newData.getDate() < 10 ? '0' + newData.getDate() : newData.getDate();
        let minuto = newData.getMinutes() < 10 ? '0' + newData.getMinutes() : newData.getMinutes();

        let formData = `${dia}/${newData.getMonth() + 1}/${newData.getFullYear()} às ${newData.getHours()}:${minuto}`; 

        const dadosComentario = comentariosPrincipais[i];
        const idComentarioPrincipal = dadosComentario.id_comentario;
        const spanLikesComentario = `span_likescomentario${idComentarioPrincipal}`;
        const btnCurtirComentario = `btn_curtir_comentario${idComentarioPrincipal}`;
        const btnDescurtirComentario = `btn_descurtir_comentario${idComentarioPrincipal}`;
        const spanComentario = `span_comentarioUsuario${idComentarioPrincipal}`;
        const txtComentario = `txt_editarComentario${idComentarioPrincipal}`;
        const divResponder = `div_formResponder${idComentarioPrincipal}`;
        const divEditar = `div_formEditar${idComentarioPrincipal}`;

        const exibirFuncionalidades = sessionStorage.ID_USUARIO == dadosComentario.fkAutorComentario ? "display: flex;" : "display: none;";

        div_comentarios.innerHTML += `
            <div class="estrutura-comentario">
                <div class="box-comentario">
                    <div class="box-likes-comentario">
                        <button onclick="curtirComentario(${idComentarioPrincipal}, ${spanLikesComentario}, ${btnCurtirComentario}, ${btnDescurtirComentario})" id="${btnCurtirComentario}"><img src="../../Assets/Images/arrow-top.png" height="20em" alt="seta para cima"></button>
                        <span id="${spanLikesComentario}">${dadosComentario.curtidas}</span>
                        <button onclick="descurtirComentario(${idComentarioPrincipal}, ${spanLikesComentario}, ${btnCurtirComentario}, ${btnDescurtirComentario})" id="${btnDescurtirComentario}"><img src="../../Assets/Images/arrow-bottom.png" height="20em" alt="seta para baixo"></button>
                    </div>
                    <div class="box-dados-comentario">
                        <div class="box-autor-comentario">
                            <div class="box-informacoes">
                                <span onclick="visitarPerfil(${dadosComentario.fkAutorComentario})">${dadosComentario.autor}</span>
                                <span>Postagem: ${formData}</span>
                            </div>
                            <div class="box-editar-apagar" style="${exibirFuncionalidades}">
                                <img src="../../Assets/Images/img-excluir-150.png" onclick="excluirComentario(${idComentarioPrincipal})" alt="imagem lixeira" height="25em">
                                <a href="#"><img src="../../Assets/Images/img-editar-128.png" onclick="exibirEditarComentario(${spanComentario}, ${txtComentario}, ${divResponder}, ${divEditar})" alt="imagem lapis" height="25em"></a>
                            </div>
                        </div>
                        <div class="box-comentario-usuario">
                            <span id="${spanComentario}">${dadosComentario.comentario}</span>
                            <textarea id="${txtComentario}" style="display: none;">${dadosComentario.comentario}</textarea>
                        </div>
                        <div class="box-responder-comentario" id="${divResponder}" style="${exibirBtnResponder}">
                            <textarea id="txt_resposta_comentario_principal${idComentarioPrincipal}" placeholder="Escreva sua resposta aqui"></textarea>
                            <button class="btn-responder-comentario" onclick="responderComentario(txt_resposta_comentario_principal${idComentarioPrincipal}, ${idComentarioPrincipal}, '${dadosComentario.autor}')">Responder</button>
                        </div>
                        <div class="box-editar-comentario" id="${divEditar}" style="display: none;">
                            <button class="btn-salvar" onclick="salvarAlteracoesComentario(${txtComentario}, ${idComentarioPrincipal})">Salvar</button>
                            <button class="btn-descartar" onclick="cancelarEditarComentario(${spanComentario}, ${txtComentario}, ${divResponder}, ${divEditar})">Cancelar</button>
                        </div>
                    </div>
                </div>
                <div class="box-resposta-comentario-topico" id="respostaComentario${i}">
                </div>
            </div>
        `;
        for(let index = 0; index < dadosComentario.respostas.length; index++){

            const dadosResposta = dadosComentario.respostas[index];
            let nomeUsuario = dadosComentario.autor.substr(0, dadosComentario.autor.indexOf(" "));

            let newData = new Date(dadosResposta.dtPostagem);

            let dia = newData.getDate() < 10 ? '0' + newData.getDate() : newData.getDate();
            let minuto = newData.getMinutes() < 10 ? '0' + newData.getMinutes() : newData.getMinutes();

            let formData = `${dia}/${newData.getMonth() + 1}/${newData.getFullYear()} às ${newData.getHours()}:${minuto}`;

            const idComentario = dadosResposta.id_comentario;
            const spanLikesRespostaComent = `span_likescomentario${idComentario}`;    
            const btnCurtirComentario = `btn_curtir_comentario${idComentario}`;
            const btnDescurtirComentario = `btn_descurtir_comentario${idComentario}`;
            const spanComentarioResposta = `span_respostacomentario${idComentario}`;
            const txtComentarioResposta = `txt_editarResComentario${idComentario}`;
            const divResponderResposta = `div_formResponderComentario${idComentario}`;
            const divEditarResposta = `div_formEditarResposta${idComentario}`;

            const exibirAcoes = sessionStorage.ID_USUARIO == dadosResposta.fkAutorComentario ? "display: flex;" : "display: none;";

            document.getElementById(`respostaComentario${i}`).innerHTML += `
                <div class="estrutura-comentario">
                    <div class="box-comentario">
                        <div class="box-likes-comentario">
                            <button onclick="curtirComentario(${idComentario}, ${spanLikesRespostaComent}, ${btnCurtirComentario}, ${btnDescurtirComentario})" id="${btnCurtirComentario}"><img src="../../Assets/Images/arrow-top.png" height="20em" alt="seta para cima"></button>
                            <span id="${spanLikesRespostaComent}">${dadosResposta.curtidas}</span>
                            <button onclick="descurtirComentario(${idComentario}, ${spanLikesRespostaComent}, ${btnCurtirComentario}, ${btnDescurtirComentario})" id="${btnDescurtirComentario}"><img src="../../Assets/Images/arrow-bottom.png" height="20em" alt="seta para baixo"></button>
                        </div>
                        <div class="box-dados-comentario">
                            <div class="box-autor-comentario">
                                <div class="box-informacoes">
                                    <span onclick="visitarPerfil(${dadosResposta.fkAutorComentario})">${dadosResposta.autor}</span>
                                    <span>Postagem: ${formData}</span>
                                </div>
                                <div class="box-editar-apagar" style="${exibirAcoes}">
                                    <img src="../../Assets/Images/img-excluir-150.png" onclick="excluirComentario(${idComentario})" alt="imagem lixeira" height="25em">
                                    <img src="../../Assets/Images/img-editar-128.png" onclick="exibirEditarComentario(${spanComentarioResposta}, ${txtComentarioResposta}, ${divResponderResposta}, ${divEditarResposta})" alt="imagem lapis" height="25em">
                                </div>
                            </div>
                            <div class="box-comentario-usuario">
                                <span id="${spanComentarioResposta}">${dadosResposta.comentario}</span>
                                <textarea id="${txtComentarioResposta}" style="display: none;">${dadosResposta.comentario}</textarea>
                            </div>
                            <div class="box-responder-comentario" id="${divResponderResposta}" style="${exibirBtnResponder}">
                                <textarea id="txt_resposta_comentario${idComentario}" placeholder="Escreva sua resposta aqui"></textarea>
                                <button class="btn-responder-comentario" onclick="responderComentario(txt_resposta_comentario${idComentario}, ${dadosResposta.id_comentario}, '${dadosResposta.autor}')">Responder</button>
                            </div>
                            <div class="box-editar-comentario" id="${divEditarResposta}" style="display: none;">
                                <button class="btn-salvar" onclick="salvarAlteracoesComentario(${txtComentarioResposta}, ${idComentario})">Salvar</button>
                                <button class="btn-descartar" onclick="cancelarEditarComentario(${spanComentarioResposta}, ${txtComentarioResposta}, ${divResponderResposta}, ${divEditarResposta})">Cancelar</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
}

function ajustarLayout(){
    
    if(sessionStorage.ID_USUARIO != undefined){

        linksNavegacao.innerHTML = `
            <li><a href="../Perfil/perfil.html">Perfil</a></li>
            <li>|</li>
            <li><a href="../Forum/forum.html">Fórum</a></li>
            <li>|</li>
            <li><a href="../Quizzes/quizzes.html">Quiz</a></li>
            <li>|</li>
            <li><a href="../../index.html" onclick="limpar()">Sair</a></li>
        `;
        div_responderTopico.style.display = "flex";
    } else{
        
        linksNavegacao.innerHTML = `
            <li><a href="../Forum/forum.html">Fórum</a></li>
            <li>|</li>
            <li><a href="../Login/login.html">Login</a></li>
            <li>|</li>
            <li><a href="../Cadastro/cadastro.html">Cadastro</a></li>
        `;
    }
}

function responderComentario(txtRespostaId, idRespostaComentario, autor) {

    let comentarioReq = `${txtRespostaId.value}`;
    const idAutor = sessionStorage.ID_AUTOR;
    const idDiscussao = sessionStorage.ID_DISCUSSAO;
    const idUsuario = sessionStorage.ID_USUARIO;

    if(comentarioReq == ""){
        Swal.fire({
            title: 'Ops... algo deu errado!',
            text: 'Campo comentário vazio',
            icon: 'error'
        })
    } else if(idAutor == 0 || idDiscussao == 0 || idUsuario == 0){
        Swal.fire({
            title: 'Ops... algo deu errado!',
            text: 'Houve um erro ao tentar localizar o comentário',
            icon: 'error'
        })
    } else{
    
        let url = `/comentario/responder/${idAutor}/${idDiscussao}/${idUsuario}/${idRespostaComentario}`;

        fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                comentario: `@${autor.replaceAll(' ', '')} ${comentarioReq}`
            })
        }).then((res) => {

            if(res.ok){
                res.json().then((data) => {

                    txtRespostaId.value = "";
                    div_comentarios.innerHTML = ``;
                    window.onload();
                })
            } else{
                res.text().then((err) => {
                    Swal.fire({
                        title: 'Ops... algo deu errado!',
                        text: err,
                        icon: 'error'
                    })
                })
            }
        })
    }

    
}

function curtirComentario(idComentario, spanLikesComentario, idBtnLike, idBtnDislike){

    if(sessionStorage.ID_USUARIO == undefined){
        Swal.fire({
            text: 'Você precisa entrar na plataforma para interagir nas publicações',
            icon: 'error',
            showCancelButton: false,
            showDenyButton: true,
            confirmButtonText: 'Entrar',
            denyButtonText: 'Cancelar'
        }).then((resultado) => {
            if(resultado.isConfirmed){
                window.location.href = "../Login/login.html";
            }
        })
    } else {

        let url = `/comentario/curtir/${sessionStorage.ID_USUARIO}/${idComentario}`; 
        fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }
        }).then((resposta) => {
            if(resposta.ok){
                resposta.json().then((data) => {

                    idBtnLike.disabled = true;
                    idBtnLike.style.backgroundColor = "#DBDBDB";
                    spanLikesComentario.innerHTML = parseInt(spanLikesComentario.textContent) + 1;

                    idBtnDislike.disabled = false;
                    idBtnDislike.style.backgroundColor = "";
                })
            } else{
                resposta.text().then((err) => {
                    Swal.fire({
                        text: err
                    })
                })
            }
        })
    }
}

function descurtirComentario(idComentario, spanLikesComentario, idBtnLike, idBtnDislike){
    
    if(sessionStorage.ID_USUARIO == undefined){
        Swal.fire({
            text: 'Você precisa entrar na plataforma para interagir nas publicações',
            icon: 'error',
            showCancelButton: false,
            showDenyButton: true,
            confirmButtonText: 'Entrar',
            denyButtonText: 'Cancelar'
        }).then((resultado) => {
            if(resultado.isConfirmed){
                window.location.href = "../Login/login.html";
            }
        })
    } else {

        let url = `/comentario/descurtir/${sessionStorage.ID_USUARIO}/${idComentario}`; 
        fetch(url, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            }
        }).then((resposta) => {
            if(resposta.ok){
                resposta.json().then((data) => {
                    
                    idBtnLike.disabled = false;
                    idBtnLike.style.backgroundColor = "";
                    spanLikesComentario.innerHTML = parseInt(spanLikesComentario.textContent) - 1;

                    idBtnDislike.disabled = true;
                    idBtnDislike.style.backgroundColor = "#DBDBDB";
                })
            } else{
                resposta.text().then((err) => {
                    Swal.fire({
                        text: err
                    })
                })
            }
        })
    }
}

function visitarPerfil(idUsuario){

    sessionStorage.ID_VISITANTE = idUsuario;
    window.location.href = '../Perfil/perfil.html';
}

function excluirComentario(idComentario){

    Swal.fire({
        title: 'Excluir comentário?',
        text: 'A alteração não poderá ser desfeita!',
        icon: 'warning',
        confirmButtonText: 'Apagar comentário',
        showCancelButton: true,
        cancelButtonColor: "#d33",
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true, 
        preConfirm: async () => {
            fetch(`/comentario/apagar/${sessionStorage.ID_USUARIO}/${idComentario}`, {
                mode: 'cors',
                method: 'DELETE'
            }).then((res) => {
                if(res.ok){
                    res.text().then((data) => {
                        Swal.fire({
                            title: data,
                            icon: 'success'
                        })
                        setTimeout(() => {
                            location.reload();
                        }, 2000)
                    })
                } else{
                    res.text().then((err) => {
                        Swal.fire({
                            title: 'Ops! Algo deu errado!',
                            text: err,
                            icon: 'error'
                        })
                    })
                }
            })
        }
    });
}

function exibirEditarComentario(span, textarea, divFormRes, divFormEdit){

    divFormRes.style.display = 'none';
    span.style.display = 'none';
    textarea.style.display = 'flex';
    divFormEdit.style.display = 'flex';
}

function cancelarEditarComentario(span, textarea, divFormRes, divFormEdit){

    divFormRes.style.display = 'flex';
    span.style.display = 'flex';
    textarea.style.display = 'none';
    divFormEdit.style.display = 'none';  
}

function salvarAlteracoesComentario(alteracoes, idComentario){

    const idUsuario = sessionStorage.ID_USUARIO;
    const comentario = alteracoes.value;

    fetch(`/comentario/editar/${idUsuario}/${idComentario}`, {
        method:  'PUT',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            comentario
        })
    }).then((res) => {
        if(res.ok){
            res.json().then((data) => {
                Swal.fire({
                    title: 'Comentário atualizado!',
                    icon: 'success'
                });
                setTimeout(() => {
                    location.reload();
                }, 2000)
            })
        } else{
            res.text().then((err) => {
                Swal.fire({
                    title: 'Ops! Algo deu errado!',
                    text: err,
                    icon: 'error'
                })
            })
        }
    })
}