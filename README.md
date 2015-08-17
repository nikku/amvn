# amvn

A tiny wrapper around [Maven](https://maven.apache.org/) that makes Java development less painful.

The `amvn` executable adds file watching and automatic rebuild to your projects. It is targeted at projects that foster creativity and require quick (visual) feedback.


## How it works

`amvn` provides you with faster feedback during development by

* keeping `target/classes` up to date with `src/main/resources`
* reloading the underlying `mvn` instance on changes in `src/main/java`

Use it with modern web development stacks such as [Dropwizard](https://dropwizard.github.io/dropwizard/) that bootstrap _fast_.


## Get it

Install the library via [npm](https://www.npmjs.com/):

```
npm i -g amvn
```


## Usage

```
> amvn clean compile ... --watch
[AMVN] watching for src/main/resources changes...
[AMVN] starting mvn...
[INFO] Scanning for projects...
[INFO]
[INFO] ------------------------------------------------------------------------
[INFO] Building wtf 1.0.0
[INFO] ------------------------------------------------------------------------
[INFO]
...
```

`amvn` accepts the additional arguments `--watch` (resource watching) and `--reload` (source watching / reloading).

The executable does not actually care _what_ you execute via Maven. Make sure you have a lean and quick build process yourself.


## License

MIT
