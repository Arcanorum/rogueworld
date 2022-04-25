# Dungeonz.io

## TODO

# Map service
*Need Tiled (version?) installed as it needs some scripts (tmxrasterizer)*

# Notes
Caddy as an API gateway in live environment

### Next.js and shared local modules

Next.js will transpile modules thanks to the [`next-transpile-modules`](https://github.com/martpie/next-transpile-modules) package. Transpiled modules can be changed by editing the `transpileModules` option in `clients/[app name]/next.config.js`.

This setup works thanks to npm symlinking local dependencies in the root `node_modules` folder.

# Troubleshooting

## Client or service not automatically restarting/rebuilding after saving changes

This can happen for several reasons. Most common of which is running out of available watchers on your OS by having multiple processes running in development mode at once, such as running the game service, game client, and others.

Each development process uses a large amount of watchers to track the files and trigger a rebuild/restart when they are saved, so increasing the max amount of these watchers may fix this. Adding more watchers does consume a very small amount of memory, but it isn't noticable unless you go crazy with it.

`echo fs.inotify.max_user_watches=524288`

https://stackoverflow.com/questions/26708205/webpack-watch-isnt-compiling-changed-files

test 8
