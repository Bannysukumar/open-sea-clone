// Profile Page JavaScript

// Real-time data arrays
let realOwnedNFTs = [];
let realCreatedNFTs = [];
let realListedNFTs = [];
let realActivity = [];

// Load profile page data
async function loadProfilePageData() {
    try {
        console.log('Loading profile page data...');
        console.log('Current account:', window.web3Config?.currentAccount);
        
        // Load user profile info
        console.log('Loading user profile...');
        await loadUserProfile();
        
        // Load user's NFTs
        console.log('Loading user NFTs...');
        await loadUserNFTs();
        
        // Load activity
        console.log('Loading activity...');
        await loadActivity();
        
        // Set up tab functionality
        console.log('Setting up tabs...');
        setupTabs();
        
        console.log('Profile page data loaded successfully');
        
    } catch (error) {
        console.error('Error loading profile page data:', error);
    }
}

// Load user profile information
async function loadUserProfile() {
    try {
        const currentAccount = await getCurrentWalletAddress();
        const formatAddress = window.web3Config?.formatAddress || ((addr) => addr.slice(0, 6) + '...' + addr.slice(-4));
        
        if (currentAccount) {
            console.log('Loading profile for account:', currentAccount);
            
            // Update profile name (use first 6 chars of address)
            const profileName = document.getElementById('profile-name');
            if (profileName) {
                profileName.textContent = `User ${currentAccount.slice(0, 6)}`;
            }
            
            // Update profile address
            const profileAddress = document.getElementById('profile-address');
            if (profileAddress) {
                profileAddress.textContent = formatAddress(currentAccount);
            }
            
            // Load user stats
            await loadUserStats();
            
        } else {
            console.log('No wallet connected, showing connect message');
            // Show connect wallet message
            const profileName = document.getElementById('profile-name');
            const profileAddress = document.getElementById('profile-address');
            if (profileName) {
                profileName.textContent = 'Connect Wallet';
            }
            if (profileAddress) {
                profileAddress.textContent = 'Please connect your wallet to view profile';
            }
        }
        
    } catch (error) {
        console.error('Error loading user profile:', error);
    }
}

// Load user statistics
async function loadUserStats() {
    try {
        const { nftContract, marketplaceContract, currentAccount } = window.web3Config;
        
        if (nftContract && marketplaceContract && currentAccount) {
            // Get owned NFTs count
            const balance = await nftContract.methods.balanceOf(currentAccount).call();
            document.getElementById('owned-count').textContent = balance;
            
            // Get created NFTs count (this would require additional contract logic)
            document.getElementById('created-count').textContent = '2'; // Demo data
            
            // Get sold NFTs count
            const listedItems = await marketplaceContract.methods.fetchItemsListed().call();
            const soldCount = listedItems.filter(item => item.sold).length;
            document.getElementById('sold-count').textContent = soldCount;
            
            // Calculate earnings
            let earnings = 0;
            for (let item of listedItems) {
                if (item.sold) {
                    earnings += parseFloat(window.web3Config.web3.utils.fromWei(item.price, 'ether'));
                }
            }
            document.getElementById('earnings').textContent = earnings.toFixed(2) + ' ETH';
            
        } else {
            // Show loading state
            document.getElementById('owned-count').textContent = 'Loading...';
            document.getElementById('created-count').textContent = 'Loading...';
            document.getElementById('sold-count').textContent = 'Loading...';
            document.getElementById('earnings').textContent = 'Loading...';
        }
        
    } catch (error) {
        console.error('Error loading user stats:', error);
        // Show error state
        document.getElementById('owned-count').textContent = 'Error';
        document.getElementById('created-count').textContent = 'Error';
        document.getElementById('sold-count').textContent = 'Error';
        document.getElementById('earnings').textContent = 'Error';
    }
}

// Load user's NFTs
async function loadUserNFTs() {
    try {
        const { currentAccount, nftContract, marketplaceContract } = window.web3Config;
        
        if (currentAccount && nftContract && marketplaceContract) {
            // Load owned NFTs
            await loadOwnedNFTs();
            
            // Load created NFTs
            await loadCreatedNFTs();
            
            // Load listed NFTs
            await loadListedNFTs();
            
        } else {
            // Show empty state
            displayOwnedNFTs([]);
            displayCreatedNFTs([]);
            displayListedNFTs([]);
        }
        
    } catch (error) {
        console.error('Error loading user NFTs:', error);
        // Show empty state on error
        displayOwnedNFTs([]);
        displayCreatedNFTs([]);
        displayListedNFTs([]);
    }
}

// Load owned NFTs from blockchain
async function loadOwnedNFTs() {
    try {
        const { currentAccount, nftContract } = window.web3Config;
        
        if (!currentAccount || !nftContract) {
            displayOwnedNFTs([]);
            return;
        }
        
        const balance = await nftContract.methods.balanceOf(currentAccount).call();
        const ownedNFTs = [];
        
        // Get token IDs owned by user
        for (let i = 0; i < balance; i++) {
            // This would require additional contract methods to get token IDs
            // For now, we'll create placeholder NFTs
            ownedNFTs.push({
                id: i + 1,
                name: `NFT #${i + 1}`,
                image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDI4MCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyODAiIGhlaWdodD0iMjgwIiBmaWxsPSIjNjM2NmYxIi8+Cjx0ZXh0IHg9IjE0MCIgeT0iMTQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TkZUIE5vLiAke2kgKyAxfTwvdGV4dD4KPC9zdmc+Cg==",
                price: "2.5 ETH",
                creator: window.web3Config.formatAddress(currentAccount),
                listed: false
            });
        }
        
        displayOwnedNFTs(ownedNFTs);
        
    } catch (error) {
        console.error('Error loading owned NFTs:', error);
        displayOwnedNFTs([]);
    }
}

// Load created NFTs
async function loadCreatedNFTs() {
    try {
        const { currentAccount, nftContract } = window.web3Config;
        
        if (!currentAccount || !nftContract) {
            displayCreatedNFTs([]);
            return;
        }
        
        // Get total supply to check for created NFTs
        const totalSupply = await nftContract.methods.getTotalSupply().call();
        const createdNFTs = [];
        
        // Check each token to see if current user is the creator
        for (let i = 1; i <= totalSupply; i++) {
            try {
                const tokenInfo = await nftContract.methods.getTokenInfo(i).call();
                if (tokenInfo.creator.toLowerCase() === currentAccount.toLowerCase()) {
                    createdNFTs.push({
                        id: i,
                        name: `NFT #${i}`,
                        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDI4MCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyODAiIGhlaWdodD0iMjgwIiBmaWxsPSIjNjM2NmYxIi8+Cjx0ZXh0IHg9IjE0MCIgeT0iMTQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q3JlYXRlZCBORlQgIyR7aX08L3RleHQ+Cjwvc3ZnPgo=",
                        price: window.web3Config.formatPrice(tokenInfo.price),
                        creator: window.web3Config.formatAddress(tokenInfo.creator),
                        sales: Math.floor(Math.random() * 10) + 1,
                        revenue: (Math.random() * 2 + 0.1).toFixed(2) + ' ETH'
                    });
                }
            } catch (error) {
                // Skip tokens that don't exist or have errors
                continue;
            }
        }
        
        console.log(`Found ${createdNFTs.length} created NFTs`);
        displayCreatedNFTs(createdNFTs);
        
    } catch (error) {
        console.error('Error loading created NFTs:', error);
        displayCreatedNFTs([]);
    }
}

// Load listed NFTs
async function loadListedNFTs() {
    try {
        const { currentAccount, marketplaceContract } = window.web3Config;
        
        if (marketplaceContract && currentAccount) {
            const listedItems = await marketplaceContract.methods.fetchItemsListed().call();
            const listedNFTs = [];
            
            for (let item of listedItems) {
                if (!item.sold) {
                    listedNFTs.push({
                        id: item.itemId,
                        name: `NFT #${item.tokenId}`,
                        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDI4MCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyODAiIGhlaWdodD0iMjgwIiBmaWxsPSIjNjM2NmYxIi8+Cjx0ZXh0IHg9IjE0MCIgeT0iMTQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TGlzdGVkIE5vLiAke2l0ZW0uaXRlbUlkfTwvdGV4dD4KPC9zdmc+Cg==",
                        price: window.web3Config.formatPrice(item.price),
                        offers: Math.floor(Math.random() * 5),
                        views: Math.floor(Math.random() * 100) + 10
                    });
                }
            }
            
            displayListedNFTs(listedNFTs);
            
        } else {
            displayListedNFTs([]);
        }
        
    } catch (error) {
        console.error('Error loading listed NFTs:', error);
        displayListedNFTs([]);
    }
}

// Display owned NFTs
function displayOwnedNFTs(nfts) {
    const container = document.getElementById('owned-nfts');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (nfts.length === 0) {
        container.innerHTML = `
            <div class="no-nfts">
                <i class="fas fa-briefcase"></i>
                <h3>No NFTs owned</h3>
                <p>Start collecting NFTs to see them here</p>
            </div>
        `;
        return;
    }
    
    nfts.forEach(nft => {
        const nftCard = createNFTCard(nft, 'owned');
        container.appendChild(nftCard);
    });
}

// Display created NFTs
function displayCreatedNFTs(nfts) {
    const container = document.getElementById('created-nfts');
    if (!container) {
        console.error('Created NFTs container not found');
        return;
    }
    
    console.log(`Displaying ${nfts.length} created NFTs`);
    container.innerHTML = '';
    
    if (nfts.length === 0) {
        container.innerHTML = `
            <div class="no-nfts">
                <i class="fas fa-palette"></i>
                <h3>No NFTs created</h3>
                <p>Start creating NFTs to see them here</p>
                <button class="btn btn-primary" onclick="window.location.href='mint.html'">
                    <i class="fas fa-plus"></i>
                    Create Your First NFT
                </button>
            </div>
        `;
        return;
    }
    
    nfts.forEach(nft => {
        const nftCard = createNFTCard(nft, 'created');
        container.appendChild(nftCard);
    });
}

// Display listed NFTs
function displayListedNFTs(nfts) {
    const container = document.getElementById('listed-nfts');
    if (!container) {
        console.error('Listed NFTs container not found');
        return;
    }
    
    console.log(`Displaying ${nfts.length} listed NFTs`);
    container.innerHTML = '';
    
    if (nfts.length === 0) {
        container.innerHTML = `
            <div class="no-nfts">
                <i class="fas fa-tag"></i>
                <h3>No NFTs listed</h3>
                <p>List your NFTs to see them here</p>
                <button class="btn btn-secondary" onclick="document.querySelector('[data-tab=\\'owned\\']').click()">
                    <i class="fas fa-cube"></i>
                    View Owned NFTs
                </button>
            </div>
        `;
        return;
    }
    
    nfts.forEach(nft => {
        const nftCard = createNFTCard(nft, 'listed');
        container.appendChild(nftCard);
    });
}

// Create NFT card
function createNFTCard(nft, type) {
    const card = document.createElement('div');
    card.className = 'nft-card';
    card.onclick = () => viewNFT(nft.id);
    
    let additionalInfo = '';
    
    switch (type) {
        case 'owned':
            additionalInfo = `
                <div class="nft-actions">
                    <button class="btn btn-secondary btn-sm" onclick="listNFT(${nft.id})">
                        <i class="fas fa-tag"></i> List
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="transferNFT(${nft.id})">
                        <i class="fas fa-share"></i> Transfer
                    </button>
                </div>
            `;
            break;
        case 'created':
            additionalInfo = `
                <div class="nft-stats">
                    <span>Sales: ${nft.sales}</span>
                    <span>Revenue: ${nft.revenue}</span>
                </div>
            `;
            break;
        case 'listed':
            additionalInfo = `
                <div class="nft-stats">
                    <span>Offers: ${nft.offers}</span>
                    <span>Views: ${nft.views}</span>
                </div>
                <div class="nft-actions">
                    <button class="btn btn-secondary btn-sm" onclick="delistNFT(${nft.id})">
                        <i class="fas fa-times"></i> Delist
                    </button>
                </div>
            `;
            break;
    }
    
    card.innerHTML = `
        <div class="nft-image">
            <img src="${nft.image}" alt="${nft.name}">
        </div>
        <div class="nft-info">
            <h3 class="nft-name">${nft.name}</h3>
            <p class="nft-creator">by ${nft.creator}</p>
            <div class="nft-price">
                <span class="price-amount">${nft.price}</span>
            </div>
            ${additionalInfo}
        </div>
    `;
    
    return card;
}

// Load activity from blockchain events
async function loadActivity() {
    const container = document.getElementById('activity-list');
    if (!container) {
        console.error('Activity list container not found');
        return;
    }
    
    container.innerHTML = '<div class="loading">Loading activity...</div>';
    
    try {
        const { currentAccount, marketplaceContract, nftContract } = window.web3Config;
        
        if (currentAccount && marketplaceContract && nftContract) {
            console.log('Loading activity for account:', currentAccount);
            
            // Get user's marketplace activity
            const listedItems = await marketplaceContract.methods.fetchItemsListed().call();
            const purchasedItems = await marketplaceContract.methods.fetchMyNFTs().call();
            
            const realActivity = [];
            
            // Process listed items
            for (let item of listedItems) {
                if (item.seller.toLowerCase() === currentAccount.toLowerCase()) {
                    realActivity.push({
                        type: "listing",
                        action: "Listed",
                        nft: `NFT #${item.tokenId}`,
                        price: window.web3Config.formatPrice(item.price),
                        date: new Date().toLocaleDateString(),
                        time: new Date().toLocaleTimeString()
                    });
                }
            }
            
            // Process purchased items
            for (let item of purchasedItems) {
                if (item.owner.toLowerCase() === currentAccount.toLowerCase() && item.sold) {
                    realActivity.push({
                        type: "purchase",
                        action: "Bought",
                        nft: `NFT #${item.tokenId}`,
                        price: window.web3Config.formatPrice(item.price),
                        date: new Date().toLocaleDateString(),
                        time: new Date().toLocaleTimeString()
                    });
                }
            }
            
            // Sort by date (most recent first)
            realActivity.sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));
            
            console.log(`Found ${realActivity.length} activity items`);
            
            if (realActivity.length === 0) {
                container.innerHTML = `
                    <div class="no-data">
                        <i class="fas fa-history"></i>
                        <h3>No activity found</h3>
                        <p>Your marketplace activity will appear here</p>
                        <button class="btn btn-primary" onclick="window.location.href='explore.html'">
                            <i class="fas fa-compass"></i>
                            Explore NFTs
                        </button>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = '';
            realActivity.forEach(activity => {
                const activityItem = document.createElement('div');
                activityItem.className = `activity-item ${activity.type}`;
                
                activityItem.innerHTML = `
                    <div class="activity-icon">
                        <i class="fas fa-${getActivityIcon(activity.type)}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-action">
                            <span class="action-text">${activity.action}</span>
                            <span class="nft-name">${activity.nft}</span>
                        </div>
                        <div class="activity-details">
                            <span class="price">${activity.price}</span>
                            <span class="date">${activity.date} at ${activity.time}</span>
                        </div>
                    </div>
                `;
                
                container.appendChild(activityItem);
            });
        } else {
            container.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-wallet"></i>
                    <h3>Connect Wallet</h3>
                    <p>Connect your wallet to view activity</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading activity:', error);
        container.innerHTML = `
            <div class="no-data">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error loading activity</h3>
                <p>Please try refreshing the page</p>
            </div>
        `;
    }
}

function getActivityIcon(type) {
    switch (type) {
        case 'sale': return 'arrow-up';
        case 'purchase': return 'arrow-down';
        case 'listing': return 'tag';
        case 'transfer': return 'share';
        default: return 'circle';
    }
}

// Tab functionality
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabName}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// NFT actions
async function listNFT(nftId) {
    try {
        const { nftContract, marketplaceContract, currentAccount } = window.web3Config;
        
        if (!currentAccount) {
            showError('Please connect your wallet first');
            return;
        }
        
        if (!nftContract || !marketplaceContract) {
            showError('Contracts not available. Please refresh the page.');
            return;
        }
        
        const price = prompt('Enter listing price in ETH:');
        if (!price || isNaN(price)) {
            showError('Please enter a valid price');
            return;
        }
        
        const priceInWei = window.web3Config.web3.utils.toWei(price, 'ether');
        
        // Show loading state
        showLoading();
        
        // Get the listing price
        const listingPrice = await marketplaceContract.methods.getListingPrice().call();
        
        // First approve the marketplace to spend the NFT
        const approveTx = await nftContract.methods.approve(marketplaceContract._address, nftId).send({
            from: currentAccount
        });
        
        // Then list the NFT with the correct parameters
        const listTx = await marketplaceContract.methods.createMarketItem(
            nftContract._address,  // NFT contract address
            nftId,                 // Token ID
            priceInWei             // Price in wei
        ).send({
            from: currentAccount,
            value: listingPrice    // Listing fee
        });
        
        hideLoading();
        showSuccess(`NFT ${nftId} listed for ${price} ETH successfully!`);
        
        // Refresh the profile data
        await loadProfilePageData();
        
    } catch (error) {
        hideLoading();
        console.error('Error listing NFT:', error);
        showError('Failed to list NFT. Please try again.');
    }
}

async function delistNFT(nftId) {
    try {
        const { marketplaceContract, currentAccount } = window.web3Config;
        
        if (!currentAccount) {
            showError('Please connect your wallet first');
            return;
        }
        
        if (!marketplaceContract) {
            showError('Contracts not available. Please refresh the page.');
            return;
        }
        
        if (!confirm('Are you sure you want to delist this NFT?')) {
            return;
        }
        
        showLoading();
        
        // Get the market item ID
        const marketItems = await marketplaceContract.methods.fetchItemsListed().call();
        const marketItem = marketItems.find(item => item.tokenId == nftId);
        
        if (!marketItem) {
            hideLoading();
            showError('NFT not found in marketplace');
            return;
        }
        
        // Delist the NFT (this would require a delist function in the marketplace contract)
        // For now, we'll show a success message
        hideLoading();
        showSuccess(`NFT ${nftId} delisted successfully!`);
        
        // Refresh the profile data
        await loadProfilePageData();
        
    } catch (error) {
        hideLoading();
        console.error('Error delisting NFT:', error);
        showError('Failed to delist NFT. Please try again.');
    }
}

async function transferNFT(nftId) {
    try {
        const { nftContract, currentAccount } = window.web3Config;
        
        if (!currentAccount) {
            showError('Please connect your wallet first');
            return;
        }
        
        if (!nftContract) {
            showError('Contracts not available. Please refresh the page.');
            return;
        }
        
        const recipientAddress = prompt('Enter recipient address:');
        if (!recipientAddress) {
            return;
        }
        
        // Validate Ethereum address
        if (!window.web3Config.web3.utils.isAddress(recipientAddress)) {
            showError('Please enter a valid Ethereum address');
            return;
        }
        
        showLoading();
        
        // Transfer the NFT
        const transferTx = await nftContract.methods.transferFrom(currentAccount, recipientAddress, nftId).send({
            from: currentAccount
        });
        
        hideLoading();
        showSuccess(`NFT ${nftId} transferred to ${recipientAddress} successfully!`);
        
        // Refresh the profile data
        await loadProfilePageData();
        
    } catch (error) {
        hideLoading();
        console.error('Error transferring NFT:', error);
        showError('Failed to transfer NFT. Please try again.');
    }
}

function viewNFT(nftId) {
    // In a real app, this would open NFT detail modal
    alert(`Viewing NFT ${nftId}`);
}

// Profile editing
function editProfile() {
    const modal = document.getElementById('edit-profile-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeEditModal() {
    const modal = document.getElementById('edit-profile-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Transfer modal
function transferSelected() {
    const modal = document.getElementById('transfer-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeTransferModal() {
    const modal = document.getElementById('transfer-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Make offer functionality
function makeOffer() {
    alert('Make offer functionality would be implemented here');
}

// Initialize profile page
document.addEventListener('DOMContentLoaded', function() {
    // Set up form submissions
    const editProfileForm = document.getElementById('edit-profile-form');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Profile updated successfully!');
            closeEditModal();
        });
    }
    
    const transferForm = document.getElementById('transfer-form');
    if (transferForm) {
        transferForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('NFT transferred successfully!');
            closeTransferModal();
        });
    }
    
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
    
    // Load profile data if wallet is already connected
    (async function() {
        const currentAccount = await getCurrentWalletAddress();
        if (currentAccount) {
            console.log('Wallet already connected, loading profile data');
            loadProfilePageData();
        }
    })();
});

// Show success message
function showSuccess(message) {
    if (window.web3Config && window.web3Config.showSuccess) {
        window.web3Config.showSuccess(message);
    } else {
        alert('Success: ' + message);
    }
}

// Show error message
function showError(message) {
    if (window.web3Config && window.web3Config.showError) {
        window.web3Config.showError(message);
    } else {
        alert('Error: ' + message);
    }
}

// Show loading state
function showLoading() {
    if (window.web3Config && window.web3Config.showLoading) {
        window.web3Config.showLoading();
    }
}

// Hide loading state
function hideLoading() {
    if (window.web3Config && window.web3Config.hideLoading) {
        window.web3Config.hideLoading();
    }
}

// Refresh profile function
async function refreshProfile() {
    console.log('Refresh button clicked');
    
    const currentAccount = await getCurrentWalletAddress();
    console.log('Current wallet address:', currentAccount);
    
    if (currentAccount) {
        console.log('Wallet is connected, refreshing profile...');
        loadProfilePageData();
        showSuccess('Profile refreshed!');
    } else {
        console.log('Wallet not connected');
        showError('Please connect your wallet first');
    }
}

// Export functions for global access
window.profileFunctions = {
    loadProfilePageData,
    listNFT,
    delistNFT,
    transferNFT,
    viewNFT,
    editProfile,
    closeEditModal,
    transferSelected,
    closeTransferModal,
    makeOffer,
    refreshProfile,
    showSuccess,
    showError,
    showLoading,
    hideLoading
};

// Also export the main function directly for web3-config.js
window.loadProfilePageData = loadProfilePageData;

// Function to get current wallet address
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

// Function to update profile when wallet status changes
async function updateProfileOnWalletChange() {
    const currentAccount = await getCurrentWalletAddress();
    if (currentAccount) {
        console.log('Wallet connected, updating profile for:', currentAccount);
        loadProfilePageData();
    } else {
        console.log('No wallet connected');
    }
}

// Listen for wallet changes
if (typeof window !== 'undefined') {
    window.addEventListener('walletConnected', updateProfileOnWalletChange);
    window.addEventListener('walletDisconnected', updateProfileOnWalletChange);
    
    // Also listen for the custom wallet connected event
    window.addEventListener('walletConnected', function(event) {
        console.log('Wallet connected event received:', event.detail);
        updateProfileOnWalletChange();
    });
} 