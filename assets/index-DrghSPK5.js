var U=i=>{throw TypeError(i)};var C=(i,e,t)=>e.has(i)||U("Cannot "+t);var c=(i,e,t)=>(C(i,e,"read from private field"),t?t.call(i):e.get(i)),_=(i,e,t)=>e.has(i)?U("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(i):e.set(i,t),B=(i,e,t,a)=>(C(i,e,"write to private field"),a?a.call(i,t):e.set(i,t),t),T=(i,e,t)=>(C(i,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function t(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(n){if(n.ep)return;n.ep=!0;const s=t(n);fetch(n.href,s)}})();class te{getTemplate(){return`
      <section class="home-container">
        <h1 class="visually-hidden">JejakCerita - Beranda</h1>
        
        <div class="stories-panel glass-panel">
          <div class="panel-header">
            <h2>Recent Stories</h2>
            <div style="display: flex; gap: 8px; align-items: center;">
              <button id="install-btn" class="btn-primary" style="display: none; width: auto; padding: 8px 16px; font-size: 0.85rem;" aria-label="Pasang Aplikasi JejakCerita">Pasang Aplikasi</button>
              <a href="#/add" class="btn-primary" style="text-align: center; display: inline-block; width: auto; padding: 8px 16px; font-size: 0.85rem; text-decoration: none;">+ Tambah Cerita</a>
            </div>
          </div>

          <!-- Notification Control Panel -->
          <div class="notification-panel" style="background: rgba(15, 23, 42, 0.4); border: 1px solid var(--glass-border); padding: 12px; margin-bottom: 15px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; gap: 10px;">
            <div style="flex: 1;">
              <h3 style="font-size: 0.95rem; margin-bottom: 2px;">Notifikasi Cerita Baru</h3>
              <p style="font-size: 0.75rem; color: var(--text-muted); margin: 0;">Dapatkan info cerita baru secara realtime.</p>
            </div>
            <div>
              <button id="notif-toggle-btn" class="btn-secondary" style="width: auto; padding: 6px 12px; font-size: 0.8rem; border-color: var(--primary); color: var(--primary);" aria-live="polite">
                Memeriksa...
              </button>
            </div>
          </div>

          <div id="stories-list" class="stories-list">
            <p>Memuat cerita...</p>
          </div>
        </div>

        <div class="map-panel glass-panel">
          <div id="stories-map" class="map-container" aria-label="Peta Lokasi Cerita" role="application"></div>
        </div>
      </section>
    `}renderStories(e){const t=document.getElementById("stories-list");if(t.innerHTML="",e.length===0){t.innerHTML="<p>Tidak ada cerita ditemukan.</p>";return}e.forEach(a=>{const n=new Date(a.createdAt).toLocaleDateString("id-ID",{year:"numeric",month:"long",day:"numeric"}),s=document.createElement("div");s.classList.add("story-card"),s.setAttribute("data-id",a.id),s.setAttribute("tabindex","0"),s.setAttribute("aria-label",`Cerita oleh ${a.name}, deskripsi: ${a.description.substring(0,100)}`),s.innerHTML=`
        <img src="${a.photoUrl}" alt="Foto cerita oleh ${a.name}" class="story-img" loading="lazy">
        <div class="story-info" style="flex:1;">
          <h3>${a.name}</h3>
          <p class="story-desc">${a.description}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
            <span class="story-date">${n}</span>
            <a href="#/stories/${a.id}" class="story-detail-link" style="color: #818cf8; text-decoration: none; font-size: 0.85rem; font-weight: 600;" aria-label="Lihat detail cerita oleh ${a.name}">Lihat Detail →</a>
          </div>
        </div>
      `,t.appendChild(s)}),t.querySelectorAll(".story-detail-link").forEach(a=>{a.addEventListener("click",n=>{n.stopPropagation()})})}showError(e){const t=document.getElementById("stories-list");t&&(t.innerHTML=`<p class="error-msg" style="display:block;">${e}</p>`)}}const m={BASE_URL:"https://story-api.dicoding.dev/v1",VAPID_PUBLIC_KEY:"BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk"},f={REGISTER:`${m.BASE_URL}/register`,LOGIN:`${m.BASE_URL}/login`,GET_ALL_STORIES:(i=1)=>`${m.BASE_URL}/stories?location=${i}`,GET_STORY:i=>`${m.BASE_URL}/stories/${i}`,ADD_STORY:`${m.BASE_URL}/stories`,SUBSCRIBE:`${m.BASE_URL}/notifications/subscribe`,UNSUBSCRIBE:`${m.BASE_URL}/notifications/subscribe`};class I{static _getAuthToken(){return localStorage.getItem("authToken")}static async getAllStories(e=1){return(await fetch(f.GET_ALL_STORIES(e),{headers:{Authorization:`Bearer ${this._getAuthToken()}`}})).json()}static async getStoryDetail(e){return(await fetch(f.GET_STORY(e),{headers:{Authorization:`Bearer ${this._getAuthToken()}`}})).json()}static async addStory(e){return(await fetch(f.ADD_STORY,{method:"POST",headers:{Authorization:`Bearer ${this._getAuthToken()}`},body:e})).json()}static async subscribeNotification(e){return(await fetch(f.SUBSCRIBE,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${this._getAuthToken()}`},body:JSON.stringify(e)})).json()}static async unsubscribeNotification(){return(await fetch(f.UNSUBSCRIBE,{method:"DELETE",headers:{Authorization:`Bearer ${this._getAuthToken()}`}})).json()}}function ie(i){const e="=".repeat((4-i.length%4)%4),t=(i+e).replace(/-/g,"+").replace(/_/g,"/"),a=window.atob(t),n=new Uint8Array(a.length);for(let s=0;s<a.length;++s)n[s]=a.charCodeAt(s);return n}const k={async getSubscription(){return!("serviceWorker"in navigator)||!("PushManager"in window)?null:(await navigator.serviceWorker.ready).pushManager.getSubscription()},async isEnabled(){return!!await this.getSubscription()},async enableNotification(){if(!("serviceWorker"in navigator)||!("PushManager"in window))throw new Error("Push notification is not supported in this browser.");if(await Notification.requestPermission()!=="granted")throw new Error("Notification permission denied.");const e=await navigator.serviceWorker.ready,t={userVisibleOnly:!0,applicationServerKey:ie(m.VAPID_PUBLIC_KEY)},a=await e.pushManager.subscribe(t),n=await I.subscribeNotification(a);if(n.error)throw await a.unsubscribe(),new Error(n.message||"Failed to register subscription on server.");return a},async disableNotification(){const i=await this.getSubscription();if(i){await i.unsubscribe();try{await I.unsubscribeNotification()}catch(e){console.error("Failed to notify backend about unsubscribe:",e)}}}},O=(i,e)=>e.some(t=>i instanceof t);let F,z;function ae(){return F||(F=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function ne(){return z||(z=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const $=new WeakMap,D=new WeakMap,A=new WeakMap;function se(i){const e=new Promise((t,a)=>{const n=()=>{i.removeEventListener("success",s),i.removeEventListener("error",r)},s=()=>{t(b(i.result)),n()},r=()=>{a(i.error),n()};i.addEventListener("success",s),i.addEventListener("error",r)});return A.set(e,i),e}function re(i){if($.has(i))return;const e=new Promise((t,a)=>{const n=()=>{i.removeEventListener("complete",s),i.removeEventListener("error",r),i.removeEventListener("abort",r)},s=()=>{t(),n()},r=()=>{a(i.error||new DOMException("AbortError","AbortError")),n()};i.addEventListener("complete",s),i.addEventListener("error",r),i.addEventListener("abort",r)});$.set(i,e)}let R={get(i,e,t){if(i instanceof IDBTransaction){if(e==="done")return $.get(i);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return b(i[e])},set(i,e,t){return i[e]=t,!0},has(i,e){return i instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in i}};function q(i){R=i(R)}function oe(i){return ne().includes(i)?function(...e){return i.apply(N(this),e),b(this.request)}:function(...e){return b(i.apply(N(this),e))}}function le(i){return typeof i=="function"?oe(i):(i instanceof IDBTransaction&&re(i),O(i,ae())?new Proxy(i,R):i)}function b(i){if(i instanceof IDBRequest)return se(i);if(D.has(i))return D.get(i);const e=le(i);return e!==i&&(D.set(i,e),A.set(e,i)),e}const N=i=>A.get(i);function ce(i,e,{blocked:t,upgrade:a,blocking:n,terminated:s}={}){const r=indexedDB.open(i,e),l=b(r);return a&&r.addEventListener("upgradeneeded",o=>{a(b(r.result),o.oldVersion,o.newVersion,b(r.transaction),o)}),t&&r.addEventListener("blocked",o=>t(o.oldVersion,o.newVersion,o)),l.then(o=>{s&&o.addEventListener("close",()=>s()),n&&o.addEventListener("versionchange",g=>n(g.oldVersion,g.newVersion,g))}).catch(()=>{}),l}const de=["get","getKey","getAll","getAllKeys","count"],ue=["put","add","delete","clear"],P=new Map;function G(i,e){if(!(i instanceof IDBDatabase&&!(e in i)&&typeof e=="string"))return;if(P.get(e))return P.get(e);const t=e.replace(/FromIndex$/,""),a=e!==t,n=ue.includes(t);if(!(t in(a?IDBIndex:IDBObjectStore).prototype)||!(n||de.includes(t)))return;const s=async function(r,...l){const o=this.transaction(r,n?"readwrite":"readonly");let g=o.store;return a&&(g=g.index(l.shift())),(await Promise.all([g[t](...l),n&&o.done]))[0]};return P.set(e,s),s}q(i=>({...i,get:(e,t,a)=>G(e,t)||i.get(e,t,a),has:(e,t)=>!!G(e,t)||i.has(e,t)}));const pe=["continue","continuePrimaryKey","advance"],V={},j=new WeakMap,K=new WeakMap,me={get(i,e){if(!pe.includes(e))return i[e];let t=V[e];return t||(t=V[e]=function(...a){j.set(this,K.get(this)[e](...a))}),t}};async function*he(...i){let e=this;if(e instanceof IDBCursor||(e=await e.openCursor(...i)),!e)return;e=e;const t=new Proxy(e,me);for(K.set(t,e),A.set(t,N(e));e;)yield t,e=await(j.get(t)||e.continue()),j.delete(t)}function H(i,e){return e===Symbol.asyncIterator&&O(i,[IDBIndex,IDBObjectStore,IDBCursor])||e==="iterate"&&O(i,[IDBIndex,IDBObjectStore])}q(i=>({...i,get(e,t,a){return H(e,t)?he:i.get(e,t,a)},has(e,t){return H(e,t)||i.has(e,t)}}));const ge="story-app-db",ye=1,E="saved-stories",x="offline-stories",y=ce(ge,ye,{upgrade(i){i.objectStoreNames.contains(E)||i.createObjectStore(E,{keyPath:"id"}),i.objectStoreNames.contains(x)||i.createObjectStore(x,{keyPath:"id",autoIncrement:!0})}}),w={async saveStory(i){return(await y).put(E,i)},async getSavedStories(){return(await y).getAll(E)},async getSavedStory(i){return(await y).get(E,i)},async deleteSavedStory(i){return(await y).delete(E,i)},async saveOfflineStory(i){return(await y).add(x,i)},async getOfflineStories(){return(await y).getAll(x)},async deleteOfflineStory(i){return(await y).delete(x,i)}},u={async registerSync(){if("serviceWorker"in navigator&&"SyncManager"in window)try{await(await navigator.serviceWorker.ready).sync.register("sync-offline-stories"),console.log('Background Sync tag "sync-offline-stories" registered')}catch(i){console.warn("Background Sync registration failed. Syncing directly:",i),await this.syncStoriesDirectly()}else console.log("Background Sync API not supported. Syncing directly."),await this.syncStoriesDirectly()},async syncStoriesDirectly(){const i=await w.getOfflineStories();if(i.length===0)return;let e=0;for(const t of i)try{const a=new FormData;a.append("description",t.description),a.append("photo",t.photo,"offline_photo.jpg"),t.lat&&t.lon&&(a.append("lat",t.lat),a.append("lon",t.lon));const n=t.token||localStorage.getItem("authToken");(await(await fetch("https://story-api.dicoding.dev/v1/stories",{method:"POST",headers:{Authorization:`Bearer ${n}`},body:a})).json()).error||(await w.deleteOfflineStory(t.id),e++)}catch(a){console.error("Failed to sync offline story directly:",a)}e>0&&(this.showToast(`Sinkronisasi Berhasil! ${e} story offline Anda telah diunggah.`),window.dispatchEvent(new CustomEvent("stories-synced")))},showToast(i){const e=document.getElementById("toast-container");if(!e)return;const t=document.createElement("div");t.className="toast",t.setAttribute("role","alert"),t.setAttribute("aria-live","polite"),t.textContent=i,e.appendChild(t),setTimeout(()=>{t.classList.add("show")},10),setTimeout(()=>{t.classList.remove("show"),setTimeout(()=>{t.remove()},300)},4e3)}};let v=null;window.addEventListener("beforeinstallprompt",i=>{i.preventDefault(),v=i,window.dispatchEvent(new CustomEvent("pwa-installable"))});class fe{constructor({view:e,model:t}){this._view=e,this._model=t,this._map=null,this._markers={}}async init(){if(!localStorage.getItem("authToken")){window.location.hash="#/login";return}this._initMap(),await this._fetchAndRenderStories(),this._bindListMapSync(),this._setupInstallPrompt(),await this._setupNotificationToggle(),this._onStoriesSynced=async()=>{await this._fetchAndRenderStories()},window.addEventListener("stories-synced",this._onStoriesSynced)}_initMap(){if(!document.getElementById("stories-map"))return;this._map=L.map("stories-map").setView([-2.5489,118.0149],5);const t=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap contributors"}),a=L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:"Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EAP, and the GIS User Community"});t.addTo(this._map);const n={"Peta Default":t,Satelit:a};L.control.layers(n).addTo(this._map)}async _fetchAndRenderStories(){try{const e=await this._model.getAllStories(1);e.error?this._view.showError("Gagal memuat cerita: "+e.message):(this._view.renderStories(e.listStory),this._plotMarkers(e.listStory))}catch{this._view.showError("Gagal memuat cerita. Hubungkan ke internet untuk menyegarkan data.")}}_plotMarkers(e){if(!this._map)return;Object.values(this._markers).forEach(a=>this._map.removeLayer(a)),this._markers={},this._defaultIcon=new L.Icon.Default,this._activeIcon=new L.Icon({iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",shadowUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]}),e.forEach(a=>{if(a.lat&&a.lon){const n=L.marker([a.lat,a.lon]).addTo(this._map);n.bindPopup(`
          <div style="font-family:inherit; max-width: 200px;">
            <strong style="font-size: 1rem;">${a.name}</strong>
            <p style="font-size: 0.8rem; margin: 4px 0 8px 0; color: #475569;">${a.description.substring(0,60)}...</p>
            <a href="#/stories/${a.id}" style="color: var(--primary); text-decoration: none; font-weight: 600; font-size: 0.8rem;">Detail Cerita →</a>
          </div>
        `),this._markers[a.id]=n,n.on("click",()=>{this._highlightMarker(a.id),this._scrollToListItem(a.id)})}});const t=Object.values(this._markers);if(t.length>0){const a=L.featureGroup(t);this._map.fitBounds(a.getBounds().pad(.15))}}_bindListMapSync(){const e=document.getElementById("stories-list");e&&(e.addEventListener("click",t=>{const a=t.target.closest(".story-card");if(a){const n=a.getAttribute("data-id");this._highlightMarker(n),this._highlightListItem(n),this._markers[n]&&(this._map.flyTo(this._markers[n].getLatLng(),12),this._markers[n].openPopup())}}),e.addEventListener("keydown",t=>{if(t.key==="Enter"){const a=t.target.closest(".story-card");a&&a.click()}}))}_highlightMarker(e){Object.values(this._markers).forEach(t=>{t.setIcon(this._defaultIcon)}),this._markers[e]&&this._markers[e].setIcon(this._activeIcon)}_highlightListItem(e){document.querySelectorAll(".story-card").forEach(n=>n.classList.remove("active"));const a=document.querySelector(`.story-card[data-id="${e}"]`);a&&a.classList.add("active")}_scrollToListItem(e){this._highlightListItem(e);const t=document.querySelector(`.story-card[data-id="${e}"]`);t&&t.scrollIntoView({behavior:"smooth",block:"nearest"})}_setupInstallPrompt(){const e=document.getElementById("install-btn");if(!e)return;const t=()=>{v&&(e.style.display="inline-block")};t(),this._onInstallable=()=>t(),window.addEventListener("pwa-installable",this._onInstallable),e.addEventListener("click",async()=>{if(!v)return;v.prompt();const{outcome:a}=await v.userChoice;console.log(`PWA install prompt choice: ${a}`),v=null,e.style.display="none"})}async _setupNotificationToggle(){const e=document.getElementById("notif-toggle-btn");if(!e)return;const t=a=>{a?(e.textContent="Nonaktifkan",e.className="btn-secondary",e.style.borderColor="#ef4444",e.style.color="#ef4444"):(e.textContent="Aktifkan",e.className="btn-primary",e.style.borderColor="",e.style.color=""),e.disabled=!1};try{const a=await k.isEnabled();t(a)}catch{e.textContent="Tidak Didukung",e.disabled=!0}e.addEventListener("click",async()=>{e.disabled=!0,e.textContent="Memproses...";try{await k.isEnabled()?(await k.disableNotification(),t(!1),u.showToast("Notifikasi berhasil dinonaktifkan.")):(await k.enableNotification(),t(!0),u.showToast("Notifikasi berhasil diaktifkan!"))}catch(a){console.error("Push notification toggle error:",a),u.showToast(`Error: ${a.message}`);const n=await k.isEnabled();t(n)}})}destroy(){this._onInstallable&&window.removeEventListener("pwa-installable",this._onInstallable),this._onStoriesSynced&&window.removeEventListener("stories-synced",this._onStoriesSynced)}}class be{async render(){return this.view=new te,this.view.getTemplate()}async afterRender(){this.presenter=new fe({view:this.view,model:I}),await this.presenter.init()}}class we{getTemplate(){return`
      <section class="auth-container">
        <div class="auth-card glass-panel">
          <h1>Login ke JejakCerita</h1>
          <form id="login-form" class="auth-form">
            <div class="form-group">
              <label for="login-email">Email</label>
              <input type="email" id="login-email" name="email" required autocomplete="email">
            </div>
            <div class="form-group">
              <label for="login-password">Password</label>
              <input type="password" id="login-password" name="password" required autocomplete="current-password">
            </div>
            <button type="submit" id="login-submit" class="btn-primary">Login</button>
            <p class="auth-link">Belum punya akun? <a href="#/register">Daftar di sini</a></p>
          </form>
          <div id="login-error" class="error-msg" aria-live="polite"></div>
        </div>
      </section>
    `}showError(e){const t=document.getElementById("login-error");t&&(t.textContent=e,t.style.display="block")}hideError(){const e=document.getElementById("login-error");e&&(e.style.display="none",e.textContent="")}}class ve{constructor({view:e,model:t}){this._view=e,this._model=t}init(){this._listenToFormSubmit()}_listenToFormSubmit(){const e=document.getElementById("login-form");e&&e.addEventListener("submit",async t=>{t.preventDefault(),this._view.hideError();const a=document.getElementById("login-email").value,n=document.getElementById("login-password").value,s=document.getElementById("login-submit");s.disabled=!0,s.textContent="Logging in...";try{const r=await this._model.login(a,n);r.error?this._view.showError(r.message):(localStorage.setItem("authToken",r.loginResult.token),localStorage.setItem("authName",r.loginResult.name),window.location.hash="#/")}catch{this._view.showError("Gagal login. Silakan coba lagi.")}finally{s.disabled=!1,s.textContent="Login"}})}}class J{static async login(e,t){return(await fetch(f.LOGIN,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:t})})).json()}static async register(e,t,a){return(await fetch(f.REGISTER,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e,email:t,password:a})})).json()}}class Ee{async render(){return this.view=new we,this.view.getTemplate()}async afterRender(){this.presenter=new ve({view:this.view,model:J}),this.presenter.init()}}class Se{getTemplate(){return`
      <section class="auth-container">
        <div class="auth-card glass-panel">
          <h1>Daftar Akun JejakCerita</h1>
          <form id="register-form" class="auth-form">
            <div class="form-group">
              <label for="register-name">Nama Lengkap</label>
              <input type="text" id="register-name" name="name" required autocomplete="name">
            </div>
            <div class="form-group">
              <label for="register-email">Email</label>
              <input type="email" id="register-email" name="email" required autocomplete="email">
            </div>
            <div class="form-group">
              <label for="register-password">Password</label>
              <input type="password" id="register-password" name="password" required autocomplete="new-password" minlength="6">
            </div>
            <button type="submit" id="register-submit" class="btn-primary">Daftar</button>
            <p class="auth-link">Sudah punya akun? <a href="#/login">Login di sini</a></p>
          </form>
          <div id="register-error" class="error-msg" aria-live="polite"></div>
          <div id="register-success" class="success-msg" aria-live="polite"></div>
        </div>
      </section>
    `}showError(e){const t=document.getElementById("register-error");t&&(t.textContent=e,t.style.display="block")}hideError(){const e=document.getElementById("register-error");e&&(e.style.display="none",e.textContent="")}showSuccess(e){const t=document.getElementById("register-success");t&&(t.textContent=e,t.style.display="block")}hideSuccess(){const e=document.getElementById("register-success");e&&(e.style.display="none",e.textContent="")}}class _e{constructor({view:e,model:t}){this._view=e,this._model=t}init(){this._listenToFormSubmit()}_listenToFormSubmit(){const e=document.getElementById("register-form");e&&e.addEventListener("submit",async t=>{t.preventDefault(),this._view.hideError(),this._view.hideSuccess();const a=document.getElementById("register-name").value,n=document.getElementById("register-email").value,s=document.getElementById("register-password").value,r=document.getElementById("register-submit");r.disabled=!0,r.textContent="Mendaftar...";try{const l=await this._model.register(a,n,s);l.error?this._view.showError(l.message):(this._view.showSuccess("Registrasi berhasil! Mengalihkan ke halaman login..."),setTimeout(()=>{window.location.hash="#/login"},2e3))}catch{this._view.showError("Pendaftaran gagal. Silakan coba lagi.")}finally{r.disabled=!1,r.textContent="Daftar"}})}}class ke{async render(){return this.view=new Se,this.view.getTemplate()}async afterRender(){this.presenter=new _e({view:this.view,model:J}),this.presenter.init()}}class xe{getTemplate(){return`
      <section class="add-container">
        <div class="glass-panel add-card" style="width: 100%; max-width: 600px;">
          <h1>Bagikan Cerita Baru</h1>
          <form id="add-story-form" class="auth-form">
            
            <!-- Media Section -->
            <div class="form-group media-section" style="margin-bottom: 20px;">
               <div id="video-container" style="display:none; text-align: center; margin-bottom: 10px;">
                 <video id="camera-video" autoplay playsinline style="width: 100%; border-radius: 8px; background: #000;"></video>
                 <button type="button" id="capture-btn" class="btn-primary mt-2">Ambil Foto</button>
               </div>
               <img id="photo-preview" class="photo-preview" style="display:none; width: 100%; border-radius: 8px; margin-bottom: 10px; object-fit: cover; max-height: 300px;" alt="Pratinjau Foto" />
               <canvas id="photo-canvas" style="display:none;"></canvas>
               
               <div class="media-controls">
                 <label for="image-upload" class="btn-secondary" tabindex="0" role="button" aria-label="Unggah Gambar dari Perangkat">Unggah Gambar</label>
                 <input type="file" id="image-upload" accept="image/*" style="display:none;">
                 <button type="button" id="start-camera-btn" class="btn-secondary">Gunakan Kamera</button>
               </div>
            </div>

            <!-- Description -->
            <div class="form-group">
              <label for="story-desc">Deskripsi Cerita</label>
              <textarea id="story-desc" name="description" rows="4" required placeholder="Tuliskan momen berharga Anda di sini..."></textarea>
            </div>

            <!-- Location Picker -->
            <div class="form-group">
              <label>Lokasi (Klik pada peta untuk memilih lokasi)</label>
              <div id="add-map" style="height: 250px; border-radius: 8px; margin-top: 8px; z-index: 10;" role="application" aria-label="Peta pemilih lokasi cerita"></div>
              
              <div class="loc-inputs" style="display:flex; gap: 10px; margin-top: 8px;">
                <div style="flex:1;">
                  <label for="lat-input" class="visually-hidden">Latitude</label>
                  <input type="text" id="lat-input" placeholder="Latitude (Garis Lintang)" readonly>
                </div>
                <div style="flex:1;">
                  <label for="lon-input" class="visually-hidden">Longitude</label>
                  <input type="text" id="lon-input" placeholder="Longitude (Garis Bujur)" readonly>
                </div>
              </div>
              <button type="button" id="use-gps-btn" class="btn-secondary mt-2">Gunakan Lokasi GPS Saat Ini</button>
            </div>

            <button type="submit" id="submit-story-btn" class="btn-primary" style="margin-top: 25px;">Unggah Cerita</button>
          </form>
          <div id="add-error" class="error-msg" aria-live="polite"></div>
        </div>
      </section>
    `}showError(e){const t=document.getElementById("add-error");t&&(t.textContent=e,t.style.display="block")}hideError(){const e=document.getElementById("add-error");e&&(e.style.display="none",e.textContent="")}}class Le{constructor({view:e,model:t}){this._view=e,this._model=t,this._stream=null,this._selectedFile=null,this._map=null,this._marker=null}init(){this._initMap(),this._bindEvents()}_initMap(){document.getElementById("add-map")&&(this._map=L.map("add-map").setView([-2.5489,118.0149],5),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}).addTo(this._map),this._map.on("click",t=>{this._updateLocation(t.latlng.lat,t.latlng.lng)}))}_updateLocation(e,t){const a=parseFloat(e.toFixed(6)),n=parseFloat(t.toFixed(6));document.getElementById("lat-input").value=a,document.getElementById("lon-input").value=n,this._marker?this._marker.setLatLng([e,t]):this._marker=L.marker([e,t]).addTo(this._map)}_bindEvents(){const e=document.getElementById("image-upload"),t=document.getElementById("start-camera-btn"),a=document.getElementById("capture-btn"),n=document.getElementById("use-gps-btn"),s=document.getElementById("add-story-form");e.addEventListener("change",r=>{this._stopCamera();const l=r.target.files[0];l&&(this._selectedFile=l,this._showPreview(URL.createObjectURL(l)))}),t.addEventListener("click",()=>this._startCamera()),a.addEventListener("click",()=>this._capturePhoto()),n.addEventListener("click",()=>{navigator.geolocation?navigator.geolocation.getCurrentPosition(r=>{this._updateLocation(r.coords.latitude,r.coords.longitude),this._map&&this._map.setView([r.coords.latitude,r.coords.longitude],13)},r=>this._view.showError("Gagal mendapatkan lokasi GPS.")):this._view.showError("GPS tidak didukung oleh browser ini.")}),s.addEventListener("submit",async r=>{r.preventDefault(),await this._submitStory()}),this._routeCleanup=()=>this._stopCamera(),window.addEventListener("hashchange",this._routeCleanup,{once:!0})}async _startCamera(){this._view.hideError();try{this._stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});const e=document.getElementById("camera-video");e&&(e.srcObject=this._stream),document.getElementById("video-container").style.display="block",document.getElementById("photo-preview").style.display="none",this._selectedFile=null}catch{this._view.showError("Akses kamera ditolak atau tidak didukung.")}}_capturePhoto(){const e=document.getElementById("camera-video"),t=document.getElementById("photo-canvas");if(!e||!t)return;const a=t.getContext("2d");t.width=e.videoWidth,t.height=e.videoHeight,a.drawImage(e,0,0,t.width,t.height),this._stopCamera();const n=t.toDataURL("image/jpeg");this._showPreview(n),fetch(n).then(s=>s.blob()).then(s=>{this._selectedFile=new File([s],"camera_capture.jpg",{type:"image/jpeg"})})}_stopCamera(){this._stream&&(this._stream.getTracks().forEach(t=>t.stop()),this._stream=null);const e=document.getElementById("video-container");e&&(e.style.display="none")}_showPreview(e){const t=document.getElementById("photo-preview");t&&(t.src=e,t.style.display="block")}async _submitStory(){if(this._view.hideError(),!this._selectedFile){this._view.showError("Silakan sertakan gambar terlebih dahulu.");return}const e=document.getElementById("story-desc").value,t=document.getElementById("lat-input").value,a=document.getElementById("lon-input").value,n=document.getElementById("submit-story-btn"),s=t?parseFloat(t):null,r=a?parseFloat(a):null;if(n.disabled=!0,!navigator.onLine){try{n.textContent="Menyimpan Offline...";const o={description:e,photo:this._selectedFile,lat:s,lon:r,createdAt:new Date().toISOString(),token:localStorage.getItem("authToken")};await w.saveOfflineStory(o),await u.registerSync(),u.showToast("Koneksi terputus. Cerita disimpan secara offline dan akan diunggah otomatis saat terhubung kembali."),window.location.hash="#/"}catch(o){console.error("Failed to save story offline:",o),this._view.showError("Gagal menyimpan cerita secara offline."),n.disabled=!1}return}n.textContent="Mengunggah...";const l=new FormData;l.append("description",e),l.append("photo",this._selectedFile),s&&r&&(l.append("lat",s),l.append("lon",r));try{const o=await this._model.addStory(l);o.error?this._view.showError(o.message):(u.showToast("Cerita berhasil diunggah!"),window.location.hash="#/")}catch{this._view.showError("Gagal mengunggah cerita ke server.")}finally{n.disabled=!1,n.textContent="Unggah Cerita"}}destroy(){this._stopCamera(),this._routeCleanup&&window.removeEventListener("hashchange",this._routeCleanup)}}class Ie{async render(){return this.view=new xe,this.view.getTemplate()}async afterRender(){this.presenter=new Le({view:this.view,model:I}),this.presenter.init()}}class Be{getTemplate(){return`
      <section class="detail-container">
        <div style="margin-bottom: 20px;">
          <a href="#/" class="btn-secondary" style="display:inline-block; width:auto; text-decoration:none; padding: 8px 16px;">← Kembali ke Beranda</a>
        </div>

        <div id="detail-content" class="glass-panel" style="max-width: 800px; margin: 0 auto; padding: 25px;">
          <p>Memuat rincian cerita...</p>
        </div>
      </section>
    `}renderDetail(e,t){const a=document.getElementById("detail-content");if(!a)return;const n=new Date(e.createdAt).toLocaleDateString("id-ID",{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"}),s=t?"★ Hapus dari Tersimpan":"☆ Simpan Cerita",r=t?"btn-secondary":"btn-primary",l=t?"border-color:#ef4444; color:#ef4444;":"";let o="";e.lat&&e.lon&&(o=`
        <div class="detail-map-section" style="margin-top: 25px;">
          <h3 style="font-size: 1.1rem; margin-bottom: 10px;">Lokasi Cerita</h3>
          <div id="detail-map" style="height: 300px; border-radius: 8px; z-index: 10;" role="application" aria-label="Peta lokasi cerita"></div>
        </div>
      `),a.innerHTML=`
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px; margin-bottom: 20px;">
        <h1 style="font-size: 1.8rem; text-align: left; margin:0;">Cerita dari ${e.name}</h1>
        <button id="save-toggle-btn" class="${r}" style="width:auto; padding: 10px 20px; font-size: 0.9rem; ${l}" aria-label="${t?"Hapus cerita ini dari bookmark tersimpan":"Simpan cerita ini ke bookmark tersimpan"}">
          ${s}
        </button>
      </div>

      <img src="${e.photoUrl}" alt="Foto cerita oleh ${e.name}" style="width: 100%; border-radius: 12px; max-height: 450px; object-fit: cover; margin-bottom: 20px;" loading="lazy">

      <div class="story-meta" style="margin-bottom: 20px; border-bottom: 1px solid var(--glass-border); padding-bottom: 15px;">
        <span class="story-date" style="font-size: 0.9rem; color:#818cf8; display:block;">Diunggah pada: ${n}</span>
      </div>

      <div class="story-body" style="line-height: 1.7; font-size: 1.05rem;">
        <p>${e.description}</p>
      </div>

      ${o}
    `}showError(e){const t=document.getElementById("detail-content");t&&(t.innerHTML=`
        <p class="error-msg" style="display:block;">${e}</p>
        <div style="text-align:center; margin-top:20px;">
          <a href="#/" class="btn-primary" style="display:inline-block; width:auto; text-decoration:none; padding:10px 20px;">Kembali ke Beranda</a>
        </div>
      `)}}function Y(i){const e=i.split("/");return{resource:e[1]||null,id:e[2]||null}}function Te(i){let e="";return i.resource&&(e=e.concat(`/${i.resource}`)),i.id&&(e=e.concat("/:id")),e||"/"}function Q(){return location.hash.replace("#","")||"/"}function Ae(){const i=Q(),e=Y(i);return Te(e)}function Ce(){const i=Q();return Y(i)}class De{constructor({view:e,model:t}){this._view=e,this._model=t,this._map=null,this._story=null}async init(){const{id:e}=Ce();if(!e){this._view.showError("ID Cerita tidak ditemukan.");return}await this._loadStoryData(e)}async _loadStoryData(e){try{let t=await w.getSavedStory(e),a=!!t;if(!t){const n=await this._model.getStoryDetail(e);if(!n.error)t=n.story;else{this._view.showError(n.message||"Gagal memuat detail cerita.");return}}this._story=t,this._view.renderDetail(t,a),t.lat&&t.lon&&this._initMap(t.lat,t.lon,t.name),this._bindSaveToggle(a)}catch(t){console.error("Error loading story detail:",t),this._view.showError("Terjadi kesalahan saat memuat data cerita. Pastikan Anda online atau data telah dicache.")}}_initMap(e,t,a){if(!document.getElementById("detail-map"))return;this._map=L.map("detail-map").setView([e,t],12),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}).addTo(this._map),L.marker([e,t]).addTo(this._map).bindPopup(`<b>${a}</b> berada di lokasi ini.`).openPopup()}_bindSaveToggle(e){const t=document.getElementById("save-toggle-btn");if(!t)return;let a=e;t.addEventListener("click",async()=>{t.disabled=!0;try{a?(await w.deleteSavedStory(this._story.id),u.showToast("Cerita dihapus dari daftar tersimpan."),a=!1):(await w.saveStory(this._story),u.showToast("Cerita berhasil disimpan ke daftar tersimpan."),a=!0),this._updateSaveButtonUI(t,a)}catch(n){console.error("Failed to toggle saved story:",n),u.showToast("Gagal memproses penyimpanan cerita.")}finally{t.disabled=!1}})}_updateSaveButtonUI(e,t){e.textContent=t?"★ Hapus dari Tersimpan":"☆ Simpan Cerita",t?(e.className="btn-secondary",e.style.borderColor="#ef4444",e.style.color="#ef4444",e.setAttribute("aria-label","Hapus cerita ini dari bookmark tersimpan")):(e.className="btn-primary",e.style.borderColor="",e.style.color="",e.setAttribute("aria-label","Simpan cerita ini ke bookmark tersimpan"))}}class Pe{async render(){return this.view=new Be,this.view.getTemplate()}async afterRender(){this.presenter=new De({view:this.view,model:I}),await this.presenter.init()}}class Me{getTemplate(){return`
      <section class="saved-container" style="max-width: 900px; margin: 0 auto; padding: 20px 15px;">
        <div style="margin-bottom: 20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px;">
          <a href="#/" class="btn-secondary" style="display:inline-block; width:auto; text-decoration:none; padding: 8px 16px;">← Kembali ke Beranda</a>
          <h1 style="font-size: 1.8rem; margin:0;">Cerita Tersimpan</h1>
        </div>

        <div class="search-filter-panel glass-panel" style="padding: 20px; margin-bottom: 25px; border-radius: 12px;">
          <div style="display:flex; gap:15px; flex-wrap:wrap;">
            <div style="flex: 2; min-width: 250px;">
              <label for="saved-search-input" style="display:block; font-size:0.85rem; color:var(--text-muted); margin-bottom:6px;">Cari Cerita</label>
              <input type="text" id="saved-search-input" placeholder="Cari berdasarkan nama penulis atau deskripsi..." style="width:100%; box-sizing:border-box;">
            </div>
            <div style="flex: 1; min-width: 150px;">
              <label for="saved-sort-select" style="display:block; font-size:0.85rem; color:var(--text-muted); margin-bottom:6px;">Urutkan</label>
              <select id="saved-sort-select" style="width:100%; padding:12px; border-radius:8px; border:1px solid var(--glass-border); background:rgba(15,23,42,0.8); color:#fff; font-size:1rem; font-family:inherit; outline:none; height:47px; box-sizing:border-box;">
                <option value="newest">Terbaru (Newest)</option>
                <option value="oldest">Terlama (Oldest)</option>
              </select>
            </div>
          </div>
        </div>

        <div id="saved-stories-list" class="stories-list" style="max-height: none; overflow-y: visible;">
          <p>Memuat cerita tersimpan...</p>
        </div>
      </section>
    `}renderSavedStories(e){const t=document.getElementById("saved-stories-list");if(t){if(t.innerHTML="",e.length===0){t.innerHTML=`
        <div class="glass-panel" style="padding: 40px; text-align: center; border-radius: 12px;">
          <p style="color:var(--text-muted); margin-bottom: 15px;">Tidak ada cerita tersimpan yang cocok.</p>
          <a href="#/" class="btn-primary" style="display:inline-block; width:auto; text-decoration:none; padding:10px 20px;">Jelajahi Cerita Baru</a>
        </div>
      `;return}e.forEach(a=>{const n=new Date(a.createdAt).toLocaleDateString("id-ID",{year:"numeric",month:"long",day:"numeric"}),s=document.createElement("div");s.classList.add("story-card"),s.setAttribute("data-id",a.id),s.setAttribute("tabindex","0"),s.setAttribute("aria-label",`Cerita Tersimpan oleh ${a.name}, deskripsi: ${a.description.substring(0,100)}`),s.innerHTML=`
        <img src="${a.photoUrl}" alt="Foto cerita tersimpan oleh ${a.name}" class="story-img" loading="lazy">
        <div class="story-info" style="flex:1;">
          <h3>${a.name}</h3>
          <p class="story-desc">${a.description}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
            <span class="story-date">${n}</span>
            <a href="#/stories/${a.id}" class="story-detail-link" style="color: #818cf8; text-decoration: none; font-size: 0.85rem; font-weight: 600;" aria-label="Lihat rincian detail cerita tersimpan oleh ${a.name}">Lihat Detail →</a>
          </div>
        </div>
      `,t.appendChild(s)}),t.querySelectorAll(".story-detail-link").forEach(a=>{a.addEventListener("click",n=>{n.stopPropagation()})})}}}class Oe{constructor({view:e}){this._view=e,this._stories=[],this._filteredStories=[]}async init(){await this._fetchSavedStories(),this._bindEvents()}async _fetchSavedStories(){try{this._stories=await w.getSavedStories(),this._applyFilterAndSort()}catch(e){console.error("Error loading saved stories from IndexedDB:",e),this._stories=[],this._view.renderSavedStories([])}}_bindEvents(){const e=document.getElementById("saved-search-input"),t=document.getElementById("saved-sort-select"),a=document.getElementById("saved-stories-list");e&&e.addEventListener("input",()=>{this._applyFilterAndSort()}),t&&t.addEventListener("change",()=>{this._applyFilterAndSort()}),a&&(a.addEventListener("click",n=>{const s=n.target.closest(".story-card");if(s){const r=s.getAttribute("data-id");window.location.hash=`#/stories/${r}`}}),a.addEventListener("keydown",n=>{if(n.key==="Enter"){const s=n.target.closest(".story-card");if(s){const r=s.getAttribute("data-id");window.location.hash=`#/stories/${r}`}}}))}_applyFilterAndSort(){const e=document.getElementById("saved-search-input"),t=document.getElementById("saved-sort-select"),a=e?e.value.toLowerCase().trim():"",n=t?t.value:"newest";this._filteredStories=this._stories.filter(s=>{const r=s.name.toLowerCase().includes(a),l=s.description.toLowerCase().includes(a);return r||l}),this._filteredStories.sort((s,r)=>{const l=new Date(s.createdAt).getTime(),o=new Date(r.createdAt).getTime();return n==="newest"?o-l:l-o}),this._view.renderSavedStories(this._filteredStories)}}class $e{async render(){return this.view=new Me,this.view.getTemplate()}async afterRender(){this.presenter=new Oe({view:this.view}),await this.presenter.init()}}const Re={"/":new be,"/login":new Ee,"/register":new ke,"/add":new Ie,"/stories/:id":new Pe,"/saved":new $e},W=["/login","/register"],Ne=["/","/add","/saved","/stories/:id"];var S,d,p,h,X,Z,ee;class je{constructor({navigationDrawer:e,drawerButton:t,content:a}){_(this,h);_(this,S,null);_(this,d,null);_(this,p,null);B(this,S,a),B(this,d,t),B(this,p,e),T(this,h,X).call(this)}async renderPage(){const e=Ae(),t=Re[e];if(!t){window.location.hash="#/";return}if(T(this,h,ee).call(this,e))return;T(this,h,Z).call(this,e);const a=async()=>{c(this,S).innerHTML=await t.render(),await t.afterRender();const n=c(this,S).querySelector("h1, h2");n&&(n.setAttribute("tabindex","-1"),n.focus())};document.startViewTransition?await document.startViewTransition(a).finished:await a()}}S=new WeakMap,d=new WeakMap,p=new WeakMap,h=new WeakSet,X=function(){c(this,d).addEventListener("click",()=>{const e=c(this,d).getAttribute("aria-expanded")==="true";c(this,d).setAttribute("aria-expanded",!e),c(this,p).classList.toggle("open")}),document.body.addEventListener("click",e=>{!c(this,p).contains(e.target)&&!c(this,d).contains(e.target)&&(c(this,p).classList.remove("open"),c(this,d).setAttribute("aria-expanded","false")),c(this,p).querySelectorAll("a").forEach(t=>{t.contains(e.target)&&(c(this,p).classList.remove("open"),c(this,d).setAttribute("aria-expanded","false"))})})},Z=function(e){const t=W.includes(e);c(this,p).style.display=t?"none":"",c(this,d).style.display=t?"none":""},ee=function(e){const a=!!localStorage.getItem("authToken");return!a&&Ne.includes(e)?(window.location.hash="#/login",!0):a&&W.includes(e)?(window.location.hash="#/",!0):!1};function M(){const i=document.getElementById("offline-banner");i&&(navigator.onLine?(i.style.display="none",u.registerSync()):i.style.display="block")}document.addEventListener("DOMContentLoaded",async()=>{const i=new je({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer")});await i.renderPage(),window.addEventListener("hashchange",async()=>{await i.renderPage()});const e=document.getElementById("logout-btn");if(e&&e.addEventListener("click",()=>{localStorage.removeItem("authToken"),localStorage.removeItem("authName"),window.location.hash="#/login"}),"serviceWorker"in navigator)try{const t=await navigator.serviceWorker.register("/sw.js");console.log("Service Worker registered successfully, scope:",t.scope),M()}catch(t){console.error("Service Worker registration failed:",t)}window.addEventListener("online",M),window.addEventListener("offline",M),navigator.onLine&&u.registerSync()});
