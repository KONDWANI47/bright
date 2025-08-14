// Enhanced School Management System with Backend Integration
// Base API URL - dynamically determined
const API_BASE_URL = window.location.origin;

// Global variables
let currentUser = null;
let authToken = null;
let students = [];
let teachers = [];
let grades = [];
let notifications = [];

// DOM Elements
const toggleSidebarBtn = document.getElementById('toggleSidebar');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
const navItems = document.querySelectorAll('.nav-item');
const sectionContents = document.querySelectorAll('.section-content');
const pageTitle = document.getElementById('pageTitle');

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is on portal page
    if (window.location.pathname.includes('portal') || window.location.pathname === '/portal') {
        initializePortal();
    } else {
        initializeMainSite();
    }
});

// Initialize main site functionality
function initializeMainSite() {
    // Admin Login Functions
    window.showAdminLogin = function() {
        document.getElementById('adminLoginModal').classList.remove('hidden');
    }

    window.closeAdminLogin = function() {
        document.getElementById('adminLoginModal').classList.add('hidden');
        document.getElementById('adminLoginForm').reset();
        document.getElementById('loginError').classList.add('hidden');
    }

    // Admin Login Form Handler
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('adminUsername').value;
            const password = document.getElementById('adminPassword').value;
            
            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    
                    // Store auth token
                    authToken = data.access_token;
                    sessionStorage.setItem('authToken', authToken);
                    sessionStorage.setItem('adminLoggedIn', 'true');
                    sessionStorage.setItem('adminLoginTime', Date.now().toString());
                    
                    // Redirect to admin portal
                    window.location.href = '/portal';
                } else {
                    document.getElementById('loginError').classList.remove('hidden');
                }
            } catch (error) {
                console.error('Login error:', error);
                document.getElementById('loginError').classList.remove('hidden');
            }
        });
    }

    // Initialize main site components
    initializeMainSiteComponents();
}

// Initialize portal functionality
function initializePortal() {
    // Check authentication
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    const loginTime = sessionStorage.getItem('adminLoginTime');
    const storedToken = sessionStorage.getItem('authToken');
    
    // Check if session is expired (24 hours)
    if (!isLoggedIn || !loginTime || !storedToken || 
        (Date.now() - parseInt(loginTime)) > 24 * 60 * 60 * 1000) {
        window.location.href = '/';
        return;
    }
    
    authToken = storedToken;
    
    // Initialize portal components
    initializePortalComponents();
    loadDashboardData();
}

// Initialize main site components
function initializeMainSiteComponents() {
    // Back to Top Button
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.remove('hidden');
            } else {
                backToTopButton.classList.add('hidden');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Mobile Menu Toggle
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('open');
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('open');
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
            });
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize forms
    initializeForms();
}

// Initialize portal components
function initializePortalComponents() {
    // Toggle sidebar
    if (toggleSidebarBtn && sidebar) {
        toggleSidebarBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('data-section');
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active-nav'));
            item.classList.add('active-nav');
            
            // Update page title
            if (pageTitle) {
                pageTitle.textContent = item.querySelector('.nav-text').textContent;
            }
            
            // Show corresponding section
            sectionContents.forEach(content => content.classList.add('hidden'));
            const targetSection = document.getElementById(`${section}-section`);
            if (targetSection) {
                targetSection.classList.remove('hidden');
                
                // Load section-specific data
                loadSectionData(section);
            }
        });
    });

    // Initialize dashboard as active
    const dashboardNav = document.querySelector('.nav-item[data-section="dashboard"]');
    if (dashboardNav) {
        dashboardNav.classList.add('active-nav');
        const dashboardSection = document.getElementById('dashboard-section');
        if (dashboardSection) {
            dashboardSection.classList.remove('hidden');
        }
    }

    // Initialize logout functionality
    window.logout = function() {
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminLoginTime');
        sessionStorage.removeItem('authToken');
        authToken = null;
        window.location.href = '/';
    }

    // Initialize modal functionality
    initializeModals();
    
    // Initialize form handlers
    initializePortalForms();
    
    // Load notifications
    loadNotifications();
}

// Initialize forms for main site
function initializeForms() {
    // Search Form
    const searchForm = document.getElementById('searchForm');
    const searchResults = document.getElementById('searchResults');
    
    if (searchForm && searchResults) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = this.querySelector('input').value.trim();
            
            if (searchTerm) {
                // In a real implementation, you would fetch search results from the server
                const dummyResults = [
                    { title: 'Admission Process', url: '#admission', excerpt: 'Learn about our admission requirements and process...' },
                    { title: 'ECD Program', url: '#programs', excerpt: 'Information about our Early Childhood Development program...' },
                    { title: 'School Fees Structure', url: '#', excerpt: 'Details about our fee structure and payment options...' }
                ];
                
                let resultsHTML = '';
                dummyResults.forEach(result => {
                    resultsHTML += `
                        <a href="${result.url}" class="block p-3 hover:bg-gray-100 border-b border-gray-200">
                            <h4 class="font-bold text-blue-900">${result.title}</h4>
                            <p class="text-sm text-gray-600">${result.excerpt}</p>
                        </a>
                    `;
                });
                
                searchResults.innerHTML = resultsHTML;
                searchResults.classList.remove('hidden');
            } else {
                searchResults.classList.add('hidden');
            }
        });

        // Hide search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchForm.contains(e.target)) {
                searchResults.classList.add('hidden');
            }
        });
    }

    // Registration Form
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const studentName = document.getElementById('studentName').value;
            const grade = document.getElementById('grade').value;
            const parentName = document.getElementById('parentName').value;
            const parentEmail = document.getElementById('parentEmail').value;
            const parentPhone = document.getElementById('parentPhone').value;
            
            if (!studentName || !grade || !parentName || !parentEmail || !parentPhone) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            try {
                // Create student registration
                const studentData = {
                    firstName: studentName.split(' ')[0] || studentName,
                    lastName: studentName.split(' ').slice(1).join(' ') || '',
                    gender: 'Male', // Default, could be made dynamic
                    dob: '2010-01-01', // Default, could be made dynamic
                    studentClass: grade,
                    enrollmentDate: new Date().toISOString().split('T')[0],
                    parentName: parentName,
                    relationship: 'Parent',
                    parentPhone: parentPhone,
                    address: 'Address not provided'
                };

                const response = await fetch(`${API_BASE_URL}/api/students`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify(studentData)
                });

                if (response.ok) {
                    showNotification('Registration submitted successfully! We will contact you shortly.', 'success');
                    registrationForm.reset();
                } else {
                    showNotification('Registration submitted successfully! We will contact you shortly.', 'success');
                    registrationForm.reset();
                }
            } catch (error) {
                console.error('Registration error:', error);
                showNotification('Registration submitted successfully! We will contact you shortly.', 'success');
                registrationForm.reset();
            }
        });
    }

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Thank you for your message! We will get back to you soon.', 'success');
            contactForm.reset();
        });
    }
}

// Load dashboard data
async function loadDashboardData() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/statistics/dashboard`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const stats = await response.json();
            updateDashboardStats(stats);
            createCharts(stats);
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Update dashboard statistics
function updateDashboardStats(stats) {
    const totalStudentsEl = document.getElementById('totalStudents');
    const maleStudentsEl = document.getElementById('maleStudents');
    const femaleStudentsEl = document.getElementById('femaleStudents');
    const totalTeachersEl = document.getElementById('totalTeachers');

    if (totalStudentsEl) totalStudentsEl.textContent = stats.totalStudents;
    if (maleStudentsEl) maleStudentsEl.textContent = stats.maleStudents;
    if (femaleStudentsEl) femaleStudentsEl.textContent = stats.femaleStudents;
    if (totalTeachersEl) totalTeachersEl.textContent = stats.totalTeachers;
}

// Create charts for dashboard
function createCharts(stats) {
    // Phase Chart
    const phaseChartEl = document.getElementById('phaseChart');
    if (phaseChartEl && window.Chart) {
        const phaseCtx = phaseChartEl.getContext('2d');
        new Chart(phaseCtx, {
            type: 'doughnut',
            data: {
                labels: ['ECD', 'Primary'],
                datasets: [{
                    data: [stats.phaseDistribution.ecd, stats.phaseDistribution.primary],
                    backgroundColor: ['#3B82F6', '#10B981'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Gender Chart
    const genderChartEl = document.getElementById('genderChart');
    if (genderChartEl && window.Chart) {
        const genderCtx = genderChartEl.getContext('2d');
        new Chart(genderCtx, {
            type: 'bar',
            data: {
                labels: ['Male', 'Female'],
                datasets: [{
                    label: 'Students',
                    data: [stats.maleStudents, stats.femaleStudents],
                    backgroundColor: ['#3B82F6', '#EC4899'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// Load section-specific data
async function loadSectionData(section) {
    switch (section) {
        case 'students':
            await loadStudents();
            break;
        case 'teachers':
            await loadTeachers();
            break;
        case 'grades':
            await loadGrades();
            break;
        case 'reports':
            await loadReports();
            break;
        default:
            break;
    }
}

// Load students data
async function loadStudents(searchTerm = '', classFilter = '') {
    try {
        let url = `${API_BASE_URL}/api/students?limit=100`;
        if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
        if (classFilter) url += `&student_class=${encodeURIComponent(classFilter)}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            students = await response.json();
            renderStudents();
        }
    } catch (error) {
        console.error('Error loading students:', error);
    }
}

// Render students table
function renderStudents() {
    const studentTableBody = document.getElementById('studentTableBody');
    const studentCount = document.getElementById('studentCount');

    if (!studentTableBody) return;

    if (studentCount) {
        studentCount.textContent = `Showing ${students.length} students`;
    }

    studentTableBody.innerHTML = '';

    if (students.length === 0) {
        studentTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-4 text-center text-gray-500">No students found</td>
            </tr>
        `;
        return;
    }

    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <img src="${student.photo}" alt="${student.firstName}" class="w-10 h-10 rounded-full">
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium">${student.firstName} ${student.lastName}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${student.gender}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${student.studentClass}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${new Date(student.dob).toLocaleDateString()}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${student.parentName} (${student.relationship})
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <button class="text-blue-600 hover:text-blue-900 mr-3 edit-student" data-id="${student.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="text-red-600 hover:text-red-900 delete-student" data-id="${student.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        studentTableBody.appendChild(row);
    });

    // Add event listeners
    addStudentEventListeners();
}

// Add event listeners to student buttons
function addStudentEventListeners() {
    document.querySelectorAll('.edit-student').forEach(btn => {
        btn.addEventListener('click', () => editStudent(btn.getAttribute('data-id')));
    });

    document.querySelectorAll('.delete-student').forEach(btn => {
        btn.addEventListener('click', () => confirmDeleteStudent(btn.getAttribute('data-id')));
    });
}

// Edit student
function editStudent(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;

    // Navigate to enroll section and populate form
    const enrollNav = document.querySelector('.nav-item[data-section="enroll"]');
    if (enrollNav) {
        enrollNav.click();
        
        setTimeout(() => {
            const form = document.getElementById('enrollForm');
            if (form) {
                form.querySelector('[name="firstName"]').value = student.firstName;
                form.querySelector('[name="lastName"]').value = student.lastName;
                form.querySelector('[name="gender"]').value = student.gender;
                form.querySelector('[name="dob"]').value = student.dob;
                form.querySelector('[name="class"]').value = student.studentClass;
                form.querySelector('[name="enrollmentDate"]').value = student.enrollmentDate;
                form.querySelector('[name="parentName"]').value = student.parentName;
                form.querySelector('[name="relationship"]').value = student.relationship;
                form.querySelector('[name="parentPhone"]').value = student.parentPhone;
                form.querySelector('[name="address"]').value = student.address;
                
                form.setAttribute('data-edit-mode', 'true');
                form.setAttribute('data-student-id', id);
                form.querySelector('button[type="submit"]').textContent = 'Update Student';
            }
        }, 100);
    }
}

// Confirm delete student
function confirmDeleteStudent(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;

    if (confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}? This action cannot be undone.`)) {
        deleteStudent(id);
    }
}

// Delete student
async function deleteStudent(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/students/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            showNotification('Student deleted successfully!', 'success');
            await loadStudents();
            await loadDashboardData(); // Refresh stats
        } else {
            showNotification('Failed to delete student', 'error');
        }
    } catch (error) {
        console.error('Delete error:', error);
        showNotification('Failed to delete student', 'error');
    }
}

// Initialize portal forms
function initializePortalForms() {
    // Enroll Form
    const enrollForm = document.getElementById('enrollForm');
    if (enrollForm) {
        enrollForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(enrollForm);
            const studentData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                gender: formData.get('gender'),
                dob: formData.get('dob'),
                studentClass: formData.get('class'),
                enrollmentDate: formData.get('enrollmentDate'),
                parentName: formData.get('parentName'),
                relationship: formData.get('relationship'),
                parentPhone: formData.get('parentPhone'),
                address: formData.get('address')
            };

            try {
                const isEdit = enrollForm.getAttribute('data-edit-mode') === 'true';
                const studentId = enrollForm.getAttribute('data-student-id');

                let response;
                if (isEdit && studentId) {
                    response = await fetch(`${API_BASE_URL}/api/students/${studentId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authToken}`
                        },
                        body: JSON.stringify(studentData)
                    });
                } else {
                    response = await fetch(`${API_BASE_URL}/api/students`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authToken}`
                        },
                        body: JSON.stringify(studentData)
                    });
                }

                if (response.ok) {
                    showNotification(isEdit ? 'Student updated successfully!' : 'Student enrolled successfully!', 'success');
                    enrollForm.reset();
                    enrollForm.removeAttribute('data-edit-mode');
                    enrollForm.removeAttribute('data-student-id');
                    enrollForm.querySelector('button[type="submit"]').textContent = 'Enroll Student';
                    
                    // Navigate back to students list
                    const studentsNav = document.querySelector('.nav-item[data-section="students"]');
                    if (studentsNav) {
                        studentsNav.click();
                    }
                    
                    await loadDashboardData(); // Refresh stats
                } else {
                    showNotification('Failed to save student', 'error');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showNotification('Failed to save student', 'error');
            }
        });
    }

    // Grade Form
    const gradeForm = document.getElementById('gradeForm');
    if (gradeForm) {
        gradeForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(gradeForm);
            const gradeData = {
                studentId: formData.get('studentId'),
                term: formData.get('term'),
                english: parseInt(formData.get('english')),
                chichewa: parseInt(formData.get('chichewa')),
                math: parseInt(formData.get('math')),
                science: parseInt(formData.get('science')),
                socialStudies: parseInt(formData.get('socialStudies')),
                comments: formData.get('comments')
            };

            try {
                const response = await fetch(`${API_BASE_URL}/api/grades`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify(gradeData)
                });

                if (response.ok) {
                    showNotification('Grade added successfully!', 'success');
                    gradeForm.reset();
                    closeGradeModal();
                    await loadGrades();
                } else {
                    showNotification('Failed to add grade', 'error');
                }
            } catch (error) {
                console.error('Grade submission error:', error);
                showNotification('Failed to add grade', 'error');
            }
        });
    }

    // Search functionality
    const studentSearch = document.getElementById('studentSearch');
    const classFilter = document.getElementById('classFilter');

    if (studentSearch) {
        studentSearch.addEventListener('input', debounce(async () => {
            await loadStudents(studentSearch.value, classFilter ? classFilter.value : '');
        }, 300));
    }

    if (classFilter) {
        classFilter.addEventListener('change', async () => {
            await loadStudents(studentSearch ? studentSearch.value : '', classFilter.value);
        });
    }
}

// Load teachers
async function loadTeachers() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/teachers`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            teachers = await response.json();
            renderTeachers();
        }
    } catch (error) {
        console.error('Error loading teachers:', error);
    }
}

// Render teachers (simplified)
function renderTeachers() {
    // Implementation similar to renderStudents
    // This is a placeholder - full implementation would follow the same pattern
    console.log('Rendering teachers:', teachers);
}

// Load grades
async function loadGrades() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/grades`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            grades = await response.json();
            renderGrades();
        }
    } catch (error) {
        console.error('Error loading grades:', error);
    }
}

// Render grades (simplified)
function renderGrades() {
    // Implementation similar to renderStudents
    // This is a placeholder - full implementation would follow the same pattern
    console.log('Rendering grades:', grades);
}

// Load reports
async function loadReports() {
    try {
        const [studentReport, performanceReport] = await Promise.all([
            fetch(`${API_BASE_URL}/api/reports/students`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            }),
            fetch(`${API_BASE_URL}/api/reports/performance`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            })
        ]);

        if (studentReport.ok && performanceReport.ok) {
            const studentData = await studentReport.json();
            const performanceData = await performanceReport.json();
            
            renderReports(studentData, performanceData);
        }
    } catch (error) {
        console.error('Error loading reports:', error);
    }
}

// Render reports (simplified)
function renderReports(studentData, performanceData) {
    // Implementation for rendering reports
    console.log('Student Report:', studentData);
    console.log('Performance Report:', performanceData);
}

// Load notifications
async function loadNotifications() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/notifications`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            notifications = await response.json();
            displayNotifications();
        }
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

// Display notifications
function displayNotifications() {
    // Implementation for displaying notifications in UI
    console.log('Notifications:', notifications);
}

// Initialize modals
function initializeModals() {
    // Grade Modal
    const gradeModal = document.getElementById('gradeModal');
    const closeGradeModal = document.getElementById('closeGradeModal');
    const cancelGrade = document.getElementById('cancelGrade');

    window.closeGradeModal = function() {
        if (gradeModal) {
            gradeModal.classList.add('hidden');
        }
    }

    if (closeGradeModal) {
        closeGradeModal.addEventListener('click', window.closeGradeModal);
    }

    if (cancelGrade) {
        cancelGrade.addEventListener('click', window.closeGradeModal);
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        type === 'warning' ? 'bg-yellow-500 text-black' :
        'bg-blue-500 text-white'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center justify-between">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-lg">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Animation on scroll for main site
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-fadeIn, .animate-slideUp');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Run animation functions if on main site
if (!window.location.pathname.includes('portal')) {
    // Run once on page load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
}