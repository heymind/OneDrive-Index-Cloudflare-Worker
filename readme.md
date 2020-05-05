<!--
 * @Author: your name
 * @Date: 2020-05-05 14:09:52
 * @LastEditTime: 2020-05-05 17:07:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \OneDrive-Index-Cloudflare-Worker\readme.md
 -->
# OneDrive Index ( Cloudflare Worker )

## 🌈 Demo / 演示地址 

[storage.idx0.workers.dev](https://storage.idx0.workers.dev)

## How to use / 咋用

1. 去这里新建一个 APP https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade 
   `redirect_uri` 设置成 `https://heymind.github.io/tools/microsoft-graph-api-auth` 。  
   >Creat a new APP here https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade and set
   `redirect_uri` as `https://heymind.github.io/tools/microsoft-graph-api-auth` 。

2. 在 `Certificates & secrets` 面板创建一个新的 `secret`。    
   >Open `Certificates & secrets` and create a new `secret`。

3. 在 `API permissions` 面板， 添加以下权限 `offline_access, Files.Read, Files.Read.All`。  
   >Add permissions `offline_access, Files.Read, Files.Read.All` at `API permissions`

4. 使用这个工具 [microsoft-graph-api-auth](https://heymind.github.io/tools/microsoft-graph-api-auth) 获取 `refresh_token` 参数。  
   >Get the value of parameter `refresh_token` using [microsoft-graph-api-auth](https://heymind.github.io/tools/microsoft-graph-api-auth)

5. 在 `Cloudflare Worker` 管理页面创建一个新的 `Worker` ,粘贴 `index.js` 中的代码并替换相关参数。  
   >Create a new worker on `Cloudflare Worker` and paste the codes in `index.js` and set paramters as you wish.

*6. 访问密码设置（默认关闭）：
   >Authentication settings (disabled by default):

```
const AUTH_ENABLED = true
const NAME = "admin"
const PASS = "password"
```

## 🔥 New Features V1.1 / 新特性 V1.1

### ⏬ Download Proxy / 中转下载 
利用 `Cloudflare` 服务器中转 `OneDrive` 中文件的下载，以提高中国大陆的下载体验。已知问题，无法显示下载进度。
 > Using `Cloudflare` servers as download proxies, in order to get higher speeds in mainland China.  
 >Known issue: download progress is invisible

在配置中开启 `proxyDownload` 功能，在文件直链路径后面加 `?proxied` 即可开启，例如：https://storage.idx0.workers.dev/Other/zero_file?proxied
 >Enable `proxyDownload` in configuration and then add `?proxied` to a typical file url to enable this feature, i.e. https://storage.idx0.workers.dev/Other/zero_file?proxied

( Cloudflare 的速度也挺随缘的... )
 > (But speed from cloudflare servers is also unpredictable)

### ☁️ Caching Support / 缓存功能
利用 `Cloudflare CDN` 来缓存 `OneDrive` 中文件，目前有两种缓存模式：
 > To cache `OneDrive` files using `Cloudflare CDN`. There are two caching methods:
- 整个文件缓存： 文件会先完整传输到 `Cloudflare` 的服务器后再返回给客户端。文件太大可能超过 `Cloudflare Worker` 限制的单次请求运行时间。
 > - Full: files will be firstly transfered to `Cloudflare` servers and then to clients but large files may encoutner timeout error due to `Cloudflare Worker` executing constraints.
- chunk 缓存： 流式传输与缓存，无法正确显示 `Content-Length`。
 > - Chunk: streaming and caching but `Content-Length` can't be correctly returned

在配置中开启 `cache` 功能，可以配置两种缓存模式的选择以及启用缓存的路径地址。

### ⏫ Tiny File Uploading / 小文件上传
可以利用这个工具直接上传小文件到 `OneDrive` 上 ( 小于 4MB ，OneDrive API 的限制，比这个大就得创建 upload session 反正很麻烦 )
> There's a tool to directly upload tiny files(< 4MB, constrained by OneDrive API, which brings troubles to create upload sessions with lagger ones ) to `OneDrive`   

在配置中开启 `upload` 功能，并设置一个密钥 `key` ( 防止游客上传文件 )。  

> add `upload` in configuration and set a key `key` to avoid anonymous file uploading  

比如： 
 > As:
```
POST https://storage.idx0.workers.dev/Images/?upload=<filename>&key=<key>
```

**注意：开启该功能需要 `Files.ReadWrite` 权限**
 > Attention: this features requires `Files.ReadWrite` permitted 

### 🖼️ Thumbnails / 缩略图
对于图片文件，可以直接获取不同尺寸的缩略图。比如：  
 > Thumbnails of image files can be directly got, like:  

https://storage.idx0.workers.dev/Images/public-md-image-20191010113652775.png?thumbnail=mediumSquare

![](https://storage.idx0.workers.dev/Images/public-md-image-20191010113652775.png?thumbnail=mediumSquare)

可用的取值参见：  
 >See eligible values here:

https://docs.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_list_thumbnails?view=odsp-graph-online#size-options


### 👍 Yeah, a great blog image hosting service! / 没错，这就是个好用的博客图床！

同时开启**缓存功能**和**小文件上传功能**后，这就是个自建图床。  
 > It would be a great self-hosted image hosting service with both `caching` and `tiny file uploading` enabled.

配合**缩略图**功能，亦可提升博客页面在不同场景下的加载体验。  
 > Loading speed of blog images will also be improved with the help of `Thumbnails`

例如 https://blog.idx0.dev 在首页文章列表配图使使用了 `large` 尺寸的缩略图，在侧栏文章列表中使用了 `smallSquare` 尺寸的缩略图。
 > For example, https://blog.idx0.dev is using `large` thumbnails in frontpage images and `smallSquare` ones in sidebar lists.
