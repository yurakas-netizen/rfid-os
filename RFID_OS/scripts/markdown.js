// Markdown preview functionality

// Initialize marked.js
marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: true,
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(code, { language: lang }).value;
            } catch (err) {
                console.error('Error highlighting code:', err);
            }
        }
        return code;
    }
});

// Update markdown preview
function updateMarkdownPreview() {
    const content = document.getElementById('content');
    const preview = document.getElementById('markdownPreview');
    
    if (!content || !preview) return;
    
    if (content.value.trim()) {
        preview.innerHTML = marked.parse(content.value);
    } else {
        preview.innerHTML = '<p class="text-muted">Попередній перегляд з\'явиться тут...</p>';
    }
}

// View module with markdown rendering
function viewModule(id) {
    const module = modules.find(m => m.id == id);
    if (!module) return;
    
    currentViewModuleId = id;
    
    const html = marked.parse(module.content);
    
    document.getElementById('viewTitle').textContent = module.name;
    document.getElementById('viewContent').innerHTML = `
        <div class="view-header">
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
                <span style="font-size: 2em;">${escapeHTML(module.icon)}</span>
                <div>
                    <div class="card-meta">
                        <span class="badge badge-category">${escapeHTML(module.category)}</span>
                        <span class="badge badge-${module.status}">
                            ${module.status === 'active' ? 'Активний' : 
                              module.status === 'draft' ? 'Чернетка' : 'Архівний'}
                        </span>
                        <span class="version-tag">v${escapeHTML(module.version)}</span>
                    </div>
                    <p class="text-muted">${escapeHTML(module.description || 'Без опису')}</p>
                </div>
            </div>
            
            ${module.tags && module.tags.length > 0 ? `
                <div class="tags" style="margin-bottom: 20px;">
                    ${module.tags.map(tag => `
                        <span class="tag">${escapeHTML(tag)}</span>
                    `).join('')}
                </div>
            ` : ''}
            
            <div class="file-info" style="background: rgba(56, 189, 248, 0.1); padding: 10px; border-radius: 8px; margin-bottom: 20px;">
                <strong>📄 Файл:</strong> ${escapeHTML(module.filePath || 'Немає файлу')}
            </div>
        </div>
        
        <div class="markdown-content">
            ${html}
        </div>
        
        ${module.history && module.history.length > 0 ? `
            <div class="history-section">
                <h3 class="history-title">Історія версій</h3>
                <div class="history-list">
                    ${module.history.map(entry => `
                        <div class="history-item">
                            <div class="history-version">v${escapeHTML(entry.version)}</div>
                            <div class="history-date">${new Date(entry.updatedAt).toLocaleString('uk-UA')}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}
    `;
    
    document.getElementById('viewModal').classList.add('active');
}

// Copy module content
function copyModuleContent() {
    const module = modules.find(m => m.id == currentViewModuleId);
    if (module) {
        navigator.clipboard.writeText(module.content)
            .then(() => showToast('Контент скопійовано в буфер обміну!'))
            .catch(err => showToast('Помилка копіювання: ' + err, 'error'));
    }
}

// Copy text from card
function copyText(id) {
    const module = modules.find(m => m.id == id);
    if (module) {
        navigator.clipboard.writeText(module.content)
            .then(() => showToast('Контент скопійовано в буфер обміну!'))
            .catch(err => showToast('Помилка копіювання: ' + err, 'error'));
    }
}

// Copy markdown as HTML
function copyAsHTML(moduleId) {
    const module = modules.find(m => m.id == moduleId);
    if (!module) return;
    
    const html = marked.parse(module.content);
    navigator.clipboard.writeText(html)
        .then(() => showToast('HTML скопійовано успішно', 'success'))
        .catch(err => showToast('Помилка копіювання: ' + err, 'error'));
}

// Copy markdown as plain text
function copyAsText(moduleId) {
    const module = modules.find(m => m.id == moduleId);
    if (!module) return;
    
    navigator.clipboard.writeText(module.content)
        .then(() => showToast('Текст скопійовано успішно', 'success'))
        .catch(err => showToast('Помилка копіювання: ' + err, 'error'));
}