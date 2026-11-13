let students = JSON.parse(localStorage.getItem("students")) || [];

function showPage(page) {
    document.querySelectorAll(".page").forEach(section => {
        section.classList.add("hidden");
    });

    document.getElementById(page).classList.remove("hidden");

    if (page === "students") displayStudents();
    if (page === "summary") displaySummary();
}

document.getElementById("enrollmentForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let id = document.getElementById("studentId").value.trim();
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let age = Number(document.getElementById("age").value);
    let course = document.getElementById("course").value;
    let year = document.getElementById("year").value;
    let editIndex = document.getElementById("editIndex").value;

    let valid = true;

    const errors = {
        idError: /^\d{8}$/.test(id) ? "" : "ID must be 8 digits.",
        nameError: name.split(/\s+/).filter(Boolean).length >= 2 ? "" : "Please enter your full name.",
        emailError: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Invalid email address.",
        ageError: age >= 18 && age <= 25 ? "" : "Age must be between 18 and 25.",
        courseError: course ? "" : "Please select a valid course.",
        yearError: year ? "" : "Please select a valid year level."
    };

    Object.entries(errors).forEach(([key, message]) => {
        document.getElementById(key).textContent = message;
        if (message) valid = false;
    });

    let duplicate = students.some((student, index) =>
        student.id === id && String(index) !== editIndex
    );

    if (duplicate) {
        document.getElementById("idError").textContent = "ID already exists.";
        valid = false;
    }

    if (!valid) return;

    let student = { id, name, email, age, course, year };

    if (editIndex !== "") {
        students[Number(editIndex)] = student;
    } else {
        students.push(student);
    }

    saveStudents();
    this.reset();
    document.getElementById("editIndex").value = "";
    document.querySelectorAll("small").forEach(el => el.textContent = "");

    alert("Student enrollment successful!");
    showPage("students");
});

function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

function displayStudents() {
    let list = document.getElementById("studentList");
    let search = document.getElementById("search").value.toLowerCase();

    list.innerHTML = "";

    students.forEach((student, index) => {
        if (
            !student.id.toLowerCase().includes(search) &&
            !student.name.toLowerCase().includes(search) &&
            !student.email.toLowerCase().includes(search)
        ) return;

        let row = document.createElement("tr");

        [
            student.id, student.name, student.email,
            student.age, student.course, student.year
        ].forEach(value => {
            let cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        let actions = document.createElement("td");

        let edit = document.createElement("button");
        edit.textContent = "✎";
        edit.className = "action-btn";
        edit.onclick = () => editStudent(index);

        let remove = document.createElement("button");
        remove.textContent = "🗑";
        remove.className = "action-btn";
        remove.onclick = () => deleteStudent(index);

        actions.append(edit, remove);
        row.appendChild(actions);
        list.appendChild(row);
    });
}

document.getElementById("search").addEventListener("input", displayStudents);

function editStudent(index) {
    let s = students[index];

    document.getElementById("studentId").value = s.id;
    document.getElementById("name").value = s.name;
    document.getElementById("email").value = s.email;
    document.getElementById("age").value = s.age;
    document.getElementById("course").value = s.course;
    document.getElementById("year").value = s.year;
    document.getElementById("editIndex").value = index;

    showPage("form");
}

function deleteStudent(index) {
    if (confirm("Are you sure you want to delete this student?")) {
        students.splice(index, 1);
        saveStudents();
        displayStudents();
    }
}

function displaySummary() {
    let total = students.length;

    let average = total
        ? students.reduce((sum, s) => sum + s.age, 0) / total
        : 0;

    let courses = [...new Set(students.map(s => s.course))];
    let firstYear = students.filter(s => s.year === "Year 1").length;

    document.getElementById("totalStudents").textContent = total;
    document.getElementById("totalCourses").textContent = courses.length;
    document.getElementById("averageAge").textContent = average.toFixed(1);
    document.getElementById("firstYear").textContent = firstYear;

    document.getElementById("courseReport").innerHTML = "";

    courses.forEach(course => {
        let count = students.filter(s => s.course === course).length;
        let percentage = total ? count / total * 100 : 0;

        document.getElementById("courseReport").innerHTML += `
            <p>${course} - ${count} students (${percentage.toFixed(1)}%)</p>
            <div class="bar">
                <div class="bar-fill" style="width:${percentage}%"></div>
            </div>
        `;
    });

    document.getElementById("yearReport").innerHTML = "";

    ["Year 1", "Year 2", "Year 3", "Year 4"].forEach(year => {
        let count = students.filter(s => s.year === year).length;
        let percentage = total ? count / total * 100 : 0;

        document.getElementById("yearReport").innerHTML += `
            <p>${year} - ${count} students (${percentage.toFixed(1)}%)</p>
            <div class="bar">
                <div class="bar-fill" style="width:${percentage}%"></div>
            </div>
        `;
    });
}

function exportCSV() {
    let csv = [
        ["ID", "Name", "Email", "Age", "Course", "Year Level"],
        ...students.map(s => [
            s.id, s.name, s.email, s.age, s.course, s.year
        ])
    ].map(row => row.map(value =>
        '"' + String(value).replace(/"/g, '""') + '"'
    ).join(",")).join("\n");

    let blob = new Blob(["\ufeff" + csv], { type: "text/csv" });
    let link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "students.csv";
    link.click();

    URL.revokeObjectURL(link.href);
}

showPage("form");