// Explore Page JavaScript

// Real-time NFT data
let currentNFTs = [];
let filteredNFTs = [];
let displayedNFTs = [];
let currentPage = 0;
const NFTsPerPage = 12;

// Load explore page data
async function loadExplorePageData() {
    try {
        // Load NFTs from blockchain if available
        await loadNFTsFromBlockchain();
        
        // Display NFTs
        displayNFTs(filteredNFTs);
        
        // Update results count
        updateResultsCount();
        
    } catch (error) {
        console.error('Error loading explore page data:', error);
        // Use demo data as fallback
        displayNFTs(filteredNFTs);
        updateResultsCount();
    }
}

// Load NFTs from blockchain
async function loadNFTsFromBlockchain() {
    try {
        const { marketplaceContract, nftContract } = window.web3Config;
        
        if (marketplaceContract && nftContract) {
            const marketItems = await marketplaceContract.methods.fetchMarketItems().call();
            
            // Convert blockchain data to our format
            const blockchainNFTs = [];
            
            for (let item of marketItems) {
                if (!item.sold) {
                    const tokenInfo = await nftContract.methods.getTokenInfo(item.tokenId).call();
                    
                    blockchainNFTs.push({
                        id: item.itemId,
                        name: `NFT #${item.tokenId}`,
                        creator: window.web3Config.formatAddress(tokenInfo.creator),
                        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDI4MCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyODAiIGhlaWdodD0iMjgwIiBmaWxsPSIjNjM2NmYxIi8+Cjx0ZXh0IHg9IjE0MCIgeT0iMTQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TkZUIE5vLiAke2l0ZW0udG9rZW5JZH08L3RleHQ+Cjwvc3ZnPgo=",
                        price: window.web3Config.formatPrice(item.price),
                        likes: Math.floor(Math.random() * 200) + 50,
                        category: "art",
                        listed: true,
                        hasOffers: Math.random() > 0.5,
                        blockchainData: item
                    });
                }
            }
            
            currentNFTs = blockchainNFTs;
            filteredNFTs = [...blockchainNFTs];
            
        } else {
            // Show empty state if contracts not available
            currentNFTs = [];
            filteredNFTs = [];
        }
        
    } catch (error) {
        console.error('Error loading NFTs from blockchain:', error);
        // Show empty state on error
        currentNFTs = [];
        filteredNFTs = [];
    }
}

// Display NFTs in grid
function displayNFTs(nfts) {
    const container = document.getElementById('nfts-grid');
    if (!container) return;
    
    // Reset pagination when displaying new NFTs
    currentPage = 0;
    displayedNFTs = [];
    
    if (nfts.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No NFTs found</h3>
                <p>Try adjusting your filters or search terms</p>
            </div>
        `;
        return;
    }
    
    // Display first page
    displayNextPage();
}

// Update results count
function updateResultsCount() {
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        const totalCount = filteredNFTs.length;
        const displayedCount = displayedNFTs.length;
        resultsCount.textContent = `${displayedCount} of ${totalCount} items`;
    }
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    
    filteredNFTs = currentNFTs.filter(nft => 
        nft.name.toLowerCase().includes(searchTerm) ||
        nft.creator.toLowerCase().includes(searchTerm)
    );
    
    displayNFTs(filteredNFTs);
    updateResultsCount();
}

// Filter functionality
function setupFilters() {
    // Sort filter
    const sortFilter = document.getElementById('sort-select');
    if (sortFilter) {
        sortFilter.addEventListener('change', handleSort);
    }
    
    // Category filter
    const categoryFilter = document.getElementById('category-select');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', handleCategoryFilter);
    }
    
    // Price filters
    const minPrice = document.getElementById('min-price');
    const maxPrice = document.getElementById('max-price');
    
    if (minPrice) {
        minPrice.addEventListener('input', debounce(handlePriceFilter, 300));
    }
    if (maxPrice) {
        maxPrice.addEventListener('input', debounce(handlePriceFilter, 300));
    }
    
    // Price range slider
    const priceRange = document.getElementById('price-range');
    if (priceRange) {
        priceRange.addEventListener('input', handlePriceRange);
    }
}

function handleSort(event) {
    const sortBy = event.target.value;
    
    switch (sortBy) {
        case 'price-low':
            filteredNFTs.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            break;
        case 'price-high':
            filteredNFTs.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            break;
        case 'most-viewed':
            filteredNFTs.sort((a, b) => b.likes - a.likes);
            break;
        case 'recently-listed':
        default:
            // Keep original order for recently listed
            break;
    }
    
    displayNFTs(filteredNFTs);
}

function handleCategoryFilter(event) {
    const category = event.target.value;
    
    if (category === 'all') {
        filteredNFTs = [...currentNFTs];
    } else {
        filteredNFTs = currentNFTs.filter(nft => nft.category === category);
    }
    
    displayNFTs(filteredNFTs);
    updateResultsCount();
}

function handlePriceFilter() {
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;
    
    filteredNFTs = currentNFTs.filter(nft => {
        const price = parseFloat(nft.price);
        return price >= minPrice && price <= maxPrice;
    });
    
    displayNFTs(filteredNFTs);
    updateResultsCount();
}

function handlePriceRange(event) {
    const value = event.target.value;
    const priceValue = document.getElementById('price-value');
    if (priceValue) {
        priceValue.textContent = value + ' ETH';
    }
    
    // Apply price filter
    handlePriceFilter();
}

// Apply sidebar filters
function applyFilters() {
    const buyNowChecked = document.querySelector('input[value="buy-now"]').checked;
    const hasOffersChecked = document.querySelector('input[value="has-offers"]').checked;
    const newChecked = document.querySelector('input[value="new"]').checked;
    
    filteredNFTs = currentNFTs.filter(nft => {
        let passes = true;
        
        if (buyNowChecked && !nft.listed) passes = false;
        if (hasOffersChecked && !nft.hasOffers) passes = false;
        if (newChecked && nft.likes > 100) passes = false; // Simple logic for "new"
        
        return passes;
    });
    
    displayNFTs(filteredNFTs);
    updateResultsCount();
}

function clearFilters() {
    // Reset all filter inputs
    const filterInputs = document.querySelectorAll('.filter-group input');
    filterInputs.forEach(input => {
        if (input.type === 'checkbox') {
            input.checked = false;
        } else {
            input.value = '';
        }
    });
    
    // Reset price range
    const priceRange = document.getElementById('price-range');
    if (priceRange) {
        priceRange.value = 5;
        const priceValue = document.getElementById('price-value');
        if (priceValue) {
            priceValue.textContent = '5 ETH';
        }
    }
    
    // Reset dropdowns
    const sortFilter = document.getElementById('sort-filter');
    const categoryFilter = document.getElementById('category-filter');
    if (sortFilter) sortFilter.value = 'recently-listed';
    if (categoryFilter) categoryFilter.value = 'all';
    
    // Reset price inputs
    const minPrice = document.getElementById('min-price');
    const maxPrice = document.getElementById('max-price');
    if (minPrice) minPrice.value = '';
    if (maxPrice) maxPrice.value = '';
    
    // Reset to original data
    filteredNFTs = [...currentNFTs];
    displayNFTs(filteredNFTs);
    updateResultsCount();
}

// NFT Modal functionality
function openNFTModal(nft) {
    const modal = document.getElementById('nft-modal');
    if (!modal) return;
    
    // Populate modal with NFT data
    document.getElementById('modal-nft-image').src = nft.image;
    document.getElementById('modal-nft-name').textContent = nft.name;
    document.getElementById('modal-nft-description').textContent = `A unique digital artwork created by ${nft.creator}`;
    document.getElementById('modal-nft-creator').textContent = nft.creator;
    document.getElementById('modal-nft-owner').textContent = nft.creator; // In real app, this would be the owner
    document.getElementById('modal-nft-price').textContent = nft.price;
    
    // Set up buy button
    const buyBtn = document.getElementById('buy-nft');
    if (buyBtn) {
        buyBtn.onclick = () => buyNFT(nft);
    }
    
    // Set up offer button
    const offerBtn = document.getElementById('make-offer');
    if (offerBtn) {
        offerBtn.onclick = () => makeOffer(nft);
    }
    
    modal.style.display = 'block';
}

function closeNFTModal() {
    const modal = document.getElementById('nft-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Buy NFT functionality
async function buyNFT(nft) {
    try {
        const { currentAccount, marketplaceContract, nftContract, showLoading, hideLoading, showSuccess, showError } = window.web3Config;
        
        if (!currentAccount) {
            showError('Please connect your wallet first');
            return;
        }
        
        if (!marketplaceContract || !nftContract) {
            showError('Contracts not available. Please refresh the page.');
            return;
        }
        
        // Check if NFT has blockchain data
        if (!nft.blockchainData) {
            showError('NFT data not available. Please try refreshing the page.');
            return;
        }
        
        showLoading();
        
        // Convert price to wei
        const priceInWei = window.web3Config.web3.utils.toWei(nft.price.split(' ')[0], 'ether');
        
        // Call marketplace contract to purchase
        await marketplaceContract.methods.createMarketSale(
            nftContract._address,  // NFT contract address
            nft.blockchainData.itemId  // Market item ID
        ).send({
            from: currentAccount,
            value: priceInWei
        });
        
        hideLoading();
        showSuccess('NFT purchased successfully!');
        closeNFTModal();
        
        // Refresh the page data
        await loadExplorePageData();
        
    } catch (error) {
        console.error('Error buying NFT:', error);
        hideLoading();
        showError('Failed to purchase NFT. Please try again.');
    }
}

// Make offer functionality
async function makeOffer(nft) {
    try {
        const { currentAccount, showLoading, hideLoading, showSuccess, showError } = window.web3Config;
        
        if (!currentAccount) {
            showError('Please connect your wallet first');
            return;
        }
        
        const offerAmount = prompt('Enter your offer amount in ETH:');
        if (!offerAmount || isNaN(offerAmount)) {
            showError('Please enter a valid offer amount');
            return;
        }
        
        showLoading();
        
        // Convert offer amount to wei
        const offerInWei = window.web3Config.web3.utils.toWei(offerAmount, 'ether');
        
        // In a real app, this would call a smart contract function to make an offer
        // For now, we'll simulate the offer process
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate blockchain call
        
        hideLoading();
        showSuccess(`Offer of ${offerAmount} ETH sent for ${nft.name}!`);
        closeNFTModal();
        
    } catch (error) {
        console.error('Error making offer:', error);
        hideLoading();
        showError('Failed to make offer. Please try again.');
    }
}

// View options
function setupViewOptions() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const nftsContainer = document.getElementById('nfts-container');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const view = this.dataset.view;
            
            // Update active button
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update container class
            if (nftsContainer) {
                nftsContainer.className = `nfts-${view}`;
            }
        });
    });
}

// Load more functionality
function setupLoadMore() {
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreNFTs);
    }
}

// Display next page of NFTs
function displayNextPage() {
    const container = document.getElementById('nfts-grid');
    if (!container) return;
    
    const startIndex = currentPage * NFTsPerPage;
    const endIndex = startIndex + NFTsPerPage;
    const nftsToShow = filteredNFTs.slice(startIndex, endIndex);
    
    if (nftsToShow.length === 0) {
        // No more NFTs to show
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'none';
        }
        return;
    }
    
    // Clear container if it's the first page
    if (currentPage === 0) {
        container.innerHTML = '';
    }
    
    nftsToShow.forEach(nft => {
        const nftCard = document.createElement('div');
        nftCard.className = 'nft-card';
        nftCard.onclick = () => openNFTModal(nft);
        
        nftCard.innerHTML = `
            <div class="nft-image">
                <img src="${nft.image}" alt="${nft.name}">
                ${nft.hasOffers ? '<div class="nft-badge">Has Offers</div>' : ''}
            </div>
            <div class="nft-info">
                <h3 class="nft-name">${nft.name}</h3>
                <p class="nft-creator">by ${nft.creator}</p>
                <div class="nft-price">
                    <span class="price-amount">${nft.price}</span>
                    <span class="price-label">${nft.likes} likes</span>
                </div>
            </div>
        `;
        
        container.appendChild(nftCard);
    });
    
    // Update displayed NFTs count
    displayedNFTs = displayedNFTs.concat(nftsToShow);
    currentPage++;
    
    // Update load more button visibility
    updateLoadMoreButton();
}

function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
        const hasMoreNFTs = displayedNFTs.length < filteredNFTs.length;
        loadMoreBtn.style.display = hasMoreNFTs ? 'block' : 'none';
    }
}

function loadMoreNFTs() {
    // Show loading state
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
        const originalText = loadMoreBtn.innerHTML;
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        loadMoreBtn.disabled = true;
        
        // Simulate loading delay
        setTimeout(() => {
            displayNextPage();
            loadMoreBtn.innerHTML = originalText;
            loadMoreBtn.disabled = false;
        }, 500);
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize explore page
document.addEventListener('DOMContentLoaded', function() {
    setupSearch();
    setupFilters();
    setupViewOptions();
    setupLoadMore();
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('nft-modal');
        if (event.target === modal) {
            closeNFTModal();
        }
    });
    
    // Close modal when clicking close button
    const closeBtn = document.getElementById('close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeNFTModal);
    }
});

// Export functions for global access
window.exploreFunctions = {
    loadExplorePageData,
    applyFilters,
    clearFilters,
    openNFTModal,
    closeNFTModal,
    buyNFT,
    makeOffer
};

// Also export the main function directly for web3-config.js
window.loadExplorePageData = loadExplorePageData; 