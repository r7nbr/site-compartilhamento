// Configurações da API
const API_BASE_URL = '/api';

// Elementos DOM
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const progressContainer = document.getElementById('progressContainer');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const filesContainer = document.getElementById('filesContainer');
const refreshBtn = document.getElementById('refreshBtn');
const loading = document.getElementById('loading');
const toastContainer = document.getElementById('toastContainer');
const fileModal = document.getElementById('fileModal');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

// Estado da aplicação
let isUploading = false;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadFiles();
});

// Event Listeners
function initializeEventListeners() {
    // Upload area events
    uploadArea.addEventListener('click', () => {
        if (!isUploading) {
            fileInput.click();
        }
    });

    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);

    // File input change
    fileInput.addEventListener('change', handleFileSelect);

    // Upload button
    uploadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isUploading) {
            fileInput.click();
        }
    });

    // Refresh button
    refreshBtn.addEventListener('click', loadFiles);

    // Modal events
    modalClose.addEventListener('click', closeModal);
    fileModal.addEventListener('click', (e) => {
        if (e.target === fileModal) {
            closeModal();
        }
    });

    // Keyboard events
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Drag and Drop handlers
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    if (isUploading) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        uploadFiles(files);
    }
}

// File selection handler
function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        uploadFiles(files);
    }
}

// Upload files
async function uploadFiles(files) {
    if (isUploading) return;
    
    isUploading = true;
    showProgress();
    
    const totalFiles = files.length;
    let uploadedFiles = 0;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        try {
            await uploadSingleFile(file);
            successCount++;
            showToast(`Arquivo "${file.name}" enviado com sucesso!`, 'success');
        } catch (error) {
            errorCount++;
            showToast(`Erro ao enviar "${file.name}": ${error.message}`, 'error');
        }
        
        uploadedFiles++;
        updateProgress((uploadedFiles / totalFiles) * 100);
    }

    // Finalizar upload
    setTimeout(() => {
        hideProgress();
        isUploading = false;
        fileInput.value = '';
        
        if (successCount > 0) {
            loadFiles(); // Recarregar lista de arquivos
        }
        
        // Mostrar resumo
        if (totalFiles > 1) {
            const message = `Upload concluído: ${successCount} sucesso(s), ${errorCount} erro(s)`;
            showToast(message, errorCount > 0 ? 'warning' : 'success');
        }
    }, 500);
}

// Upload single file
async function uploadSingleFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro no upload');
    }

    return await response.json();
}

// Progress functions
function showProgress() {
    progressContainer.style.display = 'block';
    updateProgress(0);
}

function hideProgress() {
    progressContainer.style.display = 'none';
}

function updateProgress(percentage) {
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${Math.round(percentage)}%`;
}

// Load files
async function loadFiles() {
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/files`);
        
        if (!response.ok) {
            throw new Error('Erro ao carregar arquivos');
        }
        
        const data = await response.json();
        displayFiles(data.files);
        
    } catch (error) {
        showToast(`Erro ao carregar arquivos: ${error.message}`, 'error');
        showEmptyState('Erro ao carregar arquivos');
    } finally {
        hideLoading();
    }
}

// Display files
function displayFiles(files) {
    if (!files || files.length === 0) {
        showEmptyState();
        return;
    }

    const filesHTML = files.map(file => createFileHTML(file)).join('');
    filesContainer.innerHTML = filesHTML;
    
    // Adicionar event listeners para os botões
    addFileEventListeners();
}

// Create file HTML
function createFileHTML(file) {
    const fileIcon = getFileIcon(file.type);
    const uploadDate = new Date(file.upload_date).toLocaleString('pt-BR');
    
    return `
        <div class="file-item fade-in" data-file-id="${file.id}">
            <div class="file-icon">
                <i class="${fileIcon}"></i>
            </div>
            <div class="file-info">
                <div class="file-name">${file.filename}</div>
                <div class="file-details">
                    ${file.size_formatted} • ${uploadDate}
                </div>
            </div>
            <div class="file-actions">
                <button class="action-btn download-btn" onclick="downloadFile('${file.id}', '${file.filename}')">
                    <i class="fas fa-download"></i> Download
                </button>
                <button class="action-btn info-btn" onclick="showFileInfo('${file.id}')">
                    <i class="fas fa-info-circle"></i> Info
                </button>
                <button class="action-btn delete-btn" onclick="deleteFile('${file.id}', '${file.filename}')">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        </div>
    `;
}

// Get file icon based on type
function getFileIcon(fileType) {
    const iconMap = {
        'pdf': 'fas fa-file-pdf',
        'doc': 'fas fa-file-word',
        'docx': 'fas fa-file-word',
        'txt': 'fas fa-file-alt',
        'jpg': 'fas fa-file-image',
        'jpeg': 'fas fa-file-image',
        'png': 'fas fa-file-image',
        'gif': 'fas fa-file-image',
        'mp3': 'fas fa-file-audio',
        'mp4': 'fas fa-file-video',
        'avi': 'fas fa-file-video',
        'zip': 'fas fa-file-archive',
        'rar': 'fas fa-file-archive'
    };
    
    return iconMap[fileType.toLowerCase()] || 'fas fa-file';
}

// Add event listeners to file buttons
function addFileEventListeners() {
    // Os event listeners são adicionados inline no HTML para simplicidade
    // Em uma aplicação maior, seria melhor usar delegação de eventos
}

// Download file
async function downloadFile(fileId, filename) {
    try {
        const response = await fetch(`${API_BASE_URL}/download/${fileId}`);
        
        if (!response.ok) {
            throw new Error('Erro ao baixar arquivo');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showToast(`Arquivo "${filename}" baixado com sucesso!`, 'success');
        
    } catch (error) {
        showToast(`Erro ao baixar arquivo: ${error.message}`, 'error');
    }
}

// Delete file
async function deleteFile(fileId, filename) {
    if (!confirm(`Tem certeza que deseja excluir o arquivo "${filename}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/delete/${fileId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao excluir arquivo');
        }
        
        showToast(`Arquivo "${filename}" excluído com sucesso!`, 'success');
        loadFiles(); // Recarregar lista
        
    } catch (error) {
        showToast(`Erro ao excluir arquivo: ${error.message}`, 'error');
    }
}

// Show file info
async function showFileInfo(fileId) {
    try {
        const response = await fetch(`${API_BASE_URL}/info/${fileId}`);
        
        if (!response.ok) {
            throw new Error('Erro ao obter informações do arquivo');
        }
        
        const data = await response.json();
        const file = data.file;
        
        const uploadDate = new Date(file.upload_date).toLocaleString('pt-BR');
        const fileIcon = getFileIcon(file.type);
        
        modalTitle.textContent = 'Informações do Arquivo';
        modalBody.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <i class="${fileIcon}" style="font-size: 4rem; color: #667eea;"></i>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px;">
                <p><strong>Nome:</strong> ${file.filename}</p>
                <p><strong>Tamanho:</strong> ${file.size_formatted} (${file.size.toLocaleString()} bytes)</p>
                <p><strong>Tipo:</strong> ${file.type.toUpperCase()}</p>
                <p><strong>Data de Upload:</strong> ${uploadDate}</p>
                <p><strong>ID:</strong> ${file.id}</p>
            </div>
            <div style="margin-top: 20px; text-align: center;">
                <button class="action-btn download-btn" onclick="downloadFile('${file.id}', '${file.filename}'); closeModal();" style="margin-right: 10px;">
                    <i class="fas fa-download"></i> Download
                </button>
                <button class="action-btn delete-btn" onclick="deleteFile('${file.id}', '${file.filename}'); closeModal();">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        `;
        
        openModal();
        
    } catch (error) {
        showToast(`Erro ao obter informações: ${error.message}`, 'error');
    }
}

// Modal functions
function openModal() {
    fileModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    fileModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Loading functions
function showLoading() {
    loading.style.display = 'block';
    filesContainer.innerHTML = '';
    filesContainer.appendChild(loading);
}

function hideLoading() {
    loading.style.display = 'none';
}

// Empty state
function showEmptyState(message = 'Nenhum arquivo encontrado') {
    filesContainer.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-folder-open"></i>
            <h3>${message}</h3>
            <p>Faça upload de alguns arquivos para começar!</p>
        </div>
    `;
}

// Toast notifications
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconMap = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'warning': 'fas fa-exclamation-triangle'
    };
    
    toast.innerHTML = `
        <div class="toast-content">
            <i class="toast-icon ${iconMap[type]}"></i>
            <span>${message}</span>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        }
    }, 5000);
}

// Utility functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
}

// Add CSS animation for slide out
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

