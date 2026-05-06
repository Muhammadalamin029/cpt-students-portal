const studentData = {
    personal: {
        fullName: "BILIKIS ADAMU",
        gender: "Female",
        dob: "25 Jun 2007",
        state: "Niger",
        lga: "Bida",
        bloodGroup: "A+",
        tribe: "Nupe",
        maritalStatus: "Single",
        religion: "Christianity",
        nationality: "Nigerian",
        fatherName: "Late Mr Adamu Lawal",
        motherName: "Mrs Fasilat Adamu",
        email: "adamububt25675@st.futminna.edu.ng",
        phoneNumbers: ["09071081116", "08125452500"],
        address: "Besides Bosso Local Government Secretariat Maikunkele, Minna, Niger State, Nigeria.",
    },
    academic: {
        regNumber: "202550520064CF",
        matricNumber: "2025/1/104619CT",
        programme: "B.Tech : Computer Science",
        school: "School of Information and Communication Technology",
        department: "Computer Science",
        level: "100",
        entrySession: "2025/2026",
        mode: "Full Time",
        studentId: "UBT25675",
        dateCaptured: "17 Oct 2025",
        status: "Active",
        cgpa: "4.85",
        primarySchool: "ST Peter Nusery and Primary School",
        secondarySchool: "Quality International School"
    },
    nextOfKin: {
        name: "Hannat Adamu",
        relationship: "Sister",
        phone: "09156516331",
        email: "hannatadamu0@gmail.com",
        address: "Besides Bosso Local Government Secretariat Maikunkele, Minna, Niger State, Nigeria."
    }
};

// Authentication Logic
window.handleLogin = function() {
    const input = document.getElementById('studentIdInput');
    const error = document.getElementById('loginError');
    const id = input.value.trim().toUpperCase();

    if (id === studentData.academic.studentId) {
        // Success
        error.classList.add('hidden');
        localStorage.setItem('portal_auth', 'true');
        showMainApp();
    } else {
        // Failure
        error.classList.remove('hidden');
        input.classList.add('border-red-500');
        setTimeout(() => input.classList.remove('border-red-500'), 2000);
    }
};

window.handleLogout = function() {
    console.log('Logging out...');
    localStorage.removeItem('portal_auth');
    window.location.reload();
};

function showMainApp() {
    document.getElementById('loginPage').classList.add('hidden');
    const app = document.getElementById('app');
    app.classList.remove('hidden');
    app.classList.add('flex');
    
    // Initialize content
    const initialPage = window.location.hash.substring(1) || 'dashboard';
    navigateTo(initialPage);
}

// Update initialization to check for existing session
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('portal_auth') === 'true') {
        showMainApp();
    }
    
    // Listen for enter key in login input
    const loginInput = document.getElementById('studentIdInput');
    if (loginInput) {
        loginInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
    }
});

function navigateTo(pageId) {
    const content = document.getElementById('content');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Update active state
    navLinks.forEach(link => {
        if (link.getAttribute('data-page') === pageId) {
            link.classList.remove('text-neutral-500', 'dark:text-neutral-400');
            link.classList.add('bg-fut-blue', 'text-white', 'shadow-lg', 'shadow-fut-blue/20');
        } else {
            link.classList.add('text-neutral-500', 'dark:text-neutral-400');
            link.classList.remove('bg-fut-blue', 'text-white', 'shadow-lg', 'shadow-fut-blue/20');
        }
    });

    if (pageId === 'dashboard') {
        renderDashboard();
    } else if (pageId === 'bio-data') {
        renderBioData();
    } else if (pageId === 'academic') {
        renderAcademic();
    } else if (pageId === 'about-me') {
        renderAboutMe();
    } else if (pageId === 'settings') {
        renderSettings();
    }
}

function renderDashboard() {
    const html = `
        <div class="space-y-8 animate-in">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Dashboard</h2>
                    <p class="text-neutral-500 dark:text-neutral-400">Welcome back, ${studentData.personal.fullName}</p>
                </div>
                <button onclick="openPreviewModal()" class="flex items-center gap-2 rounded-xl bg-fut-blue px-6 py-2.5 text-sm font-bold text-white shadow-xl shadow-fut-blue/20 transition-transform active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                    Print Bio-Data Slip
                </button>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div class="rounded-2xl bg-white p-6 border border-neutral-200 shadow-sm dark:bg-neutral-900 dark:border-neutral-800">
                    <p class="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Registration Status</p>
                    <p class="text-lg font-black text-green-600">COMPLETED</p>
                </div>
                <div class="rounded-2xl bg-white p-6 border border-neutral-200 shadow-sm dark:bg-neutral-900 dark:border-neutral-800">
                    <p class="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Current Level</p>
                    <p class="text-lg font-black text-neutral-900 dark:text-neutral-100">${studentData.academic.level} LEVEL</p>
                </div>
                <div class="rounded-2xl bg-white p-6 border border-neutral-200 shadow-sm dark:bg-neutral-900 dark:border-neutral-800">
                    <p class="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Academic Session</p>
                    <p class="text-lg font-black text-neutral-900 dark:text-neutral-100">${studentData.academic.entrySession}</p>
                </div>
                <div class="rounded-2xl bg-white p-6 border border-neutral-200 shadow-sm dark:bg-neutral-900 dark:border-neutral-800">
                    <p class="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Matric Number</p>
                    <p class="text-lg font-black text-neutral-900 dark:text-neutral-100">${studentData.academic.matricNumber}</p>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div class="lg:col-span-2 space-y-6">
                    <div class="rounded-3xl bg-white dark:bg-neutral-900 p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                        <h3 class="text-lg font-bold mb-6 dark:text-neutral-100">Profile Completeness</h3>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between text-sm font-bold">
                                <span class="text-neutral-500">Document Verification</span>
                                <span class="text-fut-blue">100%</span>
                            </div>
                            <div class="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                <div class="h-full bg-fut-blue w-full"></div>
                            </div>
                            <p class="text-xs text-neutral-400">All required documents have been successfully uploaded and verified by the ICT center.</p>
                        </div>
                    </div>
                </div>

                <div class="rounded-3xl bg-white p-8 border border-neutral-200 shadow-sm text-center dark:bg-neutral-900 dark:border-neutral-800">
                    <div class="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-2xl border-4 border-neutral-50 dark:border-neutral-800 shadow-inner">
                         <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop" class="h-full w-full object-cover">
                    </div>
                    <h3 class="font-bold text-lg dark:text-neutral-100">${studentData.personal.fullName}</h3>
                    <p class="text-neutral-500 text-xs mt-1 dark:text-neutral-400">${studentData.academic.department}</p>
                    <div class="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
                        <div class="flex justify-between text-xs font-bold">
                            <span class="text-neutral-400 uppercase">Student ID</span>
                            <span class="text-neutral-900 dark:text-neutral-100">${studentData.academic.studentId}</span>
                        </div>
                        <div class="flex justify-between text-xs font-bold">
                            <span class="text-neutral-400 uppercase">Mode</span>
                            <span class="text-neutral-900 dark:text-neutral-100">${studentData.academic.mode}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('content').innerHTML = html;
}

function renderBioData() {
    const html = `
        <div class="space-y-8 animate-in">
            <div>
                <h2 class="text-2xl font-bold tracking-tight dark:text-neutral-100">Bio-Data</h2>
                <p class="text-neutral-500 dark:text-neutral-400">Personal and Contact Information</p>
            </div>

            <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div class="rounded-3xl bg-white dark:bg-neutral-900 p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
                    <h3 class="text-sm font-black uppercase tracking-widest text-fut-blue dark:text-blue-400">Personal Details</h3>
                    <div class="grid grid-cols-2 gap-y-6">
                        ${renderField("Full Name", studentData.personal.fullName, "col-span-2")}
                        ${renderField("Father's Name", studentData.personal.fatherName, "col-span-2")}
                        ${renderField("Mother's Name", studentData.personal.motherName, "col-span-2")}
                        ${renderField("Gender", studentData.personal.gender)}
                        ${renderField("Date of Birth", studentData.personal.dob)}
                        ${renderField("State", studentData.personal.state)}
                        ${renderField("LGA", studentData.personal.lga)}
                        ${renderField("Blood Group", studentData.personal.bloodGroup)}
                        ${renderField("Nationality", studentData.personal.nationality)}
                        ${renderField("Religion", studentData.personal.religion)}
                        ${renderField("Marital Status", studentData.personal.maritalStatus)}
                    </div>
                </div>

                <div class="space-y-8">
                    <div class="rounded-3xl bg-white dark:bg-neutral-900 p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
                        <h3 class="text-sm font-black uppercase tracking-widest text-fut-blue dark:text-blue-400">Contact Information</h3>
                        <div class="space-y-4">
                            ${renderField("Email", studentData.personal.email)}
                            ${renderField("Phone", studentData.personal.phoneNumbers.join(', '))}
                            ${renderField("Address", studentData.personal.address)}
                        </div>
                    </div>

                    <div class="rounded-3xl bg-white dark:bg-neutral-900 p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
                        <h3 class="text-sm font-black uppercase tracking-widest text-fut-blue dark:text-blue-400">Next of Kin</h3>
                        <div class="grid grid-cols-2 gap-y-4">
                            ${renderField("Name", studentData.nextOfKin.name, "col-span-2")}
                            ${renderField("Relationship", studentData.nextOfKin.relationship)}
                            ${renderField("Phone", studentData.nextOfKin.phone)}
                            ${renderField("Address", studentData.nextOfKin.address, "col-span-2")}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('content').innerHTML = html;
}

function renderAcademic() {
    const html = `
        <div class="space-y-8 animate-in">
            <div>
                <h2 class="text-2xl font-bold tracking-tight dark:text-neutral-100">Academic Details</h2>
                <p class="text-neutral-500 dark:text-neutral-400">Programme and Institutional Records</p>
            </div>

            <div class="rounded-3xl bg-white dark:bg-neutral-900 p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div class="space-y-8">
                        <div class="space-y-1">
                            <h4 class="text-[10px] font-black uppercase tracking-widest text-neutral-400">Institutional Email</h4>
                            <p class="text-sm font-bold text-fut-blue dark:text-blue-400">${studentData.personal.email}</p>
                        </div>
                        <div class="grid grid-cols-2 gap-y-8">
                            ${renderField("Matric Number", studentData.academic.matricNumber)}
                            ${renderField("Reg Number", studentData.academic.regNumber)}
                            ${renderField("Primary School", studentData.academic.primarySchool, "col-span-2")}
                            ${renderField("Secondary School", studentData.academic.secondarySchool, "col-span-2")}
                            ${renderField("Programme", studentData.academic.programme, "col-span-2")}
                            ${renderField("School", studentData.academic.school, "col-span-2")}
                            ${renderField("Department", studentData.academic.department, "col-span-2")}
                        </div>
                    </div>
                    <div class="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-6 space-y-6">
                        <h4 class="text-sm font-bold dark:text-neutral-100">Enrollment Summary</h4>
                        <div class="space-y-4">
                             <div class="flex justify-between items-center text-sm">
                                <span class="text-neutral-500">Current Level</span>
                                <span class="font-bold dark:text-neutral-100">${studentData.academic.level}</span>
                             </div>
                             <div class="flex justify-between items-center text-sm">
                                <span class="text-neutral-500">Entry Session</span>
                                <span class="font-bold dark:text-neutral-100">${studentData.academic.entrySession}</span>
                             </div>
                             <div class="flex justify-between items-center text-sm">
                                <span class="text-neutral-500">Current Status</span>
                                <span class="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-lg">ACTIVE STUDENT</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('content').innerHTML = html;
}

function renderAboutMe() {
    const html = `
        <div class="space-y-8 animate-in">
            <h2 class="text-2xl font-bold tracking-tight dark:text-neutral-100">About Me</h2>
            <div class="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
                <div class="flex flex-col md:flex-row">
                    <div class="w-full md:w-80 bg-neutral-100 dark:bg-neutral-800 p-8 flex flex-col items-center">
                        <div class="h-48 w-48 rounded-full border-4 border-white dark:border-neutral-700 overflow-hidden shadow-xl mb-6">
                            <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop" class="h-full w-full object-cover">
                        </div>
                        <h3 class="text-xl font-black text-neutral-900 dark:text-neutral-100">${studentData.personal.fullName}</h3>
                        <p class="text-sm text-neutral-500 font-bold dark:text-neutral-400">COMPUTER SCIENCE</p>
                    </div>
                    <div class="flex-1 p-8 md:p-12 space-y-6">
                        <h3 class="text-2xl font-bold text-neutral-900 dark:text-neutral-100 leading-tight">Aspiring Technology <span class="text-fut-blue font-black underline decoration-fut-gold decoration-4 underline-offset-4">Professional</span></h3>
                        <div class="space-y-4 text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium">
                            <p>My name is <span class="font-bold text-neutral-900 dark:text-neutral-100 italic">Adamu Bilikis</span>, and I am a 100-level student currently enrolled in the B.Tech Computer Science programme at Federal University of Technology, Minna (FUTMINNA).</p>
                            <p>I am deeply passionate about the dynamic world of Technology and have chosen Computer Science because I am driven by the desire to make an impact through innovative solutions. I believe that technology is the bridge to a more efficient and connected future.</p>
                            <p>My academic goal is to excel in software development and data structures, while building a solid foundation in computational theory.</p>
                        </div>
                        <div class="pt-6 border-t border-neutral-100 dark:border-neutral-800 flex gap-4">
                             <div class="flex-1">
                                <p class="text-[10px] font-black uppercase text-neutral-400 mb-1">Passions</p>
                                <div class="flex flex-wrap gap-2">
                                    <span class="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs font-bold text-neutral-600 dark:text-neutral-400">Coding</span>
                                    <span class="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs font-bold text-neutral-600 dark:text-neutral-400">Innovation</span>
                                    <span class="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs font-bold text-neutral-600 dark:text-neutral-400">Problem Solving</span>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('content').innerHTML = html;
}

function renderSettings() {
    const isDark = document.documentElement.classList.contains('dark');
    const html = `
        <div class="space-y-8 animate-in text-neutral-800 dark:text-neutral-100">
            <h2 class="text-2xl font-bold tracking-tight">Settings</h2>
            <div class="rounded-3xl bg-white dark:bg-neutral-900 p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-8">
                <div class="flex flex-col gap-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="font-bold">Dark Mode</p>
                            <p class="text-xs text-neutral-500">Switch between light and dark themes</p>
                        </div>
                        <button id="themeToggleBtn" onclick="toggleTheme()" class="h-6 w-11 rounded-full ${isDark ? 'bg-fut-blue' : 'bg-neutral-200'} relative transition-colors duration-300">
                             <div class="absolute top-1 left-1 h-4 w-4 bg-white rounded-full transition-transform duration-300 transform ${isDark ? 'translate-x-5' : ''}"></div>
                        </button>
                    </div>
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="font-bold">Profile Visibility</p>
                            <p class="text-xs text-neutral-500">Make your basic academic info searchable</p>
                        </div>
                        <div class="h-6 w-11 rounded-full bg-neutral-200 relative">
                             <div class="absolute top-1 left-1 h-4 w-4 bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('content').innerHTML = html;
}

function renderField(label, value, className = "") {
    return `
        <div class="${className}">
            <p class="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">${label}</p>
            <p class="text-sm font-bold text-neutral-800 dark:text-neutral-200">${value}</p>
        </div>
    `;
}

function openPreviewModal() {
    const modal = document.getElementById('modalOverlay');
    const content = document.getElementById('modalContent');
    content.innerHTML = `
        <div class="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-8 py-4 no-print">
            <h3 class="font-bold text-neutral-900 uppercase tracking-widest text-xs">Bio-Data Slip Preview</h3>
            <button onclick="closeModal()" class="p-2 text-neutral-400 hover:bg-neutral-100 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        </div>
        <div class="max-h-[80vh] overflow-y-auto bg-neutral-200 p-4 sm:p-12 print:p-0 print:bg-white print:max-h-none">
            <div id="printArea" class="mx-auto w-full max-w-[210mm] bg-white p-12 shadow-2xl print:shadow-none font-sans border border-neutral-100 print:border-none">
                <!-- Slip Header -->
                <div class="border-b-2 border-black pb-6 text-center">
                    <h1 class="text-2xl font-black uppercase text-neutral-900 leading-none">Federal University of Technology, Minna</h1>
                    <p class="text-sm font-bold mt-1 uppercase">P.M.B. 65, Minna, Niger State, Nigeria</p>
                    <p class="text-xs font-black mt-2 tracking-widest bg-black text-white py-1 px-4 inline-block">OFFICIAL STUDENT BIO-DATA SLIP</p>
                </div>

                <!-- Personal Info Section -->
                <div class="mt-8 flex gap-8">
                    <div class="flex-1">
                         <div class="grid grid-cols-2 gap-x-12 gap-y-4 text-xs">
                            <div class="col-span-2 border-b pb-1 font-black uppercase text-neutral-400 text-[10px]">Personal Information</div>
                            <div class="col-span-2"><span class="font-black">Full Name:</span> ${studentData.personal.fullName}</div>
                            <div><span class="font-black">Gender:</span> ${studentData.personal.gender}</div>
                            <div><span class="font-black">Date of Birth:</span> ${studentData.personal.dob}</div>
                            <div><span class="font-black">State of Origin:</span> ${studentData.personal.state}</div>
                            <div><span class="font-black">Local Government:</span> ${studentData.personal.lga}</div>
                            <div><span class="font-black">Blood Group:</span> ${studentData.personal.bloodGroup}</div>
                            <div><span class="font-black">Nationality:</span> ${studentData.personal.nationality}</div>
                         </div>
                    </div>
                    <div class="w-32 h-40 border-2 border-black overflow-hidden bg-neutral-50 shrink-0">
                         <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop" class="w-full h-full object-cover">
                    </div>
                </div>

                <!-- Academic Info Section -->
                <div class="mt-8">
                    <div class="border-b pb-1 font-black uppercase text-neutral-400 text-[10px] mb-4">Academic Information</div>
                    <div class="grid grid-cols-2 gap-x-12 gap-y-3 text-xs">
                        <div><span class="font-black">Matric Number:</span> ${studentData.academic.matricNumber}</div>
                        <div><span class="font-black">Student ID:</span> ${studentData.academic.studentId}</div>
                        <div class="col-span-2"><span class="font-black">College/School:</span> ${studentData.academic.school}</div>
                        <div class="col-span-2"><span class="font-black">Department:</span> ${studentData.academic.department}</div>
                        <div class="col-span-2"><span class="font-black">Programme:</span> ${studentData.academic.programme}</div>
                        <div class="col-span-2"><span class="font-black">Primary School:</span> ${studentData.academic.primarySchool}</div>
                        <div class="col-span-2"><span class="font-black">Secondary School:</span> ${studentData.academic.secondarySchool}</div>
                        <div><span class="font-black">Level:</span> ${studentData.academic.level} LEVEL</div>
                        <div><span class="font-black">Academic Session:</span> ${studentData.academic.entrySession}</div>
                    </div>
                </div>

                 <!-- Contact & Parent Information Section -->
                <div class="mt-8">
                    <div class="border-b pb-1 font-black uppercase text-neutral-400 text-[10px] mb-4">Contact & Parent Information</div>
                    <div class="grid grid-cols-2 gap-x-12 gap-y-3 text-xs">
                        <div><span class="font-black">Father's Name:</span> ${studentData.personal.fatherName}</div>
                        <div><span class="font-black">Mother's Name:</span> ${studentData.personal.motherName}</div>
                        <div><span class="font-black">Mobile Number:</span> ${studentData.personal.phoneNumbers[0]}</div>
                        <div><span class="font-black">Email:</span> ${studentData.personal.email}</div>
                        <div class="col-span-2"><span class="font-black">Contact Address:</span> ${studentData.personal.address}</div>
                        <div><span class="font-black">Next of Kin:</span> ${studentData.nextOfKin.name}</div>
                        <div><span class="font-black">Relationship:</span> ${studentData.nextOfKin.relationship}</div>
                    </div>
                </div>

                <!-- Verification Block -->
                <div class="mt-16 flex justify-between items-end gap-12">
                    <div class="flex-1 border-t border-black pt-2 text-center text-[10px] font-black uppercase">Student's Signature & Date</div>
                    <div class="flex-1 border-t border-black pt-2 text-center text-[10px] font-black uppercase">Head of Dept. / ICT Officer Signature</div>
                    <div class="w-32 h-32 border border-neutral-100 flex items-center justify-center text-[8px] font-black text-neutral-300 uppercase transform rotate-45 border-dashed">Official Stamp Area</div>
                </div>

                <div class="mt-12 text-[8px] font-bold text-neutral-400 text-center uppercase tracking-widest border-t pt-4">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()} • Verification Code: FUT-${studentData.academic.studentId}-2025</div>
            </div>
        </div>
        <div class="flex justify-end gap-3 border-t border-neutral-100 bg-neutral-50 px-8 py-4 no-print">
            <button onclick="closeModal()" class="rounded-xl border border-neutral-200 px-6 py-2 text-sm font-bold text-neutral-600 transition-colors hover:bg-neutral-100">Cancel</button>
            <button onclick="window.print()" class="rounded-xl bg-fut-blue px-8 py-2 text-sm font-bold text-white shadow-xl shadow-fut-blue/20 transition-transform active:scale-95">Print Bio-Data Slip</button>
        </div>
    `;
    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.add('hidden');
}

function updateThemeIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    const sunIcon = document.getElementById('themeIconSun');
    const moonIcon = document.getElementById('themeIconMoon');
    const settingsToggleBtn = document.getElementById('themeToggleBtn');
    
    if (sunIcon) sunIcon.classList.toggle('hidden', !isDark);
    if (moonIcon) moonIcon.classList.toggle('hidden', isDark);
    
    // Update settings toggle if it exists in DOM
    if (settingsToggleBtn) {
        settingsToggleBtn.className = `h-6 w-11 rounded-full ${isDark ? 'bg-fut-blue' : 'bg-neutral-200'} relative transition-colors duration-300`;
        const dot = settingsToggleBtn.querySelector('div');
        if (dot) {
            dot.className = `absolute top-1 left-1 h-4 w-4 bg-white rounded-full transition-transform duration-300 transform ${isDark ? 'translate-x-5' : ''}`;
        }
    }
}

window.toggleTheme = function() {
    document.documentElement.classList.toggle('dark');
    updateThemeIcons();
};

window.updateThemeIcons = updateThemeIcons;

// Mobile Menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebar = document.getElementById('sidebar');
const themeToggle = document.getElementById('themeToggle');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('hidden');
    });
}

if (themeToggle) {
    // themeToggle.addEventListener('click', toggleTheme); // Handled by onclick in HTML
}

// Navigation Handling
window.addEventListener('hashchange', () => {
    const page = window.location.hash.substring(1) || 'dashboard';
    navigateTo(page);
    if (window.innerWidth < 1024) {
        sidebar.classList.add('hidden');
    }
});

// Initialization - Logic removed from here and handled in DOMContentLoaded
/*
window.addEventListener('DOMContentLoaded', () => {
    const initialPage = window.location.hash.substring(1) || 'dashboard';
    navigateTo(initialPage);
});
*/
