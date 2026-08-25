
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
    try {
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
    } catch (err) {
        let loader = document.getElementById("blogLoader");
        if (loader) loader.classList.add("hidden");
        let blogList = document.getElementById("blogList");
        if (blogList) blogList.innerHTML = `<p class="col-span-full text-center text-red-300 text-lg">Could not load blogs. Check Firebase rules.</p>`;
        console.error(err);
    }
}
getBlogs()

// Function to render the blogs on HTML document
const renderBlogs = () => {
    let blogList = document.getElementById("blogList");
    let loader = document.getElementById("blogLoader");
    if (loader) loader.classList.add("hidden");
    blogList.innerHTML = ''; // Clear the list before rendering

    if (allBlogs.length === 0) {
        blogList.innerHTML = `<p class="col-span-full text-center text-gray-300 text-lg">You haven't written any blogs yet.</p>`;
        return;
    }

    allBlogs.forEach(obj => {
        blogList.innerHTML += `
          <div class="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row items-stretch hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer" onclick="getId('${obj.id}')">
                <!-- Blog Image -->
                <div class="md:w-1/3 w-full overflow-hidden">
                    <img src="${obj.image || 'https://placehold.co/600x400/1e1b4b/a5b4fc?text=BlogVerse'}" alt="Blog Image" class="h-48 md:h-full w-full object-cover group-hover:scale-105 transition-transform duration-500">
                </div>
                <!-- Blog Content -->
                <div class="md:w-2/3 w-full p-6 flex flex-col justify-center">
                    <span class="text-xs text-indigo-300 font-semibold mb-2">${obj.category || 'General'}</span>
                    <h2 class="text-2xl border-b border-white/10 pb-2 font-bold text-white">${obj.title}</h2>
                    <p class="text-gray-300 mt-3 line-clamp-3">${obj.content.substring(0, 150)} <a href="./BlogPage/page.html" onclick="event.stopPropagation(); getId('${obj.id}')" class="text-indigo-300 hover:text-indigo-500 font-semibold">...see more</a></p>
                    <p class="text-gray-400 text-sm mt-3">by <span class="font-semibold text-white">${obj.userName}</span> on <span class="font-semibold">${obj.date}</span></p>
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

