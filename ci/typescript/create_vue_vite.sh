#!/usr/bin/env bash

set -eux

export OUTPUT_DIRECTORY=../temp/typescript/vue_vite

mkdir -p $OUTPUT_DIRECTORY
cd $OUTPUT_DIRECTORY
rm -rf *

function merge-json() {
  # merge the second json file into the first.
  TEMP_FILE=$(mktemp)
  jq '. * input' $1 $2 > TEMP_FILE && mv TEMP_FILE $1
}

# 1. Create base vite project
npm create vite@latest . -- --template vue-ts --yes

# 2. Build and run initial basic project
# npm install
# # npm run dev
# In a web browser navigate to http://localhost:5173/

# 3. Simplify by removing some unwanted files
rm public/vite.svg src/assets/vue.svg src/components/HelloWorld.vue src/style.css

# 4. Replace src/App.vue with a simple hello example
cat > src/App.vue << EOF
<template>
  <div>
    Hello!
  </div>
</template>
EOF

# 5. Remove CSS lines from src/main.ts by replacing it
cat > src/main.ts << EOF
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
EOF

# 6. Build and run the minimal example
# # npm run dev
# In a web browser navigate to http://localhost:5173/

# 7. Add BokehJS dependency to this project. This assumes the package has been built and copied to the root directory of this repository as outlined in the top-level README.md.
npm install ../../../../bokeh-bokehjs-3.8.0-dev.1.tgz

# 8. Create a new file src/components/BokehComponent.vue containing a BokehJS plot component
mkdir -p src/components
cat > src/components/BokehComponent.vue << EOF
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
EOF

# 9. Replace src/App.vue so that it uses the BokehComponent
cat > src/App.vue << EOF
<script setup lang="ts">
import BokehComponent from './components/BokehComponent.vue'
</script>

<template>
  <BokehComponent />
</template>
EOF

# 10. Rebuild and serve
# npm run dev
# In a web browser navigate to http://localhost:5173/
