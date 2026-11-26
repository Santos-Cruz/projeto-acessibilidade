# Relatório de Auditoria de Acessibilidade Digital

## 1. Informações do Projeto

**Projeto:** Testes de Acessibilidade Digital  
**Site analisado:** [Demoblaze](https://www.demoblaze.com/)  
**Padrão de referência:** WCAG 2.2  
**Ferramentas:** Playwright e Axe-core  
**Data da execução:** 25/11/2026

## 2. Objetivo

O objetivo deste projeto é realizar testes automatizados de acessibilidade digital no site Demoblaze, identificando possíveis barreiras que dificultem a utilização por pessoas com deficiência.

A auditoria utiliza o Playwright para automatizar a navegação e o Axe-core para verificar critérios de acessibilidade relacionados às diretrizes WCAG.

## 3. Escopo dos Testes

Na primeira etapa foi feita só a auditoria da página inicial. Depois ampliamos os testes para as outras partes do site:

- Página inicial;
- Barra de navegação e carrossel de imagens;
- Filtro de categorias (Laptops);
- Página de detalhes do produto;
- Adição de produto ao carrinho e tela do carrinho;
- Formulário de finalizar pedido (Place Order);
- Navegação pela barra de navegação usando a tecla Tab;
- Verificação do foco visível;
- Abertura do modal de Login pelo teclado e fechamento com Escape.

O Axe-core verificou as regras dos seguintes grupos:

- WCAG 2.0 nível A e AA;
- WCAG 2.1 nível A e AA;
- WCAG 2.2 nível AA.

Os testes de teclado e de foco visível não usam o Axe. Neles o Playwright aperta as teclas e confere qual elemento está focado e se ele tem contorno (`outline`) ou sombra.

### Arquivos de teste

| Arquivo | O que testa |
|---|---|
| `tests/home.a11y.spec.js` | Página inicial |
| `tests/navegacao.a11y.spec.js` | Barra de navegação, carrossel e categorias |
| `tests/produtos.a11y.spec.js` | Detalhes do produto, carrinho e finalizar pedido |
| `tests/teclado.a11y.spec.js` | Tecla Tab, foco visível e modal de Login |

## 4. Resultado da Auditoria

**Resultado da execução:**
- Comando: `npm run test:a11y`
- Testes executados: 8
- Testes aprovados pelo Playwright: 8
- Testes com falha: 0
- Regras do Axe violadas: 4 (`image-alt`, `color-contrast`, `link-name` e `label`)
- Problema encontrado no teste de teclado: 1 (foco visível no carrossel)

Os testes do Axe não falham quando encontram violações. Eles servem para gerar as evidências em JSON. Os testes falham só se alguma ação não funcionar, por exemplo o produto não entrar no carrinho ou o modal não fechar.

### 4.1 Resumo por página

| Página / tela | Arquivo JSON | Regras violadas | Elementos afetados |
|---|---|---:|---:|
| Página inicial | `wcag-summary.json` | 3 | 29 |
| Navegação e carrossel | `navegacao-carrossel.json` | 3 | 29 |
| Categoria Laptops | `categorias.json` | 3 | 20 |
| Detalhes do produto | `detalhes-produto.json` | 3 | 5 |
| Carrinho | `carrinho.json` | 2 | 11 |
| Finalizar pedido | `finalizar-pedido.json` | 2 | 35 |
| Modal de Login aberto | `modal-login.json` | 4 | 34 |

Os números do carrinho e do finalizar pedido mudam a cada execução. Isso acontece porque o carrinho do Demoblaze já mostra outros produtos além do que o teste adiciona, e cada produto a mais é mais uma imagem e um link "Delete" com problema.

### 4.2 Violações identificadas

| Regra | Critério WCAG | Impacto | Onde aparece |
|---|---|---|---|
| image-alt | 1.1.1 Conteúdo Não Textual | Crítico | Logo da barra de navegação, logo do rodapé e imagens do carrinho |
| label | 1.3.1 e 4.1.2 | Crítico | Campos do modal de Login |
| color-contrast | 1.4.3 Contraste (Mínimo) | Sério | Preços, descrições, botões verdes e links "Delete" |
| link-name | 2.4.4 e 4.1.2 | Sério | Imagens dos produtos e setas do carrossel do produto |
| Foco não visível | 2.4.7 Foco Visível | Sério | Botões Previous e Next do carrossel |

**1. image-alt: imagens sem texto alternativo**

O logo `blazemeter-favicon-512x512.png` aparece duas vezes sem o atributo `alt`: ao lado de "PRODUCT STORE" na barra de navegação (`#nava > img`) e no título do rodapé (`h4 > img`). Na tela do carrinho todas as fotos dos produtos também estão sem `alt` (ex.: `<img width="100" height="100" src="imgs/galaxy_s6.jpg">`).

Sem o `alt` o leitor de tela não tem o que falar sobre a imagem, e em alguns casos lê o nome do arquivo.

**2. label: campos do Login sem rótulo**

Os campos de usuário e senha do modal de Login (`#loginusername` e `#loginpassword`) têm um `<label>`, mas o `for` do label aponta para `log-name` e `log-pass`, que não são os ids dos campos. Por isso o label não fica ligado ao campo e o leitor de tela anuncia só "caixa de texto", sem dizer se é usuário ou senha.

**3. color-contrast: contraste baixo**

- Preços e descrições dos produtos e os textos do modal de Login usam cinza `#868688` sobre branco. O contraste é 3,63:1 e o mínimo para texto normal é 4,5:1.
- Botões "Add to cart" e "Place Order": texto branco sobre verde `#34a853`, contraste 3,05:1.
- Links "Delete" do carrinho: azul `#0275d8` sobre `#f2f2f2`, contraste 4,13:1.

Pessoas com baixa visão ou usando o celular no sol podem ter dificuldade para ler esses textos.

**4. link-name: links sem nome**

Na lista de produtos, a foto de cada produto é um link para a página do produto, mas a imagem tem `alt=""`. Como o link só tem a imagem dentro, ele fica sem nome e o leitor de tela fala apenas "link".

Na página de detalhes do produto as setas do carrossel (`<a class="left carousel-control">` e `<a class="right carousel-control">`) estão vazias, sem texto nenhum.

**5. Foco visível no carrossel (teste de teclado)**

Navegando com Tab, os links da barra de navegação e das categorias mostram um contorno quando estão focados. Já os botões Previous e Next do carrossel da página inicial ficam com `outline: none` e sem sombra, então a pessoa que usa só o teclado não consegue ver onde está o foco. O resultado ficou salvo em `reports/foco-visivel.json`.

### 4.3 O que funcionou bem

- A ordem do Tab na barra de navegação segue a ordem visual: PRODUCT STORE, Home, Contact, About us, Cart, Log in e Sign up.
- O modal de Login abre com Enter e fecha com a tecla Escape.
- Os botões Previous e Next do carrossel da página inicial têm texto escondido (`sr-only`) para o leitor de tela. O problema deles é só o foco.

## 5. Sugestões de Correção

| Problema | Como corrigir |
|---|---|
| image-alt | Colocar `alt` com o nome do produto nas fotos do carrinho e `alt="Logo da loja"` nos dois logos (ou `alt=""` se for só decorativo). |
| label | Trocar `for="log-name"` por `for="loginusername"` e `for="log-pass"` por `for="loginpassword"`. |
| color-contrast | Escurecer o cinza do texto (por exemplo `#595959`) e usar um verde mais escuro nos botões. |
| link-name | Colocar o nome do produto no `alt` da foto e um texto escondido (`sr-only`) nas setas do carrossel do produto. |
| Foco visível | Remover o `outline: none` dos botões do carrossel ou criar um estilo de `:focus` para eles. |

## 6. Evidências

Os relatórios em JSON ficam na pasta `reports/`:

- `wcag-summary.json`: página inicial;
- `navegacao-carrossel.json`: barra de navegação e carrossel;
- `categorias.json`: filtro de categorias;
- `detalhes-produto.json`: página do produto;
- `carrinho.json`: tela do carrinho;
- `finalizar-pedido.json`: formulário de pedido;
- `modal-login.json`: página com o modal de Login aberto;
- `foco-visivel.json`: elementos sem foco visível.

Cada arquivo tem a data de geração, as regras violadas, os elementos afetados, os seletores e a descrição do problema. O relatório HTML do Playwright pode ser aberto com `npm run test:report`.

## 7. Conclusão

A auditoria encontrou problemas em todas as páginas testadas. Os mais graves são as imagens sem texto alternativo e os campos de Login sem rótulo, porque atrapalham diretamente quem usa leitor de tela. O contraste baixo aparece em quase todo o site, já que vem da cor padrão dos textos.

Também aprendemos que o momento em que o Axe roda faz diferença. No começo o teste da página inicial rodava logo depois do `domcontentloaded`, antes de os produtos aparecerem, e só encontrava 1 regra. Quando o teste passou a esperar os produtos carregarem, apareceram também os problemas de contraste e de links sem nome.

As ferramentas automáticas não pegam tudo, então o ideal é completar a avaliação com um leitor de tela (NVDA, por exemplo) e com testes manuais.
