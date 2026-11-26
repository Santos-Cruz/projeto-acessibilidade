# Relatório Técnico — Testes de Acessibilidade Digital (WCAG 2.2)

## 1. Identificação da Equipe e Trilha

- **Site avaliado:** https://www.demoblaze.com/
- **Ferramentas:** Playwright e @axe-core/playwright.
- **Repositório GitHub:** [Adicionar link do repositório]

### Integrantes

1. [AnaK Sikva] — Configuração do projeto e testes da página inicial.
2. [Alan Victor] — Helper de acessibilidade e testes de produtos, carrinho e teclado.
3. [ Gabriel Santos] — Formatador de evidências e documentação técnica.

---

## 2. Escopo dos Testes

### Como rodar

```bash
npm install
npx playwright install chromium
npm run test:a11y
```

Para ver o relatório HTML do Playwright: `npm run test:report`.

### Testes executados

| Arquivo | Testes |
|---|---|
| `tests/home.a11y.spec.js` | Auditoria da página inicial |
| `tests/navegacao.a11y.spec.js` | Barra de navegação e carrossel; filtro de categorias |
| `tests/produtos.a11y.spec.js` | Detalhes do produto; carrinho e formulário de finalizar pedido |
| `tests/teclado.a11y.spec.js` | Ordem do Tab; foco visível; modal de Login aberto com Enter e fechado com Escape |

Nos testes de auditoria o Axe-core verifica as regras das WCAG 2.0, 2.1 e 2.2 (níveis A e AA). Nos testes de teclado o Playwright aperta as teclas e confere qual elemento ficou focado.

### Limitações da automação

As ferramentas automatizadas não substituem uma avaliação humana completa. É necessário complementar os testes com leitores de tela e verificações manuais.

O carrinho do Demoblaze já aparece com outros produtos além do que o teste adiciona, então a quantidade de elementos afetados no carrinho muda a cada execução.

---

## 3. Principais Violações WCAG Encontradas

| Regra | Critério WCAG | Impacto | Onde aparece |
|---|---|---|---|
| image-alt | 1.1.1 — Conteúdo Não Textual | Crítico | Logo da barra de navegação, logo do rodapé e fotos do carrinho |
| label | 1.3.1 / 4.1.2 | Crítico | Campos de usuário e senha do modal de Login |
| color-contrast | 1.4.3 — Contraste (Mínimo) | Sério | Preços, descrições, botões verdes e links "Delete" |
| link-name | 2.4.4 / 4.1.2 | Sério | Fotos dos produtos e setas do carrossel do produto |
| Foco não visível | 2.4.7 — Foco Visível | Sério | Botões Previous e Next do carrossel |

### Elementos identificados

**image-alt**
- `#nava > img`: logo da barra de navegação (`blazemeter-favicon-512x512.png`), sem `alt`.
- `h4 > img`: mesmo logo no rodapé, sem `alt`.
- Fotos dos produtos na tela do carrinho, sem `alt`.

**label**
- `#loginusername` e `#loginpassword`: os labels usam `for="log-name"` e `for="log-pass"`, que não são os ids dos campos.

**color-contrast**
- Texto cinza `#868688` sobre branco: contraste 3,63:1 (mínimo 4,5:1).
- Botões "Add to cart" e "Place Order": branco sobre `#34a853`, contraste 3,05:1.
- Links "Delete": `#0275d8` sobre `#f2f2f2`, contraste 4,13:1.

**link-name**
- Links das fotos dos produtos (`.card > a`): a imagem tem `alt=""`, então o link fica sem nome.
- Setas do carrossel na página do produto (`.left` e `.right`): links vazios.

**Foco visível**
- Botões Previous e Next do carrossel ficam com `outline: none` quando recebem foco pelo Tab.

### Sugestão de correção

- Adicionar textos alternativos descritivos às imagens informativas. Para imagens puramente decorativas, utilizar `alt=""`.
- Corrigir o `for` dos labels do Login para `loginusername` e `loginpassword`.
- Escurecer o cinza dos textos e o verde dos botões.
- Colocar o nome do produto no `alt` das fotos que são links e texto `sr-only` nas setas do carrossel do produto.
- Criar um estilo de `:focus` para os botões do carrossel.

---

## 4. Resultados da Execução

- **Data da execução:** 25/11/2026.
- **Comando:** `npm run test:a11y`.
- **Specs executadas:** 4.
- **Testes executados:** 8.
- **Testes aprovados:** 8.
- **Testes com falha:** 0.
- **Regras violadas (Axe):** 4 (`image-alt`, `label`, `color-contrast`, `link-name`).
- **Problemas de teclado:** 1 (foco visível no carrossel).
- **Relatórios JSON:** gerados com sucesso.

Os testes de auditoria não falham quando o Axe encontra violações; eles salvam as evidências em JSON. Eles falham se alguma ação não funcionar (por exemplo, o produto não entrar no carrinho ou o modal não fechar com Escape).

### Arquivos de evidências

Pasta `reports/`:

- `wcag-summary.json` — página inicial;
- `navegacao-carrossel.json` — barra de navegação e carrossel;
- `categorias.json` — filtro de categorias;
- `detalhes-produto.json` — página do produto;
- `carrinho.json` — tela do carrinho;
- `finalizar-pedido.json` — formulário de pedido;
- `modal-login.json` — modal de Login aberto;
- `foco-visivel.json` — elementos sem foco visível.

Os arquivos contêm a data de geração, as violações, os elementos afetados, os seletores e as descrições dos problemas. O detalhamento completo está no `REPORT.md`.

---

## 5. Divisão de Trabalho

- **Integrante 1:** Configuração do repositório, Playwright e testes da página inicial.
- **Integrante 2:** Helper de acessibilidade e testes de produtos, carrinho e teclado.
- **Integrante 3:** Formatador de evidências e documentação técnica.

Os commits e as contribuições individuais deverão ser registrados conforme o histórico real do GitHub.

---

## 6. Lições Aprendidas e Melhorias Futuras

A utilização do Playwright em conjunto com Axe-core permite automatizar verificações importantes de acessibilidade.

A auditoria demonstrou a importância de fornecer alternativas textuais adequadas para imagens e de ligar corretamente os labels aos campos dos formulários.

Também percebemos que é preciso esperar a página carregar de verdade antes de rodar o Axe. No começo o teste da página inicial rodava antes de os produtos aparecerem e só encontrava 1 regra; depois de esperar os produtos, encontrou 3.

Como melhorias futuras, recomenda-se:

- Implementar execução automatizada utilizando CI/CD.
- Realizar testes em diferentes navegadores.
- Avaliar diferentes tamanhos de tela.
- Ampliar os testes com leitores de tela.
- Testar os modais de Sign up, Contact e About us.
- Corrigir as violações identificadas e executar novamente a auditoria.

---

**Responsável pela documentação:** Integrante 3.

**Projeto acadêmico — Auditoria de Acessibilidade Digital.**
