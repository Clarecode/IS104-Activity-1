const starterStudents = [
 {name:"Amelia Park",studentId:"S-2024-001",age:19,email:"amelia.park@university.edu",course:"Computer Science",year:"Year 1"},
 {name:"Liam Brown",studentId:"S-2024-002",age:20,email:"liam.brown@university.edu",course:"Business Administration",year:"Year 2"},
 {name:"Sofia Garcia",studentId:"S-2024-003",age:18,email:"sofia.garcia@university.edu",course:"Psychology",year:"Year 1"},
 {name:"Noah Lee",studentId:"S-2024-004",age:21,email:"noah.lee@university.edu",course:"Engineering",year:"Year 3"},
 {name:"Mia Chen",studentId:"S-2024-005",age:19,email:"mia.chen@university.edu",course:"Economics",year:"Year 1"},
 {name:"Oliver Patel",studentId:"S-2024-006",age:20,email:"oliver.patel@university.edu",course:"Data Science",year:"Year 2"}
];
const STORAGE_KEY="studentEnrolmentRecords";
let students;
try { students=JSON.parse(localStorage.getItem(STORAGE_KEY)) || [...starterStudents]; }
catch { students=[...starterStudents]; }

function saveStudents(){localStorage.setItem(STORAGE_KEY,JSON.stringify(students));}
function showPage(id){
 document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===id));
 document.querySelectorAll(".nav").forEach(b=>b.classList.toggle("active",b.dataset.page===id));
 if(id==="table")renderTable(); if(id==="summary")renderSummary();
 window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll(".nav").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));

const ids=["name","studentId","age","email","course","year"];
function setError(id,message){
 document.getElementById(id).classList.toggle("invalid",Boolean(message));
 document.getElementById(id+"-error").textContent=message;
}
function validate(){
 const v={}; ids.forEach(id=>v[id]=document.getElementById(id).value.trim());
 v.studentId=v.studentId.toUpperCase();
 const errors={
  name:v.name?"":"Name is required.",
  studentId:/^S-\\d{4}-\\d{3}$/.test(v.studentId)?"":"Invalid ID format. Use S-YYYY-XXX.",
  age:v.age&&Number(v.age)>=16&&Number(v.age)<=100?"":"Age must be between 16 and 100.",
  email:/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v.email)?"":"Please enter a valid email address.",
  course:v.course?"":"Please select a course.",
  year:v.year?"":"Year level is required."
 };
 if(students.some(s=>s.studentId.toLowerCase()===v.studentId.toLowerCase()))errors.studentId="This student ID is already registered.";
 let valid=true; Object.entries(errors).forEach(([id,msg])=>{setError(id,msg);if(msg)valid=false;});
 return {valid,v};
}
document.getElementById("student-form").addEventListener("submit",e=>{
 e.preventDefault(); const result=validate(); const message=document.getElementById("message");
 if(!result.valid){message.textContent="";return;}
 const v=result.v;
 students.push({name:v.name,studentId:v.studentId,age:Number(v.age),email:v.email,course:v.course,year:v.year});
 saveStudents(); e.target.reset(); ids.forEach(id=>setError(id,""));
 message.textContent="Student enrolled successfully!"; renderTable();renderSummary();
});
ids.forEach(id=>["input","change"].forEach(evt=>document.getElementById(id).addEventListener(evt,()=>{
 setError(id,"");document.getElementById("message").textContent="";
})));

function renderTable(){
 const body=document.getElementById("rows");body.innerHTML="";
 students.forEach(s=>{
  const tr=document.createElement("tr");
  [s.studentId,s.age,s.email,s.course,s.year,s.name].forEach(value=>{
   const td=document.createElement("td");td.textContent=value;tr.appendChild(td);
  });body.appendChild(tr);
 });
 document.getElementById("empty").hidden=students.length>0;
 document.getElementById("count").textContent=`${students.length} student record${students.length===1?"":"s"}`;
}
function renderList(id,counts){
 const list=document.getElementById(id);list.innerHTML="";
 Object.entries(counts).sort((a,b)=>a[0].localeCompare(b[0],undefined,{numeric:true})).forEach(([label,count])=>{
  const row=document.createElement("div");row.className="dist-row";
  const name=document.createElement("strong");name.textContent=label;
  const number=document.createElement("strong");number.textContent=count;
  row.append(name,number);list.appendChild(row);
 });
}
function renderSummary(){
 const courseCounts={},yearCounts={};
 students.forEach(s=>{courseCounts[s.course]=(courseCounts[s.course]||0)+1;yearCounts[s.year]=(yearCounts[s.year]||0)+1;});
 const courseTotal=Object.keys(courseCounts).length,yearTotal=Object.keys(yearCounts).length;
 document.getElementById("total").textContent=students.length;
 document.getElementById("courses").textContent=courseTotal;
 document.getElementById("years").textContent=yearTotal;
 document.getElementById("based").textContent=`Based on ${students.length} student records`;
 document.getElementById("year-desc").textContent=Object.keys(yearCounts).sort().join(", ")||"No year levels yet";
 document.getElementById("course-count").textContent=`${courseTotal} courses`;
 document.getElementById("year-count").textContent=`${yearTotal} year levels`;
 renderList("course-list",courseCounts);renderList("year-list",yearCounts);
}
document.getElementById("export").addEventListener("click",()=>{
 const header=["ID","Age","Email","Course","Year Level","Name"];
 const data=students.map(s=>[s.studentId,s.age,s.email,s.course,s.year,s.name]);
 const csv=[header,...data].map(row=>row.map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\\n");
 const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8;"}));
 const a=document.createElement("a");a.href=url;a.download="student-enrolment-records.csv";a.click();URL.revokeObjectURL(url);
});
renderTable();renderSummary();
