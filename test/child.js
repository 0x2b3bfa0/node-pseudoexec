process.on("SIGTERM", () => process.exit(64));
console.log("CHILD: RUNNING");
setInterval(() => {}, 1);
