$(document).ready(function() {
    var carrinho = [];
    var total = 0;
  
    function atualizarCarrinho() {
      var itensCarrinho = $("#itens-carrinho");
      itensCarrinho.empty();
      total = 0;
  
      var contadorItens = {};
  
      carrinho.forEach(function(item) {
        if (contadorItens[item.nome]) {
          contadorItens[item.nome]++;
        } else {
          contadorItens[item.nome] = 1;
        }
      });
  
      for (var nomeProduto in contadorItens) {
        var quantidade = contadorItens[nomeProduto];
        var itemCarrinho = carrinho.find(item => item.nome === nomeProduto);
        var precoTotalItem = itemCarrinho.preco * quantidade;
        total += precoTotalItem;
  
        var li = $("<li></li>").text(`${nomeProduto} Qtd: ${quantidade} - R$${precoTotalItem.toFixed(2)}`);
        var removerBotao = $("<button class='remover-item'>Remover</button>");
        li.append(removerBotao);
        itensCarrinho.append(li);
      }
  
      $("#total-carrinho").text("Total: R$ " + total.toFixed(2));
    }
  
    function transformarTextoMaiusculas() {
      var produtosOptions = $("#produtos option");
      produtosOptions.each(function () {
          var option = $(this);
          var price = option.data("price");
          var text = option.text();
  
          var uppercaseText = text.toUpperCase();
  
          option.text(uppercaseText);
      });
  
      var formaPagamentoOptions = $("#forma-pagamento option");
      formaPagamentoOptions.each(function () {
          var option = $(this);
          var text = option.text();
  
          var uppercaseText = text.toUpperCase();
  
          option.text(uppercaseText);
      });
  }
  
  // Chame a função para que o texto seja transformado em maiúsculas no carregamento da página:
  transformarTextoMaiusculas();
  
  
    $("#produtos").change(function() {
      var produtoSelecionado = $("#produtos option:selected");
      var nome = produtoSelecionado.val().toUpperCase(); 
      var preco = parseFloat(produtoSelecionado.data("price"));
  
      carrinho.push({ nome: nome, preco: preco });
      atualizarCarrinho();
      $("#produtos option:first").prop("selected", true);
    });
  
    $("#itens-carrinho").on("click", ".remover-item", function() {
      var li = $(this).closest("li");
      var nomeProduto = li.text().split(" Qtd: ")[0];
      var indice = carrinho.findIndex(item => item.nome === nomeProduto);
  
      if (indice !== -1) {
        carrinho.splice(indice, 1);
        li.remove();
        atualizarCarrinho();
      }
    });
  
    $("#encomendar").click(function() {
      var nome = $("#nome").val();
      var celular = $("#numero_de_celular").val().replace(/\D/g, "");
      var endereco = $("#endereco").val();
      var observacao = $("#observacao").val();
      var formaPagamento = $("#forma-pagamento").val();
      var dataHoraAtual = new Date().toLocaleString();
      var dataPedido = dataHoraAtual.split(", ")[0];
      var horaPedido = dataHoraAtual.split(", ")[1];
      var dataFormatada = dataPedido.split("/").reverse().join("-") + "T" + horaPedido;
  
      
      if (nome && celular && endereco && dataPedido && carrinho.length > 0) {
        var mensagem = "*ENCOMENDA RECEBIDA*%0A%0A";
        mensagem += "Nome: " + nome + "%0A";
        mensagem += "Número de Celular: " + celular + "%0A";
        mensagem += "Endereço da Entrega: " + endereco + "%0A";
        mensagem += "Observação: " + observacao + "%0A";
        mensagem += "Forma de pagamento: " + formaPagamento + "%0A";
        mensagem += "Data e Hora do Pedido: " + dataPedido + " " + horaPedido + "%0A";
        mensagem += "%0AProdutos:%0A";
  
        var produtosEnviados = [];
        carrinho.forEach(function(item) {
          if (!produtosEnviados.includes(item.nome)) {
            var quantidade = carrinho.filter(function(i) {
              return i.nome === item.nome;
            }).length;
            var precoTotalItem = item.preco * quantidade;
            mensagem += `- ${item.nome} Qtd: ${quantidade} (R$${precoTotalItem.toFixed(2)})%0A`;
            produtosEnviados.push(item.nome);
          }
        });
  
        mensagem += "%0A";
        mensagem += "*VALOR TOTAL DA COMPRA:* R$" + total.toFixed(2) + "%0A";
  
        var url = 'https://wa.me/5531998699047/?text=' + mensagem;
        window.open(url);
      } else {
        alert("Por favor, preencha todos os campos do formulário e adicione itens ao carrinho antes de fazer a encomenda.");
      }
    });
  
    transformarTextoMaiusculas();
  
    var uppercaseFields = $("input[type='text'], input[type='email']");
    uppercaseFields.on("input", function() {
      var input = $(this);
      var originalValue = input.val();
      var uppercaseValue = originalValue.toUpperCase();
      input.val(uppercaseValue);
    });
  
   
    var dataAtual = new Date().toISOString().split('T')[0];
  $("#data_pedido").attr("min", dataAtual);
  $("#data_pedido").attr("max", dataAtual);
});
  
// Atribui o evento de clique à imagem do PIX
$("#pix-link").click(function(event) {
  event.preventDefault();
  
  var chavePIX = "00020101021126550014br.gov.bcb.pix0114+55319984490470215Pagamentos Site5204000053039865802BR5925IELRIS OLIVEIRA DA SILVA 6009SAO PAULO622905251H57MPAQRAK3DSDJN11MD1V4Z63040D73";

  // Cria um elemento de input oculto
  var inputTemp = $("<input>");
  $("body").append(inputTemp);
  
  // Define o valor do input como a chave PIX
  inputTemp.val(chavePIX).select();
  
  // Copia o conteúdo do input para a área de transferência
  document.execCommand("copy");
  
  // Remove o elemento de input oculto
  inputTemp.remove();

  // Exibe uma mensagem de sucesso
  alert("Chave PIX copiada para a área de transferência!");
});

// Seleciona a galeria e os botões de navegação
const gallery = document.querySelector(".portfolio-gallery");
const scrollPrevBtn = document.querySelector(".scroll-button.prev");
const scrollNextBtn = document.querySelector(".scroll-button.next");
const scrollBar = document.querySelector(".scroll-bar");

// Define variáveis para controlar o deslocamento
let isMouseDown = false;
let startX;
let scrollLeft;

gallery.addEventListener("mousedown", (e) => {
  isMouseDown = true;
  startX = e.pageX - gallery.offsetLeft;
  scrollLeft = gallery.scrollLeft;
  gallery.classList.add("grabbing");
});

gallery.addEventListener("touchstart", (e) => {
  isMouseDown = true;
  startX = e.touches[0].pageX - gallery.offsetLeft;
  scrollLeft = gallery.scrollLeft;
  gallery.classList.add("grabbing");
});

gallery.addEventListener("mouseup", () => {
  isMouseDown = false;
  gallery.classList.remove("grabbing");
});

gallery.addEventListener("mouseleave", () => {
  isMouseDown = false;
  gallery.classList.remove("grabbing");
});

gallery.addEventListener("touchend", () => {
  isMouseDown = false;
  gallery.classList.remove("grabbing");
});

gallery.addEventListener("mousemove", (e) => {
  if (!isMouseDown) return;
  e.preventDefault();
  const x = e.pageX - gallery.offsetLeft;
  const walk = (x - startX) * 3; // Velocidade de rolagem
  gallery.scrollLeft = scrollLeft - walk;
  updateScrollBar();
});

gallery.addEventListener("touchmove", (e) => {
  if (!isMouseDown) return;
  e.preventDefault();
  const x = e.touches[0].pageX - gallery.offsetLeft;
  const walk = (x - startX) * 3; // Velocidade de rolagem
  gallery.scrollLeft = scrollLeft - walk;
  updateScrollBar();
});

function updateButtons() {
  // Habilita ou desabilita os botões com base na posição da galeria
  scrollPrevBtn.disabled = gallery.scrollLeft === 0;
  scrollNextBtn.disabled = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth;
}

function updateScrollBar() {
  const scrollPercentage = (gallery.scrollLeft / (gallery.scrollWidth - gallery.clientWidth)) * 100;
  scrollBar.style.width = `${scrollPercentage}%`;
}

// Atualiza os botões e barra de rolagem quando a galeria é redimensionada ou carregada
window.addEventListener("resize", () => {
  updateButtons();
  updateScrollBar();
});
window.addEventListener("load", () => {
  updateButtons();
  updateScrollBar();
});



