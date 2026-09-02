# Convenções do Repositório (Project Conventions)

Este repositório segue um conjunto rígido de convenções para manter o código limpo, padronizado e acessível.

---

## 1. Idiomas (Language Rules)

### Código, Sintaxe e Estruturas -> **Inglês**
- **HTML:**
  - Nomes de tags, atributos (`id`, `class`, `data-*`, `rel`, etc.) devem ser sempre em inglês.
  - IDs e classes devem usar formato `kebab-case` em inglês (ex.: `id="article-content"`, `class="profile-badge"`).
- **CSS:**
  - Nomes de seletores, classes e variáveis CSS em inglês (ex.: `--info-blue`, `--bg-color`, `.technical-card`).
- **JavaScript & Backend/Scripts:**
  - Nomes de variáveis, funções, classes, objetos, propriedades e comentários de código em inglês (ex.: `createArticleCard()`, `renderArticleList()`, `ARTICLES_JSON_URL`).
- **Arquivos:**
  - Nomes de arquivos de código (HTML, CSS, JS, Python) em inglês (ex.: `index.html`, `blog.html`, `global.css`, `blog.js`, `build_index.py`).

---

### Conteúdo Exibido na Tela -> **Português (PT-BR)**
- Todo texto renderizado visivelmente para o usuário final deve estar em **Português**:
  - `<html lang="pt-BR">` deve ser configurado em todas as páginas HTML.
  - Títulos da aba (`<title>`), cabeçalhos (`<h1>`-`<h6>`), parágrafos, botões e links visíveis.
  - Menu de Navegação: `/INÍCIO`, `/BLOG`, `/LOGS`, `/SOBRE`.
  - Metadados estilizados e rótulos visíveis no terminal/interface (ex.: `STATUS: ATIVO`, `ÚLTIMA_ATUALIZAÇÃO: 2026-07-11`, `MÓDULO: BLOG`, `FONTE: COFRE_OBSIDIAN`).
  - Textos de estado/carregamento no JavaScript (`Carregando conteúdo...`, `Erro ao carregar os artigos`).

---

## 2. Estrutura de Navegação

Todas as páginas devem manter a mesma estrutura de cabeçalho (navbar):

```html
<header class="navbar">
    <div class="navbar-container">
        <div class="navbar-brand">
            <a href="index.html" style="text-decoration: none; color: inherit;">WD343</a>
        </div>
        <nav class="navbar-links">
            <a href="index.html">/INÍCIO</a>
            <a href="blog.html">/BLOG</a>
            <a href="logs.html">/LOGS</a>
            <a href="me.html">/SOBRE</a>
        </nav>
    </div>
</header>
```
