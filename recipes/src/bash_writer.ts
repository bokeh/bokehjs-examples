import * as fs from 'node:fs';
import * as path from 'node:path';

import { Recipe } from './recipe';
import { Step } from './step';
import { Writer } from './writer';

export class BashWriter extends Writer {
  filename(recipe: Recipe): string {
    return path.join(
      '..', 'ci', recipe.type, 'create_' + recipe.framework + '_' + recipe.bundler + '.sh');
  }

  protected writeStep(fd: number, index: number, step: Step): void {
    step.writeToBash(fd, index);
  }

  protected writePreable(fd: number, recipe: Recipe): void {
    fs.writeSync(fd, `#!/usr/bin/env bash

set -eux

export OUTPUT_DIRECTORY=../temp/${recipe.type}/${recipe.framework}_${recipe.bundler}

mkdir -p $OUTPUT_DIRECTORY
cd $OUTPUT_DIRECTORY
rm -rf *

function merge-json() {
  # merge the second json file into the first.
  TEMP_FILE=$(mktemp)
  jq '. * input' $1 $2 > TEMP_FILE && mv TEMP_FILE $1
}
`);
  }
}
