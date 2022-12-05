

var alfabetoInicial = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
var listaDePalavras = "";
var tamanhoMatriz = 0;
var posicaoErro = 0;
var matrizAutomato = [];
var linhasFinais = [];

//Inicia o botao apagar tabela e preenche o cabeçalho da tabela com o alfabeto.
$(document).ready(function () {
	$('.botaoApagar').modal();
	$(".alfabeto").append("<th scope='col'>δ</th>");
	for (var a = 0; a < 26; a++) {
		$(".alfabeto").append("<th scope='col'>" + alfabetoInicial[a] + "</th>");
	}
});

//Função que remove caracteres especiais
function verificaLetras(inserirPalavra) {
	var valor = inserirPalavra.replace(/[^A-z]+/g, '');
	$(".inserirPalavra").val(valor.toLowerCase());
}

//Função que zera as váriaveis do index.html quando clicar no botao Apagar Tabela
$(".limparTabela").click(function () {
	$(".palavrasInseridas").html("");
	$(".ajustaAlfabeto").html("");
	$(".inserirPalavra").val("");
	$(".encontrarPalavra").val("");
	linhasFinais = [];
	listaDePalavras = "";
});

//Função que tranforma letras maiúsculas em minúsculas
$(".inserePalavra").click(function () {
	var palavraDigitada = $(".inserirPalavra").val().toLowerCase();

//Confere o campo da palavra, se vazio mostra erro, senão, chama a função criaAutomato passando a palavra digitada no estado insert 
	if (palavraDigitada == "") {
		$(function () {
			alert(" ❌ Digite uma palavra");
		});

	} else {
		//Limpa o campo da palavra a ser inserida
		$(".inserirPalavra").val("");

		//Seta display bloqueado
		$('.table_automato thead, .table_automato tbody').css("display", "block");
		criaAutomato(palavraDigitada, 0);
	}
});

//Função que verifica os caracteres após digitados
$(".inserirPalavra").keyup(function () {
	var inserirPalavra = $(".inserirPalavra").val();
	verificaLetras(inserirPalavra);
});

//Remove a palavra ao clicar no (X) e calcula nova lista
function removePalavra(removePalavra) {
	$(".palavrasInseridas").html("");
	var arrayDePalavras = listaDePalavras.split(" ");
	listaDePalavras = "";

	//Reconstroi automato sem a palavra
	for (var i = 0; i < arrayDePalavras.length; i++) {
		var word = arrayDePalavras[i].trim();
		if (removePalavra != word) {
			criaAutomato(word, 1);
		}
		//Atualiza tamanho da matriz
		tamanhoMatriz += word.length; //Tamanho de cada palavra
	}
}

//Procura o caracter digitado ao clicar em buscar
$(".buscar").click(function () {
	var word = $(".encontrarPalavra").val();
	if (word != "") {
		buscar();
	} else {
		alert(" ❌ Digite uma palavra para buscar ");
	}
});

//O ScrollTop pega a medida da distância do topo de um elemento para o seu conteúdo superior
function habilitaScroll(x, y, z) {
	$(".table_automato tbody").scrollTop((x - y) * z);
}

//Remove a cor verde da tabela e faz backspace
function zeraCor() {
	$(".tr").css("background", "white");
}

function pintarLinha(element, color) {
	$(element).css("background", color);
}

function acharPalavra(word) {
	var estado = true;
	var posicaoLinha = 1, posicaoColuna = 0;

	// volta para o topo
	if (word == "" || word == null) {
		zeraCor();
		pintarLinha("#1", "#afdbb2");
		habilitaScroll(0, 2, 52);
	}

	for (var i = 0; i < word.length; i++) {
		
		// Pega a posição da letra no alfabeto
		posicaoColuna = alfabetoInicial.indexOf(word[i]) + 1;

		//Seta para branco a cor da tabela
		if (estado == true || word.length < 1) {
			zeraCor();
		}

		if (word[i] != " ") {
			//Verificar se a palavra está no alfabeto
			if (posicaoColuna != 0 && estado == true) {
				// Verifica a linha e a coluna que o token está
				if (matrizAutomato[parseInt(posicaoLinha)][parseInt(posicaoColuna)] != "Erro" && estado == true) {
					// Novo estado, pega a posição.
					posicaoLinha = matrizAutomato[parseInt(posicaoLinha)][parseInt(posicaoColuna)];
					pintarLinha("#" + (posicaoLinha), "#afdbb2");
					habilitaScroll(posicaoLinha, 2, 52);
				}
				else {
					estado = false;
					pintarLinha("#" + posicaoErro, "#ebbdb9");
					habilitaScroll(posicaoErro, 2, 52);
				}
			}
			else {
				estado = false;
				pintarLinha("#" + posicaoErro, "#ebbdb9");
				habilitaScroll(posicaoErro, 1, 52);
			}

		}
		else if (i != word.length - 1) {
			estado = false;
			pintarLinha("#" + posicaoErro, "#ebbdb9");
			habilitaScroll(posicaoErro, 1, 52);
		}
		else {
			var linhaFinal = false;
			// Verifica se o estado é final, se a linha estiver no array linhasFinais ela é final.
			for (var j = 0; j < linhasFinais.length; j++) {
				if (parseInt(linhasFinais[j]) == parseInt(posicaoLinha)) {
					linhaFinal = true;
				}
			}
			// Caso o estado for ok e o estado for final, esta é uma palavra que está na lista.
			if (estado && linhaFinal) {
				alert("A palavra: " + word.trim() + " pertence a senteça 😀");
			}
			else {
				alert("A palavra: " + word.trim() + " não pertence a sentença 😔");
			}
			$(".encontrarPalavra").val('');
			habilitaScroll(0, 1, 52);
			zeraCor();
			pintarLinha("#1", "#ffffff");

		}
	}
}

//Acionado após digitar a letra na busca
$(".encontrarPalavra").keyup(function () {
	var word = $(".encontrarPalavra").val();
	if (word[0] == " ") {
		$(".encontrarPalavra").val('');
	} else {
		acharPalavra(word)
	}
});

//Acionado ao clicar no botão buscar
function buscar() {
	var word = $(".encontrarPalavra").val() + " ";
	acharPalavra(word)
}

// Parte da construção do automato dinâmico.
function criaAutomato(NovaPalavra, acao) {

	//Define a matriz do automato
	matrizAutomato = [];
	
	//Pega o tamanho do alfabeto que foi utilizado
	var tamanhoAlfabeto = alfabetoInicial.length;

	//Limpa todos os espaços da palavra
	NovaPalavra = NovaPalavra.trim();

	//Adiciona a palavra na listaDePalavras
	listaDePalavras = listaDePalavras + " " + NovaPalavra;	

	//Zera as linhas finais
	linhasFinais = [];	

	//Limpa as palavras já inseridas 
	$(".palavrasInseridas").html("");

	// Separa a palavras por espaço
	var palavraComEspaco = listaDePalavras.split(" ");

	// Pega o tamanho da lista de palavras
	var tamanhoListaPalavras = palavraComEspaco.length

	//Define o tamanho da matriz a partir do novo automato.
	for (var i = 0; i < tamanhoListaPalavras; i++) {
		var palavraSozinha = palavraComEspaco[i].trim();
		tamanhoMatriz += palavraSozinha.length;
	}

	//Define o tamanho da matriz com a linha de erro e também define a posição do erro, que é sempre a última linha (-1).
	tamanhoMatriz = (tamanhoMatriz + 4); //sempre + que 2 espaços para garantir
	posicaoErro = posicaoErro + (- 1);

	//Inicia o automato com as letras do alfabeto, popula a matriz enquanto tem letra
	var novoTamanhoAlfabeto = tamanhoAlfabeto + 1;
	for (var i = 0; i < novoTamanhoAlfabeto + 1; i++) {
		matrizAutomato[i] = new Array(novoTamanhoAlfabeto + 1);
	};	
	matrizAutomato[0][0] = "—";
	for (var i = 0; i < tamanhoAlfabeto; i++) {
		var letra = String.fromCharCode(97 + i); //conversao tabela ASCII
		matrizAutomato[0][(i + 1)] = letra;
	};

	//Preenche o restante que não tem informações
	for (var linha = 1; linha < tamanhoMatriz; linha++) {
		for (coluna = 0; coluna <= tamanhoAlfabeto; coluna++) {
			if (!matrizAutomato[linha]) 
			{
				matrizAutomato[linha] = [];
			}
			matrizAutomato[linha][coluna] = "Erro";
		}
	}

	var contaLinhas = 0;
	var totalLinhas = 1;
	var ultimaLinha = 1;
	var proximaLinha = 1;

	for (var line = 1; line < tamanhoListaPalavras; line++) 
	{ 
		//Reseta a proxima linha
		proximaLinha = 1;

		//Pega a linha
		var NovaPalavra = palavraComEspaco[line].trim();
		var tamanhoDaPalavra = NovaPalavra.length;

		for (var coluna = 0; coluna < tamanhoDaPalavra; coluna++) 
		{
			// Pega a letra no alfabeto pra colocar na linha			
			var posicaoLetra = alfabetoInicial.indexOf(NovaPalavra[coluna]) + 1;			
			if (matrizAutomato[parseInt(proximaLinha)][parseInt(posicaoLetra)] == 'Erro') 
			{
				// Soma a ultima linha e o total que já foi
				ultimaLinha++;
				totalLinhas++;

				// Caso não achar, armazena a próxima linha a ser lida
				matrizAutomato[parseInt(proximaLinha)][parseInt(posicaoLetra)] = ultimaLinha;
			}

			// Letra que foi gravada
			proximaLinha = matrizAutomato[parseInt(proximaLinha)][parseInt(posicaoLetra)];

			var meutamanho = NovaPalavra.length - 1;
			if (coluna == meutamanho) 
			{
				//Marca como linha terminal, pois tem palavra finalizando aqui.
				linhasFinais[contaLinhas] = proximaLinha;

				//Soma a linha processada
				contaLinhas++;
			}
		}
	}

	// Constroi a tabela
	constroiTabela(totalLinhas, linhasFinais, matrizAutomato);

	// 0 = insert e 1 = delete
	//Insere um conjunto de Nodeobjetos ou objetos de string após o último Element
	if (acao == 0) { 
		acrescentaPalavra(NovaPalavra);
	}
}

function acrescentaPalavra(Palavra) {
	$(".ajustaAlfabeto").append("<div class='chip m2'>" + Palavra + "<i class='close material-icons' onclick=\"removePalavra('" + Palavra + "', this)\">close</i></div>");
}

function constroiTabela(totalLinha, linhasFinais, matrizAutomato) {

	var tamanhoTotal =  totalLinha + 2;
	tamanhoMatriz = tamanhoTotal;

	var novaposicaoErro = tamanhoMatriz - 1;
	posicaoErro = novaposicaoErro;

	for (var line = 1; line < tamanhoMatriz; line++) {

//Insere um conjunto de Nodeobjetos ou objetos de string após o último Element
		$(".palavrasInseridas").append("<tr class='tr' id=" + line + " ></tr>");
		if (line == 1) {
			
			$(".palavrasInseridas #" + line).append("<td class='my_td'>→q" + line + "</td>");
		} else {
			var linhaFinal = false;
			for (var fimLinha = 0; fimLinha < linhasFinais.length; fimLinha++) {
				
				if (parseInt(linhasFinais[fimLinha]) == parseInt(line)) {
					linhaFinal = true;
				}
			}
			if (linhaFinal) {
				$(".palavrasInseridas #" + line).append("<td>*q" + line + "</td>");
			} else {
				$(".palavrasInseridas #" + line).append("<td>q" + line + "</td>");
			}
		}
		
		for (var coluna = 1; coluna <= 26; coluna++) {
			if (matrizAutomato[line][coluna] == "Erro") {
				// se for linha sem nada, preenche com -
				if (line == posicaoErro) {
					$("#" + line).append("<td class='my_td'>-</td>");
				} else {
					$("#" + line).append("<td class='my_td'></td>");
				}
			} else {
				$("#" + line).append("<td class='my_td'>q" + matrizAutomato[line][coluna] + "</td>");
			}
		}
	}
	pintarLinha("#1", "#afdbb2");

//Ajusta a tabela para melhorar vizualização
	var $table_automato = $('table.table_automato');
	var $cellstbody = $table_automato.find('tbody tr:first').children();
	var width;
	$(window).resize(function () {
		width = $cellstbody.map(function () {
			return $(this).width();
		}).get();

		$table_automato.find('thead tr').children().each(function (x, y) {
			$(y).width(width[x]);
		});
	}).resize();
}
