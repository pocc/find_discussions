# Run the main script
.PHONY: test build

build:
	tsc && cp src/*.html build
# Delete export lines that ES5 chrome can't understand
	sed -i '/export {}/d' ./build/*.js

test:
	python3 test/test_files.py
