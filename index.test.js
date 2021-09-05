const { spawn } = require("child_process");
const { pseudoexec } = require(".");

async function read(stream) {
  return new Promise((accept, reject) => {
    stream.addListener("data", (data) => accept(data.toString()));
    stream.addListener("close", (code) => reject("closed waiting for data"));
  });
}

describe("test internal process bindings pending deprecation", () => {
  test("process binding constants contain system signals", () => {
    const signals = process.binding("constants").os.signals;
    expect(signals).toHaveProperty("SIGTERM");
  });
});

describe("test process-level behavior", () => {
  test("signal listeners should be ephemeral", async () => {
    const before = process.listeners("SIGTERM");
    await pseudoexec("node", ["--eval", ""]);
    const after = process.listeners("SIGTERM");
    expect(before).toEqual(after);
  });
});

describe("test end-to-end command execution", () => {
  test("parent process should receive child exit code", async () => {
    const parent = spawn("node", ["./test/parent.js"]);
    expect(await read(parent.stdout)).toBe("CHILD: RUNNING\n");
    parent.kill("SIGTERM");
    expect(await read(parent.stdout)).toEqual("PARENT: CHILD EXIT CODE 64\n");
    await new Promise((accept) => parent.on("close", accept));
  });
});
