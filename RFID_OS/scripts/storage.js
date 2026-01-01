// XSS Protection Function
function escapeHTML(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// App State (глобальні змінні)
let modules = [];
let selectedModules = new Set();
let currentViewModuleId = null;
let isBulkMode = false;
let allTags = new Set();

// Initialize modules from localStorage or with default data
function loadModules() {
    const stored = localStorage.getItem('rfid_modules');
    if (stored) {
        modules = JSON.parse(stored);
    } else {
        modules = [
            {
                id: 1,
                name: 'Architect Prompt',
                icon: '🏗️',
                description: 'Системний промпт для створення детальних технічних завдань',
                category: 'Промпти',
                status: 'active',
                version: '2.1.0',
                tags: ['ТЗ', 'архітектура', 'системний', 'технічне завдання'],
                content: `# Architect Prompt\n\nСистемний промпт для створення ТЗ...`,
                createdAt: '2024-01-15T10:30:00Z',
                updatedAt: '2024-03-20T14:45:00Z',
                history: [
                    { version: '2.0.0', content: 'Попередня версія промпту', updatedAt: '2024-02-10T09:15:00Z' },
                    { version: '1.5.0', content: 'Початкова версія промпту', updatedAt: '2024-01-15T10:30:00Z' }
                ],
                filePath: 'modules/architect-prompt.json'
            }
        ];
        saveModules();
    }
    updateTagList();
}

// Save modules to localStorage
function saveModules() {
    localStorage.setItem('rfid_modules', JSON.stringify(modules));
}

// Update tag list from all modules
function updateTagList() {
    allTags.clear();
    modules.forEach(module => {
        if (module.tags) {
            module.tags.forEach(tag => allTags.add(tag));
        }
    });
}

// Export all modules
function exportAllModules() {
    const exportData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        modules: modules
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `rfid-modules-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    showToast('Всі модулі експортовано успішно', 'success');
}

// Import modules
function importModules() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                let importedModules = [];
                
                if (Array.isArray(data)) {
                    importedModules = data;
                } else if (data.modules && Array.isArray(data.modules)) {
                    importedModules = data.modules;
                } else {
                    throw new Error('Невірний формат файлу');
                }
                
                importedModules.forEach(imported => {
                    // Generate new ID if needed
                    if (!imported.id || modules.some(m => m.id === imported.id)) {
                        imported.id = Date.now() + Math.random();
                    }
                    
                    // Set timestamps
                    const now = new Date().toISOString();
                    imported.updatedAt = now;
                    if (!imported.createdAt) {
                        imported.createdAt = now;
                    }
                    
                    // Add to modules
                    const existingIndex = modules.findIndex(m => m.id === imported.id);
                    if (existingIndex !== -1) {
                        modules[existingIndex] = imported;
                    } else {
                        modules.push(imported);
                    }
                });
                
                saveModules();
                updateTagList();
                renderModules();
                showToast(`Успішно імпортовано ${importedModules.length} модулів`, 'success');
            } catch (err) {
                showToast('Помилка імпорту: ' + err.message, 'error');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Export single module
function exportSingleModule(moduleId) {
    const module = modules.find(m => m.id == moduleId);
    if (!module) return;
    
    const dataStr = JSON.stringify(module, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `module-${module.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    showToast('Модуль експортовано успішно', 'success');
}

// Parse version string for sorting
function parseVersion(version) {
    const parts = version.split('.').map(part => {
        const match = part.match(/^(\d+)/);
        return match ? parseInt(match[1]) : 0;
    });
    
    // Convert to sortable number (major * 10000 + minor * 100 + patch)
    return parts[0] * 10000 + (parts[1] || 0) * 100 + (parts[2] || 0);
}