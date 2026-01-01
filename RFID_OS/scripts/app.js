// Main application logic

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Render modules to the grid
function renderModules() {
    const grid = document.getElementById('moduleGrid');
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const sortBy = document.getElementById('sortBy').value;
    const sortOrder = document.getElementById('sortOrder').value;
    
    let filteredModules = modules.filter(m => {
        const matchesSearch = 
            m.name.toLowerCase().includes(searchTerm) ||
            (m.description && m.description.toLowerCase().includes(searchTerm)) ||
            (m.tags && m.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
        
        const matchesCategory = !categoryFilter || m.category === categoryFilter;
        const matchesStatus = !statusFilter || m.status === statusFilter;
        
        return matchesSearch && matchesCategory && matchesStatus;
    });
    
    // Sort modules
    filteredModules.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];
        
        if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        }
        
        if (sortBy === 'version') {
            aValue = parseVersion(aValue);
            bValue = parseVersion(bValue);
        }
        
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });
    
    if (filteredModules.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <h3>Модулі не знайдені</h3>
                <p>Спробуйте змінити параметри пошуку або створіть новий модуль</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = '';
    
    filteredModules.forEach(m => {
        const statusClass = `badge-${m.status}`;
        const statusText = m.status === 'active' ? 'Активний' : 
                          m.status === 'draft' ? 'Чернетка' : 'Архівний';
        
        const isSelected = selectedModules.has(m.id);
        
        // LLM Profile icon
        const llmIcon = m.llmProfile ? getLLMProfileIcon(m.llmProfile.family) : '🤖';
        const llmTitle = m.llmProfile ? getLLMProfileTitle(m.llmProfile.family) : 'LLM';
        
        const card = document.createElement('div');
        card.className = `card ${isSelected ? 'selected' : ''}`;
        card.innerHTML = `
            ${isBulkMode ? `<input type="checkbox" class="card-checkbox" 
                   ${isSelected ? 'checked' : ''}
                   onchange="toggleModuleSelection(${m.id})">` : ''}
            
            <div class="card-header">
                <span class="card-icon">${escapeHTML(m.icon)}</span>
                <div style="flex: 1;">
                    <div class="card-title">${escapeHTML(m.name)}</div>
                    <div class="card-meta">
                        <span class="badge badge-category">${escapeHTML(m.category)}</span>
                        <span class="badge ${statusClass}">${statusText}</span>
                        <span class="version">v${escapeHTML(m.version)}</span>
                        ${m.llmProfile ? `
                            <span class="badge" style="background: rgba(56, 189, 248, 0.1); color: var(--accent);">
                                ${llmIcon} ${escapeHTML(llmTitle)}
                            </span>
                        ` : ''}
                    </div>
                </div>
            </div>
            
            <p class="card-description">${escapeHTML(m.description || 'Без опису')}</p>
            
            ${m.tags && m.tags.length > 0 ? `
                <div class="tags">
                    ${m.tags.slice(0, 3).map(tag => `
                        <span class="tag">${escapeHTML(tag)}</span>
                    `).join('')}
                    ${m.tags.length > 3 ? `<span class="tag">+${m.tags.length - 3}</span>` : ''}
                </div>
            ` : ''}
            
            ${m.filePath ? `
                <div class="file-indicator">
                    📄 ${escapeHTML(m.filePath)}
                </div>
            ` : ''}
            
            <div class="card-actions">
                <button class="btn-sm" onclick="viewModule(${m.id})">👁️ Перегляд</button>
                <button class="btn-sm btn-copy" onclick="copyText(${m.id})">📋 Копіювати</button>
                <button class="btn-sm btn-edit" onclick="editModule(${m.id})">✏️ Редагувати</button>
                <button class="btn-sm" onclick="exportSingleModule(${m.id})">📤 Експорт</button>
                <button class="btn-sm btn-delete" onclick="deleteModule(${m.id})">🗑️ Видалити</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Get LLM Profile icon
function getLLMProfileIcon(family) {
    const icons = {
        'chatgpt': '🤖',
        'claude': '👨‍💼',
        'gemini': '🔷',
        'deepseek': '🧠',
        'copilot': '👨‍💻',
        'grok': '😎',
        'llama': '🦙',
        'mistral': '🌬️',
        'perplexity': '🔍',
        'custom': '🔧',
        'universal': '🌐'
    };
    return icons[family] || '🤖';
}

// Get LLM Profile title
function getLLMProfileTitle(family) {
    const titles = {
        'chatgpt': 'ChatGPT',
        'claude': 'Claude',
        'gemini': 'Gemini',
        'deepseek': 'DeepSeek',
        'copilot': 'Copilot',
        'grok': 'Grok',
        'llama': 'Llama',
        'mistral': 'Mistral',
        'perplexity': 'Perplexity',
        'custom': 'Custom',
        'universal': 'Universal'
    };
    return titles[family] || 'LLM';
}

// Modal functions
function openModal(type = 'create', moduleId = null) {
    if (type === 'create') {
        document.getElementById('modalTitle').textContent = 'Додати новий модуль';
        document.getElementById('submitBtn').textContent = 'Створити модуль';
        document.getElementById('moduleForm').reset();
        document.getElementById('moduleId').value = '';
        document.getElementById('status').value = 'active';
        document.getElementById('version').value = '1.0.0';
        document.getElementById('icon').value = '📄';
        document.getElementById('llmFamily').value = '';
        document.getElementById('llmVariant').value = '';
        document.getElementById('llmTemperature').value = '0.7';
        document.getElementById('llmTemperatureValue').textContent = '0.7';
        document.getElementById('customVariantSection').style.display = 'none';
    } else if (type === 'edit' && moduleId) {
        const module = modules.find(m => m.id == moduleId);
        if (module) {
            document.getElementById('modalTitle').textContent = 'Редагувати модуль';
            document.getElementById('submitBtn').textContent = 'Оновити модуль';
            document.getElementById('moduleId').value = module.id;
            document.getElementById('name').value = module.name;
            document.getElementById('icon').value = module.icon;
            document.getElementById('description').value = module.description || '';
            document.getElementById('category').value = module.category;
            document.getElementById('status').value = module.status;
            document.getElementById('version').value = module.version;
            document.getElementById('tags').value = module.tags ? module.tags.join(', ') : '';
            document.getElementById('content').value = module.content;
            document.getElementById('filePath').value = module.filePath || '';
            document.getElementById('filePathInput').value = module.filePath || '';
            
            // LLM Profile fields
            if (module.llmProfile) {
                document.getElementById('llmFamily').value = module.llmProfile.family || '';
                document.getElementById('llmVariant').value = module.llmProfile.variant || '';
                document.getElementById('llmTemperature').value = module.llmProfile.temperature || '0.7';
                document.getElementById('llmTemperatureValue').textContent = module.llmProfile.temperature || '0.7';
                
                if (module.llmProfile.family === 'custom') {
                    document.getElementById('customVariantSection').style.display = 'block';
                }
            } else {
                document.getElementById('llmFamily').value = '';
                document.getElementById('llmVariant').value = '';
                document.getElementById('llmTemperature').value = '0.7';
                document.getElementById('llmTemperatureValue').textContent = '0.7';
                document.getElementById('customVariantSection').style.display = 'none';
            }
        }
    }
    
    document.getElementById('moduleModal').classList.add('active');
}

function closeModuleModal() {
    document.getElementById('moduleModal').classList.remove('active');
}

function closeViewModal() {
    document.getElementById('viewModal').classList.remove('active');
}

// Update temperature value display
function updateTemperatureValue() {
    const temp = document.getElementById('llmTemperature').value;
    document.getElementById('llmTemperatureValue').textContent = temp;
}

// Toggle custom variant field
function toggleCustomVariant() {
    const family = document.getElementById('llmFamily').value;
    const customSection = document.getElementById('customVariantSection');
    customSection.style.display = family === 'custom' ? 'block' : 'none';
}

// Generate file path
function generateFilePath() {
    const name = document.getElementById('name').value;
    if (name) {
        const slug = name.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim();
        
        const filePath = `modules/${slug}.json`;
        document.getElementById('filePathInput').value = filePath;
        document.getElementById('filePath').value = filePath;
    }
}

// Edit current viewed module
function editCurrentModule() {
    if (currentViewModuleId) {
        closeViewModal();
        setTimeout(() => openModal('edit', currentViewModuleId), 300);
    }
}

// Edit module
function editModule(id) {
    openModal('edit', id);
}

// Delete module
function deleteModule(id) {
    if (confirm('Ви впевнені, що хочете видалити цей модуль? Дія незворотна.')) {
        modules = modules.filter(m => m.id != id);
        saveModules();
        updateTagList();
        renderModules();
        showToast('Модуль успішно видалено', 'success');
    }
}

// Form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('moduleId').value;
    const now = new Date().toISOString();
    
    // Collect LLM Profile data
    const llmFamily = document.getElementById('llmFamily').value;
    const llmProfile = llmFamily ? {
        family: llmFamily,
        variant: document.getElementById('llmVariant').value.trim(),
        temperature: parseFloat(document.getElementById('llmTemperature').value) || 0.7
    } : null;
    
    const moduleData = {
        id: id ? parseInt(id) : Date.now(),
        name: document.getElementById('name').value.trim(),
        icon: document.getElementById('icon').value.trim() || '📄',
        description: document.getElementById('description').value.trim(),
        category: document.getElementById('category').value,
        status: document.getElementById('status').value,
        version: document.getElementById('version').value.trim(),
        tags: document.getElementById('tags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
        content: document.getElementById('content').value.trim(),
        filePath: document.getElementById('filePath').value || `modules/module-${Date.now()}.json`,
        updatedAt: now
    };
    
    // Add LLM Profile if provided
    if (llmProfile) {
        moduleData.llmProfile = llmProfile;
    }
    
    // Find existing module
    const existingIndex = modules.findIndex(m => m.id == id);
    
    if (existingIndex !== -1) {
        // Update existing module - save to history
        const oldModule = modules[existingIndex];
        
        if (!moduleData.history) moduleData.history = [];
        if (!oldModule.history) oldModule.history = [];
        
        // Add current version to history if content changed
        if (oldModule.content !== moduleData.content || oldModule.version !== moduleData.version) {
            const historyEntry = {
                version: oldModule.version,
                content: oldModule.content,
                updatedAt: oldModule.updatedAt
            };
            moduleData.history = [historyEntry, ...oldModule.history].slice(0, 10);
        } else {
            moduleData.history = oldModule.history;
        }
        
        moduleData.createdAt = oldModule.createdAt;
        modules[existingIndex] = moduleData;
        showToast('Модуль успішно оновлено', 'success');
    } else {
        // Create new module
        moduleData.createdAt = now;
        moduleData.history = [];
        modules.push(moduleData);
        showToast('Модуль успішно створено', 'success');
    }
    
    saveModules();
    updateTagList();
    renderModules();
    closeModuleModal();
}

// Smart Export functions
let currentExportData = null;

function showExportSelector() {
    document.getElementById('exportFormatSelector').classList.add('show');
}

function hideExportSelector() {
    document.getElementById('exportFormatSelector').classList.remove('show');
}

function previewExport() {
    const format = document.getElementById('exportFormatSelect').value;
    const modulesToExport = selectedModules.size > 0 
        ? modules.filter(m => selectedModules.has(m.id))
        : modules;
    
    if (modulesToExport.length === 0) {
        showToast('Нет модулей для экспорта', 'warning');
        return;
    }
    
    const preview = LLMExporter.createPreview(modulesToExport, format);
    if (!preview) {
        showToast('Ошибка создания предпросмотра', 'error');
        return;
    }
    
    currentExportData = {
        content: preview.content,
        format: format,
        modules: modulesToExport
    };
    
    document.getElementById('exportPreviewTitle').textContent = `Предпросмотр: ${preview.formatName}`;
    document.getElementById('previewFormatName').textContent = preview.formatName;
    document.getElementById('previewModuleCount').textContent = preview.moduleCount;
    document.getElementById('previewSize').textContent = preview.sizeKB;
    document.getElementById('exportPreviewContent').textContent = preview.content;
    
    document.getElementById('exportPreviewModal').classList.add('active');
}

function closeExportPreview() {
    document.getElementById('exportPreviewModal').classList.remove('active');
}

function downloadExport() {
    if (!currentExportData) return;
    
    const format = currentExportData.format;
    const formatConfig = LLMExporter.formats[format];
    const filename = `rfid-os-export-${format}-${Date.now()}${formatConfig.extension}`;
    
    LLMExporter.download(currentExportData.content, filename);
    showToast(`Экспортировано ${currentExportData.modules.length} модулей в ${formatConfig.name}`, 'success');
    closeExportPreview();
}

function copyExportPreview() {
    if (!currentExportData) return;
    
    navigator.clipboard.writeText(currentExportData.content)
        .then(() => showToast('Скопировано в буфер обмена', 'success'))
        .catch(err => showToast('Ошибка копирования: ' + err, 'error'));
}

function executeExport() {
    const format = document.getElementById('exportFormatSelect').value;
    const modulesToExport = selectedModules.size > 0 
        ? modules.filter(m => selectedModules.has(m.id))
        : modules;
    
    if (modulesToExport.length === 0) {
        showToast('Нет модулей для экспорта', 'warning');
        return;
    }
    
    const formatConfig = LLMExporter.formats[format];
    const content = formatConfig.export(modulesToExport);
    const filename = `rfid-os-export-${format}-${Date.now()}${formatConfig.extension}`;
    
    LLMExporter.download(content, filename);
    showToast(`Экспортировано ${modulesToExport.length} модулей`, 'success');
}

// Bulk operations
function toggleBulkMode() {
    isBulkMode = !isBulkMode;
    const bulkPanel = document.getElementById('bulkActions');
    
    if (isBulkMode) {
        bulkPanel.classList.add('show');
        showToast('Режим групових операцій увімкнено', 'info');
    } else {
        bulkPanel.classList.remove('show');
        clearSelection();
    }
    
    renderModules();
}

function toggleModuleSelection(moduleId) {
    if (!isBulkMode) return;
    
    if (selectedModules.has(moduleId)) {
        selectedModules.delete(moduleId);
    } else {
        selectedModules.add(moduleId);
    }
    
    updateSelectedCount();
    renderModules();
}

function updateSelectedCount() {
    document.getElementById('selectedCount').textContent = selectedModules.size;
}

function clearSelection() {
    selectedModules.clear();
    updateSelectedCount();
    renderModules();
}

function bulkExport() {
    if (selectedModules.size === 0) {
        showToast('Не вибрано жодного модуля', 'warning');
        return;
    }
    
    showExportSelector();
}

function bulkArchive() {
    if (selectedModules.size === 0) {
        showToast('Не вибрано жодного модуля', 'warning');
        return;
    }
    
    if (confirm(`Архівувати ${selectedModules.size} модулів?`)) {
        selectedModules.forEach(moduleId => {
            const module = modules.find(m => m.id === moduleId);
            if (module) {
                module.status = 'archived';
                module.updatedAt = new Date().toISOString();
            }
        });
        
        saveModules();
        clearSelection();
        renderModules();
        showToast('Модулі архівовано', 'success');
    }
}

function bulkDelete() {
    if (selectedModules.size === 0) {
        showToast('Не вибрано жодного модуля', 'warning');
        return;
    }
    
    if (confirm(`Видалити ${selectedModules.size} модулів? Ця дія незворотна.`)) {
        modules = modules.filter(m => !selectedModules.has(m.id));
        saveModules();
        updateTagList();
        clearSelection();
        renderModules();
        showToast('Модулі видалено', 'success');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Header buttons
    document.getElementById('createModuleBtn').addEventListener('click', () => openModal('create'));
    document.getElementById('exportAllBtn').addEventListener('click', exportAllModules);
    document.getElementById('importBtn').addEventListener('click', importModules);
    document.getElementById('bulkModeBtn').addEventListener('click', toggleBulkMode);
    
    // Search and filters
    document.getElementById('search').addEventListener('input', () => {
        clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(renderModules, 300);
    });
    
    document.getElementById('categoryFilter').addEventListener('change', renderModules);
    document.getElementById('statusFilter').addEventListener('change', renderModules);
    document.getElementById('sortBy').addEventListener('change', renderModules);
    document.getElementById('sortOrder').addEventListener('change', renderModules);
    
    // Bulk actions
    document.getElementById('bulkExportBtn').addEventListener('click', bulkExport);
    document.getElementById('bulkArchiveBtn').addEventListener('click', bulkArchive);
    document.getElementById('bulkDeleteBtn').addEventListener('click', bulkDelete);
    document.getElementById('clearSelectionBtn').addEventListener('click', clearSelection);
    
    // Modals
    document.getElementById('closeModuleModal').addEventListener('click', closeModuleModal);
    document.getElementById('cancelModuleBtn').addEventListener('click', closeModuleModal);
    document.getElementById('closeViewModal').addEventListener('click', closeViewModal);
    document.getElementById('closeViewBtn').addEventListener('click', closeViewModal);
    
    // Module actions
    document.getElementById('copyContentBtn').addEventListener('click', copyModuleContent);
    document.getElementById('editCurrentModuleBtn').addEventListener('click', editCurrentModule);
    
    // Form
    document.getElementById('generateFilePathBtn').addEventListener('click', generateFilePath);
    document.getElementById('moduleForm').addEventListener('submit', handleFormSubmit);
    
    // LLM Profile form controls
    document.getElementById('llmTemperature').addEventListener('input', updateTemperatureValue);
    document.getElementById('llmFamily').addEventListener('change', toggleCustomVariant);
    
    // Smart Export
    document.getElementById('exportFormatSelect').addEventListener('change', function() {
        const format = this.value;
        const description = LLMExporter.formats[format]?.description || '';
        document.getElementById('exportFormatDescription').textContent = description;
        
        // Динамически меняем иконку в кнопке экспорта
        const exportBtn = document.querySelector('.selector-controls .btn-export');
        const icon = LLMExporter.getFormatIcon(format);
        if (exportBtn) {
            exportBtn.innerHTML = `${icon} Экспорт в ${LLMExporter.formats[format]?.name || format}`;
        }
    });
    
    // Initialize export description
    const initialFormat = document.getElementById('exportFormatSelect').value;
    document.getElementById('exportFormatDescription').textContent = 
        LLMExporter.formats[initialFormat]?.description || '';
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + N for new module
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            openModal('create');
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            closeModuleModal();
            closeViewModal();
            closeExportPreview();
        }
        
        // Ctrl/Cmd + F to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            document.getElementById('search').focus();
        }
        
        // Ctrl/Cmd + E for export
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            showExportSelector();
        }
    });
}

// Initialize the app
function initApp() {
    loadModules();
    setupEventListeners();
    renderModules();
    
    // Initialize tagify after modules are loaded
    setTimeout(() => {
        initTagify();
        addTagSuggestions();
    }, 100);
    
    // Save modules before page unload
    window.addEventListener('beforeunload', saveModules);
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);