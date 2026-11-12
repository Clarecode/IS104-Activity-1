
// ======================================
// STUDENT ENROLLMENT MANAGEMENT SYSTEM
// ======================================

// COURSE AND SECTION SETTINGS

const courses = [
    "Computer Science",
    "Business Administration",
    "Information Technology"
];

const sections = ["A", "B", "C"];

// ======================================
// SAMPLE STUDENT RECORDS (24 STUDENTS)
// ======================================

const names = [
    "Amelia Reyes",
    "Benjamin Cruz",
    "Chloe Santos",
    "Daniel Garcia",
    "Ella Mendoza",
    "Ethan Lim",
    "Isabella Torres",
    "Jacob Ramos",
    "James Aquino",
    "Jasmine Flores",
    "Liam Navarro",
    "Mia Castillo",
    "Noah Villanueva",
    "Olivia Bautista",
    "Lucas Fernandez",
    "Ava Morales",
    "Sophia Rivera",
    "Gabriel Tan",
    "Emma Dela Cruz",
    "Nathan Perez",
    "Charlotte Diaz",
    "Alexander Lee",
    "Grace Martin",
    "Samuel Gomez"
];

const emails = [
    "amelia.reyes",
    "benjamin.cruz",
    "chloe.santos",
    "daniel.garcia",
    "ella.mendoza",
    "ethan.lim",
    "isabella.torres",
    "jacob.ramos",
    "james.aquino",
    "jasmine.flores",
    "liam.navarro",
    "mia.castillo",
    "noah.villanueva",
    "olivia.bautista",
    "lucas.fernandez",
    "ava.morales",
    "sophia.rivera",
    "gabriel.tan",
    "emma.delacruz",
    "nathan.perez",
    "charlotte.diaz",
    "alexander.lee",
    "grace.martin",
    "samuel.gomez"
];

const ages = [
    18, 20, 19, 21, 20, 22,
    19, 21, 20, 18, 23, 20,
    19, 22, 21, 18, 20, 23,
    19, 21, 20, 22, 19, 20
];

// Course and section combinations:
// CS: A5, B4, C3 = 12
// BA: A3, B3, C2 = 8
// IT: A2, B1, C1 = 4

const assignments = [
    ...Array(5).fill(["Computer Science", "A"]),
    ...Array(4).fill(["Computer Science", "B"]),
    ...Array(3).fill(["Computer Science", "C"]),

    ...Array(3).fill(["Business Administration", "A"]),
    ...Array(3).fill(["Business Administration", "B"]),
    ...Array(2).fill(["Business Administration", "C"]),

    ...Array(2).fill(["Information Technology", "A"]),
    ...Array(1).fill(["Information Technology", "B"]),
    ...Array(1).fill(["Information Technology", "C"])
];

let students = JSON.parse(localStorage.getItem("enrollmentStudents"));

if (!Array.isArray(students)) {

    students = names.map((name, index) => ({
        id: `STU-${String(10001 + index)}`,
        name: name,
        email: emails[index] + "@example.edu",
        age: ages[index],
        course: assignments[index][0],
        section: assignments[index][1]
    }));

    saveData();
}

// ======================================
// GLOBAL VARIABLES
// ======================================

let currentPage = 1;
let pageSize = 10;
let sortField = "id";
let sortDirection = 1;

// ======================================
// SAVE DATA TO LOCAL STORAGE
// ======================================

function saveData() {

    localStorage.setItem(
        "enrollmentStudents",
        JSON.stringify(students)
    );

}

// ======================================
// PAGE NAVIGATION
// ======================================

function showPage(page) {

    document.querySelectorAll(".page").forEach(section => {
        section.classList.add("hidden");
    });

    document.getElementById(page).classList.remove("hidden");

    document.querySelectorAll(".nav-link").forEach(button => {
        button.classList.remove("active");
    });

    const active = document.querySelector(
        `.nav-link[data-page="${page}"]`
    );

    if (active) {
        active.classList.add("active");
    }

    const labels = {
        enrollment: "Enrollment form",
        records: "Student table",
        summary: "Summary report"
    };

    document.getElementById("breadcrumb").innerHTML =
        `Workspace &nbsp; › &nbsp; <strong>${labels[page]}</strong>`;

    if (page === "records") {
        currentPage = 1;
        displayStudents();
    }

    if (page === "summary") {
        updateSummary();
    }

    updateOverview();
}

// SIDEBAR NAVIGATION

document.querySelectorAll(".nav-link").forEach(button => {

    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });

});

// ADD STUDENT BUTTON

document.getElementById("addStudentBtn").addEventListener("click", () => {

    resetForm();
    showPage("enrollment");

});

// ======================================
// FORM VALIDATION
// ======================================

const fields = [
    "studentId",
    "studentName",
    "studentEmail",
    "studentAge",
    "studentCourse",
    "studentSection"
];

function clearErrors() {

    fields.forEach(id => {

        document.getElementById(id + "Error").textContent = "";

        document.getElementById(id)
            .closest(".form-group")
            .classList.remove("invalid");

    });

    document.getElementById("formAlert").classList.add("hidden");

}

function setError(id, message) {

    const input = document.getElementById(id);

    document.getElementById(id + "Error").textContent = message;

    input.closest(".form-group").classList.add("invalid");

}

function validateForm() {

    clearErrors();

    let valid = true;

    const id = document.getElementById("studentId").value.trim();
    const name = document.getElementById("studentName").value.trim();
    const email = document.getElementById("studentEmail").value.trim();
    const age = document.getElementById("studentAge").value;
    const course = document.getElementById("studentCourse").value;
    const section = document.getElementById("studentSection").value;

    // STUDENT ID VALIDATION

    if (!/^STU-\d{5}$/.test(id)) {

        setError(
            "studentId",
            "Please enter a valid Student ID (e.g., STU-12345)."
        );

        valid = false;

    } else if (students.some(student =>
        student.id.toLowerCase() === id.toLowerCase()
    )) {

        setError("studentId", "Student ID already exists.");

        valid = false;

    }

    // NAME VALIDATION

    if (!/^[\p{L}][\p{L}\s.'-]*$/u.test(name) || name.length < 2) {

        setError("studentName", "Please enter your full name.");

        valid = false;

    }

    // EMAIL VALIDATION

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

        setError(
            "studentEmail",
            "Please enter a valid email address (e.g., jane@example.com)."
        );

        valid = false;

    } else if (students.some(student =>
        student.email.toLowerCase() === email.toLowerCase()
    )) {

        setError("studentEmail", "Email address already registered.");

        valid = false;

    }

    // AGE VALIDATION

    if (
        age === "" ||
        !Number.isInteger(Number(age)) ||
        Number(age) < 18 ||
        Number(age) > 100
    ) {

        setError(
            "studentAge",
            "Please enter a valid age (18–100)."
        );

        valid = false;

    }

    // COURSE VALIDATION

    if (!courses.includes(course)) {

        setError(
            "studentCourse",
            "Please select a valid course from the list."
        );

        valid = false;

    }

    // SECTION VALIDATION

    if (!sections.includes(section)) {

        setError(
            "studentSection",
            "Please select a valid section (A, B, C, etc.)."
        );

        valid = false;

    }

    if (!valid) {

        document.getElementById("formAlert").classList.remove("hidden");

    }

    return valid;

}

// ======================================
// SUBMIT ENROLLMENT
// ======================================

document.getElementById("studentForm").addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const newStudent = {

            id: document.getElementById("studentId").value.trim(),

            name: document.getElementById("studentName").value.trim(),

            email: document.getElementById("studentEmail").value.trim(),

            age: Number(document.getElementById("studentAge").value),

            course: document.getElementById("studentCourse").value,

            section: document.getElementById("studentSection").value

        };

        students.push(newStudent);

        saveData();

        resetForm();

        updateOverview();

        alert("Student successfully enrolled!");

        showPage("records");

    }
);

// ======================================
// RESET FORM
// ======================================

function resetForm() {

    document.getElementById("studentForm").reset();

    clearErrors();

}

document.getElementById("studentForm").addEventListener(
    "reset",
    () => setTimeout(clearErrors, 0)
);

// ======================================
// UPDATE TABLE OVERVIEW
// ======================================

function updateOverview() {

    document.getElementById("tableTotal").textContent =
        students.length;

    document.getElementById("tableCourses").textContent =
        `${new Set(students.map(s => s.course)).size} courses`;

    document.getElementById("tableSections").textContent =
        `${new Set(students.map(s => s.section)).size} sections`;

}

// ======================================
// SEARCH AND FILTER
// ======================================

const searchInput = document.getElementById("searchInput");

const courseFilter = document.getElementById("courseFilter");

const sectionFilter = document.getElementById("sectionFilter");

const ageFilter = document.getElementById("ageFilter");

function getFilteredStudents() {

    let result = [...students];

    const search = searchInput.value.toLowerCase().trim();

    const course = courseFilter.value;

    const section = sectionFilter.value;

    const age = ageFilter.value;

    // SEARCH BY NAME, ID, EMAIL

    if (search) {

        result = result.filter(student =>

            student.name.toLowerCase().includes(search) ||

            student.id.toLowerCase().includes(search) ||

            student.email.toLowerCase().includes(search)

        );

    }

    // COURSE FILTER

    if (course) {

        result = result.filter(student =>
            student.course === course
        );

    }

    // SECTION FILTER

    if (section) {

        result = result.filter(student =>
            student.section === section
        );

    }

    // AGE FILTER

    if (age === "18-20") {

        result = result.filter(student =>
            student.age >= 18 && student.age <= 20
        );

    } else if (age === "21-23") {

        result = result.filter(student =>
            student.age >= 21 && student.age <= 23
        );

    } else if (age === "24+") {

        result = result.filter(student =>
            student.age >= 24
        );

    }

    // SORTING

    result.sort((a, b) => {

        let first = a[sortField];
        let second = b[sortField];

        if (typeof first === "string") {

            first = first.toLowerCase();
            second = second.toLowerCase();

        }

        if (first < second) return -sortDirection;

        if (first > second) return sortDirection;

        return 0;

    });

    return result;

}

// ======================================
// DISPLAY STUDENT TABLE
// ======================================

function displayStudents() {

    const tableBody = document.getElementById("studentTableBody");

    const filtered = getFilteredStudents();

    const totalPages = Math.max(
        1,
        Math.ceil(filtered.length / pageSize)
    );

    currentPage = Math.min(currentPage, totalPages);

    const start = (currentPage - 1) * pageSize;

    const visibleStudents = filtered.slice(
        start,
        start + pageSize
    );

    tableBody.innerHTML = "";

    if (visibleStudents.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;padding:30px;">
                    No student records found.
                </td>
            </tr>
        `;

    }

    visibleStudents.forEach(student => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHTML(student.id)}</td>

            <td class="student-name">
                ${escapeHTML(student.name)}
            </td>

            <td>${escapeHTML(student.email)}</td>

            <td>${student.age}</td>

            <td>${escapeHTML(student.course)}</td>

            <td>
                <span class="section-badge">
                    ${escapeHTML(student.section)}
                </span>
            </td>

            <td>
                <button class="delete-btn"
                    data-id="${escapeHTML(student.id)}">
                    Delete
                </button>
            </td>
        `;

        tableBody.appendChild(row);

    });

    document.getElementById("paginationInfo").textContent =

        filtered.length === 0
            ? "Showing 0 students"
            : `Showing ${start + 1}–${Math.min(start + pageSize, filtered.length)} of ${filtered.length} students`;

    document.getElementById("pageNumber").textContent =
        `${currentPage} / ${totalPages}`;

    document.getElementById("prevPage").disabled =
        currentPage === 1;

    document.getElementById("nextPage").disabled =
        currentPage === totalPages;

    updateOverview();

}

// ESCAPE USER INPUT BEFORE DISPLAYING IN HTML

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];

    });

}

// DELETE STUDENT

document.getElementById("studentTableBody").addEventListener(
    "click",
    function(event) {

        const button = event.target.closest(".delete-btn");

        if (!button) return;

        const id = button.dataset.id;

        const confirmed = confirm(
            "Are you sure you want to delete this student?"
        );

        if (!confirmed) return;

        students = students.filter(student => student.id !== id);

        saveData();

        displayStudents();

        updateSummary();

    }
);

// SEARCH EVENTS

[searchInput, courseFilter, sectionFilter, ageFilter].forEach(input => {

    input.addEventListener("input", () => {

        currentPage = 1;

        displayStudents();

    });

    input.addEventListener("change", () => {

        currentPage = 1;

        displayStudents();

    });

});

// PAGE SIZE

document.getElementById("pageSize").addEventListener(
    "change",
    function() {

        pageSize = Number(this.value);

        currentPage = 1;

        displayStudents();

    }
);

// PREVIOUS PAGE

document.getElementById("prevPage").addEventListener(
    "click",
    () => {

        if (currentPage > 1) {

            currentPage--;

            displayStudents();

        }

    }
);

// NEXT PAGE

document.getElementById("nextPage").addEventListener(
    "click",
    () => {

        const totalPages = Math.ceil(
            getFilteredStudents().length / pageSize
        );

        if (currentPage < totalPages) {

            currentPage++;

            displayStudents();

        }

    }
);

// SORT TABLE

document.querySelectorAll(".sort-btn").forEach(button => {

    button.addEventListener("click", () => {

        const field = button.dataset.sort;

        if (sortField === field) {

            sortDirection *= -1;

        } else {

            sortField = field;

            sortDirection = 1;

        }

        displayStudents();

    });

});

// ======================================
// SUMMARY REPORT FILTERS
// ======================================

const summaryCourseFilter =
    document.getElementById("summaryCourseFilter");

const summarySectionFilter =
    document.getElementById("summarySectionFilter");

function getSummaryStudents() {

    let result = [...students];

    if (summaryCourseFilter.value) {

        result = result.filter(student =>
            student.course === summaryCourseFilter.value
        );

    }

    if (summarySectionFilter.value) {

        result = result.filter(student =>
            student.section === summarySectionFilter.value
        );

    }

    return result;

}

summaryCourseFilter.addEventListener("change", updateSummary);

summarySectionFilter.addEventListener("change", updateSummary);

// ======================================
// SUMMARY REPORT CALCULATIONS
// ======================================

function updateSummary() {

    const data = getSummaryStudents();

    const total = data.length;

    const courseNames = [...new Set(
        data.map(student => student.course)
    )];

    const sectionNames = [...new Set(
        data.map(student => student.section)
    )];

    const ages = data.map(student => student.age);

    // TOTAL ENROLLMENT

    document.getElementById("summaryTotal").textContent = total;

    // TOTAL COURSES

    document.getElementById("summaryCourses").textContent =
        courseNames.length;

    // TOTAL SECTIONS

    document.getElementById("summarySections").textContent =
        sectionNames.length;

    // AVERAGE AGE AND AGE RANGE

    if (total > 0) {

        const average =
            ages.reduce((sum, age) => sum + age, 0) / total;

        document.getElementById("summaryAverage").textContent =
            average.toFixed(1);

        document.getElementById("summaryAgeRange").textContent =
            `Age range: ${Math.min(...ages)}–${Math.max(...ages)} years`;

    } else {

        document.getElementById("summaryAverage").textContent = "—";

        document.getElementById("summaryAgeRange").textContent =
            "No age records";

    }

    // COURSE DISTRIBUTION

    document.getElementById("courseStudentCount").textContent =
        `${total} students`;

    const distribution =
        document.getElementById("courseDistribution");

    distribution.innerHTML = "";

    courseNames.forEach(course => {

        const count = data.filter(student =>
            student.course === course
        ).length;

        const percentage = total
            ? (count / total) * 100
            : 0;

        const item = document.createElement("div");

        item.className = "course-bar-item";

        item.innerHTML = `
            <div class="course-bar-label">
                <span>${escapeHTML(course)}</span>
                <strong>${count} · ${percentage.toFixed(1)}%</strong>
            </div>

            <div class="course-progress">
                <div style="width:${percentage}%"></div>
            </div>
        `;

        distribution.appendChild(item);

    });

    if (total === 0) {

        distribution.innerHTML =
            "<p>No course records available.</p>";

    }

    // COURSE BY SECTION MATRIX

    const matrix = document.getElementById("matrixBody");

    matrix.innerHTML = "";

    let sectionTotals = {
        A: 0,
        B: 0,
        C: 0
    };

    courseNames.forEach(course => {

        let courseTotal = 0;

        let cells = "";

        sections.forEach(section => {

            const count = data.filter(student =>
                student.course === course &&
                student.section === section
            ).length;

            courseTotal += count;

            sectionTotals[section] += count;

            cells += `<td>${count}</td>`;

        });

        matrix.innerHTML += `
            <tr>
                <td>${escapeHTML(shortCourse(course))}</td>
                ${cells}
                <td>${courseTotal}</td>
            </tr>
        `;

    });

    // MATRIX TOTAL ROW

    matrix.innerHTML += `
        <tr>
            <td>Total</td>
            <td>${sectionTotals.A}</td>
            <td>${sectionTotals.B}</td>
            <td>${sectionTotals.C}</td>
            <td>${total}</td>
        </tr>
    `;

    // SECTION SHARES

    document.getElementById("sectionShares").textContent =
        `A: ${total ? (sectionTotals.A / total * 100).toFixed(1) : 0}%  ·  ` +
        `B: ${total ? (sectionTotals.B / total * 100).toFixed(1) : 0}%  ·  ` +
        `C: ${total ? (sectionTotals.C / total * 100).toFixed(1) : 0}%`;

    // INSIGHTS

    updateInsights(data, sectionTotals);

}

// SHORT COURSE NAMES

function shortCourse(course) {

    const abbreviations = {
        "Computer Science": "CS",
        "Business Administration": "BA",
        "Information Technology": "IT"
    };

    return abbreviations[course] || course;

}

// ======================================
// ENROLLMENT INSIGHTS
// ======================================

function updateInsights(data, sectionTotals) {

    const total = data.length;

    if (total === 0) {

        document.getElementById("insightCourseTitle").textContent =
            "No enrollment data";

        document.getElementById("insightCourseText").textContent =
            "Add students to see course statistics.";

        document.getElementById("insightSectionTitle").textContent =
            "No section data";

        document.getElementById("insightSectionText").textContent =
            "Section statistics will appear here.";

        document.getElementById("insightAgeText").textContent =
            "Age statistics will appear here.";

        return;

    }

    // LEADING COURSE

    const courseCounts = courses.map(course => ({

        name: course,

        count: data.filter(student =>
            student.course === course
        ).length

    }));

    const leadingCourse = courseCounts.reduce((a, b) =>
        b.count > a.count ? b : a
    );

    document.getElementById("insightCourseTitle").textContent =
        `${leadingCourse.name} leads`;

    document.getElementById("insightCourseText").textContent =
        `${leadingCourse.count} students make up ${(leadingCourse.count / total * 100).toFixed(1)}% of the cohort.`;

    // LEADING SECTION

    const leadingSection = Object.entries(sectionTotals).reduce(
        (a, b) => b[1] > a[1] ? b : a
    );

    document.getElementById("insightSectionTitle").textContent =
        `Section ${leadingSection[0]} is the largest`;

    document.getElementById("insightSectionText").textContent =
        `${leadingSection[1]} students are enrolled in Section ${leadingSection[0]}.`;

    // AGE INSIGHT

    const youngStudents = data.filter(student =>
        student.age >= 18 && student.age <= 20
    ).length;

    const averageAge = data.reduce(
        (sum, student) => sum + student.age, 0
    ) / total;

    document.getElementById("insightAgeText").textContent =
        `${youngStudents} of ${total} students are ages 18–20. The cohort average age is ${averageAge.toFixed(1)} years.`;

}

// ======================================
// EXPORT CSV FUNCTION
// ======================================

function downloadCSV(filename, rows) {

    const csv = rows.map(row =>

        row.map(value => {

            let text = String(value ?? "");

            // Prevent spreadsheet formula injection

            if (/^[=+\-@\t\r]/.test(text)) {
                text = "'" + text;
            }

            return `"${text.replace(/"/g, '""')}"`;

        }).join(",")

    ).join("\r\n");

    const blob = new Blob(
        ["\uFEFF" + csv],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = filename;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

}

// EXPORT STUDENT RECORDS

document.getElementById("exportStudents").addEventListener(
    "click",
    () => {

        const rows = [

            ["Student ID", "Name", "Email", "Age", "Course", "Section"],

            ...getFilteredStudents().map(student => [

                student.id,
                student.name,
                student.email,
                student.age,
                student.course,
                student.section

            ])

        ];

        downloadCSV("Student_Records.csv", rows);

    }
);

// ======================================
// EXPORT SUMMARY REPORT
// ======================================

document.getElementById("exportSummary").addEventListener(
    "click",
    () => {

        const data = getSummaryStudents();

        const rows = [

            ["STUDENT ENROLLMENT SUMMARY"],
            ["Academic Year", "2026–2027"],
            ["Semester", "First semester"],
            ["Total Enrolled", data.length],
            ["Courses Represented",
                new Set(data.map(s => s.course)).size],
            ["Sections Represented",
                new Set(data.map(s => s.section)).size],

            ["Average Age",
                data.length
                    ? (data.reduce((sum, s) => sum + s.age, 0) / data.length).toFixed(1)
                    : "N/A"],

            [],

            ["COURSE", "SECTION A", "SECTION B", "SECTION C", "TOTAL"]

        ];

        courseNamesForExport(data).forEach(course => {

            const counts = sections.map(section =>

                data.filter(student =>
                    student.course === course &&
                    student.section === section
                ).length

            );

            rows.push([
                course,
                ...counts,
                counts.reduce((sum, count) => sum + count, 0)
            ]);

        });

        downloadCSV("Enrollment_Summary.csv", rows);

    }
);

function courseNamesForExport(data) {

    return [...new Set(data.map(student => student.course))];

}

// ======================================
// INITIALIZE SYSTEM
// ======================================

function initializeSystem() {

    updateOverview();

    displayStudents();

    updateSummary();

    showPage("enrollment");

}

initializeSystem();
