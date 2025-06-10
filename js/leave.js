auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = 'index.html';
  }
});

document.getElementById('leaveForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const reason = document.getElementById('reason').value.trim();
  const statusDiv = document.getElementById('leaveStatus');
  statusDiv.style.color = 'red';
  statusDiv.textContent = '';

  if (new Date(endDate) < new Date(startDate)) {
    statusDiv.textContent = 'End date cannot be before start date.';
    return;
  }

  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated.');

    const leaveData = {
      employeeId: user.uid,
      startDate,
      endDate,
      reason,
      status: 'pending',
      appliedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('leaves').add(leaveData);

    statusDiv.style.color = 'green';
    statusDiv.textContent = 'Leave application submitted! Redirecting...';

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 2000);

  } catch (error) {
    statusDiv.textContent = error.message;
  }
});
