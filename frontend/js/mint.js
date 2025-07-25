// Mint Page JavaScript

let selectedFile = null;
let filePreview = null;

// Initialize mint page
async function loadMintPageData() {
    try {
        // Set up file upload functionality
        setupFileUpload();
        
        // Set up form validation
        setupFormValidation();
        
        // Set up preview updates
        setupPreviewUpdates();
        
        // Update preview with user info if connected
        updatePreviewWithUserInfo();
        
    } catch (error) {
        console.error('Error loading mint page data:', error);
    }
}

// File upload functionality
function setupFileUpload() {
    const fileUploadArea = document.getElementById('file-upload-area');
    const fileInput = document.getElementById('nft-file');
    const filePreview = document.getElementById('file-preview');
    const previewImage = document.getElementById('preview-image');
    
    if (fileUploadArea && fileInput) {
        // Click to upload
        fileUploadArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        // Drag and drop
        fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadArea.classList.add('drag-over');
        });
        
        fileUploadArea.addEventListener('dragleave', () => {
            fileUploadArea.classList.remove('drag-over');
        });
        
        fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileSelect(files[0]);
            }
        });
        
        // File input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
            }
        });
    }
}

function handleFileSelect(file) {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'video/mp4', 'video/webm', 'audio/mpeg', 'audio/wav', 'audio/ogg'];
    
    if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid file type (JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF)');
        return;
    }
    
    // Validate file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
        alert('File size must be less than 100MB');
        return;
    }
    
    selectedFile = file;
    
    // Show preview
    const fileUploadArea = document.getElementById('file-upload-area');
    const filePreview = document.getElementById('file-preview');
    const filePreviewImg = document.getElementById('file-preview-img');
    const previewImage = document.getElementById('preview-image');
    
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Update file preview
            if (filePreviewImg) {
                filePreviewImg.src = e.target.result;
            }
            
            // Update preview card
            if (previewImage) {
                // Clear the placeholder content and add the image
                previewImage.innerHTML = `<img src="${e.target.result}" alt="NFT Preview" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
            }
            
            fileUploadArea.style.display = 'none';
            filePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        // For non-image files, show a placeholder
        if (filePreviewImg) {
            filePreviewImg.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjNjM2NmYxIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RmlsZSBVcGxvYWRlZDwvdGV4dD4KPC9zdmc+Cg==";
        }
        
        if (previewImage) {
            previewImage.innerHTML = `<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjNjM2NmYxIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RmlsZSBVcGxvYWRlZDwvdGV4dD4KPC9zdmc+Cg==" alt="File Uploaded" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
        }
        
        fileUploadArea.style.display = 'none';
        filePreview.style.display = 'block';
    }
}

function removeFile() {
    selectedFile = null;
    const fileUploadArea = document.getElementById('file-upload-area');
    const filePreview = document.getElementById('file-preview');
    const filePreviewImg = document.getElementById('file-preview-img');
    const previewImage = document.getElementById('preview-image');
    
    fileUploadArea.style.display = 'block';
    filePreview.style.display = 'none';
    
    // Reset file preview
    if (filePreviewImg) {
        filePreviewImg.src = '';
    }
    
    // Reset preview card to placeholder
    if (previewImage) {
        previewImage.innerHTML = `
            <div class="preview-placeholder">
                <i class="fas fa-image"></i>
                <p>Upload a file to see preview</p>
            </div>
        `;
    }
}

// Form validation
function setupFormValidation() {
    const form = document.getElementById('mint-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Real-time validation
    const requiredFields = ['nft-name', 'nft-price'];
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', validateField);
            field.addEventListener('blur', validateField);
        }
    });
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    // Remove existing error styling
    field.classList.remove('error');
    
    // Validate based on field type
    switch (field.id) {
        case 'nft-name':
            if (value.length < 3) {
                field.classList.add('error');
                showFieldError(field, 'Name must be at least 3 characters');
            } else {
                clearFieldError(field);
            }
            break;
            
        case 'nft-price':
            const price = parseFloat(value);
            if (isNaN(price) || price < 0) {
                field.classList.add('error');
                showFieldError(field, 'Please enter a valid price');
            } else {
                clearFieldError(field);
            }
            break;
    }
}

function showFieldError(field, message) {
    // Remove existing error message
    clearFieldError(field);
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Preview updates
function setupPreviewUpdates() {
    const nameField = document.getElementById('nft-name');
    const descriptionField = document.getElementById('nft-description');
    const priceField = document.getElementById('nft-price');
    
    if (nameField) {
        nameField.addEventListener('input', updatePreview);
    }
    if (descriptionField) {
        descriptionField.addEventListener('input', updatePreview);
    }
    if (priceField) {
        priceField.addEventListener('input', updatePreview);
    }
}

function updatePreview() {
    const nameField = document.getElementById('nft-name');
    const descriptionField = document.getElementById('nft-description');
    const priceField = document.getElementById('nft-price');
    
    const previewName = document.getElementById('preview-name');
    const previewDescription = document.getElementById('preview-description');
    const previewPrice = document.getElementById('preview-price');
    
    if (previewName && nameField) {
        previewName.textContent = nameField.value || 'NFT Name';
    }
    
    if (previewDescription && descriptionField) {
        previewDescription.textContent = descriptionField.value || 'Description will appear here...';
    }
    
    if (previewPrice && priceField) {
        const price = priceField.value;
        previewPrice.textContent = price ? `${price} ETH` : '0 ETH';
    }
}

function updatePreviewWithUserInfo() {
    const { currentAccount, formatAddress } = window.web3Config;
    const previewCreator = document.getElementById('preview-creator');
    
    if (previewCreator && currentAccount) {
        previewCreator.textContent = formatAddress(currentAccount);
    } else if (previewCreator) {
        previewCreator.textContent = 'Your Address';
    }
}

// Form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    try {
        await mintNFT();
    } catch (error) {
        console.error('Error minting NFT:', error);
        window.web3Config.showError('Failed to mint NFT. Please try again.');
    }
}

function validateForm() {
    const nameField = document.getElementById('nft-name');
    const priceField = document.getElementById('nft-price');
    
    let isValid = true;
    
    // Check if file is selected
    if (!selectedFile) {
        alert('Please select a file to upload');
        isValid = false;
    }
    
    // Validate name
    if (!nameField.value.trim()) {
        nameField.classList.add('error');
        showFieldError(nameField, 'Name is required');
        isValid = false;
    }
    
    // Validate price
    const price = parseFloat(priceField.value);
    if (isNaN(price) || price < 0) {
        priceField.classList.add('error');
        showFieldError(priceField, 'Please enter a valid price');
        isValid = false;
    }
    
    return isValid;
}

// Mint NFT function
async function mintNFT() {
    let { nftContract, web3, showLoading, hideLoading, showSuccess, showError, initializeContracts } = window.web3Config;
    
    // Get current wallet address reliably
    const currentAccount = await getCurrentWalletAddress();
    
    if (!currentAccount) {
        showError('Please connect your wallet first');
        return;
    }
    
    // Check if web3 is available
    if (!web3) {
        console.error('Web3 is not available');
        showError('Web3 is not available. Please refresh the page and try again.');
        return;
    }
    
    // Try to reinitialize contracts if not available
    if (!nftContract) {
        console.log('NFT contract not available, trying to reinitialize...');
        
        // Test contract connection
        const contractWorking = await testContractConnection();
        
        if (!contractWorking) {
            console.error('Contract connection test failed');
            showError('NFT contract not available. Please refresh the page and try again.');
            return;
        }
        
        // Update nftContract reference
        nftContract = window.web3Config.nftContract;
    }
    
    showLoading();
    
    try {
        // Get form data
        const name = document.getElementById('nft-name').value;
        const description = document.getElementById('nft-description').value;
        const price = document.getElementById('nft-price').value;
        
        // Create metadata
        const metadata = {
            name: name,
            description: description,
            image: '', // This would be set after uploading to IPFS
            attributes: []
        };
        
        // Add properties if any
        const propertyTypes = document.querySelectorAll('.property-type');
        const propertyValues = document.querySelectorAll('.property-value');
        
        for (let i = 0; i < propertyTypes.length; i++) {
            if (propertyTypes[i].value && propertyValues[i].value) {
                metadata.attributes.push({
                    trait_type: propertyTypes[i].value,
                    value: propertyValues[i].value
                });
            }
        }
        
        // In a real app, you would upload the file to IPFS here
        // For demo purposes, we'll use a placeholder URI
        const tokenURI = `ipfs://placeholder/${Date.now()}`;
        
        // Convert price to wei
        const priceInWei = web3.utils.toWei(price, 'ether');
        
        // Call smart contract
        const result = await nftContract.methods.mintNFT(tokenURI, priceInWei).send({
            from: currentAccount
        });
        
        hideLoading();
        
        // Show success modal
        showSuccessModal(result);
        
        // Reset form
        resetForm();
        
    } catch (error) {
        console.error('Error minting NFT:', error);
        hideLoading();
        showError('Failed to mint NFT. Please try again.');
    }
}

// Success modal
function showSuccessModal(result) {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function viewNFT() {
    // In a real app, this would navigate to the NFT detail page
    alert('NFT detail page would be shown here');
    closeSuccessModal();
}

function createAnother() {
    closeSuccessModal();
    resetForm();
}

function closeSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Form reset
function resetForm() {
    // Reset file upload
    removeFile();
    
    // Reset form fields
    const form = document.getElementById('mint-form');
    if (form) {
        form.reset();
    }
    
    // Reset preview
    updatePreview();
    
    // Clear properties
    const propertiesContainer = document.querySelector('.properties-container');
    if (propertiesContainer) {
        propertiesContainer.innerHTML = `
            <div class="property-item">
                <input type="text" placeholder="Trait type" class="property-type">
                <input type="text" placeholder="Value" class="property-value">
                <button type="button" class="add-property" onclick="addProperty()">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        `;
    }
}

// Properties functionality
function addProperty() {
    const propertiesContainer = document.querySelector('.properties-container');
    if (propertiesContainer) {
        const propertyItem = document.createElement('div');
        propertyItem.className = 'property-item';
        propertyItem.innerHTML = `
            <input type="text" placeholder="Trait type" class="property-type">
            <input type="text" placeholder="Value" class="property-value">
            <button type="button" class="remove-property" onclick="removeProperty(this)">
                <i class="fas fa-minus"></i>
            </button>
        `;
        propertiesContainer.appendChild(propertyItem);
    }
}

function removeProperty(button) {
    const propertyItem = button.closest('.property-item');
    if (propertyItem) {
        propertyItem.remove();
    }
}

// Save draft functionality
function saveDraft() {
    const formData = {
        name: document.getElementById('nft-name').value,
        description: document.getElementById('nft-description').value,
        price: document.getElementById('nft-price').value,
        collection: document.getElementById('nft-collection').value,
        category: document.getElementById('nft-category').value,
        supply: document.getElementById('nft-supply').value,
        royalties: document.getElementById('nft-royalties').value
    };
    
    localStorage.setItem('nft-draft', JSON.stringify(formData));
    alert('Draft saved successfully!');
}

// Load draft functionality
function loadDraft() {
    const draft = localStorage.getItem('nft-draft');
    if (draft) {
        const formData = JSON.parse(draft);
        
        document.getElementById('nft-name').value = formData.name || '';
        document.getElementById('nft-description').value = formData.description || '';
        document.getElementById('nft-price').value = formData.price || '';
        document.getElementById('nft-collection').value = formData.collection || '';
        document.getElementById('nft-category').value = formData.category || '';
        document.getElementById('nft-supply').value = formData.supply || '1';
        document.getElementById('nft-royalties').value = formData.royalties || '';
        
        updatePreview();
    }
}

// Initialize mint page
document.addEventListener('DOMContentLoaded', function() {
    // Load draft if exists
    loadDraft();
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Close modals when clicking close button
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
});

// Get current wallet address reliably
async function getCurrentWalletAddress() {
    try {
        // First try web3Config
        if (window.web3Config?.currentAccount) {
            return window.web3Config.currentAccount;
        }
        
        // Then try ethereum provider
        if (window.ethereum?.selectedAddress) {
            return window.ethereum.selectedAddress;
        }
        
        // Finally try to request accounts
        if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts && accounts.length > 0) {
                return accounts[0];
            }
        }
        
        return null;
    } catch (error) {
        console.error('Error getting wallet address:', error);
        return null;
    }
}

// Test contract connection
async function testContractConnection() {
    console.log('Testing contract connection...');
    
    try {
        // Force initialize contracts
        const contracts = await window.web3Config.forceInitializeContracts();
        
        if (contracts.nftContract) {
            console.log('NFT contract is available');
            
            // Test a simple call
            try {
                const totalSupply = await contracts.nftContract.methods.getTotalSupply().call();
                console.log('NFT contract is working! Total supply:', totalSupply);
                return true;
            } catch (error) {
                console.error('NFT contract call failed:', error);
                return false;
            }
        } else {
            console.log('NFT contract is not available');
            return false;
        }
    } catch (error) {
        console.error('Contract connection test failed:', error);
        return false;
    }
}

// Export functions for global access
window.mintFunctions = {
    loadMintPageData,
    handleFileSelect,
    removeFile,
    addProperty,
    removeProperty,
    saveDraft,
    loadDraft,
    viewNFT,
    createAnother,
    closeSuccessModal,
    getCurrentWalletAddress
};

// Also export the main function directly for web3-config.js
window.loadMintPageData = loadMintPageData; 