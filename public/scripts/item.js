let initialName = document.getElementById("name").value;
let initialPrice = document.getElementById("price").value;
let initialStock = document.getElementById("stock").value;
let tags = document.getElementById("tagsHidden").value.split(",");
let newTags = [];

let resetDefaults = () => {
  document.getElementById("name").value = initialName;
  document.getElementById("stock").value = initialStock;
  document.getElementById("price").value = initialPrice;
  document.getElementById("tags").innerHTML = "";
  for (let tag of tags) {
    let tagSpan = document.createElement("span");
    tagSpan.classList.add("badge");
    tagSpan.classList.add("badge-pill");
    tagSpan.textContent = tag;
    document.getElementById("tags").appendChild(tagSpan);
  }
};

let toggleEdit = (dis) => {
  newTags = [];
  document.getElementById("edit").style.display = dis ? "block" : "none";
  document.getElementById("name").disabled = dis;
  document.getElementById("stock").disabled = dis;
  document.getElementById("price").disabled = dis;
  document.getElementById("addingTags").style.display = dis ? "none" : "block";
  document.getElementById("saveBtn").style.display = dis ? "none" : "inline";
  document.getElementById("cancelBtn").style.display = dis ? "none" : "inline";
};

document.getElementById("edit").addEventListener("click", () => {
  toggleEdit(false);
});

document.getElementById("cancelBtn").addEventListener("click", () => {
  resetDefaults();
  toggleEdit(true);
});

document.getElementById("saveBtn").addEventListener("click", () => {
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
      "tags": tags.concat(newTags),
    };
    console.log(data.tags);
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
});

document.getElementById("tagAdd").addEventListener("keyup", (e) => {
  if (e.key == "," || e.key == " ") {
    let val = document.getElementById("tagAdd").value.split(/\,|\s/)[0];
    document.getElementById("tagAdd").value = "";
    if (val && tags.indexOf(val) === -1 && newTags.indexOf(val) == -1) {
      newTags.push(val);
      let tagSpan = document.createElement("span");
      tagSpan.classList.add("badge");
      tagSpan.classList.add("badge-pill");
      tagSpan.textContent = val;
      document.getElementById("tags").appendChild(tagSpan);
    }
  }
});
