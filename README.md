# 管理界面 以及 代理商界面
#### build and deploy
nvm use v16.19.0
yarn install
npm run build:prod
rsync dist/admin gitdeploy@ub22avm1:/home/httpd/mlg3/pub_html/ --delete
rsync dist/agent gitdeploy@ub22avm1:/home/httpd/mlg3/pub_html/ --delete
