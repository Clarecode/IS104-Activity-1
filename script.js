const seedStudents = [
  {id:"STU-1001",name:"Jamel Gerao",email:"jamel.gerao@email.com",age:20,course:"BS Information Systems",year:"1st Year"},
  {id:"STU-1002",name:"Maria Cruz",email:"maria.cruz@email.com",age:21,course:"BS Computer Science",year:"2nd Year"},
  {id:"STU-1003",name:"Lara Reyes",email:"lara.reyes@email.com",age:19,course:"BS Information Technology",year:"1st Year"},
  {id:"STU-1004",name:"Joshua Santos",email:"joshua.santos@email.com",age:22,course:"BS Business Administration",year:"3rd Year"},
  {id:"STU-1005",name:"Angela Dela Cruz",email:"angela.dc@email.com",age:20,course:"BS Information Systems",year:"2nd Year"},
  {id:"STU-1006",name:"Kevin Flores",email:"kevin.flores@email.com",age:23,course:"BS Accountancy",year:"4th Year"},
  {id:"STU-1007",name:"Sofia Ramos",email:"sofia.ramos@email.com",age:20,course:"BS Information Technology",year:"2nd Year"},
  {id:"STU-1008",name:"Mark Villanueva",email:"mark.v@email.com",age:21,course:"BS Computer Science",year:"3rd Year"}
];

let students = JSON.parse(localStorage.getItem("students")) || seedStudents;
let currentPage = 1;
const pageSize = 7;

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function save(){ localStorage.setItem("students", JSON.stringify(students)); }
function showToast(msg){
  const t=$("#toast"); t.textContent=msg; t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),1800);
}

function switchPage(page){
  $$(".page").forEach(p=>p.classList.remove("active-page"));
  $("#"+page).classList.add("active-page");
  $$(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
  if(page==="students") renderStudents();
  if(page==="summary") renderSummary();
}
$$(".nav-btn").forEach(b=>b.addEventListener("click",()=>switchPage(b.dataset.page)));

function clearErrors(){
  $$(".field").forEach(f=>f.classList.remove("invalid"));
  $$(".error").forEach(e=>e.textContent="");
}
function error(id,msg){
  $("#"+id).closest(".field").classList.add("invalid");
  $("#"+id+"Error").textContent=msg;
}
function validate(data){
  clearErrors(); let ok=true;
  if(!/^STU-\d{4}$/i.test(data.studentId)){error("studentId","Use STU-0000 format");ok=false}
  if(!data.age || data.age<15 || data.age>80){error("age","Age must be 15–80");ok=false}
  if(!data.name.trim()){error("name","Name is required");ok=false}
  if(!data.course){error("course","Select a course");ok=false}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)){error("email","Enter a valid email");ok=false}
  if(!data.year){error("year","Select year level");ok=false}
  if(students.some(s=>s.id.toLowerCase()===data.studentId.toLowerCase())){error("studentId","Student ID already exists");ok=false}
  return ok;
}

$("#studentForm").addEventListener("submit",e=>{
  e.preventDefault();
  const data=Object.fromEntries(new FormData(e.target).entries());
  data.age=Number(data.age);
  if(!validate(data)) return;
  students.push(data); save();
  $("#successMessage").textContent="Student saved successfully.";
  e.target.reset();
  showToast("Student added");
  setTimeout(()=>$("#successMessage").textContent="",2200);
});
$("#clearBtn").addEventListener("click",()=>{$("#studentForm").reset();clearErrors();$("#successMessage").textContent=""});
$("#newStudentBtn").addEventListener("click",()=>switchPage("form"));

function filtered(){
  const q=$("#searchInput").value.toLowerCase().trim();
  const course=$("#courseFilter").value, year=$("#yearFilter").value;
  return students.filter(s=>{
    const text=(s.id+" "+s.name+" "+s.email).toLowerCase();
    return (!q||text.includes(q))&&(course==="all"||s.course===course)&&(year==="all"||s.year===year);
  });
}
function renderStudents(){
  const data=filtered(), totalPages=Math.max(1,Math.ceil(data.length/pageSize));
  if(currentPage>totalPages) currentPage=totalPages;
  const rows=data.slice((currentPage-1)*pageSize,currentPage*pageSize);
  $("#studentRows").innerHTML=rows.map(s=>`
    <tr>
      <td>${s.id}</td><td><strong>${s.name}</strong></td><td>${s.email}</td><td>${s.age}</td>
      <td>${s.course}</td><td>${s.year}</td>
      <td><button class="action-btn delete" onclick="removeStudent('${s.id}')">Delete</button></td>
    </tr>`).join("") || `<tr><td colspan="7" style="text-align:center;padding:25px;color:#999">No students found.</td></tr>`;
  $("#recordCount").textContent=`${data.length} record${data.length!==1?"s":""}`;
  $("#pageInfo").textContent=`${currentPage} / ${totalPages}`;
  $("#prevBtn").disabled=currentPage===1; $("#nextBtn").disabled=currentPage===totalPages;
}
function removeStudent(id){
  if(!confirm("Delete this student record?")) return;
  students=students.filter(s=>s.id!==id); save(); renderStudents(); renderSummary(); showToast("Student deleted");
}
window.removeStudent=removeStudent;

["searchInput","courseFilter","yearFilter"].forEach(id=>{
  $("#"+id).addEventListener("input",()=>{currentPage=1;renderStudents()});
});
$("#prevBtn").addEventListener("click",()=>{if(currentPage>1){currentPage--;renderStudents()}});
$("#nextBtn").addEventListener("click",()=>{currentPage++;renderStudents()});

function counts(key, values){
  return values.map(v=>({label:v,count:students.filter(s=>s[key]===v).length}));
}
function drawBars(el, items){
  const max=Math.max(1,...items.map(x=>x.count));
  $(el).innerHTML=items.map(x=>`
    <div class="bar-row"><span>${x.label.replace("BS ","")}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${(x.count/max)*100}%"></div></div>
      <strong>${x.count}</strong>
    </div>`).join("");
}
function renderSummary(){
  const courses=[...new Set(students.map(s=>s.course))];
  const years=["1st Year","2nd Year","3rd Year","4th Year"];
  $("#totalStudents").textContent=students.length;
  $("#totalCourses").textContent=courses.length;
  $("#totalYears").textContent=new Set(students.map(s=>s.year)).size;
  $("#avgAge").textContent=students.length?(students.reduce((a,s)=>a+Number(s.age),0)/students.length).toFixed(1):"0.0";
  drawBars("#courseChart",counts("course",courses));
  drawBars("#yearChart",counts("year",years));
  $("#summaryRows").innerHTML=courses.map(c=>{
    const nums=years.map(y=>students.filter(s=>s.course===c&&s.year===y).length);
    return `<tr><td>${c}</td>${nums.map(n=>`<td>${n}</td>`).join("")}<td><strong>${nums.reduce((a,b)=>a+b,0)}</strong></td></tr>`;
  }).join("") || `<tr><td colspan="6">No records available.</td></tr>`;
}
$("#exportBtn").addEventListener("click",()=>{
  const lines=["Student Summary Report","",`Total students: ${students.length}`,`Courses: ${new Set(students.map(s=>s.course)).size}`,`Average age: ${students.length?(students.reduce((a,s)=>a+Number(s.age),0)/students.length).toFixed(1):0}`,"","ID,Name,Email,Age,Course,Year"];
  students.forEach(s=>lines.push([s.id,s.name,s.email,s.age,s.course,s.year].map(v=>`"${v}"`).join(",")));
  const blob=new Blob([lines.join("\n")],{type:"text/csv"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="student-summary.csv";a.click();
  URL.revokeObjectURL(a.href);showToast("Report exported");
});

renderStudents();
renderSummary();
