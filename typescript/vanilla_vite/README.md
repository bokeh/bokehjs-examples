# Vanilla (no framework) vite typescript example

Create an initial basic project using `create-vite`.

1. Create base `vite` project

    ```bash
    npm create vite@latest . -- --template vanilla-ts --yes
    ```

2. Build and run initial basic project

    ```bash
    npm install
    npm run dev
    ```

    In a web browser navigate to http://localhost:5173/

3. Simplify by removing some unwanted files

    ```bash
    rm public/vite.svg src/counter.ts src/style.css src/typescript.svg
    ```

4. Replace `src/main.ts` with a simple hello example containing

    ```ts
    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `<div>Hello</div>`
    ```

5. Build and run the minimal example

    ```bash
    npm run dev
    ```

    In a web browser navigate to http://localhost:5173/

6. Add BokehJS dependency to this project. This assumes the package has been built and copied to the root directory of this repository as outlined in the top-level `README.md`.

    ```bash
    npm install ../../../../bokeh-bokehjs-3.8.0-dev.1.tgz
    ```

7. Replace `src/main.ts` with a simple hello example containing

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
    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `<div id='target'>Hello</div>`;

    Bokeh.Plotting.show(create_bokehjs_plot(), "#target");

    ```

8. Rebuild and serve

    ```bash
    npm run dev
    ```

    In a web browser navigate to http://localhost:5173/
