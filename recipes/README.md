Code to create recipes. Each recipe is defined in a TypeScript class and can be written to both a
README markdown file for humans to follow, and a `bash` script that can be used to automatically
create the recipe.

To recreate all recipes:
```bash
npm install
npm run build
npm run create
```

This will overwrite all existing recipes. If you are happy with the changes, `git commit` them.

To recreate one or more named recipes rather than all of them use:
```bash
npm run create -- VanillaWebpack VanillaRspack
```
