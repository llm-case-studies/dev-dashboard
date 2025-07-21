const log = document.getElementById('log');
function run(cmd) {
  fetch(`/run?cmd=${encodeURIComponent(cmd)}`).then(async res => {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      log.textContent += decoder.decode(value);
    }
  });
}
document.getElementById('btn-install').addEventListener('click', () => run('npm install'));
document.getElementById('btn-dev').addEventListener('click', () => run('npm run dev'));
document.getElementById('btn-build').addEventListener('click', () => run('npm run build'));
