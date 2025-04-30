Code to create recipes. Each recipe is defined in a TypeScript class and can be written to both a
`README.md` markdown file for humans to follow, and a `bash` script that can be used to
automatically create the recipe.

To recreate all recipes:
```bash
npm install
npm run build
npm run create
```

This will overwrite all existing recipes.

To recreate one or more named recipes rather than all of them use:
```bash
npm run create -- VanillaWebpack VanillaRspack
```

Recipes should be recreated whenever any of the code within this directory or its subdirectories
is changed.
