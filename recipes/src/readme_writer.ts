import * as fs from 'node:fs';
import * as path from 'node:path';

import { Recipe } from './recipe';
import { Step } from './step';
import { Writer } from './writer';

export class ReadmeWriter extends Writer {
  filename(recipe: Recipe): string {
    return path.join('..', recipe.type, recipe.framework + '_' + recipe.bundler, 'README.md');
  }

  protected writeStep(fd: number, index: number, step: Step): void {
    step.writeToReadme(fd, index);
  }

  protected writePreable(fd: number, recipe: Recipe): void {
    const { type, bundler } = recipe;

    let { details, framework } = recipe;
    const prefix = framework === 'vanilla' ? ' (no framework)' : '';
    framework = framework.charAt(0).toUpperCase() + framework.slice(1);

    fs.writeSync(fd, `# ${framework}${prefix} ${bundler} ${type} example\n`);

    if (details) {
      fs.writeSync(fd, '\n' + details + '\n');
    }
  }
}
