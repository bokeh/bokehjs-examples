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
