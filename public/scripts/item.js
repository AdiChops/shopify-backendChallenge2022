let initialName = document.getElementById("name").value;
let initialPrice = document.getElementById("price").value;
let initialStock = document.getElementById("stock").value;
let tags = [];
if(document.getElementById("tagsHidden").value)
  tags = document.getElementById("tagsHidden").value.split(",");
let warehouses = []
if(document.getElementById("warehousesHidden").value)
  warehouses = document.getElementById("warehousesHidden").value.split(",");

let deleteItem = ()=>{
  let d = confirm("Are you sure you want to delete this item?");
  if(d){
    fetch(location.pathname, {
      method: "DELETE"
    })
      .then((response) => {
        if (response.status === 204) {
          alert('Deleted successfully!')
          location.href="/items";
        } else {
          alert("An error occurred :(");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

let resetDefaults = () => {
  tags = [];
  if(document.getElementById("tagsHidden").value)
    tags = document.getElementById("tagsHidden").value.split(",");
  warehouses = []
  if(document.getElementById("warehousesHidden").value)
    warehouses = document.getElementById("warehousesHidden").value.split(",");
  document.getElementById("name").value = initialName;
  document.getElementById("stock").value = initialStock;
  document.getElementById("price").value = initialPrice;
  document.getElementById("tags").innerHTML = "";
  for (let tag of tags) {
    visualTagAdd(tag);
  }
  let wc = document.getElementsByClassName("warehouseCheck");
  for(c of wc){
    c.checked = false;
  }
  for(let w of warehouses){
    document.getElementById(w).checked = true;
  }
};

let toggleEdit = (dis) => {
  document.getElementById("edit").style.display = dis ? "inline" : "none";
  document.getElementById("name").disabled = dis;
  document.getElementById("stock").disabled = dis;
  document.getElementById("price").disabled = dis;
  document.getElementById("addingTags").style.display = dis ? "none" : "block";
  document.getElementById("wareLocs").style.display = dis ? "none" : "block";
  document.getElementById("saveBtn").style.display = dis ? "none" : "inline";
  document.getElementById("cancelBtn").style.display = dis ? "none" : "inline";
  let rt = document.getElementsByClassName("removeTag");
  for(let r of rt){
    r.style.display = dis?"none":"inline";
  }
  if(document.getElementById("warehouses"))
    document.getElementById("warehouses").style.display = dis ? "block" : "none";
};

let saveItem = ()=>{
  let errorsPresent = false;
  if (!document.getElementById("name").value) {
    errorsPresent = true;
    document.getElementById("nameError").style.display = "inline";
  }
  if (
    !document.getElementById("price").value ||
    parseFloat(document.getElementById("price").value) < 0
  ) {
    errorsPresent = true;
    document.getElementById("priceError").style.display = "inline";
  }
  if (
    !document.getElementById("stock").value ||
    parseInt(document.getElementById("stock").value) < 0
  ) {
    errorsPresent = true;
    document.getElementById("stockError").style.display = "inline";
  }
  if (!errorsPresent) {
    let data = {
      "name": document.getElementById("name").value,
      "stock": document.getElementById("stock").value,
      "price": document.getElementById("price").value,
      "tags": tags,
      "warehouseLocations":warehouses
    };
    document.getElementById("nameError").style.display = "none";
    document.getElementById("priceError").style.display = "none";
    document.getElementById("stockError").style.display = "none";
    fetch(location.pathname, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status == 200) {
          location.reload();
        } else {
          alert("An error occurred :(");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

let visualTagAdd = (v)=>{
  let tagSpan = document.createElement("span");
  tagSpan.classList.add("badge");
  tagSpan.classList.add("badge-pill");
  tagSpan.textContent = v;
  let removeTag = document.createElement("span");
  removeTag.innerHTML = "&nbsp;&times;";
  removeTag.classList.add("removeTag");
  tagSpan.appendChild(removeTag);
  document.getElementById("tags").appendChild(tagSpan);
};

document.getElementById("edit").addEventListener("click", () => {
  toggleEdit(false);
});

document.getElementById("deleteItem").addEventListener("click", deleteItem);

document.getElementById("cancelBtn").addEventListener("click", () => {
  resetDefaults();
  toggleEdit(true);
});

document.getElementById("saveBtn").addEventListener("click", saveItem);

document.getElementById("tagAdd").addEventListener("keyup", (e) => {
  if (e.key == "," || e.key == " ") {
    let val = document.getElementById("tagAdd").value.split(/\,|\s/)[0];
    document.getElementById("tagAdd").value = "";
    if (val && tags.indexOf(val) === -1) {
      tags.push(val);
      visualTagAdd(val);
    }
  }
});

document.getElementById("wareLocs").addEventListener("click", (e)=>{
  if(e.target.tagName === "INPUT"){
    console.log(e.target);
    if(e.target.checked){
      warehouses.push(e.target.id);
    }
    else{
      warehouses.splice(e.target.id, 1);
    }
    console.log(warehouses)
  }
});

document.getElementById("tags").addEventListener("click", (e)=>{
  if(e.target.className === "removeTag"){
    e.target.parentNode.parentNode.removeChild(e.target.parentNode);
  }
})