async function run(cmd){
  const log=document.getElementById('log');
  const saveLog = document.getElementById('save-log').checked;
  log.textContent=`▶ ${cmd}\n`;
  const resp=await fetch(`/run?cmd=${encodeURIComponent(cmd)}${saveLog ? '&log=true' : ''}`);
  const reader=resp.body.getReader(), dec=new TextDecoder();
  while(true){
    const {value,done}=await reader.read();
    if(done) break;
    log.textContent+=dec.decode(value);
    log.scrollTop=log.scrollHeight;
  }
}

async function init(){
  const root=document.getElementById('root');
  const res=await fetch('/config'); const cfg=await res.json();
  document.getElementById('title').textContent=cfg.project?.name||'Dev Dashboard';
  if(!Object.keys(cfg.workflows).length){root.textContent='⚠️ No workflows defined.';return;}

  // helpers
  const executeComponents=(arr)=>arr.forEach(c=>{
    const comp=cfg.components[c]; if(!comp) return;
    const cmd=comp.dev||comp.command||Object.values(comp).find(v=>typeof v==='string');
    if(cmd) run(cmd);
  });

  // render grouped workflows first
  const rendered=new Set();
  const renderWorkflow=(k,w)=>{
    const sec=document.createElement('section'); sec.innerHTML=`<h3>${w.name||k}</h3>`;
    if(w.type==='radio-group'){
      const fs=document.createElement('fieldset'); fs.style.border='none';
      Object.entries(w.options||{}).forEach(([optKey,opt])=>{
        const id=`${k}-${optKey}`;
        fs.insertAdjacentHTML('beforeend',
          `<label><input type="radio" name="${k}" id="${id}"> ${opt.name||optKey}</label>`);
        fs.querySelector(`#${id}`).addEventListener('change',e=>{
          if(e.target.checked) executeComponents(opt.components||[]);
        });
      });
      sec.appendChild(fs);
    }else{ // default buttons
      Object.entries(w.steps||{run:w.command}).forEach(([step,cmd])=>{
        const btn=document.createElement('button');btn.textContent=step;
        btn.onclick=()=>run(cmd); sec.appendChild(btn);
      });
    }
    root.appendChild(sec); rendered.add(k);
  };

  // render groups
  Object.entries(cfg.groups||{}).forEach(([,grp])=>{
    const div=document.createElement('div');
    div.innerHTML=`<h2>${grp.name}</h2>`; root.appendChild(div);
    (grp.workflows||[]).forEach(wk=>cfg.workflows[wk]&&renderWorkflow(wk,cfg.workflows[wk]));
  });
  // render ungrouped leftovers
  Object.entries(cfg.workflows).forEach(([k,w])=>!rendered.has(k)&&renderWorkflow(k,w));
}
init();