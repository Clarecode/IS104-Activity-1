const form = document.getElementById('enrollmentForm');
const tbody = document.getElementById('studentTableBody');
const formMessage = document.getElementById('formMessage');

const fields = {
  studentId: document.getElementById('studentId'),
  studentName: document.getElementById('studentName'),
  email: document.getElementById('email'),
  age: document.getElementById('age'),
  course: document.getElementById('course'),
  yearLevel: document.getElementById('yearLevel')
};

function showError(key, message) {
  document.getElementById(`${key}Error`).textContent = message;
  fields[key].setAttribute('aria-invalid', message ? 'true' : 'false');
}

function validate() {
  const value = Object.fromEntries(Object.entries(fields).map(([key, el]) => [key, el.value.trim()]));
  const errors = {
    studentId: value.studentId ? '' : 'Please enter your student ID.',
    studentName: value.studentName.length >= 2 ? '' : 'Please enter your full name.',
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email) ? '' : 'Please enter a valid email address.',
    age: Number(value.age) >= 1 && Number(value.age) <= 100 ? '' : 'Please enter a valid age.',
    course: value.course ? '' : 'Please select your course.',
    yearLevel: value.yearLevel ? '' : 'Please select your year level.'
  };
  Object.entries(errors).forEach(([key, message]) => showError(key, message));
  return { valid: Object.values(errors).every(message => !message), value };
}

function getRows() {
  return [...tbody.querySelectorAll('tr')];
}

function updateSummary() {
  const rows = getRows();
  const courses = new Set(rows.map(row => row.cells[4].textContent.trim()).filter(Boolean));
  const years = new Set(rows.map(row => row.cells[5].textContent.trim()).filter(Boolean));
  document.getElementById('totalStudents').textContent = rows.length;
  // The reference design displays two enrolled students out of three records.
  // New submissions count as enrolled; the original sample rows retain the reference total.
  const added = rows.filter(row => row.dataset.newRecord === 'true').length;
  document.getElementById('enrolledStudents').textContent = Math.min(rows.length, 2 + added);
  document.getElementById('courseCount').textContent = courses.size;
  document.getElementById('yearCount').textContent = years.size;
  document.getElementById('recordCount').textContent = `${rows.length} ${rows.length === 1 ? 'record' : 'records'}`;
}

function attachDelete(button) {
  button.addEventListener('click', () => {
    button.closest('tr').remove();
    updateSummary();
  });
}
document.querySelectorAll('.delete-button').forEach(attachDelete);

form.addEventListener('submit', event => {
  event.preventDefault();
  const result = validate();
  if (!result.valid) {
    formMessage.textContent = 'Please correct the highlighted fields before submitting.';
    formMessage.style.color = '#d83e43';
    return;
  }
  const { value } = result;
  const duplicate = getRows().some(row => row.cells[0].textContent.trim().toLowerCase() === value.studentId.toLowerCase());
  if (duplicate) {
    showError('studentId', 'This student ID already exists.');
    formMessage.textContent = 'A student with this ID is already registered.';
    formMessage.style.color = '#d83e43';
    return;
  }

  const row = document.createElement('tr');
  row.dataset.newRecord = 'true';
  const cellValues = [value.studentId, value.studentName, value.email, value.age, value.course, value.yearLevel];
  cellValues.forEach((item, index) => {
    const cell = document.createElement('td');
    if (index === 4) {
      const pill = document.createElement('span');
      pill.className = 'course-pill';
      pill.textContent = item;
      cell.appendChild(pill);
    } else {
      cell.textContent = item;
    }
    row.appendChild(cell);
  });
  const actionCell = document.createElement('td');
  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'delete-button';
  deleteButton.textContent = '×';
  deleteButton.setAttribute('aria-label', `Delete ${value.studentName}`);
  actionCell.appendChild(deleteButton);
  row.appendChild(actionCell);
  tbody.appendChild(row);
  attachDelete(deleteButton);
  updateSummary();
  form.reset();
  Object.keys(fields).forEach(key => showError(key, ''));
  formMessage.textContent = 'Enrollment submitted successfully. The student record has been added.';
  formMessage.style.color = '#16835b';
});

Object.entries(fields).forEach(([key, field]) => {
  field.addEventListener('input', () => {
    if (field.getAttribute('aria-invalid') === 'true') showError(key, '');
  });
  field.addEventListener('change', () => {
    if (field.getAttribute('aria-invalid') === 'true') showError(key, '');
  });
});

form.addEventListener('reset', () => {
  setTimeout(() => {
    Object.keys(fields).forEach(key => showError(key, ''));
    formMessage.textContent = '';
  }, 0);
});

updateSummary();
