const LOGS_JSON_URL = 'content/content/logs/logs.json';

async function renderLogsList() {
    const logFeedContainer = document.getElementById('log-feed');
    if (!logFeedContainer) return;

    try {
        const response = await fetch(`${LOGS_JSON_URL}?t=${new Date().getTime()}`);
        if (!response.ok) throw new Error('Failed to load logs.json');

        const logs = await response.json();
        logFeedContainer.innerHTML = '';

        if (logs.length === 0) {
            logFeedContainer.innerHTML = '<div style="text-align: center; padding: 3rem 1rem; color: var(--text-secondary);"><p>Nenhum log registrado ainda.</p></div>';
            return;
        }

        const totalLogs = logs.length;

        logs.forEach((log, index) => {
            const entry = document.createElement('div');
            entry.className = 'log-entry';

            // Setup display date/time
            let displayDate = '';
            let displayTime = '';
            
            if (log.date) {
                if (log.date.includes('T')) {
                    displayDate = log.date.split('T')[0];
                    displayTime = log.date.split('T')[1].substring(0, 5);
                } else {
                    displayDate = log.date;
                }
            }

            // Render markdown using marked.js
            let htmlContent = '';
            if (typeof marked !== 'undefined') {
                htmlContent = marked.parse(log.content);
            } else {
                htmlContent = `<p>${log.content}</p>`;
            }

            const timeHtml = displayTime ? ` &nbsp;|&nbsp; ${displayTime}` : '';
            const dateHtml = displayDate ? `${displayDate}${timeHtml}` : `<span>ENTRADA_LOG_${totalLogs - index}</span>`;

            entry.innerHTML = `
                <div style="display: flex; gap: 16px;">
                    <div style="flex-shrink: 0;">
                        <img src="content/content/media/img/avatar/avatar.jpg" alt="Avatar" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-color);">
                    </div>
                    <div style="flex-grow: 1; min-width: 0;">
                        <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--info-blue); margin-bottom: 8px;">
                            <strong>weslley343</strong>
                        </div>
                        <div class="log-content">
                            ${htmlContent}
                        </div>
                        <div class="log-meta" style="align-items: center;">
                            <div>${dateHtml}</div>
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
    renderLogsList();
});
