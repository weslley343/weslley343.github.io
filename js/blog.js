const ARTICLES_JSON_URL = 'js/articles.json';
const ARTICLES_DIR = 'content/content/articles/';

// Utility to create a card for an article
function createArticleCard(article) {
    const card = document.createElement('article');
    card.className = 'technical-card';
    
    // Create tags HTML
    const tagsHtml = article.tags.map(tag => `<span class="badge badge-info">#${tag}</span>`).join(' ');
    
    let displayTime = '';
    let displayDate = article.date;
    
    // Extract time from ISO string
    if (article.date && article.date.includes('T')) {
        const timePart = article.date.split('T')[1];
        displayTime = timePart.substring(0, 5); // get HH:MM
        displayDate = article.date.split('T')[0];
    }

    const readingTimeHtml = displayTime ? ` • ${displayTime}` : '';

    card.innerHTML = `
        <header class="card-header" style="margin-bottom: 0;">
            <h3 class="card-title">${article.title}</h3>
            <div class="card-meta" style="margin-bottom: 8px;">
                ${tagsHtml}
            </div>
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary);">
                ${displayDate}${readingTimeHtml}
            </div>
        </header>
        <footer class="card-footer" style="border-top: none; padding-top: var(--spacing-sm);">
            <a href="article.html?id=${encodeURIComponent(article.id)}" class="tech-link">LER_ARTIGO -&gt;</a>
        </footer>
    `;
    return card;
}

// Render list of articles (for blog.html or index.html)
async function renderArticleList() {
    const postsContainer = document.getElementById('posts');
    const recentProjectsContainer = document.getElementById('recent-articles-grid'); // for index.html
    
    if (!postsContainer && !recentProjectsContainer) return;
    
    try {
        // Cache buster for local development
        const response = await fetch(`${ARTICLES_JSON_URL}?t=${new Date().getTime()}`);
        if (!response.ok) throw new Error('Failed to load articles.json');
        
        const articles = await response.json();
        
        if (postsContainer) {
            postsContainer.innerHTML = '';
            // Apply list layout instead of grid for full articles page
            postsContainer.className = 'card-list';
            articles.forEach(article => {
                postsContainer.appendChild(createArticleCard(article));
            });
        }
        
        if (recentProjectsContainer) {
            recentProjectsContainer.innerHTML = '';
            // Show only the 2 most recent for index
            articles.slice(0, 2).forEach(article => {
                recentProjectsContainer.appendChild(createArticleCard(article));
            });
        }
        
    } catch (error) {
        console.error('Error loading articles:', error);
        if (postsContainer) postsContainer.innerHTML = '<p>Erro ao carregar artigos. Certifique-se de ter rodado python3 build_index.py</p>';
    }
}

// Render a single article (for article.html)
async function renderSingleArticle() {
    const articleContainer = document.getElementById('article-content');
    if (!articleContainer) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    if (!articleId) {
        articleContainer.innerHTML = '<p>Artigo não especificado.</p>';
        return;
    }
    
    try {
        // Fetch article metadata
        const responseList = await fetch(`${ARTICLES_JSON_URL}?t=${new Date().getTime()}`);
        const articles = await responseList.json();
        const articleMeta = articles.find(a => a.id === parseInt(articleId));
        
        if (articleMeta) {
            document.title = `${articleMeta.title} // weslley343`;
            const titleEl = document.getElementById('article-title');
            if (titleEl) titleEl.textContent = articleMeta.title;
            
            const metaEl = document.getElementById('article-meta');
            if (metaEl) {
                let displayDate = articleMeta.date;
                let displayTime = '';
                if (articleMeta.date && articleMeta.date.includes('T')) {
                    displayDate = articleMeta.date.split('T')[0];
                    displayTime = articleMeta.date.split('T')[1].substring(0, 5);
                }
                const timeHtml = displayTime ? ` &nbsp;|&nbsp; <span class="mono-label">HORA:</span> ${displayTime}` : '';
                
                metaEl.innerHTML = `
                    <span class="mono-label">DATA:</span> ${displayDate} ${timeHtml}
                `;
            }
        }

        // Fetch markdown content
        const markdownUrl = `${ARTICLES_DIR}${encodeURIComponent(articleMeta.filename)}`;
        const response = await fetch(`${markdownUrl}?t=${new Date().getTime()}`);
        if (!response.ok) throw new Error('Failed to load markdown file');
        
        const markdownContent = await response.text();
        
        // Strip out top frontmatter blocks to not render them as text
        let cleanMarkdown = markdownContent;
        // Remove Obsidian id/data/tags properties at top
        cleanMarkdown = cleanMarkdown.replace(/^id:.*?\n/g, '');
        cleanMarkdown = cleanMarkdown.replace(/^data:.*?\n/g, '');
        cleanMarkdown = cleanMarkdown.replace(/^tags:.*?\n/g, '');
        // Remove standard yaml frontmatter
        cleanMarkdown = cleanMarkdown.replace(/^---\s*\n.*?\n---\s*\n/ms, '');
        // Remove yaml frontmatter wrapped in codeblock
        cleanMarkdown = cleanMarkdown.replace(/^```[a-z]*\n---\s*\n.*?\n---\s*\n```\s*\n/ms, '');
        
        // Fix relative image paths from Obsidian
        // Since article.html is in the root directory, a path like ../media/img.jpg 
        // needs to point to content/content/media/img.jpg
        cleanMarkdown = cleanMarkdown.replace(/!\[(.*?)\]\(\.\.\/(.*?)\)/g, '![$1](content/content/$2)');
        
        // Render markdown
        // Requires marked.js loaded
        if (typeof marked !== 'undefined') {
            articleContainer.innerHTML = marked.parse(cleanMarkdown);
        } else {
            articleContainer.innerHTML = '<p>Erro: biblioteca marked.js não carregada.</p>';
        }
        
    } catch (error) {
        console.error('Error rendering article:', error);
        articleContainer.innerHTML = '<p>Erro ao carregar o conteúdo do artigo.</p>';
    }
}

// Render microposts (for logs.html)
async function renderLogsList() {
    const logFeedContainer = document.getElementById('log-feed');
    if (!logFeedContainer) return;
    
    try {
        const logsUrl = 'content/content/logs/logs.md';
        const response = await fetch(`${logsUrl}?t=${new Date().getTime()}`);
        if (!response.ok) throw new Error('Failed to load logs.md');
        
        const rawText = await response.text();
        
        // Split by 3 or more underscores
        const posts = rawText.split(/_{3,}/)
            .map(p => p.trim())
            .filter(p => p.length > 0)
            .reverse(); // Newest first
            
        logFeedContainer.innerHTML = '';
        
        posts.forEach((postContent, index) => {
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            
            // Extract metadata
            let displayDate = '';
            let displayTime = '';
            let tagsHtml = '';
            
            const dataMatch = postContent.match(/^(?:data|date):\s*(.+)$/m);
            if (dataMatch) {
                const fullDate = dataMatch[1].trim();
                if (fullDate.includes('T')) {
                    displayDate = fullDate.split('T')[0];
                    displayTime = fullDate.split('T')[1].substring(0, 5);
                } else {
                    displayDate = fullDate;
                }
            }
            
            const tagsMatch = postContent.match(/^tags:\s*(.+)$/m);
            if (tagsMatch) {
                const tagsRaw = tagsMatch[1];
                const tagsList = tagsRaw.split(/\s+/).filter(t => t.startsWith('#')).map(t => t.replace('#', ''));
                tagsHtml = tagsList.map(tag => `<span class="badge badge-info" style="margin-right: 4px;">#${tag}</span>`).join('');
            }
            
            // Clean markdown
            let cleanContent = postContent.replace(/^(?:data|date):\s*.*?\n/gm, '');
            cleanContent = cleanContent.replace(/^tags:\s*.*?\n/gm, '');
            
            // Render markdown using marked.js
            let htmlContent = '';
            if (typeof marked !== 'undefined') {
                htmlContent = marked.parse(cleanContent);
            } else {
                htmlContent = `<p>${cleanContent}</p>`;
            }
            
            const timeHtml = displayTime ? ` &nbsp;|&nbsp; <span class="mono-label">HORA:</span> ${displayTime}` : '';
            const dateHtml = displayDate ? `<span class="mono-label">DATA:</span> ${displayDate}${timeHtml}` : `<span>ENTRADA_LOG_${posts.length - index}</span>`;
            
            entry.innerHTML = `
                <div style="display: flex; gap: 16px;">
                    <div style="flex-shrink: 0;">
                        <img src="content/content/media/img/avatar/avatar.jpg" alt="Avatar" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-color);">
                    </div>
                    <div style="flex-grow: 1; min-width: 0;">
                        <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--info-blue); margin-bottom: 8px;">
                            <strong>weslley343</strong> <span style="color: var(--text-secondary);">[AUTOR]</span>
                        </div>
                        <div class="log-content">
                            ${htmlContent}
                        </div>
                        <div class="log-meta" style="align-items: center;">
                            <div>${dateHtml}</div>
                            <div>${tagsHtml}</div>
                        </div>
                    </div>
                </div>
            `;
            
            logFeedContainer.appendChild(entry);
        });
        
    } catch (error) {
        console.error('Error rendering logs:', error);
        logFeedContainer.innerHTML = '<p>Erro ao carregar os logs do sistema.</p>';
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    renderArticleList();
    renderSingleArticle();
    renderLogsList();
});
