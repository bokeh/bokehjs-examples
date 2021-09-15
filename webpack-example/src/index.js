import * as plt from "bokehjs/api/plotting"
import { ColumnDataSource } from "bokehjs/models/sources";
import { range, zip } from "bokehjs/core/util/array";
import { Random } from "bokehjs/core/util/random";
import { TapTool } from "bokehjs/models/tools/gestures/tap_tool";
import { set_log_level, logger } from "bokehjs/core/logging";
import { version } from "bokehjs/version";

set_log_level("info")
logger.info(`Bokeh ${version}`)

const random = new Random(1)

const M = 100
const xx = []
const yy = []

for (let y = 0; y <= M; y += 4) {
  for (let x = 0; x <= M; x += 4) {
    xx.push(x)
    yy.push(y)
  }
}

const N = xx.length
const indices = range(N).map((i) => i.toString())
const radii = range(N).map((_) => random.float()*0.4 + 1.7)

const colors = []
for (const [r, g] of zip(xx.map((x) => 50 + 2*x), yy.map((y) => 30 + 2*y)))
  colors.push(plt.color(r, g, 150))

const source = new ColumnDataSource({
  data: {x: xx, y: yy, radius: radii, colors},
})

const tools = "pan,crosshair,wheel_zoom,box_zoom,reset,tap,save"

const p = plt.figure({title: "Tappy Scatter", tools})

const circles = p.circle({field: "x"}, {field: "y"},
  {source, radius: radii, fill_color: colors, fill_alpha: 0.6, line_color: null})

p.text({field: "x"}, {field: "y"}, indices,
  {source, alpha: 0.5, text_font_size: "5pt", text_baseline: "middle", text_align: "center"})

const tap = p.toolbar.select_one(TapTool)
tap.renderers = [circles]
tap.callback = {
  execute(_obj, {source}) {
    const indices = source.selected['1d'].indices
    if (indices.length == 1)
      console.log(`Selected index: ${indices[0]}`)
    else if (indices.length > 1)
      console.log(`Selected indices: ${indices.join(', ')}`)
    else
      console.log("Nothing selected")
  }
}

plt.show(p)
