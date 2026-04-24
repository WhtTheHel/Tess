import { supabase } from './supabaseClient.js';

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginFormContainer = document.getElementById('login-form-container');
const loggedInContainer = document.getElementById('logged-in-container');
const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');
const userEmailDisplay = document.getElementById('user-email-display');

supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) showLoggedInState(session.user.email);
});

supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
        showLoggedInState(session.user.email);
    } else {
        showLoggedOutState();
    }
});

function showLoggedInState(email) {
    loginFormContainer.classList.add('d-none');
    loggedInContainer.classList.remove('d-none');
    userEmailDisplay.textContent = email;
}

function showLoggedOutState() {
    loginFormContainer.classList.remove('d-none');
    loggedInContainer.classList.add('d-none');
}

window.showRegister = function(e) {
    e.preventDefault();
    loginForm.classList.add('d-none');
    registerForm.classList.remove('d-none');
    loginError.classList.add('d-none');
};

window.showLogin = function(e) {
    e.preventDefault();
    registerForm.classList.add('d-none');
    loginForm.classList.remove('d-none');
    registerError.classList.add('d-none');
};

window.togglePassword = function(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
};

window.handleLogin = async function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('login-btn');

    loginError.classList.add('d-none');
    setButtonLoading(btn, true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setButtonLoading(btn, false);

    if (error) {
        loginError.textContent = getErrorMessage(error.message);
        loginError.classList.remove('d-none');
    }
};

window.handleRegister = async function(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const btn = document.getElementById('register-btn');

    registerError.classList.add('d-none');
    setButtonLoading(btn, true);

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
    });

    setButtonLoading(btn, false);

    if (error) {
        registerError.textContent = getErrorMessage(error.message);
        registerError.classList.remove('d-none');
    }
};

window.handleLogout = async function() {
    await supabase.auth.signOut();
};

function setButtonLoading(btn, loading) {
    const text = btn.querySelector('.btn-text');
    const spinner = btn.querySelector('.btn-spinner');
    btn.disabled = loading;
    text.classList.toggle('d-none', loading);
    spinner.classList.toggle('d-none', !loading);
}

function getErrorMessage(msg) {
    const map = {
        'Invalid login credentials': 'Email atau kata sandi salah.',
        'User already registered': 'Email sudah terdaftar. Silakan masuk.',
        'Email not confirmed': 'Email belum dikonfirmasi.',
        'Password should be at least 6 characters': 'Kata sandi minimal 6 karakter.',
    };
    return map[msg] || msg;
}

