FUNCTION := "scrapeSpotery"

auth:
	gcloud auth login
	gcloud config set project kreg-314404

deploy:
	gcloud functions deploy $(FUNCTION)

vr:
	open /Users/zchauvin/kreg/coverage-ts/index.html

.PHONY: auth deploy
