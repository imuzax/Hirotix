// admin/js/messages.js

document.addEventListener('DOMContentLoaded', async () => {
    // Security Gate
    const user = getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
        window.location.href = '../login.html';
        return;
    }

    await loadMessages();
});

async function loadMessages() {
    const messagesTable = document.getElementById('messages-table');
    const messages = await getContacts();

    if (messages.length === 0) {
        messagesTable.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 40px; color: #555;">No messages found in the database.</td></tr>';
        return;
    }

    messagesTable.innerHTML = '';
    messages.forEach(msg => {
        const tr = document.createElement('tr');
        
        // Format Date
        const date = new Date(msg.createdAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        tr.innerHTML = `
            <td><div style="font-weight: 700;">${msg.fullName}</div></td>
            <td><div style="color: var(--admin-text-secondary); font-size: 0.85rem;">${msg.email}</div></td>
            <td><div class="job-category-badge" style="background: rgba(var(--admin-accent-rgb), 0.1); color: var(--admin-accent); border: 1px solid rgba(var(--admin-accent-rgb), 0.2);">${msg.subject}</div></td>
            <td><div style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #888;">${msg.message}</div></td>
            <td style="font-size: 0.85rem; color: #666;">${date}</td>
            <td>
                <button class="btn btn-outline" onclick="viewMessage('${msg.id}')" style="padding: 6px 12px; border-radius: 8px; font-size: 0.8rem;">View Full</button>
            </td>
        `;
        messagesTable.appendChild(tr);
    });

    // Store messages globally for modal access
    window._allMessages = messages;
}

function viewMessage(id) {
    const msg = window._allMessages.find(m => m.id == id);
    if (!msg) return;

    const modal = document.getElementById('messageModal');
    document.getElementById('modalSubject').textContent = msg.subject;
    document.getElementById('senderName').textContent = msg.fullName;
    document.getElementById('senderEmail').textContent = msg.email;
    document.getElementById('fullMessage').textContent = msg.message;
    document.getElementById('senderInitial').textContent = msg.fullName.charAt(0).toUpperCase();
    document.getElementById('replyEmail').href = `mailto:${msg.email}?subject=Re: ${msg.subject}`;

    modal.classList.add('active');
}

window.viewMessage = viewMessage; // Make it global
