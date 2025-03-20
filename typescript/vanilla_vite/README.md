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

    ```typescript
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

    ```typescript
    import * as Bokeh from "@bokeh/bokehjs";

    console.info("BokehJS version:", Bokeh.version);

    function create_bokehjs_plot(): Bokeh.Column {
      const source = new Bokeh.ColumnDataSource({data: { x: [0.1, 0.9], y: [0.1, 0.9], size: [40, 10] }});

      const plot = Bokeh.Plotting.figure({
        title: "Example BokehJS plot", height: 500, width: 500,
        x_range: [0, 1], y_range: [0, 1], sizing_mode: "stretch_width",
      });

      plot.scatter({ field: "x" }, { field: "y" }, {source, size: { field: "size" }});

      const button = new Bokeh.Widgets.Button({label: "Click me to add a point", button_type: "primary"});
      function button_callback() {
        const data = source.data as any;
        data.x.push(Math.random());
        data.y.push(Math.random());
        data.size.push(10 + Math.random()*30);
        source.change.emit();
      }
      button.on_click(button_callback);

      return new Bokeh.Column({children: [plot, button], sizing_mode: "stretch_width"});
    }

    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `<div id='target'>Hello</div>`;

    Bokeh.Plotting.show(create_bokehjs_plot(), "#target");

    ```

8. Rebuild and serve

    ```bash
    npm run dev
    ```

    In a web browser navigate to http://localhost:5173/
