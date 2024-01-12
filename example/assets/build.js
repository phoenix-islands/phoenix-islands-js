const esbuild = require('esbuild')
const sveltePlugin = require('esbuild-svelte')
const importGlobPlugin = require('esbuild-plugin-import-glob').default
const sveltePreprocess = require('svelte-preprocess')

const args = process.argv.slice(2)
const watch = args.includes('--watch')
const deploy = args.includes('--deploy')

let optsClient = {
  entryPoints: ['js/app.js'],
  bundle: true,
  minify: deploy,
  target: 'es2017',
  conditions: ['svelte', 'browser'],
  outdir: '../priv/static/assets',
  logLevel: 'info',
  sourcemap: watch ? 'inline' : false,
  watch,
  chunkNames: 'chunks/[name]-[hash]',
  splitting: true,
  format: 'esm',
  tsconfig: './tsconfig.json',
  plugins: [
    importGlobPlugin(),
    sveltePlugin({
      preprocess: sveltePreprocess(),
      compilerOptions: { dev: !deploy, hydratable: true, css: 'injected' }
    })
  ]
}

/** @type {esbuild.BuildOptions} */
let optsServer = {
  entryPoints: ['js/server.js'],
  platform: 'node',
  bundle: true,
  minify: false,
  target: 'node19.6.1',
  conditions: ['svelte'],
  outdir: '../priv/svelte',
  logLevel: 'info',
  sourcemap: watch ? 'inline' : false,
  watch,
  tsconfig: './tsconfig.json',
  plugins: [
    importGlobPlugin(),
    sveltePlugin({
      preprocess: sveltePreprocess(),
      compilerOptions: { dev: !deploy, hydratable: true, generate: 'ssr' }
    })
  ]
}

const client = esbuild.build({ ...optsClient, metafile: true })
const server = esbuild.build(optsServer)

if (watch) {
  client.then(result => {
    // console.log(result)

    const fs = require('fs')
    fs.writeFileSync('metadata.json', JSON.stringify(result.metafile), 'utf-8')

    process.stdin.on('close', () => process.exit(0))
    process.stdin.resume()
  })

  server.then(_result => {
    process.stdin.on('close', () => process.exit(0))
    process.stdin.resume()
  })
}
