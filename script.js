document.addEventListener('DOMContentLoaded', function() {
    const typingElement = document.querySelector('.typing');
    const roles = ["a Machine Learning Engineer", "a Data Scientist", "a Games Developer"];
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