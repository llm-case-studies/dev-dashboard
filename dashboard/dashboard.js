async function run(cmd) {
  const log = document.getElementById('log');
  log.textContent = `▶ ${cmd}\n`;
  const resp = await fetch(`/run?cmd=${encodeURIComponent(cmd)}`);
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    log.textContent += decoder.decode(value);
    log.scrollTop = log.scrollHeight;
  }
}
