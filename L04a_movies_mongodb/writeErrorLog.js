// writeErrorLog.js
// 16th august 2024

const fs = require('fs');
const util = require('util');

// Luo virhelog-tiedosto ja kirjoitusvirta
const logFile = fs.createWriteStream('error.log', { flags: 'a' });

// Funktio virheiden kirjoittamiseen log-tiedostoon
function writeErrorLog(...errors) {
  const errorMessage = util.format(...errors) + '\n';
  logFile.write(errorMessage);
}

module.exports = writeErrorLog;
