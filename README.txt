the great: website files

index.html          the page content
css/styles.css      the design (colours, layout, animations)
js/config.js        settings: cap price, brand colour, sign-up form address
js/script.js        the page behaviour (menus, filters, cart, sign-up box)
assets/images/      the cap photos (caps/) and the logo

To put it online, upload this whole folder to any static web host (Netlify, Cloudflare Pages,
GitHub Pages or your own hosting) and keep the folders as they are.
To collect sign-ups, paste a form address into signupEndpoint in js/config.js.

Tab icon and sharing preview
assets/favicon.png, assets/apple-touch-icon.png and assets/share-preview.png are used in the page head.
After the site is live, edit the og:image line in index.html to the full web address of share-preview.png
(for example https://yourname.github.io/the-great/assets/share-preview.png) so WhatsApp and Instagram can show the preview.
