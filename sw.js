const CACHE='kiosk-fixed-v1';
const ASSETS=['./','./index.html','./config.json','./background.jpg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))); self.clients.claim()});
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(url.pathname.endsWith('/config.json')){
    e.respondWith(fetch(e.request).then(r=>{const c=r.clone(); caches.open(CACHE).then(cc=>cc.put(e.request,c)); return r}).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(m=>m||fetch(e.request)));
});
