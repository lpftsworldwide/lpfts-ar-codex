#!/usr/bin/env node
import fs from 'fs';
import https from 'https';

const URL = 'https://dist-n23pvsjcr-lpftss-projects.vercel.app';
const OUTPUT = 'public/qr/lpfts-codex-ar-NEW.png';

console.log('🔄 Generating QR code for:', URL);

const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(URL)}&color=ffffff&bgcolor=000000&format=png`;

https.get(qrUrl, (response) => {
  const chunks = [];
  response.on('data', (chunk) => chunks.push(chunk));
  response.on('end', () => {
    fs.writeFileSync(OUTPUT, Buffer.concat(chunks));
    console.log('✅ QR code generated:', OUTPUT);
    console.log('📱 Scan URL:', URL);
  });
}).on('error', (err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
