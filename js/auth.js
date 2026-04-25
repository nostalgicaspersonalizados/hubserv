import { auth, provider, db } from './firebase.js';
import { signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export function initAuth() {
    const btnGoogle = document.getElementById('btn-google');
    if(btnGoogle) {
        btnGoogle.onclick = () => signInWithPopup(auth, provider).catch(err => console.error(err));
    }

    const btnLogout = document.getElementById('btn-logout');
    if(btnLogout) {
        btnLogout.onclick = () => signOut(auth).then(() => location.reload());
    }

    onAuthStateChanged(auth, async (user) => {
        const overlay = document.getElementById('auth-overlay');
        const appContainer = document.querySelector('.app-container');

        if (user) {
            if(overlay) overlay.style.display = 'none';
            if(appContainer) appContainer.style.display = 'flex';
            document.getElementById('user-name').innerText = user.displayName;
            
            const userRef = doc(db, "usuarios", user.uid);
            const snap = await getDoc(userRef);
            
            if (!snap.exists()) {
                await setDoc(userRef, { nome: user.displayName, email: user.email, plano: "free", criadoEm: new Date() });
            }
            
            const plano = snap.exists() ? snap.data().plano : "free";
            const planBadge = document.getElementById('user-plan');
            if(planBadge) planBadge.innerText = plano.toUpperCase();
            window.userPlano = plano;
        } else {
            if(overlay) overlay.style.display = 'flex';
            if(appContainer) appContainer.style.display = 'none';
        }
    });
}
