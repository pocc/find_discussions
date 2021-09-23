# Run the main script
.PHONY: test build

build:
	tsc && cp src/popup.html build

test:
	python3 test/test_files.py
