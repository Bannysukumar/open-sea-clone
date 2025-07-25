// Main App JavaScript for Home Page

// Real-time data arrays
let realCollections = [];
let realNFTs = [];

// Load home page data
async function loadHomePageData() {
    try {
        // Load stats
        await loadStats();
        
        // Load featured collections
        loadFeaturedCollections();
        
        // Load trending NFTs
        loadTrendingNFTs();
        
    } catch (error) {
        console.error('Error loading home page data:', error);
    }
}

// Load marketplace stats
async function loadStats() {
    try {
        const { web3, nftContract, marketplaceContract } = window.web3Config;
        
        if (nftContract && marketplaceContract) {
            // Get total NFTs
            const totalSupply = await nftContract.methods.getTotalSupply().call();
            document.getElementById('total-nfts').textContent = totalSupply;
            
            // Get marketplace items
            const marketItems = await marketplaceContract.methods.fetchMarketItems().call();
            document.getElementById('total-sales').textContent = marketItems.length;
            
            // Calculate total volume
            let totalVolume = 0;
            for (let item of marketItems) {
                totalVolume += parseFloat(web3.utils.fromWei(item.price, 'ether'));
            }
            document.getElementById('total-volume').textContent = totalVolume.toFixed(2) + ' ETH';
            
            // Estimate active users (unique addresses)
            const uniqueUsers = new Set();
            for (let item of marketItems) {
                uniqueUsers.add(item.seller);
                if (item.owner !== '0x0000000000000000000000000000000000000000') {
                    uniqueUsers.add(item.owner);
                }
            }
            document.getElementById('total-users').textContent = uniqueUsers.size;
            
        } else {
            // Show loading state if contracts not available
            document.getElementById('total-nfts').textContent = 'Loading...';
            document.getElementById('total-sales').textContent = 'Loading...';
            document.getElementById('total-users').textContent = 'Loading...';
            document.getElementById('total-volume').textContent = 'Loading...';
        }
        
    } catch (error) {
        console.error('Error loading stats:', error);
        // Show error state
        document.getElementById('total-nfts').textContent = 'Error';
        document.getElementById('total-sales').textContent = 'Error';
        document.getElementById('total-users').textContent = 'Error';
        document.getElementById('total-volume').textContent = 'Error';
    }
}

// Load featured collections from blockchain
async function loadFeaturedCollections() {
    const container = document.getElementById('featured-collections');
    if (!container) return;
    
    container.innerHTML = '<div class="loading">Loading collections...</div>';
    
    try {
        const { marketplaceContract, nftContract } = window.web3Config;
        
        if (marketplaceContract && nftContract) {
            // Get recent market items to create collections
            const marketItems = await marketplaceContract.methods.fetchMarketItems().call();
            
            // Group by creator to form collections
            const collections = {};
            for (let item of marketItems.slice(0, 20)) { // Limit to recent items
                const tokenInfo = await nftContract.methods.getTokenInfo(item.tokenId).call();
                const creator = tokenInfo.creator;
                
                if (!collections[creator]) {
                    collections[creator] = {
                        id: creator,
                        name: `Collection by ${window.web3Config.formatAddress(creator)}`,
                        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjNjM2NmYxIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q29sbGVjdGlvbjwvdGV4dD4KPC9zdmc+Cg==",
                        floorPrice: window.web3Config.formatPrice(item.price),
                        items: 1
                    };
                } else {
                    collections[creator].items++;
                    // Update floor price to lowest
                    const currentFloor = parseFloat(window.web3Config.web3.utils.fromWei(item.price, 'ether'));
                    const existingFloor = parseFloat(collections[creator].floorPrice.split(' ')[0]);
                    if (currentFloor < existingFloor) {
                        collections[creator].floorPrice = window.web3Config.formatPrice(item.price);
                    }
                }
            }
            
            realCollections = Object.values(collections).slice(0, 4);
            
            if (realCollections.length === 0) {
                container.innerHTML = '<div class="no-data">No collections found</div>';
                return;
            }
            
            container.innerHTML = '';
            realCollections.forEach(collection => {
                const collectionCard = document.createElement('div');
                collectionCard.className = 'collection-card';
                collectionCard.onclick = () => viewCollection(collection.id);
                
                collectionCard.innerHTML = `
                    <div class="collection-image">
                        <img src="${collection.image}" alt="${collection.name}">
                    </div>
                    <div class="collection-info">
                        <h3 class="collection-name">${collection.name}</h3>
                        <div class="collection-stats">
                            <span>Floor: ${collection.floorPrice}</span>
                            <span>${collection.items} items</span>
                        </div>
                    </div>
                `;
                
                container.appendChild(collectionCard);
            });
        } else {
            container.innerHTML = '<div class="no-data">Connect wallet to view collections</div>';
        }
    } catch (error) {
        console.error('Error loading collections:', error);
        container.innerHTML = '<div class="no-data">Error loading collections</div>';
    }
}

// Load trending NFTs from blockchain
async function loadTrendingNFTs() {
    const container = document.getElementById('trending-nfts');
    if (!container) return;
    
    container.innerHTML = '<div class="loading">Loading NFTs...</div>';
    
    try {
        const { marketplaceContract, nftContract } = window.web3Config;
        
        if (marketplaceContract && nftContract) {
            // Get recent market items
            const marketItems = await marketplaceContract.methods.fetchMarketItems().call();
            
            realNFTs = [];
            for (let item of marketItems.slice(0, 6)) { // Limit to 6 trending NFTs
                const tokenInfo = await nftContract.methods.getTokenInfo(item.tokenId).call();
                
                realNFTs.push({
                    id: item.itemId,
                    name: `NFT #${item.tokenId}`,
                    creator: window.web3Config.formatAddress(tokenInfo.creator),
                    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDI4MCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyODAiIGhlaWdodD0iMjgwIiBmaWxsPSIjNjM2NmYxIi8+Cjx0ZXh0IHg9IjE0MCIgeT0iMTQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TkZUIE5vLiAke2l0ZW0udG9rZW5JZH08L3RleHQ+Cjwvc3ZnPgo=",
                    price: window.web3Config.formatPrice(item.price),
                    likes: Math.floor(Math.random() * 200) + 50, // Simulated likes
                    blockchainData: item
                });
            }
            
            if (realNFTs.length === 0) {
                container.innerHTML = '<div class="no-data">No NFTs found</div>';
                return;
            }
            
            container.innerHTML = '';
            realNFTs.forEach(nft => {
                const nftCard = document.createElement('div');
                nftCard.className = 'nft-card';
                nftCard.onclick = () => viewNFT(nft.id);
                
                nftCard.innerHTML = `
                    <div class="nft-image">
                        <img src="${nft.image}" alt="${nft.name}">
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
        } else {
            container.innerHTML = '<div class="no-data">Connect wallet to view NFTs</div>';
        }
    } catch (error) {
        console.error('Error loading NFTs:', error);
        container.innerHTML = '<div class="no-data">Error loading NFTs</div>';
    }
}

// View collection details
function viewCollection(collectionId) {
    // In a real app, this would navigate to a collection page
    console.log('Viewing collection:', collectionId);
    alert('Collection details would be shown here');
}

// View NFT details
function viewNFT(nftId) {
    // In a real app, this would open an NFT detail modal or navigate to detail page
    console.log('Viewing NFT:', nftId);
    alert('NFT details would be shown here');
}

// Filter by category
function filterByCategory(category) {
    console.log('Filtering by category:', category);
    // In a real app, this would filter the NFTs by category
    alert(`Filtering by ${category} category`);
}

// Navigate to explore page with category filter
function navigateToExplore(category) {
    console.log('Navigating to explore with category:', category);
    // Store the category filter in localStorage for the explore page to use
    localStorage.setItem('selectedCategory', category);
    // Navigate to explore page
    window.location.href = 'explore.html';
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    
    if (navMenu && mobileToggle) {
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    }
}

// Add event listeners for mobile menu
document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const navMenu = document.querySelector('.nav-menu');
            const mobileToggle = document.getElementById('mobile-menu-toggle');
            if (navMenu && mobileToggle) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    });
    
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

// Export functions for global access
window.appFunctions = {
    loadHomePageData,
    loadStats,
    loadFeaturedCollections,
    loadTrendingNFTs,
    viewCollection,
    viewNFT,
    filterByCategory,
    navigateToExplore,
    toggleMobileMenu
};

// Also export the main function directly for web3-config.js
window.loadHomePageData = loadHomePageData; 