# React vite typescript example

Create an initial basic project using `create-vite`.

1. Create base `vite` project

    ```bash
    npm create vite@latest . -- --template react-ts --yes
    ```

2. Build and run initial basic project

    ```bash
    npm install
    npm run dev
    ```

    In a web browser navigate to http://localhost:5173/

3. Simplify by removing some unwanted files

    ```bash
    rm src/assets/react.svg src/App.css src/index.css public/vite.svg
    ```

4. Replace `src/App.tsx` with a simple hello example containing

    ```.tsx
    function App() {
      return (
        <>
          <div>Hello</div>
        </>
      )
    }

    export default App
    ```

5. Remove CSS lines from `src/main.tsx` by replacing it containing

    ```.tsx
    import { StrictMode } from 'react'
    import { createRoot } from 'react-dom/client'
    import App from './App.tsx'

    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
    ```

6. Build and run the minimal example

    ```bash
    npm run dev
    ```

    In a web browser navigate to http://localhost:5173/

7. Add BokehJS dependency to this project. This assumes the package has been built and copied to the root directory of this repository as outlined in the top-level `README.md`.

    ```bash
    npm install ../../../../bokeh-bokehjs-3.8.0-dev.1.tgz
    ```

8. Create a new file `src/components/BokehComponent.tsx` containing a BokehJS plot component containing

    ```.tsx
    import { useEffect, useRef } from 'react'
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

    export function BokehComponent() {
      const shown = useRef(false);
      useEffect(() => {
        if (!shown.current) {
            Bokeh.Plotting.show(create_bokehjs_plot(), "#target");
        shown.current = true;
        }
      }, [])

      return (
        <>
          <div id="target"></div>
        </>
      )
    }
    ```

9. Replace `src/App.tsx` so that it uses the `BokehComponent` containing

    ```.tsx
    import { BokehComponent } from './BokehComponent.tsx'

    function App() {
      return (
        <>
          <BokehComponent />
        </>
      )
    }

    export default App
    ```

10. Rebuild and serve

    ```bash
    npm run dev
    ```

    In a web browser navigate to http://localhost:5173/
