const firebaseConfig = {
    apiKey: "AIzaSyAwm4NUEBYgNVmhJAeZ96hQzQO_DRAjkhc",
    authDomain: "employee-management-syst-be12e.firebaseapp.com",
    projectId: "employee-management-syst-be12e",
    storageBucket: "employee-management-syst-be12e.appspot.com",
    messagingSenderId: "872360108971",
    appId: "1:872360108971:web:73f2b6d2b61f001965e8ee",
    measurementId: "G-8RQR89E0B0"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

window.auth = auth;
window.db = db;
window.storage = storage;
