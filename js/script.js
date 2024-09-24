document.addEventListener('DOMContentLoaded', function() {
    const typingElement = document.querySelector('.typing');
    const roles = ["Elliot Tuckerman", "a Machine Learning Engineer", "a Data Scientist", "a Game Developer"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const delayBetweenRoles = 2000;

    function type() {
        const currentRole = roles[roleIndex];
        if (isDeleting) {
            typingElement.innerHTML = currentRole.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                setTimeout(type, typingSpeed);
            } else {
                setTimeout(type, deletingSpeed);
            }
        } else {
            typingElement.innerHTML = currentRole.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentRole.length) {
                isDeleting = true;
                setTimeout(type, delayBetweenRoles);
            } else {
                setTimeout(type, typingSpeed);
            }
        }
    }

    type();
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
    const scrollArrows = document.querySelectorAll('.scroll-arrow');
    
    scrollArrows.forEach(arrow => {
        arrow.addEventListener('click', function() {
            const currentSection = this.closest('section');
            const nextSection = currentSection.nextElementSibling;
            
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

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