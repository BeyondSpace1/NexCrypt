// Three.js Background
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('three-container').appendChild(renderer.domElement);

// Objects
const geometry = new THREE.IcosahedronGeometry(10, 1);
const material = new THREE.MeshPhongMaterial({ 
    color: 0x9333ea,
    wireframe: true,
    transparent: true,
    opacity: 0.5
});
const core = new THREE.Mesh(geometry, material);
scene.add(core);

const innerGeometry = new THREE.IcosahedronGeometry(5, 0);
const innerMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, emissive: 0x9333ea });
const innerCore = new THREE.Mesh(innerGeometry, innerMaterial);
scene.add(innerCore);

// Lights
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 60;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: '#ffffff',
    transparent: true,
    opacity: 0.8
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

camera.position.z = 40;

// Mouse Tracking
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - window.innerWidth / 2) / 100;
    mouseY = (event.clientY - window.innerHeight / 2) / 100;
});

// Animation Loop
const animate = () => {
    requestAnimationFrame(animate);

    core.rotation.x += 0.005;
    core.rotation.y += 0.005;
    innerCore.rotation.x -= 0.01;
    innerCore.rotation.z += 0.01;

    core.position.x += (mouseX - core.position.x) * 0.05;
    core.position.y += (-mouseY - core.position.y) * 0.05;

    particlesMesh.rotation.y += 0.001;

    renderer.render(scene, camera);
};

animate();

// NexCrypt Core Logic
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

function nexCrypt(message, key, isUnveil = false) {
    let keyNums = [];
    for (let char of key.toUpperCase()) {
        let pos = alphabet.indexOf(char);
        if (pos !== -1) keyNums.push(pos);
    }
    if (keyNums.length === 0) keyNums = [0];
    let seed = keyNums.reduce((a, b) => a + b, 0) % 46;
    
    const input = isUnveil ? message.split(",") : message.toUpperCase().split("");
    const chunks = [];
    if (!isUnveil) {
        for (let i = 0; i < input.length; i += 4) {
            chunks.push(input.slice(i, i + 4).join(""));
        }
    } else {
        input.forEach(i => chunks.push(i));
    }
    
    const results = [];
    for (let chunkIdx = 0; chunkIdx < chunks.length; chunkIdx++) {
        let chunk = chunks[chunkIdx];
        let processed = "";
        for (let i = 0; i < chunk.length; i++) {
            let pos = alphabet.indexOf(chunk[i]);
            if (pos === -1) continue;
            let shift = (seed + keyNums[i % keyNums.length]) % 46;
            let newPos = isUnveil 
                ? (pos - shift + 46) % 46 
                : (pos + shift) % 46;
            processed += alphabet[newPos];
        }
        results.push(processed);
    }
    
    return results;
}

// Live Action Functions
function runLiveAction(mode) {
    const input = document.getElementById('demoInput').value;
    const key = document.getElementById('demoKey').value;
    const container = document.getElementById('resultContainer');
    const processedOutput = document.getElementById('processedOutput');
    const simulationOutput = document.getElementById('simulationOutput');

    if (!input || !key) {
        alert("Please enter both a message and a key.");
        return;
    }

    container.classList.remove('hidden');
    simulationOutput.innerHTML = '';
    simulationOutput.classList.remove('opacity-0');
    
    const isUnveil = mode === 'unveil';
    const results = nexCrypt(input, key, isUnveil);
    
    processedOutput.innerText = isUnveil ? results.join("") : results.join(",");
    
    results.forEach((chunk, index) => {
        const div = document.createElement('div');
        div.className = 'glass-card p-4 rounded-xl border-white/10 overflow-hidden text-left';
        div.innerHTML = `
            <div class="text-[10px] text-gray-500 mb-2 uppercase">${index === 0 ? 'Local' : 'Node ' + index}</div>
            <div class="font-mono text-purple-400 break-all text-xs">${chunk}</div>
            <div class="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                <div class="h-full bg-purple-500 w-0 chunk-progress"></div>
            </div>
        `;
        simulationOutput.appendChild(div);

        anime({
            targets: div.querySelector('.chunk-progress'),
            width: '100%',
            easing: 'easeInOutQuad',
            duration: 800,
            delay: index * 100
        });

        anime({
            targets: div,
            translateY: [20, 0],
            opacity: [0, 1],
            easing: 'easeOutExpo',
            duration: 600,
            delay: index * 100
        });
    });

    // Animate output appearance
    anime({
        targets: '#processedOutput',
        scale: [0.98, 1],
        opacity: [0.5, 1],
        duration: 400,
        easing: 'easeOutQuad'
    });

    // Visual feedback in 3D scene
    anime({
        targets: core.scale,
        x: [1, 1.2, 1],
        y: [1, 1.2, 1],
        z: [1, 1.2, 1],
        duration: 600,
        easing: 'easeOutElastic(1, .8)'
    });
}

function resetDemo() {
    document.getElementById('demoInput').value = '';
    document.getElementById('demoKey').value = '';
    document.getElementById('resultContainer').classList.add('hidden');
    document.getElementById('simulationOutput').innerHTML = '';
}

// Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Chart.js
const ctx = document.getElementById('vulnerabilityChart').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Entry', 'Layer 1', 'Layer 2', 'Layer 3', 'Data Core'],
        datasets: [{
            label: 'Centralized Risk',
            data: [20, 40, 60, 80, 100],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.4
        }, {
            label: 'NexCrypt Risk',
            data: [10, 15, 12, 18, 5],
            borderColor: '#9333ea',
            backgroundColor: 'rgba(147, 51, 234, 0.1)',
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                labels: { color: '#94a3b8' }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#94a3b8' }
            },
            x: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#94a3b8' }
            }
        }
    }
});

// Anime.js Animations
anime({
    targets: '.animate-title',
    translateY: [50, 0],
    opacity: [0, 1],
    duration: 1500,
    easing: 'easeOutExpo',
    delay: 500
});

anime({
    targets: '.animate-fade-in',
    translateY: [20, 0],
    opacity: [0, 1],
    duration: 1000,
    easing: 'easeOutQuad',
    delay: 1000
});

// Scroll Reveal
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            anime({
                targets: entry.target,
                translateY: [30, 0],
                opacity: [0, 1],
                duration: 800,
                easing: 'easeOutQuad'
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.glass-card').forEach(card => {
    card.style.opacity = 0;
    observer.observe(card);
});
