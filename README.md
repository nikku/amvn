# amvn

[![CI](https://github.com/nikku/amvn/actions/workflows/CI.yml/badge.svg)](https://github.com/nikku/amvn/actions/workflows/CI.yml)

`amvn` (awesome maven) wraps [Maven](https://maven.apache.org/) to add change detection and automatic rebuild.


## Installation

Install the library via [npm](https://www.npmjs.com):

```
npm install amvn -g
```


## Usage

```
> amvn clean compile ... --watch
[AMVN] make maven awesome
[AMVN] watching for src/main/resources changes...
[INFO] Scanning for projects...
[INFO]
[INFO] ------------------------------------------------------------------------
[INFO] Building wtf 1.0.0
[INFO] ------------------------------------------------------------------------
[INFO]
...
```

`amvn` accepts the additional `--watch` argument to copy resources / reload maven on source changes.

It does not actually care _what_ you execute via Maven. Make sure you have a lean and quick build process yourself.


## How it works

`amvn` keeps the running application in sync with your sources

* keeping `target/classes` up to date with `src/main/resources`
* reloading the underlying `mvn` instance on changes in `src/main/java`

Use it with modern web development stacks that bootstrap _fast_.


## License

MIT