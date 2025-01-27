# BokehJS Examples

Examples of integrating bokehjs with other libraries or tooling (e.g. webpack).

Initially contains TypeScripts examples, with others to follow later.

Cannot be built using a release NPM package of BokehJS and changes are required which will not be
released until BokehJS 4.0. In the meantime simple examples work using a particular Bokeh branch
which can be checked out and built in a temporary directory and the resultant NPM package copied
across to the root directory of this repository as follows. Note you will need `git` and `node`
installed.

```bash
cd <directory of choice>
git clone -b ianthomas23/bokehjs_examples_temp --single-branch --depth 1 git@github.com:bokeh/bokeh.git
cd bokeh/bokehjs
node make build
npm pack
```

This will produce the file `bokeh-bokehjs-3.7.0-dev.5.tgz` which should be copied to the root
directory of the bokehjs-examples repository.
