import { supabase } from './supabaseClient.js';

const navAuthBtn = document.getElementById('nav-auth-btn');

supabase.auth.onAuthStateChange((event, session) => {
    if (navAuthBtn) {
        if (session) {
            navAuthBtn.textContent = 'Keluar';
            navAuthBtn.href = '#';
            navAuthBtn.classList.remove('btn-outline-light');
            navAuthBtn.classList.add('btn-outline-warning');
            navAuthBtn.onclick = async (e) => {
                e.preventDefault();
                await supabase.auth.signOut();
                window.location.reload();
            };
        } else {
            navAuthBtn.textContent = 'Masuk';
            navAuthBtn.href = '/login.html';
            navAuthBtn.classList.remove('btn-outline-warning');
            navAuthBtn.classList.add('btn-outline-light');
            navAuthBtn.onclick = null;
        }
    }
});

