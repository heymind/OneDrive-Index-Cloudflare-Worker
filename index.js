
const config = {
    /**
     * You can use this tool http://heymind.github.io/tools/microsoft-graph-api-auth
     * to get following params: client_id, client_secret, refresh_token & redirect_uri.
     */
    "refresh_token": "",
    "client_id": "",
    "client_secret": "",
    "redirect_uri": "",
    /**
     * The base path for indexing, all files and subfolders are public by this tool. For example `/Share`.
     */
    "base": ""
};

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

/**
 * Current access token 
 */
let _accessToken = null;

/**
 * Get access token for microsoft graph API endpoints. Refresh token if needed.
 */
async function getAccessToken() {
    if (_accessToken) return _accessToken;
    resp = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
        method: "POST",
        body: `client_id=${config.client_id}&redirect_uri=${config.redirect_uri}&client_secret=${config.client_secret}
    &refresh_token=${config.refresh_token}&grant_type=refresh_token`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
    if (resp.ok) {
        console.log("access_token refresh success.")
        const data = await resp.json()
        _accessToken = data.access_token
        return _accessToken;
    } else throw `getAccessToken error ${ JSON.stringify(await resp.text())}`
}




/**
 * mimetype to Material Icon name
 * @param {string} ype 
 */
function mime2icon(type) {
    if (type.startsWith("image")) return "image";
    if (type.startsWith("image")) return "video_label";
    if (type.startsWith("image")) return "audiotrack";
    return "description";
}

async function handleRequest(request) {
    const base = config.base;
    const accessToken = await getAccessToken();

    const {
        pathname
    } = new URL(request.url);

    const url = `https://graph.microsoft.com/v1.0/me/drive/root:${base+(pathname == "/" ? "" :pathname) }?select=name,eTag,size,id,folder,file,%40microsoft.graph.downloadUrl&expand=children(select%3Dname,eTag,size,id,folder,file)`;
    console.log(url)
    const resp = await fetch(url, {
        headers: {
            "Authorization": `bearer ${accessToken}`
        }
    });
    let error = null;
    if (resp.ok) {
        const data = await resp.json();
        if ("file" in data) {
            return new Response(null, {
                status: 302,
                headers: {
                    "Location": data["@microsoft.graph.downloadUrl"].slice(6)
                }
            });

        } else if ("folder" in data) {
            if (!request.url.endsWith("/")) return Response.redirect(request.url + "/", 302)
            return new Response(renderFolderIndex(data.children, pathname == "/"), {
                headers: {
                    'content-type': 'text/html'
                }
            });
        } else {
            error = `unknown data ${JSON.stringify(data)}`;
        }
    } else {
        error = `ok == false ${JSON.stringify(await resp.json())}`;
    }

    if (error) {
        return new Response(error, {
            headers: {
                'content-type': 'text/html'
            }
        });
    }
}
/**
 * Render Folder Index
 * @param {*} items 
 * @param {*} isIndex don't show ".." on index page.
 */
function renderFolderIndex(items, isIndex) {
    const nav = `<nav><a class="brand">OneDrive Index</a></nav>`;
    const el = (tag, attrs, content) => `<${tag} ${attrs.join(" ")}>${content}</${tag}>`;
    const div = (className, content) => el("div", [`class=${className}`], content);
    const item = (icon, filename) => el("a", [`href="${filename}"`, `class="item"`], el("i", [`class="material-icons"`], icon) + filename)

    return renderHTML(nav + div("container", div("items",
        (!isIndex ? item("folder", "..") : "") +
        items.map((i) => {
            if ("folder" in i) {
                return item("folder", i.name)
            } else if ("file" in i) {
                return item(mime2icon(i.file.mimeType), i.name)
            } else console.log(`unknown item type ${i}`)
        }).join("")
    )));
}



function renderHTML(body) {
    return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="x-ua-compatible" content="ie=edge, chrome=1" />
      <title>OneDrive Index</title>
      <link href='https://fonts.loli.net/icon?family=Material+Icons' rel='stylesheet'>
      <link href='https://cdn.jsdelivr.net/gh/heymind/OneDrive-Index-Cloudflare-Worker/themes/material.css' rel='stylesheet'>
    </head>
    <body>
        ${body}
      <div style="flex-grow:1"></div>
      <footer><p>Powered by <a href="https://github.com/heymind/OneDrive-Index-Cloudflare-Worker">OneDrive-Index-CF</a>, hosted on <a href="https://www.cloudflare.com/products/cloudflare-workers/">Cloudflare Workers</a>.</p></footer>
    </body>
  </html>`
}