#!/usr/bin/env bash

set -eux

export OUTPUT_DIRECTORY=../temp/typescript/vanilla_webpack

mkdir -p $OUTPUT_DIRECTORY
cd $OUTPUT_DIRECTORY
rm -rf *

function merge-json() {
  # merge the second json file into the first.
  TEMP_FILE=$(mktemp)
  jq '. * input' $1 $2 > TEMP_FILE && mv TEMP_FILE $1
}

# 1. Create initial package.json (npm project settings)
npm init --yes

# 2. Install dev dependencies
npm install --save-dev typescript webpack webpack-cli webpack-dev-server ts-node ts-loader

# 3. Create typescript configuration tsconfig.json
cat > tsconfig.json << EOF
{
  "compilerOptions": {
    "baseUrl": ".",
    "esModuleInterop": true,
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "target": "ES2022"
  },
  "include": ["src"]
}
EOF

# 4. Create webpack configuration webpack.config.ts
cat > webpack.config.ts << EOF
import path from 'path';
import webpack from 'webpack';
import 'webpack-dev-server';

const config: webpack.Configuration = {
  entry: './src/index.ts',
  mode: 'development',
  module: {
    rules: [
      { test: /\.ts/, use: "ts-loader", exclude: /node_modules/ }
    ],
  },
  output: { filename: 'bundle.js' },
  devServer: {
    static: {
      directory: path.join(__dirname, 'assets'),
    },
    port: 4500,
  },
};

export default config;
EOF

# 5. Create HTML file assets/index.html
mkdir -p assets
cat > assets/index.html << EOF
<!DOCTYPE html>
<html>
<head>
  <title>BokehJS example: typescript vanilla webpack</title>
  <script src="bundle.js"></script>
</head>
<body>
  <div id="target"></div>
</body>
</html>
EOF

# 6. Create source typescript file src/index.ts
mkdir -p src
cat > src/index.ts << EOF
console.log("Successfully loaded")
EOF

# 7. Add build and serve commands to the scripts section of package.json
cat > temp.json << EOF
{
  "scripts": {
    "build": "webpack build",
    "serve": "webpack serve"
  }
}
EOF
merge-json package.json temp.json
rm temp.json

# 8. Build and run basic example without any BokehJS
# npm install
# npm run build
# # npm run serve
# In a web browser navigate to http://localhost:4500/

# 9. Add BokehJS dependency to this project. This assumes the package has been built and copied to the root directory of this repository as outlined in the top-level README.md.
npm install ../../../../bokeh-bokehjs-3.8.0-dev.1.tgz

# 10. Replace contents of src/index.ts with code to create BokehJS plot
mkdir -p src
cat > src/index.ts << EOF
import * as Bokeh from "@bokeh/bokehjs";

console.info("BokehJS version:", Bokeh.version);

function create_bokehjs_plot(): Bokeh.Plotting.Figure {
  // Create figure
  const plot = Bokeh.Plotting.figure({
    title: "Example BokehJS plot", height: 500, sizing_mode: "stretch_width"
  });

  // Calculate x, y value of sine curve
  const x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const y = x.map(x => Math.sin(Math.PI*x/6));

  // Plot circles
  plot.scatter(x, y, {color: "blue", size: 30, fill_alpha: 0.4});

  return plot;
}
Bokeh.Plotting.show(create_bokehjs_plot(), "#target");
EOF

# 11. Rebuild and serve
npm install
npm run build
# npm run serve
# In a web browser navigate to http://localhost:4500/
