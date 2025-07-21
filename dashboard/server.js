#!/usr/bin/env node
import express from 'express';
import { exec } from 'child_process';
const app = express();
app.use(express.static(new URL('.', import.meta.url).pathname + '/'));
app.get('/run', (req, res) => {
  const cmd = req.query.cmd;
  if (!cmd) return res.status(400).send('No cmd');
  const child = exec(cmd, { cwd: process.cwd() });
  child.stdout.pipe(res, { end: false });
  child.stderr.pipe(res, { end: false });
  child.on('close', () => res.end());
});
app.listen(3333, () => console.log('Dev Dashboard ⏩ http://localhost:3333'));
