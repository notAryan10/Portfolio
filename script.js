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

const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');
    
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
    
    // Burger animation
    burger.classList.toggle('toggle');
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
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 1.5;
        this.baseRadius = this.radius;  
        this.targetRadius = this.radius;  
        this.color = this.getRandomColor();
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
        this.radius += (this.targetRadius - this.radius) * 0.1;

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Calculate distance to mouse
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Interactive radius based on mouse proximity
        if (distance < 150) {
            this.targetRadius = this.baseRadius * (1 + (150 - distance) / 30);
            
            // Add repulsion effect
            const angle = Math.atan2(dy, dx);
            const force = (150 - distance) * 0.003;
            this.vx -= Math.cos(angle) * force;
            this.vy -= Math.sin(angle) * force;
        } else {
            this.targetRadius = this.baseRadius;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// Create nodes
const nodes = Array.from({ length: 100 }, () => new Node());
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
        
        // Draw connections
        nodes.forEach(otherNode => {
            const dx = node.x - otherNode.x;
            const dy = node.y - otherNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(otherNode.x, otherNode.y);
                
                // Make connections more visible near mouse
                const mouseDistance = Math.min(
                    Math.sqrt((mouseX - node.x) ** 2 + (mouseY - node.y) ** 2),
                    Math.sqrt((mouseX - otherNode.x) ** 2 + (mouseY - otherNode.y) ** 2)
                );
                
                const opacity = mouseDistance < 150 
                    ? Math.min(1, (1 - distance / 100) * 1.5)
                    : 1 - distance / 100;
                
                ctx.strokeStyle = `rgba(33, 150, 243, ${opacity})`;
                ctx.lineWidth = mouseDistance < 150 ? 1 : 0.5;
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