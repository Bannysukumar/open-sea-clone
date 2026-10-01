# OpenSea Clone - NFT Marketplace

A complete decentralized NFT marketplace built with HTML, CSS, JavaScript, and Solidity. This project replicates the core functionality of OpenSea, allowing users to mint, buy, sell, and trade NFTs on the Ethereum blockchain.

[![License](https://img.shields.io/github/license/Bannysukumar/open-sea-clone)](https://github.com/Bannysukumar/open-sea-clone/blob/main/LICENSE) [![Stars](https://img.shields.io/github/stars/Bannysukumar/open-sea-clone)](https://github.com/Bannysukumar/open-sea-clone/stargazers) [![Last commit](https://img.shields.io/github/last-commit/Bannysukumar/open-sea-clone)](https://github.com/Bannysukumar/open-sea-clone/commits/main)

## Overview

A complete decentralized NFT marketplace built with HTML, CSS, JavaScript, and Solidity. This project replicates the core functionality of OpenSea, allowing users to mint, buy, sell, and trade NFTs on the Ethereum blockchain.


What is actually in the repository: `contracts/Marketplace.sol`, `contracts/NFT.sol`, `contracts/`, `frontend/`, `scripts/`. GitHub reports the primary language as JavaScript.

Published site recorded on the repository: https://open-sea-clone-ashy.vercel.app

## Features


- Marketplace contract with getListingPrice, createMarketItem
- NFT contract with mintNFT, listNFT, deli

## Tech Stack

| Technology | Where it shows up |
|---|---|
| Solidity | Smart contracts |
| Hardhat | Solidity compile and deploy scripts |
| ethers.js or web3.js | Wallet and contract calls from the browser or app |
| OpenZeppelin | Smart-contract base contracts |

## Project Architecture

Browser page → Solidity contract. The HTML references MetaMask.

## Project Structure

```text
open-sea-clone/
├── contracts/
├── frontend/
├── scripts/
├── .env.example
├── hardhat.config.js
├── package.json
```

## Getting Started

```bash
git clone https://github.com/Bannysukumar/open-sea-clone.git
cd open-sea-clone
npm install
npm run dev
# Copy .env.example to .env and fill in the values that file lists.
```

Scripts defined in package.json:

- `npm run dev` — `live-server frontend`
- `npm run compile` — `hardhat compile`
- `npm run deploy` — `hardhat run scripts/deploy.js --network sepolia`
- `npm run test` — `hardhat test`

## Deployment

- The repository homepage is https://open-sea-clone-ashy.vercel.app.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

Licensed under MIT. See [LICENSE](LICENSE).

## Author

[Banny Sukumar](https://github.com/Bannysukumar)

- GitHub: [@Bannysukumar](https://github.com/Bannysukumar)
- Portfolio: [adepu-sukumar.vercel.app](https://adepu-sukumar.vercel.app/)
- LinkedIn: [Adepu Sukumar](https://www.linkedin.com/in/adepu-sukumar-59b423351)
