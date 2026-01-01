// Tag autocomplete functionality

let tagify = null;

// Initialize tagify
function initTagify() {
    const input = document.getElementById('tags');
    if (!input) return;
    
    tagify = new Tagify(input, {
        whitelist: Array.from(allTags),
        dropdown: {
            maxItems: 20,
            classname: 'tags-dropdown',
            enabled: 0,
            closeOnSelect: false
        },
        originalInputValueFormat: valuesArr => valuesArr.map(item => item.value).join(',')
    });
    
    // Add custom tags on blur
    tagify.on('blur', function(e) {
        const value = e.detail.value.trim();
        if (value && !allTags.has(value)) {
            allTags.add(value);
            tagify.settings.whitelist = Array.from(allTags);
            tagify.dropdown.refilter();
        }
    });
}

// Get popular tags
function getPopularTags(limit = 10) {
    const tagCounts = {};
    
    modules.forEach(module => {
        if (module.tags) {
            module.tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        }
    });
    
    return Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([tag]) => tag);
}

// Add tag suggestions to UI
function addTagSuggestions() {
    const popularTags = getPopularTags(5);
    if (popularTags.length === 0) return;
    
    const container = document.querySelector('.search-section');
    if (!container) return;
    
    const suggestions = document.createElement('div');
    suggestions.className = 'tag-suggestions';
    suggestions.innerHTML = `
        <div style="display: flex; gap: 10px; align-items: center; margin-top: 10px;">
            <span style="color: var(--gray); font-size: 0.9em;">Популярні теги:</span>
            ${popularTags.map(tag => `
                <button class="tag-suggestion" onclick="addTagToSearch('${tag}')">
                    ${escapeHTML(tag)}
                </button>
            `).join('')}
        </div>
    `;
    
    container.appendChild(suggestions);
}

// Add tag to search
function addTagToSearch(tag) {
    const searchInput = document.getElementById('search');
    const currentValue = searchInput.value.trim();
    
    if (currentValue) {
        searchInput.value = currentValue + ' ' + tag;
    } else {
        searchInput.value = tag;
    }
    
    searchInput.focus();
    renderModules();
}