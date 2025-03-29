const crypto = require('crypto');
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

// Simplified Logic (Original veil/unveil)
function nexCrypt(message, key, unveil = false) {
    let keyNums = [];
    for (let char of key.toUpperCase()) {
        let pos = alphabet.indexOf(char);
        if (pos !== -1) keyNums.push(pos);
    }
    let seed = keyNums.reduce((a, b) => a + b, 0) % 46;
    
    const chunks = [];
    for (let i = 0; i < message.length; i += 4) {
        chunks.push(message.slice(i, i + 4));
    }
    
    const results = [];
    for (let chunk of chunks) {
        let veiled = "";
        for (let i = 0; i < chunk.length; i++) {
            let pos = alphabet.indexOf(chunk[i]);
            if (pos === -1) continue;
            let shift = (seed + keyNums[i % keyNums.length]) % 46;
            let newPos = unveil 
                ? (pos - shift + 46) % 46 
                : (pos + shift) % 46;
            veiled += alphabet[newPos];
        }
        results.push(veiled);
    }
    
    return results;
}

function veil(message, key) {
    return nexCrypt(message, key, false);
}

function unveil(chunks, key) {
    const unveiled = nexCrypt(chunks.join(""), key, true);
    return unveiled.join("");
}

// Original Complex Logic (veil1/unveil1)
function nexCrypt1(message, key, unveil = false, states = null) {
    let keyNums = [];
    for (let char of key.toUpperCase()) {
        let pos = alphabet.indexOf(char);
        if (pos !== -1) keyNums.push(pos);
    }
    let seed = keyNums.reduce((a, b) => a + b, 0) % 46;
    
    const chunks = [];
    for (let i = 0; i < message.length; i += 4) {
        chunks.push(message.slice(i, i + 4));
    }
    
    const results = [];
    const chunkStates = [];
    
    for (let chunkIdx = 0; chunkIdx < chunks.length; chunkIdx++) {
        let chunk = chunks[chunkIdx];
        let veiled = "";
        let prev = seed;
        let echo = 0;
        let state = states ? states[chunkIdx] : { prev: [], echo: [], hashShift: [] };
        
        if (!unveil) {
            for (let i = 0; i < chunk.length; i++) {
                let pos = alphabet.indexOf(chunk[i]);
                if (pos === -1) continue;
                let edge = keyNums[i % keyNums.length];
                let hash = i === 0 ? "0" : crypto.createHash('sha256').update(alphabet[echo]).digest('hex');
                let hashShift = parseInt(hash[0], 16) % 46;
                let newPos = (pos + prev + echo + edge + hashShift) % 46;
                veiled += alphabet[newPos];
                state.prev.push(prev);
                state.echo.push(echo);
                state.hashShift.push(hashShift);
                echo = newPos;
                prev = pos;
            }
            chunkStates.push(state);
        } else {
            for (let i = 0; i < chunk.length; i++) {
                let pos = alphabet.indexOf(chunk[i]);
                if (pos === -1) continue;
                let savedPrev = state.prev[i];
                let savedEcho = state.echo[i];
                let savedHashShift = state.hashShift[i];
                let edge = keyNums[i % keyNums.length];
                let originalPos = (pos - savedPrev - savedEcho - edge - savedHashShift + 46) % 46;
                veiled += alphabet[originalPos];
            }
        }
        results.push(veiled);
    }
    
    return unveil ? results : { encrypted: results, states: chunkStates };
}

function veil1(message, key) {
    return nexCrypt1(message, key, false);
}

function unveil1(chunks, key, states) {
    const unveiled = nexCrypt1(chunks.join(""), key, true, states);
    return unveiled.join("");
}

module.exports = { veil, unveil, veil1, unveil1 };