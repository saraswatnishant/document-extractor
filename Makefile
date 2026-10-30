PROJECTS := backend frontend

.PHONY: $(PROJECTS) backend-test frontend-test pre-commit-install

$(PROJECTS):
	$(MAKE) -C $@ dev

backend-test frontend-test: %-test:
	$(MAKE) -C $* test

pre-commit-install:
	brew install pre-commit
	pre-commit install
