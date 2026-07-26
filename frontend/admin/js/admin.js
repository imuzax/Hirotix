/**
 * admin.js - Hirotix Admin Suite Core Logic
 */

let allUsers = [];
let allJobs = [];

/**
 * Global Dashboard Overview
 */
async function loadDashboardStats() {
    const stats = await getAdminStats();
    if (stats) {
        safeUpdate('stat-total-users', stats.totalUsers);
        safeUpdate('stat-seeker-recruiter', `${stats.totalSeekers} / ${stats.totalRecruiters}`);
        safeUpdate('stat-total-jobs', stats.totalJobs);
    }
    
    // Simulate latency for the UI effect
    safeUpdate('stat-latency', Math.floor(Math.random() * (45 - 15) + 15));

    await renderOnboardingTable();
}

async function renderOnboardingTable() {
    const table = document.getElementById('onboarding-table');
    if (!table) return;

    const recentUsers = await getAdminOnboarding();
    
    if (recentUsers.length === 0) {
        table.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px;">No identities found.</td></tr>';
        return;
    }

    table.innerHTML = recentUsers.map(user => `
        <tr>
            <td>
                <div class="user-identity">
                    <div class="user-avatar">${user.fullName.charAt(0)}</div>
                    <div>
                        <div style="font-weight: 700;">${user.fullName}</div>
                        <div style="font-size: 0.75rem; color: var(--admin-text-secondary);">${user.email}</div>
                    </div>
                </div>
            </td>
            <td>Newly Registered</td>
            <td><span class="role-badge ${user.role?.toLowerCase().includes('seeker') ? 'role-seeker' : 'role-recruiter'}">${user.role}</span></td>
            <td style="text-align: right;">
                <button class="action-btn" title="View Permission" onclick="alert('User level: ${user.role}')"><ion-icon name="shield-outline"></ion-icon></button>
            </td>
        </tr>
    `).join('');
}

/**
 * User Management View
 */
async function loadAllUsersView() {
    allUsers = await getAllUsers();
    renderUsersList(allUsers);
}

function renderUsersList(users) {
    const table = document.getElementById('users-table-body');
    if (!table) return;

    if (users.length === 0) {
        table.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 40px;">No users found matching search.</td></tr>';
        return;
    }

    table.innerHTML = users.map(user => {
        const initials = user.fullName ? user.fullName.charAt(0).toUpperCase() : '?';
        const roleClass = user.role === 'SEEKER' ? 'role-seeker' : 'role-recruiter';
        
        return `
        <tr class="fade-up">
            <td>
                <div class="user-identity">
                    <div class="user-avatar" style="background: ${getRoleColor(user.role)}">${initials}</div>
                    <div style="font-weight: 700;">${user.fullName || 'Anonymous Identity'}</div>
                </div>
            </td>
            <td>${user.email}</td>
            <td><span class="role-badge ${roleClass}">${user.role}</span></td>
            <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'System Managed'}</td>
            <td style="text-align: right;">
                <div style="display: flex; gap: 8px; justify-content: flex-end;">
                    ${user.role === 'SEEKER' ? `
                    <a href="${getResumeViewUrl(user.id)}" target="_blank" class="action-btn" title="View Resume" style="color: var(--accent-color); display: flex; align-items: center; justify-content: center; text-decoration: none;">
                        <ion-icon name="document-outline"></ion-icon>
                    </a>
                    ` : ''}
                    <button class="action-btn edit" onclick="openEditUserModal(${user.id}, '${user.fullName}', '${user.email}', '${user.role}')" title="Modify Clearance">
                        <ion-icon name="create-outline"></ion-icon>
                    </button>
                    <button class="action-btn delete" onclick="confirmDeleteUser(${user.id}, '${user.fullName}')" title="Purge Identity">
                        <ion-icon name="trash-outline"></ion-icon>
                    </button>
                </div>
            </td>
        </tr>
        `;
    }).join('');
}

function getRoleColor(role) {
    if (role === 'ADMIN') return 'var(--admin-accent-gradient)';
    if (role === 'RECRUITER') return 'linear-gradient(135deg, #FF9F0A 0%, #FF375F 100%)';
    return 'linear-gradient(135deg, #32D74B 0%, #007AFF 100%)';
}

/**
 * Edit User Logic
 */
let currentEditingUserId = null;

function openEditUserModal(id, name, email, role) {
    currentEditingUserId = id;
    document.getElementById('editUserName').value = name;
    document.getElementById('editUserEmail').value = email;
    document.getElementById('editUserRole').value = role;
    document.getElementById('editUserModal').classList.add('active');
}

function closeEditUserModal() {
    document.getElementById('editUserModal').classList.remove('active');
    currentEditingUserId = null;
}

async function handleUpdateUser(e) {
    if (e) e.preventDefault();
    
    const updateData = {
        fullName: document.getElementById('editUserName').value,
        email: document.getElementById('editUserEmail').value,
        role: document.getElementById('editUserRole').value
    };

    try {
        const btn = document.getElementById('saveUserBtn');
        btn.disabled = true;
        btn.innerHTML = '<div class="loader-ring" style="display:block; width:16px; height:16px;"></div>Saving...';

        await updateUser(currentEditingUserId, updateData);
        
        closeEditUserModal();
        alert("Identity updated successfully across all sectors.");
        loadAllUsersView(); // Refresh list
    } catch (err) {
        alert("Sector update failed: " + err.message);
    } finally {
        const btn = document.getElementById('saveUserBtn');
        btn.disabled = false;
        btn.innerHTML = 'Commit Changes';
    }
}

async function confirmDeleteUser(id, name) {
    if (confirm(`CRITICAL: Are you sure you want to permanently remove "${name}" and all associated data? This action is irreversible.`)) {
        try {
            await deleteUser(id);
            alert("Identity purged successfully.");
            loadAllUsersView(); // Reload
        } catch (err) {
            alert("Error purging identity: " + err.message);
        }
    }
}

function filterUsers() {
    const query = document.getElementById('userSearch').value.toLowerCase();
    const filtered = allUsers.filter(u => 
        u.fullName.toLowerCase().includes(query) || 
        u.email.toLowerCase().includes(query)
    );
    renderUsersList(filtered);
}

/**
 * Job Oversight View
 */
async function loadAllJobsView() {
    allJobs = await getAllActiveJobs();
    const table = document.getElementById('jobs-table-body');
    if (!table) return;

    if (allJobs.length === 0) {
        table.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 40px;">No active job postings.</td></tr>';
        return;
    }

    table.innerHTML = allJobs.map(job => `
        <tr class="fade-up">
            <td>
                <div style="font-weight: 700; font-size: 1.1rem;">${job.title}</div>
                <div style="font-size: 0.8rem; color: var(--admin-text-secondary); margin-top: 3px;">Type: ${job.jobType || 'Standard'} • Status: Active</div>
            </td>
            <td>
                <div style="font-weight: 600;">${job.company}</div>
                <div style="font-size: 0.75rem; color: var(--admin-text-secondary);">Managed by: ${job.recruiter ? job.recruiter.fullName : 'Identity Purged'}</div>
            </td>
            <td><ion-icon name="location-outline" style="vertical-align: middle;"></ion-icon> ${job.location}</td>
            <td style="text-align: center;">---</td>
            <td style="text-align: right;">
                <button class="action-btn delete" onclick="confirmDeleteJob(${job.id})" title="Remove Post">
                    <ion-icon name="close-circle-outline" style="font-size: 1.2rem;"></ion-icon>
                </button>
            </td>
        </tr>
    `).join('');
}

async function confirmDeleteJob(id) {
    if (confirm("Remove this job posting from the public board?")) {
        try {
            await deleteJob(id);
            alert("Posting removed.");
            loadAllJobsView();
        } catch (err) {
            alert("Action failed.");
        }
    }
}

/**
 * Utils
 */
function safeUpdate(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

// Auto-init dashboard if on index
if (document.getElementById('stat-total-users')) {
    loadDashboardStats();
}
