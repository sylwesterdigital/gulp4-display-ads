# gulp4-display-ads
Updated gulpfile.js for simple display-ads task management


Install gulp localy
```
$ npm install gulp --save-dev
```

Install gulp globally

```
$ npm install -g gulp
```

```
$ cd example
$ npm install

$ gulp --tasks

misiak@Aerosol:~/Desktop/Schawk/gulp4-display-ads/example$ gulp --tasks
[23:59:48] Tasks for ~/Desktop/Schawk/gulp4-display-ads/example/gulpfile.js
[23:59:48] ├── clean
[23:59:48] ├── styles
[23:59:48] ├── scripts
[23:59:48] ├── watch
[23:59:48] ├── bsync
[23:59:48] ├── imagemin
[23:59:48] ├── pack
[23:59:48] ├── copyfont
[23:59:48] ├── version
[23:59:48] ├─┬ build
[23:59:48] │ └─┬ <series>
[23:59:48] │   └─┬ <parallel>
[23:59:48] │     ├── version
[23:59:48] │     ├── imagemin
[23:59:48] │     └── copyfont
[23:59:48] ├─┬ work
[23:59:48] │ └─┬ <series>
[23:59:48] │   └─┬ <parallel>
[23:59:48] │     ├── bsync
[23:59:48] │     └── watch
[23:59:48] ├─┬ test
[23:59:48] │ └─┬ <series>
[23:59:48] │   └─┬ <parallel>
[23:59:48] │     └── bsyncTest
[23:59:48] ├── archive
[23:59:48] └─┬ default
[23:59:48]   └─┬ <series>
[23:59:48]     └─┬ <parallel>
[23:59:48]       ├── version
[23:59:48]       ├── imagemin
[23:59:48]       └── copyfont
```

Main tasks: work, clean, build, pack, archive

Workflow

```
$ gulp work
```
When happy with creative
```
$ gulp clean && gulp build && gulp pack
```


