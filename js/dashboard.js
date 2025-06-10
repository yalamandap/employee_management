// js/dashboard.js
window.addEventListener('DOMContentLoaded', () => {
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = 'index.html';
      return;
    }

    try {
      // Fetch employee data from Firestore
      const doc = await db.collection('employees').doc(user.uid).get();
      if (!doc.exists) {
        console.warn('No employee data found for user:', user.uid);
        return;
      }

      const data = doc.data();

      // Populate profile info (main card)
      document.getElementById('fullName').textContent = data.fullName || data.name || 'N/A';
      document.getElementById('email').textContent = data.email || user.email || 'N/A';
      document.getElementById('phone').textContent = data.phone || 'N/A';
      document.getElementById('department').textContent = data.department || 'N/A';
      document.getElementById('designation').textContent = data.designation || 'N/A';
      document.getElementById('dateOfJoining').textContent = data.dateOfJoining || 'N/A';

      // Populate sidebar profile info
      document.getElementById('fullNameSidebar').textContent = data.fullName || data.name || 'N/A';
      document.getElementById('emailSidebar').textContent = data.email || user.email || 'N/A';

      // Load profile image from Firebase Storage
      try {
        const storageRef = firebase.storage().ref(`profile_pictures/${user.uid}`);
        const url = await storageRef.getDownloadURL();
        document.getElementById('profilePic').src = url;
        document.getElementById('profilePicSidebar').src = url;
      } catch (storageErr) {
        console.warn('No profile picture found, using default.', storageErr);
        // Optionally set a default avatar image here:
        const defaultAvatar = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(data.fullName || 'User');
        document.getElementById('profilePic').src = defaultAvatar;
        document.getElementById('profilePicSidebar').src = defaultAvatar;
      }

      // Fetch and display stats (example: leaves, projects, tasks, hours)
      // Replace these with your actual Firestore collections or fields
      const leavesSnapshot = await db.collection('leaves')
        .where('employeeId', '==', user.uid)
        .where('status', '==', 'approved')
        .get();
      document.getElementById('leavesTaken').textContent = leavesSnapshot.size;

      const projectsSnapshot = await db.collection('projects')
        .where('members', 'array-contains', user.uid)
        .get();
      document.getElementById('projectsCount').textContent = projectsSnapshot.size;

      const tasksSnapshot = await db.collection('tasks')
        .where('assignedTo', '==', user.uid)
        .where('status', '==', 'pending')
        .get();
      document.getElementById('pendingTasks').textContent = tasksSnapshot.size;

      // Example: sum hours logged from 'worklogs' collection
      const worklogsSnapshot = await db.collection('worklogs')
        .where('employeeId', '==', user.uid)
        .get();
      let totalHours = 0;
      worklogsSnapshot.forEach(doc => {
        const hours = doc.data().hours || 0;
        totalHours += hours;
      });
      document.getElementById('hoursLogged').textContent = totalHours.toFixed(1);

      // Load recent activity feed (example: last 5 activities)
      const activityFeed = document.getElementById('activityFeed');
      activityFeed.innerHTML = ''; // Clear existing

      const activitiesSnapshot = await db.collection('activities')
        .where('employeeId', '==', user.uid)
        .orderBy('timestamp', 'desc')
        .limit(5)
        .get();

      if (activitiesSnapshot.empty) {
        activityFeed.innerHTML = '<li class="text-gray-600 italic">No recent activity.</li>';
      } else {
        activitiesSnapshot.forEach(doc => {
          const activity = doc.data();
          const time = activity.timestamp?.toDate().toLocaleString() || 'Unknown time';
          const li = document.createElement('li');
          li.className = 'flex items-start gap-3';

          li.innerHTML = `
            <i class="fas fa-check-circle text-green-500 mt-1"></i>
            <div>
              <p class="text-gray-800 font-semibold">${activity.title || 'Activity'}</p>
              <p class="text-gray-600 text-sm">${activity.description || ''}</p>
              <p class="text-gray-400 text-xs mt-1">${time}</p>
            </div>
          `;
          activityFeed.appendChild(li);
        });
      }

    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      alert('Failed to load dashboard data. Please try again later.');
    }
  });

  // Logout button handler
  document.getElementById('logoutBtn').addEventListener('click', () => {
    auth.signOut()
      .then(() => {
        window.location.href = 'index.html';
      })
      .catch(err => {
        console.error('Logout failed:', err);
        alert('Logout failed. Please try again.');
      });
  });
});
