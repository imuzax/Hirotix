/**
 * theme.js - Global Theme Management for Hirotix
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
});

function initTheme() {
    const savedTheme = localStorage.getItem('hirotix_theme') || 'light';
    setTheme(savedTheme);

    // Inject theme toggle button
    const sidebar = document.querySelector('.sidebar-nav') || document.querySelector('.sidebar');
    const navbar = document.querySelector('.nav-buttons') || document.querySelector('.navbar');

    if (!document.getElementById('themeToggle')) {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'themeToggle';

        if (sidebar) {
            toggleBtn.className = 'nav-item-btn theme-switcher';
            toggleBtn.style.marginTop = 'auto'; // Push to bottom
            const footer = sidebar.querySelector('.sidebar-footer') || sidebar.querySelector('.logout-btn');
            if (footer) {
                sidebar.insertBefore(toggleBtn, footer);
            } else {
                sidebar.appendChild(toggleBtn);
            }
        } else {
            // Navbar or Floating style
            toggleBtn.className = navbar ? 'theme-switcher-navbar' : 'btn btn-outline floating-theme-toggle';
            if (navbar) {
                navbar.prepend(toggleBtn);
            } else {
                document.body.appendChild(toggleBtn);
            }
        }

        toggleBtn.innerHTML = `
            <ion-icon name="${savedTheme === 'light' ? 'moon-outline' : 'sunny-outline'}" class="nav-icon"></ion-icon>
            <span class="theme-label">${savedTheme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        `;
        toggleBtn.onclick = toggleTheme;
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hirotix_theme', theme);

    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.innerHTML = `
            <ion-icon name="${theme === 'light' ? 'moon-outline' : 'sunny-outline'}" class="nav-icon"></ion-icon>
            <span class="theme-label">${theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        `;
    }
}
