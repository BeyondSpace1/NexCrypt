# NexCrypt 🛡️

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2014.0.0-brightgreen.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg)](http://makeapullrequest.com)

**NexCrypt** is a decentralized data veiling engine designed to fragment sensitive information across the IPFS network while maintaining a private, local "System Chunk." It moves beyond simple encryption by implementing a hybrid storage model that ensures data remains irrecoverable even if the global network is compromised.

---

## 🚀 Key Features

- **Hybrid Fragmentation**: Splits data into chunks, keeping a critical "System Chunk" on your local machine and scattering the remaining "Internet Chunks" across decentralized storage.
- **Stateful Chaining (Echo Encryption)**: Implements a unique substitution-permutation network where each chunk's cryptographic state depends on the previous one.
- **IPFS Integration**: Leverages the Pinata API for immutable, decentralized data hosting.
- **CLI Driven**: Simple, powerful command-line interface for veiling and unveiling data.
- **Minimal Footprint**: Lightweight Node.js implementation with focused dependencies.

---

## 🛠️ How It Works: The "Scatter-Gather" Method

1. **Veil**: Your input is processed through the NexCrypt algorithm, creating a series of encrypted chunks. 
2. **Scatter**: The first chunk is saved locally. All subsequent chunks are uploaded to IPFS via the Pinata API.
3. **Link**: A `.nxcrypt` metadata file is generated, containing the local chunk and the CIDs (Content Identifiers) for the IPFS chunks.
4. **Gather**: To recover data, NexCrypt fetches the chunks from IPFS, combines them with your local chunk, and reverses the "veiling" using your private key.

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/BeyondSpace1/NexCrypt.git

# Enter the directory
cd NexCrypt

# Install dependencies
npm install
```

### Configuration
Create a `.env` file in the root directory and add your Pinata API credentials:
```env
API_KEY=your_pinata_api_key
API_SECRET=your_pinata_api_secret
```

---

## 💻 Usage

### Veiling Data
```bash
node bin/nexcrypt.js veil "MY_SECRET_MESSAGE" "MY_PRIVATE_KEY"
```
*Output: Generates `data.nxcrypt`.*

### Unveiling Data
```bash
node bin/nexcrypt.js unveil "data.nxcrypt" "MY_PRIVATE_KEY"
```

---

## 🏗️ Architecture

- **Core Logic**: `lib/nexcrypt.js` - The cryptographic engine.
- **Distribution**: `lib/distributor.js` - Handles IPFS/Pinata interactions.
- **CLI**: `bin/nexcrypt.js` - User interface layer.

---

## 🗺️ Roadmap

- [ ] **Global Alphabet Support**: Expand beyond ASCII/Uppercase to full Unicode support.
- [ ] **Kubo Integration**: Support for local IPFS nodes to remove dependency on centralized pinning services.
- [ ] **Web GUI**: A React-based interface for non-technical users.
- [ ] **WASM Core**: Port the encryption engine to WebAssembly for high-performance browser-side veiling.

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Developed with ❤️ by the BeyondSpace Team.**
