.PHONY: install test build lint contracts labels issues royalty

install:
	npm install

build:
	npm run build

lint:
	npm run lint

test:
	npm run test
	npm run contract:test

contracts:
	npm run contract:compile

labels:
	./scripts/bootstrap-labels.sh smynd-science/smynd-protocol

issues:
	./scripts/bootstrap-issues.sh smynd-science/smynd-protocol

royalty:
	npm run royalty:ledger -- examples/sample-dataset-manifest.json examples/sample-usage-event.json examples/sample-contribution-records.json
