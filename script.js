

// Admin Login Functions
function showAdminLogin() {
    document.getElementById('adminLoginModal').classList.remove('hidden');
}

function closeAdminLogin() {
    document.getElementById('adminLoginModal').classList.add('hidden');
    document.getElementById('adminLoginForm').reset();
    document.getElementById('loginError').classList.add('hidden');
}

// Admin Login Form Handler
document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    if (username === 'bright academy' && password === 'bright@8895') {
        // Set session
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminLoginTime', Date.now().toString());
        
        // Redirect to admin portal
        window.location.href = 'portal.html';
    } else {
        document.getElementById('loginError').classList.remove('hidden');
    }
});

// Back to Top Button
const backToTopButton = document.getElementById('back-to-top');

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

// Mobile Menu Toggle
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

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

// Search Form Submission
const searchForm = document.getElementById('searchForm');
const searchResults = document.getElementById('searchResults');

searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const searchTerm = this.querySelector('input').value.trim();
    
    if (searchTerm) {
        // In a real implementation, you would fetch search results from a server
        // This is just a demo simulation
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

// Registration Form Submission
const registrationForm = document.getElementById('registrationForm');

registrationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const studentName = document.getElementById('studentName').value;
    const grade = document.getElementById('grade').value;
    const parentName = document.getElementById('parentName').value;
    const parentEmail = document.getElementById('parentEmail').value;
    const parentPhone = document.getElementById('parentPhone').value;
    
    // Validate form
    if (!studentName || !grade || !parentName || !parentEmail || !parentPhone) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // In a real implementation, you would send this data to a server
    console.log('Registration Submitted:', {
        studentName,
        grade,
        parentName,
        parentEmail,
        parentPhone
    });
    
    // Show success message
    alert('Thank you for your registration! We will contact you shortly with more information.');
    
    // Reset form
    registrationForm.reset();
});

// Contact Form Submission
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Validate form
    if (!name || !email || !subject || !message) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // In a real implementation, you would send this data to a server
    console.log('Contact Form Submitted:', {
        name,
        email,
        phone,
        subject,
        message
    });
    
    // Show success message
    alert('Thank you for your message! We will get back to you soon.');
    
    // Reset form
    contactForm.reset();
});

// Animation on scroll
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

// Run once on page load
animateOnScroll();

// Run on scroll
window.addEventListener('scroll', animateOnScroll);


        // Sample data for the system
        let students = [
            {
                id: 1,
                firstName: "John",
                lastName: "Banda",
                gender: "Male",
                dob: "2015-03-15",
                class: "Standard 5",
                enrollmentDate: "2022-01-10",
                photo: "https://via.placeholder.com/50",
                parentName: "James Banda",
                relationship: "Father",
                parentPhone: "+265 888 123 456",
                address: "Area 49, Lilongwe"
            },
            {
                id: 2,
                firstName: "Mary",
                lastName: "Phiri",
                gender: "Female",
                dob: "2016-05-20",
                class: "Standard 4",
                enrollmentDate: "2022-01-10",
                photo: "https://via.placeholder.com/50",
                parentName: "Grace Phiri",
                relationship: "Mother",
                parentPhone: "+265 999 234 567",
                address: "Area 25, Lilongwe"
            },
            {
                id: 3,
                firstName: "Peter",
                lastName: "Mwanza",
                gender: "Male",
                dob: "2017-07-10",
                class: "Standard 3",
                enrollmentDate: "2022-01-10",
                photo: "https://via.placeholder.com/50",
                parentName: "Andrew Mwanza",
                relationship: "Father",
                parentPhone: "+265 777 345 678",
                address: "Area 18, Lilongwe"
            },
            {
                id: 4,
                firstName: "Anna",
                lastName: "Mkandawire",
                gender: "Female",
                dob: "2018-09-05",
                class: "Standard 2",
                enrollmentDate: "2022-01-10",
                photo: "https://via.placeholder.com/50",
                parentName: "Esther Mkandawire",
                relationship: "Mother",
                parentPhone: "+265 888 456 789",
                address: "Area 36, Lilongwe"
            },
            {
                id: 5,
                firstName: "David",
                lastName: "Jere",
                gender: "Male",
                dob: "2019-11-12",
                class: "Standard 1",
                enrollmentDate: "2022-01-10",
                photo: "https://via.placeholder.com/50",
                parentName: "Daniel Jere",
                relationship: "Father",
                parentPhone: "+265 999 567 890",
                address: "Area 12, Lilongwe"
            },
            {
                id: 6,
                firstName: "Grace",
                lastName: "Kamtukule",
                gender: "Female",
                dob: "2020-01-25",
                class: "ECD",
                enrollmentDate: "2022-01-10",
                photo: "https://via.placeholder.com/50",
                parentName: "Ruth Kamtukule",
                relationship: "Mother",
                parentPhone: "+265 777 678 901",
                address: "Area 43, Lilongwe"
            }
        ];

        let teachers = [
            {
                id: 1,
                firstName: "James",
                lastName: "Mkandawire",
                gender: "Male",
                dob: "1980-05-15",
                email: "james.m@school.edu.mw",
                phone: "+265 888 123 123",
                qualification: "Diploma in Primary Education",
                hireDate: "2015-01-10",
                subjects: "Math, Science",
                classes: "Standard 5, Standard 6, Standard 7",
                address: "Area 3, Lilongwe",
                photo: "https://via.placeholder.com/50"
            },
            {
                id: 2,
                firstName: "Grace",
                lastName: "Phiri",
                gender: "Female",
                dob: "1985-08-20",
                email: "grace.p@school.edu.mw",
                phone: "+265 999 234 234",
                qualification: "Bachelor of Education",
                hireDate: "2018-03-15",
                subjects: "English, Chichewa",
                classes: "Standard 1, Standard 2, Standard 3",
                address: "Area 10, Lilongwe",
                photo: "https://via.placeholder.com/50"
            },
            {
                id: 3,
                firstName: "Esther",
                lastName: "Banda",
                gender: "Female",
                dob: "1990-11-10",
                email: "esther.b@school.edu.mw",
                phone: "+265 777 345 345",
                qualification: "Certificate in ECD",
                hireDate: "2020-01-05",
                subjects: "ECD Subjects",
                classes: "ECD",
                address: "Area 25, Lilongwe",
                photo: "https://via.placeholder.com/50"
            }
        ];

        let grades = [
            {
                id: 1,
                studentId: 1,
                studentName: "John Banda",
                class: "Standard 5",
                term: "Term 1",
                english: 75,
                chichewa: 80,
                math: 85,
                science: 78,
                socialStudies: 82,
                comments: "Good performance, needs to improve in Science"
            },
            {
                id: 2,
                studentId: 2,
                studentName: "Mary Phiri",
                class: "Standard 4",
                term: "Term 1",
                english: 85,
                chichewa: 90,
                math: 78,
                science: 82,
                socialStudies: 88,
                comments: "Excellent performance, keep it up"
            },
            {
                id: 3,
                studentId: 3,
                studentName: "Peter Mwanza",
                class: "Standard 3",
                term: "Term 1",
                english: 65,
                chichewa: 70,
                math: 72,
                science: 68,
                socialStudies: 75,
                comments: "Average performance, needs more effort"
            },
            {
                id: 4,
                studentId: 1,
                studentName: "John Banda",
                class: "Standard 5",
                term: "Term 2",
                english: 78,
                chichewa: 82,
                math: 88,
                science: 80,
                socialStudies: 85,
                comments: "Improved in Science, well done"
            }
        ];

        // DOM Elements
        const toggleSidebarBtn = document.getElementById('toggleSidebar');
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        const navItems = document.querySelectorAll('.nav-item');
        const sectionContents = document.querySelectorAll('.section-content');
        const pageTitle = document.getElementById('pageTitle');

        // Toggle sidebar
        toggleSidebarBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });

        // Navigation
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                
                // Update active nav item
                navItems.forEach(nav => nav.classList.remove('active-nav'));
                item.classList.add('active-nav');
                
                // Update page title
                pageTitle.textContent = item.querySelector('.nav-text').textContent;
                
                // Show corresponding section
                sectionContents.forEach(content => content.classList.add('hidden'));
                document.getElementById(`${section}-section`).classList.remove('hidden');
            });
        });

        // Initialize dashboard as active
        document.querySelector('.nav-item[data-section="dashboard"]').classList.add('active-nav');
        document.getElementById('dashboard-section').classList.remove('hidden');

        // Logout function
        function logout() {
            // Clear session storage
            sessionStorage.removeItem('adminLoggedIn');
            sessionStorage.removeItem('adminLoginTime');
            
            // Redirect to main site
            window.location.href = 'index.html';
        }

        // Calculate statistics
        function calculateStatistics() {
            const totalStudents = students.length;
            const maleStudents = students.filter(s => s.gender === 'Male').length;
            const femaleStudents = students.filter(s => s.gender === 'Female').length;
            const totalTeachers = teachers.length;

            // Update dashboard numbers
            document.getElementById('totalStudents').textContent = totalStudents;
            document.getElementById('maleStudents').textContent = maleStudents;
            document.getElementById('femaleStudents').textContent = femaleStudents;
            document.getElementById('totalTeachers').textContent = totalTeachers;

            // Calculate students by phase
            const ecdStudents = students.filter(s => s.class === 'ECD').length;
            const primaryStudents = totalStudents - ecdStudents;

            // Create charts
            createPhaseChart(ecdStudents, primaryStudents);
            createGenderChart(maleStudents, femaleStudents);
        }

        // Create phase chart
        function createPhaseChart(ecd, primary) {
            const ctx = document.getElementById('phaseChart').getContext('2d');
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['ECD', 'Primary'],
                    datasets: [{
                        data: [ecd, primary],
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

        // Create gender chart
        function createGenderChart(male, female) {
            const ctx = document.getElementById('genderChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Male', 'Female'],
                    datasets: [{
                        label: 'Students',
                        data: [male, female],
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

        // Student management
        const studentTableBody = document.getElementById('studentTableBody');
        const studentSearch = document.getElementById('studentSearch');
        const classFilter = document.getElementById('classFilter');
        const studentCount = document.getElementById('studentCount');
        const prevStudentPage = document.getElementById('prevStudentPage');
        const nextStudentPage = document.getElementById('nextStudentPage');
        const studentPageInfo = document.getElementById('studentPageInfo');

        let currentStudentPage = 1;
        const studentsPerPage = 5;

        function renderStudents() {
            let filteredStudents = [...students];
            
            // Apply class filter
            if (classFilter.value) {
                filteredStudents = filteredStudents.filter(s => s.class === classFilter.value);
            }
            
            // Apply search filter
            if (studentSearch.value) {
                const searchTerm = studentSearch.value.toLowerCase();
                filteredStudents = filteredStudents.filter(s => 
                    s.firstName.toLowerCase().includes(searchTerm) || 
                    s.lastName.toLowerCase().includes(searchTerm) ||
                    s.parentName.toLowerCase().includes(searchTerm)
                );
            }
            
            // Calculate pagination
            const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
            const startIndex = (currentStudentPage - 1) * studentsPerPage;
            const paginatedStudents = filteredStudents.slice(startIndex, startIndex + studentsPerPage);
            
            // Update pagination controls
            prevStudentPage.disabled = currentStudentPage === 1;
            nextStudentPage.disabled = currentStudentPage === totalPages || totalPages === 0;
            studentPageInfo.textContent = `Page ${currentStudentPage} of ${totalPages || 1}`;
            studentCount.textContent = `Showing ${filteredStudents.length} students`;
            
            // Render students
            studentTableBody.innerHTML = '';
            
            if (filteredStudents.length === 0) {
                studentTableBody.innerHTML = `
                    <tr>
                        <td colspan="7" class="px-6 py-4 text-center text-gray-500">No students found</td>
                    </tr>
                `;
                return;
            }
            
            paginatedStudents.forEach(student => {
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
                        ${student.class}
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
            
            // Add event listeners to edit and delete buttons
            document.querySelectorAll('.edit-student').forEach(btn => {
                btn.addEventListener('click', () => editStudent(parseInt(btn.getAttribute('data-id'))));
            });
            
            document.querySelectorAll('.delete-student').forEach(btn => {
                btn.addEventListener('click', () => confirmDeleteStudent(parseInt(btn.getAttribute('data-id'))));
            });
        }

        function editStudent(id) {
            const student = students.find(s => s.id === id);
            if (!student) return;
            
            // Populate the enroll form with student data
            const form = document.getElementById('enrollForm');
            form.querySelector('[name="firstName"]').value = student.firstName;
            form.querySelector('[name="lastName"]').value = student.lastName;
            form.querySelector('[name="gender"]').value = student.gender;
            form.querySelector('[name="dob"]').value = student.dob;
            form.querySelector('[name="class"]').value = student.class;
            form.querySelector('[name="enrollmentDate"]').value = student.enrollmentDate;
            form.querySelector('[name="parentName"]').value = student.parentName;
            form.querySelector('[name="relationship"]').value = student.relationship;
            form.querySelector('[name="parentPhone"]').value = student.parentPhone;
            form.querySelector('[name="address"]').value = student.address;
            
            // Change form to edit mode
            form.setAttribute('data-edit-mode', 'true');
            form.setAttribute('data-student-id', id);
            
            // Navigate to enroll section
            document.querySelector('.nav-item[data-section="enroll"]').click();
            
            // Change button text
            form.querySelector('button[type="submit"]').textContent = 'Update Student';
        }

        function confirmDeleteStudent(id) {
            const student = students.find(s => s.id === id);
            if (!student) return;
            
            // Show confirmation modal
            document.getElementById('confirmTitle').textContent = 'Delete Student';
            document.getElementById('confirmMessage').textContent = `Are you sure you want to delete ${student.firstName} ${student.lastName}? This action cannot be undone.`;
            document.getElementById('confirmAction').setAttribute('data-id', id);
            document.getElementById('confirmModal').classList.remove('hidden');
        }

        function deleteStudent(id) {
            students = students.filter(s => s.id !== id);
            renderStudents();
            calculateStatistics();
            closeConfirmModal();
        }

        // Enroll new student
        const enrollForm = document.getElementById('enrollForm');
        
        enrollForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(enrollForm);
            const studentData = Object.fromEntries(formData.entries());
            
            if (enrollForm.getAttribute('data-edit-mode') === 'true') {
                // Update existing student
                const studentId = parseInt(enrollForm.getAttribute('data-student-id'));
                const studentIndex = students.findIndex(s => s.id === studentId);
                
                if (studentIndex !== -1) {
                    students[studentIndex] = {
                        ...students[studentIndex],
                        firstName: studentData.firstName,
                        lastName: studentData.lastName,
                        gender: studentData.gender,
                        dob: studentData.dob,
                        class: studentData.class,
                        enrollmentDate: studentData.enrollmentDate,
                        parentName: studentData.parentName,
                        relationship: studentData.relationship,
                        parentPhone: studentData.parentPhone,
                        address: studentData.address
                    };
                    
                    alert('Student updated successfully!');
                }
            } else {
                // Add new student
                const newStudent = {
                    id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
                    firstName: studentData.firstName,
                    lastName: studentData.lastName,
                    gender: studentData.gender,
                    dob: studentData.dob,
                    class: studentData.class,
                    enrollmentDate: studentData.enrollmentDate,
                    photo: "https://via.placeholder.com/50",
                    parentName: studentData.parentName,
                    relationship: studentData.relationship,
                    parentPhone: studentData.parentPhone,
                    address: studentData.address
                };
                
                students.push(newStudent);
                alert('Student enrolled successfully!');
            }
            
            // Reset form
            enrollForm.reset();
            enrollForm.removeAttribute('data-edit-mode');
            enrollForm.removeAttribute('data-student-id');
            enrollForm.querySelector('button[type="submit"]').textContent = 'Enroll Student';
            
            // Update UI
            renderStudents();
            calculateStatistics();
            
            // Navigate back to students list
            document.querySelector('.nav-item[data-section="students"]').click();
        });

        // Grade management
        const gradeTableBody = document.getElementById('gradeTableBody');
        const gradeClassFilter = document.getElementById('gradeClassFilter');
        const gradeTermFilter = document.getElementById('gradeTermFilter');
        const gradeCount = document.getElementById('gradeCount');
        const prevGradePage = document.getElementById('prevGradePage');
        const nextGradePage = document.getElementById('nextGradePage');
        const gradePageInfo = document.getElementById('gradePageInfo');
        const addGradeBtn = document.getElementById('addGradeBtn');
        const gradeModal = document.getElementById('gradeModal');
        const closeGradeModal = document.getElementById('closeGradeModal');
        const cancelGrade = document.getElementById('cancelGrade');
        const gradeForm = document.getElementById('gradeForm');

        let currentGradePage = 1;

        function renderGrades() {
            let filteredGrades = [...grades];
            
            // Apply class filter
            if (gradeClassFilter.value) {
                filteredGrades = filteredGrades.filter(g => g.class === gradeClassFilter.value);
            }
            
            // Apply term filter
            if (gradeTermFilter.value) {
                filteredGrades = filteredGrades.filter(g => g.term === gradeTermFilter.value);
            }
            
            // Calculate pagination
            const totalPages = Math.ceil(filteredGrades.length / studentsPerPage);
            const startIndex = (currentGradePage - 1) * studentsPerPage;
            const paginatedGrades = filteredGrades.slice(startIndex, startIndex + studentsPerPage);
            
            // Update pagination controls
            prevGradePage.disabled = currentGradePage === 1;
            nextGradePage.disabled = currentGradePage === totalPages || totalPages === 0;
            gradePageInfo.textContent = `Page ${currentGradePage} of ${totalPages || 1}`;
            gradeCount.textContent = `Showing ${filteredGrades.length} grade records`;
            
            // Render grades
            gradeTableBody.innerHTML = '';
            
            if (filteredGrades.length === 0) {
                gradeTableBody.innerHTML = `
                    <tr>
                        <td colspan="10" class="px-6 py-4 text-center text-gray-500">No grade records found</td>
                    </tr>
                `;
                return;
            }
            
            paginatedGrades.forEach(grade => {
                const average = Math.round((grade.english + grade.chichewa + grade.math + grade.science + grade.socialStudies) / 5);
                let gradeLetter = '';
                
                if (average >= 80) gradeLetter = 'A';
                else if (average >= 70) gradeLetter = 'B';
                else if (average >= 60) gradeLetter = 'C';
                else if (average >= 50) gradeLetter = 'D';
                else gradeLetter = 'F';
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap">
                        ${grade.studentName}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        ${grade.class}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        ${grade.term}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        ${grade.english}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        ${grade.chichewa}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        ${grade.math}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        ${grade.science}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        ${grade.socialStudies}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 py-1 rounded-full text-white grade-${gradeLetter}">${average} (${gradeLetter})</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <button class="text-blue-600 hover:text-blue-900 mr-3 edit-grade" data-id="${grade.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="text-red-600 hover:text-red-900 delete-grade" data-id="${grade.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                gradeTableBody.appendChild(row);
            });
            
            // Add event listeners to edit and delete buttons
            document.querySelectorAll('.edit-grade').forEach(btn => {
                btn.addEventListener('click', () => editGrade(parseInt(btn.getAttribute('data-id'))));
            });
            
            document.querySelectorAll('.delete-grade').forEach(btn => {
                btn.addEventListener('click', () => confirmDeleteGrade(parseInt(btn.getAttribute('data-id'))));
            });
        }

        function editGrade(id) {
            const grade = grades.find(g => g.id === id);
            if (!grade) return;
            
            // Populate the grade form
            gradeForm.querySelector('[name="studentId"]').value = grade.studentId;
            gradeForm.querySelector('[name="term"]').value = grade.term;
            gradeForm.querySelector('[name="english"]').value = grade.english;
            gradeForm.querySelector('[name="chichewa"]').value = grade.chichewa;
            gradeForm.querySelector('[name="math"]').value = grade.math;
            gradeForm.querySelector('[name="science"]').value = grade.science;
            gradeForm.querySelector('[name="socialStudies"]').value = grade.socialStudies;
            gradeForm.querySelector('[name="comments"]').value = grade.comments;

            // Set edit mode for grade form
            gradeForm.setAttribute('data-edit-mode', 'true');
            gradeForm.setAttribute('data-grade-id', id);

            // Show grade modal
            gradeModal.classList.remove('hidden');
        }