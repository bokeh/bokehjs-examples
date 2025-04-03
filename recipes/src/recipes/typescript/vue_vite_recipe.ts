import { Recipe } from '../../recipe';
import { CommandStep, CreateFileStep, RemoveFilesStep, ReplaceFileStep } from '../../step';
import { baseTypeScriptExample } from './common';

export class VueViteRecipe extends Recipe {
  constructor() {
    super(
      'typescript',
      'vue',
      'vite',
      'Create an initial basic project using `create-vite`.'
    );

    this.add(new CommandStep(
      'Create base `vite` project',
      ['npm create vite@latest . -- --template vue-ts --yes']
    ));

    this.add(new CommandStep(
      'Build and run initial basic project',
      ['npm install', 'npm run dev'],
      'In a web browser navigate to http://localhost:5173/',
      true
    ));

    this.add(new RemoveFilesStep(
      'Simplify by removing some unwanted files',
      ['public/vite.svg', 'src/assets/vue.svg', 'src/components/HelloWorld.vue', 'src/style.css']
    ));

    this.add(new ReplaceFileStep(
      'Replace `src/App.vue` with a simple hello example',
      'src/App.vue',
`<template>
  <div>
    Hello!
  </div>
</template>`)
    );

    this.add(new ReplaceFileStep(
      'Remove CSS lines from `src/main.ts` by replacing it',
      'src/main.ts',
`import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')`)
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
      ['npm install ../../../../bokeh-bokehjs-3.8.0-dev.1.tgz']
    ));

    this.add(new CreateFileStep(
      'Create a new file of `src/components/BokehComponent.vue` with code to create BokehJS plot',
      'src/components/BokehComponent.vue',
      '<script setup lang="ts">\n' +
      "import { useTemplateRef, onMounted } from 'vue'\n" +
      baseTypeScriptExample.import + "\n" +
      "const ref = useTemplateRef('target')\n\n" +
      baseTypeScriptExample.function + "\n" +
      'onMounted(() => {\n' +
      '  ' + baseTypeScriptExample.version +
      '  ' + baseTypeScriptExample.show('ref.value') +
`})
</script>

<template>
  <div ref="target"></div>
</template>`)
    );

    this.add(new ReplaceFileStep(
      'Replace `src/App.vue` so that it uses the `BokehComponent`',
      'src/App.vue',
`<script setup lang="ts">
import BokehComponent from './components/BokehComponent.vue'
</script>

<template>
  <BokehComponent />
</template>`)
    );

    this.add(new CommandStep(
      'Rebuild and serve',
      ['npm run dev'],
      'In a web browser navigate to http://localhost:5173/'
    ));
  }
}
