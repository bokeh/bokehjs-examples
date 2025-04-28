import { Recipe } from '../../recipe';
import { CommandStep, CreateFileStep, MergeJsonStep, ReplaceFileStep } from '../../step';
import { baseTypeScriptExample } from './common';

export class AngularNgRecipe extends Recipe {
  constructor() {
    super(
      'typescript',
      'angular',
      'ng',
      'The Angular web framework includes its own builder `ng` in the `@angular/cli` package'
    );

    this.add(new CommandStep(
      'Install `@angular/cli`',
      ['npm install -g @angular/cli']
    ));

    this.add(new CommandStep(
      'Create Angular application',
      ['ng new angular_ng --directory ./ --minimal --routing=false --skip-git --ssr=false --style=css']
    ));

    this.add(new CommandStep(
      'Build and serve the initial project',
      ['npm run build', 'npm run start'],
      'In a web browser navigate to http://localhost:4200/',
      true
    ));

    this.add(new CommandStep(
      'Add BokehJS dependency to this project. This assumes the package has been built and ' +
      'copied to the root directory of this repository as outlined in the top-level `README.md`.',
      ['npm install ../../../../bokeh-bokehjs-3.8.0-dev.1.tgz']
    ));

    this.add(new CreateFileStep(
      'Create a new file `src/app/bokeh-js/bokeh-js.component.ts` containing a BokehJS plot component',
      'src/app/bokeh-js/bokeh-js.component.ts',
      "import { Component, OnInit } from '@angular/core'\n" +
      baseTypeScriptExample.import + "\n" +
      baseTypeScriptExample.function + "\n" +
      "@Component({\n" +
      "  selector: 'app-bokeh-js',\n" +
      "  imports: [],\n" +
      '  template: \\`<div id="target"></div>\\`,\n' +
      "  styles: \\`\\`\n" +
      "})\n\n" +
      "export class BokehJSComponent implements OnInit {\n" +
      "  ngOnInit() {\n" +
      "    " + baseTypeScriptExample.version +
      "    " + baseTypeScriptExample.show() +
      "  }\n" +
      "}")
    );

    this.add(new ReplaceFileStep(
      'Replace `src/app/app.component.ts` so that it uses the `BokehJSComponent`',
      'src/app/app.component.ts',
      "import { Component } from '@angular/core'\n" +
      "import { BokehJSComponent } from './bokeh-js/bokeh-js.component';\n\n" +
      "@Component({\n" +
      "  selector: 'app-root',\n" +
      "  imports: [BokehJSComponent],\n" +
      "  template: \\`<app-bokeh-js></app-bokeh-js>\\`,\n" +
      "  styles: [],\n" +
      "})\n\n" +
      "export class AppComponent {}")
    );

    this.add(new MergeJsonStep(
      'Remove some build warnings by allowing non ESM imports by adding to `angular.json`',
      'angular.json',
`{
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
}`)
    );

    this.add(new MergeJsonStep(
      'Remove bundle size limits in `angular.json` by setting the `"budgets"` to an empty array',
      'angular.json',
`{
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
}`)
    );

    this.add(new CommandStep(
      'Rebuild and Serve the project',
      ['npm run build', 'npm run start'],
      'In a web browser navigate to http://localhost:4200/'
    ));
  }
}
