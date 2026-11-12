const sampleRows = [
["2026-001","Alyssa Santos","alyssa.santos@example.edu",18,"BS Information Technology","1st year","Enrolled"],
["2026-002","Miguel Reyes","miguel.reyes@example.edu",19,"BS Computer Science","2nd year","Enrolled"],
["2026-003","Sofia Cruz","sofia.cruz@example.edu",20,"BS Business Administration","3rd year","Enrolled"],
["2026-004","Daniel Garcia","daniel.garcia@example.edu",21,"BS Education","4th year","Enrolled"],
["2026-005","Isabella Ramos","isabella.ramos@example.edu",22,"BS Information Technology","1st year","Enrolled"],
["2026-006","Gabriel Mendoza","gabriel.mendoza@example.edu",18,"BS Computer Science","2nd year","Enrolled"],
["2026-007","Chloe Navarro","chloe.navarro@example.edu",20,"BS Business Administration","2nd year","Enrolled"],
["2026-008","Ethan Torres","ethan.torres@example.edu",21,"BS Education","3rd year","Enrolled"],
["2026-009","Mia Flores","mia.flores@example.edu",18,"BS Information Technology","1st year","Pending"],
["2026-010","Lucas Aquino","lucas.aquino@example.edu",19,"BS Computer Science","2nd year","Enrolled"],
["2026-011","Emma Castillo","emma.castillo@example.edu",20,"BS Business Administration","3rd year","Pending"],
["2026-012","Noah Villanueva","noah.villanueva@example.edu",25,"BS Information Technology","4th year","Enrolled"]
];
const courses=["BS Information Technology","BS Computer Science","BS Business Administration","BS Education"];
const $=id=>document.getElementById(id);
const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let students=loadStudents(),currentPage=1,editingId=null;
function loadStudents(){try{const saved=JSON.parse(localStorage.getItem("studentEnrollmentRecords"));return Array.isArray(saved)?saved:sampleRows.map(toStudent)}catch{return sampleRows.map(toStudent)}}
function toStudent(r){return {id:r[0],name:r[1],email:r[2],age:Number(r[3]),course:r[4],year:r[5],status:r[6]}}
function save(){localStorage.setItem("studentEnrollmentRecords",JSON.stringify(students))}
function notify(message){$("toast").textContent=message;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),2200)}
function showView(id){document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id===id));document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.view===id));if(id==="summary")renderSummary();if(id==="students")renderTable();window.scrollTo(0,0)}
document.querySelectorAll(".nav-btn").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
function filteredStudents(){const q=$("searchInput").value.toLowerCase(),c=$("courseFilter").value,y=$("yearFilter").value,s=$("statusFilter").value;return students.filter(x=>(!q||[x.id,x.name,x.email].some(v=>v.toLowerCase().includes(q)))&&(!c||x.course===c)&&(!y||x.year===y)&&(!s||x.status===s))}
function renderTable(){
 const list=filteredStudents(),pages=Math.max(1,Math.ceil(list.length/12));currentPage=Math.min(currentPage,pages);
 const shown=list.slice((currentPage-1)*12,currentPage*12);
 $("studentRows").innerHTML=shown.map(x=>`<tr><td>${escapeHTML(x.id)}</td><td><b>${escapeHTML(x.name)}</b></td><td>${escapeHTML(x.email)}</td><td>${x.age}</td><td>${escapeHTML(x.course)}</td><td>${escapeHTML(x.year)}</td><td><span class="status ${x.status}">${x.status}</span></td><td><button class="button" onclick="editStudent('${escapeHTML(x.id)}')">Edit</button> <button class="button" onclick="deleteStudent('${escapeHTML(x.id)}')">Delete</button></td></tr>`).join("")||'<tr><td colspan="8">No student records found.</td></tr>';
 $("rowCount").textContent=`Showing ${shown.length} of ${list.length} students`;$("pageNumber").textContent=currentPage;
 const enrolled=students.filter(x=>x.status==="Enrolled").length,average=students.length?students.reduce((a,b)=>a+b.age,0)/students.length:0;
 $("totalStudents").textContent=students.length;$("totalCourses").textContent=new Set(students.map(x=>x.course)).size;$("averageAge").textContent=average.toFixed(1);$("pendingStudents").textContent=students.length-enrolled;
 const selected=$("courseFilter").value;$("courseFilter").innerHTML='<option value="">All courses</option>'+courses.map(c=>`<option value="${c}" ${selected===c?"selected":""}>${c}</option>`).join("");
}
["searchInput","courseFilter","yearFilter","statusFilter"].forEach(id=>$(id).addEventListener(id==="searchInput"?"input":"change",()=>{currentPage=1;renderTable()}));
$("prevPage").onclick=()=>{currentPage=Math.max(1,currentPage-1);renderTable()};$("nextPage").onclick=()=>{currentPage++;renderTable()};
$("addStudent").onclick=()=>showView("enrollment");
$("studentForm").addEventListener("submit",event=>{
 event.preventDefault();const form=Object.fromEntries(new FormData(event.target));let valid=true;
 const errors={id:!form.id.trim()?"ID is required.":students.some(s=>s.id.toLowerCase()===form.id.trim().toLowerCase())?"This ID already exists.":"",
 age:!form.age?"Age is required.":Number(form.age)<15||Number(form.age)>100?"Enter a valid age.":"",
 name:!form.name.trim()?"Name is required.":"",
 course:!form.course?"Please select a course.":"",
 email:!form.email.trim()?"Email is required.":!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)?"Enter a valid email address.":"",
 year:!form.year?"Please select a year level.":""};
 Object.entries(errors).forEach(([key,message])=>{$(key+"Error").textContent=message;if(message)valid=false});
 if(!valid)return;
 students.push({id:form.id.trim(),name:form.name.trim(),email:form.email.trim(),age:Number(form.age),course:form.course,year:form.year,status:"Pending"});
 save();event.target.reset();renderTable();notify("Student added successfully.");showView("students");
});
$("studentForm").addEventListener("reset",()=>setTimeout(()=>document.querySelectorAll(".error").forEach(e=>e.textContent=""),0));
window.editStudent=id=>{const student=students.find(s=>s.id===id);if(!student)return;editingId=id;const form=$("editForm");Object.entries(student).forEach(([key,value])=>{if(form.elements[key])form.elements[key].value=value});$("editModal").classList.add("show")};
$("cancelEdit").onclick=()=>$("editModal").classList.remove("show");
$("editForm").onsubmit=event=>{event.preventDefault();const form=Object.fromEntries(new FormData(event.target));if(students.some(s=>s.id===form.id&&s.id!==editingId)){alert("That student ID already exists.");return}const index=students.findIndex(s=>s.id===editingId);students[index]={...form,age:Number(form.age)};save();$("editModal").classList.remove("show");renderTable();notify("Student record updated.")};
window.deleteStudent=id=>{if(confirm("Delete student "+id+"?")){students=students.filter(s=>s.id!==id);save();renderTable();notify("Student record deleted.")}};
function renderSummary(){
 const year=$("reportYearFilter").value,list=students.filter(s=>year==="All year levels"||s.year===year),total=list.length,enrolled=list.filter(s=>s.status==="Enrolled").length,pending=total-enrolled,percent=n=>total?(n/total*100).toFixed(1):"0.0",average=total?list.reduce((a,b)=>a+b.age,0)/total:0;
 $("reportTotal").textContent=total;$("reportEnrolled").textContent=enrolled;$("reportPending").textContent=pending;$("reportAverage").textContent=average.toFixed(1);$("reportEnrolledPct").textContent=percent(enrolled)+"% of students";$("reportPendingPct").textContent=percent(pending)+"% of students";
 $("statusSummary").textContent=`${enrolled} of ${total} students have confirmed enrollment`;$("enrolledBar").style.width=percent(enrolled)+"%";$("enrolledLegend").textContent=`Enrolled ${enrolled} (${percent(enrolled)}%)`;$("pendingLegend").textContent=`Pending ${pending} (${percent(pending)}%)`;
 const counts=courses.map(course=>({course,count:list.filter(s=>s.course===course).length}));
 $("courseChart").innerHTML=counts.map(x=>`<div class="bar-row"><div class="bar-label"><b>${x.course}</b><span>${x.count} | ${percent(x.count)}%</span></div><div class="track"><div class="fill" style="width:${percent(x.count)}%"></div></div></div>`).join("");
 const years=["1st year","2nd year","3rd year","4th year"],numbers=years.map(y=>list.filter(s=>s.year===y).length),max=Math.max(1,...numbers);
 $("yearChart").innerHTML=years.map((y,i)=>`<div class="year-col"><b>${numbers[i]}</b><div class="year-bar" style="height:${Math.max(4,numbers[i]/max*100)}%"></div><small>${y}</small><small>${percent(numbers[i])}%</small></div>`).join("");
 const top=counts.slice().sort((a,b)=>b.count-a.count)[0];$("courseInsight").textContent=top&&top.count?`${top.course} is the largest course, with ${top.count} students (${percent(top.count)}% of the total).`:"No records in this selection.";$("pendingInsight").textContent=`${pending} student${pending===1?" is":"s are"} waiting for enrollment confirmation.`;
}
$("reportYearFilter").onchange=renderSummary;$("printReport").onclick=()=>{renderSummary();window.print()};
$("exportCsv").onclick=()=>{const headers=["Student ID","Name","Email","Age","Course","Year Level","Status"],rows=students.map(s=>[s.id,s.name,s.email,s.age,s.course,s.year,s.status]),csv=[headers,...rows].map(row=>row.map(value=>'"'+String(value).replace(/"/g,'""')+'"').join(",")).join("\r\n"),blob=new Blob([csv],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),link=document.createElement("a");link.href=url;link.download="student-enrollment-records.csv";link.click();URL.revokeObjectURL(url)};
renderTable();renderSummary();
