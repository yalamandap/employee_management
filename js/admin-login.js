// admin-login.js

document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  // Only allow the specific admin email and password
  if (email !== 'yalamandap6@gmail.com') {
    alert('Access denied: Invalid admin email.');
    return;
  }

  if (password !== '22471A1239') {
    alert('Access denied: Incorrect password.');
    return;
  }

  try {
    // Sign in with Firebase Auth (this ensures proper auth management)
    await auth.signInWithEmailAndPassword(email, password);

    // Redirect to admin panel page on successful login
    window.location.href = 'admin.html';

  } catch (error) {
    console.error('Login error:', error);
    alert('Failed to login: ' + error.message);
  }
});
