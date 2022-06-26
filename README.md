# amvn

`amvn` (awesome maven) is a small wrapper around [Maven](https://maven.apache.org/) that adds change detection and automatic rebuild to your projects.

Use it to get faster feedback on changes in your project.


## How it works

`amvn` keeps the running application in sync with your sources

* keeping `target/classes` up to date with `src/main/resources`
* reloading the underlying `mvn` instance on changes in `src/main/java`

Use it with modern web development stacks such as [Dropwizard](https://dropwizard.github.io/dropwizard/) that bootstrap _fast_.


## Get it

Install the library via [npm](https://www.npmjs.com):

```
npm install amvn -g
```


## Usage

```
> amvn clean compile ... --watch
[AMVN] make maven awesome
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
