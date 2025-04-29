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
