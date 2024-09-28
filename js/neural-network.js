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

    let hasScrolledToBottom = false;
    let opacity = 1;

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

    function createNetwork() {
        nodes = [];
        connections = [];
        const heroRect = heroImageElement.getBoundingClientRect();
        initialHeroPosition = {
            x: heroRect.left + window.pageXOffset + heroRect.width / 2,
            y: heroRect.top + window.pageYOffset + heroRect.height / 2,
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
                            progress: 0,
                            flowOffset: Math.random()
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
    
    function drawConnection(start, end, progress, flowOffset) {
        const scaleFactor = window.devicePixelRatio || 1;
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 2 / scaleFactor;
    
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const length = Math.sqrt(dx * dx + dy * dy);
    
        // Set up the dash pattern
        const dashLength = 10;
        const gapLength = 5;
        ctx.setLineDash([dashLength, gapLength]);
        ctx.lineDashOffset = -flowOffset * (dashLength + gapLength);
    
        ctx.beginPath();
        ctx.moveTo(start.x / scaleFactor, start.y / scaleFactor);
        ctx.lineTo(
            (start.x + dx * progress) / scaleFactor,
            (start.y + dy * progress) / scaleFactor
        );
        ctx.stroke();
    
        // Reset dash pattern
        ctx.setLineDash([]);
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
            createNetwork();  // Recreate the network on resize
            updateAndDraw();
        }
    }

    function updateAndDraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        let allComplete = true;
    
        ctx.globalAlpha = opacity;
    
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
            conn.flowOffset = (conn.flowOffset + 0.005) % 1; // Reduced speed
            if (conn.progress < 1) allComplete = false;
            const start = nodes[conn.start[0]][conn.start[1]];
            const end = nodes[conn.end[0]][conn.end[1]];
            drawConnection(start, end, conn.progress, conn.flowOffset);
        });
    
        if (!allComplete || isAnimating || opacity > 0) {
            animationFrame = requestAnimationFrame(updateAndDraw);
        } else {
            clearNetwork();
        }
    }

    function startAnimation() {
        console.log('Starting animation');
        if (isAnimating) return;
        isAnimating = true;
        opacity = 1;
        createNetwork();
        updateAndDraw();
        
        // Start automatic scrolling after a short delay
        setTimeout(startAutoScroll, 1000);
    }

    function startAutoScroll() {
        const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, 
                                        document.documentElement.clientHeight, document.documentElement.scrollHeight, 
                                        document.documentElement.offsetHeight);
        const windowHeight = window.innerHeight;
        const scrollDistance = documentHeight - windowHeight;
        
        // Create a style element for the scroll animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes scrollAnimation {
                0% { transform: translateY(0); }
                45% { transform: translateY(-${scrollDistance}px); }
                55% { transform: translateY(-${scrollDistance}px); }
                100% { transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);

        // Apply the animation to the body
        document.body.style.overflow = 'hidden';
        document.body.style.animation = 'scrollAnimation 5s ease-in-out forwards';

        // Listen for the end of the animation
        document.body.addEventListener('animationend', function() {
            document.body.style.overflow = '';
            document.body.style.animation = '';
            document.head.removeChild(style);
            fadeOutNetwork();
        }, { once: true });
    }
    
    function clearNetwork() {
        console.log('Clearing network');
        nodes = [];
        connections = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        isAnimating = false;
        cancelAnimationFrame(animationFrame);
    }

    function setupAnimation() {
        console.log('Setting up animation');
        initializeCanvas();
        window.addEventListener('resize', resizeCanvas);

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
        } else {
            console.error('Hero image not found');
        }
    }

    function fadeOutNetwork() {
        isAnimating = true;
        function fade() {
            opacity -= 0.05;
            if (opacity > 0) {
                requestAnimationFrame(fade);
            } else {
                clearNetwork();
            }
            updateAndDraw();
        }
        fade();
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