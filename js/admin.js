/**
 * Admin Panel functionality for AI Review Detector
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if on admin page, then initialize
    if (document.querySelector('.admin-container')) {
        initAdminDashboard();
    }
});

// Mock data for the dashboard
const adminData = {
    stats: {
        totalUsers: 142,
        totalReviews: 856,
        realReviews: 532,
        fakeReviews: 324
    },
    users: [], // Will be loaded from localStorage
    reviews: [] // Will be loaded from localStorage
};

// Handle navigation in admin sidebar
function showSection(sectionId, btnElement) {
    // Hide all sections
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(sec => sec.classList.remove('active'));
    
    // Show target section
    const target = document.getElementById(`section-${sectionId}`);
    if (target) {
        target.classList.add('active');
    }
    
    // Update active button
    const buttons = document.querySelectorAll('.sidebar-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (btnElement) {
        btnElement.classList.add('active');
    }
}

// Initialize and populate tables
function initAdminDashboard() {
    // Load users and reviews from localStorage
    const usersDb = JSON.parse(localStorage.getItem('reviewGuardUsersDB') || '[]');
    const reviewsDb = JSON.parse(localStorage.getItem('reviewGuardReviewsDB') || '[]');
    
    // Calculate stats
    const totalReviews = reviewsDb.length;
    const realReviews = reviewsDb.filter(r => r.prediction === 'Real').length;
    const fakeReviews = reviewsDb.filter(r => r.prediction === 'Fake').length;

    // Populate stats
    document.getElementById('stat-total-users').textContent = usersDb.length;
    document.getElementById('stat-total-reviews').textContent = totalReviews;
    document.getElementById('stat-real-reviews').textContent = realReviews;
    document.getElementById('stat-fake-reviews').textContent = fakeReviews;

    // Populate Users Table
    const usersTbody = document.getElementById('users-tbody');
    if (usersTbody) {
        usersTbody.innerHTML = '';
        if (usersDb.length === 0) {
            usersTbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No registered users found.</td></tr>';
        } else {
            usersDb.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${user.id}</td>
                <td><strong>${user.name}</strong></td>
                <td>${user.email}</td>
                <td>${user.password || 'N/A'}</td>
                <td><span class="badge" style="background: ${user.role === 'Admin' ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255,255,255,0.1)'}; color: ${user.role === 'Admin' ? 'var(--success-color)' : '#fff'}">${user.role}</span></td>
                <td>${user.joined}</td>
                <td>
                    <button class="btn btn-outline btn-sm action-edit" onclick="editUser(${user.id})">Edit</button>
                    <button class="btn btn-outline btn-danger btn-sm action-delete" onclick="deleteUser(${user.id}, this)">Delete</button>
                </td>
            `;
            usersTbody.appendChild(tr);
            });
        }
    }

    // Populate Reviews Table
    const reviewsTbody = document.getElementById('reviews-tbody');
    if (reviewsTbody) {
        reviewsTbody.innerHTML = '';
        if (reviewsDb.length === 0) {
            reviewsTbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No reviews have been analyzed yet.</td></tr>';
        } else {
            // Sort to show newest first
            const sortedReviews = [...reviewsDb].sort((a,b) => b.id - a.id);
            sortedReviews.forEach(review => {
            const tr = document.createElement('tr');
            const badgeClass = review.prediction === 'Real' ? 'badge-real' : 'badge-fake';
            tr.innerHTML = `
                <td>#${review.id}</td>
                <td><strong>${review.user}</strong></td>
                <td><div style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${review.text}">${review.text}</div></td>
                <td><span class="badge ${badgeClass}">${review.prediction}</span></td>
                <td>${Math.round(review.confidence)}%</td>
                <td>${review.date}</td>
                <td>
                    <button class="btn btn-outline btn-danger btn-sm action-delete" onclick="deleteReview(${review.id}, this)">Delete</button>
                </td>
            `;
            reviewsTbody.appendChild(tr);
            });
        }
    }
}

// Dummy actions
function editUser(id) {
    alert(`Edit User dialog for ID ${id} would open here.`);
}

function deleteUser(id, btn) {
    if(confirm(`Are you sure you want to permanently delete User #${id}?`)) {
        btn.closest('tr').style.display = 'none';
        
        let usersDb = JSON.parse(localStorage.getItem('reviewGuardUsersDB') || '[]');
        usersDb = usersDb.filter(u => u.id !== id);
        localStorage.setItem('reviewGuardUsersDB', JSON.stringify(usersDb));
        
        let usersCountEl = document.getElementById('stat-total-users');
        usersCountEl.textContent = usersDb.length;
    }
}

function deleteReview(id, btn) {
    if(confirm(`Are you sure you want to permanently delete Review #${id}?`)) {
        btn.closest('tr').style.display = 'none';
        
        let reviewsDb = JSON.parse(localStorage.getItem('reviewGuardReviewsDB') || '[]');
        const deletedReview = reviewsDb.find(r => r.id === id);
        reviewsDb = reviewsDb.filter(r => r.id !== id);
        localStorage.setItem('reviewGuardReviewsDB', JSON.stringify(reviewsDb));
        
        // Update stats
        let reviewsCountEl = document.getElementById('stat-total-reviews');
        reviewsCountEl.textContent = reviewsDb.length;
        
        if (deletedReview) {
            if (deletedReview.prediction === 'Fake') {
                let fakeCountEl = document.getElementById('stat-fake-reviews');
                fakeCountEl.textContent = Math.max(0, parseInt(fakeCountEl.textContent) - 1);
            } else {
                let realCountEl = document.getElementById('stat-real-reviews');
                realCountEl.textContent = Math.max(0, parseInt(realCountEl.textContent) - 1);
            }
        }
    }
}
