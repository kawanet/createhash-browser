#!/usr/bin/env bash -c make

all: dist test

dist: ../dist/createhash-browser.min.js

../dist/createhash-browser.min.js: ../build/bundle.js
	mkdir -p ../dist
	../node_modules/.bin/terser -c -m --ecma 5 -o $@ $<

../build/bundle.js: ../build/lib/createhash-browser.js
	../node_modules/.bin/browserify -s CH -o $@ $<
	perl -i -pe 's#^("use strict"|Object.defineProperty|exports.*= void 0)#// $$&#' $@

# ES5
test-es5: dist ../build/lib/createhash-browser.js
	cp ../package.json ../build
	perl -i -pe 's#require\("../"\)#require("../../browser/import")#' ../build/test/*.js
	../node_modules/.bin/browserify -o ../build/test.js ../build/test/*.js

../build/lib/createhash-browser.js: ../lib/*.ts ../test/*.ts
	../node_modules/.bin/tsc -p ../browser

# ES2018
test: dist ../lib/createhash-browser.js
	../node_modules/.bin/browserify -o ../build/test.js ../test/*.js

../lib/createhash-browser.js: ../lib/*.ts ../test/*.ts
	../node_modules/.bin/tsc -p ..

clean:
	/bin/rm -fr ../build ../dist/*.js ../lib/*.js ../test/*.js

.PHONY: all clean test
