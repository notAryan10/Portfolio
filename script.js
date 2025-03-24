// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 3000,
    once: true
});


const text = "Frontend Developer | Coder";
let index = 0;
let isDeleting = false;
let typewriterElement = document.querySelector('.typewriter');

function typeWriter() {
    const currentText = text.substring(0, index);
    typewriterElement.textContent = currentText + '•';

    if (!isDeleting && index < text.length) {
        index++;
        setTimeout(typeWriter, 100);
    } else if (isDeleting && index > 0) {
        index--;
        setTimeout(typeWriter, 50);
    } else {
        isDeleting = !isDeleting;
        setTimeout(typeWriter, isDeleting ? 1000 : 200);
    }
}

typeWriter();

const primaryNav = document.querySelector('.nav-links');
const navToggle = document.querySelector('.burger');

navToggle.addEventListener('click', () => {
    const visibility = primaryNav.getAttribute('data-visible');
    
    if (visibility === "false") {
        primaryNav.setAttribute('data-visible', true);
        navToggle.setAttribute('aria-expanded', true);
    } else {
        primaryNav.setAttribute('data-visible', false);
        navToggle.setAttribute('aria-expanded', false);
    }
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!primaryNav.contains(e.target) && 
        !navToggle.contains(e.target) && 
        primaryNav.getAttribute('data-visible') === "true") {
        primaryNav.setAttribute('data-visible', false);
        navToggle.setAttribute('aria-expanded', false);
    }
});

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        primaryNav.setAttribute('data-visible', false);
        navToggle.setAttribute('aria-expanded', false);
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add scroll class to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Replace the matrix animation with the original network animation
const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Node class
class Node {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.radius = Math.random() * 1.2;
        this.baseRadius = this.radius;  
        this.targetRadius = this.radius;
        this.color = this.getRandomColor();
        this.currentOpacity = 0;
        this.targetOpacity = 0.7;
    }

    getRandomColor() {
        const colors = [
            '#2196F3', // blue
            '#9C27B0', // purple
            '#f0db4f', // JavaScript yellow
            '#FF5722', // orange
            '#4CAF50'  // green
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.radius += (this.targetRadius - this.radius) * 0.05;
        
        this.x += this.vx;
        this.y += this.vy;

        this.currentOpacity += (this.targetOpacity - this.currentOpacity) * 0.05;

        if (this.x < 0 || this.x > canvas.width) {
            this.vx *= -0.8;
            if (this.x < 0) this.x = 0;
            if (this.x > canvas.width) this.x = canvas.width;
        }
        if (this.y < 0 || this.y > canvas.height) {
            this.vy *= -0.8;
            if (this.y < 0) this.y = 0;
            if (this.y > canvas.height) this.y = canvas.height;
        }

        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
            this.targetRadius = this.baseRadius * (1 + (150 - distance) / 50);
            
            const angle = Math.atan2(dy, dx);
            const force = (150 - distance) * 0.001;
            this.vx -= Math.cos(angle) * force;
            this.vy -= Math.sin(angle) * force;
            
            const maxVelocity = 0.5;
            const currentVelocity = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (currentVelocity > maxVelocity) {
                this.vx = (this.vx / currentVelocity) * maxVelocity;
                this.vy = (this.vy / currentVelocity) * maxVelocity;
            }
        } else {
            this.targetRadius = this.baseRadius;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace(')', `, ${this.currentOpacity})`).replace('rgb', 'rgba');
        ctx.fill();
    }
}

// Create nodes
const nodes = Array.from({ length: 70 }, () => new Node());
let mouseX = 0;
let mouseY = 0;

// Track mouse movement
canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Animation
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw nodes
    nodes.forEach(node => {
        node.update();
        
        nodes.forEach(otherNode => {
            const dx = node.x - otherNode.x;
            const dy = node.y - otherNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
                // Calculate mouseDistance once
                const mouseDistance = Math.min(
                    Math.sqrt((mouseX - node.x) ** 2 + (mouseY - node.y) ** 2),
                    Math.sqrt((mouseX - otherNode.x) ** 2 + (mouseY - otherNode.y) ** 2)
                );
                
                // Apply glow effect
                if (mouseDistance < 150) {
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = 'rgba(33, 150, 243, 0.5)';
                } else {
                    ctx.shadowBlur = 0;
                }
                
                // Draw connection line
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(otherNode.x, otherNode.y);
                
                // Calculate opacity based on mouseDistance
                const opacity = mouseDistance < 150 
                    ? Math.min(0.5, (1 - distance / 120) * 0.8)
                    : (1 - distance / 120) * 0.3;
                
                ctx.strokeStyle = `rgba(33, 150, 243, ${opacity})`;
                ctx.lineWidth = mouseDistance < 150 ? 0.8 : 0.3;
                ctx.stroke();
            }
        });
        
        node.draw();
    });

    requestAnimationFrame(animate);
}

animate();

// Mouse trail effect
function createTrailParticle(x, y) {
    const colors = [
        '#f0db4f', // JavaScript yellow (more frequent)
        '#f0db4f', // Added twice to increase frequency
        '#2196F3', // blue
        '#9C27B0', // purple
        '#009688'  // teal
    ];
    const characters = '<>{}[]()=/+-*#@!';
    const particle = document.createElement('div');
    particle.className = 'code-particle';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.color = colors[Math.floor(Math.random() * colors.length)];
    particle.textContent = characters[Math.floor(Math.random() * characters.length)];
    
    document.body.appendChild(particle);

    // Animate and remove the particle
    let opacity = 1;
    let posY = y;
    
    const animate = () => {
        opacity -= 0.02;
        posY -= 1;
        
        particle.style.opacity = opacity;
        particle.style.top = posY + 'px';
        
        if (opacity > 0) {
            requestAnimationFrame(animate);
        } else {
            particle.remove();
        }
    };
    
    requestAnimationFrame(animate);
}

// Track mouse movement
let lastX = 0;
let lastY = 0;
let throttleTimer;

document.addEventListener('mousemove', (e) => {
    if (!throttleTimer) {
        throttleTimer = setTimeout(() => {
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 20) { // Only create particle after some movement
                createTrailParticle(e.clientX, e.clientY);
                lastX = e.clientX;
                lastY = e.clientY;
            }
            
            throttleTimer = null;
        }, 50); // Throttle to create particle every 50ms
    }
});

// Add interactive particle burst on click
document.addEventListener('click', (e) => {
    createParticleBurst(e.clientX, e.clientY);
});

function createParticleBurst(x, y) {
    const particleCount = 8;
    const angleStep = (2 * Math.PI) / particleCount;
    const colors = ['#2196F3', '#9C27B0', '#f0db4f', '#FF5722', '#4CAF50'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'code-particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.color = colors[Math.floor(Math.random() * colors.length)];
        particle.textContent = '•';
        
        document.body.appendChild(particle);

        const angle = i * angleStep;
        const velocity = 5;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let posX = x;
        let posY = y;
        let opacity = 1;
        
        const animate = () => {
            opacity -= 0.02;
            posX += vx;
            posY += vy;
            
            particle.style.opacity = opacity;
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// Add magnetic effect to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        btn.style.transform = `translate(
            ${(x - rect.width / 2) / 10}px, 
            ${(y - rect.height / 2) / 10}px
        )`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

// Add tilt effect to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = -(x - centerX) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// Create cursor elements
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

// Create multiple trail elements
const numTrails = 5;
const trails = [];
for (let i = 0; i < numTrails; i++) {
    const trail = document.createElement('div');
    trail.classList.add('cursor-trail');
    document.body.appendChild(trail);
    trails.push({
        element: trail,
        x: 0,
        y: 0
    });
}

// Update cursor position
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Animate cursor and trails
function animateCursor() {
    // Smooth cursor movement
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    
    // Update main cursor
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    
    // Update trails with delay
    trails.forEach((trail, index) => {
        // Calculate delayed position
        trail.x += (cursorX - trail.x) * (0.1 - index * 0.012);
        trail.y += (cursorY - trail.y) * (0.1 - index * 0.012);
        
        // Apply position
        trail.element.style.left = `${trail.x}px`;
        trail.element.style.top = `${trail.y}px`;
        
        // Update size and opacity based on position in trail
        const scale = 1 - (index * 0.15);
        const opacity = 1 - (index * 0.15);
        trail.element.style.transform = `translate(-50%, -50%) scale(${scale})`;
        trail.element.style.opacity = opacity;
    });
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Add cursor effects for interactive elements
document.querySelectorAll('a, button, .project-card').forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursor.style.borderColor = 'var(--primary-purple)';
        cursor.style.background = 'rgba(33, 150, 243, 0.1)';
    });
    
    element.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.borderColor = 'var(--primary-blue)';
        cursor.style.background = 'transparent';
    });
});

// Hide cursor when leaving the window
document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    trails.forEach(trail => {
        trail.element.style.opacity = '0';
    });
});

document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    trails.forEach((trail, index) => {
        trail.element.style.opacity = 1 - (index * 0.15);
    });
});

// Add click interaction
canvas.addEventListener('click', (e) => {
    const clickX = e.clientX;
    const clickY = e.clientY;
    
    // Create ripple effect
    createRipple(clickX, clickY);
    
    // Push particles away from click
    nodes.forEach(node => {
        const dx = node.x - clickX;
        const dy = node.y - clickY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
            const angle = Math.atan2(dy, dx);
            const force = (200 - distance) * 0.02;
            node.vx += Math.cos(angle) * force;
            node.vy += Math.sin(angle) * force;
        }
    });
});

// Ripple effect
function createRipple(x, y) {
    let radius = 0;
    let opacity = 1;
    
    function drawRipple() {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(33, 150, 243, ${opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        radius += 5;
        opacity -= 0.02;
        
        if (opacity > 0) {
            requestAnimationFrame(drawRipple);
        }
    }
    
    drawRipple();
}

// Add hover interaction zone
let hoverZone = {
    x: 0,
    y: 0,
    radius: 150,
    active: false
};

canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    hoverZone.x = e.clientX;
    hoverZone.y = e.clientY;
    hoverZone.active = true;
});

canvas.addEventListener('mouseleave', () => {
    hoverZone.active = false;
}); 