const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const pinataApiKey = process.env.API_KEY;
const pinataSecretApiKey = process.env.API_SECRET;

async function distributeData(chunks) {
    const systemChunk = chunks[0];
    const internetChunks = chunks.slice(1);
    const cids = [];

    for (let chunk of internetChunks) {
        try {
            const formData = new FormData();
            formData.append('file', Buffer.from(chunk), {
                filename: 'chunk.bin',
            });

            const response = await axios.post(
                'https://api.pinata.cloud/pinning/pinFileToIPFS',
                formData,
                {
                    headers: {
                        ...formData.getHeaders(),
                        pinata_api_key: pinataApiKey,
                        pinata_secret_api_key: pinataSecretApiKey,
                    },
                }
            );
            cids.push(response.data.IpfsHash);
        } catch (error) {
            console.error('Error pinning to Pinata:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    return { systemChunk, cids };
}

async function fetchChunks(cids) {
    const chunks = [];
    for (let cid of cids) {
        try {
            const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${cid}`, {
                responseType: 'arraybuffer',
            });
            chunks.push(Buffer.from(response.data).toString('utf8'));
        } catch (error) {
            console.error('Error fetching from Pinata:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
    return chunks;
}

module.exports = { distributeData, fetchChunks };