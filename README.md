# Dungeonz.io

## TODO

# Notes


### Next.js and local modules

Next.js will transpile modules thanks to the [`next-transpile-modules`](https://github.com/martpie/next-transpile-modules) package. Transpiled modules can be changed by editing the `transpileModules` option in `clients/[app name]/next.config.js`.

This setup works thanks to npm symlinking local dependencies in the root `node_modules` folder.

## Troubleshooting