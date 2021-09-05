require("..")
  .pseudoexec("node", [require("path").join(__dirname, "child.js")])
  .then((code) => console.log(`PARENT: CHILD EXIT CODE ${code}`));
