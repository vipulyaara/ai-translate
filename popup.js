const handleSave = async () => {
  const apiKey = document.getElementById('apiKey').value;
  
  if (!apiKey) {
    // Show error state
    const input = document.getElementById('apiKey');
    input.classList.add('border-red-500', 'focus:ring-red-500');
    input.classList.remove('border-gray-200', 'focus:ring-indigo-500');
    
    // Shake animation
    input.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
      input.style.animation = '';
    }, 500);
    return;
  }

  const saveButton = document.getElementById('saveButton');
  const originalContent = saveButton.innerHTML;
  
  try {
    // Show loading state
    saveButton.disabled = true;
    saveButton.innerHTML = `
      <div class="flex items-center justify-center space-x-2">
        <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Saving...</span>
      </div>
    `;

    await chrome.storage.sync.set({ apiKey });
    
    // Show success state
    saveButton.classList.remove('from-indigo-500', 'to-indigo-600', 'hover:from-indigo-600', 'hover:to-indigo-700');
    saveButton.classList.add('from-green-500', 'to-green-600', 'hover:from-green-600', 'hover:to-green-700');
    saveButton.innerHTML = `
      <span style="font-size: 13px;">Saved</span>
    `;

    // Reset button after 2 seconds
    setTimeout(() => {
      saveButton.disabled = false;
      saveButton.classList.remove('from-green-500', 'to-green-600', 'hover:from-green-600', 'hover:to-green-700');
      saveButton.classList.add('from-indigo-500', 'to-indigo-600', 'hover:from-indigo-600', 'hover:to-indigo-700');
      saveButton.innerHTML = `Save API Key`;
    }, 2000);
  } catch (error) {
    console.error('Error saving API key:', error);
    saveButton.innerHTML = `
      <span>Error Saving</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    `;
    saveButton.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
    saveButton.classList.add('bg-red-600', 'hover:bg-red-700');
  }
};

const handleToggleVisibility = () => {
  const input = document.getElementById('apiKey');
  const button = document.getElementById('toggleVisibility');
  
  if (input.type === 'password') {
    input.type = 'text';
    button.textContent = 'Hide';
    button.classList.add('text-indigo-600');
    button.classList.remove('text-gray-400');
  } else {
    input.type = 'password';
    button.textContent = 'Show';
    button.classList.remove('text-indigo-600');
    button.classList.add('text-gray-400');
  }
};

const handleLoad = async () => {
  const { apiKey } = await chrome.storage.sync.get('apiKey');
  if (apiKey) {
    document.getElementById('apiKey').value = apiKey;
  }
  
  // Add input validation
  const input = document.getElementById('apiKey');
  input.addEventListener('input', () => {
    input.classList.remove('border-red-500', 'focus:ring-red-500');
    input.classList.add('border-gray-200', 'focus:ring-indigo-500');
  });
};

// Add shake animation
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', handleLoad);
document.getElementById('saveButton').addEventListener('click', handleSave);
document.getElementById('toggleVisibility').addEventListener('click', handleToggleVisibility); 