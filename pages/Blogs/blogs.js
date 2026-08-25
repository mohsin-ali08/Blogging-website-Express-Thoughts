
import {
    auth,
     signOut,
     db,
     collection,
     addDoc,
     getDocs,
    } from "../../utils/firebase.js";





// Global variables
let title = document.getElementById('title')
let category = document.getElementById('category')
let content = document.getElementById('content')
let image = document.getElementById('image')
let user = JSON.parse(localStorage.getItem('user'))

const date = new Date()
let allBlogs = []

// Function to get all blogs from db
const getBlogs = async () => {
    const reference = collection(db, "blogs");
    const dt = await getDocs(reference);

    dt.forEach(item => {
        let obj = {
            id: item.id,
            ...item.data(),
        }
        // Filter blogs by the logged-in user
        if (user && obj.userName === user.username) {
            allBlogs.push(obj);
        }
    })

    console.log(allBlogs);
    renderBlogs()

}
getBlogs()

// Function to render the blogs on HTML document
const renderBlogs = () => {
    let blogList = document.getElementById("blogList");
    blogList.innerHTML = ''; // Clear the list before rendering

    allBlogs.forEach(obj => {
        blogList.innerHTML += `
          <div class="bg-white bg-opacity-10 backdrop-filter backdrop-blur-md rounded-lg shadow-lg flex flex-col md:flex-row items-center p-5 mb-6 hover:shadow-2xl transition transform hover:scale-105" onclick="getId('${obj.id}')">
                <!-- Blog Content -->
                <div class="md:w-2/3 w-full md:pr-6">
                    <h2 class="text-3xl border-b pb-2 font-bold text-white">${obj.title}</h2>
                    <p class="text-gray-200 border-t">${obj.content.substring(0, 150)} <a href="./BlogPage/page.html" class="text-indigo-300 hover:text-indigo-500 font-semibold">...see more</a></p>
                    <p class="text-gray-300 py-2 border-t">by <span class="font-semibold font-sm">${obj.userName}</span> on <span class="font-semibold">${obj.date}</span></p>
                    <p class=" text-gray-300 pb-2">Category : <span class="text-white font-semibold font-sm"> ${obj.category}</span></p>
                </div>
                <!-- Blog Image -->
                <div class="md:w-1/3 w-full md:mt-0 py-3">
                    <img src="${obj.image}" alt="Blog Image" class="rounded-lg object-cover w-full h-full">
                </div>
            </div>`
           
    });
}

// Function to get the Blog ID & set into Local stg.
window.getId = (id) => {
    localStorage.setItem('blogId', id)
    window.location.replace('./BlogPage/page.html')
    console.log(id);
}

// Function to handle the blog submission
window.submitBlog = async () => {
    // Check if user is logged in
    if (!user || !user.username) {
        alert("You must be logged in to write a blog.");
        return;
    }

    if (!title.value || !category.value || !content.value){
        alert("Please fill the details")
        return
    }

    let blog = {
        title: title.value,
        category: category.value,
        content: content.value,
        image: image.value,
        date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
        userName: user.username,
    }

    try {
        const reference = collection(db, 'blogs');
        const res = await addDoc(reference, blog)
        console.log(res);
        showNotification("Your blog has been uploaded!");
    } catch (e) {
        alert(e.message)
    }

    title.value = ''
    content.value = ''
    category.value = ''
    image.value = ''
}

// Function to toggle hamburger
window.toggleMenu = () => {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// Function to show the notifications
function showNotification(message) {
    const notification = document.getElementById('blogNotification');
    notification.style.opacity = '1';
    notification.style.visibility = 'visible';
    notification.innerHTML = message;

    // Hide the notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.visibility = 'hidden';
    }, 3000);
}

// Function to handle user activity
function main() {
    // let user = JSON.parse(localStorage.getItem('user'))
    renderBlogs()
    // console.log(user);

    let LoginLink = document.getElementById("LoginLink")
    let SignupLink = document.getElementById("SignupLink")
    let logoutBtn = document.getElementById("logoutBtn")

    let LoginLinkMob = document.getElementById("LoginLinkMob")
    let SignupLinkMob = document.getElementById("SignupLinkMob")
    let logoutBtnMob = document.getElementById("logoutBtnMob")

    if (user) {
        LoginLink.style.display = "none"
        SignupLink.style.display = "none"
        logoutBtn.classList.remove("hidden")


        LoginLinkMob.style.display = "none"
        SignupLinkMob.style.display = "none"
        logoutBtnMob.classList.remove("hidden")
    }
}

main()

// Function to logout the user & empty Local stg.
window.logout = () => {
    signOut(auth)
        .then(() => {
            main();
            localStorage.removeItem("user")
            localStorage.removeItem("blogId")
            window.location.reload()
        })
        .catch((err) => {
            alert(err.message)
        })
}

