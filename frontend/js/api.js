/**
 * api.js - Hirotix Backend API Connection
 * Handles all fetch() calls to the Spring Boot REST endpoints
 */

const BASE_URL = 'http://127.0.0.1:8080/api';

// ========== SESSION MANAGEMENT ========== //

function saveUserSession(user) {
    localStorage.setItem('hirotix_user', JSON.stringify(user));
}

function getCurrentUser() {
    const userStr = localStorage.getItem('hirotix_user');
    return userStr ? JSON.parse(userStr) : null;
}

// Helper for standard headers
function getHeaders() {
    return {
        'Content-Type': 'application/json'
    };
}


// ========== AUTHENTICATION ========== //

async function login(email, password) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
        throw new Error('Invalid email or password');
    }

    const user = await res.json();
    saveUserSession(user);
    return user;
}

async function register(userData) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData)
    });

    if (!res.ok) {
        throw new Error('Registration failed. Email might already be in use.');
    }

    return await res.json();
}


// ========== JOBS & RECRUITER ========== //

async function createJob(recruiterId, jobData) {
    const res = await fetch(`${BASE_URL}/jobs?recruiterId=${recruiterId}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(jobData)
    });

    if (!res.ok) throw new Error('Failed to create job');
    return await res.json();
}

async function getJobsByRecruiter(recruiterId) {
    try {
        const res = await fetch(`${BASE_URL}/jobs/my-jobs?recruiterId=${recruiterId}`);
        if (!res.ok) return [];
        return await res.json();
    } catch { return []; }
}

async function getAllActiveJobs() {
    try {
        const res = await fetch(`${BASE_URL}/jobs`);
        if (!res.ok) return [];
        return await res.json();
    } catch { return []; }
}

async function searchJobsAPI(query, location = '') {
    try {
        const res = await fetch(`${BASE_URL}/jobs/search?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`);
        if (!res.ok) return [];
        return await res.json();
    } catch { return []; }
}


// ========== APPLICATIONS ========== //

async function getApplicationsForJob(jobId) {
    try {
        const res = await fetch(`${BASE_URL}/jobs/${jobId}/applications`);
        if (!res.ok) return [];
        return await res.json();
    } catch { return []; }
}

async function getMyApplications(userId) {
    try {
        const res = await fetch(`${BASE_URL}/applications?userId=${userId}`);
        if (!res.ok) return [];
        return await res.json();
    } catch { return []; }
}

async function applyForJob(jobId, userId) {
    const res = await fetch(`${BASE_URL}/jobs/${jobId}/apply?userId=${userId}`, {
        method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to apply or already applied');
    return await res.json();
}


// ========== PROFILES & AI PIPELINE ========== //

async function getProfile(userId) {
    try {
        const res = await fetch(`${BASE_URL}/profiles/${userId}`);
        if (!res.ok) return null;
        return await res.json();
    } catch { return null; }
}

async function uploadResume(userId, file) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${BASE_URL}/profiles/${userId}/resume`, {
        method: 'POST',
        // Note: Do not set Content-Type for FormData, let the browser set it with boundaries
        body: formData
    });

    if (!res.ok) throw new Error('Failed to upload resume');
    return await res.text();
}

async function parseResumeAI(userId) {
    const res = await fetch(`${BASE_URL}/ai/parse-resume/${userId}`, {
        method: 'POST'
    });
    if (!res.ok) throw new Error('AI Parsing failed');
    return await res.json();
}

async function getAIJobRecommendations(userId) {
    try {
        const res = await fetch(`${BASE_URL}/ai/match-jobs/${userId}`);
        if (!res.ok) return [];
        return await res.json();
    } catch { return []; }
}


// ========== AI MOCK INTERVIEW API ========== //

/**
 * Health check for the AI Pipeline (Java & Python)
 */
async function checkServiceHealth() {
    try {
        const res = await fetch(`${BASE_URL}/health`); // Returns Spring Boot health
        return res.ok;
    } catch {
        return false;
    }
}

/**
 * Handles communication with the Spring Boot /api/chat endpoint 
 * for the AI Mock Interview (Gemini Integration - ChatController)
 */
async function sendChatMessage(userId, messageText, history = []) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

        const res = await fetch(`${BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: messageText,
                userId: userId,
                history: history
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || `Server Error (${res.status})`);
        }
        
        const data = await res.json();
        return data.reply || "No reply logic found";
    } catch (error) {
        console.error("AI Chat Error: ", error);
        if (error.name === 'AbortError') throw new Error("Request timed out. AI service is slow.");
        throw error;
    }
}
