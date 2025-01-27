
# Vanilla (no framework) webpack typescript example

1. Create initial `package.json` (`npm` project settings)

    ```bash
    npm init --yes
    ```

2. Install dev dependencies

    ```bash
    npm install --save-dev typescript webpack webpack-cli webpack-dev-server ts-node ts-loader
    ```

3. Create typescript configuration `tsconfig.json`  containing:

    ```json
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

4. Create webpack configuration `webpack.config.ts` containing:

    ```typescript
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
    ```

5. Create HTML file `assets/index.html` containing:

    ```html
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
    ```

6. Create source typescript file `src/index.ts` containing:

    ```ts
    console.log("Successfully loaded")
    ```

7. Add build and serve commands to the `scripts` section of `package.json`:

    ```json
    "scripts": {
      "build": "webpack build",
      "serve": "webpack serve"
    }
    ```

8. Build and run basic example without any BokehJS

    ```bash
    npm install
    npm run build
    npm run serve
    ```

   In a web browser navigate to http://localhost:4500/

9. Add BokehJS dependency to the project. This assumes the package has been built and copied to the
   root directory of this repository as outlined in the top-level README.md.

    ```bash
    npm install ../../../../bokeh-bokehjs-3.7.0-dev.5.tgz
    ```

10. `tsconfig.json` needs workaround for `@bokehjs` paths, added to the `compilerOptions` section:

    ```json
    "compilerOptions": {
      "paths": {
        "@bokehjs/*": ["./node_modules/@bokeh/bokehjs/build/js/lib/*"]
      }
    }
    ```

11. `webpack.config.ts` needs workaround to resolve `@bokehjs` alias also, added to the top-level of the `config`:

    ```typescript
    const config: webpack.Configuration = {
      resolve: {
        alias: {
          "@bokehjs": path.resolve(__dirname, "node_modules/@bokeh/bokehjs/build/js/lib/")
        }
      },
    }
    ````

12. Remove contents of `src/index.ts` and replace with code to create BokehJS plot:

    ```typescript
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
    ```

13. Rebuild and serve

    ```bash
    npm install
    npm run build
    #npm run serve
    ```

   In a web browser navigate to http://localhost:4500/
