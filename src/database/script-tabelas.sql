-- Arquivo de apoio, caso você queira criar tabelas como as aqui criadas para a API funcionar.
-- Você precisa executar os comandos no banco de dados para criar as tabelas,
-- ter este arquivo aqui não significa que a tabela em seu BD estará como abaixo!

/*
comandos para mysql server
*/
create database dbProjetoIndividual;
use dbProjetoIndividual;

create table tb_usuario(
	id_usuario int primary key auto_increment,
    nome varchar(50) not null,
    dtNasc date not null,
    email varchar(80),
    senha varchar(50)
);

create table tb_discussao(
	id_discussao int,
    fkDiscussaoUsuario int,
    constraint primary key (id_discussao, fkDiscussaoUsuario),
    titulo varchar(100) not null,
    descricao varchar(300) not null,
    dtPostagem datetime default current_timestamp,
    constraint fkAutorDiscussao foreign key (fkDiscussaoUsuario)
		references tb_usuario (id_usuario)
);

create table tb_comentario(
	id_comentario int primary key auto_increment,
    comentario varchar(200) not null,
    dtPostagem datetime default current_timestamp,
    fkDiscussao int not null,
    fkAutorDiscussao int not null,
    fkAutorComentario int not null,
    fkRespostaComentario int,
    
    constraint fkDiscussaoComentario foreign key (fkDiscussao)
		references tb_discussao(id_discussao),
	constraint fkCriadorTopico foreign key (fkAutorDiscussao)
		references tb_usuario(id_usuario),
	constraint fkCriadorComentario foreign key (fkAutorComentario)
		references tb_usuario(id_usuario)
);

create table tb_curtida_discussao(
	id_curtida_discussao int,
    fkDiscussao int,
    fkAutorDiscussao int,
    fkAutorCurtida int,
    constraint primary key(id_curtida_discussao, fkDiscussao, fkAutorDiscussao, fkAutorCurtida),
    constraint fkDiscussaoCurtida foreign key (fkDiscussao)
		references tb_discussao(id_discussao),
	constraint fkAutor foreign key (fkAutorDiscussao)
		references tb_usuario(id_usuario),
	constraint fkCurtidor foreign key (fkAutorCurtida)
		references tb_usuario(id_usuario)
);

create table tb_curtida_comentario(
	id_curtida_comentario int,
    fkComentario int,
    fkAutorCurtida int,
    constraint primary key (id_curtida_comentario, fkComentario, fkAutorCurtida),
    constraint fkAutorComentario foreign key (fkComentario)
		references tb_comentario(id_comentario),
	constraint fkCurtidorComentario foreign key (fkAutorCurtida)
		references tb_usuario(id_usuario)
);

create table tb_quiz(
	id_quiz int primary key auto_increment,
    titulo varchar(100) not null,
    descricao varchar(100) not null,
    dtCriado datetime default current_timestamp
);

create table tb_pergunta(
	id_pergunta int,
    fkQuiz int,
    constraint primary key (id_pergunta, fkQuiz),
    pergunta varchar(150) not null,
    resposta varchar(50) not null
);

create table tb_resposta_usuario(
	id_resposta_usuario int,
    resposta varchar(40) not null,
    fkUsuario int,
    fkPergunta int,
    fkQuiz int,
    constraint primary key (id_resposta_usuario, fkUsuario, fkPergunta, fkQuiz),
    constraint fkResUsuario foreign key (fkUsuario)
		references tb_usuario(id_usuario),
	constraint fkPerguntaQuiz foreign key (fkPergunta)
		references tb_pergunta(id_pergunta),
	constraint fkFormularioQuiz foreign key (fkQuiz) 
		references tb_quiz(id_quiz)
);

create table tb_pontuacao_quiz(
	id_pontuacao_quiz int,
    qtdAcertos int,
    fkUsuario int,
    fkQuiz int,
    constraint primary key(id_pontuacao_quiz, fkUsuario, fkQuiz),
    constraint fkQuizUsuario foreign key (fkUsuario)
		references tb_usuario(id_usuario),
    constraint fkQuizFeito foreign key (fkQuiz)
		references tb_quiz(id_quiz)
);

INSERT INTO tb_usuario (nome, dtNasc, email, senha) VALUES
	('João Silva', '1990-03-15', 'joao.silva@example.com', 'senha123'),
	('Maria Santos', '1985-07-20', 'maria.santos@example.com', 'senha456'),
	('Pedro Oliveira', '1995-01-10', 'pedro.oliveira@example.com', 'senha789'),
	('Ana Souza', '1988-09-25', 'ana.souza@example.com', 'senhaabc'),
	('Lucas Pereira', '1992-05-30', 'lucas.pereira@example.com', 'senhaxyz'),
	('Carla Costa', '1998-11-12', 'carla.costa@example.com', 'senhajkl'),
	('Fernando Almeida', '1983-04-18', 'fernando.almeida@example.com', 'senhawxy'),
	('Juliana Lima', '1991-08-05', 'juliana.lima@example.com', 'senharst'),
	('Marcos Santos', '1987-02-28', 'marcos.santos@example.com', 'senha456'),
	('Mariana Oliveira', '1994-06-22', 'mariana.oliveira@example.com', 'senha789');
    
INSERT INTO tb_discussao (id_discussao, fkDiscussaoUsuario, titulo, descricao, dtPostagem) VALUES
	(1, 2, 'Teorias sobre Invencível: Próximos Episódios', 'Quais são as suas teorias para os próximos episódios de Invencível? Compartilhe suas especulações e expectativas.', '2023-06-19 18:20:22'),
	(2, 2, 'Cenas Épicas em Invencível', 'Quais foram as cenas mais épicas que você viu em Invencível até agora? Discuta momentos de ação e emocionantes.', '2024-01-04 14:29:58'),
	(1, 1, 'Conversa sobre Invencível: Quadrinhos vs. Série', 'Comparação entre os quadrinhos e a série Invencível. O que você acha das adaptações e das diferenças entre os dois formatos?', '2024-02-13 20:13:47');

INSERT INTO tb_comentario VALUES
    (null, 'A série Invencível capturou a essência dos quadrinhos de uma forma incrível! Estou impressionado com a fidelidade à história original', '2024-02-13 21:01:22', 1, 1, 6, null),
    (null, 'Embora a série Invencível tenha algumas diferenças em relação aos quadrinhos, acho que as mudanças ajudam a adaptar a história para um novo público.', '2024-02-14 11:01:22', 1, 1, 2, null),
    (null, 'Os quadrinhos de Invencível são ótimos, mas a série expande ainda mais o universo e os personagens de uma maneira que os fãs antigos e novos podem apreciar.', '2024-02-13 20:31:22', 1, 1, 8, null),
    (null, 'Embora a serie esteja otima, ainda prefiro os quadrinhos', '2024-02-14 09:31:22', 1, 1, 7, 3),
    (null, 'As cenas épicas em Invencível são de tirar o fôlego! Cada momento de ação é meticulosamente animado e emocionante de assistir.', '2024-01-04 14:34:01', 2, 2, 9, null),
    (null, 'Nao tem oq o reclamar, os animadores se esforçaram ao máximo!', '2024-01-04 14:57:01', 2, 2, 5, 5),
    (null, 'Realmente, na luta contra os viltrumitas os caras arrasaram dms!!!', '2024-01-04 15:09:41', 2, 2, 2, 6),
    (null, 'Estou tão empolgado para os próximos episódios de Invencível! Minha teoria é que veremos mais sobre o passado misterioso de alguns personagens-chave.', '2023-06-20 10:33:43', 1, 2, 9, null),
    (null, 'Estou especulando que nos próximos episódios de Invencível, veremos o protagonista enfrentando consequências cada vez mais graves de suas escolhas e ações.', '2023-06-22 16:29:53', 1, 2, 6, null);

INSERT INTO tb_curtida_discussao VALUES
    (1, 1, 2, 6),
    (1, 2, 2, 4),
    (1, 1, 1, 2),
    (1, 2, 2, 8),
    (1, 1, 1, 5),
    (1, 2, 2, 6),
    (1, 1, 1, 3);
    
INSERT INTO tb_curtida_comentario VALUES
	(1, 3, 4),
	(2, 2, 4),
	(1, 1, 8),
	(2, 3, 8),
	(1, 2, 5),
	(1, 3, 2),
	(1, 3, 1),
	(2, 6, 1);

INSERT INTO tb_quiz VALUES
	(null, 'Personagens da Série!', 'Desafio Invecível: Teste seu Conhecimento sobre o elenco da obra, você realmente conhece todos?', default);
    
INSERT INTO tb_pergunta VALUES
	(1, 1, 'Quem é o protagonista da série "Invencível"?', 'Mark Grayson'),
	(2, 1, 'Qual é o nome do pai de Mark e um dos super-heróis mais poderosos da Terra?', 'Nolan Grayson'),
	(3, 1, 'Qual é o poder de Eve Wilkins em "Invencível"?', 'Manipulação de matéria'),
	(4, 1, 'Quem é o melhor amigo de Mark e um dos poucos que sabe sobre sua identidade como Invencível?', 'William Clockwell'),
	(5, 1, 'Qual é o nome da interesse amoroso de Mark na série "Invencível"?', 'Amber Bennett'),
	(6, 1, 'Qual é o super-herói conhecido por ser antigo e poderoso, e membro da Guarda Global?', 'O Immortal'),
	(7, 1, 'Qual é o poder de Rex Sloan em "Invencível"?', 'Criar explosões'),
	(8, 1, 'Quem é a super-heroína com a habilidade de se transformar em um monstro gigante quando está em perigo?', 'Monster Girl');
    
select * from tb_usuario;
select * from tb_discussao;
select * from tb_comentario;
select * from tb_quiz;
select * from tb_pergunta;
select * from tb_curtida_discussao;
select * from tb_curtida_comentario;

-- SELECT para ver as discussões que cada usuário criou 
select tb_usuario.*, tb_discussao.*
	from tb_usuario join tb_discussao
    on tb_discussao.fkDiscussaoUsuario = tb_usuario.id_usuario;

-- SELECT para ver os comentarios de cada usuário
select tb_usuario.*, tb_comentario.*
	from tb_usuario join tb_comentario
    on tb_usuario.id_usuario = tb_comentario.fkAutorComentario;

-- SELECT para ver os comentarios com respostas
select tb_comentario.*, respostaComentario.*
	from tb_comentario join tb_comentario as respostaComentario
    on tb_comentario.fkRespostaComentario = respostaComentario.id_comentario;
    
-- SELECT para ver os comentários de cada discussão
select tb_discussao.*, tb_comentario.*
	from tb_discussao join tb_comentario
    on tb_discussao.fkDiscussaoUsuario = tb_comentario.fkAutorDiscussao
    and tb_discussao.id_discussao = tb_comentario.fkDiscussao;
    
