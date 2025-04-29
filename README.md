# BokehJS Examples

Examples of integrating bokehjs with other libraries or tooling (e.g. webpack).

Initially contains TypeScripts examples, with others to follow later.

Cannot be built using a release NPM package of BokehJS and changes are required which will not be
released until BokehJS 4.0. In the meantime simple examples work using a particular Bokeh branch
which can be checked out and built in a temporary directory and the resultant NPM package copied
across to the root directory of this repository as follows. Note you will need `git` and `node`
installed.

```bash
cd <directory of choice>
git clone -b ianthomas23/13732_maybe_initialize --single-branch --depth 1 https://github.com/bokeh/bokeh.git
cd bokeh/bokehjs
node make build
npm pack
```

This will produce the file `bokeh-bokehjs-3.8.0-dev.1.tgz` which should be copied to the root
directory of the bokehjs-examples repository.

---

```ts
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

// Render plot in <div>
Bokeh.Plotting.show(create_bokehjs_plot(), "#target");
```

<img alt="Example plot" src="example.png">
