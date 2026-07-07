import { main } from './cli.ts';

// No top-level await: the compiled CLI must run on old office Node (≥14.18).
void main(process.argv.slice(2)).then((code) => {
  process.exitCode = code;
});
