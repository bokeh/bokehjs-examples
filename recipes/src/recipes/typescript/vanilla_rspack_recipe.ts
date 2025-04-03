import { Recipe } from '../../recipe';
import { CommandStep, CreateFileStep, MergeJsonStep } from '../../step';
import { baseTSConfig, baseTypeScriptExample } from './common';

export class VanillaRspackRecipe extends Recipe {
  constructor() {
    super(
      'typescript',
      'vanilla',
      'rspack',
      'This is almost identical to the vanilla webpack example, as `rspack` is designed to be a ' +
      'drop-in replacement for `webpack`.'
    );

    this.add(new CommandStep(
      'Create initial `package.json` (`npm` project settings)',
      ['npm init --yes']
    ));

    this.add(new CommandStep(
      'Install dev dependencies',
      ['npm install --save-dev typescript @rspack/core @rspack/cli ts-node ts-loader']
    ));

    this.add(new CreateFileStep(
      'Create typescript configuration `tsconfig.json`',
      'tsconfig.json',
      baseTSConfig
    ));

    this.add(new CreateFileStep(
      'Create rspack configuration `rspack.config.ts`',
      'rspack.config.ts',
`import path from 'path';
import { Configuration } from '@rspack/cli';

const config: Configuration = {
  entry: './src/index.ts',
  mode: 'development',
  module: {
    rules: [
      { test: /\\.ts/, use: "ts-loader", exclude: /node_modules/ }
    ],
  },
  output: { filename: 'bundle.js' },
  devServer: {
    static: {
      directory: path.join(__dirname, 'assets'),
    },
    port: 4500,
  },
};

export default config;`)
    );

    this.add(new CreateFileStep(
      'Create HTML file `assets/index.html`',
      'assets/index.html',
`<!DOCTYPE html>
<html>
<head>
  <title>BokehJS example: typescript vanilla rspack</title>
  <script src="bundle.js"></script>
</head>
<body>
  <div id="target"></div>
</body>
</html>`)
      );

      this.add(new CreateFileStep(
        'Create source typescript file `src/index.ts`',
        'src/index.ts',
        'console.log("Successfully loaded")'
      ));

      this.add(new MergeJsonStep(
        'Add `build` and `serve` commands to the `scripts` section of `package.json`',
        'package.json',
`{
  "scripts": {
    "build": "rspack build",
    "serve": "rspack serve"
  }
}`)
      );

      this.add(new CommandStep(
        'Build and run basic example without any BokehJS',
        ['npm install', 'npm run build', 'npm run serve'],
        'In a web browser navigate to http://localhost:4500/',
        true
      ));

      this.add(new CommandStep(
        'Add BokehJS dependency to this project. This assumes the package has been built and ' +
        'copied to the root directory of this repository as outlined in the top-level `README.md`.',
        ['npm install ../../../../bokeh-bokehjs-3.8.0-dev.1.tgz']
      ));

      this.add(new CreateFileStep(
        'Replace contents of `src/index.ts` with code to create BokehJS plot',
        'src/index.ts',
        baseTypeScriptExample.import + "\n" +
        baseTypeScriptExample.version + "\n" +
        baseTypeScriptExample.function + "\n" +
        baseTypeScriptExample.show()
      ));

      this.add(new CommandStep(
        'Rebuild and serve',
        ['npm install', 'npm run build', 'npm run serve'],
        'In a web browser navigate to http://localhost:4500/'
      ));
  }
}
