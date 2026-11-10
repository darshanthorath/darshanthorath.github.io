// Lightweight Matrix-style background. Respects reduced-motion preferences.
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let columns = [], fontSize = 14, width = 0, height = 0, matrixFrame;

function resizeMatrix() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth; height = window.innerHeight;
  canvas.width = width * dpr; canvas.height = height * dpr;
  canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  fontSize = width < 600 ? 12 : 14;
  columns = Array.from({ length: Math.ceil(width / fontSize) }, () => Math.random() * -80);
}
function drawMatrix() {
  ctx.fillStyle = 'rgba(5, 9, 7, 0.12)';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#70ff9b';
  ctx.font = `${fontSize}px monospace`;
  const glyphs = '01{}[]<>/\\\\$#アイウエオカキクケコ';
  columns.forEach((y, x) => {
    const char = glyphs[Math.floor(Math.random() * glyphs.length)];
    ctx.fillText(char, x * fontSize, y * fontSize);
    columns[x] = y * fontSize > height && Math.random() > 0.975 ? 0 : y + 0.65;
  });
  matrixFrame = requestAnimationFrame(drawMatrix);
}
resizeMatrix();
if (!reducedMotion) drawMatrix();
else { ctx.fillStyle = '#050907'; ctx.fillRect(0,0,width,height); }
window.addEventListener('resize', () => { cancelAnimationFrame(matrixFrame); resizeMatrix(); if (!reducedMotion) drawMatrix(); });

// Typing title animation
const roles = ['Software Developer', 'Full-Stack Developer', 'Java Developer', 'Web Developer'];
const typedRole = document.getElementById('typedRole');
let roleIndex = 0, charIndex = roles[0].length, deleting = false;
function typeRole() {
  if (reducedMotion) return;
  const current = roles[roleIndex];
  if (!deleting) {
    charIndex++;
    typedRole.textContent = current.slice(0, charIndex);
    if (charIndex >= current.length) { deleting = true; setTimeout(typeRole, 1200); return; }
  } else {
    charIndex--;
    typedRole.textContent = current.slice(0, charIndex);
    if (charIndex <= 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
  }
  setTimeout(typeRole, deleting ? 42 : 75);
}
setTimeout(typeRole, 1400);

// Interactive, intentionally safe demo terminal: no shell commands are executed.
const terminalOutput = document.getElementById('terminalOutput');
const terminalForm = document.getElementById('terminalForm');
const terminalCommand = document.getElementById('terminalCommand');
const safeCommands = {
  help: 'Commands: help, about, skills, projects, contact, clear',
  about: 'Darshan Thorath — BE CSBS student, expected 2027. Interested in software and web development.',
  skills: 'Java | JavaScript | HTML | CSS | Node.js | Express.js | MongoDB | SQL | Git | REST APIs',
  projects: 'AI-Based Expense Tracker | Port Scan Analyzer | Gamified Sustainable Farming | Airplane Booking System',
  contact: 'Email: darshanthorath@gmail.com | Replace this with your preferred contact address before publishing.',
  clear: ''
};
function addTerminalLine(command, result) {
  const line = document.createElement('p');
  line.innerHTML = '<span class="green">root@darshan</span>:<span class="blue">~</span>$ ';
  const cmd = document.createElement('span');
  cmd.textContent = command;
  line.appendChild(cmd);
  terminalOutput.appendChild(line);
  if (result) {
    const output = document.createElement('p');
    output.className = 'dim';
    output.textContent = result;
    terminalOutput.appendChild(output);
  }
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}
function runCommand(raw) {
  const command = raw.trim().toLowerCase();
  if (!command) return;
  if (command === 'clear') { terminalOutput.innerHTML = '<p class="dim">Terminal cleared. Type <span class="green">help</span> to see commands.</p>'; return; }
  const result = safeCommands[command] || `Command not found: ${command}. Type help to list available portfolio commands.`;
  addTerminalLine(command, result);
}
terminalForm.addEventListener('submit', event => {
  event.preventDefault(); runCommand(terminalCommand.value); terminalCommand.value = '';
});
document.querySelectorAll('.term-command').forEach(button => {
  button.addEventListener('click', () => runCommand(button.dataset.command));
});
document.getElementById('clearTerminal').addEventListener('click', () => {
  terminalOutput.innerHTML = '<p class="dim">Terminal reset. Type <span class="green">help</span> to see available commands.</p>';
});

const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
menuToggle.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));
document.getElementById('year').textContent = new Date().getFullYear();

document.querySelectorAll('button, .button, .nav-resume').forEach(control => {
  control.addEventListener('click', event => {
    if (reducedMotion) return;
    const bounds = control.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'button-ripple';
    ripple.style.left = `${event.clientX - bounds.left}px`;
    ripple.style.top = `${event.clientY - bounds.top}px`;
    control.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  });
});

const backToTop = document.getElementById('backToTop');
function updateBackToTop() {
  backToTop.classList.toggle('visible', window.scrollY > 420);
}
window.addEventListener('scroll', updateBackToTop, { passive: true });
updateBackToTop();
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
