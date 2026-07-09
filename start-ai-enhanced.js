console.log('[calm-space] Enhanced AI launcher is not included in this repo snapshot. Keeping the process alive so Expo can run.');

process.stdin.resume();
setInterval(() => {}, 1 << 30);

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));
