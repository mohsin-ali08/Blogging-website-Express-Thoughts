
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
    const reference = collection(db, "blogs");
    const dt = await getDocs(reference);

    dt.forEach(item => {
        let obj = {
            id: item.id,
            ...item.data(),
        }
        allBlogs.push(obj)
    })

    // console.log(latestBlogs);
    renderBlogs()

}
getBlogs()

const renderBlogs = () => {
    let blogList = document.getElementById("blogList")

    allBlogs.forEach(obj => {
        // console.log(obj.id); 
        
        blogList.innerHTML += `<div class="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-b border-gray-300 rounded  overflow-hidden">
                <img src="${obj.image}" alt="${obj.title, obj.catogory}" class="w-full h-48 object-cover">
                <div class="p-6">
                    <div class="flex justify-between items-center">
                        <h3 class="font-bold text-xl mb-2 border-b text-white">${obj.title}</h3>
                        </div>
                        <p class="text-gray-200 mb-4 border-b ">${obj.content.substring(0,70)}..</p>
                        <a href="./pages/Blogs/BlogPage/page.html" onclick="getId('${obj.id}')" class="text-white hover:text-black text-sm">Read More</a>
                        <p class="text-blue-500" > Author : <span class="text-sm font-semibold text-white border-b">${obj.userName.toUpperCase()}</span></p>
                        </div>
            </div>`
    })
}

window.getId = (id) => {
    localStorage.setItem('blogId', id);
    console.log(id);
}