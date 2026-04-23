document.addEventListener('DOMContentLoaded', () => {
    // Check auth state
    const user = JSON.parse(localStorage.getItem('reviewGuardUser'));
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    // UI Navigation Updates Based on Auth
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        // Exclude buttons from active tab styling
        if(!link.classList.contains('btn')) {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        }
        
        // Hide Login/Register if logged in
        if (user && (link.getAttribute('href') === 'login.html' || link.getAttribute('href') === 'register.html')) {
            link.parentElement.style.display = 'none';
        }
        
        // Check if Logout button exists or needs action
        if (link.innerText === 'Logout') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('reviewGuardUser');
                window.location.href = 'index.html';
            });
        }
    });

    // Simple scroll effect for header
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '10px 5%';
            header.style.background = 'rgba(15, 32, 39, 0.95)';
        } else {
            header.style.padding = '20px 5%';
            header.style.background = 'rgba(15, 32, 39, 0.85)';
        }
    });

    const apiBase = 'http://127.0.0.1:5000/api';
    let lastAnalysisResult = null;

    // 1. Registration Logic
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirm = document.getElementById('confirm-password').value;
            
            if (password !== confirm) {
                alert("Passwords do not match!"); 
                return;
            }
            
            // Mocking database via localStorage for frontend demo
            let usersDb = JSON.parse(localStorage.getItem('reviewGuardUsersDB') || '[]');
            
            // Check if email exists
            if (usersDb.find(u => u.email === email)) {
                alert("Email is already registered! Please login.");
                return;
            }
            
            const newId = usersDb.length ? Math.max(...usersDb.map(u => u.id)) + 1 : 1;
            const newUser = {
                id: newId,
                name: fullname,
                email: email,
                password: password,
                role: 'User',
                joined: new Date().toISOString().split('T')[0]
            };
            
            usersDb.push(newUser);
            localStorage.setItem('reviewGuardUsersDB', JSON.stringify(usersDb));
            
            alert("Registration successful! Please login.");
            window.location.href = 'login.html';
        });
    }

    // 2. Login Logic
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            let usersDb = JSON.parse(localStorage.getItem('reviewGuardUsersDB') || '[]');
            const userMatch = usersDb.find(u => u.email === email && u.password === password);
            
            if(userMatch) {
                const sessionUser = { id: userMatch.id, name: userMatch.name, email: userMatch.email, role: userMatch.role };
                localStorage.setItem('reviewGuardUser', JSON.stringify(sessionUser));
                window.location.href = 'review.html';
            } else {
                alert("Invalid email or password");
            }
        });
    }

    // 3. Route Protection Logic
    if (['review.html', 'history.html'].includes(currentPath) && !user) {
        alert("Please login to access this page.");
        window.location.href = 'login.html';
    }

    // 4. Analyze Review Logic
    const analyzeForm = document.getElementById('analyzeForm');
    if (analyzeForm) {
        analyzeForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const reviewText = document.getElementById('reviewText').value;
            const btn = this.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Analyzing with ML Model...';
            btn.style.opacity = '0.7';
            
            // Call the ML backend API
            try {
                const response = await fetch(apiBase + '/analyze', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_id: user ? user.id : 0,
                        review_text: reviewText
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || `HTTP error ${response.status}`);
                }

                const data = await response.json();
                const prediction = data.prediction;
                const confidence = Math.round(data.confidence);
                const fakeWords = data.fake_words || [];
                const realWords = data.real_words || [];
                
                lastAnalysisResult = {
                    reviewText: reviewText,
                    prediction: prediction,
                    confidence: confidence,
                    date: new Date().toLocaleDateString()
                };

                let reviewsDb = JSON.parse(localStorage.getItem('reviewGuardReviewsDB') || '[]');
                const newId = reviewsDb.length ? Math.max(...reviewsDb.map(r => r.id)) + 1 : 1;
                
                const newReview = {
                    id: newId,
                    user_id: user ? user.id : 0,
                    user: user ? (user.name || user.fullname || user.email || 'User') : 'Guest',
                    text: reviewText,
                    prediction: prediction,
                    confidence: confidence,
                    date: new Date().toISOString().split('T')[0],
                    created_at: new Date().toISOString()
                };
                
                reviewsDb.push(newReview);
                localStorage.setItem('reviewGuardReviewsDB', JSON.stringify(reviewsDb));

                const resultSection = document.getElementById('resultSection');
                resultSection.style.display = 'block';
                
                const scoreCircle = resultSection.querySelector('.score-circle');
                const title = resultSection.querySelector('h3');
                
                scoreCircle.innerText = `${confidence}%`;
                
                if(prediction === 'Fake') {
                    resultSection.className = 'result-card result-fake';
                    scoreCircle.className = 'score-circle fake-score';
                    scoreCircle.style.border = '';
                    scoreCircle.style.color = '';
                    title.style.color = 'var(--danger-color)';
                    title.innerText = 'High Probability of Fake Review';
                } else {
                    resultSection.className = 'result-card result-real';
                    scoreCircle.className = 'score-circle real-score';
                    scoreCircle.style.border = '6px solid var(--success-color)';
                    scoreCircle.style.color = 'var(--success-color)';
                    title.style.color = 'var(--success-color)';
                    title.innerText = 'Likely Authentic Review';
                }
                
                // Explainable AI Logic
                const xaiSection = document.getElementById('xaiSection');
                const highlightedReview = document.getElementById('highlightedReview');
                
                if (xaiSection && highlightedReview && (fakeWords.length > 0 || realWords.length > 0)) {
                    let highlightedText = reviewText;
                    
                    // Sort words by length descending so we don't partially replace shorter words first
                    const allFakeWords = [...fakeWords].sort((a,b) => b.length - a.length);
                    const allRealWords = [...realWords].sort((a,b) => b.length - a.length);
                    
                    allFakeWords.forEach(w => {
                        const regex = new RegExp(`\\b(${w})\\b`, 'gi');
                        highlightedText = highlightedText.replace(regex, '<span style="color: var(--danger-color); font-weight: bold;">$1</span>');
                    });
                    
                    allRealWords.forEach(w => {
                        const regex = new RegExp(`\\b(${w})\\b`, 'gi');
                        highlightedText = highlightedText.replace(regex, '<span style="color: var(--success-color); font-weight: bold;">$1</span>');
                    });
                    
                    highlightedReview.innerHTML = highlightedText;
                    xaiSection.style.display = 'block';
                } else if (xaiSection) {
                    xaiSection.style.display = 'none';
                }
                
                resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } catch (error) {
                console.error("Error calling analyze API:", error);
                alert("Failed to analyze review: " + error.message);
            } finally {
                btn.innerText = originalText;
                btn.style.opacity = '1';
            }
        });
    }

    // 5. History Fetch Logic
    if (currentPath === 'history.html' && user) {
        let reviewsDb = JSON.parse(localStorage.getItem('reviewGuardReviewsDB') || '[]');
        let userHistory = reviewsDb.filter(r => r.user_id === user.id);
        
        // Sort by id descending (newest first)
        userHistory.sort((a,b) => b.id - a.id);
        
        const tbody = document.querySelector('tbody');
        if(userHistory.length > 0) {
            tbody.innerHTML = ''; // clear mock data
            userHistory.forEach(item => {
                 const date = new Date(item.created_at).toLocaleDateString();
                 const isFake = item.prediction === 'Fake';
                 const badgeClass = isFake ? 'badge-fake' : 'badge-real';
                 
                 const tr = document.createElement('tr');
                 tr.innerHTML = `
                    <td>${date}</td>
                    <td class="text-truncate">${item.text.substring(0, 50)}...</td>
                    <td><span class="badge ${badgeClass}">${item.prediction}</span></td>
                    <td>${Math.round(item.confidence)}%</td>
                    <td><a href="#" style="color: var(--primary-color);">View Details</a></td>
                 `;
                 tbody.appendChild(tr);
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No analysis history found. Start checking reviews!</td></tr>';
        }
    }

    // 6. PDF Download Logic
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', () => {
            if (!lastAnalysisResult) {
                alert("No analysis result found to download.");
                return;
            }
            
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Add Title
            doc.setFontSize(22);
            doc.setTextColor(15, 32, 39);
            doc.text("ReviewGuard AI Analysis Report", 20, 20);
            
            doc.setFontSize(12);
            doc.setTextColor(100, 100, 100);
            doc.text(`Date Analyzed: ${lastAnalysisResult.date}`, 20, 30);
            
            doc.setDrawColor(200, 200, 200);
            doc.line(20, 35, 190, 35);
            
            // Add Prediction & Confidence
            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text("Result Overview", 20, 45);
            
            doc.setFontSize(14);
            if (lastAnalysisResult.prediction === 'Fake') {
                doc.setTextColor(255, 75, 75);
            } else {
                doc.setTextColor(0, 230, 118);
            }
            doc.text(`Prediction: ${lastAnalysisResult.prediction} Review`, 20, 55);
            
            doc.setTextColor(0, 0, 0);
            doc.text(`Confidence Score: ${lastAnalysisResult.confidence}%`, 20, 65);
            
            // Add Review Text
            doc.setFontSize(16);
            doc.text("Analyzed Text", 20, 80);
            
            doc.setFontSize(12);
            doc.setTextColor(60, 60, 60);
            
            const splitText = doc.splitTextToSize(lastAnalysisResult.reviewText, 170);
            doc.text(splitText, 20, 90);
            
            // Save the PDF
            doc.save("Analysis_Report.pdf");
        });
    }
});
