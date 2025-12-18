// ===================================
// GLOBAL VARIABLES & INITIALIZATION
// ===================================

// Set your birthday date here (YYYY, MM-1, DD) - Months are 0-indexed
const birthdayDate = new Date(2025, 11, 20, 0, 0, 0); // December 20, 2025


// DOM Elements
const musicBtn = document.getElementById('musicBtn');
const birthdayMusic = document.getElementById('birthdayMusic');
const countdownSection = document.getElementById('countdownSection');
const birthdayReached = document.getElementById('birthdayReached');
const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const cakeBtn = document.getElementById('cakeBtn');
const surpriseBtn = document.getElementById('surpriseBtn');
const hiddenWish = document.getElementById('hiddenWish');
const cake = document.querySelector('.cake');
const knife = document.getElementById('knife');
const confettiContainer = document.getElementById('confettiContainer');

// State
let musicPlaying = false;
let countdownInterval = null;
let isBirthdayToday = false;
let cakeCut = false;

// ===================================
// COUNTDOWN TIMER
// ===================================

/**
 * Updates the countdown timer every second
 */
function updateCountdown() {
    const now = new Date();
    const timeRemaining = birthdayDate - now;

    // Check if birthday has arrived
    if (timeRemaining <= 0) {
        clearInterval(countdownInterval);
        showBirthdayReached();
        return;
    }

    // Calculate time units
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    // Update DOM with zero-padding
    daysElement.textContent = String(days).padStart(2, '0');
    hoursElement.textContent = String(hours).padStart(2, '0');
    minutesElement.textContent = String(minutes).padStart(2, '0');
    secondsElement.textContent = String(seconds).padStart(2, '0');

    // Add pulse animation to seconds
    secondsElement.parentElement.style.transform = 'scale(1.1)';
    setTimeout(() => {
        secondsElement.parentElement.style.transform = 'scale(1)';
    }, 200);
}

/**
 * Shows birthday reached message and triggers celebration
 */
function showBirthdayReached() {
    isBirthdayToday = true;
    
    // Hide countdown, show birthday message
    countdownSection.style.display = 'none';
    birthdayReached.style.display = 'block';
    
    // Auto-trigger celebration
    setTimeout(() => {
        triggerConfetti(150);
        playMusic();
    }, 500);
    
    // Change cake button text
    cakeBtn.innerHTML = '<span>🎂 It\'s Time to Celebrate! 🎂</span>';
}

// Initialize countdown
countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call

// ===================================
// MUSIC CONTROL
// ===================================

/**
 * Plays the birthday music
 */
function playMusic() {
    birthdayMusic.play()
        .then(() => {
            musicPlaying = true;
            musicBtn.classList.add('playing');
        })
        .catch(error => {
            console.log('Music autoplay prevented:', error);
        });
}

/**
 * Pauses the birthday music
 */
function pauseMusic() {
    birthdayMusic.pause();
    musicPlaying = false;
    musicBtn.classList.remove('playing');
}

/**
 * Toggles music play/pause
 */
musicBtn.addEventListener('click', () => {
    if (musicPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
});

// ===================================
// CONFETTI SYSTEM
// ===================================

/**
 * Creates a single confetti piece
 * @param {number} x - Starting X position (0-100)
 * @returns {HTMLElement} Confetti element
 */
function createConfettiPiece(x) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    
    // Random properties
    const colors = ['#FF6B9D', '#C44569', '#FFC312', '#12CBC4', '#FDA7DF', '#ED4C67', '#F79F1F', '#A3CB38'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomSize = Math.random() * 10 + 5; // 5-15px
    const randomDuration = Math.random() * 3 + 2; // 2-5 seconds
    const randomDelay = Math.random() * 0.5; // 0-0.5s delay
    const randomRotation = Math.random() * 360;
    
    // Shapes
    const shapes = ['square', 'circle', 'triangle'];
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    
    // Styling
    confetti.style.left = x + '%';
    confetti.style.width = randomSize + 'px';
    confetti.style.height = randomSize + 'px';
    confetti.style.backgroundColor = randomColor;
    confetti.style.animationDuration = randomDuration + 's';
    confetti.style.animationDelay = randomDelay + 's';
    confetti.style.transform = `rotate(${randomRotation}deg)`;
    
    // Shape variations
    if (randomShape === 'circle') {
        confetti.style.borderRadius = '50%';
    } else if (randomShape === 'triangle') {
        confetti.style.width = '0';
        confetti.style.height = '0';
        confetti.style.backgroundColor = 'transparent';
        confetti.style.borderLeft = `${randomSize / 2}px solid transparent`;
        confetti.style.borderRight = `${randomSize / 2}px solid transparent`;
        confetti.style.borderBottom = `${randomSize}px solid ${randomColor}`;
    }
    
    return confetti;
}

/**
 * Triggers confetti animation
 * @param {number} count - Number of confetti pieces to create
 */
function triggerConfetti(count = 100) {
    // Clear existing confetti
    confettiContainer.innerHTML = '';
    
    // Create new confetti pieces
    for (let i = 0; i < count; i++) {
        const x = Math.random() * 100; // Random X position (0-100%)
        const confetti = createConfettiPiece(x);
        confettiContainer.appendChild(confetti);
    }
    
    // Clean up after animation
    setTimeout(() => {
        confettiContainer.innerHTML = '';
    }, 6000);
}

// ===================================
// CAKE CUTTING ANIMATION
// ===================================

/**
 * Handles cake cutting animation
 */
function cutCake() {
    if (cakeCut) return; // Prevent multiple cuts
    
    cakeCut = true;
    
    // Blow out candles first
    cake.classList.add('blow-candles');
    
    setTimeout(() => {
        // Show knife animation
        knife.classList.add('cutting');
        
        // Cut cake after knife appears
        setTimeout(() => {
            cake.classList.add('cut');
            
            // Trigger confetti
            triggerConfetti(200);
            
            // Play music if not playing
            if (!musicPlaying) {
                playMusic();
            }
            
            // Show celebration message
            showCelebrationMessage();
            
            // Reset after animation
            setTimeout(() => {
                resetCake();
            }, 3000);
        }, 1000);
    }, 800);
}

/**
 * Shows temporary celebration message
 */
function showCelebrationMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, rgba(255, 107, 157, 0.95), rgba(255, 195, 18, 0.95));
        padding: 2rem 3rem;
        border-radius: 20px;
        border: 3px solid white;
        font-size: clamp(1.5rem, 4vw, 2.5rem);
        font-weight: 800;
        color: white;
        text-align: center;
        z-index: 10000;
        animation: celebrationBounce 0.6s ease-out;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    `;
    message.textContent = '🎉 Happy Birthday! 🎉';
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'fadeOut 0.5s ease-out forwards';
        setTimeout(() => message.remove(), 500);
    }, 2500);
}

/**
 * Resets cake to initial state
 */
function resetCake() {
    cake.classList.remove('blow-candles', 'cut');
    knife.classList.remove('cutting');
    cakeCut = false;
}

// Cake button click handler
cakeBtn.addEventListener('click', cutCake);

// ===================================
// SURPRISE BUTTON
// ===================================

/**
 * Reveals hidden birthday wish
 */
let surpriseRevealed = false;

surpriseBtn.addEventListener('click', () => {
    if (!surpriseRevealed) {
        // Reveal wish
        hiddenWish.classList.add('revealed');
        surpriseBtn.innerHTML = '<span>✨ Thank You! ✨</span>';
        surpriseRevealed = true;
        
        // Trigger confetti
        setTimeout(() => {
            triggerConfetti(100);
        }, 300);
        
        // Play music if not playing
        if (!musicPlaying) {
            playMusic();
        }
    } else {
        // Hide wish
        hiddenWish.classList.remove('revealed');
        surpriseBtn.innerHTML = '<span>🎁 Click for Surprise 🎁</span>';
        surpriseRevealed = false;
    }
});

// ===================================
// PROFILE IMAGE UPLOAD (Optional)
// ===================================

/**
 * Allows changing profile image by clicking
 */
const profileImg = document.getElementById('profileImg');

profileImg.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                profileImg.src = event.target.result;
                
                // Add animation
                profileImg.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    profileImg.style.transform = 'scale(1)';
                }, 300);
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
});

// Add cursor pointer to indicate clickability
profileImg.style.cursor = 'pointer';
profileImg.title = 'Click to change image';

// ===================================
// BIRTHDAY NAME EDITING
// ===================================

/**
 * Handle birthday name editing
 */
const birthdayName = document.getElementById('birthdayName');

birthdayName.addEventListener('blur', () => {
    // Save to localStorage
    localStorage.setItem('birthdayName', birthdayName.textContent);
});

// Load saved name on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedName = localStorage.getItem('birthdayName');
    if (savedName) {
        birthdayName.textContent = savedName;
    }
});

// ===================================
// VIDEO BACKGROUND HANDLING
// ===================================

/**
 * Ensures video plays on mobile devices
 */
const bgVideo = document.getElementById('bgVideo');

// Try to play video
bgVideo.play().catch(() => {
    console.log('Video autoplay prevented');
});

// Retry video play on user interaction
document.addEventListener('click', function playVideoOnce() {
    bgVideo.play();
    document.removeEventListener('click', playVideoOnce);
}, { once: true });

// ===================================
// MOBILE OPTIMIZATION
// ===================================

/**
 * Detects mobile device
 * @returns {boolean} True if mobile
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Optimizes performance for mobile
 */
if (isMobile()) {
    // Reduce confetti on mobile for better performance
    const originalTriggerConfetti = triggerConfetti;
    triggerConfetti = function(count) {
        originalTriggerConfetti(Math.min(count, 50)); // Max 50 pieces on mobile
    };
    
    // Add touch feedback
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        button.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// ===================================
// KEYBOARD SHORTCUTS
// ===================================

/**
 * Keyboard shortcuts for accessibility
 */
document.addEventListener('keydown', (e) => {
    // Space or Enter on cake = cut cake
    if ((e.code === 'Space' || e.code === 'Enter') && document.activeElement === cakeBtn) {
        e.preventDefault();
        cutCake();
    }
    
    // M = toggle music
    if (e.code === 'KeyM') {
        if (musicPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    }
    
    // C = trigger confetti
    if (e.code === 'KeyC') {
        triggerConfetti(100);
    }
});

// ===================================
// PARTICLE EFFECTS (Optional Enhancement)
// ===================================

/**
 * Creates floating balloon effect
 */
function createBalloon() {
    const balloon = document.createElement('div');
    balloon.textContent = '🎈';
    balloon.style.cssText = `
        position: fixed;
        bottom: -50px;
        left: ${Math.random() * 100}%;
        font-size: ${Math.random() * 20 + 30}px;
        z-index: 1;
        pointer-events: none;
        animation: balloonFloat ${Math.random() * 5 + 8}s linear forwards;
    `;
    
    document.body.appendChild(balloon);
    
    setTimeout(() => balloon.remove(), 13000);
}

// Add balloon animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes balloonFloat {
        0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-120vh) translateX(${Math.random() * 100 - 50}px) rotate(${Math.random() * 360}deg);
            opacity: 0;
        }
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
    }
`;
document.head.appendChild(style);

// Create balloons periodically
setInterval(() => {
    if (Math.random() > 0.7) { // 30% chance every 5 seconds
        createBalloon();
    }
}, 5000);

// ===================================
// WELCOME ANIMATION
// ===================================

/**
 * Triggers welcome confetti on page load
 */
window.addEventListener('load', () => {
    setTimeout(() => {
        triggerConfetti(80);
    }, 1000);
});

// ===================================
// SMOOTH SCROLLING
// ===================================

/**
 * Smooth scroll behavior for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================================
// PERFORMANCE MONITORING
// ===================================

/**
 * Logs performance metrics (for debugging)
 */
if (window.performance) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`🎉 Page loaded in ${pageLoadTime}ms`);
        }, 0);
    });
}

// ===================================
// ERROR HANDLING
// ===================================

/**
 * Global error handler
 */
window.addEventListener('error', (e) => {
    console.error('Error occurred:', e.error);
});

/**
 * Unhandled promise rejection handler
 */
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// ===================================
// CLEANUP ON PAGE UNLOAD
// ===================================

/**
 * Cleanup resources before page unload
 */
window.addEventListener('beforeunload', () => {
    // Clear countdown interval
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    // Pause music
    pauseMusic();
    
    // Clear confetti
    confettiContainer.innerHTML = '';
});

// ===================================
// CONSOLE MESSAGE
// ===================================

console.log(`
🎉🎂🎈 HAPPY BIRTHDAY WEBSITE 🎈🎂🎉

Keyboard Shortcuts:
- M: Toggle Music
- C: Trigger Confetti
- Click profile image to change it
- Edit name by clicking on it

Enjoy the celebration! 🥳
`);