// ---------- Config ----------
const COURSES = ["BSIS", "BSIT", "BSCS"];
const STORAGE_KEY = "enrollment_students_v1";

const SEED_STUDENTS = [
  { id: "2026-001", name: "Juan Rosa",  email: "juan@gmail.com",  age: 20, course: "BSIS", year: "2nd" },
  { id: "2026-002", name: "Maria Beng", email: "maria@gmail.com", age: 19, course: "BSIT", year: "1st" },
  { id: "2026-003", name: "Ana Reyes",  email: "ana@gmail.com",   age: 21, course: "BSCS", year: "3rd" }
];

// ---------- Storage ----------
function loadStudents() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) { /* storage unavailable */ }
  return SEED_STUDENTS.slice();
}

function saveStudents() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (e) { /* ignore */ }
}

let students = loadStudents();

// ---------- Elements ----------
const form = document.getElementById("studentForm");
const successMsg = document.getElementById("successMsg");
const tabs = document.querySelectorAll(".tab");
const views = document.querySelectorAll(".view");
const recordsBody = document.getElementById("recordsBody");
const emptyMsg = document.getElementById("emptyMsg");
const summaryCards = document.getElementById("summaryCards");

// ---------- Navigation ----------
function showView(name) {
  views.forEach(v => v.classList.toggle("active", v.id === "view-" + name));
  tabs.forEach(t => t.classList.toggle("active", t.dataset.view === name));
  if (name === "summary") renderSummary();
  if (name === "records") renderRecords();
}

tabs.forEach(t => t.addEventListener("click", () => {
  successMsg.hidden = true;
  showView(t.dataset.view);
}));

// ---------- Helpers ----------
function normalizeYear(value) {
  const match = String(value).match(/[1-4]/);
  if (!match) return null;
  const n = Number(match[0]);
  return ["1st", "2nd", "3rd", "4th"][n - 1];
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setError(input, message) {
  const field = input.closest(".field");
  const err = field.querySelector(".error");
  if (message) {
    field.classList.add("invalid");
    err.textContent = message;
  } else {
    field.classList.remove("invalid");
    err.textContent = "";
  }
}

// ---------- Validation ----------
function validateField(input) {
  const value = input.value.trim();
  let message = "";

  if (!value) {
    message = "Required";
  } else {
    switch (input.name) {
      case "studentId":
        if (students.some(s => s.id.toLowerCase() === value.toLowerCase())) {
          message = "Student ID already exists";
        }
        break;
      case "email":
        if (!isValidEmail(value)) message = "Enter a valid email";
        break;
      case "age": {
        const age = Number(value);
        if (!Number.isInteger(age) || age < 1 || age > 120) message = "Enter a valid age";
        break;
      }
      case "year":
        if (!normalizeYear(value)) message = "Use 1st, 2nd, 3rd or 4th";
        break;
    }
  }

  setError(input, message);
  return !message;
}

const inputs = Array.from(form.querySelectorAll("input"));

// Clear/refresh error while typing once a field has been flagged
inputs.forEach(input => {
  input.addEventListener("input", () => {
    if (input.closest(".field").classList.contains("invalid")) validateField(input);
  });
  input.addEventListener("blur", () => {
    if (input.value.trim() !== "") validateField(input);
  });
});

// ---------- Submit ----------
form.addEventListener("submit", e => {
  e.preventDefault();

  // validate every field (don't short-circuit so all errors show)
  const results = inputs.map(validateField);
  if (results.includes(false)) {
    const firstBad = inputs.find(i => i.closest(".field").classList.contains("invalid"));
    if (firstBad) firstBad.focus();
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());
  const student = {
    id: data.studentId.trim(),
    name: data.fullName.trim(),
    email: data.email.trim(),
    age: Number(data.age),
    course: data.course.trim().toUpperCase(),
    year: normalizeYear(data.year)
  };

  students.push(student);
  saveStudents();

  // add new course to the list of available courses if needed
  if (!COURSES.includes(student.course)) COURSES.push(student.course);
  fillCourseList();

  form.reset();
  inputs.forEach(i => setError(i, ""));

  showView("records");
  // brief confirmation on the register tab for next visit
  successMsg.textContent = `${student.name} was registered successfully.`;
});

// ---------- Renderers ----------
function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function renderRecords() {
  recordsBody.innerHTML = students.map(s => `
    <tr>
      <td>${escapeHTML(s.id)}</td>
      <td>${escapeHTML(s.name)}</td>
      <td>${escapeHTML(s.email)}</td>
      <td>${escapeHTML(s.course)}</td>
      <td>${escapeHTML(s.year)}</td>
    </tr>
  `).join("");
  emptyMsg.hidden = students.length > 0;
}

function renderSummary() {
  const countYear = y => students.filter(s => s.year === y).length;

  const cards = [
    { cls: "lavender", icon: "👤", num: students.length, label: "Total Students" },
    { cls: "pink",     icon: "📖", num: COURSES.length,  label: "Available Courses" },
    { cls: "hot",      icon: "👤", num: countYear("1st"), label: "First Year Students" },
    { cls: "indigo",   icon: "👤", num: countYear("2nd"), label: "2nd Year Students" },
    { cls: "pale",     icon: "👤", num: countYear("3rd"), label: "3rd Year Students" }
  ];

  if (countYear("4th") > 0) {
    cards.push({ cls: "pink", icon: "👤", num: countYear("4th"), label: "4th Year Students" });
  }

  summaryCards.innerHTML = cards.map(c => `
    <div class="card ${c.cls}">
      <span class="icon">${c.icon}</span>
      <span class="num">${c.num}</span>
      <span class="label">${c.label}</span>
    </div>
  `).join("");
}

function fillCourseList() {
  document.getElementById("courseList").innerHTML =
    COURSES.map(c => `<option value="${escapeHTML(c)}"></option>`).join("");
}

// ---------- Init ----------
// make sure any course already in saved data counts as available
students.forEach(s => {
  if (!COURSES.includes(s.course)) COURSES.push(s.course);
});
fillCourseList();
renderRecords();
renderSummary();
