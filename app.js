
import {
  auth,
  signOut,
  db,
  doc,
  getDocs,
  collection,
} from "./utils/firebase.js"





let allBlogs = []


function main(){
    let user = JSON.parse(localStorage.getItem('user'))
    console.log(user);

    let LoginLink = document.getElementById("LoginLink")
    let SignupLink = document.getElementById("SignupLink")
    let logoutBtn = document.getElementById("logoutBtn")
    
    let LoginLinkMob = document.getElementById("LoginLinkMob")
    let SignupLinkMob = document.getElementById("SignupLinkMob")
    let logoutBtnMob = document.getElementById("logoutBtnMob")
    
    if(user){
        LoginLink.style.display = "none"
        SignupLink.style.display = "none"
        logoutBtn.classList.remove("hidden")
        
        
        LoginLinkMob.style.display = "none"
        SignupLinkMob.style.display = "none"
        logoutBtnMob.classList.remove("hidden")
    }
}

main()



window.toggleMenu = () => {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}


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

const getBlogs = async () => {
    try {
        const reference = collection(db, "blogs");
        const dt = await getDocs(reference);

        dt.forEach(item => {
            let obj = {
                id: item.id,
                ...item.data(),
            }
            allBlogs.push(obj)
        })

        renderBlogs()
    } catch (err) {
        let loader = document.getElementById("blogLoader")
        if (loader) loader.classList.add("hidden")
        let blogList = document.getElementById("blogList")
        if (blogList) blogList.innerHTML = `<p class="col-span-full text-center text-red-300 text-lg">Could not load blogs. Check Firebase rules.</p>`
        console.error(err);
    }
}
getBlogs()

const renderBlogs = () => {
    let blogList = document.getElementById("blogList")
    let loader = document.getElementById("blogLoader")

    if (loader) loader.classList.add("hidden")

    if (allBlogs.length === 0) {
        blogList.innerHTML = `<p class="col-span-full text-center text-gray-300 text-lg">No blogs published yet.</p>`
        return
    }

    allBlogs.forEach(obj => {
        blogList.innerHTML += `
        <article class="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div class="relative h-48 overflow-hidden">
                <img src="${obj.image || 'https://placehold.co/600x400/1e1b4b/a5b4fc?text=BlogVerse'}" alt="${obj.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                <span class="absolute top-3 left-3 bg-indigo-600/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">${obj.category || 'General'}</span>
            </div>
            <div class="p-6">
                <h3 class="font-bold text-xl mb-2 text-white line-clamp-2">${obj.title}</h3>
                <p class="text-gray-300 mb-4 text-sm">${(obj.content || "").substring(0,90)}...</p>
                <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-400">By <span class="text-white font-semibold">${(obj.userName || '').toUpperCase()}</span></span>
                    <a href="./pages/Blogs/BlogPage/page.html" onclick="getId('${obj.id}')" class="text-indigo-300 hover:text-white text-sm font-semibold">Read More →</a>
                </div>
            </div>
        </article>`
    })
}

window.getId = (id) => {
    localStorage.setItem('blogId', id);
    console.log(id);
}