import { Recipe } from '../../recipe';
import { CommandStep, CreateFileStep, RemoveFilesStep, ReplaceFileStep } from '../../step';
import { baseTypeScriptExample } from './common';

export class ReactViteRecipe extends Recipe {
  constructor() {
    super(
      'typescript',
      'react',
      'vite',
      'Create an initial basic project using `create-vite`.'
    );

    this.add(new CommandStep(
      'Create base `vite` project',
      ['npm create vite@latest . -- --template react-ts --yes']
    ));

    this.add(new CommandStep(
      'Build and run initial basic project',
      ['npm install', 'npm run dev'],
      'In a web browser navigate to http://localhost:5173/',
      true
    ));

    this.add(new RemoveFilesStep(
      'Simplify by removing some unwanted files',
      ['src/assets/react.svg', 'src/App.css', 'src/index.css', 'public/vite.svg']
    ));

    this.add(new ReplaceFileStep(
      'Replace `src/App.tsx` with a simple hello example',
      'src/App.tsx',
`function App() {
  return (
    <>
      <div>Hello</div>
    </>
  )
}

export default App`)
    );

    this.add(new ReplaceFileStep(
      'Remove CSS lines from `src/main.tsx` by replacing it',
      'src/main.tsx',
`import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)`)
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
      'Create a new file `src/components/BokehComponent.tsx` containing a BokehJS plot component',
      'src/BokehComponent.tsx',
      "import { useEffect, useRef } from 'react'\n" +
      baseTypeScriptExample.import + "\n" +
      baseTypeScriptExample.version + "\n" +
      baseTypeScriptExample.function + "\n" +
`export function BokehComponent() {
  const shown = useRef(false);
  useEffect(() => {
    if (!shown.current) {` + "\n" +
    '        ' + baseTypeScriptExample.show() +
`    shown.current = true;
    }
  }, [])

  return (
    <>
      <div id="target"></div>
    </>
  )
}`)
    );

    this.add(new ReplaceFileStep(
      'Replace `src/App.tsx` so that it uses the `BokehComponent`',
      'src/App.tsx',
`import { BokehComponent } from './BokehComponent.tsx'

function App() {
  return (
    <>
      <BokehComponent />
    </>
  )
}

export default App`)
    );

    this.add(new CommandStep(
      'Rebuild and serve',
      ['npm run dev'],
      'In a web browser navigate to http://localhost:5173/'
    ));
  }
}
