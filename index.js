#!/usr/bin/env node

const { exec } = require('child_process');
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('Usage: gshh "commit message" "filename or . for all"');
  console.error('Examples:');
  console.error('  gshh "Update README" README.md');
  console.error('  gshh "Major changes" .');
  console.error('  gshh "Multiple files" "file1.js file2.css"');
  process.exit(1);
}

const commitMessage = args[0];
const fileSpec = args[1];

console.log(`\x1b[36m Preparing to ship your changes...\x1b[0m`);

exec(`git add ${fileSpec}`, (addError, addStdout, addStderr) => {
  if (addError) {
    console.error(`\x1b[31m✖ Error adding ${fileSpec}:\x1b[0m ${addStderr.trim()}`);
    return;
  }

  exec(`git commit -m "${commitMessage}"`, (commitError, commitStdout, commitStderr) => {
    if (commitError) {
      console.error(`\x1b[31m✖ Error committing:\x1b[0m ${commitStderr.trim()}`);
      return;
    }

    exec('git push', (pushError, pushStdout, pushStderr) => {
      if (pushError) {
        console.error(`\x1b[31m✖ Error pushing:\x1b[0m ${pushStderr.trim()}`);
      } else {
        console.log(`\x1b[32m✔ Successfully shipped ${fileSpec} with message: "${commitMessage}"\x1b[0m`);
        console.log(`\x1b[32m  ${commitStdout.trim()}\x1b[0m`);
      }
    });
  });
});