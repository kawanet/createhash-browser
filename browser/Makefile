#!/usr/bin/env bash -c make

all: ../dist/createhash-browser.min.js test-es2018

all-es5: ../dist/createhash-browser.min.js test-es5

../dist/createhash-browser.min.js: ../build/bundle.js
	mkdir -p ../dist
	../node_modules/.bin/terser -c -m --ecma 5 -o $@ $<

../build/bundle.js: ../build/lib/createhash-browser.js
	../node_modules/.bin/browserify -s CH -o $@ $<
	perl -i -pe 's#^("use strict"|Object.defineProperty|exports.*= void 0)#// $$&#' $@

# ES5
../build/lib/createhash-browser.js: ../lib/*.ts ../test/*.ts
	../node_modules/.bin/tsc -p ../browser

# ES2018
../lib/createhash-browser.js: ../lib/*.ts ../test/*.ts
	../node_modules/.bin/tsc -p ..

# ES5
test-es5: ../build/lib/createhash-browser.js
	cp ../package.json ../build
	../node_modules/.bin/browserify -o ../build/test.js ../build/test/*.js

# ES2018
test-es2018: ../lib/createhash-browser.js
	../node_modules/.bin/browserify -o ../build/test.js ../test/*.js

clean:
	/bin/rm -fr ../build ../dist/*.js ../lib/*.js ../test/*.js

test: all
	open ../browser/test.html

.PHONY: all clean test
