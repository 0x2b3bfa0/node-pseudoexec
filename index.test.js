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
    expect(signals).toHaveProperty("SIGINT");
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
  let parent;

  beforeEach(async () => {
    parent = spawn("node", ["./test/parent.js"]);
    expect(await read(parent.stdout)).toBe("CHILD: RUNNING\n");
  });

  test("parent process should receive child exit code", async () => {
    parent.kill("SIGINT");
    expect(await read(parent.stdout)).toEqual("PARENT: CHILD EXIT CODE 64\n");
    await new Promise((accept) => parent.on("close", accept));
  });

  test("parent process should forward signals to child", async () => {
    parent.kill("SIGTERM");
    let output = await read(parent.stdout);
    if (!output.includes("PARENT") || !output.includes("CHILD"))
      output += await read(parent.stdout);
    expect(output).toContain("PARENT: SIGTERM\n");
    expect(output).toContain("CHILD: SIGTERM\n");
    parent.kill("SIGINT");
  });
});
