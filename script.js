
// INITIAL STUDENT RECORDS

let students = JSON.parse(localStorage.getItem("students")) || [
    {
        id: "STU-1001",
        name: "Ava Thompson",
        email: "ava.thompson@school.edu",
        age: 18,
        course: "Computer Science",
        year: "Year 1"
    },
    {
        id: "STU-1002",
        name: "Ethan Brooks",
        email: "ethan.brooks@school.edu",
        age: 19,
        course: "Business Admin",
        year: "Year 2"
    },
    {
        id: "STU-1003",
        name: "Sophia Patel",
        email: "sophia.patel@school.edu",
        age: 20,
        course: "Graphic Design",
        year: "Year 3"
    },
    {
        id: "STU-1004",
        name: "Noah Kim",
        email: "noah.kim@school.edu",
        age: 18,
        course: "Data Science",
        year: "Year 1"
    }
];

const courses = [
    "Computer Science",
    "Business Admin",
    "Graphic Design",
    "Data Science"
];

const years = [
    "Year 1",
    "Year 2",
    "Year 3",
    "Year 4"
];


// SAVE STUDENTS

function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}


// PAGE NAVIGATION

function showPage(page) {

    document.querySelectorAll(".page").forEach(section => {
        section.classList.add("hidden");
    });

    document.getElementById(page).classList.remove("hidden");

    const titles = {
        enrollment: "Student Enrollment",
        students: "Student Table",
        summary: "Summary Report"
    };

    document.getElementById("pageTitle").textContent =
        titles[page];

    document.getElementById("dropdown").classList.remove("show");

    if (page === "students") {
        displayStudents();
    }

    if (page === "summary") {
        displaySummary();
    }

    if (page === "enrollment") {
        window.scrollTo(0, 0);
    }
}


// ADMIN DROPDOWN

document.getElementById("adminButton").addEventListener("click", function() {
    document.getElementById("dropdown").classList.toggle("show");
});

document.addEventListener("click", function(event) {
    if (!event.target.closest(".admin-menu")) {
        document.getElementById("dropdown").classList.remove("show");
    }
});


// FORM VALIDATION

function validateForm() {

    const id = document.getElementById("studentId").value.trim();
    const name = document.getElementById("studentName").value.trim();
    const email = document.getElementById("studentEmail").value.trim();
    const age = document.getElementById("studentAge").value;
    const course = document.getElementById("studentCourse").value;
    const year = document.getElementById("studentYear").value;

    const editIndex = document.getElementById("editIndex").value;

    let errors = {};

    errors.idError = !id
        ? "Student ID is required"
        : students.some((s, i) =>
            s.id.toLowerCase() === id.toLowerCase() &&
            String(i) !== editIndex
        )
        ? "Student ID already exists"
        : "";

    errors.nameError = !name
        ? "Name is required"
        : "";

    errors.emailError = !email
        ? "Email is required"
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? "Enter a valid email address"
        : "";

    errors.ageError = !age || !Number.isFinite(Number(age)) ||
        Number(age) <= 0
        ? "Age must be a valid number"
        : "";

    errors.courseError = !courses.includes(course)
        ? "Select a course"
        : "";

    errors.yearError = !years.includes(year)
        ? "Select a year level"
        : "";

    let valid = true;

    Object.keys(errors).forEach(key => {

        const message = errors[key];

        document.getElementById(key).textContent = message;

        const inputMap = {
            idError: "studentId",
            nameError: "studentName",
            emailError: "studentEmail",
            ageError: "studentAge",
            courseError: "studentCourse",
            yearError: "studentYear"
        };

        document.getElementById(inputMap[key])
            .closest(".form-group")
            .classList.toggle("invalid", !!message);

        if (message) {
            valid = false;
        }

    });

    document.getElementById("errorAlert")
        .classList.toggle("hidden", valid);

    return valid;
}


// SUBMIT ENROLLMENT

document.getElementById("studentForm").addEventListener("submit", function(e) {

    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    const student = {

        id: document.getElementById("studentId").value.trim(),

        name: document.getElementById("studentName").value.trim(),

        email: document.getElementById("studentEmail").value.trim(),

        age: Number(document.getElementById("studentAge").value),

        course: document.getElementById("studentCourse").value,

        year: document.getElementById("studentYear").value

    };

    const editIndex = document.getElementById("editIndex").value;

    if (editIndex !== "") {

        students[Number(editIndex)] = student;

        alert("Student record updated successfully!");

    } else {

        students.push(student);

        alert("Student enrollment successful!");

    }

    saveStudents();

    clearForm();

    showPage("students");

});


// CLEAR FORM

function clearForm() {

    document.getElementById("studentForm").reset();

    document.getElementById("editIndex").value = "";

    document.getElementById("errorAlert").classList.add("hidden");

    document.querySelectorAll(".form-group").forEach(group => {
        group.classList.remove("invalid");
    });

    document.querySelectorAll(".form-group small").forEach(error => {
        error.textContent = "";
    });
}


// DISPLAY STUDENT TABLE

function displayStudents() {

    const table = document.getElementById("studentTableBody");

    const search = document.getElementById("searchInput")
        .value.toLowerCase();

    table.innerHTML = "";

    const filtered = students
        .map((student, index) => ({ ...student, index }))
        .filter(student =>
            student.id.toLowerCase().includes(search) ||
            student.name.toLowerCase().includes(search) ||
            student.email.toLowerCase().includes(search)
        );

    if (filtered.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center">
                    No student records found.
                </td>
            </tr>
        `;

        return;
    }

    filtered.forEach(student => {

        const row = document.createElement("tr");

        [
            student.id,
            student.name,
            student.email,
            student.age,
            student.course,
            student.year
        ].forEach(value => {

            const cell = document.createElement("td");

            cell.textContent = value;

            row.appendChild(cell);

        });

        const actions = document.createElement("td");

        const editButton = document.createElement("button");

        editButton.textContent = "✎";

        editButton.className = "action-btn";

        editButton.title = "Edit student";

        editButton.onclick = () => editStudent(student.index);


        const deleteButton = document.createElement("button");

        deleteButton.textContent = "🗑";

        deleteButton.className = "action-btn";

        deleteButton.title = "Delete student";

        deleteButton.onclick = () => deleteStudent(student.index);


        actions.appendChild(editButton);

        actions.appendChild(deleteButton);

        row.appendChild(actions);

        table.appendChild(row);

    });

}


// SEARCH STUDENTS

document.getElementById("searchInput")
    .addEventListener("input", displayStudents);


// EDIT STUDENT

function editStudent(index) {

    const student = students[index];

    document.getElementById("studentId").value = student.id;

    document.getElementById("studentName").value = student.name;

    document.getElementById("studentEmail").value = student.email;

    document.getElementById("studentAge").value = student.age;

    document.getElementById("studentCourse").value = student.course;

    document.getElementById("studentYear").value = student.year;

    document.getElementById("editIndex").value = index;

    clearErrors();

    showPage("enrollment");

}


// CLEAR VALIDATION ERRORS

function clearErrors() {

    document.getElementById("errorAlert").classList.add("hidden");

    document.querySelectorAll(".form-group small").forEach(error => {
        error.textContent = "";
    });

    document.querySelectorAll(".form-group").forEach(group => {
        group.classList.remove("invalid");
    });

}


// DELETE STUDENT

function deleteStudent(index) {

    if (confirm("Are you sure you want to delete this student?")) {

        students.splice(index, 1);

        saveStudents();

        displayStudents();

    }

}


// SUMMARY REPORT

function displaySummary() {

    const total = students.length;

    const totalCourses = new Set(
        students.map(s => s.course)
    ).size;

    const average = total
        ? students.reduce((sum, s) => sum + s.age, 0) / total
        : 0;

    const ages = students.map(s => s.age);

    const minimumAge = total ? Math.min(...ages) : 0;

    const maximumAge = total ? Math.max(...ages) : 0;


    document.getElementById("totalStudents").textContent = total;

    document.getElementById("totalCourses").textContent = totalCourses;

    document.getElementById("averageAge").textContent =
        average.toFixed(2);

    document.getElementById("ageRange").textContent =
        `${minimumAge}–${maximumAge}`;


    document.getElementById("summaryDescription").textContent =
        `Based on the ${total} displayed student records.`;


    document.getElementById("courseCount").textContent =
        `${totalCourses} courses represented`;


    // YEAR LEVEL DISTRIBUTION

    const yearContainer =
        document.getElementById("yearDistribution");

    yearContainer.innerHTML = "";

    years.forEach(year => {

        const count = students.filter(s => s.year === year).length;

        if (count === 0) return;

        const percentage = total
            ? (count / total) * 100
            : 0;

        yearContainer.innerHTML += `

            <div class="distribution">

                <div class="distribution-info">

                    <span>${year}</span>

                    <span>
                        ${count} ${count === 1 ? "student" : "students"}
                        &nbsp;&nbsp;&nbsp;
                        <strong>${percentage.toFixed(0)}%</strong>
                    </span>

                </div>

                <div class="bar">

                    <div class="bar-fill"
                        style="width:${percentage}%">
                    </div>

                </div>

            </div>

        `;

    });


    // COURSE SUMMARY

    const courseTable =
        document.getElementById("courseSummary");

    courseTable.innerHTML = "";

    courses.forEach(course => {

        const count = students.filter(
            s => s.course === course
        ).length;

        if (count === 0) return;

        const percentage = total
            ? (count / total) * 100
            : 0;

        courseTable.innerHTML += `

            <tr>

                <td>${course}</td>

                <td>${count}</td>

                <td>${percentage.toFixed(0)}%</td>

            </tr>

        `;

    });


    // SUMMARY INSIGHT

    if (total === 0) {

        document.getElementById("summaryInsight").textContent =
            "There are currently no student records.";

    } else {

        const yearOne = students.filter(
            s => s.year === "Year 1"
        ).length;

        const yearPercentage = (yearOne / total) * 100;

        const courseCounts = courses.map(course => ({
            course,
            count: students.filter(s => s.course === course).length
        }));

        const maximum = Math.max(...courseCounts.map(c => c.count));

        const mostCommon = courseCounts
            .filter(c => c.count === maximum)
            .map(c => c.course);

        document.getElementById("summaryInsight").textContent =
            `${yearPercentage.toFixed(0)}% of the displayed students are in Year 1. ` +
            `The most represented course${mostCommon.length > 1 ? "s are" : " is"} ` +
            `${mostCommon.join(", ")}, with ${maximum} student(s) each.`;

    }

}


// EXPORT STUDENT TABLE

function exportCSV() {

    const rows = [
        ["Student ID", "Name", "Email", "Age", "Course", "Year Level"],

        ...students.map(s => [
            s.id,
            s.name,
            s.email,
            s.age,
            s.course,
            s.year
        ])
    ];

    downloadCSV("student-records.csv", rows);

}


// EXPORT SUMMARY REPORT

function exportSummary() {

    const rows = [
        ["Student Enrollment Summary"],
        ["Total students", students.length],
        ["Distinct courses", new Set(students.map(s => s.course)).size],
        ["Average age", students.length
            ? (students.reduce((sum, s) => sum + s.age, 0) / students.length).toFixed(2)
            : 0
        ],
        [],
        ["Course", "Students", "Share"]
    ];

    courses.forEach(course => {

        const count = students.filter(s => s.course === course).length;

        rows.push([
            course,
            count,
            students.length
                ? (count / students.length * 100).toFixed(0) + "%"
                : "0%"
        ]);

    });

    rows.push([]);

    rows.push(["Year Level", "Students"]);

    years.forEach(year => {

        rows.push([
            year,
            students.filter(s => s.year === year).length
        ]);

    });

    downloadCSV("student-summary.csv", rows);

}


// DOWNLOAD CSV FILE

function downloadCSV(filename, rows) {

    const csv = rows.map(row =>
        row.map(value =>
            '"' + String(value ?? "").replace(/"/g, '""') + '"'
        ).join(",")
    ).join("\r\n");

    const blob = new Blob(
        ["\ufeff" + csv],
        { type: "text/csv;charset=utf-8;" }
    );

    const link = document.createElement("a");

    const url = URL.createObjectURL(blob);

    link.href = url;

    link.download = filename;

    link.click();

    URL.revokeObjectURL(url);

}


// INITIAL DISPLAY

displayStudents();

showPage("enrollment");
