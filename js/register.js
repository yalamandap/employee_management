const registerForm = document.getElementById('registerForm');
const submitBtn = registerForm.querySelector('button[type="submit"]');

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Bootstrap validation check
  if (!registerForm.checkValidity()) {
    e.stopPropagation();
    registerForm.classList.add('was-validated');
    return;
  }

  // Disable submit button to prevent multiple submits
  submitBtn.disabled = true;
  submitBtn.textContent = 'Registering...';

  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const phone = document.getElementById('phone').value.trim();
  const department = document.getElementById('department').value.trim();
  const designation = document.getElementById('designation').value.trim();
  const dateOfJoining = document.getElementById('dateOfJoining').value;

  try {
    // Optional: Add password strength validation here if desired
    // if (password.length < 6) {
    //   alert('Password should be at least 6 characters');
    //   submitBtn.disabled = false;
    //   submitBtn.textContent = 'Register';
    //   return;
    // }

    // Create Firebase Auth user
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const uid = userCredential.user.uid;

    // Save profile info in Firestore
    await db.collection('employees').doc(uid).set({
      fullName,
      email,
      phone,
      department,
      designation,
      dateOfJoining,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert('✅ Registration successful! Redirecting to login page...');
    registerForm.reset();
    registerForm.classList.remove('was-validated');

    // Redirect to login page (change URL if different)
    window.location.href = 'index.html';

  } catch (error) {
    console.error('Registration error:', error);
    alert('Registration failed: ' + error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Register';
  }
});
