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
        <div class="res-header" style="margin-bottom: 40px; border-bottom: 2px solid var(--accent-color); padding-bottom: 30px;">
            <div class="res-name" style="font-size: 3rem; font-weight: 800; letter-spacing: -0.05em; color: #102a43; line-height: 1.1;">${data.name}</div>
            <div class="res-title" style="font-size: 1.25rem; font-weight: 600; color: var(--accent-color); margin-top: 5px; text-transform: uppercase; letter-spacing: 0.1em;">${data.title}</div>
            <div class="res-contact" style="display: flex; gap: 24px; margin-top: 20px; color: #486581; font-size: 0.95rem; font-weight: 500;">
                <span style="display: flex; align-items: center; gap: 6px;"><ion-icon name="mail-outline"></ion-icon> ${data.email}</span>
                <span style="display: flex; align-items: center; gap: 6px;"><ion-icon name="call-outline"></ion-icon> ${data.phone}</span>
                <span style="display: flex; align-items: center; gap: 6px;"><ion-icon name="location-outline"></ion-icon> ${data.location}</span>
                ${data.website ? `<span style="display: flex; align-items: center; gap: 6px;"><ion-icon name="globe-outline"></ion-icon> ${data.website}</span>` : ''}
            </div>
        </div>

        <div class="res-watermark">Hirotix<span>.</span></div>
        <div class="res-footer-mark">Generated by Hirotix AI</div>
        
        <div class="res-body">
            <div style="margin-bottom: 40px;">
                <h4 style="font-size: 1rem; color: #102a43; border-bottom: 1px solid #d9e2ec; padding-bottom: 8px; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;">Professional Experience</h4>
                ${data.experience.map(exp => `
                    <div class="exp-item" style="margin-bottom: 24px;">
                        <div class="item-header" style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
                            <strong style="font-size: 1.1rem; color: #102a43;">${exp.company}</strong>
                            <span style="color: #627d98; font-size: 0.9rem; font-weight: 600;">${exp.date}</span>
                        </div>
                        <div style="color: var(--accent-color); font-weight: 700; margin-bottom: 10px; font-size: 0.95rem;">${exp.role}</div>
                        <p style="font-size: 0.95rem; color: #334e68; line-height: 1.6; white-space: pre-line;">${exp.desc}</p>
                    </div>
                `).join('')}
            </div>

            <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 40px;">
                <div>
                    <h4 style="font-size: 1rem; color: #102a43; border-bottom: 1px solid #d9e2ec; padding-bottom: 8px; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;">Education</h4>
                    ${data.education.map(edu => `
                        <div class="edu-item" style="margin-bottom: 16px;">
                            <div style="display: flex; justify-content: space-between; align-items: baseline;">
                                <strong style="color: #102a43;">${edu.school}</strong>
                                <span style="color: #627d98; font-size: 0.85rem; font-weight: 600;">${edu.date}</span>
                            </div>
                            <div style="color: #486581; font-size: 0.9rem; margin-top: 2px;">${edu.degree}</div>
                        </div>
                    `).join('')}
                </div>
                <div>
                    <h4 style="font-size: 1rem; color: #102a43; border-bottom: 1px solid #d9e2ec; padding-bottom: 8px; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;">Skills & Expertise</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${data.skills.map(skill => `
                            <span style="background: #f0f4f8; color: #102a43; padding: 6px 14px; border-radius: 100px; font-size: 0.85rem; font-weight: 600; border: 1px solid #d9e2ec;">${skill}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderProfessionalTemplate(container, data) {
    container.innerHTML = `
        <div class="res-header" style="text-align: center; border-bottom: 2px solid #102a43; padding-bottom: 20px; margin-bottom: 30px;">
            <div class="res-name" style="font-size: 2.25rem; font-family: 'Times New Roman', serif; color: #102a43; letter-spacing: 0.05em;">${data.name.toUpperCase()}</div>
            <div style="font-size: 0.9rem; color: #486581; margin-top: 10px; font-weight: 500; letter-spacing: 0.02em;">
                ${data.email} | ${data.phone} | ${data.location}
                ${data.website ? ` | ${data.website}` : ''}
            </div>
        </div>

        <div class="res-watermark" style="color: rgba(16, 42, 67, 0.15);">Hirotix<span>.</span></div>
        <div class="res-footer-mark">Generated by Hirotix AI</div>
        
        <div style="margin-bottom: 25px;">
            <h4 style="font-size: 0.95rem; border-bottom: 1px solid #102a43; padding-bottom: 4px; margin-bottom: 12px; color: #102a43; font-weight: 800; letter-spacing: 0.05em;">PROFESSIONAL SUMMARY</h4>
            <p style="font-size: 0.95rem; color: #334e68; line-height: 1.6;">Strategic and dedicated ${data.title} with a focus on delivering excellence and driving organizational growth through innovative solutions and leadership.</p>
        </div>

        <div style="margin-bottom: 25px;">
            <h4 style="font-size: 0.95rem; border-bottom: 1px solid #102a43; padding-bottom: 4px; margin-bottom: 15px; color: #102a43; font-weight: 800; letter-spacing: 0.05em;">PROFESSIONAL EXPERIENCE</h4>
            ${data.experience.map(exp => `
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; font-weight: 700; color: #102a43; font-size: 1rem;">
                        <span>${exp.company.toUpperCase()}</span>
                        <span>${exp.date}</span>
                    </div>
                    <div style="font-style: italic; color: #486581; margin: 4px 0 8px; font-weight: 600;">${exp.role}</div>
                    <p style="font-size: 0.92rem; color: #334e68; margin-top: 5px; line-height: 1.5; white-space: pre-line;">${exp.desc}</p>
                </div>
            `).join('')}
        </div>

        <div style="margin-bottom: 25px;">
            <h4 style="font-size: 0.95rem; border-bottom: 1px solid #102a43; padding-bottom: 4px; margin-bottom: 12px; color: #102a43; font-weight: 800; letter-spacing: 0.05em;">EDUCATION</h4>
            ${data.education.map(edu => `
                <div style="margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; font-weight: 700; color: #102a43;">
                        <span>${edu.school}</span>
                        <span>${edu.date}</span>
                    </div>
                    <div style="color: #486581; font-size: 0.9rem;">${edu.degree}</div>
                </div>
            `).join('')}
        </div>

        <div>
            <h4 style="font-size: 0.95rem; border-bottom: 1px solid #102a43; padding-bottom: 4px; margin-bottom: 10px; color: #102a43; font-weight: 800; letter-spacing: 0.05em;">CORE COMPETENCIES</h4>
            <p style="font-size: 0.95rem; color: #334e68; letter-spacing: 0.01em; line-height: 1.6;">${data.skills.join(' • ')}</p>
        </div>
    `;
}
function renderCreativeTemplate(container, data) {
    container.innerHTML = `
        <div class="res-sidebar" style="background: #102a43; color: white; padding: 50px 30px; display: flex; flex-direction: column; gap: 40px;">
            <div class="res-name" style="font-size: 2.5rem; font-weight: 800; line-height: 1; letter-spacing: -0.05em;">${data.name.split(' ').join('<br>')}</div>
            <div style="width: 40px; height: 4px; background: var(--accent-color);"></div>
            
            <div class="side-section">
                <h4 style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(255,255,255,0.5); margin-bottom: 20px;">Contact</h4>
                <div style="display: flex; flex-direction: column; gap: 12px; font-size: 0.9rem;">
                    <span style="display: flex; align-items: center; gap: 10px;"><ion-icon name="mail-outline"></ion-icon> ${data.email}</span>
                    <span style="display: flex; align-items: center; gap: 10px;"><ion-icon name="call-outline"></ion-icon> ${data.phone}</span>
                    <span style="display: flex; align-items: center; gap: 10px;"><ion-icon name="location-outline"></ion-icon> ${data.location}</span>
                </div>
            </div>

            <div class="side-section">
                <h4 style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(255,255,255,0.5); margin-bottom: 20px;">Skills</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${data.skills.map(s => `<span style="background: rgba(255,255,255,0.1); padding: 5px 12px; border-radius: 4px; font-size: 0.8rem; font-weight: 500;">${s}</span>`).join('')}
                </div>
            </div>
        </div>

        <div class="res-watermark" style="color: rgba(0, 122, 255, 0.15);">Hirotix<span>.</span></div>
        <div class="res-footer-mark">Generated by Hirotix AI</div>

        <div class="res-main" style="padding: 50px; background: white;">
            <div style="margin-bottom: 50px;">
                <div style="font-size: 1.25rem; font-weight: 700; color: var(--accent-color); margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.1em;">${data.title}</div>
                <p style="font-size: 1rem; color: #486581; line-height: 1.8;">Dynamic and results-driven professional with expertise in delivering high-impact solutions and driving innovation.</p>
            </div>

            <div class="main-section" style="margin-bottom: 40px;">
                <h4 style="font-size: 1.1rem; color: #102a43; margin-bottom: 25px; font-weight: 800; display: flex; align-items: center; gap: 10px;">
                    <span style="width: 8px; height: 8px; background: var(--accent-color); border-radius: 50%;"></span> Experience
                </h4>
                ${data.experience.map(exp => `
                    <div style="margin-bottom: 30px; position: relative; padding-left: 20px; border-left: 2px solid #f0f4f8;">
                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                            <strong style="font-size: 1.1rem; color: #102a43;">${exp.company}</strong>
                            <span style="color: var(--accent-color); font-weight: 700; font-size: 0.85rem;">${exp.date}</span>
                        </div>
                        <div style="color: #486581; font-weight: 600; margin-top: 4px;">${exp.role}</div>
                        <p style="font-size: 0.9rem; color: #627d98; margin-top: 10px; line-height: 1.6;">${exp.desc}</p>
                    </div>
                `).join('')}
            </div>

            <div class="main-section">
                <h4 style="font-size: 1.1rem; color: #102a43; margin-bottom: 25px; font-weight: 800; display: flex; align-items: center; gap: 10px;">
                    <span style="width: 8px; height: 8px; background: var(--accent-color); border-radius: 50%;"></span> Education
                </h4>
                ${data.education.map(edu => `
                    <div style="margin-bottom: 20px; position: relative; padding-left: 20px; border-left: 2px solid #f0f4f8;">
                        <strong style="color: #102a43;">${edu.school}</strong>
                        <div style="color: #486581; font-size: 0.9rem; margin-top: 4px;">${edu.degree} | ${edu.date}</div>
                    </div>
                `).join('')}
            </div>
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
