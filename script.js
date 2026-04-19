import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const supabase = createClient('https://gkwkorqpktidgxladvzi.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdrd2tvcnFwa3RpZGd4bGFkdnppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMTYzNzAsImV4cCI6MjA4OTU5MjM3MH0.hBT4v2wUyn2KRme6dutz4cK0pApZyF9fonRb0DPyQxM')

//main page
// let user = document.querySelector(".user");
// let user2 = document.querySelector(".user2");
// user.addEventListener("click",()=>{
//     window.location.href = "user.html";
// })
// user2.addEventListener("click",()=>{
//     window.location.href = "user.html";
// })



let home = document.querySelectorAll(".home");
home.forEach(el =>{
    el.addEventListener("click",()=>{
        window.location.href = "index.html";  
    })

})
let logo = document.querySelectorAll(".logo, logo2");
logo.forEach(el =>{
    el.addEventListener("click",()=>{
        window.location.href = "index.html";  
    })

})
let cart_icon = document.querySelectorAll(".fa-cart-shopping");
cart_icon.forEach(el =>{
    el.addEventListener("click",()=>{
        window.location.href = "cart.html";  
    })

})
let nav_product = document.querySelectorAll(".nav-product");
let nav_about = document.querySelectorAll(".nav-about");
let nav_contact = document.querySelectorAll(".nav-contact");

let products = document.querySelector(".products");
let about = document.querySelector(".about");
let contact = document.querySelector(".contact");

let searchbar = document.querySelector("#searchbar")
nav_product.forEach(el =>{
    el.addEventListener("click",()=>{
        products.scrollIntoView({behavior:"smooth"});
    })

})
nav_about.forEach(el =>{
    el.addEventListener("click",()=>{
        about.scrollIntoView({behavior:"smooth"});
    })
})
nav_contact.forEach(el =>{
    el.addEventListener("click",()=>{
        contact.scrollIntoView({behavior:"smooth"});
    })
})





let conatiner = document.querySelector(".container")
let miniContainer = document.querySelector(".miniContainer")



async function loadProducts() {
    const params = new URLSearchParams(window.location.search)
    const id = params.get("id")
    let {data,error } = await supabase
    .from('products_detail')
    .select('*')
    
    if (error){
        console.error(error)
        return
    }
    
    let productDiv = document.createElement("div")
    productDiv.classList.add("products")
    data.forEach(product =>{
        let allproducts = []
        allproducts.push(product.name)
        searchbar.addEventListener("input",e=>{
            let currentvalue = e.target.value.toLowerCase()
            let h2search = document.querySelectorAll("#h2tag")
            h2search.forEach(tag =>{
                if (tag.textContent.toLowerCase().includes(currentvalue)){
                    tag.parentNode.style.display = "block"
                }else{
                    tag.parentNode.style.display = "none"

                }
            })
        })
       
        let productElements = document.createElement("div")
        productElements.classList.add("product")
        productElements.dataset.id = product.id

        let productImg = document.createElement("div")
        productImg.classList.add("product-img")

        let h2tag = document.createElement("h2")
        h2tag.id = "h2tag"
        h2tag.textContent = product.name

        let pricetag = document.createElement("h3")
        pricetag.id = "pricetag"
        pricetag.classList.add("price")
        pricetag.textContent = product.price + " Dh"

        let imgtag = document.createElement("img")
        imgtag.id = "imgtag"
        imgtag.src = product.image
        let cartbtn = document.createElement("button")
        cartbtn.classList.add("add-to-cart")
        cartbtn.textContent = "اضف الى السلة"
        cartbtn.addEventListener("click",(e)=>{
            e.stopPropagation();
            let cart = JSON.parse(localStorage.getItem("cart")) || []
            if(!cart.some(item=>item.name === product.name)){
              cart.push({
                  id:product.id,
                  name:product.name,
                  price:product.price
              })
            }
            localStorage.setItem("cart", JSON.stringify(cart))
            cartbtn.style.backgroundColor = "white"
            cartbtn.style.color = "black"
            // alert("تم الاظافة الى السلة")
        })
        productImg.append(imgtag)
        productElements.append(productImg,h2tag,pricetag,cartbtn )
        productDiv.append(productElements)
        miniContainer.append(productDiv)
    })
    
    let product = document.querySelectorAll(".product");
    product.forEach(product => {
        product.addEventListener("click",()=>{
            let id = product.dataset.id
            window.location.href = `product.html?id=${id}`;  
        })
    });
    

    
   
}

loadProducts()







//  i will create an array and push to it an object that has 
//  the name and pirce  of the project


