FUNCTION := "scrapeSpotery"

auth:
	gcloud auth login
	gcloud config set project kreg-314404

deploy:
	gcloud functions deploy $(FUNCTION)

.PHONY: auth deploy
