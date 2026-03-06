const repo = "weslley343/weslley343.github.io";

const url = `https://api.github.com/repos/${repo}/issues?labels=post`;

async function carregarPosts() {

const response = await fetch(url);

const issues = await response.json();

const container = document.getElementById("posts");

issues.forEach(issue => {

const resumo = issue.body.substring(0, 200);

const tags = issue.labels
.filter(l => l.name !== "blog")
.map(l => `<span class="badge bg-secondary tag-badge">${l.name}</span>`)
.join("");

const html = `
<div class="col-md-6">

<div class="card h-100">

<div class="card-body">

<h5 class="card-title">${issue.title}</h5>

<p class="text-muted">
${new Date(issue.created_at).toLocaleDateString()}
</p>

<div class="mb-2">
${tags}
</div>

<p class="card-text">
${resumo}...
</p>

<a href="post.html?id=${issue.number}" class="btn btn-primary">
Ler post
</a>

</div>

</div>

</div>
`;

container.innerHTML += html;

});

}

carregarPosts();