// LLM Profile utilities

// LLM Profile configuration
const LLMProfiles = {
    chatgpt: {
        name: 'ChatGPT',
        icon: '🤖',
        variants: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo', 'gpt-4o'],
        defaultVariant: 'gpt-4',
        defaultTemperature: 0.7,
        description: 'OpenAI ChatGPT'
    },
    claude: {
        name: 'Claude',
        icon: '👨‍💼',
        variants: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku', 'claude-2'],
        defaultVariant: 'claude-3-sonnet',
        defaultTemperature: 0.8,
        description: 'Anthropic Claude'
    },
    gemini: {
        name: 'Gemini',
        icon: '🔷',
        variants: ['gemini-pro', 'gemini-ultra', 'gemini-flash'],
        defaultVariant: 'gemini-pro',
        defaultTemperature: 0.7,
        description: 'Google Gemini'
    },
    deepseek: {
        name: 'DeepSeek',
        icon: '🧠',
        variants: ['deepseek-chat', 'deepseek-coder'],
        defaultVariant: 'deepseek-chat',
        defaultTemperature: 0.7,
        description: 'DeepSeek AI'
    },
    copilot: {
        name: 'Copilot',
        icon: '👨‍💻',
        variants: ['github-copilot', 'copilot-chat'],
        defaultVariant: 'github-copilot',
        defaultTemperature: 0.7,
        description: 'GitHub Copilot'
    },
    grok: {
        name: 'Grok',
        icon: '😎',
        variants: ['grok-1', 'grok-2'],
        defaultVariant: 'grok-1',
        defaultTemperature: 0.9,
        description: 'xAI Grok'
    },
    llama: {
        name: 'Llama',
        icon: '🦙',
        variants: ['llama-3', 'llama-2', 'llama-3.1'],
        defaultVariant: 'llama-3',
        defaultTemperature: 0.7,
        description: 'Meta Llama'
    },
    mistral: {
        name: 'Mistral',
        icon: '🌬️',
        variants: ['mistral-large', 'mixtral', 'mistral-7b'],
        defaultVariant: 'mistral-large',
        defaultTemperature: 0.7,
        description: 'Mistral AI'
    },
    perplexity: {
        name: 'Perplexity',
        icon: '🔍',
        variants: ['pplx-70b', 'pplx-7b'],
        defaultVariant: 'pplx-70b',
        defaultTemperature: 0.7,
        description: 'Perplexity AI'
    },
    custom: {
        name: 'Custom',
        icon: '🔧',
        variants: [],
        defaultVariant: '',
        defaultTemperature: 0.7,
        description: 'Custom LLM'
    },
    universal: {
        name: 'Universal',
        icon: '🌐',
        variants: [],
        defaultVariant: '',
        defaultTemperature: 0.7,
        description: 'Universal LLM'
    }
};

// Get LLM Profile by family
function getLLMProfile(family) {
    return LLMProfiles[family] || LLMProfiles.universal;
}

// Format LLM Profile for display
function formatLLMProfile(profile) {
    if (!profile || !profile.family) return '🤖 LLM';
    
    const config = getLLMProfile(profile.family);
    let display = `${config.icon} ${config.name}`;
    
    if (profile.variant) {
        display += ` (${profile.variant})`;
    }
    
    if (profile.temperature && profile.temperature !== config.defaultTemperature) {
        display += ` · T=${profile.temperature}`;
    }
    
    return display;
}

// Auto-fill variant when family is selected
function autoFillLLMVariant(family) {
    const config = getLLMProfile(family);
    const variantInput = document.getElementById('llmVariant');
    const temperatureInput = document.getElementById('llmTemperature');
    const temperatureValue = document.getElementById('llmTemperatureValue');
    
    if (variantInput && config.defaultVariant) {
        variantInput.value = config.defaultVariant;
        variantInput.placeholder = config.defaultVariant;
    }
    
    if (temperatureInput && temperatureValue) {
        temperatureInput.value = config.defaultTemperature;
        temperatureValue.textContent = config.defaultTemperature;
    }
}

// Initialize LLM Profile functionality
function initLLMProfile() {
    const familySelect = document.getElementById('llmFamily');
    if (familySelect) {
        familySelect.addEventListener('change', function() {
            const family = this.value;
            const customSection = document.getElementById('customVariantSection');
            
            if (family === 'custom') {
                customSection.style.display = 'block';
            } else {
                customSection.style.display = 'none';
                autoFillLLMVariant(family);
            }
        });
    }
}

// Add to window
window.getLLMProfile = getLLMProfile;
window.formatLLMProfile = formatLLMProfile;
window.autoFillLLMVariant = autoFillLLMVariant;
window.initLLMProfile = initLLMProfile;

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLLMProfile);
} else {
    initLLMProfile();
}