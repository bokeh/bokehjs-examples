import * as fs from 'node:fs';
import * as path from 'node:path';

import { fileExtension, languageFromExtension, removeBackticks } from './util';

/**
 * Single step of a recipe.
 */
export abstract class Step {   //}   implements IWriteVisitor {
  constructor(readonly description: string) {}

  abstract writeToBash(fd: number, index: number): void;

  abstract writeToReadme(fd: number, index: number): void;

  protected writeDescriptionBash(fd: number, index: number, suffix: string = ''): void {
    fs.writeSync(fd, `\n# ${index+1}. ${removeBackticks(this.description)}${suffix}\n`);
  }

  protected writeDescriptionReadme(fd: number, index: number, suffix: string = ''): void {
    fs.writeSync(fd, `\n${index+1}. ${this.description}${suffix}\n`);
  }

  protected spacer = '    '; // Spacer for indented lines in README.
}

/**
 * Step consisting of one or more shell commands.
 */
export class CommandStep extends Step {
  constructor(
    description: string,
    readonly commands: string[],
    readonly postscript: string = '',
    readonly ignoreIfBash: boolean = false
  ) {
    super(description);
  }

  writeToBash(fd: number, index: number): void {
    this.writeDescriptionBash(fd, index);

    const allPrefix = this.ignoreIfBash ? '# ' : '';
    for (const command of this.commands) {
      let prefix = allPrefix;
      if (command === 'npm run serve' || command === 'npm run dev') {
        prefix = '# ' + prefix;
      }
      fs.writeSync(fd, prefix + command + '\n');
    }
    if (this.postscript) {
      fs.writeSync(fd, '# ' + this.postscript + '\n');
    }
  }

  writeToReadme(fd: number, index: number): void {
    this.writeDescriptionReadme(fd, index);

    const { spacer } = this;
    fs.writeSync(fd, '\n' + spacer + '```bash\n');
    for (const command of this.commands) {
      fs.writeSync(fd, spacer + command + '\n');
    }
    fs.writeSync(fd, spacer + '```\n');

    if (this.postscript) {
      fs.writeSync(fd, '\n' + spacer + this.postscript + '\n');
    }
  }
}

abstract class CreateOrReplaceFileStep extends Step {
  constructor(
    description: string,
    readonly filename: string,
    readonly contents: string,
    readonly alreadyExists: boolean
  ) {
    super(description);
  }

  writeToBash(fd: number, index: number): void {
    this.writeDescriptionBash(fd, index);

    if (!this.alreadyExists) {
      const dirname = path.dirname(this.filename);
      if (dirname !== '.') {
        fs.writeSync(fd, `mkdir -p ${dirname}\n`);
      }
    }

    fs.writeSync(fd, `cat > ${this.filename} << EOF\n`);
    fs.writeSync(fd, this.contents);
    if (this.contents.at(-1) !== '\n') {
      fs.writeSync(fd, '\n');
    }
    fs.writeSync(fd, 'EOF\n');
  }

  writeToReadme(fd: number, index: number): void {
    this.writeDescriptionReadme(fd, index, ' containing');

    const { spacer } = this;
    const language = languageFromExtension(this.filename);
    fs.writeSync(fd, '\n' + spacer + '```' + language + '\n');
    for (let line of this.contents.split('\n')) {
      if (line) {
        line = line.replaceAll('\\`', '`');
        fs.writeSync(fd, spacer + line + '\n');
      } else {
        fs.writeSync(fd, '\n');
      }
    }
    fs.writeSync(fd, spacer + '```\n');
  }
}

/**
 * Step to create a file.
 */
export class CreateFileStep extends CreateOrReplaceFileStep {
  constructor(description: string, filename: string, contents: string) {
    super(description, filename, contents, false);
  }
}

/**
 * Step to create a file.
 */
export class MergeJsonStep extends Step {
  constructor(description: string, readonly filename: string, readonly toMerge: string) {
    super(description);
  }

  writeToBash(fd: number, index: number): void {
    this.writeDescriptionBash(fd, index);

    const tempFilename = 'temp' + fileExtension(this.filename);
    fs.writeSync(fd, `cat > ${tempFilename} << EOF\n`);
    fs.writeSync(fd, this.toMerge);
    if (this.toMerge.at(-1) !== '\n') {
      fs.writeSync(fd, '\n');
    }
    fs.writeSync(fd, 'EOF\n');
    fs.writeSync(fd, `merge-json ${this.filename} ${tempFilename}\n`);
    fs.writeSync(fd, `rm ${tempFilename}\n`);
  }

  writeToReadme(fd: number, index: number): void {
    this.writeDescriptionReadme(fd, index);

    const { spacer } = this;
    const language = languageFromExtension(this.filename);
    fs.writeSync(fd, '\n' + spacer + '```' + language + '\n');
    for (const line of this.toMerge.split('\n')) {
      if (line) {
        fs.writeSync(fd, spacer + line + '\n');
      } else {
        fs.writeSync(fd, '\n');
      }
    }
    fs.writeSync(fd, spacer + '```\n');
  }
}

/**
 * Step to remove files.
 */
export class RemoveFilesStep extends Step {
  constructor(description: string, readonly filenames: string[]) {
    super(description);
  }

  writeToBash(fd: number, index: number): void {
    this.writeDescriptionBash(fd, index);

    fs.writeSync(fd, 'rm ' + this.filenames.join(' ') + '\n');
  }

  writeToReadme(fd: number, index: number): void {
    this.writeDescriptionReadme(fd, index);

    const { spacer } = this;
    fs.writeSync(fd, '\n' + spacer + '```bash\n');
    fs.writeSync(fd, spacer + 'rm ' + this.filenames.join(' ') + '\n');
    fs.writeSync(fd, spacer + '```\n');
  }
}

/**
 * Step to replace the contents of an existing file.
 */
export class ReplaceFileStep extends CreateOrReplaceFileStep {
  constructor(description: string, filename: string, contents: string) {
    super(description, filename, contents, true);
  }
}
