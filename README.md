# Ersatz [`exec(3)`](https://man7.org/linux/man-pages/man3/exec.3.html) for [Node JS](https://nodejs.org)

Node JS doesn't provide any means for processes to replace themselves through functions from the [`exec(3)`](https://man7.org/linux/man-pages/man3/exec.3.html) family. Thus, `pseudoexec` provides a convenience wrapper over [`child_process.spawn()`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options) that causes the child process to [`inherit`](https://nodejs.org/api/child_process.html#child_process_options_stdio) the parent process' [`stdio(3)`](https://man7.org/linux/man-pages/man3/stdio.3.html) standard [input](https://nodejs.org/api/process.html#process_process_stdin)/[output](https://nodejs.org/api/process.html#process_process_stdout)/[error](https://nodejs.org/api/process.html#process_process_stderr) streams and [handle](https://nodejs.org/api/process.html#process_signal_events) all the [`syscalls(2)`](https://man7.org/linux/man-pages/man2/syscalls.2.html)
 sent to the parent.

⚠️ **Warning:** Windows is not fully supported, because it [doesn't support signals](https://nodejs.org/api/process.html#process_signal_events).

## Example

```javascript
const { pseudoexec } = require("pseudoexec");

pseudoexec("sl", ["-f", "-a"]).then(process.exit);
```

## Maintenance

This package uses [`process.binding()` (DEP0111)](https://nodejs.org/api/deprecations.html#DEP0111) to retrieve a list of signals specific to the current operating system, exactly in the same way as Node JS does [internally](https://github.com/nodejs/node/blob/73d5f8a843c89707313eb2cf2b99af59096b738a/lib/internal/util.js#L44). This function is pending deprecation and might not be available in future versions of Node JS.

## Alternatives

* [`node-kexec`](https://github.com/jprichardson/node-kexec) (linux-only)
