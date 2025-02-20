import { BashWriter, ReadmeWriter, Recipe, Writer } from '.';
import * as allRecipes from './recipes/typescript';

const writers: Writer[] = [new BashWriter(), new ReadmeWriter()];

let recipeNames = Object.keys(allRecipes);
if (process.argv.length > 2) {
  recipeNames = process.argv.slice(2).map((arg) => arg + 'Recipe');

  const unknownNames = recipeNames.filter(name => !(name in allRecipes));
  if (unknownNames.length > 0) {
    console.error("Unknown recipe name(s):", unknownNames.join(', '));
    process.exit(1)
  }
}

console.log("Creating recipes for", recipeNames);

for (const recipeName of recipeNames) {
  const cls = allRecipes[recipeName];
  const recipe: Recipe = new (cls as any)();
  console.log(`Recipe ${recipe.type} ${recipe.framework} ${recipe.bundler}`);

  for (const writer of writers) {
    console.log(`  Writing to ${writer.filename(recipe)}`);
    writer.write(recipe);
  }
}
