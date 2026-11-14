let students = JSON.parse(localStorage.getItem("students")) || [];

function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

function showPage(page) {
    document.querySelectorAll(".page").forEach(section => {
        section.classList.remove("active");
    });

    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.remove("active");
    });

    document.getElementById(page).classList.add("active");

    const pages = ["enrollment", "students", "summary"];
    document.querySelectorAll(".tab")[pages.indexOf(page)].classList.add("active");

    if (page === "students") displayStudents();
    if (page === "summary") updateSummary();
}

document.getElementById("enrollmentForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const age = Number(document.getElementById("age").value);
    const birthDate = document.getElementById("birthDate").value;
    const program = document.getElementById("program").value;
    const academicYear = document.getElementById("academicYear").value;
    const address = document.getElementById("address").value.trim();

    document.querySelectorAll("small").forEach(error => {
        error.textContent = "";
    });

    document.getElementById("message").textContent = "";

    let valid = true;

    function error(id, message) {
        document.getElementById(id).textContent = message;
        valid = false;
    }

    if (!firstName) error("firstNameError", "Please enter your first name.");
    if (!lastName) error("lastNameError", "Please enter your last name.");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        error("emailError", "Please enter a valid email address.");
    }

    if (!age || age < 5 || age > 100) {
        error("ageError", "Age must be between 5 and 100.");
    }

    if (!birthDate || new Date(birthDate) > new Date()) {
        error("birthError", "Please enter a valid date of birth.");
    }

    if (!program) error("programError", "Please select a program.");
    if (!academicYear) error("yearError", "Please select an academic year.");
    if (!address) error("addressError", "Please enter your address.");

    if (students.some(s => s.email.toLowerCase() === email.toLowerCase())) {
        error("emailError", "This email is already registered.");
    }

    if (!valid) return;

    const student = {
        id: "ST" + Date.now().toString().slice(-6),
        firstName,
        lastName,
        email,
        age,
        birthDate,
        program,
        academicYear,
        address
    };

    students.push(student);
    saveStudents();

    document.getElementById("enrollmentForm").reset();

    document.getElementById("message").textContent =
        "Student successfully enrolled! Student ID: " + student.id;

    updateSummary();
});

// DISPLAY STUDENTS
function displayStudents() {
    const list = document.getElementById("studentList");
    const search = document.getElementById("search").value.toLowerCase();

    const filtered = students.filter(student => {
        const name = student.firstName + " " + student.lastName;

        return name.toLowerCase().includes(search) ||
               student.id.toLowerCase().includes(search) ||
               student.email.toLowerCase().includes(search);
    });

    list.innerHTML = "";

    document.getElementById("studentCount").textContent =
        filtered.length + " students";

    document.getElementById("emptyMessage").style.display =
        filtered.length ? "none" : "block";

    filtered.forEach(student => {
        const row = document.createElement("tr");

        const values = [
            student.id,
            student.firstName + " " + student.lastName,
            student.email,
            student.age,
            student.birthDate,
            student.program,
            student.academicYear
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.onclick = function() {
            if (confirm("Are you sure you want to delete this student?")) {
                students = students.filter(s => s.id !== student.id);
                saveStudents();
                displayStudents();
                updateSummary();
            }
        };

        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);
        list.appendChild(row);
    });
}

document.getElementById("search").addEventListener("input", displayStudents);

// SUMMARY REPORT
function updateSummary() {
    const total = students.length;

    document.getElementById("totalStudents").textContent = total;

    const average = total
        ? students.reduce((sum, s) => sum + Number(s.age), 0) / total
        : 0;

    document.getElementById("averageAge").textContent =
        total ? average.toFixed(1) : "0";

    const counts = {};

    students.forEach(student => {
        counts[student.program] = (counts[student.program] || 0) + 1;
    });

    let common = "-";

    if (total) {
        common = Object.keys(counts).reduce((a, b) =>
            counts[a] >= counts[b] ? a : b
        );
    }

    document.getElementById("commonProgram").textContent = common;

    const report = document.getElementById("programReport");
    report.innerHTML = "";

    Object.keys(counts).forEach(program => {
        const percentage = (counts[program] / total) * 100;

        const item = document.createElement("div");
        item.className = "report-row";

        const label = document.createElement("div");
        label.textContent = `${program} - ${counts[program]} students (${percentage.toFixed(1)}%)`;

        const bar = document.createElement("div");
        bar.className = "bar";

        const fill = document.createElement("div");
        fill.className = "bar-fill";
        fill.style.width = percentage + "%";

        bar.appendChild(fill);
        item.appendChild(label);
        item.appendChild(bar);
        report.appendChild(item);
    });

    if (!total) {
        report.textContent = "No enrollment records available.";
    }

    const fields = [
        "Student ID",
        "Name",
        "Email",
        "Age",
        "Date of Birth",
        "Program",
        "Academic Year",
        "Address"
    ];

    document.getElementById("completionReport").innerHTML =
        fields.map(field =>
            `<p>${field} <span style="float:right">${total}/${total} - 100%</span></p>`
        ).join("");
}

// EXPORT CSV
function exportCSV() {
    const headers = [
        "Student ID",
        "First Name",
        "Last Name",
        "Email",
        "Age",
        "Date of Birth",
        "Program",
        "Academic Year",
        "Address"
    ];

    const rows = students.map(s => [
        s.id, s.firstName, s.lastName, s.email,
        s.age, s.birthDate, s.program,
        s.academicYear, s.address
    ]);

    const csv = [headers, ...rows]
        .map(row => row.map(value =>
            '"' + String(value ?? "").replace(/"/g, '""') + '"'
        ).join(","))
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "student-records.csv";
    link.click();

    URL.revokeObjectURL(link.href);
}

// INITIALIZE
displayStudents();
updateSummary();