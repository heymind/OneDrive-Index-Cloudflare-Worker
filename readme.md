# OneDrive Index ( Cloudflare Worker )

## 演示地址

[storage.idx0.workers.dev](https://storage.idx0.workers.dev)

## 咋用

1. 去这里新建一个 APP https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade 
   `redirect_uri` 设置成 `https://heymind.github.io/tools/microsoft-graph-api-auth` 。

2. 在 `Certificates & secrets` 面板创建一个新的 `secret`。

3. 在 `API permissions` 面板， 添加以下权限 `offline_access, Files.Read, Files.Read.All`。

4. 使用这个工具 [microsoft-graph-api-auth](https://heymind.github.io/tools/microsoft-graph-api-auth) 获取 `refresh_token` 参数。

5. 在 `Cloudflare Worker` 管理页面创建一个新的 `Worker` ,粘贴 `index.js` 中的代码并替换相关参数。