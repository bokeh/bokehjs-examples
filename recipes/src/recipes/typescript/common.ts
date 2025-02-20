export const baseTSConfig =
`{
  "compilerOptions": {
    "baseUrl": ".",
    "esModuleInterop": true,
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "target": "ES2022"
  },
  "include": ["src"]
}`;

export const baseTypeScriptExample = {
  import: 'import * as Bokeh from "@bokeh/bokehjs";\n',
  function:
`console.info("BokehJS version:", Bokeh.version);

function create_bokehjs_plot(target_id: string) {
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

  const column = new Bokeh.Column({children: [plot, button], sizing_mode: "stretch_width"});
  Bokeh.Plotting.show(column, target_id);
}
`,
  create: 'create_bokehjs_plot("#target");'
};
