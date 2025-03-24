// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true
});


const text = "Frontend Developer | Coder";
let index = 0;
let isDeleting = false;
let typewriterElement = document.querySelector('.typewriter');

function typeWriter() {
    const currentText = text.substring(0, index);
    typewriterElement.textContent = currentText + '|';

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

// Mobile menu toggle
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

// Smooth scrolling for navigation links
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

// Mouse trail effect
class Trail {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 2;
        this.alpha = 1;
        this.hue = Math.random() * 30; // Slight color variation
    }
}

const trail = [];
const maxTrailLength = 50;

// Node class
class Node {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 1.5;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#2ecc71';
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
    
    // Add new trail point
    trail.push(new Trail(mouseX, mouseY));
    if (trail.length > maxTrailLength) {
        trail.shift();
    }
});

// Animation
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw trail
    for (let i = 0; i < trail.length - 1; i++) {
        const point = trail[i];
        const nextPoint = trail[i + 1];
        
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(nextPoint.x, nextPoint.y);
        
        const alpha = i / trail.length;
        ctx.strokeStyle = `rgba(46, 204, 113, ${alpha * 0.5})`;
        ctx.lineWidth = (i / trail.length) * 4;
        ctx.lineCap = 'round';
        ctx.stroke();
    }
    
    // Update and draw nodes
    nodes.forEach(node => {
        node.update();
        node.draw();
        
        // Draw connections
        nodes.forEach(otherNode => {
            const dx = node.x - otherNode.x;
            const dy = node.y - otherNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(otherNode.x, otherNode.y);
                ctx.strokeStyle = `rgba(46, 204, 113, ${1 - distance / 100})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        });

        // Interactive effect with mouse
        const dx = mouseX - node.x;
        const dy = mouseY - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
            const angle = Math.atan2(dy, dx);
            const force = (150 - distance) * 0.01;
            node.vx += Math.cos(angle) * force;
            node.vy += Math.sin(angle) * force;
            
            // Draw connection to mouse
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = `rgba(46, 204, 113, ${1 - distance / 150})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }

        // Apply friction
        node.vx *= 0.99;
        node.vy *= 0.99;
    });

    requestAnimationFrame(animate);
}

animate();

// Code-themed particle trail effect
class CodeTrail {
    constructor() {
        this.particles = [];
        this.maxParticles = 8;
        this.mouseX = 0;
        this.mouseY = 0;
        // Add array of programming-themed colors
        this.colors = [
            '#2ecc71',  // Green (original color)
            '#3498db',  // Blue
            '#e74c3c',  // Red
            '#f1c40f',  // Yellow
            '#9b59b6',  // Purple
            '#1abc9c',  // Turquoise
            '#e67e22',  // Orange
            '#00ff99'   // Bright mint
        ];
        this.codeSymbols = [
            '0', '1', '{', '}', '()', '=>', 
            '&&', '||', '++', '!=', '==',
            '<>', '//', '/*', '*/'
        ];

        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.createParticle();
        });

        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    createParticle() {
        if (this.particles.length >= this.maxParticles) {
            const oldestParticle = this.particles.shift();
            oldestParticle.element.remove();
        }

        const particle = document.createElement('div');
        particle.className = 'code-particle';
        
        // Randomly select a code symbol and color
        const symbol = this.codeSymbols[Math.floor(Math.random() * this.codeSymbols.length)];
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        particle.textContent = symbol;
        particle.style.color = color;
        
        // Add some random offset to particle position
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;
        
        particle.style.left = (this.mouseX + offsetX) + 'px';
        particle.style.top = (this.mouseY + offsetY) + 'px';
        document.body.appendChild(particle);

        const initialScale = 1;
        const finalScale = 0;
        let currentScale = initialScale;
        
        // Random rotation for more dynamic effect
        const rotation = Math.random() * 360;
        particle.style.transform = `scale(${initialScale}) rotate(${rotation}deg)`;

        this.particles.push({
            element: particle,
            initialX: this.mouseX + offsetX,
            initialY: this.mouseY + offsetY,
            rotation: rotation,
            scale: currentScale,
            updateScale: () => {
                currentScale -= 0.015;
                if (currentScale <= finalScale) {
                    currentScale = finalScale;
                }
                return currentScale;
            }
        });
    }

    animate() {
        this.particles.forEach((particle, index) => {
            const scale = particle.updateScale();
            if (scale <= 0) {
                particle.element.remove();
                this.particles.splice(index, 1);
            } else {
                particle.element.style.transform = 
                    `scale(${scale}) rotate(${particle.rotation}deg)`;
                particle.element.style.opacity = scale;
                
                particle.initialY -= 0.5;
                particle.element.style.top = particle.initialY + 'px';
            }
        });

        requestAnimationFrame(this.animate);
    }
}

// Initialize AOS and the code trail effect
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 3000,
        once: true
    });
    new CodeTrail();
}); 