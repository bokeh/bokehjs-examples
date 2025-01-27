#!/usr/bin/env bash

set -eux

export OUTPUT_DIRECTORY=../temp/typescript/vanilla_webpack

mkdir -p $OUTPUT_DIRECTORY
cd $OUTPUT_DIRECTORY
rm -rf *

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

# 5. Create HTML file
mkdir assets
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

# 6. Create source typescript file
mkdir src
cat > src/index.ts << EOF
console.log("Successfully loaded")
EOF

# 7. Add build and serve commands to package.json
cat > temp.json << EOF
{
  "scripts": {
    "build": "webpack build",
    "serve": "webpack serve"
  }
}
EOF
npm install --save-dev json-merger
npx json-merger --output package.json --pretty package.json temp.json
rm temp.json

# 8. Build and run basic example without any BokehJS
# npm install
# npm run build
# npm run serve

# 9. Add BokehJS dependency
npm install ../../../../bokeh-bokehjs-3.7.0-dev.5.tgz

# 10. tsconfig.json needs workaround for @bokehjs paths
cat > temp.json << EOF
{
  "compilerOptions": {
    "paths": {
      "@bokehjs/*": ["./node_modules/@bokeh/bokehjs/build/js/lib/*"]
    }
  }
}
EOF
npx json-merger --output tsconfig.json --pretty tsconfig.json temp.json
rm temp.json

# 11. webpack.config.ts needs workaround to resolve @bokehjs alias
# TODO: use proper ts parser to parse, add new code, write back out
head -13 webpack.config.ts > temp.ts
cat >> temp.ts << EOF
  resolve: {
    alias: {
      "@bokehjs": path.resolve(__dirname, "node_modules/@bokeh/bokehjs/build/js/lib/")
    }
  },
EOF
tail -9 webpack.config.ts >> temp.ts
mv temp.ts webpack.config.ts

# 12. Replace src/index.ts with code to create BokehJS plot
cat > src/index.ts << EOF
import { Column, ColumnDataSource, version } from "@bokehjs/bokeh";
import { figure, show } from "@bokehjs/api/plotting";
import { Button } from "@bokehjs/models/widgets";

console.info("BokehJS version:", version);

function create_bokehjs_plot(target_id: string) {
  const source = new ColumnDataSource({data: { x: [0.1, 0.9], y: [0.1, 0.9], size: [40, 10] }});

  const plot = figure({
    title: "Example BokehJS plot", height: 500, width: 500,
    x_range: [0, 1], y_range: [0, 1], sizing_mode: "stretch_width",
  });

  plot.scatter({ field: "x" }, { field: "y" }, {source, size: { field: "size" }});

  const button = new Button({label: "Click me to add a point", button_type: "primary"});
  function button_callback() {
    const data = source.data as any;
    data.x.push(Math.random());
    data.y.push(Math.random());
    data.size.push(10 + Math.random()*30);
    source.change.emit();
  }
  button.on_click(button_callback);

  const column = new Column({children: [plot, button], sizing_mode: "stretch_width"});
  show(column, target_id);
}

create_bokehjs_plot("#target");
EOF

# 13. Rebuild and serve
npm install
npm run build
#npm run serve
