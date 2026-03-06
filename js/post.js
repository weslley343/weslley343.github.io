const params = new URLSearchParams(window.location.search);

const id = params.get("id");

const repo = "weslley343/weslley343.github.io";

const url = `https://api.github.com/repos/${repo}/issues/${id}`;

async function carregarPost() {

const response = await fetch(url);

const issue = await response.json();

document.getElementById("title").innerText = issue.title;

document.getElementById("date").innerText =
new Date(issue.created_at).toLocaleDateString();

const tags = issue.labels
.filter(l => l.name !== "blog")
.map(l => `<span class="badge bg-secondary">${l.name}</span>`)
.join(" ");

document.getElementById("tags").innerHTML = tags;

const html = marked.parse(issue.body);

document.getElementById("content").innerHTML = html;

}

carregarPost();