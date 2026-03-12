/**
 * admin.js - Hirotix Admin Control Center Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initAdmin();
});

async function initAdmin() {
    const user = getCurrentUser();
    
    // Security check
    if (!user || user.role !== 'ADMIN') {
        window.location.href = 'login.html';
        return;
    }

    // Set UI details
    document.getElementById('admin-display-name').textContent = user.fullName || 'Administrator';
    
    // Load data
    await refreshUserDirectory();

    // Event listeners
    document.getElementById('logout-btn').addEventListener('click', () => {
        logout();
        window.location.href = 'index.html';
    });
}

async function refreshUserDirectory() {
    try {
        const response = await fetch(`${BASE_URL}/users`);
        if (!response.ok) throw new Error('Failed to fetch users');
        
        const users = await response.json();
        renderUserTable(users);
        updateDashboardStats(users);
    } catch (error) {
        console.error('Admin Fetch Error:', error);
        notifyUserError('Critical: Could not connect to user synchronization service.');
    }
}

function renderUserTable(users) {
    const tableBody = document.getElementById('admin-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div style="font-weight: 600;">${user.fullName}</div>
                <div style="font-size: 0.75rem; color: var(--admin-text-secondary);">${user.id}</div>
            </td>
            <td>${user.email}</td>
            <td><span class="badge badge-${user.role.toLowerCase().replace('_', '')}">${user.role}</span></td>
            <td>
                <button class="btn-delete" onclick="handleDeleteUser(${user.id}, '${user.fullName}')">
                    <ion-icon name="trash-outline"></ion-icon>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function updateDashboardStats(users) {
    const counts = {
        total: users.length,
        recruiters: users.filter(u => u.role === 'RECRUITER').length,
        seekers: users.filter(u => u.role === 'SEEKER').length
    };

    animateValue('stat-total-users', counts.total);
    animateValue('stat-recruiters', counts.recruiters);
    animateValue('stat-seekers', counts.seekers);
}

async function handleDeleteUser(id, name) {
    if (!confirm(`CAUTION: Are you sure you want to permanently delete user "${name}"? This action cannot be undone.`)) return;

    try {
        const response = await fetch(`${BASE_URL}/users/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            await refreshUserDirectory();
            alert('Security clearance verified: User removed from system.');
        } else {
            alert('Unauthorized: System could not process the deletion request.');
        }
    } catch (error) {
        console.error('Delete User Error:', error);
    }
}

function animateValue(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    
    let current = 0;
    const duration = 1000;
    const step = value / (duration / 16);
    
    const handler = setInterval(() => {
        current += step;
        if (current >= value) {
            el.textContent = value;
            clearInterval(handler);
        } else {
            el.textContent = Math.floor(current);
        }
    }, 16);
}

function notifyUserError(msg) {
    // Simple alert for now, can be upgraded to toast
    console.error(msg);
}
