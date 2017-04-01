bin := $(shell npm bin)
babel := $(bin)/babel
browserify := $(bin)/browserify


.PHONY: compile
compile:
	$(babel) src --source-map inline --out-dir lib
	$(browserify) lib/index.js --source-map inline --outfile www/app.js