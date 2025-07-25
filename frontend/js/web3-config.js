// Web3 Configuration and Wallet Connection
let web3;
let accounts = [];
let currentAccount = null;
let nftContract = null;
let marketplaceContract = null;

// Contract addresses (will be updated after deployment)
let NFT_CONTRACT_ADDRESS = '';
let MARKETPLACE_CONTRACT_ADDRESS = '';

// Contract ABIs (simplified for demo)
const NFT_ABI = [
    {
        "inputs": [],
        "name": "NFT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "approved",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "ApprovalForAll",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "creator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "tokenURI",
                "type": "string"
            }
        ],
        "name": "NFTMinted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "NFTListed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "NFTDelisted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "getApproved",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "name": "isApprovedForAll",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "tokenURI",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "mintNFT",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ownerOf",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "tokenURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "listNFT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "delistNFT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "getTokenInfo",
        "outputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "creator",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "listed",
                "type": "bool"
            },
            {
                "internalType": "string",
                "name": "tokenURI",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTotalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const MARKETPLACE_ABI = [
    {
        "inputs": [],
        "name": "Marketplace",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "itemId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "nftContract",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "seller",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "sold",
                "type": "bool"
            }
        ],
        "name": "MarketItemCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "itemId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "nftContract",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "seller",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "MarketItemSold",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "nftContract",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "createMarketItem",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "nftContract",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "itemId",
                "type": "uint256"
            }
        ],
        "name": "createMarketSale",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "fetchMarketItems",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "itemId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "nftContract",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address payable",
                        "name": "seller",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "sold",
                        "type": "bool"
                    }
                ],
                "internalType": "struct Marketplace.MarketItem[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "fetchMyNFTs",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "itemId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "nftContract",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address payable",
                        "name": "seller",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "sold",
                        "type": "bool"
                    }
                ],
                "internalType": "struct Marketplace.MarketItem[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "fetchItemsListed",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "itemId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "nftContract",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address payable",
                        "name": "seller",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "sold",
                        "type": "bool"
                    }
                ],
                "internalType": "struct Marketplace.MarketItem[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "itemId",
                "type": "uint256"
            }
        ],
        "name": "getMarketItem",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "itemId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "nftContract",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address payable",
                        "name": "seller",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "sold",
                        "type": "bool"
                    }
                ],
                "internalType": "struct Marketplace.MarketItem",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getListingPrice",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// Initialize Web3
async function initWeb3() {
    try {
        // Check if Web3 is available
        if (typeof Web3 === 'undefined') {
            console.error('Web3 library not loaded. Please check your internet connection.');
            showError('Web3 library not loaded. Please refresh the page.');
            return false;
        }

        // Check if MetaMask is installed
        if (typeof window.ethereum !== 'undefined') {
            web3 = new Web3(window.ethereum);
            console.log('Web3 initialized with MetaMask');
            return true;
        } else {
            console.log('MetaMask not installed');
            showError('Please install MetaMask to use this dApp!');
            return false;
        }
    } catch (error) {
        console.error('Error initializing Web3:', error);
        showError('Failed to initialize Web3. Please refresh the page.');
        return false;
    }
}

// Connect Wallet
async function connectWallet() {
    try {
        if (!web3) {
            const initialized = await initWeb3();
            if (!initialized) return;
        }

        // Request account access
        accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        currentAccount = accounts[0];
        
        console.log('Connected account:', currentAccount);
        
        // Update UI
        updateWalletUI();
        
        // Initialize contracts
        await loadContractAddresses();
        await initializeContracts();
        
        // Load data
        await loadPageData();
        
        // If on profile page, reload profile data specifically
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        if (currentPage === 'profile.html' && window.profileFunctions) {
            await window.profileFunctions.loadProfilePageData();
        }
        
        // Dispatch custom event for wallet connection
        window.dispatchEvent(new CustomEvent('walletConnected', { 
            detail: { account: currentAccount } 
        }));
        
        showSuccess('Wallet connected successfully!');
        return true;
    } catch (error) {
        console.error('Error connecting wallet:', error);
        showError('Failed to connect wallet. Please try again.');
        return false;
    }
}

// Load contract addresses from deployment
async function loadContractAddresses() {
    try {
        console.log('Loading contract addresses...');
        const response = await fetch('./contracts/contract-address.json');
        console.log('Response status:', response.status);
        
        if (response.ok) {
            const addresses = await response.json();
            NFT_CONTRACT_ADDRESS = addresses.NFT;
            MARKETPLACE_CONTRACT_ADDRESS = addresses.Marketplace;
            console.log('Contract addresses loaded successfully:', addresses);
            console.log('NFT_CONTRACT_ADDRESS:', NFT_CONTRACT_ADDRESS);
            console.log('MARKETPLACE_CONTRACT_ADDRESS:', MARKETPLACE_CONTRACT_ADDRESS);
        } else {
            console.log('Contract addresses file not found - contracts not deployed');
            console.log('Response status:', response.status);
            NFT_CONTRACT_ADDRESS = '';
            MARKETPLACE_CONTRACT_ADDRESS = '';
        }
    } catch (error) {
        console.error('Error loading contract addresses:', error);
        NFT_CONTRACT_ADDRESS = '';
        MARKETPLACE_CONTRACT_ADDRESS = '';
    }
}

// Initialize contracts
async function initializeContracts() {
    try {
        console.log('Initializing contracts...');
        console.log('NFT_CONTRACT_ADDRESS:', NFT_CONTRACT_ADDRESS);
        console.log('MARKETPLACE_CONTRACT_ADDRESS:', MARKETPLACE_CONTRACT_ADDRESS);
        console.log('web3 available:', !!web3);
        
        if (NFT_CONTRACT_ADDRESS && MARKETPLACE_CONTRACT_ADDRESS && web3) {
            nftContract = new web3.eth.Contract(NFT_ABI, NFT_CONTRACT_ADDRESS);
            marketplaceContract = new web3.eth.Contract(MARKETPLACE_ABI, MARKETPLACE_CONTRACT_ADDRESS);
            console.log('Contracts initialized successfully');
            console.log('nftContract:', nftContract);
            console.log('marketplaceContract:', marketplaceContract);
        } else {
            console.log('Contracts not available - not deployed or web3 not initialized');
            console.log('NFT_CONTRACT_ADDRESS:', NFT_CONTRACT_ADDRESS);
            console.log('MARKETPLACE_CONTRACT_ADDRESS:', MARKETPLACE_CONTRACT_ADDRESS);
            console.log('web3:', web3);
            nftContract = null;
            marketplaceContract = null;
        }
    } catch (error) {
        console.error('Error initializing contracts:', error);
        nftContract = null;
        marketplaceContract = null;
    }
}

// Update wallet UI
function updateWalletUI() {
    const connectBtn = document.getElementById('connect-wallet');
    if (connectBtn) {
        if (currentAccount) {
            const shortAddress = currentAccount.slice(0, 6) + '...' + currentAccount.slice(-4);
            connectBtn.innerHTML = `<i class="fas fa-wallet"></i> ${shortAddress}`;
            connectBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        } else {
            connectBtn.innerHTML = '<i class="fas fa-wallet"></i> Connect Wallet';
            connectBtn.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
        }
    }
}

// Load page-specific data
async function loadPageData() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch (currentPage) {
        case 'index.html':
            if (typeof loadHomePageData === 'function') {
                await loadHomePageData();
            }
            break;
        case 'explore.html':
            if (typeof loadExplorePageData === 'function') {
                await loadExplorePageData();
            }
            break;
        case 'mint.html':
            if (typeof loadMintPageData === 'function') {
                await loadMintPageData();
            }
            break;
        case 'profile.html':
            if (typeof loadProfilePageData === 'function') {
                await loadProfilePageData();
            }
            break;
    }
}

// Utility functions
function formatAddress(address) {
    return address.slice(0, 6) + '...' + address.slice(-4);
}

function formatPrice(price) {
    return web3.utils.fromWei(price, 'ether') + ' ETH';
}

function showLoading() {
    const modal = document.getElementById('loading-modal');
    if (modal) modal.style.display = 'block';
}

function hideLoading() {
    const modal = document.getElementById('loading-modal');
    if (modal) modal.style.display = 'none';
}

function showError(message) {
    console.error(message);
    
    // Create a more user-friendly error notification
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-family: 'Inter', sans-serif;
    `;
    errorDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

function showSuccess(message) {
    console.log(message);
    
    // Create a more user-friendly success notification
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-family: 'Inter', sans-serif;
    `;
    successDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, 5000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', async function() {
    // Wait for Web3 to be available
    if (typeof Web3 === 'undefined') {
        console.log('Waiting for Web3 to load...');
        // Wait a bit for the CDN to load
        setTimeout(async () => {
            if (typeof Web3 !== 'undefined') {
                await initializeApp();
            } else {
                showError('Web3 failed to load. Please refresh the page.');
            }
        }, 1000);
    } else {
        await initializeApp();
    }
});

async function initializeApp() {
    // Initialize Web3
    await initWeb3();
    
    // Set up wallet connection button
    const connectBtn = document.getElementById('connect-wallet');
    if (connectBtn) {
        connectBtn.addEventListener('click', connectWallet);
    }
    
    // Handle account changes
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', function (accounts) {
            if (accounts.length === 0) {
                // MetaMask is locked or user has no accounts
                currentAccount = null;
                updateWalletUI();
                // Reload page data to update UI
                loadPageData();
            } else {
                currentAccount = accounts[0];
                updateWalletUI();
                // Reload page data to update UI
                loadPageData();
            }
        });
        
        window.ethereum.on('chainChanged', function (chainId) {
            // Handle chain changes
            window.location.reload();
        });
    }
    
    // Load initial data
    await loadPageData();
}

// Manual contract initialization function
async function forceInitializeContracts() {
    console.log('Force initializing contracts...');
    await loadContractAddresses();
    await initializeContracts();
    
    console.log('Force initialization complete:');
    console.log('nftContract:', nftContract);
    console.log('marketplaceContract:', marketplaceContract);
    
    return {
        nftContract,
        marketplaceContract
    };
}

// Export for use in other scripts
window.web3Config = {
    get web3() { return web3; },
    get accounts() { return accounts; },
    get currentAccount() { return currentAccount; },
    get nftContract() { return nftContract; },
    get marketplaceContract() { return marketplaceContract; },
    connectWallet,
    formatAddress,
    formatPrice,
    showLoading,
    hideLoading,
    showError,
    showSuccess,
    initializeContracts,
    loadContractAddresses,
    forceInitializeContracts
}; 