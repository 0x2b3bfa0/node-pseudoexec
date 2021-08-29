const { spawn } = require('child_process');

async function pseudoexec(path, args, options, signals) {
  if (options === undefined) options = { stdio: 'inherit' };
  if (signals === undefined) signals = process.binding('constants').os.signals;
  return new Promise((resolve, reject) => {
    const child = spawn(path, args, options);
    for (const signal in signals) {
      try {
        process.on(signal, () => child.kill(signal));
      } catch (error) {
        if (error.code !== 'EINVAL') throw error;
      }
    }
    child.on('error', (error) => reject(error));
    child.on('exit', (code) => resolve(code));
  });
}

module.exports = { pseudoexec };
