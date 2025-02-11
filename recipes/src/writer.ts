import * as fs from 'node:fs';

import { Recipe } from './recipe';
import { Step } from './step';

export abstract class Writer {
  abstract filename(recipe: Recipe): string;

  write(recipe: Recipe) {
    const filename = this.filename(recipe);
    const fd = fs.openSync(filename, 'w');

    this.writePreable(fd, recipe);

    for (let i = 0; i < recipe.steps.length; i++) {
      this.writeStep(fd, i, recipe.steps[i]);
    }

    fs.closeSync(fd);
  }

  protected abstract writeStep(fd: number, index: number, step: Step): void;

  protected abstract writePreable(fd: number, recipe: Recipe): void;
}
