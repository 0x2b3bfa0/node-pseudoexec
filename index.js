const { spawn } = require("child_process");

module.exports.pseudoexec = async function (
  processPath,
  processArguments,
  spawnOptions,
  forwardedSignals
) {
  if (forwardedSignals === undefined) {
    forwardedSignals = Object.keys(process.binding("constants").os.signals);
  }
  if (spawnOptions === undefined) {
    spawnOptions = { stdio: "inherit", detached: true };
  }
  return new Promise((resolve, reject) => {
    const child = spawn(processPath, processArguments, spawnOptions);
    const forwarder = new SignalForwarder(forwardedSignals, child);
    child.on("close", () => forwarder.disable());
    child.on("error", (error) => reject(error));
    child.on("exit", (code) => resolve(code));
    forwarder.enable();
  });
};

class SignalForwarder {
  constructor(signals, child) {
    this.handlers = signals.map((signal) => ({
      listener: () => child.kill(signal),
      signal,
    }));
  }

  enable() {
    this.apply("prependListener", this.handlers);
  }

  disable() {
    this.apply("removeListener", this.handlers);
  }

  apply(action, handlers) {
    for (const { signal, listener } of handlers) {
      try {
        process[action](signal, listener);
      } catch (error) {
        if (error.code !== "EINVAL") throw error;
      }
    }
  }
}
