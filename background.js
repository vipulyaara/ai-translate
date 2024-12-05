const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const sendMessageWithRetry = async (tabId, message, maxAttempts = 3) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await chrome.tabs.sendMessage(tabId, message);
      return; // Success, exit function
    } catch (error) {
      console.log(`Attempt ${attempt} failed:`, error);
      if (attempt === maxAttempts) {
        throw error; // Throw error on final attempt
      }
      await delay(1000); // Wait 1 second before retrying
    }
  }
};

const createContextMenu = () => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'translate',
      title: 'Translate with AI',
      contexts: ['selection']
    });
  });
};

const handleTranslate = async (text, targetLang = 'en', context = null) => {
  try {
    const { apiKey } = await chrome.storage.sync.get('apiKey');
    
    if (!apiKey) {
      throw new Error('API key not found. Please set your API key in the extension settings.');
    }

    if (!text || text.trim().length === 0) {
      throw new Error('No text selected for translation.');
    }

    let contextMessage = '';
    if (context) {
      contextMessage = `Context: This text is from ${context.domain}${
        context.title ? `, page titled "${context.title}"` : ''
      }. URL: ${context.url}\n\n`;
    }

    const contextPrompt = context ? 
      `Webpage: ${context.url}
Title: ${context.pageTitle}
Domain: ${context.domain}
Path: ${context.path}
Meta Description: ${context.metaDescription}
Meta Keywords: ${context.metaKeywords}
Surrounding Text: ${context.surroundingText}` : '';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            "role": "system",
            "content": `You are a professional translator. Translate the following text to ${targetLang}. Consider the provided webpage context for accurate domain-specific translation. Maintain the original formatting and structure.`
          },
          context && {
            "role": "user",
            "content": `Context information:\n${contextPrompt}`
          },
          {
            "role": "user",
            "content": text
          }
        ].filter(Boolean),
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI API');
    }

    return { translation: data.choices[0].message.content };
  } catch (error) {
    console.error('Translation error:', {
      message: error.message,
      stack: error.stack,
      text: text
    });

    return { 
      error: error.message || 'Translation failed. Please try again.',
      details: error.stack
    };
  }
};

const handleExplain = async (text, targetLang = 'en', context = null) => {
  try {
    const { apiKey } = await chrome.storage.sync.get('apiKey');
    
    if (!apiKey) {
      throw new Error('API key not found. Please set your API key in the extension settings.');
    }

    if (!text || text.trim().length === 0) {
      throw new Error('No text selected for explanation.');
    }

    let contextMessage = '';
    if (context) {
      contextMessage = `Context: This text is from ${context.domain}${
        context.title ? `, page titled "${context.title}"` : ''
      }. URL: ${context.url}\n\n`;
    }

    const contextPrompt = context ? 
      `Webpage: ${context.url}
Title: ${context.pageTitle}
Domain: ${context.domain}
Path: ${context.path}
Meta Description: ${context.metaDescription}
Meta Keywords: ${context.metaKeywords}
Surrounding Text: ${context.surroundingText}` : '';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            "role": "system",
            "content": `You are a language expert. Provide a clear and detailed explanation of the following text in ${targetLang}. Use the webpage context to ensure accurate domain-specific explanations. Include cultural context and nuances where relevant.`
          },
          context && {
            "role": "user",
            "content": `Context information:\n${contextPrompt}`
          },
          {
            "role": "user",
            "content": text
          }
        ].filter(Boolean),
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI API');
    }

    return { explanation: data.choices[0].message.content };
  } catch (error) {
    console.error('Explanation error:', error);
    return { 
      error: error.message || 'Explanation failed. Please try again.',
      details: error.stack
    };
  }
};

// Add language mapping
const languageNames = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese',
  hi: 'Hindi',
  ar: 'Arabic',
  tr: 'Turkish',
  vi: 'Vietnamese',
  th: 'Thai',
  nl: 'Dutch',
  pl: 'Polish',
  cs: 'Czech',
  sv: 'Swedish',
  da: 'Danish',
  fi: 'Finnish',
  el: 'Greek',
  he: 'Hebrew',
  id: 'Indonesian',
  ms: 'Malay',
  fa: 'Persian',
  ur: 'Urdu',
  bn: 'Bengali',
  ta: 'Tamil',
  te: 'Telugu',
  ml: 'Malayalam',
  kn: 'Kannada',
  mr: 'Marathi',
  gu: 'Gujarati',
  uk: 'Ukrainian',
  ro: 'Romanian',
  hu: 'Hungarian',
  no: 'Norwegian',
  sk: 'Slovak',
  bg: 'Bulgarian',
  hr: 'Croatian',
  sr: 'Serbian',
  si: 'Sinhala',
  my: 'Burmese',
  km: 'Khmer'
};

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'translate') {
    try {
      if (!tab.id) {
        throw new Error('Cannot access this page. Try a different page.');
      }

      // Get saved target language
      const { targetLanguage = 'en' } = await chrome.storage.sync.get('targetLanguage');
      
      // Get page context
      const [{ result: context }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => ({
          url: window.location.href,
          title: document.title,
          domain: window.location.hostname
        })
      });

      const result = await handleTranslate(info.selectionText, languageNames[targetLanguage], context);
      
      try {
        await sendMessageWithRetry(tab.id, {
          action: 'showTranslation',
          text: info.selectionText,
          targetLanguage,
          ...result
        });
      } catch (error) {
        console.error('Failed to send message to content script:', error);
        // Try to show error using alert as fallback
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: (errorMessage) => {
              alert(`Translation Error: ${errorMessage}`);
            },
            args: ['Failed to display translation. Please refresh the page and try again.']
          });
        } catch (scriptError) {
          console.error('Failed to show error message:', scriptError);
        }
      }
    } catch (error) {
      console.error('Error in translation process:', error);
      try {
        await sendMessageWithRetry(tab.id, {
          action: 'showError',
          error: error.message || 'An unexpected error occurred'
        });
      } catch (messageError) {
        // Fallback to alert if message fails
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: (errorMessage) => {
            alert(`Translation Error: ${errorMessage}`);
          },
          args: [error.message || 'An unexpected error occurred']
        });
      }
    }
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'translate') {
    handleTranslation(request.text, request.targetLang, request.context)
      .then(sendResponse)
      .catch(error => sendResponse({ error: error.message }));
    return true;
  } else if (request.action === 'explain') {
    handleExplain(request.text, request.targetLang, request.context)
      .then(sendResponse)
      .catch(error => sendResponse({ error: error.message }));
    return true;
  }
});

// Create context menu when extension is installed or updated
chrome.runtime.onInstalled.addListener(createContextMenu);

// Create context menu on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translateSelection",
    title: "Translate Selection",
    contexts: ["selection"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "translateSelection") {
    chrome.tabs.sendMessage(tab.id, {
      action: "translate",
      text: info.selectionText
    });
  }
}); 