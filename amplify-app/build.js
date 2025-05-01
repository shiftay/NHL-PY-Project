const esbuild = require('esbuild');

async function runBuild() {
  let ctx = await esbuild.context({
    entryPoints: ['./src/index.js'], // Entry point of your application
    bundle: true,                   // Bundle all dependencies into one file
    outfile: './dist/bundle.js',      // Output file path
    platform: 'browser',            // Target the browser environment
    format: 'esm',                  // Output ES module format
    sourcemap: true,
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });

  await ctx.watch();
  console.log('watching...');
}

runBuild();