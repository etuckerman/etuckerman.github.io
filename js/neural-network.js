document.addEventListener('DOMContentLoaded', function() {
    let canvas, ctx, animationFrame;
    let nodes = [];
    let connections = [];
    let isAnimating = false;
    let heroImageElement;
    const layerStructure = [1, 3, 5, 3, 1];

    let nodeSize;
    let layerSpacing;
    let initialHeroPosition;

    function initializeCanvas() {
        console.log('Initializing canvas');
        canvas = document.createElement('canvas');
        canvas.id = 'neuralNetwork';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1';
        document.body.insertBefore(canvas, document.body.firstChild);
        ctx = canvas.getContext('2d');
        resizeCanvas();
    }

    function resizeCanvas() {
        const docWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth, document.documentElement.clientWidth);
        const docHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, document.documentElement.clientHeight);
        canvas.width = docWidth;
        canvas.height = docHeight;
        if (nodes.length > 0) {
            updateAndDraw();
        }
    }

    function createNetwork() {
        nodes = [];
        connections = [];
        const heroRect = heroImageElement.getBoundingClientRect();
        initialHeroPosition = {
            x: heroRect.left + window.pageXOffset + heroRect.width / 2,  // Center X
            y: heroRect.top + window.pageYOffset + heroRect.height / 2,  // Center Y
            width: heroRect.width,
            height: heroRect.height
        };
        nodeSize = Math.min(heroRect.width, heroRect.height) * 0.8;
        layerSpacing = nodeSize * 3;
    
        layerStructure.forEach((nodeCount, layerIndex) => {
            const newLayer = [];
            const startX = initialHeroPosition.x - (layerIndex * layerSpacing * 0.5);
            const startY = initialHeroPosition.y + (layerIndex * layerSpacing);
    
            for (let i = 0; i < nodeCount; i++) {
                const x = startX + (i - (nodeCount - 1) / 2) * (nodeSize * 2);
                const y = startY + (i - (nodeCount - 1) / 2) * (nodeSize * 0.8);
                newLayer.push({ x, y, size: nodeSize, progress: 0 });
            }
    
            nodes.push(newLayer);
    
            if (layerIndex > 0) {
                const prevLayer = nodes[layerIndex - 1];
                newLayer.forEach((node, nodeIndex) => {
                    prevLayer.forEach((prevNode, prevIndex) => {
                        connections.push({
                            start: [layerIndex - 1, prevIndex],
                            end: [layerIndex, nodeIndex],
                            progress: 0
                        });
                    });
                });
            }
        });
    }

    function drawNode(node) {
        const scaleFactor = window.devicePixelRatio || 1;
        ctx.save();
        ctx.scale(scaleFactor, scaleFactor);
        ctx.beginPath();
        ctx.arc(node.x / scaleFactor, node.y / scaleFactor, (node.size / 2 * node.progress) / scaleFactor, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(heroImageElement, 
            (node.x - node.size / 2) / scaleFactor, 
            (node.y - node.size / 2) / scaleFactor, 
            node.size / scaleFactor, 
            node.size / scaleFactor
        );
        ctx.restore();
    
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
        ctx.lineWidth = 2 / scaleFactor;
        ctx.beginPath();
        ctx.arc(node.x / scaleFactor, node.y / scaleFactor, (node.size / 2 * node.progress) / scaleFactor, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    function drawConnection(start, end, progress) {
        const scaleFactor = window.devicePixelRatio || 1;
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
        ctx.globalAlpha = progress * 0.3;
        ctx.lineWidth = 2 / scaleFactor;
        ctx.beginPath();
        ctx.moveTo(start.x / scaleFactor, start.y / scaleFactor);
        ctx.lineTo(
            (start.x + (end.x - start.x) * progress) / scaleFactor,
            (start.y + (end.y - start.y) * progress) / scaleFactor
        );
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
    
    function resizeCanvas() {
        const scaleFactor = window.devicePixelRatio || 1;
        const docWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth, document.documentElement.clientWidth);
        const docHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, document.documentElement.clientHeight);
        canvas.width = docWidth * scaleFactor;
        canvas.height = docHeight * scaleFactor;
        canvas.style.width = docWidth + 'px';
        canvas.style.height = docHeight + 'px';
        ctx.scale(scaleFactor, scaleFactor);
        if (nodes.length > 0) {
            updateAndDraw();
        }
    }
    function updateAndDraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let allComplete = true;

        nodes.forEach((layer, layerIndex) => {
            if (layerIndex === 0) return; // Skip rendering the first layer
            layer.forEach((node, nodeIndex) => {
                node.progress = Math.min(node.progress + 0.02, 1);
                if (node.progress < 1) allComplete = false;
                drawNode(node);
            });
        });

        connections.forEach(conn => {
            conn.progress = Math.min(conn.progress + 0.01, 1);
            if (conn.progress < 1) allComplete = false;
            const start = nodes[conn.start[0]][conn.start[1]];
            const end = nodes[conn.end[0]][conn.end[1]];
            drawConnection(start, end, conn.progress);
        });

        if (!allComplete) {
            animationFrame = requestAnimationFrame(updateAndDraw);
        } else {
            isAnimating = false;
            showClearButton();
        }
    }

    function startAnimation() {
        console.log('Starting animation');
        if (isAnimating) return;
        isAnimating = true;
        createNetwork();
        updateAndDraw();
    }

    function clearNetwork() {
        nodes = [];
        connections = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hideClearButton();
    }

    function createClearButton() {
        const button = document.createElement('div');
        button.id = 'clearNetworkButton';
        button.textContent = 'Clear Network';
        button.style.position = 'absolute';
        button.style.top = '0';
        button.style.left = '0';
        button.style.right = '0';
        button.style.bottom = '0';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.backgroundColor = 'rgba(128, 128, 128, 0.7)';
        button.style.color = 'white';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '14px';
        button.style.cursor = 'pointer';
        button.style.opacity = '0';
        button.style.transition = 'opacity 0.3s';
        button.style.pointerEvents = 'none';
        button.style.zIndex = '10';
        button.style.borderRadius = '50%';

        button.addEventListener('click', clearNetwork);

        const heroImageContainer = heroImageElement.parentElement;
        heroImageContainer.style.position = 'relative';
        heroImageContainer.appendChild(button);
    }

    function showClearButton() {
        const button = document.getElementById('clearNetworkButton');
        if (button) {
            button.style.opacity = '1';
            button.style.pointerEvents = 'auto';
        }
    }

    function hideClearButton() {
        const button = document.getElementById('clearNetworkButton');
        if (button) {
            button.style.opacity = '0';
            button.style.pointerEvents = 'none';
        }
    }

    function setupAnimation() {
        console.log('Setting up animation');
        initializeCanvas();
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('scroll', resizeCanvas);

        const heroImage = document.querySelector('.hero-image img');
        if (heroImage) {
            console.log('Hero image found');
            heroImage.style.cursor = 'pointer';
            heroImageElement = heroImage;
            
            heroImage.addEventListener('click', function(e) {
                console.log('Hero image clicked');
                e.preventDefault();
                e.stopPropagation();
                if (nodes.length === 0) {
                    startAnimation();
                }
            });

            createClearButton();
        } else {
            console.error('Hero image not found');
        }
    }

    setupAnimation();

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === "attributes" && mutation.attributeName === "data-theme") {
                updateAndDraw();
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
});