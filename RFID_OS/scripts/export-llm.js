// scripts/export-llm.js
/**
 * Smart Export для всех популярных LLM
 * 100% автономный, без зависимостей
 */

class LLMExporter {
  static formats = {
    chatgpt: {
      name: 'ChatGPT',
      description: 'Оптимизировано для ChatGPT/GPT-4',
      extension: '.txt',
      export: this.exportForChatGPT.bind(this)
    },
    claude: {
      name: 'Claude',
      description: 'Формат для Claude (Anthropic)',
      extension: '.txt',
      export: this.exportForClaude.bind(this)
    },
    gemini: {
      name: 'Gemini',
      description: 'Формат для Google Gemini',
      extension: '.txt',
      export: this.exportForGemini.bind(this)
    },
    deepseek: {
      name: 'DeepSeek',
      description: 'Формат для DeepSeek',
      extension: '.txt',
      export: this.exportForDeepSeek.bind(this)
    },
    copilot: {
      name: 'Copilot',
      description: 'Формат для GitHub Copilot',
      extension: '.txt',
      export: this.exportForCopilot.bind(this)
    },
    grok: {
      name: 'Grok',
      description: 'Формат для Grok (xAI)',
      extension: '.txt',
      export: this.exportForGrok.bind(this)
    },
    llama: {
      name: 'Llama',
      description: 'Формат для Meta Llama',
      extension: '.txt',
      export: this.exportForLlama.bind(this)
    },
    mistral: {
      name: 'Mistral',
      description: 'Формат для Mistral AI',
      extension: '.txt',
      export: this.exportForMistral.bind(this)
    },
    perplexity: {
      name: 'Perplexity',
      description: 'Формат для Perplexity AI',
      extension: '.txt',
      export: this.exportForPerplexity.bind(this)
    },
    jsonl: {
      name: 'JSONL',
      description: 'JSON Lines для fine-tuning',
      extension: '.jsonl',
      export: this.exportForJSONL.bind(this)
    },
    universal: {
      name: 'Универсальный',
      description: 'Markdown для любой LLM',
      extension: '.md',
      export: this.exportUniversal.bind(this)
    }
  };

  // ChatGPT формат
  static exportForChatGPT(modules) {
    return modules.map(module => {
      return `## ${escapeHTML(module.name)}

${module.description ? `> ${escapeHTML(module.description)}\n\n` : ''}
**Модель:** ${module.llmProfile?.family || 'ChatGPT'}
**Версия:** ${module.llmProfile?.variant || 'GPT-4'}
**Температура:** ${module.llmProfile?.temperature || 0.7}
**Категория:** ${escapeHTML(module.category)}
**Теги:** ${escapeHTML(module.tags?.join(', ') || 'нет')}

\`\`\`
${escapeHTML(module.content)}
\`\`\`

---
*Експортовано з RFID OS | ChatGPT формат*`;
    }).join('\n\n');
  }

  // Claude формат
  static exportForClaude(modules) {
    return modules.map(module => {
      return `<prompt name="${escapeHTML(module.name)}">
<category>${escapeHTML(module.category)}</category>
<tags>${escapeHTML(module.tags?.join(', ') || '')}</tags>
<version>${escapeHTML(module.version)}</version>
<model>Claude</model>

${module.description ? `<description>${escapeHTML(module.description)}</description>\n\n` : ''}
\`\`\`
${escapeHTML(module.content)}
\`\`\`
</prompt>
---
Експортовано з RFID OS | Claude формат`;
    }).join('\n\n');
  }

  // Gemini формат
  static exportForGemini(modules) {
    return modules.map(module => {
      return `[${escapeHTML(module.category)}] ${escapeHTML(module.name)} v${escapeHTML(module.version)}
${'='.repeat(60)}

**Модель:** Google Gemini
**Для:** ${escapeHTML(module.description || 'универсальне використання')}

${escapeHTML(module.content)}

---
**Теги:** ${escapeHTML(module.tags?.join(', ') || 'без тегів')}
**Файл:** ${escapeHTML(module.filePath || 'не вказано')}
**Експорт:** RFID OS | Gemini формат`;
    }).join('\n\n' + '='.repeat(80) + '\n\n');
  }

  // DeepSeek формат
  static exportForDeepSeek(modules) {
    return modules.map(module => {
      return `# ${escapeHTML(module.icon || '🧠')} ${escapeHTML(module.name)}

## Метадані
- **Модель:** DeepSeek
- **Категорія:** ${escapeHTML(module.category)}
- **Статус:** ${module.status === 'active' ? 'активний' : 'чернетка'}
- **Версія модуля:** ${escapeHTML(module.version)}

## Опис
${escapeHTML(module.description || 'Без опису')}

## Промпт
\`\`\`
${escapeHTML(module.content)}
\`\`\`

## Теги
${module.tags?.map(t => `\`${escapeHTML(t)}\``).join(' ') || 'немає тегів'}

---
💡 Експортовано з RFID OS | DeepSeek формат`;
    }).join('\n\n' + '━'.repeat(60) + '\n\n');
  }

  // Copilot формат
  static exportForCopilot(modules) {
    return modules.map(module => {
      return `// ${escapeHTML(module.name)}
// Категорія: ${escapeHTML(module.category)}
// Теги: ${escapeHTML(module.tags?.join(', ') || 'none')}
// Версія: ${escapeHTML(module.version)}

/*
${escapeHTML(module.description || 'No description')}
*/

${escapeHTML(module.content)}

// ---
// Експорт: RFID OS | Copilot формат`;
    }).join('\n\n' + '// ' + '─'.repeat(50) + '\n\n');
  }

  // Grok формат
  static exportForGrok(modules) {
    return modules.map(module => {
      return `🤖 **${escapeHTML(module.name)}** 
📁 *${escapeHTML(module.category)}* | v${escapeHTML(module.version)}

${escapeHTML(module.description || '')}

**Промпт:**
\`\`\`
${escapeHTML(module.content)}
\`\`\`

**Теги:** ${module.tags?.map(t => `#${escapeHTML(t)}`).join(' ') || 'без тегів'}

---
😎 Експортовано з RFID OS | Grok формат`;
    }).join('\n\n' + '✨' + '─'.repeat(50) + '✨\n\n');
  }

  // Llama формат
  static exportForLlama(modules) {
    return modules.map(module => {
      return `[INST] Наступний текст є промптом для Llama моделей. [/INST]

Назва: ${escapeHTML(module.name)}
Категорія: ${escapeHTML(module.category)}
Версія: ${escapeHTML(module.version)}

Опис: ${escapeHTML(module.description || 'Без опису')}

Промпт:
${escapeHTML(module.content)}

Теги: ${escapeHTML(module.tags?.join(', ') || 'немає')}
---
Експорт: RFID OS | Llama формат`;
    }).join('\n\n' + '─'.repeat(60) + '\n\n');
  }

  // Mistral формат
  static exportForMistral(modules) {
    return modules.map(module => {
      return `<|im_start|>system
Використовуй наступний промпт як шаблон для відповідей.
<|im_end|>

<|im_start|>user
Інформація про промпт:
Назва: ${escapeHTML(module.name)}
Категорія: ${escapeHTML(module.category)}
Версія: ${escapeHTML(module.version)}
<|im_end|>

<|im_start|>assistant
Опис: ${escapeHTML(module.description || 'Без опису')}

Промпт:
${escapeHTML(module.content)}

Теги: ${escapeHTML(module.tags?.join(', ') || 'немає')}
<|im_end|>

---
Експортовано з RFID OS | Mistral формат`;
    }).join('\n\n' + '─'.repeat(60) + '\n\n');
  }

  // Perplexity формат
  static exportForPerplexity(modules) {
    return modules.map(module => {
      return `🔍 **${escapeHTML(module.name)}**
📊 Категорія: ${escapeHTML(module.category)}
🏷️ Теги: ${escapeHTML(module.tags?.join(', ') || 'немає')}
🔄 Версія: ${escapeHTML(module.version)}

${escapeHTML(module.description || '')}

**Запит:**
"""
${escapeHTML(module.content)}
"""

---
📈 Експортовано з RFID OS | Perplexity формат`;
    }).join('\n\n' + '─'.repeat(60) + '\n\n');
  }

  // JSONL для fine-tuning
  static exportForJSONL(modules) {
    return modules.map(module => {
      return JSON.stringify({
        messages: [
          {
            role: "system",
            content: `Ти експерт у темі: ${module.category}. ${module.description || ''}`
          },
          {
            role: "user",
            content: "Надай детальну відповідь"
          },
          {
            role: "assistant",
            content: module.content
          }
        ],
        metadata: {
          name: module.name,
          version: module.version,
          tags: module.tags,
          category: module.category,
          llmProfile: module.llmProfile || { family: 'universal' },
          source: 'RFID OS'
        }
      });
    }).join('\n');
  }

  // Универсальный Markdown
  static exportUniversal(modules) {
    return modules.map(module => {
      return `# ${escapeHTML(module.icon || '📄')} ${escapeHTML(module.name)}

**Категорія:** ${escapeHTML(module.category)}  
**Статус:** ${module.status === 'active' ? '✅ Активний' : module.status === 'draft' ? '📝 Черновик' : '📦 Архивний'}  
**Версія:** ${escapeHTML(module.version)}  
**Теги:** ${module.tags?.map(t => `\`${escapeHTML(t)}\``).join(' ') || 'немає'}  

${module.description ? `> ${escapeHTML(module.description)}\n\n` : ''}

## Контент

${escapeHTML(module.content)}

---

*Створено: ${new Date(module.createdAt).toLocaleDateString('uk-UA')}*  
*Оновлено: ${new Date(module.updatedAt).toLocaleDateString('uk-UA')}*  
${module.filePath ? `*Файл: \`${escapeHTML(module.filePath)}\`*` : ''}  
*Експорт: RFID OS | Універсальний формат*`;
    }).join('\n\n' + '═'.repeat(60) + '\n\n');
  }

  // Предпросмотр
  static createPreview(modules, format) {
    const formatConfig = this.formats[format];
    if (!formatConfig) return null;
    
    const content = formatConfig.export(modules);
    const sizeKB = Math.round(new Blob([content]).size / 1024);
    
    return {
      content,
      sizeKB,
      moduleCount: modules.length,
      formatName: formatConfig.name,
      formatDescription: formatConfig.description
    };
  }

  // Скачать файл
  static download(content, filename) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  // Получить иконку формата
  static getFormatIcon(format) {
    const icons = {
      chatgpt: '🤖',
      claude: '👨‍💼',
      gemini: '🔷',
      deepseek: '🧠',
      copilot: '👨‍💻',
      grok: '😎',
      llama: '🦙',
      mistral: '🌬️',
      perplexity: '🔍',
      jsonl: '📊',
      universal: '📄'
    };
    return icons[format] || '📄';
  }
}