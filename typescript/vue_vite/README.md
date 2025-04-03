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

8. Create a new file of `src/components/BokehComponent.vue` with code to create BokehJS plot containing

    ```ts
    <script setup lang="ts">
    import { useTemplateRef, onMounted } from 'vue'
    import * as Bokeh from "@bokeh/bokehjs";

    const ref = useTemplateRef('target')

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
