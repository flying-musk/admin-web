# 管理界面 以及 代理商界面

### NODE 版本

```
nvm use v18.14.2
```
### 安裝套件

```
npm i
```

### 運行專案

```
npm run dev (測試 - 管理界面)
```
```
npm run dev:agent (測試 - 經銷商界面)
```
```
npm run prod (正式 - 管理界面)
```
```
npm run prod:agent (正式 - 經銷商界面)
```

## build and deploy

##### 一次打包經銷商界面、管理界面
```
npm run build:dev (測試)
```

```
npm run build:prod (正式)
```

```
rsync dist/admin gitdeploy@ub22avm1:/home/httpd/mlg3/pub_html/ --delete
rsync dist/agent gitdeploy@ub22avm1:/home/httpd/mlg3/pub_html/ --delete
```