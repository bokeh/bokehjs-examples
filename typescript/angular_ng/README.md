# Angular ng typescript example

The Angular web framework includes its own builder `ng` in the `@angular/cli` package

1. Install `@angular/cli`

    ```bash
    npm install -g @angular/cli
    ```

2. Create Angular application

    ```bash
    ng new angular_ng --directory ./ --minimal --routing=false --skip-git --ssr=false --style=css
    ```

3. Build and serve the initial project

    ```bash
    npm run build
    npm run start
    ```

    In a web browser navigate to http://localhost:4200/

4. Add BokehJS dependency to this project. This assumes the package has been built and copied to the root directory of this repository as outlined in the top-level `README.md`.

    ```bash
    npm install ../../../../bokeh-bokehjs-3.8.0-dev.1.tgz
    ```

5. Create a new file `src/app/bokeh-js/bokeh-js.component.ts` containing a BokehJS plot component containing

    ```ts
    import { Component, OnInit } from '@angular/core'
    import * as Bokeh from "@bokeh/bokehjs";

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

    @Component({
      selector: 'app-bokeh-js',
      imports: [],
      template: `<div id="target"></div>`,
      styles: ``
    })

    export class BokehJSComponent implements OnInit {
      ngOnInit() {
        console.info("BokehJS version:", Bokeh.version);
        Bokeh.Plotting.show(create_bokehjs_plot(), "#target");
      }
    }
    ```

6. Replace `src/app/app.component.ts` so that it uses the `BokehJSComponent` containing

    ```ts
    import { Component } from '@angular/core'
    import { BokehJSComponent } from './bokeh-js/bokeh-js.component';

    @Component({
      selector: 'app-root',
      imports: [BokehJSComponent],
      template: `<app-bokeh-js></app-bokeh-js>`,
      styles: [],
    })

    export class AppComponent {}
    ```

7. Remove some build warnings by allowing non ESM imports by adding to `angular.json`

    ```.json
    {
      "projects": {
        "angular_ng": {
          "architect": {
            "build": {
              "options": {
                "allowedCommonJsDependencies": [
                  "@bokeh/bokehjs",
                  "mathjax-full",
                  "regl"
                ]
              }
            }
          }
        }
      }
    }
    ```

8. Remove bundle size limits in `angular.json` by setting the `"budgets"` to an empty array

    ```.json
    {
      "projects": {
        "angular_ng": {
          "architect": {
            "build": {
              "configurations": {
                "production": {
                  "budgets": [
                  ]
                }
              }
            }
          }
        }
      }
    }
    ```

9. Rebuild and Serve the project

    ```bash
    npm run build
    npm run start
    ```

    In a web browser navigate to http://localhost:4200/
