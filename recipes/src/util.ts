import * as path from 'node:path';

export function fileExtension(filename: string): string {
  const extension = path.extname(filename);
  return extension === '.' ? '' : extension;
}

export function languageFromExtension(filename: string): string {
  const extension = fileExtension(filename);
  switch (extension) {
    case '.html':
    case '.json':
    case '.tsx': {
      return extension;
    }
    case '.ts':
    case '.vue': {
      return 'ts';
    }
    default: {
      return '';
    }
  }
}

export function removeBackticks(text: string): string {
  return text.replaceAll('`', '');
}
