window.onload = () => {

    if(sessionStorage.ID_USUARIO != undefined){

        linksNavegacao.innerHTML = `
            <li><a href="../Perfil/perfil.html">Perfil</a></li>
            <li>|</li>
            <li><a href="#" style="text-decoration: underline;">Fórum</a></li>
            <li>|</li>
            <li><a href="../Quizzes/quizzes.html">Quiz</a></li>
            <li>|</li>
            <li><a href="../../index.html" onclick="limpar()">Sair</a></li>
        `;
    
        a_criarTopico.style.display = "flex";
        p_nmUsuario.innerHTML = `Bem vindo, ${sessionStorage.NOME}`;
    } else{
        
        linksNavegacao.innerHTML = `
            <li><a href="#" style="text-decoration: underline;">Fórum</a></li>
            <li>|</li>
            <li><a href="../Login/login.html">Login</a></li>
            <li>|</li>
            <li><a href="../Cadastro/cadastro.html">Cadastro</a></li>
        `;
    }
    listarDiscussoes();
}

const listarDiscussoes = () => {
    
    let selecao = slc_filtros.value;
    const filtro = selecao == 'populares' ? 'curtidas desc' : selecao == 'novos' ? 'dtPostagem desc' : selecao == 'antigos' ? 'dtPostagem' : 'curtidas desc';
    
    let url = `/forum/listar/${filtro}`;
    fetch(url, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res) => {

        if(res.ok){
            res.json().then((data) => {
                
                let texto = "";
                for(let i = 0; i < data.length; i++){

                    let model = data[i];
                    let newData = new Date(model.dtPostagem);

                    let dia = newData.getDate() < 10 ? '0' + newData.getDate() : newData.getDate();
                    let minuto = newData.getMinutes() < 10 ? '0' + newData.getMinutes() : newData.getMinutes();

                    let formData = `${dia}/${newData.getMonth() + 1}/${newData.getFullYear()} às ${newData.getHours()}:${minuto}` 

                    let estrutura = `
                        <div class="box-topico">
                            <div class="box-numerador">
                                <span class="numerador">${i + 1}.</span>
                                <div class="topico">
                                    <span class="title-topico" onclick="Discussao(${model.id_discussao}, ${model.IDautor})">${model.titulo}</span>
                                    <div class="box-informacoes-topico">
                                        <span>Curtidas: ${model.curtidas}</span>
                                        <span>|</span>
                                        <span>Comentários: ${model.comentarios}</span>
                                        <span>|</span>
                                        <span>${model.Autor}</span>
                                        <span>|</span>
                                        <span>Postagem: ${formData}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    texto += estrutura
                }
                div_topicosForum.innerHTML = texto;
            })
        }
    })
}

const Discussao = (idDiscussao, idAutor) => {

    sessionStorage.ID_DISCUSSAO = idDiscussao;
    sessionStorage.ID_AUTOR = idAutor;
    window.location.href = "../Discussao/detalhesDiscussao.html";
}