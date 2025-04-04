#!/usr/bin/env bash

set -eux

export OUTPUT_DIRECTORY=../temp/typescript/react_vite

mkdir -p $OUTPUT_DIRECTORY
cd $OUTPUT_DIRECTORY
rm -rf *

function merge-json() {
  # merge the second json file into the first.
  TEMP_FILE=$(mktemp)
  jq '. * input' $1 $2 > TEMP_FILE && mv TEMP_FILE $1
}

# 1. Create base vite project
npm create vite@latest . -- --template react-ts --yes

# 2. Build and run initial basic project
# npm install
# # npm run dev
# In a web browser navigate to http://localhost:5173/

# 3. Simplify by removing some unwanted files
rm src/assets/react.svg src/App.css src/index.css public/vite.svg

# 4. Replace src/App.tsx with a simple hello example
cat > src/App.tsx << EOF
function App() {
  return (
    <>
      <div>Hello</div>
    </>
  )
}

export default App
EOF

# 5. Remove CSS lines from src/main.tsx by replacing it
cat > src/main.tsx << EOF
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
EOF

# 6. Build and run the minimal example
# # npm run dev
# In a web browser navigate to http://localhost:5173/

# 7. Add BokehJS dependency to this project. This assumes the package has been built and copied to the root directory of this repository as outlined in the top-level README.md.
npm install ../../../../bokeh-bokehjs-3.8.0-dev.1.tgz

# 8. Create a new file src/components/BokehComponent.tsx containing a BokehJS plot component
mkdir -p src
cat > src/BokehComponent.tsx << EOF
import { useEffect, useRef } from 'react'
import * as Bokeh from "@bokeh/bokehjs";

console.info("BokehJS version:", Bokeh.version);

function create_bokehjs_plot(): Bokeh.Column {
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

  return new Bokeh.Column({children: [plot, button], sizing_mode: "stretch_width"});
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
EOF

# 9. Replace src/App.tsx so that it uses the BokehComponent
cat > src/App.tsx << EOF
import { BokehComponent } from './BokehComponent.tsx'

function App() {
  return (
    <>
      <BokehComponent />
    </>
  )
}

export default App
EOF

# 10. Rebuild and serve
# npm run dev
# In a web browser navigate to http://localhost:5173/
