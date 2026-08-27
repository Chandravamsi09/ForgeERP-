.PHONY: all install build test run clean

all: install build test

install:
	npm install

build:
	npm --prefix shared run build
	npm --prefix backend run build
	npm --prefix frontend run build

test:
	npm --prefix backend test

run:
	npm start

clean:
	rm -rf dist build coverage
