# webpack-example

This depends on a development version of bokehjs:
```
$ git clone git@github.com:bokeh/bokeh.git
$ (cd bokeh/bokehjs; node make build)
```

To build this example issue:
```
git clone git@github.com:bokeh/bokehjs-examples.git
$ cd bokehjs-examples/webpack-example
$ npm pack ../../bokeh/bokehjs
$ npm install
$ npm run build
```
