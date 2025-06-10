const loginForm = document.getElementById('loginForm');
const submitBtn = loginForm.querySelector('button[type="submit"]');
const btnText = submitBtn.querySelector('.btn-text');
const spinner = submitBtn.querySelector('.spinner-border');
const loginStatus = document.getElementById('loginStatus');

loginForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  // Disable button and show spinner
  submitBtn.disabled = true;
  if (btnText) btnText.textContent = 'Logging in...';
  if (spinner) spinner.classList.remove('d-none');
  if (loginStatus) loginStatus.textContent = '';

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Optional: small delay for UX smoothness
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 800);
    })
    .catch((error) => {
      console.error("Login failed:", error.message);
      if (loginStatus) loginStatus.innerText = "Login failed. " + error.message;

      // Re-enable button and hide spinner
      submitBtn.disabled = false;
      if (btnText) btnText.textContent = 'Login';
      if (spinner) spinner.classList.add('d-none');
    });
});
