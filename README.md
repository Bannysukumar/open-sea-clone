# OpenSea Clone - NFT Marketplace

A complete decentralized NFT marketplace built with HTML, CSS, JavaScript, and Solidity. This project replicates the core functionality of OpenSea, allowing users to mint, buy, sell, and trade NFTs on the Ethereum blockchain.

## 🌟 Features

### Core Functionality
- **NFT Minting**: Create and mint new NFTs with metadata
- **NFT Trading**: Buy and sell NFTs on the marketplace
- **Wallet Integration**: MetaMask wallet connection
- **User Profiles**: View owned, created, and listed NFTs
- **Activity Tracking**: Monitor sales, purchases, and transfers

### User Interface
- **Modern Dark Theme**: Sleek, professional design with glassmorphism effects
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Real-time Updates**: Dynamic UI updates based on blockchain events
- **Interactive Elements**: Hover effects, animations, and smooth transitions

### Smart Contracts
- **ERC-721 NFT Contract**: Standard NFT implementation with minting capabilities
- **Marketplace Contract**: Handles listing, buying, and selling NFTs
- **Event System**: Real-time blockchain event listening
- **Security Features**: Reentrancy protection and proper access controls

## 🏗️ Project Structure

```
📁 OpenSeaClone/
├── 📁 contracts/
│   ├── NFT.sol              # ERC-721 NFT contract
│   └── Marketplace.sol      # NFT marketplace contract
├── 📁 frontend/
│   ├── 📁 css/
│   │   └── style.css        # Main stylesheet
│   ├── 📁 js/
│   │   ├── web3-config.js   # Web3 configuration
│   │   ├── app.js          # Home page functionality
│   │   ├── explore.js      # Explore page functionality
│   │   ├── mint.js         # Mint page functionality
│   │   └── profile.js      # Profile page functionality
│   ├── index.html          # Home page
│   ├── explore.html        # Explore page
│   ├── mint.html          # Mint page
│   └── profile.html       # Profile page
├── 📁 scripts/
│   └── deploy.js          # Contract deployment script
├── package.json           # Project dependencies
├── hardhat.config.js      # Hardhat configuration
└── README.md             # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MetaMask browser extension
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd OpenSeaClone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PRIVATE_KEY=your_private_key_here
   SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
   ```

4. **Compile contracts**
   ```bash
   npm run compile
   ```

5. **Deploy contracts** (optional - for testing)
   ```bash
   npm run deploy
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:8080`

## 🎯 Usage Guide

### Connecting Wallet
1. Click "Connect Wallet" in the navigation bar
2. Approve the MetaMask connection
3. Your wallet address will be displayed in the navbar

### Creating NFTs
1. Navigate to the "Create" page
2. Upload an image file (JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG)
3. Fill in the NFT details (name, description, price)
4. Add properties (optional)
5. Click "Create NFT"
6. Confirm the transaction in MetaMask

### Buying NFTs
1. Browse NFTs on the "Explore" page
2. Click on an NFT to view details
3. Click "Buy Now" to purchase
4. Confirm the transaction in MetaMask

### Selling NFTs
1. Go to your "Profile" page
2. Select an owned NFT
3. Click "List" to put it up for sale
4. Set your desired price
5. Confirm the listing transaction

## 🛠️ Technical Details

### Smart Contracts

#### NFT Contract (`contracts/NFT.sol`)
- ERC-721 standard implementation
- Minting functionality with metadata
- Listing and delisting capabilities
- Event emission for frontend updates

#### Marketplace Contract (`contracts/Marketplace.sol`)
- NFT listing and escrow functionality
- Purchase and sale execution
- Fee collection system
- Event-driven architecture

### Frontend Architecture

#### Web3 Integration
- MetaMask wallet connection
- Contract interaction via Web3.js
- Real-time event listening
- Transaction handling

#### UI/UX Features
- Dark theme with glassmorphism effects
- Responsive grid layouts
- Interactive hover animations
- Modal dialogs for detailed views
- Loading states and error handling

#### JavaScript Modules
- **web3-config.js**: Blockchain connection and contract initialization
- **app.js**: Home page functionality and stats
- **explore.js**: NFT browsing, filtering, and search
- **mint.js**: NFT creation and form handling
- **profile.js**: User profile and NFT management

## 🔧 Configuration

### Network Configuration
The project supports multiple Ethereum networks:

- **Hardhat Network**: For local development
- **Sepolia Testnet**: For testing (recommended)
- **Ethereum Mainnet**: For production

Update `hardhat.config.js` to configure your preferred network.

### Contract Addresses
After deployment, contract addresses are automatically saved to `frontend/contracts/contract-address.json`.

## 🧪 Testing

### Smart Contract Testing
```bash
npm run test
```

### Frontend Testing
Open the application in your browser and test:
- Wallet connection
- NFT minting
- NFT browsing and filtering
- Profile functionality

## 🚀 Deployment

### Smart Contracts
1. Configure your network in `hardhat.config.js`
2. Set your private key in `.env`
3. Run deployment:
   ```bash
   npm run deploy
   ```

### Frontend
1. Deploy the `frontend/` directory to your web server
2. Ensure contract addresses are updated
3. Configure your domain for HTTPS

## 🔒 Security Considerations

- **Private Key Management**: Never commit private keys to version control
- **Network Security**: Use testnets for development
- **Input Validation**: All user inputs are validated
- **Reentrancy Protection**: Smart contracts include security measures
- **Access Controls**: Proper ownership and permission checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenSea for inspiration
- OpenZeppelin for smart contract libraries
- Web3.js for blockchain interaction
- Font Awesome for icons

## 📞 Support

For questions or issues:
- Create an issue on GitHub
- Check the documentation
- Review the code comments

---

**Note**: This is a demo project for educational purposes. For production use, additional security measures and testing are recommended. 