async function init() {
  const wfDiv = document.getElementById('workflows');
  const res = await fetch('/config');
  const { workflows } = await res.json();

  if (!Object.keys(workflows).length) {
    wfDiv.textContent = '⚠️  No workflows defined.';
    return;
  }

  for (const [wfKey, wf] of Object.entries(workflows)) {
    const sec = document.createElement('section');
    sec.innerHTML = `<h3>${wf.name}</h3>`;
    for (const [stepKey, cmd] of Object.entries(wf.steps)) {
      const btn = document.createElement('button');
      btn.textContent = stepKey;
      btn.onclick = () => run(cmd);
      sec.appendChild(btn);
    }
    wfDiv.appendChild(sec);
  }
}
async function run(cmd){
  const log=document.getElementById('log');
  log.textContent=`▶ ${cmd}\n`;
  const resp=await fetch('/run?cmd='+encodeURIComponent(cmd));
  const reader=resp.body.getReader(), dec=new TextDecoder();
  while(true){
    const {value,done}=await reader.read();
    if(done) break;
    log.textContent+=dec.decode(value);
    log.scrollTop=log.scrollHeight;
  }
}
init();
