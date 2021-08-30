const path = require("path");

process.addListener("SIGTERM", () => console.log("PARENT: SIGTERM"));

require("..")
  .pseudoexec("node", [path.join(__dirname, "child.js")])
  .then((code) => console.log(`PARENT: CHILD EXIT CODE ${code}`));
