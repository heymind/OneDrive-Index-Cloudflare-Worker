<!--
 * @Author: your name
 * @Date: 2020-05-05 14:09:52
 * @LastEditTime: 2020-05-05 17:18:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \OneDrive-Index-Cloudflare-Worker\readme.md
 -->

中文 | [English](readme.en.md)
--- 
# OneDrive Index ( Cloudflare Worker ) 

## 🌈 演示地址

[storage.idx0.workers.dev](https://storage.idx0.workers.dev)

## 咋用

1. 去这里新建一个 APP https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade 
   `redirect_uri` 设置成 `https://heymind.github.io/tools/microsoft-graph-api-auth` 。

2. 在 `Certificates & secrets` 面板创建一个新的 `secret`。

3. 在 `API permissions` 面板， 添加以下权限 `offline_access, Files.Read, Files.Read.All`。（此权限可以在Microsoft Graph中找到）

4. 使用这个工具 [microsoft-graph-api-auth](https://heymind.github.io/tools/microsoft-graph-api-auth) 获取 `refresh_token` 参数。

5. 在 `Cloudflare Worker` 管理页面创建一个新的 `Worker` ,粘贴 `index.js` 中的代码并替换相关参数。

*6. 访问密码设置（默认关闭）：

```
const AUTH_ENABLED = true
const NAME = "admin"
const PASS = "password"
```

## 🔥 新特性 V1.1

### ⏬ 中转下载 
利用 `Cloudflare` 服务器中转 `OneDrive` 中文件的下载，以提高中国大陆的下载体验。已知问题，无法显示下载进度。

在配置中开启 `proxyDownload` 功能，在文件直链路径后面加 `?proxied` 即可开启，例如：
https://storage.idx0.workers.dev/Other/zero_file?proxied

( Cloudflare 的速度也挺随缘的... )

### ☁️ 缓存功能
利用 `Cloudflare CDN` 来缓存 `OneDrive` 中文件，目前有两种缓存模式：
- 整个文件缓存： 文件会先完整传输到 `Cloudflare` 的服务器后再返回给客户端。文件太大可能超过 `Cloudflare Worker` 限制的单次请求运行时间。
- chunk 缓存： 流式传输与缓存，无法正确显示 `Content-Length`。

在配置中开启 `cache` 功能，可以配置两种缓存模式的选择以及启用缓存的路径地址。

### ⏫ 小文件上传
可以利用这个工具直接上传小文件到 `OneDrive` 上 ( 小于 4MB ，OneDrive API 的限制，比这个大就得创建 upload session 反正很麻烦 )

在配置中开启 `upload` 功能，并设置一个密钥 `key` ( 防止游客上传文件 )。

比如： 
```
POST https://storage.idx0.workers.dev/Images/?upload=<filename>&key=<key>
```

**注意：开启该功能需要 `Files.ReadWrite` 权限**

### 🖼️ 缩略图
对于图片文件，可以直接获取不同尺寸的缩略图。
比如：https://storage.idx0.workers.dev/Images/public-md-image-20191010113652775.png?thumbnail=mediumSquare

![](https://storage.idx0.workers.dev/Images/public-md-image-20191010113652775.png?thumbnail=mediumSquare)

可用的取值参见：https://docs.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_list_thumbnails?view=odsp-graph-online#size-options


### 👍 没错，这就是个好用的博客图床！

同时开启**缓存功能**和**小文件上传功能**后，这就是个自建图床。
配合**缩略图**功能，亦可提升博客页面在不同场景下的加载体验。

例如 https://blog.idx0.dev 在首页文章列表配图使使用了 `large` 尺寸的缩略图，在侧栏文章列表中使用了 `smallSquare` 尺寸的缩略图。
