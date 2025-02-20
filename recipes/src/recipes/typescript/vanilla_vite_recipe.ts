import { Recipe } from '../../recipe';
import { CommandStep, RemoveFilesStep, ReplaceFileStep } from '../../step';
import { baseTypeScriptExample } from './common';

export class VanillaViteRecipe extends Recipe {
  constructor() {
    super(
      'typescript',
      'vanilla',
      'vite',
      'Create an initial basic project using `create-vite`.'
    );

    this.add(new CommandStep(
      'Create base `vite` project',
      ['npm create vite@latest . -- --template vanilla-ts --yes']
    ));

    this.add(new CommandStep(
      'Build and run initial basic project',
      ['npm install', 'npm run dev'],
      'In a web browser navigate to http://localhost:5173/',
      true
    ));

    this.add(new RemoveFilesStep(
      'Simplify by removing some unwanted files',
      ['public/vite.svg', 'src/counter.ts', 'src/style.css', 'src/typescript.svg']
    ));

    this.add(new ReplaceFileStep(
      'Replace `src/main.ts` with a simple hello example',
      'src/main.ts',
      "document.querySelector<HTMLDivElement>('#app')!.innerHTML = \\`<div>Hello</div>\\`")
    );

    this.add(new CommandStep(
      'Build and run the minimal example',
      ['npm run dev'],
      'In a web browser navigate to http://localhost:5173/',
      true
    ));

    this.add(new CommandStep(
      'Add BokehJS dependency to this project. This assumes the package has been built and ' +
      'copied to the root directory of this repository as outlined in the top-level `README.md`.',
      ['npm install ../../../../bokeh-bokehjs-3.7.0-dev.5.tgz']
    ));

    this.add(new ReplaceFileStep(
      'Replace `src/main.ts` with a simple hello example',
      'src/main.ts',
      baseTypeScriptExample.import + "\n" +
      baseTypeScriptExample.version + "\n" +
      baseTypeScriptExample.function + "\n" +
      "document.querySelector<HTMLDivElement>('#app')!.innerHTML = \\`<div id='target'>Hello</div>\\`;\n\n" +
      baseTypeScriptExample.show
    ));

    this.add(new CommandStep(
      'Rebuild and serve',
      ['npm run dev'],
      'In a web browser navigate to http://localhost:5173/'
    ));
  }
}
