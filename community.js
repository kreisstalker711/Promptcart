// API Base URL - Change this to your server URL in production
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : '/api';

// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const uploadForm = document.getElementById('uploadForm');
const promptsGrid = document.getElementById('promptsGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const toast = document.getElementById('toast');
const viewModal = document.getElementById('viewModal');
const modalClose = document.getElementById('modalClose');
const emptyState = document.getElementById('emptyState');

let allPrompts = [];
let currentPromptData = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadPrompts();
    setupEventListeners();
    hideLoader();
});

// Setup Event Listeners
function setupEventListeners() {
    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Close sidebar on outside click (mobile)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });

    // Form submission
    uploadForm.addEventListener('submit', handleFormSubmit);

    // Search and filter
    searchInput.addEventListener('input', filterPrompts);
    categoryFilter.addEventListener('change', filterPrompts);

    // Modal close
    modalClose.addEventListener('click', closeModal);
    viewModal.addEventListener('click', (e) => {
        if (e.target === viewModal) {
            closeModal();
        }
    });
}

// Handle Form Submission
async function handleFormSubmit(e) {
    e.preventDefault();

    const formData = {
        title: document.getElementById('promptTitle').value.trim(),
        description: document.getElementById('promptDesc').value.trim(),
        category: document.getElementById('promptCategory').value,
        tags: document.getElementById('promptTags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag !== ''),
        author: document.getElementById('promptAuthor').value.trim(),
        content: document.getElementById('promptContent').value.trim()
    };

    try {
        const response = await fetch(`${API_URL}/prompts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Failed to upload prompt');
        }

        const result = await response.json();
        
        showToast('✅ Prompt shared successfully!');
        uploadForm.reset();
        loadPrompts(); // Reload prompts
    } catch (error) {
        console.error('Error uploading prompt:', error);
        showToast('❌ Failed to share prompt. Please try again.');
    }
}

// Load Prompts from Backend
async function loadPrompts() {
    try {
        const response = await fetch(`${API_URL}/prompts`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch prompts');
        }

        allPrompts = await response.json();
        renderPrompts(allPrompts);
    } catch (error) {
        console.error('Error loading prompts:', error);
        promptsGrid.innerHTML = '';
        emptyState.style.display = 'block';
    }
}

// Render Prompts
function renderPrompts(prompts) {
    promptsGrid.innerHTML = '';

    if (prompts.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    prompts.forEach(prompt => {
        const card = createPromptCard(prompt);
        promptsGrid.appendChild(card);
    });
}

// Create Prompt Card
function createPromptCard(prompt) {
    const card = document.createElement('div');
    card.className = 'prompt-card';
    card.setAttribute('data-category', prompt.category);

    // Check if user has upvoted this prompt
    const upvotedPrompts = JSON.parse(localStorage.getItem('upvotedPrompts') || '[]');
    const isUpvoted = upvotedPrompts.includes(prompt._id);

    card.innerHTML = `
        <div class="prompt-category">${prompt.category}</div>
        <h3 class="prompt-title">${escapeHtml(prompt.title)}</h3>
        <p class="prompt-desc">${escapeHtml(prompt.description)}</p>
        <div class="prompt-tags">
            ${prompt.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
        </div>
        <div class="prompt-meta">
            <span class="author">👤 ${escapeHtml(prompt.author)}</span>
            <span class="upvotes">👍 <span class="upvote-count">${prompt.upvotes}</span></span>
        </div>
        <div class="prompt-actions">
            <button class="btn btn-upvote ${isUpvoted ? 'upvoted' : ''}" data-id="${prompt._id}">
                ${isUpvoted ? '👍' : '👍'}
            </button>
            <button class="btn btn-copy" data-content="${escapeHtml(prompt.content)}">
                📋 Copy
            </button>
            <button class="btn btn-view" data-id="${prompt._id}">
                👁️ View
            </button>
        </div>
    `;

    // Add event listeners
    const upvoteBtn = card.querySelector('.btn-upvote');
    const copyBtn = card.querySelector('.btn-copy');
    const viewBtn = card.querySelector('.btn-view');

    upvoteBtn.addEventListener('click', () => handleUpvote(prompt._id, upvoteBtn));
    copyBtn.addEventListener('click', () => handleCopy(prompt.content));
    viewBtn.addEventListener('click', () => handleView(prompt));

    return card;
}

// Handle Upvote
async function handleUpvote(promptId, btn) {
    const upvotedPrompts = JSON.parse(localStorage.getItem('upvotedPrompts') || '[]');
    
    if (upvotedPrompts.includes(promptId)) {
        showToast('You already upvoted this prompt!');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/prompts/${promptId}/upvote`, {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error('Failed to upvote');
        }

        const result = await response.json();

        // Update UI
        const upvoteCount = btn.closest('.prompt-card').querySelector('.upvote-count');
        upvoteCount.textContent = result.upvotes;
        btn.classList.add('upvoted');

        // Save to localStorage
        upvotedPrompts.push(promptId);
        localStorage.setItem('upvotedPrompts', JSON.stringify(upvotedPrompts));

        showToast('👍 Upvoted!');
    } catch (error) {
        console.error('Error upvoting:', error);
        showToast('Failed to upvote. Please try again.');
    }
}

// Handle Copy
async function handleCopy(content) {
    try {
        await navigator.clipboard.writeText(content);
        showToast('📋 Prompt copied to clipboard!');
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = content;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showToast('📋 Prompt copied to clipboard!');
        } catch (err) {
            showToast('Failed to copy. Please try again.');
        }
        document.body.removeChild(textArea);
    }
}

// Handle View Full Prompt
function handleView(prompt) {
    document.getElementById('modalTitle').textContent = prompt.title;
    document.getElementById('modalCategory').textContent = prompt.category;
    document.getElementById('modalDesc').textContent = prompt.description;
    document.getElementById('modalAuthor').textContent = `👤 ${prompt.author}`;
    document.getElementById('modalUpvotes').textContent = `👍 ${prompt.upvotes}`;
    document.getElementById('modalContent').textContent = prompt.content;

    // Render tags
    const tagsContainer = document.getElementById('modalTags');
    tagsContainer.innerHTML = prompt.tags
        .map(tag => `<span class="tag">${escapeHtml(tag)}</span>`)
        .join('');

    // Set category color
    const modalCategory = document.getElementById('modalCategory');
    modalCategory.className = 'prompt-category';
    
    viewModal.classList.add('active');
}

// Close Modal
function closeModal() {
    viewModal.classList.remove('active');
}

// Filter Prompts
function filterPrompts() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filtered = allPrompts.filter(prompt => {
        const matchesSearch = 
            prompt.title.toLowerCase().includes(searchTerm) ||
            prompt.description.toLowerCase().includes(searchTerm) ||
            prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm));

        const matchesCategory = 
            selectedCategory === 'all' || 
            prompt.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    renderPrompts(filtered);
}

// Show Toast Notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Hide Loader
function hideLoader() {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    }, 1500);
}