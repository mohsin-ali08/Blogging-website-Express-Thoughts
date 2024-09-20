
import {
  auth,
  createUserWithEmailAndPassword,
  db,
  doc,
  setDoc,
} from "../../../utils/firebase.js"



window.signup = () => {
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username) {
    alert("Username is required.");
    return;
  }

  if (!email) {
    alert("Email is required.");
    return;
  }

  if (!password) {
    alert("Password is required.");
    return;
  }

  // Password length validation (minimum 6 characters)
  if (password.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }

  let obj = {
    username: username,
    email: email,
    password: password,
  }

  console.log(obj);

  createUserWithEmailAndPassword(auth, obj.email, obj.password)
  .then((res) => {
    obj.id = res.user.uid;

    const reference = doc(db, 'users', obj.id);
    setDoc(reference, obj)
    .then(()=>{
      console.log("Data sent successfully");
      setTimeout(() => {
        window.location.replace('../login/login.html');
      }, 1000);
    })
    .catch((e)=>{
      console.log(e.message);
    })
  })
  .catch((e) => {
    alert(e.message);
  });
}
