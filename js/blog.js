const repo = "weslley343/weslley343.github.io";

const url = `https://api.github.com/repos/${repo}/issues?labels=post`;

async function carregarPosts() {

const response = await fetch(url);

const issues = await response.json();

const container = document.getElementById("posts");

issues.forEach(issue => {

const resumo = issue.body.substring(0, 200);

const dataCriacao = new Date(issue.created_at);

    const tags = issue.labels
    //   .filter(label => label.name !== 'post') // Não exibir a tag 'post'
      .map(label => `<span>${label.name}</span>`)
      .join('');

    const html = `
      <a href="post.html?id=${issue.number}" class="blog-card">
        <div class="blog-card-content">
            <h3>${issue.title}</h3>
            <p>${dataCriacao.toLocaleDateString()}</p>
            <div class="project-tags">
                ${tags}
            </div>
        </div>
      </a>
    `;

container.innerHTML += html;

});

}

carregarPosts();