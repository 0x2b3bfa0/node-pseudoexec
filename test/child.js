process.on("SIGTERM", () => console.log("CHILD: SIGTERM"));
process.on("SIGINT", () => process.exit(64));

console.log("CHILD: RUNNING");

setInterval(() => {}, 1);
