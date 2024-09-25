document.addEventListener('DOMContentLoaded', function() {
    // Typing animation
    const typingElement = document.querySelector('.typing');
    const roles = ["Elliot Tuckerman", "a Machine Learning Engineer", "a Data Scientist", "a Game Developer"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentRole = roles[roleIndex];
        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(type, 100);
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }

    type();

    // Scroll functionality
    document.querySelectorAll('.scroll-arrow').forEach(arrow => {
        arrow.addEventListener('click', function() {
            const nextSection = this.closest('section').nextElementSibling;
            if (nextSection) {
                const offset = -10; // Adjust this value to scroll slightly lower
                const targetPosition = nextSection.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Resume modal
    const modal = document.getElementById('resume-modal');
    const btn = document.getElementById('resume-btn');
    const span = document.querySelector('.close');

    btn.onclick = () => {
        modal.style.display = 'block';
        setTimeout(() => modal.classList.add('show'), 10);
    }

    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    }

    span.onclick = closeModal;
    window.onclick = (event) => {
        if (event.target == modal) closeModal();
    }

    // Other functionality (chatbot, QA) remains the same...
});

function loadHeader() {
    fetch('/header.html')
        .then(response => response.text())
        .then(data => {
            const existingHeader = document.querySelector('header');
            if (existingHeader) {
                existingHeader.outerHTML = data;
            } else {
                document.body.insertAdjacentHTML('afterbegin', data);
            }
        })
        .catch(error => console.error('Error loading header:', error));
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadHeader);

document.addEventListener('DOMContentLoaded', function() {
    const chatbot = document.getElementById('chatbot');
    const chatbotHeader = document.getElementById('chatbot-header');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const typingIndicator = document.getElementById('typing-indicator');

    chatbotHeader.addEventListener('click', function() {
        chatbot.classList.toggle('open');
        if (chatbot.classList.contains('open') && chatbotMessages.children.length === 0) {
            typeWelcomeMessage();
            animatePlaceholder();
        }
    });

    chatbotInput.addEventListener('keypress', async function(e) {
        if (e.key === 'Enter') {
            const message = chatbotInput.value;
            if (message.trim() !== '') {
                addMessage('user', message);
                chatbotInput.value = '';
                await getBotResponse(message);
            }
        }
    });

    function typeWelcomeMessage() {
        const welcomeMessage = "Welcome to the Theme AI Assistant, type what you are thinking, and I'll match a theme to it!";
        addMessage('bot', welcomeMessage);
    }

    function animatePlaceholder() {
        const placeholders = [
            "The sun's golden rays warm my face",
            "A cerulean sky stretches endlessly above",
            "Emerald blades of grass tickle my toes",
            "The cyan waters of the Caribbean beckon",
            "A lush forest canopy surrounds me",
            "The inky night sky twinkles with stars",
            "A crimson drop of blood stains the snow",
            "Zesty lemon scent fills the air",
            "Juicy grapes burst with flavor",
            "Fluffy clouds drift lazily by",
            "Charcoal sketches come to life on paper"
        ];
        let i = 0;
        function changePlaceholder() {
            chatbotInput.setAttribute('placeholder', placeholders[i]);
            i = (i + 1) % placeholders.length;
            setTimeout(() => {
                chatbotInput.setAttribute('placeholder', '');
                setTimeout(changePlaceholder, 500);
            }, 3000); // Increased display time to 3 seconds for easier reading
        }
        changePlaceholder();
    }

    function addMessage(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = text;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        // Add a small delay before scrolling to ensure the new message is rendered
        setTimeout(() => {
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, 100);
    }

    function showTypingIndicator() {
        typingIndicator.style.display = 'block';
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function hideTypingIndicator() {
        typingIndicator.style.display = 'none';
    }

    async function getBotResponse(message) {
        showTypingIndicator();
        
        // Simulate bot thinking time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        hideTypingIndicator();

        const words = message.toLowerCase().split(' ');
        
        if (words.includes('reset')) {
            changeTheme('#00bcd4');
            addMessage('bot', "I've reset the theme to the original cyan color!");
            return;
        }
        
        for (let word of words) {
            const color = detectColorFromWord(word);
            if (color) {
                changeTheme(color);
                addMessage('bot', `I detected the word "${word}" which makes me think of the color ${color}. I've updated the theme to match!`);
                return;
            }
        }
        
        addMessage('bot', "I didn't detect any colors in your message. Try mentioning things like 'sun', 'sky', or 'grass', or type 'reset' to reset the theme!");
    }

    function changeTheme(color) {
        document.documentElement.style.setProperty('--primary-color', color);
        // You might want to adjust other color variables based on the primary color
        // For example:
        // document.documentElement.style.setProperty('--text-color', getContrastColor(color));
    }

    // Helper function to get a contrasting color (simplified version)
    function getContrastColor(color) {
        // This is a simple implementation. For better results, you might want to use a more sophisticated algorithm
        const rgb = parseInt(color.substr(1), 16);
        const brightness = ((rgb >> 16) & 255) * 0.299 + 
                           ((rgb >> 8) & 255) * 0.587 + 
                           (rgb & 255) * 0.114;
        return brightness > 186 ? '#000000' : '#FFFFFF';
    }

    async function predictTheme(input) {
        const embeddings = await encoder.embed(input);
        const prediction = await model.predict(embeddings).data();
        const themeIndex = prediction.indexOf(Math.max(...prediction));
        const themes = ['ocean', 'sunset', 'forest', 'night', 'desert'];
        return themes[themeIndex];
    }

    function addMessage(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = text;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        // Add a small delay before scrolling to ensure the new message is rendered
        setTimeout(() => {
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, 100);
    }

});

document.addEventListener('DOMContentLoaded', function() {
    const qaInput = document.getElementById('qa-input');
    const qaSubmit = document.getElementById('qa-submit');
    const qaResponse = document.getElementById('qa-response');

    qaSubmit.addEventListener('click', function() {
        const question = qaInput.value;
        if (question.trim() !== '') {
            getQAResponse(question);
        }
    });

    function getQAResponse(question) {
        // Simple QA response logic (can be replaced with AI model)
        let response = "I'm not sure about that.";
        if (question.toLowerCase().includes('jayco eagle')) {
            response = 'Yes, the Jayco Eagle has 1 queen size bed.';
        } else if (question.toLowerCase().includes('keystone cougar')) {
            response = 'The MSRP of the Keystone Cougar is $28,603.';
        }
        qaResponse.textContent = response;
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('resume-modal');
    const btn = document.getElementById('resume-btn');
    const span = document.getElementsByClassName('close')[0];

    btn.onclick = function() {
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    span.onclick = closeModal;

    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    var svgObject = document.querySelector('.notes-svg');
    svgObject.addEventListener('load', function() {
        var svgDoc = svgObject.contentDocument;
        var svgElement = svgDoc.documentElement;
        
        var panZoom = svgPanZoom(svgElement, {
            zoomEnabled: true,
            controlIconsEnabled: true,
            fit: 'width',
            center: true,
            minZoom: 0.1,
            maxZoom: 20,
            zoomScaleSensitivity: 0.3,
        });

        // Set initial zoom to fit the SVG width and then zoom out slightly
        panZoom.fit();
        panZoom.center();
        
        // Zoom out to 90% of the fitted view
        var zoomLevel = panZoom.getZoom() * 0.9;
        panZoom.zoom(zoomLevel);

        // Add custom zoom controls
        document.getElementById('zoom-in').addEventListener('click', function() { panZoom.zoomIn() });
        document.getElementById('zoom-out').addEventListener('click', function() { panZoom.zoomOut() });
        document.getElementById('reset').addEventListener('click', function() { 
            panZoom.resetZoom();
            panZoom.fit();
            panZoom.center();
            // Apply the 90% zoom after resetting
            panZoom.zoom(panZoom.getZoom() * 0.9);
        });

        // Adjust zoom on window resize
        window.addEventListener('resize', function() {
            panZoom.fit();
            panZoom.center();
            panZoom.zoom(panZoom.getZoom() * 0.9);
        });
    });
});

function detectColorFromWord(word) {
    const colorMap = {
        'sun': 'orange',
        'golden': 'orange',
        'sky': 'blue',
        'cerulean': 'blue',
        'grass': 'green',
        'emerald': 'green',
        'ocean': 'cyan',
        'caribbean': 'cyan',
        'forest': 'darkgreen',
        'night': 'darkblue',
        'inky': 'darkblue',
        'blood': 'red',
        'crimson': 'red',
        'lemon': 'yellow',
        'zesty': 'yellow',
        'grape': 'purple',
        'juicy': 'purple',
        'cloud': 'white',
        'fluffy': 'white',
        'coal': 'black',
        'charcoal': 'black',
        'reset': '#00bcd4'
    };
    
    return colorMap[word.toLowerCase()] || null;
}

