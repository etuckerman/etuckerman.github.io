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

// Function to load the common header
function loadHeader() {
    fetch('/header.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
        })
        .catch(error => console.error('Error loading header:', error));
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadHeader);

document.addEventListener('DOMContentLoaded', function() {
    const chatbotHeader = document.getElementById('chatbot-header');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');

    chatbotHeader.addEventListener('click', function() {
        const chatbot = document.getElementById('chatbot');
        chatbot.classList.toggle('open');
    });

    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const message = chatbotInput.value;
            if (message.trim() !== '') {
                addMessage('user', message);
                chatbotInput.value = '';
                getBotResponse(message);
            }
        }
    });

    function addMessage(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = text;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function getBotResponse(message) {
        // Simple bot response logic (currently under maintenance while I implement a new model)
        let response = 'Currently under maintenance while I implement a new model.';
        addMessage('bot', response);
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

