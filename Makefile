# Run the main script
.PHONY: test build clean

clean:
	rm -rf build

build: clean
	tsc && cp src/*.html build
# Delete export lines that ES5 chrome can't understand
	sed -i '/export {}/d' ./build/*.js

test:
	python3 test/test_files.py
