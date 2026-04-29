/**
 * admin.js - Enterprise Suite Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Basic Admin Auth Check
    const user = JSON.parse(localStorage.getItem('hirotix_user'));
    if (!user || user.role !== 'ADMIN') {
        window.location.href = 'login.html';
        return;
    }

    if (document.getElementById('adminName')) {
        document.getElementById('adminName').textContent = user.fullName;
    }

    // Identify current page and load relevant data
    const path = window.location.pathname;
    if (path.includes('index.html') || path.endsWith('/admin/')) {
        loadDashboardStats();
    } else if (path.includes('users.html')) {
        loadUsersList();
    } else if (path.includes('jobs.html')) {
        loadJobsList();
    } else if (path.includes('applications.html')) {
        loadApplicationsList();
    }

    // Logout logic
    const logoutBtn = document.getElementById('adminLogout');
    if (logoutBtn) {
        logoutBtn.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem('hirotix_user');
            window.location.href = '../login.html';
        };
    }
});

// ---------- DASHBOARD LOGIC ---------- //

async function loadDashboardStats() {
    try {
        const stats = await getAdminStats();
        if (stats) {
            document.getElementById('totalUsers').textContent = stats.totalUsers;
            document.getElementById('totalJobs').textContent = stats.totalJobs;
            document.getElementById('totalApps').textContent = stats.totalApplications;
            document.getElementById('growthRate').textContent = stats.growthRate + '%';
        }

        const onboarding = await getAdminOnboarding();
        const usersTable = document.getElementById('recentUsersTable');
        if (usersTable && onboarding) {
            usersTable.innerHTML = onboarding.slice(0, 5).map(u => `
                <tr>
                    <td>
                        <div class="table-user-info">
                            <span class="user-name">${u.fullName}</span>
                            <span class="user-email">${u.email}</span>
                        </div>
                    </td>
                    <td><span class="badge ${u.role.toLowerCase()}">${u.role}</span></td>
                    <td><span class="status-dot online"></span> Active</td>
                    <td>Recently</td>
                </tr>
            `).join('');
        }
    } catch (err) { console.error("Admin Stats Error:", err); }
}

// ---------- USER MANAGEMENT ---------- //

let currentUsers = [];

async function loadUsersList() {
    const table = document.getElementById('usersListTable');
    try {
        currentUsers = await getAllUsers();
        renderUsers(currentUsers);

        document.getElementById('userSearch').oninput = (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = currentUsers.filter(u => 
                u.fullName.toLowerCase().includes(query) || 
                u.email.toLowerCase().includes(query)
            );
            renderUsers(filtered);
        };
    } catch (err) { table.innerHTML = '<tr><td colspan="5">Error loading users</td></tr>'; }
}

function renderUsers(users) {
    const table = document.getElementById('usersListTable');
    table.innerHTML = users.map(u => `
        <tr>
            <td>#${u.id}</td>
            <td><strong>${u.fullName}</strong></td>
            <td>${u.email}</td>
            <td><span class="badge ${u.role.toLowerCase()}">${u.role}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon edit" onclick="openEditModal(${u.id}, '${u.email}', '${u.role}')" title="Edit Role"><ion-icon name="create-outline"></ion-icon></button>
                    <button class="btn-icon delete" onclick="deleteUserPrompt(${u.id})" title="Delete User"><ion-icon name="trash-outline"></ion-icon></button>
                </div>
            </td>
        </tr>
    `).join('');
}

let editingUserId = null;
function openEditModal(id, email, role) {
    editingUserId = id;
    document.getElementById('editUserEmail').textContent = `Updating: ${email}`;
    document.getElementById('editUserRole').value = role;
    document.getElementById('editUserModal').classList.add('active');
}

function closeEditModal() {
    document.getElementById('editUserModal').classList.remove('active');
}

async function deleteUserPrompt(id) {
    if (confirm("Are you sure you want to delete this user? This cannot be undone.")) {
        try {
            await deleteUser(id);
            loadUsersList();
        } catch (err) { alert("Failed to delete user."); }
    }
}

document.getElementById('saveUserRole')?.addEventListener('click', async () => {
    const newRole = document.getElementById('editUserRole').value;
    try {
        const userToUpdate = currentUsers.find(u => u.id === editingUserId);
        await updateUser(editingUserId, { ...userToUpdate, role: newRole });
        closeEditModal();
        loadUsersList();
    } catch (err) { alert("Failed to update role"); }
});

// ---------- JOB MANAGEMENT ---------- //

async function loadJobsList() {
    const table = document.getElementById('jobsListTable');
    try {
        const jobs = await getAllActiveJobs();
        table.innerHTML = jobs.map(j => `
            <tr>
                <td><strong>${j.title}</strong></td>
                <td>${j.company}</td>
                <td>${j.location}</td>
                <td><span class="badge job">${j.jobType}</span></td>
                <td>
                    <button class="btn-icon delete" onclick="deleteJobPrompt(${j.id})"><ion-icon name="trash-outline"></ion-icon></button>
                </td>
            </tr>
        `).join('');
    } catch (err) { table.innerHTML = '<tr><td colspan="5">Error loading jobs</td></tr>'; }
}

async function deleteJobPrompt(id) {
    if (confirm("Delete this job posting?")) {
        try {
            await deleteJob(id);
            loadJobsList();
        } catch (err) { alert("Error deleting job"); }
    }
}

// ---------- APPLICATIONS TRACKING ---------- //

async function loadApplicationsList() {
    const table = document.getElementById('applicationsListTable');
    try {
        const apps = await getAdminApplications();
        table.innerHTML = apps.map(a => `
            <tr>
                <td><strong>${a.user.fullName}</strong></td>
                <td>${a.job.title}</td>
                <td>${a.job.company}</td>
                <td><span class="badge ${a.status.toLowerCase()}">${a.status}</span></td>
                <td>
                    <button class="btn-premium btn-small" onclick="viewResume(${a.user.id})">
                        <ion-icon name="document-outline"></ion-icon> View Resume
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (err) { table.innerHTML = '<tr><td colspan="5">Error loading applications</td></tr>'; }
}

function viewResume(userId) {
    const url = getResumeViewUrl(userId);
    window.open(url, '_blank');
}
