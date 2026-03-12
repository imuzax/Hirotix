/**
 * resume-builder.js - Real-time Resume Generation Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initial content
    updatePreview();

    // Template Selector listener
    const templateSelector = document.getElementById('templateSelector');
    if (templateSelector) {
        templateSelector.addEventListener('change', (e) => {
            const preview = document.getElementById('resumePreview');
            preview.className = `resume-paper ${e.target.value}`;
            updatePreview();
        });
    }

    // Try to pre-fill from profile
    prefillFromProfile();
});

function addItem(type) {
    const listId = type === 'experience' ? 'experienceList' : 'educationList';
    const container = document.getElementById(listId);
    const newItem = document.createElement('div');
    newItem.className = 'dynamic-item card';

    if (type === 'experience') {
        newItem.innerHTML = `
            <input type="text" class="form-control exp-title" placeholder="Company Name" oninput="updatePreview()">
            <input type="text" class="form-control exp-role" placeholder="Role (e.g. Senior Dev)" oninput="updatePreview()">
            <input type="text" class="form-control exp-date" placeholder="Duration" oninput="updatePreview()">
            <textarea class="form-control exp-desc" placeholder="Key responsibilities..." oninput="updatePreview()" rows="3"></textarea>
            <button class="remove-btn" onclick="this.parentElement.remove(); updatePreview()" style="position:absolute; top:5px; right:5px; border:none; background:none; color:red; cursor:pointer;">×</button>
        `;
    } else {
        newItem.innerHTML = `
            <input type="text" class="form-control edu-school" placeholder="University" oninput="updatePreview()">
            <input type="text" class="form-control edu-degree" placeholder="Degree" oninput="updatePreview()">
            <input type="text" class="form-control edu-date" placeholder="Year" oninput="updatePreview()">
            <button class="remove-btn" onclick="this.parentElement.remove(); updatePreview()" style="position:absolute; top:5px; right:5px; border:none; background:none; color:red; cursor:pointer;">×</button>
        `;
    }
    container.appendChild(newItem);
    updatePreview();
}

function updatePreview() {
    const preview = document.getElementById('resumePreview');
    const template = document.getElementById('templateSelector').value;

    const data = {
        name: document.getElementById('fullName').value || 'MUZAFFAR HUSSAIN',
        title: document.getElementById('jobTitle').value || 'Full Stack Developer',
        email: document.getElementById('email').value || 'muza@example.com',
        phone: document.getElementById('phone').value || '+91 9876543210',
        location: document.getElementById('location').value || 'Pune, India',
        website: document.getElementById('website').value || 'linkedin.com/in/muza',
        skills: document.getElementById('skillsInput').value.split(',').map(s => s.trim()).filter(s => s),
        experience: getDynamicData('experience'),
        education: getDynamicData('education')
    };

    if (template === 'modern') {
        renderModernTemplate(preview, data);
    } else if (template === 'professional') {
        renderProfessionalTemplate(preview, data);
    } else if (template === 'creative') {
        renderCreativeTemplate(preview, data);
    }
}

function getDynamicData(type) {
    const items = [];
    if (type === 'experience') {
        document.querySelectorAll('#experienceList .dynamic-item').forEach(el => {
            items.push({
                company: el.querySelector('.exp-title').value,
                role: el.querySelector('.exp-role').value,
                date: el.querySelector('.exp-date').value,
                desc: el.querySelector('.exp-desc').value
            });
        });
    } else {
        document.querySelectorAll('#educationList .dynamic-item').forEach(el => {
            items.push({
                school: el.querySelector('.edu-school').value,
                degree: el.querySelector('.edu-degree').value,
                date: el.querySelector('.edu-date').value
            });
        });
    }
    return items;
}

function renderModernTemplate(container, data) {
    container.innerHTML = `
        <div class="res-header">
            <div class="res-name">${data.name}</div>
            <div class="res-title">${data.title}</div>
            <div class="res-contact">
                <span><ion-icon name="mail-outline"></ion-icon> ${data.email}</span>
                <span><ion-icon name="call-outline"></ion-icon> ${data.phone}</span>
                <span><ion-icon name="location-outline"></ion-icon> ${data.location}</span>
            </div>
        </div>
        
        <div class="res-body">
            <h4>Work Experience</h4>
            ${data.experience.map(exp => `
                <div class="exp-item">
                    <div class="item-header">
                        <strong>${exp.company}</strong>
                        <span>${exp.date}</span>
                    </div>
                    <div>${exp.role}</div>
                    <p style="font-size: 0.85rem; color: #555; margin-top: 5px;">${exp.desc}</p>
                </div>
            `).join('')}

            <h4>Education</h4>
            ${data.education.map(edu => `
                <div class="edu-item">
                    <div class="item-header">
                        <strong>${edu.school}</strong>
                        <span>${edu.date}</span>
                    </div>
                    <div>${edu.degree}</div>
                </div>
            `).join('')}

            <h4>Skills</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${data.skills.map(skill => `
                    <span style="background:var(--accent-color); color:white; padding: 4px 10px; border-radius: 4px; font-size: 0.8rem;">${skill}</span>
                `).join('')}
            </div>
        </div>
    `;
}

function renderProfessionalTemplate(container, data) {
    container.innerHTML = `
        <div class="res-header">
            <div class="res-name">${data.name.toUpperCase()}</div>
            <div style="margin-top: 5px;">${data.email} | ${data.phone} | ${data.location}</div>
        </div>
        
        <h4>PROFESSIONAL SUMMARY</h4>
        <p>Dynamic ${data.title} with a proven track record of excellence.</p>

        <h4>EXPERIENCE</h4>
        ${data.experience.map(exp => `
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between;">
                    <strong>${exp.company.toUpperCase()}</strong>
                    <span>${exp.date}</span>
                </div>
                <i>${exp.role}</i>
                <p style="margin-top: 5px;">${exp.desc}</p>
            </div>
        `).join('')}

        <h4>EDUCATION</h4>
        ${data.education.map(edu => `
            <div style="margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between;">
                    <strong>${edu.school}</strong>
                    <span>${edu.date}</span>
                </div>
                <div>${edu.degree}</div>
            </div>
        `).join('')}

        <h4>SKILLS</h4>
        <p>${data.skills.join(', ')}</p>
    `;
}

function renderCreativeTemplate(container, data) {
    container.innerHTML = `
        <div class="res-sidebar">
            <div class="res-name" style="color:white !important;">${data.name.split(' ').join('<br>')}</div>
            <p style="margin-top: 20px; color: rgba(255,255,255,0.7); font-weight: 500;">${data.title}</p>
            
            <div style="margin-top: 50px;">
                <h4 style="color:white; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 5px;">CONTACT</h4>
                <p style="font-size: 0.85rem; margin-top: 10px;">${data.email}</p>
                <p style="font-size: 0.85rem;">${data.phone}</p>
                <p style="font-size: 0.85rem;">${data.location}</p>
            </div>

            <div style="margin-top: 30px;">
                <h4 style="color:white; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 5px;">SKILLS</h4>
                <div style="margin-top: 10px;">
                    ${data.skills.map(s => `<p style="font-size: 0.85rem; margin-bottom: 4px;">• ${s}</p>`).join('')}
                </div>
            </div>
        </div>
        <div class="res-main">
            <h4 style="color: #1d1d1f; border-bottom: 2px solid #1d1d1f; padding-bottom: 5px;">EXPERIENCE</h4>
             ${data.experience.map(exp => `
                <div style="margin-bottom: 25px;">
                    <div style="display: flex; justify-content: space-between;">
                        <strong style="color: #1d1d1f;">${exp.company}</strong>
                        <span style="color: #666; font-size: 0.85rem;">${exp.date}</span>
                    </div>
                    <div style="color: var(--accent-color); font-weight: 600;">${exp.role}</div>
                    <p style="font-size: 0.85rem; color: #444; margin-top: 8px;">${exp.desc}</p>
                </div>
            `).join('')}

            <h4 style="color: #1d1d1f; border-bottom: 2px solid #1d1d1f; padding-bottom: 5px; margin-top: 40px;">EDUCATION</h4>
            ${data.education.map(edu => `
                <div style="margin-bottom: 15px;">
                    <strong style="color: #1d1d1f;">${edu.school}</strong>
                    <div style="color: #666;">${edu.degree} | ${edu.date}</div>
                </div>
            `).join('')}
        </div>
    `;
}

function exportToPDF() {
    window.print();
}

async function prefillFromProfile() {
    const user = getCurrentUser();
    if (!user) return;

    try {
        const profile = await getProfile(user.id);
        if (profile) {
            document.getElementById('fullName').value = user.fullName;
            document.getElementById('email').value = user.email;

            if (profile.skills) {
                document.getElementById('skillsInput').value = profile.skills.join(', ');
            }

            // If biography exists, can use as first job desc or summary
            updatePreview();
        }
    } catch (e) {
        console.error("Failed to prefill: ", e);
    }
}
