// ===================================
// STUDENT ENROLLMENT SYSTEM
// ===================================

// Sample student records
let students = JSON.parse(localStorage.getItem("students")) || [
    {
        id: "STU-1001",
        name: "Amelia Brooks",
        email: "amelia.b@school.edu",
        age: 19,
        course: "BS Information System",
        section: "A"
    },
    {
        id: "STU-1002",
        name: "Benjamin Carter",
        email: "benjamin.c@school.edu",
        age: 20,
        course: "BS Information Technology",
        section: "A"
    },
    {
        id: "STU-1003",
        name: "Chloe Davis",
        email: "chloe.d@school.edu",
        age: 18,
        course: "BS Computer Science",
        section: "B"
    },
    {
        id: "STU-1004",
        name: "Daniel Evans",
        email: "daniel.e@school.edu",
        age: 21,
        course: "BS Information System",
        section: "A"
    },
    {
        id: "STU-1005",
        name: "Emma Foster",
        email: "emma.f@school.edu",
        age: 19,
        course: "BS Information Technology",
        section: "B"
    },
    {
        id: "STU-1006",
        name: "Gabriel Garcia",
        email: "gabriel.g@school.edu",
        age: 20,
        course: "BS Computer Science",
        section: "B"
    },
    {
        id: "STU-1007",
        name: "Hannah Lee",
        email: "hannah.l@school.edu",
        age: 18,
        course: "BS Information System",
        section: "A"
    },
    {
        id: "STU-1008",
        name: "Isaac Miller",
        email: "isaac.m@school.edu",
        age: 22,
        course: "BS Computer Engineering",
        section: "A"
    }
];

function saveData() {
    localStorage.setItem("students", JSON.stringify(students));
}

// ===================================
// NAVIGATION
// ===================================

function showPage(pageName) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });

    document.getElementById(pageName).classList.add("active-page");

    document.querySelectorAll(".nav-btn").forEach(button => {
        button.classList.remove("active");
    });

    document.querySelector(
        `[data-page="${pageName}"]`
    ).classList.add("active");

    if (pageName === "students") {
        displayStudents();
    }

    if (pageName === "report") {
        generateReport();
    }
}

document.querySelectorAll(".nav-btn").forEach(button => {
    button.addEventListener("click", function () {
        showPage(this.dataset.page);
    });
});

// ===================================
// FORM VALIDATION
// ===================================

const form = document.getElementById("enrollmentForm");

function showError(fieldId, message) {

    const field = document.getElementById(fieldId);

    const error = document.getElementById(fieldId + "Error");

    field.classList.add("error");

    error.textContent = message;
}

function clearErrors() {

    document.querySelectorAll(".field small").forEach(error => {
        error.textContent = "";
    });

    document.querySelectorAll(".field textarea, .field select").forEach(field => {
        field.classList.remove("error");
    });
}

form.addEventListener("submit", function(event) {

    event.preventDefault();

    clearErrors();

    const id = document.getElementById("studentId").value.trim();
    const name = document.getElementById("studentName").value.trim();
    const email = document.getElementById("studentEmail").value.trim();
    const age = document.getElementById("studentAge").value.trim();
    const course = document.getElementById("studentCourse").value;
    const section = document.getElementById("studentSection").value;

    let valid = true;

    // Student ID validation
    if (!/^STU-\d{4}$/.test(id)) {
        showError("studentId", "Invalid ID format. Use STU-XXXX.");
        valid = false;
    }

    // Duplicate ID validation
    else if (students.some(student => student.id.toLowerCase() === id.toLowerCase())) {
        showError("studentId", "Student ID already exists.");
        valid = false;
    }

    // Name validation
    if (!/^[A-Za-zÀ-ÿ]+(?:[ '-][A-Za-zÀ-ÿ]+)+$/.test(name)) {
        showError("studentName", "Please enter your full name.");
        valid = false;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError("studentEmail", "Enter a valid email address.");
        valid = false;
    }

    // Age validation
    if (!/^\d+$/.test(age) || Number(age) < 15 || Number(age) > 100) {
        showError("studentAge", "Age must be a valid number between 15 and 100.");
        valid = false;
    }

    // Course validation
    if (course === "") {
        showError("studentCourse", "Please select a course.");
        valid = false;
    }

    // Section validation
    if (section === "") {
        showError("studentSection", "Section is required.");
        valid = false;
    }

    if (!valid) {
        return;
    }

    // Create student record
    const newStudent = {
        id: id,
        name: name,
        email: email,
        age: Number(age),
        course: course,
        section: section
    };

    students.push(newStudent);

    saveData();

    alert("Student successfully enrolled!");

    form.reset();

    clearErrors();

    displayStudents();

    generateReport();

    showPage("students");
});

// Clear errors when resetting the form
form.addEventListener("reset", function() {
    setTimeout(clearErrors, 0);
});

// ===================================
// DISPLAY STUDENT RECORDS
// ===================================

function displayStudents() {

    const tableBody = document.getElementById("studentTableBody");

    const search = document.getElementById("searchInput").value.toLowerCase();

    const course = document.getElementById("courseFilter").value;

    const section = document.getElementById("sectionFilter").value;

    tableBody.innerHTML = "";

    const filteredStudents = students.filter(student => {

        const matchesSearch =
            student.id.toLowerCase().includes(search) ||
            student.name.toLowerCase().includes(search) ||
            student.email.toLowerCase().includes(search);

        const matchesCourse = !course || student.course === course;

        const matchesSection = !section || student.section === section;

        return matchesSearch && matchesCourse && matchesSection;
    });

    filteredStudents.forEach(student => {

        const row = document.createElement("tr");

        [
            student.id,
            student.name,
            student.email,
            student.age,
            student.course,
            student.section
        ].forEach(value => {

            const cell = document.createElement("td");

            cell.textContent = value;

            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function() {
            deleteStudent(student.id);
        });

        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });

    document.getElementById("studentCount").textContent =
        filteredStudents.length + " students";

    document.getElementById("emptyMessage").hidden =
        filteredStudents.length !== 0;
}

// Search and filters
document.getElementById("searchInput").addEventListener("input", displayStudents);

document.getElementById("courseFilter").addEventListener("change", displayStudents);

document.getElementById("sectionFilter").addEventListener("change", displayStudents);

// ===================================
// DELETE STUDENT
// ===================================

function deleteStudent(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this student?"
    );

    if (confirmDelete) {

        students = students.filter(student => student.id !== id);

        saveData();

        displayStudents();

        generateReport();

        alert("Student record deleted successfully!");
    }
}

// ===================================
// EXPORT STUDENTS TO CSV
// ===================================

document.getElementById("exportBtn").addEventListener("click", function() {

    if (students.length === 0) {
        alert("No student records to export.");
        return;
    }

    const headers = ["Student ID", "Name", "Email", "Age", "Course", "Section"];

    const rows = students.map(student => [
        student.id,
        student.name,
        student.email,
        student.age,
        student.course,
        student.section
    ]);

    function escapeCSV(value) {
        return '"' + String(value).replace(/"/g, '""') + '"';
    }

    const csvContent = [
        headers,
        ...rows
    ].map(row => row.map(escapeCSV).join(",")).join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;"
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "Student_Records.csv";

    link.click();

    URL.revokeObjectURL(link.href);
});

// ===================================
// SUMMARY REPORT
// ===================================

function generateReport() {

    const total = students.length;

    const courses = [...new Set(students.map(s => s.course))];

    const sections = [...new Set(
        students.map(s => s.course + "-" + s.section)
    )];

    const sectionA = students.filter(s => s.section === "A").length;

    const sectionB = students.filter(s => s.section === "B").length;

    const average = sections.length
        ? Math.round(total / sections.length)
        : 0;

    document.getElementById("totalStudents").textContent = total;

    document.getElementById("totalCourses").textContent = courses.length;

    document.getElementById("totalSections").textContent = sections.length;

    document.getElementById("averageSize").textContent = average;

    // Report table
    const reportBody = document.getElementById("reportTableBody");

    reportBody.innerHTML = "";

    courses.forEach(course => {

        const courseStudents = students.filter(s => s.course === course);

        const countA = courseStudents.filter(s => s.section === "A").length;

        const countB = courseStudents.filter(s => s.section === "B").length;

        const countOther = courseStudents.length - countA - countB;

        const courseTotal = courseStudents.length;

        const share = total
            ? ((courseTotal / total) * 100).toFixed(1)
            : 0;

        const row = document.createElement("tr");

        [
            course,
            countA,
            countB,
            countOther,
            courseTotal,
            share + "%"
        ].forEach(value => {

            const cell = document.createElement("td");

            cell.textContent = value;

            row.appendChild(cell);
        });

        reportBody.appendChild(row);
    });

    // Section distribution
    const percentA = total ? (sectionA / total) * 100 : 0;

    const percentB = total ? (sectionB / total) * 100 : 0;

    document.getElementById("sectionABar").style.width = percentA + "%";

    document.getElementById("sectionBBar").style.width = percentB + "%";

    document.getElementById("sectionALabel").textContent =
        `A: ${sectionA} students (${percentA.toFixed(1)}%)`;

    document.getElementById("sectionBLabel").textContent =
        `B: ${sectionB} students (${percentB.toFixed(1)}%)`;

    // At a glance
    const largestCourse = courses
        .map(course => ({
            name: course,
            count: students.filter(s => s.course === course).length
        }))
        .sort((a, b) => b.count - a.count)[0];

    document.getElementById("glanceText").textContent = total
        ? `${largestCourse.name} has the largest enrollment with ${largestCourse.count} students. There are ${courses.length} courses and ${sections.length} assigned course sections. Each student is counted once in their assigned course and section.`
        : "No enrollment records are currently available.";
}

// ===================================
// DOWNLOAD SUMMARY REPORT
// ===================================

document.getElementById("downloadReport").addEventListener("click", function() {

    if (students.length === 0) {
        alert("No enrollment data available.");
        return;
    }

    const courses = [...new Set(students.map(s => s.course))];

    let report = "STUDENT ENROLLMENT SUMMARY REPORT\n";

    report += "====================================\n\n";

    report += "Total Students: " + students.length + "\n";

    report += "Total Courses: " + courses.length + "\n";

    report += "Generated: " + new Date().toLocaleString() + "\n\n";

    report += "ENROLLMENT BY COURSE\n";

    report += "====================================\n";

    courses.forEach(course => {

        const courseStudents = students.filter(s => s.course === course);

        report += "\n" + course + "\n";

        report += "Total Students: " + courseStudents.length + "\n";

        ["A", "B", "C", "D"].forEach(section => {

            const count = courseStudents.filter(s => s.section === section).length;

            if (count > 0) {
                report += "Section " + section + ": " + count + "\n";
            }
        });
    });

    const blob = new Blob([report], {
        type: "text/plain"
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "Enrollment_Summary_Report.txt";

    link.click();

    URL.revokeObjectURL(link.href);
});

// ===================================
// INITIALIZE WEBSITE
// ===================================

saveData();

displayStudents();

generateReport();