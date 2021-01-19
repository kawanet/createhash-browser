#!/usr/bin/env bash -c make

all: ../dist/createhash-browser.min.js ../build/test.js

../dist/createhash-browser.min.js: ../build/bundle.js
	mkdir -p ../dist
	../node_modules/.bin/terser -c -m --ecma 5 -o $@ $<

../build/bundle.js: ../build/lib/createhash-browser.js
	../node_modules/.bin/browserify -s CH -o $@ $<
	perl -i -pe 's#^("use strict"|Object.defineProperty|exports.*= void 0)#// $$&#' $@

../build/lib/createhash-browser.js: ../lib/*.ts ../test/*.ts
	../node_modules/.bin/tsc -p ../browser

../build/test.js: ../build/lib/createhash-browser.js
	../node_modules/.bin/browserify -o $@ ../build/test/*.js

clean:
	/bin/rm -fr ../build dist/*.js

test: all
	open ../browser/test.html

.PHONY: all clean test
