# Vue vite typescript example

Create an initial basic project using `create-vite`.

1. Create base `vite` project

    ```bash
    npm create vite@latest . -- --template vue-ts --yes
    ```

2. Build and run initial basic project

    ```bash
    npm install
    npm run dev
    ```

    In a web browser navigate to http://localhost:5173/

3. Simplify by removing some unwanted files

    ```bash
    rm public/vite.svg src/assets/vue.svg src/components/HelloWorld.vue src/style.css
    ```

4. Replace `src/App.vue` with a simple hello example containing

    ```ts
    <template>
      <div>
        Hello!
      </div>
    </template>
    ```

5. Remove CSS lines from `src/main.ts` by replacing it containing

    ```ts
    import { createApp } from 'vue'
    import App from './App.vue'

    createApp(App).mount('#app')
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

8. Create a new file `src/components/BokehComponent.vue` containing a BokehJS plot component containing

    ```ts
    <script setup lang="ts">
    import { useTemplateRef, onMounted } from 'vue'
    import * as Bokeh from "@bokeh/bokehjs";

    const ref = useTemplateRef('target')

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
    onMounted(() => {
      console.info("BokehJS version:", Bokeh.version);
      Bokeh.Plotting.show(create_bokehjs_plot(), ref.value);
    })
    </script>

    <template>
      <div ref="target"></div>
    </template>
    ```

9. Replace `src/App.vue` so that it uses the `BokehComponent` containing

    ```ts
    <script setup lang="ts">
    import BokehComponent from './components/BokehComponent.vue'
    </script>

    <template>
      <BokehComponent />
    </template>
    ```

10. Rebuild and serve

    ```bash
    npm run dev
    ```

    In a web browser navigate to http://localhost:5173/
