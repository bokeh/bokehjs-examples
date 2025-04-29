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
