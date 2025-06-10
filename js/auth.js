// js/auth.js

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Login successful
          alert("Login successful!");
          window.location.href = "dashboard.html"; // Redirect after login
        })
        .catch((error) => {
          alert(error.message);
        });
    });
  }

  // Logout button if exists (in dashboard.html)
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      auth.signOut().then(() => {
        window.location.href = "login.html"; // Redirect to login page after logout
      });
    });
  }
});
