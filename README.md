# Demos

Demos 是一个风格简洁的代码编辑器，用来写demo，小案例等。

Demos 基于 Koa 与 MongoDB 开发


## Clone codes and run

```bash
# clone from git
$ git clone git@github.com:berwin/demos.git

$ cd demos

# install dependencies
$ npm install

# copy the default configuration file
$ cp config/default.js config/index.js

# modify configuration file
$ vim config/index.js

# run
node app.js
```

## deploy

```bash
# Start
pm2 start process.json

# Reload
pm2 reload process.json

# Delete
pm2 delete process.json
```