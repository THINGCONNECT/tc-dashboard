all:
	npm install;
	heroku plugins:install heroku-builds;

deploy:
	gulp clean-build;
	fly staging;

deploy-heroku:
	gulp clean-build;
	(cd ./dist; heroku builds:create);

load:
	git submodule foreach --recursive git submodule update --init

heroku: heroku_app heroku_addons heroku_config

heroku_app:
	echo "What is the name of the heroku app?"; \
	read heroku_app; \
	heroku apps:create $$heroku_app; \
	echo "Need to create a repo? Go here: https://bitbucket.org/repo/create"

heroku_addons:
	heroku addons:add mongolab; \
	heroku addons:add logentries; \
	echo "Go here to create a deploy hook: https://halo.slack.com/services/new/heroku"

heroku_config:
	heroku config:add NODE_ENV=production

add-collab:
	echo "Who to add as collaborator?"; \
	read collab; \
	heroku sharing:add $$collab

define ROUTECODE
var mongoose = require('mongoose');
var router = require('express').Router({
  mergeParams: true
});

router.route('/')
.get(function(req, res) {
  res.ok(true);
})
.post(function(req, res) {
  res.ok(true);
})
.delete(function(req, res) {
  res.ok(true);
})
.put(function(req, res) {
  res.ok(true);
});

module.exports = router;
endef
ROUTE_PATH = server/lib/routes/api
export ROUTECODE
create_endpoint:
	@if [ -a $(ROUTE_PATH)/$(name)/root.js ]; 											\
	then 																														\
		echo "File \"$(ROUTE_PATH)/$(name)/root.js\" Already exists"; \
	else 																														\
		mkdir -p $(ROUTE_PATH)/$(name); 															\
		touch $(ROUTE_PATH)/$(name)/root.js; 													\
		echo "$$ROUTECODE" > $(ROUTE_PATH)/$(name)/root.js; 								\
	fi
