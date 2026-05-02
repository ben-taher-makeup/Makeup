import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
let container = document.querySelector(".container");
let nameinput = document.querySelector("#nameInput");
let priceinput = document.querySelector("#priceInput");
let descriptioninput = document.querySelector("#descriptionInput");
let catagoryinput = document.querySelector("#catagoryinput");
let input = document.querySelector("#imageInput");
let uploadbtn = document.querySelector("#uploadBtn");

let logo = document.querySelectorAll(".main, .fa-house" );
logo.forEach(el =>{
    el.addEventListener("click",()=>{
        window.location.href = "index.html";  
    })

})
let nav_about = document.querySelectorAll("#nav-about");
let nav_contact = document.querySelectorAll("#nav-contact");
let nav_pro = document.querySelectorAll("#nav-pro");

nav_about.forEach(el =>{
    el.addEventListener("click",()=>{
        window.location.href = "index.html#nav-about";  
    })

})
nav_pro.forEach(el =>{
    el.addEventListener("click",()=>{
        window.location.href = "products.html";  
    })

})

nav_contact.forEach(el =>{
    el.addEventListener("click",()=>{
        window.location.href = "index.html#nav-contact";  
    })

})

let cartbtn = document.querySelectorAll(".cart-button")
cartbtn.forEach(el =>{
    el.addEventListener("click",()=>{
        window.location.href = "cart.html";  
    })

})

// your Supabase client
const supabase = createClient('https://gkwkorqpktidgxladvzi.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdrd2tvcnFwa3RpZGd4bGFkdnppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMTYzNzAsImV4cCI6MjA4OTU5MjM3MH0.hBT4v2wUyn2KRme6dutz4cK0pApZyF9fonRb0DPyQxM')

let paswordinp = document.querySelector(".pasword-inp")
let paswordbtn = document.querySelector(".paswordbtn")
document.querySelector(".admin").style.display= "none"

paswordbtn.addEventListener("click", ()=>{
    if (paswordinp.value !== "simo mol lmakyaj"){
        alert("كلمة السر غير صحيحة")
        paswordinp.value = ""
        return
    }
    else{
        document.querySelector(".pasword").style.display= "none"
        document.querySelector(".admin").style.display= "block"
        display()

    }

})
paswordinp.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        paswordbtn.click()
    }
})






uploadbtn.addEventListener("click", async()=>{

    let files = input.files;
    let name = nameinput.value;
    let price = priceinput.value;
    let description = descriptioninput.value;
    let imagesUrl = []
    let catagory = catagoryinput.value


    if (!files || !name || !price || !description ){
      return alert("ادخل المعلومات")
    }
    for (let file of files){
      let filepath = Date.now() + '-'+ file.name
      // upload to supabase
      let {error : uploadError} = await supabase.storage
      .from('products')
      .upload(filepath, file)

      if (uploadError){
        console.error(uploadError)
        return
      }
      // get url
      let {data} = supabase.storage
      .from('products')
      .getPublicUrl(filepath)
      imagesUrl.push(data.publicUrl)
}
    // save to database

    let {error :dbEroor} =await supabase
    .from('products_detail')
    .insert([
      {
        name:name,
        price:price,
        image:imagesUrl[0],
        description:description,
        images:imagesUrl,
        catagory:catagory
      }
    ])
    if(dbEroor){
      console.error(dbEroor)
      return
    }
    alert("تم اضافة المنتج")
    nameinput.value = ""
    priceinput.value = ""
    descriptioninput.value = ""
    catagoryinput.value = ""
    input.value = ""
})
async function display() {
    let {data,error } = await supabase
    .from('products_detail')
    .select('*')
    
    if (error){
        console.error(error)
        return
    }
    let edit = document.querySelector(".edit")
    data.forEach(product =>{
        let divtag = document.createElement("tr")
        divtag.className= "displaydiv"

        let nametag = document.createElement("td")
        nametag.textContent = product.name

        let pricetag = document.createElement("td")
        pricetag.textContent = product.price

        let destag = document.createElement("td")
        destag.classList.add("destag")
        destag.textContent = product.description

        let imgholder = document.createElement("td")
        imgholder.classList.add("imgholder")

        let imgtag = document.createElement("img")
        imgtag.src = product.image
        imgtag.style.width = ""
        imgtag.style.height = ""

        

        let btndelete = document.createElement("button")
        btndelete.innerHTML = `<i class="fa-solid fa-trash-can"></i>`
        btndelete.addEventListener("click",async()=>{
            let {error} = await supabase
            .from('products_detail')
            .delete()
            .eq('id', product.id)
            if(error){
                console.log(error)
                return
            }
            alert("deleted")
            divtag.remove()
        })
        let editbtn = document.createElement("button")
        editbtn.textContent = "تعديل"
        editbtn.addEventListener("click",async ()=>{
            let edit_form = document.querySelector(".edit-form")
            edit_form.style.display ="block"

            document.querySelector("#edit-name").value = product.name
            document.querySelector("#edit-price").value = product.price
            document.querySelector("#edit-desc").value = product.description

            localStorage.setItem("editId", product.id)
            edit.style.display ="none"
        })

        imgholder.append(imgtag)
        divtag.append(imgholder,nametag,pricetag,destag,btndelete,editbtn)
        edit.append(divtag)
    })
}
document.querySelector("#save-edit").addEventListener("click",async ()=>{
    let id = localStorage.getItem("editId")

    let newname = document.querySelector("#edit-name").value
    let newprice = document.querySelector("#edit-price").value
    let newdesc = document.querySelector("#edit-desc").value

    let {error} = await supabase
        .from("products_detail")
        .update({
            name: newname,
            price: newprice,
            description: newdesc
        })
        .eq("id",Number(id))
    
    if(error){
        console.log(error)
        return
    }
    alert("تم التعديل")
    location.reload()
})