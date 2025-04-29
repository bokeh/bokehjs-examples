#!/usr/bin/env bash

set -eux

export OUTPUT_DIRECTORY=../temp/typescript/angular_ng

mkdir -p $OUTPUT_DIRECTORY
cd $OUTPUT_DIRECTORY
rm -rf *

function merge-json() {
  # merge the second json file into the first.
  TEMP_FILE=$(mktemp)
  jq '. * input' $1 $2 > TEMP_FILE && mv TEMP_FILE $1
}

# 1. Install @angular/cli
npm install -g @angular/cli

# 2. Create Angular application
ng new angular_ng --directory ./ --minimal --routing=false --skip-git --ssr=false --style=css

# 3. Build and serve the initial project
# npm run build
# # npm run start
# In a web browser navigate to http://localhost:4200/

# 4. Add BokehJS dependency to this project. This assumes the package has been built and copied to the root directory of this repository as outlined in the top-level README.md.
npm install ../../../../bokeh-bokehjs-3.8.0-dev.1.tgz

# 5. Create a new file src/app/bokeh-js/bokeh-js.component.ts containing a BokehJS plot component
mkdir -p src/app/bokeh-js
cat > src/app/bokeh-js/bokeh-js.component.ts << EOF
import { Component, OnInit } from '@angular/core'
import * as Bokeh from "@bokeh/bokehjs";

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
@Component({
  selector: 'app-bokeh-js',
  imports: [],
  template: \`<div id="target"></div>\`,
  styles: \`\`
})

export class BokehJSComponent implements OnInit {
  ngOnInit() {
    console.info("BokehJS version:", Bokeh.version);
    Bokeh.Plotting.show(create_bokehjs_plot(), "#target");
  }
}
EOF

# 6. Replace src/app/app.component.ts so that it uses the BokehJSComponent
cat > src/app/app.component.ts << EOF
import { Component } from '@angular/core'
import { BokehJSComponent } from './bokeh-js/bokeh-js.component';

@Component({
  selector: 'app-root',
  imports: [BokehJSComponent],
  template: \`<app-bokeh-js></app-bokeh-js>\`,
  styles: [],
})

export class AppComponent {}
EOF

# 7. Remove some build warnings by allowing non ESM imports by adding to angular.json
cat > temp.json << EOF
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
EOF
merge-json angular.json temp.json
rm temp.json

# 8. Remove bundle size limits in angular.json by setting the "budgets" to an empty array
cat > temp.json << EOF
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
EOF
merge-json angular.json temp.json
rm temp.json

# 9. Rebuild and Serve the project
npm run build
# npm run start
# In a web browser navigate to http://localhost:4200/
