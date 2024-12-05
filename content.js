let isInitialized = false;

const initialize = () => {
  if (isInitialized) return;
  
  // Add styles to document
  const style = document.createElement('style');
  style.textContent = `
    /* Base styles */
    #openai-translation-popup,
    #openai-translation-error {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 2147483647;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
      padding: 16px;
      max-width: 400px;
      width: calc(100vw - 40px);
      user-select: none;
      transition: none;
      direction: ltr !important;
    }

    .space-y-4 {
      direction: ltr !important;
    }

    .drag-handle {
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      cursor: grab !important;
      direction: ltr !important;
      text-align: left !important;
      gap: 8px !important;
      position: relative !important;
    }

    .language-select-wrapper {
      position: relative;
      width: 120px;
      direction: ltr !important;
      text-align: left !important;
    }
    
    .language-select {
      appearance: none;
      background: #f5f5f7;
      border: none;
      padding: 6px 24px 6px 12px;
      font-size: 12px;
      color: #1a1a1a;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
      width: 100%;
      direction: ltr !important;
      text-align: left !important;
    }

    .translation-content {
      max-height: 400px;
      overflow-y: auto;
      margin: 12px 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-right: 12px;
      margin-right: -4px;
      direction: ltr !important;
    }

    .text-content {
      font-size: 14px;
      line-height: 1.5;
      color: #1a1a1a;
      background: #f5f5f7;
      padding: 12px;
      border-radius: 12px;
      margin-bottom: 12px;
      font-weight: normal !important;
      text-align: left !important;
    }

    /* Only allow RTL for the translated text */
    .translation-content div:nth-child(2) .text-content[dir="rtl"] {
      text-align: right !important;
      font-weight: normal !important;
    }

    .close-button {
      padding: 0 !important;
      width: 24px !important;
      height: 24px !important;
      min-width: 24px !important;
      border-radius: 50% !important;
      border: none !important;
      background: transparent !important;
      color: #666 !important;
      cursor: pointer !important;
      transition: all 0.2s !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex-shrink: 0 !important;
      direction: ltr !important;
      position: relative !important;
      z-index: 1 !important;
    }
    
    .close-button svg {
      width: 16px !important;
      height: 16px !important;
      display: block !important;
      flex-shrink: 0 !important;
      position: relative !important;
      z-index: 1 !important;
    }
    
    .close-button:hover {
      background: rgba(0, 0, 0, 0.05) !important;
      color: #333 !important;
    }

    .label {
      font-size: 11px;
      font-weight: 500 !important;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #666;
      margin-bottom: 6px;
      text-align: left !important;
    }

    .draggable {
      /* cursor: move removed */
    }
    
    .draggable .language-select,
    .draggable button {
      cursor: pointer;
    }
    
    .draggable * {
      user-select: none;
    }

    #openai-translation-error {
      border-left: 4px solid #ef4444;
    }

    /* Animation */
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-slide-in {
      animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    
    /* Content styles */
    .translation-content {
      max-height: 400px;
      overflow-y: auto;
      margin: 12px 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-right: 12px;
      margin-right: -4px;
      direction: ltr;
    }
    
    .translation-content::-webkit-scrollbar {
      width: 6px;
    }
    
    .translation-content::-webkit-scrollbar-track {
      background: transparent;
      border-radius: 3px;
    }
    
    .translation-content::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.15);
      border-radius: 2px;
      &:hover {
        background-color: rgba(0, 0, 0, 0.25);
      }
    }
    
    /* Text styles */
    .label {
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #666;
      margin-bottom: 6px;
    }
    
    .text-content {
      font-size: 14px;
      line-height: 1.5;
      color: #1a1a1a;
      background: #f5f5f7;
      padding: 12px;
      border-radius: 12px;
      margin-bottom: 12px;
      unicode-bidi: plaintext;
    }
    
    /* Button styles */
    .close-button {
      padding: 0 !important;
      width: 24px !important;
      height: 24px !important;
      min-width: 24px !important;
      border-radius: 50% !important;
      border: none !important;
      background: transparent !important;
      color: #666 !important;
      cursor: pointer !important;
      transition: all 0.2s !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex-shrink: 0 !important;
      direction: ltr !important;
    }
    
    .close-button svg {
      width: 16px !important;
      height: 16px !important;
      display: block !important;
      flex-shrink: 0 !important;
    }
    
    .close-button:hover {
      background: rgba(0, 0, 0, 0.05) !important;
      color: #333 !important;
    }
    
    .copy-button {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 20px;
      border: none;
      background: #f5f5f7;
      color: #666;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .copy-button:hover {
      background: #eeeef0;
      color: #333;
    }
    
    .language-select-wrapper {
      position: relative;
      width: 120px;
    }
    
    .language-select {
      appearance: none;
      background: #f5f5f7;
      border: none;
      padding: 6px 24px 6px 12px;
      font-size: 12px;
      color: #1a1a1a;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
      width: 100%;
    }
    
    .language-select:hover {
      background: #eeeef0;
    }
    
    .language-select-wrapper::after {
      content: "";
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 4px solid #666;
      pointer-events: none;
    }
    
    .action-button,
    .copy-button {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 20px;
      border: none;
      background: #f5f5f7;
      color: #666;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .action-button:hover,
    .copy-button:hover {
      background: #eeeef0;
      color: #333;
    }
    
    .action-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .action-button.loading {
      background: #e5e7eb;
      cursor: not-allowed;
    }
    
    .action-button.loading:hover {
      background: #e5e7eb;
    }
    
    .explanation-section {
      border-top: 1px solid rgba(0, 0, 0, 0.06);
      padding-top: 16px;
      direction: ltr !important;
    }

    .explanation-section .text-content {
      direction: ltr !important;
      text-align: left !important;
    }

    .drag-handle {
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      cursor: grab !important;
      direction: ltr !important;
    }

    .text-section {
      position: relative;
      margin: 8px 0;
      padding: 8px;
      background: rgba(0, 0, 0, 0.03);
      border-radius: 6px;
      cursor: text;
    }

    .text-container {
      margin-right: 28px;
      white-space: pre-wrap;
      word-break: break-word;
      user-select: text;
    }

    .copy-button {
      position: absolute;
      top: 8px;
      right: 8px;
      padding: 4px;
      background: transparent;
      border: none;
      cursor: pointer;
      opacity: 0.6;
      transition: opacity 0.2s;
    }

    .copy-button:hover {
      opacity: 1;
    }

    .section-label {
      font-size: 12px;
      font-weight: 500;
      color: #666;
      margin-top: 12px;
      margin-bottom: 4px;
    }
  `;
  document.head.appendChild(style);
  
  isInitialized = true;
};

// Initialize when document is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

const showError = (message) => {
  const errorPopup = document.createElement('div');
  errorPopup.id = 'openai-translation-error';
  errorPopup.className = 'animate-slide-in';
  errorPopup.style.top = '20px';
  errorPopup.style.right = '20px';
  
  errorPopup.innerHTML = `
    <div style="display: flex; gap: 12px; align-items: flex-start;">
      <div>
        <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div style="flex: 1;">
        <p style="font-size: 14px; color: #1a1a1a;">${message}</p>
      </div>
    </div>
  `;

  document.body.appendChild(errorPopup);

  setTimeout(() => {
    if (errorPopup.parentNode) {
      errorPopup.classList.remove('animate-slide-in');
      errorPopup.style.animation = 'slideOut 0.2s ease-in forwards';
      setTimeout(() => errorPopup.remove(), 200);
    }
  }, 5000);
};

const isRTLLanguage = (lang) => {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  return rtlLanguages.includes(lang);
};

const createTranslationPopup = (text, translation) => {
  try {
    const existingPopup = document.getElementById('openai-translation-popup');
    if (existingPopup) {
      existingPopup.remove();
    }

    const popup = document.createElement('div');
    popup.id = 'openai-translation-popup';
    popup.className = 'animate-slide-in draggable';
    popup.style.top = '20px';
    popup.style.right = '20px';
    
    popup.innerHTML = `
      <div class="space-y-4">
        <div class="drag-handle">
          <div class="language-select-wrapper">
            <select id="targetLanguage" class="language-select">
              <option value="en">English</option>
              <option value="ar">Arabic</option>
              <option value="bn">Bengali</option>
              <option value="bg">Bulgarian</option>
              <option value="my">Burmese</option>
              <option value="zh">Chinese</option>
              <option value="hr">Croatian</option>
              <option value="cs">Czech</option>
              <option value="da">Danish</option>
              <option value="nl">Dutch</option>
              <option value="fi">Finnish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="el">Greek</option>
              <option value="gu">Gujarati</option>
              <option value="he">Hebrew</option>
              <option value="hi">Hindi</option>
              <option value="hu">Hungarian</option>
              <option value="id">Indonesian</option>
              <option value="it">Italian</option>
              <option value="ja">Japanese</option>
              <option value="kn">Kannada</option>
              <option value="km">Khmer</option>
              <option value="ko">Korean</option>
              <option value="ms">Malay</option>
              <option value="ml">Malayalam</option>
              <option value="mr">Marathi</option>
              <option value="no">Norwegian</option>
              <option value="fa">Persian</option>
              <option value="pl">Polish</option>
              <option value="pt">Portuguese</option>
              <option value="ro">Romanian</option>
              <option value="ru">Russian</option>
              <option value="sr">Serbian</option>
              <option value="si">Sinhala</option>
              <option value="sk">Slovak</option>
              <option value="es">Spanish</option>
              <option value="sv">Swedish</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
              <option value="th">Thai</option>
              <option value="tr">Turkish</option>
              <option value="uk">Ukrainian</option>
              <option value="ur">Urdu</option>
              <option value="vi">Vietnamese</option>
            </select>
          </div>
          <button id="closeTranslation" class="close-button" aria-label="Close">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="translation-content">
          <div>
            <p class="label">Original text</p>
            <p class="text-content">${text}</p>
          </div>
          <div>
            <p class="label">Translation</p>
            <p class="text-content">${translation}</p>
          </div>
          <div class="explanation-section" style="display: none;">
            <p class="label">Explanation</p>
            <p class="text-content explanation"></p>
          </div>
        </div>
        
        <div style="display: flex; justify-content: flex-end; gap: 8px;">
          <button id="explainButton" class="action-button">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Explain</span>
          </button>
          <button id="translateButton" class="action-button">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span>Translate</span>
          </button>
          <button id="copyTranslation" class="action-button">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            <span>Copy</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(popup);

    // Initialize drag functionality
    const initDrag = () => {
      let isDragging = false;
      let currentX;
      let currentY;
      let initialX;
      let initialY;
      let xOffset = 0;
      let yOffset = 0;
      
      const dragHandle = popup.querySelector('.drag-handle');
      
      const setTranslate = (xPos, yPos, el) => {
        el.style.left = `${xPos}px`;
        el.style.top = `${yPos}px`;
      };
      
      const getInitialOffset = (el) => {
        return {
          x: parseInt(el.style.left || '20', 10),
          y: parseInt(el.style.top || '20', 10)
        };
      };
      
      const constrainPosition = (x, y, el) => {
        const rect = el.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Constrain horizontal position
        if (x < 0) x = 0;
        if (x > viewportWidth - rect.width) x = viewportWidth - rect.width;
        
        // Constrain vertical position
        if (y < 0) y = 0;
        if (y > viewportHeight - rect.height) y = viewportHeight - rect.height;
        
        return { x, y };
      };
      
      const handleDragStart = (e) => {
        const isInteractive = e.target.closest('.language-select') || 
                            e.target.closest('button') || 
                            e.target.tagName.toLowerCase() === 'select' ||
                            e.target.tagName.toLowerCase() === 'button';
        
        if (isInteractive) {
          return;
        }
        
        const initialOffset = getInitialOffset(popup);
        xOffset = initialOffset.x;
        yOffset = initialOffset.y;
        
        if (e.type === "touchstart") {
          initialX = e.touches[0].clientX - xOffset;
          initialY = e.touches[0].clientY - yOffset;
        } else {
          initialX = e.clientX - xOffset;
          initialY = e.clientY - yOffset;
        }
        
        isDragging = true;
        dragHandle.style.cursor = 'grabbing';
      };
      
      const handleDragEnd = (e) => {
        isDragging = false;
        dragHandle.style.cursor = 'grab';
      };
      
      const handleDrag = (e) => {
        if (!isDragging) return;
        
        if (e.cancelable) {
          e.preventDefault();
          e.stopPropagation();
        }
        
        if (e.type === "touchmove") {
          currentX = e.touches[0].clientX - initialX;
          currentY = e.touches[0].clientY - initialY;
        } else {
          currentX = e.clientX - initialX;
          currentY = e.clientY - initialY;
        }
        
        const constrained = constrainPosition(currentX, currentY, popup);
        xOffset = constrained.x;
        yOffset = constrained.y;
        
        setTranslate(xOffset, yOffset, popup);
      };

      // Clean up any existing listeners
      dragHandle.removeEventListener('mousedown', handleDragStart);
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
      dragHandle.removeEventListener('touchstart', handleDragStart);
      document.removeEventListener('touchmove', handleDrag);
      document.removeEventListener('touchend', handleDragEnd);
      
      // Add event listeners
      dragHandle.addEventListener('mousedown', handleDragStart);
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleDragEnd);
      
      dragHandle.addEventListener('touchstart', handleDragStart);
      document.addEventListener('touchmove', handleDrag);
      document.addEventListener('touchend', handleDragEnd);
      
      // Set initial cursor style
      dragHandle.style.cursor = 'grab';
    };

    // Initialize drag functionality
    initDrag();

    // Set saved language and add change listener
    chrome.storage.sync.get('targetLanguage', ({ targetLanguage = 'en' }) => {
      const select = document.getElementById('targetLanguage');
      select.value = targetLanguage;
      
      // Apply RTL if needed for initial text
      const translationElement = popup.querySelector('.translation-content div:nth-child(2) .text-content');
      if (isRTLLanguage(targetLanguage)) {
        translationElement.style.direction = 'rtl';
        translationElement.style.textAlign = 'right';
      } else {
        translationElement.style.direction = 'ltr';
        translationElement.style.textAlign = 'left';
      }
      
      select.addEventListener('change', () => {
        chrome.storage.sync.set({ targetLanguage: select.value });
        
        // Update text direction when language changes
        const translationElement = popup.querySelector('.translation-content div:nth-child(2) .text-content');
        if (isRTLLanguage(select.value)) {
          translationElement.setAttribute('dir', 'rtl');
        } else {
          translationElement.setAttribute('dir', 'ltr');
        }
      });
    });

    // Add copy functionality
    document.getElementById('copyTranslation').addEventListener('click', () => {
      navigator.clipboard.writeText(translation).then(() => {
        const button = document.getElementById('copyTranslation');
        button.innerHTML = `
          <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span class="text-green-500">Copied!</span>
        `;
        setTimeout(() => {
          button.innerHTML = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            <span>Copy</span>
          `;
        }, 2000);
      });
    });

    document.getElementById('closeTranslation').addEventListener('click', () => {
      popup.classList.remove('animate-slide-in');
      popup.style.animation = 'slideOut 0.2s ease-in forwards';
      setTimeout(() => popup.remove(), 200);
    });

    // Add translate functionality
    document.getElementById('translateButton').addEventListener('click', async () => {
      const select = document.getElementById('targetLanguage');
      const button = document.getElementById('translateButton');
      const originalContent = button.innerHTML;
      const popup = document.getElementById('openai-translation-popup');
      const originalText = popup.querySelector('.translation-content div:first-child .text-content').textContent;
      
      try {
        button.classList.add('loading');
        button.disabled = true;
        
        const response = await chrome.runtime.sendMessage({
          action: 'translate',
          text: originalText,
          targetLanguage: select.value,
          context: {
            url: window.location.href,
            title: document.title,
            domain: window.location.hostname
          }
        });
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        const translationElement = popup.querySelector('.translation-content div:nth-child(2) .text-content');
        translationElement.textContent = response.translation;
        
        // Apply RTL if needed for new translation
        if (isRTLLanguage(select.value)) {
          translationElement.setAttribute('dir', 'rtl');
        } else {
          translationElement.setAttribute('dir', 'ltr');
        }
        
        button.innerHTML = originalContent;
        button.disabled = false;
        button.classList.remove('loading');
      } catch (error) {
        console.error('Translation error:', error);
        showError(error.message || 'Translation failed. Please try again.');
        button.innerHTML = originalContent;
        button.disabled = false;
        button.classList.remove('loading');
      }
    });

    // Add explain functionality
    document.getElementById('explainButton').addEventListener('click', async () => {
      const select = document.getElementById('targetLanguage');
      const button = document.getElementById('explainButton');
      const originalContent = button.innerHTML;
      const popup = document.getElementById('openai-translation-popup');
      const originalText = popup.querySelector('.translation-content div:first-child .text-content').textContent;
      
      // Collect context
      const pageContext = {
        url: window.location.href,
        title: document.title,
        domain: window.location.hostname
      };
      
      try {
        button.classList.add('loading');
        button.disabled = true;
        
        const response = await chrome.runtime.sendMessage({
          action: 'explain',
          text: originalText,
          targetLanguage: select.value,
          context: pageContext
        });
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        const explanationSection = popup.querySelector('.explanation-section');
        const explanationElement = explanationSection.querySelector('.text-content');
        explanationElement.textContent = response.explanation;
        explanationSection.style.display = 'block';
        
        button.innerHTML = originalContent;
        button.disabled = false;
        button.classList.remove('loading');
      } catch (error) {
        console.error('Explanation error:', error);
        showError(error.message || 'Explanation failed. Please try again.');
        button.innerHTML = originalContent;
        button.disabled = false;
        button.classList.remove('loading');
      }
    });
  } catch (error) {
    console.error('Error creating translation popup:', error);
    showError('Failed to display translation. Please try again.');
  }
};

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    initialize(); // Ensure initialization
    
    if (request.action === 'showTranslation') {
      if (request.error) {
        showError(request.error);
        return;
      }
      createTranslationPopup(request.text, request.translation);
      
      // Apply RTL if needed for initial translation
      const popup = document.getElementById('openai-translation-popup');
      const translationElement = popup.querySelector('.translation-content div:nth-child(2) .text-content');
      if (isRTLLanguage(request.targetLanguage)) {
        translationElement.setAttribute('dir', 'rtl');
      } else {
        translationElement.setAttribute('dir', 'ltr');
      }
      
      // Set the language dropdown to match
      const select = popup.querySelector('#targetLanguage');
      select.value = request.targetLanguage;
    } else if (request.action === 'showError') {
      showError(request.error);
    }
    // Send success response
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error handling message:', error);
    showError('An unexpected error occurred. Please refresh the page and try again.');
    // Send error response
    sendResponse({ error: error.message });
  }
  return true; // Keep the message channel open for async response
});

// Notify background script that content script is ready
const notifyReady = async () => {
  try {
    await chrome.runtime.sendMessage({ action: 'contentScriptReady' });
    console.log('Content script ready notification sent');
  } catch (error) {
    console.log('Content script ready notification failed:', error);
  }
};

// Try to notify multiple times
const retryNotifyReady = async (maxAttempts = 3) => {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await notifyReady();
      break;
    } catch (error) {
      console.log(`Retry ${i + 1} failed:`, error);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

retryNotifyReady();

function getPageContext(selectedText) {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  
  // Get parent paragraph or closest block element
  let container = range.commonAncestorContainer;
  while (container && container.nodeType === Node.TEXT_NODE) {
    container = container.parentElement;
  }
  
  // Get surrounding text (up to 200 characters before and after)
  let fullText = container.textContent || '';
  let selectedIndex = fullText.indexOf(selectedText);
  let start = Math.max(0, selectedIndex - 200);
  let end = Math.min(fullText.length, selectedIndex + selectedText.length + 200);
  let surroundingText = fullText.substring(start, end);

  // Get meta description if available
  const metaDescription = document.querySelector('meta[name="description"]')?.content || '';
  const metaKeywords = document.querySelector('meta[name="keywords"]')?.content || '';
  
  return {
    surroundingText,
    pageTitle: document.title,
    url: window.location.href,
    domain: window.location.hostname,
    metaDescription,
    metaKeywords,
    path: window.location.pathname
  };
}

function sendTranslationRequest(selectedText, targetLang) {
  const context = getPageContext(selectedText);
  chrome.runtime.sendMessage({
    action: 'translate',
    text: selectedText,
    targetLang,
    context
  }, handleResponse);
}

function sendExplainRequest(selectedText, targetLang) {
  const context = getPageContext(selectedText);
  chrome.runtime.sendMessage({
    action: 'explain',
    text: selectedText,
    targetLang,
    context
  }, handleResponse);
}

// Update click handlers to use the new functions
function handleTranslateClick() {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    sendTranslationRequest(selectedText, currentTargetLanguage);
  }
}

function handleExplainClick() {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    sendExplainRequest(selectedText, currentTargetLanguage);
  }
}

function makePopupDraggable(popup) {
  const header = popup.querySelector('.popup-header');
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;

  header.addEventListener('mousedown', e => {
    if (e.target.closest('.language-select') || e.target.closest('.action-button') || e.target.closest('.close-button')) {
      return;
    }
    isDragging = true;
    popup.style.cursor = 'grabbing';
    initialX = e.clientX - popup.offsetLeft;
    initialY = e.clientY - popup.offsetTop;
  });

  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    e.preventDefault();
    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;
    popup.style.left = currentX + 'px';
    popup.style.top = currentY + 'px';
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    popup.style.cursor = 'default';
  });
}

function createTextSection(text, className) {
  const section = document.createElement('div');
  section.className = `text-section ${className}`;
  
  const textElement = document.createElement('pre');
  textElement.className = 'selectable-text';
  textElement.textContent = text;
  
  section.appendChild(textElement);
  return section;
}

function updatePopupContent(response) {
  const popup = document.getElementById('aiTranslatePopup');
  if (!popup) return;

  const content = popup.querySelector('.popup-content');
  // Clear content
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }

  if (response.error) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = response.error;
    content.appendChild(errorDiv);
    return;
  }

  // Original text section
  const originalLabel = document.createElement('div');
  originalLabel.className = 'section-label';
  originalLabel.textContent = 'Original Text';
  content.appendChild(originalLabel);
  content.appendChild(createTextSection(window.getSelection().toString().trim(), 'original-text'));

  // Translation section
  if (response.translation) {
    const translationLabel = document.createElement('div');
    translationLabel.className = 'section-label';
    translationLabel.textContent = 'Translation';
    content.appendChild(translationLabel);
    content.appendChild(createTextSection(response.translation, 'translation-text'));
  }

  // Explanation section
  if (response.explanation) {
    const explanationLabel = document.createElement('div');
    explanationLabel.className = 'section-label';
    explanationLabel.textContent = 'Explanation';
    content.appendChild(explanationLabel);
    content.appendChild(createTextSection(response.explanation, 'explanation-text'));
  }
}

const styles = `
  .ai-translate-popup {
    position: fixed;
    z-index: 2147483647;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    width: 300px;
    max-height: 400px;
    overflow-y: auto;
    padding: 12px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: #333;
    direction: ltr !important;
  }

  .text-section {
    margin: 8px 0;
    padding: 8px;
    background: rgba(0, 0, 0, 0.03);
    border-radius: 6px;
  }

  .selectable-text {
    margin: 0;
    padding: 0;
    font-family: inherit;
    font-size: inherit;
    white-space: pre-wrap;
    word-break: break-word;
    background: none;
    border: none;
    cursor: text;
    user-select: text !important;
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
  }

  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    user-select: none;
    cursor: grab;
  }

  .language-select {
    flex: 1;
    margin-right: 8px;
    padding: 4px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }

  .button-group {
    display: flex;
    gap: 8px;
  }

  .action-button {
    padding: 4px 8px;
    border: none;
    border-radius: 4px;
    background: #007AFF;
    color: white;
    cursor: pointer;
    font-size: 12px;
  }

  .action-button:hover {
    background: #0056b3;
  }

  .close-button {
    padding: 4px 8px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 18px;
    color: #666;
  }

  .close-button:hover {
    color: #333;
  }

  .popup-content {
    position: relative;
    min-height: 50px;
  }

  .section-label {
    font-size: 12px;
    font-weight: 500;
    color: #666;
    margin-top: 12px;
    margin-bottom: 4px;
  }

  .loading-spinner {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .spinner {
    width: 24px;
    height: 24px;
    border: 2px solid #f3f3f3;
    border-top: 2px solid #007AFF;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .loading-text {
    font-size: 12px;
    color: #666;
  }

  .error {
    color: #dc3545;
    padding: 8px;
    border-radius: 4px;
    background: #f8d7da;
  }
`;
 