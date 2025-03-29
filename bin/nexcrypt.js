#!/usr/bin/env node
const fs = require('fs').promises;
const { veil, unveil, veil1, unveil1 } = require('../lib/nexcrypt');
const { distributeData, fetchChunks } = require('../lib/distributor');

const [,, command, input, key] = process.argv;

if (!command || !input || !key) {
    console.log("Usage: nexcrypt <veil|unveil|veil1|unveil1> <input> <key>");
    process.exit(1);
}

async function runVeil() {
    try {
        const encrypted = veil(input, key);
        console.log("Encrypted chunks (simplified):", encrypted);
        const { systemChunk, cids } = await distributeData(encrypted);
        const output = { systemChunk, cids };
        await fs.writeFile('data.nxcrypt', JSON.stringify(output));
        console.log("Veiled and saved to data.nxcrypt:", { systemChunk, cids });
    } catch (err) {
        console.error("Error in veil:", err);
    }
}

async function runUnveil() {
    try {
        const data = JSON.parse(await fs.readFile(input, 'utf8'));
        console.log("Loaded data:", data);
        const internetChunks = await fetchChunks(data.cids);
        console.log("Fetched chunks:", internetChunks);
        const chunks = [data.systemChunk, ...internetChunks];
        console.log("All chunks:", chunks);
        const unveiled = unveil(chunks, key);
        console.log("Unveiled (simplified):", unveiled);
    } catch (err) {
        console.error("Error in unveil:", err);
    }
}

async function runVeil1() {
    try {
        const { encrypted, states } = veil1(input, key);
        console.log("Encrypted chunks (original):", encrypted);
        const { systemChunk, cids } = await distributeData(encrypted);
        const output = { systemChunk, cids, states };
        await fs.writeFile('data.nxcrypt', JSON.stringify(output));
        console.log("Veiled and saved to data.nxcrypt:", { systemChunk, cids });
    } catch (err) {
        console.error("Error in veil1:", err);
    }
}

async function runUnveil1() {
    try {
        const data = JSON.parse(await fs.readFile(input, 'utf8'));
        console.log("Loaded data:", data);
        const internetChunks = await fetchChunks(data.cids);
        console.log("Fetched chunks:", internetChunks);
        const chunks = [data.systemChunk, ...internetChunks];
        console.log("All chunks:", chunks);
        const unveiled = unveil1(chunks, key, data.states);
        console.log("Unveiled (original):", unveiled);
    } catch (err) {
        console.error("Error in unveil1:", err);
    }
}

if (command === 'veil') {
    runVeil();
} else if (command === 'unveil') {
    runUnveil();
} else if (command === 'veil1') {
    runVeil1();
} else if (command === 'unveil1') {
    runUnveil1();
} else {
    console.log("Invalid command. Use 'veil', 'unveil', 'veil1', or 'unveil1'.");
}