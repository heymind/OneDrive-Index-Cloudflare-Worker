<!--
 * @Author: your name
 * @Date: 2020-05-05 14:09:52
 * @LastEditTime: 2020-05-05 17:19:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \OneDrive-Index-Cloudflare-Worker\readme.md
 -->
 
[中文](readme.md) | English
---
# OneDrive Index ( Cloudflare Worker )

## 🌈 Demo  

[storage.idx0.workers.dev](https://storage.idx0.workers.dev)

## How to use 

1. Creat a new APP here https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade and set
   `redirect_uri` as `https://heymind.github.io/tools/microsoft-graph-api-auth` 。

2. Open `Certificates & secrets` and create a new `secret`。

3. Add permissions `offline_access, Files.Read, Files.Read.All` at `API permissions`

4. Get the value of parameter `refresh_token` using [microsoft-graph-api-auth](https://heymind.github.io/tools/microsoft-graph-api-auth)

5. Create a new worker on `Cloudflare Worker` and paste the codes in `index.js` and set paramters as you wish.

*6. Authentication settings (disabled by default):

```
const AUTH_ENABLED = true
const NAME = "admin"
const PASS = "password"
```

## 🔥 New Features V1.1 

### ⏬ Download Proxy  
Using `Cloudflare` servers as download proxies, in order to get higher speeds in mainland China.  
 >Known issue: download progress is invisible

Enable `proxyDownload` in configuration and then add `?proxied` to a typical file url to enable this feature, i.e. https://storage.idx0.workers.dev/Other/zero_file?proxied

(But speed from cloudflare servers is also unpredictable)

### ☁️ Caching Support 
To cache `OneDrive` files using `Cloudflare CDN`. There are two caching methods:
- Full: files will be firstly transfered to `Cloudflare` servers and then to clients but large files may encoutner timeout error due to `Cloudflare Worker` executing constraints.
- Chunk: streaming and caching but `Content-Length` can't be correctly returned


Enabling `cache` feature in configuration, caching method and the path for caching can be also configured

### ⏫ Tiny File Uploading 
There's a tool to directly upload tiny files(< 4MB, constrained by OneDrive API, which brings troubles to create upload sessions with lagger ones ) to `OneDrive`   

Add `upload` in configuration and set a key `key` to avoid anonymous file uploading  

As:
```
POST https://storage.idx0.workers.dev/Images/?upload=<filename>&key=<key>
```

**Attention: this features requires `Files.ReadWrite` permitted** 

### 🖼️ Thumbnails   
Thumbnails of image files can be directly got, like:  

https://storage.idx0.workers.dev/Images/public-md-image-20191010113652775.png?thumbnail=mediumSquare

![](https://storage.idx0.workers.dev/Images/public-md-image-20191010113652775.png?thumbnail=mediumSquare)

See eligible values here:

https://docs.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_list_thumbnails?view=odsp-graph-online#size-options


### 👍 Yeah, a great blog image hosting service! 
  
It would be a great self-hosted image hosting service with both `caching` and `tiny file uploading` enabled.
  
Loading speed of blog images will also be improved with the help of `Thumbnails`

For example, https://blog.idx0.dev is using `large` thumbnails in frontpage images and `smallSquare` ones in sidebar lists.
