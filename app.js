const STORAGE_KEY = "waitwise_queue_v1";
const SETTINGS_KEY = "waitwise_settings_v1";
let queue = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{"avgMinutes":5,"lastNumber":0,"servedToday":0,"date":""}');
const $ = id => document.getElementById(id);

function todayKey(){ return new Date().toISOString().slice(0,10); }
function save(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  if(settings.date !== todayKey()){ settings.date=todayKey(); settings.servedToday=0; }
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
function tokenLabel(n){ return "A" + String(n).padStart(3,"0"); }
function waiting(){ return queue.filter(p=>p.status==="waiting"); }
function serving(){ return queue.find(p=>p.status==="serving"); }
function estimateFor(person){
  if(!person) return 0;
  const ahead = waiting().findIndex(p=>p.id===person.id);
  return (ahead < 0 ? 0 : ahead + (serving()?1:0)) * settings.avgMinutes;
}
function render(){
  if(settings.date !== todayKey()){settings.date=todayKey();settings.servedToday=0;}
  const w=waiting(), s=serving(), next=w[0];
  $("heroWaiting").textContent=w.length;
  $("heroServing").textContent=s?s.token:"—";
  $("heroWait").textContent=(w.length*settings.avgMinutes)+" min";
  $("queueProgress").style.width=Math.min(100,queue.length?((queue.filter(p=>p.status==="served").length/queue.length)*100):0)+"%";
  $("avgDisplay").textContent=settings.avgMinutes+" min";
  $("waitingDisplay").textContent=w.length;
  $("servedDisplay").textContent=settings.servedToday||0;
  $("nextDisplay").textContent=next?next.token:"—";
  $("servingToken").textContent=s?s.token:"—";
  $("upNext").textContent=next?next.token:"—";
  $("adminCurrent").textContent=s?s.token:"—";
  $("queueCount").textContent=w.length+" people";
  $("estimateLarge").innerHTML=(w.length*settings.avgMinutes)+' <span>min</span>';
  $("avgMinutes").value=settings.avgMinutes;
  const list=$("queueList");
  list.innerHTML="";
  if(!w.length){list.innerHTML='<div class="empty-state">No one is waiting. Be the first to join!</div>';}
  w.forEach((p,i)=>{
    const el=document.createElement("div");el.className="queue-item";
    const left=document.createElement("div");
    const name=document.createElement("strong");name.textContent=p.name;
    const detail=document.createElement("small");detail.textContent=p.service+" · Approx. "+(i*settings.avgMinutes+(s?settings.avgMinutes:0))+" min wait";
    left.append(name,detail);
    const token=document.createElement("span");token.className="queue-token";token.textContent=p.token;
    el.append(left,token);list.append(el);
  });
  save();
}
$("tokenForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=$("visitorName").value.trim();
  if(!name)return;
  settings.lastNumber=(settings.lastNumber||0)+1;
  const person={id:Date.now()+"-"+Math.random().toString(16).slice(2),name,service:$("serviceType").value,token:tokenLabel(settings.lastNumber),status:"waiting",createdAt:new Date().toISOString()};
  queue.push(person);save();render();
  const result=$("tokenResult");result.classList.remove("hidden");
  result.innerHTML="";
  const title=document.createElement("strong");title.textContent=person.token;
  const msg=document.createElement("p");msg.textContent="Your token is ready, "+name+". Estimated wait: "+(waiting().length-1+(serving()?1:0))*settings.avgMinutes+" minutes. Please watch the live queue.";
  result.append(title,msg);
  $("visitorName").value="";
  result.scrollIntoView({behavior:"smooth",block:"nearest"});
});
$("saveSettings").addEventListener("click",()=>{
  const value=Number($("avgMinutes").value);
  if(!Number.isInteger(value)||value<1||value>60){$("adminMessage").textContent="Enter a whole number from 1 to 60.";return;}
  settings.avgMinutes=value;save();render();$("adminMessage").textContent="Average service duration updated.";
});
$("serveNext").addEventListener("click",()=>{
  let current=serving();
  if(current){current.status="served";current.servedAt=new Date().toISOString();settings.servedToday=(settings.servedToday||0)+1;}
  const next=waiting()[0];
  if(next)next.status="serving";
  save();render();
  $("adminMessage").textContent=next?"Now serving "+next.token+".":"Queue is empty. No next token to serve.";
});
$("resetQueue").addEventListener("click",()=>{
  if(!confirm("Clear all current queue tokens? This cannot be undone."))return;
  queue=[];settings.servedToday=0;save();render();
  $("tokenResult").classList.add("hidden");
  $("adminMessage").textContent="Queue cleared.";
});
render();
