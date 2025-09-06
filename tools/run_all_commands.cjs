#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const testFile = path.join(root, 'test.alpa');
const outFile = path.join(root, 'commands_on_test.txt');

function readTest() {
  if (!fs.existsSync(testFile)) return '';
  return fs.readFileSync(testFile, 'utf8');
}

function extractPrints(text) {
  const re = /print\s*\(\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')\s*\)/g;
  let m; const outs = [];
  while ((m = re.exec(text)) !== null) {
    const s = m[1].slice(1, -1).replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\'/g, "'");
    outs.push(s);
  }
  return outs;
}

function simulate() {
  const text = readTest();
  const prints = extractPrints(text);
  const lines = [];
  lines.push('Alpa commands run against: ' + testFile);
  lines.push('Date: ' + new Date().toISOString());
  lines.push('');

  // help
  lines.push('--- help');
  lines.push('Usage: help');
  lines.push('Output: Lists available commands (see file)');
  lines.push('');

  // clear
  lines.push('--- clear');
  lines.push('[Simulated] Screen cleared');
  lines.push('');

  // exit
  lines.push('--- exit');
  lines.push('[Simulated] Exiting terminal');
  lines.push('');

  // ai.chat
  lines.push('--- ai.chat');
  lines.push('[Simulated] Starting chat session... (interactive)');
  lines.push('');

  // image
  lines.push('--- image "alpa language icon"');
  lines.push('[Simulated] Generated image for prompt: alpa language icon');
  lines.push('');

  // camera open/describe/close
  lines.push('--- camera.open'); lines.push('[Simulated] Camera opened'); lines.push('');
  lines.push('--- camera.describe "show file"'); lines.push('[Simulated] Capturing frame and describing: file view'); lines.push('');
  lines.push('--- camera.close'); lines.push('[Simulated] Camera closed'); lines.push('');

  // detect.objects / detect.faces
  lines.push('--- detect.objects both'); lines.push('[Simulated] Detected: people=0, objects=0'); lines.push('');
  lines.push('--- detect.faces on'); lines.push('[Simulated] Face detection enabled'); lines.push('');

  // bot.new
  lines.push('--- bot.new web test.alpa');
  lines.push('[Simulated] Building bot for platform web using data source: ' + testFile);
  lines.push('[Simulated] Bot endpoint: https://bot.alpa.cloud/web/' + Math.random().toString(36).slice(2,9));
  lines.push('');

  // ai.stt (simulate on audio)
  lines.push('--- ai.stt test_output.aiff');
  lines.push('[Simulated] Transcription: "Hello, this is a simulated transcription from Alpa STT."');
  lines.push('');

  // ai.tts - use prints joined
  lines.push('--- ai.tts (text from prints)');
  const ttsText = prints.join('\n');
  lines.push('[Simulated] TTS text:');
  lines.push(ttsText || '[No prints found]');
  // attempt to generate audio via macOS say if available
  try {
    if (ttsText) {
      const tmpTxt = path.join(root, 'commands_tts.txt');
      fs.writeFileSync(tmpTxt, ttsText);
      const outAiff = path.join(root, 'commands_tts.aiff');
      execSync(`say -o ${outAiff} -f ${tmpTxt}`);
      lines.push('[OK] Wrote audio to: ' + outAiff);
    }
  } catch (e) {
    lines.push('[Warning] macOS `say` TTS failed or not available: ' + e.message);
  }
  lines.push('');

  // ai.ocr
  lines.push('--- ai.ocr test.alpa');
  lines.push('[Simulated] OCR cannot process .alpa text as image. If you pass an image, it will extract text.');
  lines.push('');

  // ai.analyze
  lines.push('--- ai.analyze (file content)');
  const sample = (text || '').slice(0, 400).replace(/\n/g, ' ');
  lines.push('[Simulated Analysis] Sentiment: Neutral');
  lines.push('[Simulated Analysis] Key Topics: Alpa language, printing, functions');
  lines.push('[Simulated Analysis] Summary: ' + (sample || '[empty file]'));
  lines.push('');

  // ai.summarize
  lines.push('--- ai.summarize https://example.com/article');
  lines.push('[Simulated] Summary: (short summary of the provided URL content)');
  lines.push('');

  // deploy.ghpages
  lines.push('--- deploy.ghpages');
  lines.push('[Simulated] Building site, pushing to gh-pages, success at https://ahmed-eldesoky284.github.io/Alpa-Language/');
  lines.push('');

  // deploy.vscode
  lines.push('--- deploy.vscode');
  lines.push('[Simulated] Packaged extension: alpa-language-support-1.0.0.vsix.txt (simulated)');
  lines.push('');

  // deploy.vercel
  lines.push('--- deploy.vercel');
  lines.push('[Simulated] Deployed to Vercel: https://alpa-lang-demo-' + Math.random().toString(36).slice(2,8) + '.vercel.app');
  lines.push('');

  // run
  lines.push('--- run ' + testFile);
  if (prints.length === 0) {
    lines.push('[Alpa RUN] No print statements found.');
  } else {
    lines.push('Run output:');
    prints.forEach(p => lines.push(p));
  }
  lines.push('');

  return lines.join('\n');
}

const output = simulate();
fs.writeFileSync(outFile, output, 'utf8');
console.log('Wrote command outputs to:', outFile);
process.exit(0);
