# Vanilla (no framework) rspack typescript example

This is almost identical to the vanilla webpack example, as `rspack` is designed to be a drop-in replacement for `webpack`.

1. Create initial `package.json` (`npm` project settings)

    ```bash
    npm init --yes
    ```

2. Install dev dependencies

    ```bash
    npm install --save-dev typescript @rspack/core @rspack/cli ts-node ts-loader
    ```

3. Create typescript configuration `tsconfig.json` containing

    ```.json
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
    ```

4. Create rspack configuration `rspack.config.ts` containing

    ```ts
    import path from 'path';
    import { Configuration } from '@rspack/cli';

    const config: Configuration = {
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
    ```

5. Create HTML file `assets/index.html` containing

    ```.html
    <!DOCTYPE html>
    <html>
    <head>
      <title>BokehJS example: typescript vanilla rspack</title>
      <script src="bundle.js"></script>
    </head>
    <body>
      <div id="target"></div>
    </body>
    </html>
    ```

6. Create source typescript file `src/index.ts` containing

    ```ts
    console.log("Successfully loaded")
    ```

7. Add `build` and `serve` commands to the `scripts` section of `package.json`

    ```.json
    {
      "scripts": {
        "build": "rspack build",
        "serve": "rspack serve"
      }
    }
    ```

8. Build and run basic example without any BokehJS

    ```bash
    npm install
    npm run build
    npm run serve
    ```

    In a web browser navigate to http://localhost:4500/

9. Add BokehJS dependency to this project. This assumes the package has been built and copied to the root directory of this repository as outlined in the top-level `README.md`.

    ```bash
    npm install ../../../../bokeh-bokehjs-3.8.0-dev.1.tgz
    ```

10. Replace contents of `src/index.ts` with code to create BokehJS plot containing

    ```ts
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

    ```

11. Rebuild and serve

    ```bash
    npm install
    npm run build
    npm run serve
    ```

    In a web browser navigate to http://localhost:4500/
