// ═════════ FIREBASE: prijava + real-time sinkronizacija + dijeljenje ═════════
if (!window.PLANNER_LOCAL) {
  const V = '10.12.2';
  const { initializeApp } = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`);
  const { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } =
    await import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`);
  const { initializeFirestore, getFirestore, persistentLocalCache, persistentMultipleTabManager, doc, collection, query, where,
    onSnapshot, setDoc, updateDoc, serverTimestamp } = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`);

  // Ovi podaci NISU tajni (javni su u svakoj Firebase web aplikaciji). Podatke štite Firestore Rules.
  const firebaseConfig = {
    apiKey: 'AIzaSyAKUQmnGdNMXEi-FrJK9XJA5p1mbJXxfWU',
    authDomain: 'planner-96d7c.firebaseapp.com',
    projectId: 'planner-96d7c',
    storageBucket: 'planner-96d7c.firebasestorage.app',
    messagingSenderId: '550192658997',
    appId: '1:550192658997:web:cb5f171bb765a58b2e8f7c',
  };
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  auth.languageCode = 'hr';
  // Offline cache (IndexedDB): trenutno učitavanje, rad bez interneta, sync kad se veza vrati
  let db;
  try { db = initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) }); }
  catch (e) { db = getFirestore(app); }

  const CLIENT_ID = Math.random().toString(36).slice(2, 10);
  let me = null;            // prijavljeni korisnik
  let activeUid = null;     // čiji planner je otvoren (moj ili podijeljeni)
  let unsub = null, unsubShared = null, saveTimer = null, dirty = false, lastPayload = null, isOwn = true;

  window._fbInfo = { projectId: firebaseConfig.projectId, apiKey: firebaseConfig.apiKey };
  window._fbUid = () => (me ? me.uid : null);
  window._fbActiveUid = () => (activeUid && me && activeUid !== me.uid ? activeUid : '');
  window._fbIdToken = () => (auth.currentUser ? auth.currentUser.getIdToken() : null);

  getRedirectResult(auth).catch((e) => window.onLoginError(e));
  document.getElementById('loginStatus').textContent = '';

  window._fbSignIn = async () => {
    const p = new GoogleAuthProvider();
    p.setCustomParameters({ prompt: 'select_account' });
    document.getElementById('loginStatus').textContent = 'Prijavljujem…';
    try { await signInWithPopup(auth, p); }
    catch (e) {
      if (['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment', 'auth/web-storage-unsupported'].includes(e.code)) await signInWithRedirect(auth, p);
      else if (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request') document.getElementById('loginStatus').textContent = '';
      else window.onLoginError(e);
    }
  };
  window._fbSignOut = async () => {
    await saveNow();
    if (unsub) unsub();
    if (unsubShared) unsubShared();
    try { sessionStorage.clear(); } catch (e) {}
    await signOut(auth);
    location.reload();
  };

  onAuthStateChanged(auth, (u) => {
    if (u) {
      me = u;
      window.onSignedIn({ name: u.displayName || '', photo: u.photoURL || '', email: u.email || '' });
      let start = u.uid;
      try { const s = localStorage.getItem('planner.active.' + u.uid); if (s) start = s; } catch (e) {}
      subscribe(start);
      watchShared();
    } else {
      if (unsub) { unsub(); unsub = null; }
      if (unsubShared) { unsubShared(); unsubShared = null; }
      me = null; activeUid = null;
      window.onSignedOut();
    }
  });

  // Planneri koje su drugi podijelili sa mnom
  function watchShared() {
    if (unsubShared) unsubShared();
    const email = (me.email || '').toLowerCase();
    if (!email || !me.emailVerified) return;
    const q = query(collection(db, 'planners'), where('sharedWith', 'array-contains', email));
    unsubShared = onSnapshot(q, (qs) => {
      const list = qs.docs.filter((d) => d.id !== me.uid).map((d) => ({ uid: d.id, ownerEmail: d.get('ownerEmail') || '', ownerName: d.get('ownerName') || '' }));
      window.onSharedList(list);
      if (activeUid !== me.uid && !list.find((x) => x.uid === activeUid)) window._fbSwitch(''); // pristup ukinut
    }, () => { /* pravila još nisu ažurirana — ignoriraj */ });
  }

  window._fbSwitch = async (uid) => {
    const target = uid || me.uid;
    if (target === activeUid) return;
    await saveNow();
    try { localStorage.setItem('planner.active.' + me.uid, target); } catch (e) {}
    subscribe(target);
  };

  function subscribe(uid) {
    if (unsub) unsub();
    activeUid = uid; isOwn = uid === me.uid; lastPayload = null; dirty = false;
    window.setSyncStatus('syncing', 'Učitavam…');
    const ref = doc(db, 'planners', uid);
    unsub = onSnapshot(ref, { includeMetadataChanges: true }, (snap) => {
      const { fromCache, hasPendingWrites } = snap.metadata;
      if (hasPendingWrites) { window.setSyncStatus('syncing', 'Spremam…'); return; }
      if (!snap.exists()) {
        if (!isOwn) { if (!fromCache) window._fbSwitch(''); return; }
        if (!fromCache) { dirty = true; saveNow(); window.onCloudReady(); }
        return;
      }
      const data = snap.data();
      window.onPlannerMeta({ own: isOwn, ownerEmail: data.ownerEmail || (isOwn ? me.email : ''), ownerName: data.ownerName || '', sharedWith: data.sharedWith || [] });
      if (data.payload !== lastPayload && !dirty) {
        lastPayload = data.payload;
        try { window.onRemoteState(JSON.parse(data.payload)); } catch (e) { console.error('Parse error', e); }
      }
      if (fromCache) window.setSyncStatus(navigator.onLine ? 'syncing' : 'offline', navigator.onLine ? 'Povezujem…' : 'Offline – spremljeno lokalno');
      else window.setSyncStatus('synced', isOwn ? 'Sinkronizirano' : 'Sinkronizirano · dijeljeni');
      window.onCloudReady();
    }, (err) => {
      console.error('Firestore error', err);
      if (!isOwn && err.code === 'permission-denied') { window._fbSwitch(''); return; }
      window.setSyncStatus('error', err.code === 'permission-denied' ? 'Nema dozvole (Firestore Rules)' : 'Greška sinkronizacije');
    });
  }

  async function saveNow() {
    clearTimeout(saveTimer); saveTimer = null;
    if (!me || !activeUid || !dirty) return;
    const payload = JSON.stringify(window.getState());
    dirty = false;
    if (payload === lastPayload) { window.setSyncStatus('synced', 'Sinkronizirano'); return; }
    if (payload.length > 900000) { window.setSyncStatus('error', 'Previše podataka (limit ~1 MB)'); return; }
    lastPayload = payload;
    const ref = doc(db, 'planners', activeUid);
    try {
      if (isOwn) await setDoc(ref, { payload, updatedAt: serverTimestamp(), clientId: CLIENT_ID, ownerEmail: (me.email || '').toLowerCase(), ownerName: me.displayName || '' }, { merge: true });
      else await updateDoc(ref, { payload, updatedAt: serverTimestamp(), clientId: CLIENT_ID }); // gost ne smije mijenjati vlasnika ni popis dijeljenja
    } catch (e) {
      console.error('Save error', e);
      window.setSyncStatus('error', e.code === 'permission-denied' ? 'Nema dozvole za spremanje' : 'Greška pri spremanju');
    }
  }
  // Dijeljenje (samo vlasnik)
  window._fbSetSharing = async (emails) => {
    if (!isOwn) throw new Error('Samo vlasnik može dijeliti');
    const clean = [...new Set(emails.map((e) => String(e).trim().toLowerCase()).filter(Boolean))].slice(0, 20);
    await setDoc(doc(db, 'planners', me.uid), { sharedWith: clean, ownerEmail: (me.email || '').toLowerCase(), ownerName: me.displayName || '' }, { merge: true });
  };

  // Kratki debounce (400 ms) => promjena se na drugom uređaju vidi za ~1 s
  window._scheduleSave = () => { dirty = true; window.setSyncStatus('syncing', 'Spremam…'); clearTimeout(saveTimer); saveTimer = setTimeout(saveNow, 400); };
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') saveNow(); });
  window.addEventListener('pagehide', () => { saveNow(); });
}
