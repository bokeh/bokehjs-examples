import { BashWriter, ReadmeWriter, Recipe, Writer } from '.';
import * as allRecipes from './recipes/typescript';

const writers: Writer[] = [new BashWriter(), new ReadmeWriter()];

for (const cls of Object.values(allRecipes)) {
  const recipe: Recipe = new (cls as any)();
  console.log(`Recipe ${recipe.type} ${recipe.framework} ${recipe.bundler}`);

  for (const writer of writers) {
    console.log(`  Writing to ${writer.filename(recipe)}`);
    writer.write(recipe);
  }
}
