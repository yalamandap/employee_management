// DOM Elements
const employeesTableBody = document.querySelector('#employeesTable tbody');
const employeeForm = document.getElementById('employeeForm');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Track current editing employee ID (null means adding new)
let editEmployeeId = null;

// Auth state check and admin validation
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = 'index.html'; // redirect to login if not logged in
    return;
  }
  if (user.email !== 'yalamandap6@gmail.com') {
    alert('You do not have admin access.');
    auth.signOut();
    window.location.href = 'index.html';
    return;
  }
  loadEmployees();
});

// Logout button
document.getElementById('logoutBtn').addEventListener('click', async () => {
  try {
    await auth.signOut();  // Wait for sign-out
    window.location.href = 'index.html';  // Then redirect
  } catch (error) {
    console.error('Logout failed:', error);
    alert('Logout failed. Please try again.');
  }
});


// Load employees from Firestore and populate table
async function loadEmployees() {
  employeesTableBody.innerHTML = '';
  try {
    const snapshot = await db.collection('employees').orderBy('name').get();
    snapshot.forEach(doc => {
      const emp = doc.data();
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', doc.id);

      tr.innerHTML = `
        <td class="py-3 px-6">${emp.name}</td>
        <td class="py-3 px-6">${emp.email}</td>
        <td class="py-3 px-6">${emp.phone}</td>
        <td class="py-3 px-6">${emp.department}</td>
        <td class="py-3 px-6">${emp.designation}</td>
        <td class="py-3 px-6">${emp.dateOfJoining}</td>
        <td class="py-3 px-6 text-center">
          <button class="btn-action edit" data-id="${doc.id}">Edit</button>
          <button class="btn-action delete" data-id="${doc.id}">Delete</button>
        </td>
      `;

      employeesTableBody.appendChild(tr);
    });

    attachTableListeners();

  } catch (error) {
    console.error('Error loading employees:', error);
    alert('Failed to load employees.');
  }
}

// Attach listeners to Edit and Delete buttons
function attachTableListeners() {
  employeesTableBody.addEventListener('click', async (e) => {
    const target = e.target;
    if (target.classList.contains('edit')) {
      onEditEmployee(target.dataset.id);
    } else if (target.classList.contains('delete')) {
      onDeleteEmployee(target.dataset.id);
    }
  });
}

// Edit employee handler
async function onEditEmployee(id) {
  try {
    const doc = await db.collection('employees').doc(id).get();
    if (!doc.exists) {
      alert('Employee not found');
      return;
    }
    const emp = doc.data();

    // Populate form with employee data
    employeeForm.empName.value = emp.name;
    employeeForm.empEmail.value = emp.email;
    employeeForm.empPhone.value = emp.phone;
    employeeForm.empDepartment.value = emp.department;
    employeeForm.empDesignation.value = emp.designation;
    employeeForm.empDateOfJoining.value = emp.dateOfJoining;

    // Update form UI for editing
    editEmployeeId = id;
    formTitle.textContent = 'Edit Employee';
    submitBtn.textContent = 'Update Employee';
    cancelEditBtn.classList.remove('hidden');

  } catch (error) {
    console.error('Error fetching employee:', error);
    alert('Failed to load employee data.');
  }
}

// Delete employee handler
async function onDeleteEmployee(id) {
  if (confirm('Are you sure you want to delete this employee?')) {
    try {
      await db.collection('employees').doc(id).delete();
      alert('Employee deleted.');
      loadEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Failed to delete employee.');
    }
  }
}

// Cancel edit button handler
cancelEditBtn.addEventListener('click', () => {
  resetForm();
});

// Form submit handler for add/update
employeeForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = employeeForm.empName.value.trim();
  const email = employeeForm.empEmail.value.trim();
  const phone = employeeForm.empPhone.value.trim();
  const department = employeeForm.empDepartment.value.trim();
  const designation = employeeForm.empDesignation.value.trim();
  const dateOfJoining = employeeForm.empDateOfJoining.value;

  if (!name || !email || !phone || !department || !designation || !dateOfJoining) {
    alert('Please fill all fields.');
    return;
  }

  try {
    if (editEmployeeId) {
      // Update employee
      await db.collection('employees').doc(editEmployeeId).update({
        name,
        email,
        phone,
        department,
        designation,
        dateOfJoining
      });
      alert('Employee updated successfully!');
    } else {
      // Add new employee
      await db.collection('employees').add({
        name,
        email,
        phone,
        department,
        designation,
        dateOfJoining
      });
      alert('Employee added successfully!');
    }

    resetForm();
    loadEmployees();

  } catch (error) {
    console.error('Error saving employee:', error);
    alert('Failed to save employee.');
  }
});

// Reset form to initial state
function resetForm() {
  employeeForm.reset();
  editEmployeeId = null;
  formTitle.textContent = 'Add New Employee';
  submitBtn.textContent = 'Add Employee';
  cancelEditBtn.classList.add('hidden');
}

