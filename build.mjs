import { build } from "esbuild"

console.log(await build({
  entryPoints: ['./src/app.tsx'],
  bundle: true,
  loader: {
    ".gltf": 'file'
  //   ".png": "file",
  //   ".jpg": "file"
  },
  jsx: "automatic",
  outfile: "./public/out.js",
}))