import {
    auth,
    db,
    doc,
    getDoc,
    signInWithEmailAndPassword,
} from "../../../utils/firebase.js"




window.login = () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email) {
        alert("Email is required.");
        return;
    }

    if (!password) {
        alert("Password is required.");
        return;
    }

    let obj = {
        email: email,
        password: password,
    }
    console.log(obj.email, obj.password);

    signInWithEmailAndPassword(auth, obj.email, obj.password)
    .then(async (res) => {
        const id = res.user.uid;
        const reference = doc(db, "users", id); // Fetching user doc from Firestore
        const snap = await getDoc(reference);
        
        if (snap.exists()) {
            console.log("Login successful", res);
            
            // Store user data in localStorage
            localStorage.setItem("user", JSON.stringify(snap.data()));
            
            // Redirect after 1 second
            setTimeout(() => {
                window.location.replace('../../../index.html');
            }, 1000);
        } else {
            console.log("User data not found in Firestore.");
        }
    })
    .catch((e) => {
        // Improved error message handling
        alert(`Error: ${e.message}`);
    });

}
