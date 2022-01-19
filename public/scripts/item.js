/***** ROLLBACK SETUP *****/
let initialName = document.getElementById("name").value;
let initialPrice = document.getElementById("price").value;
let initialStock = document.getElementById("stock").value;
let initialDescription = document.getElementById("description").value;
let tags = [];
let warehouses = [];

/***** HELPER FUNCTIONS *****/
let deleteItem = () => {
  let d = confirm("Are you sure you want to delete this item?");
  if (d) {
    fetch(location.pathname, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.status === 204) {
          alert("Deleted successfully!");
          location.href = "/items";
        } else {
          alert("An error occurred :(");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

let resetDefaults = () => {
  tags = [];
  if (document.getElementById("tagsHidden").value)
    tags = document.getElementById("tagsHidden").value.split(",");
  warehouses = [];
  if (document.getElementById("warehousesHidden").value)
    warehouses = document.getElementById("warehousesHidden").value.split(",");
  document.getElementById("name").value = initialName;
  document.getElementById("stock").value = initialStock;
  document.getElementById("price").value = initialPrice;
  document.getElementById("description").value = initialDescription;
  document.getElementById("tags").innerHTML = "";
  for (let tag of tags) {
    visualTagAdd(tag);
  }
  let wc = document.getElementsByClassName("warehouseCheck");
  for (c of wc) {
    c.checked = false;
  }
  for (let w of warehouses) {
    document.getElementById(w).checked = true;
  }
};

/**
 * Purpose: This function toggles the fields depending on what the user selected (if the user wants to edit or is just viewing).
 * @param {bool} dis Whether or not the fields should be disabled
 */
let toggleEdit = (dis) => {
  // verifying if edit is there or if it's a new item
  if (document.getElementById("edit"))
    document.getElementById("edit").style.display = dis ? "inline" : "none";
  document.getElementById("name").disabled = dis;
  document.getElementById("stock").disabled = dis;
  document.getElementById("price").disabled = dis;
  document.getElementById("description").disabled = dis;
  document.getElementById("addingTags").style.display = dis ? "none" : "block";
  document.getElementById("wareLocs").style.display = dis ? "none" : "block";
  document.getElementById("saveBtn").style.display = dis ? "none" : "inline";

  // verifying if cancel button is there or if it's a new item
  if (document.getElementById("cancelBtn"))
    document.getElementById("cancelBtn").style.display = dis
      ? "none"
      : "inline";
  let rt = document.getElementsByClassName("removeTag");
  for (let r of rt) {
    r.style.display = dis ? "none" : "inline";
  }
  if (document.getElementById("warehouses"))
    document.getElementById("warehouses").style.display = dis
      ? "block"
      : "none";
};

/**
 * Purpose: The purpose of this function is to send the save request to the server.
 * @param {String} method The method that fetch will use. Valid values include {PUT, POST}
 * @param {String} path The path to which the request should be sent (depending on edit or creation)
 */
let saveItem = (method, path) => {
  let errorsPresent = false;
  if (!document.getElementById("name").value) {
    errorsPresent = true;
    document.getElementById("nameError").style.display = "inline";
  }
  if (!document.getElementById("description").value) {
    errorsPresent = true;
    document.getElementById("descriptionError").style.display = "inline";
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
      name: document.getElementById("name").value,
      stock: document.getElementById("stock").value,
      description: document.getElementById("description").value,
      price: document.getElementById("price").value,
      tags: tags,
      warehouseLocations: warehouses,
    };
    document.getElementById("nameError").style.display = "none";
    document.getElementById("descriptionError").style.display = "none";
    document.getElementById("priceError").style.display = "none";
    document.getElementById("stockError").style.display = "none";
    fetch(path, {
      method: method,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          location.reload();
        } else if (response.status === 201) {
          alert("Item successfully added!");
          location.href = "/items";
        } else {
          response.json().then((data) => {
            alert(`An error occurred: ${data.message}`);
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

/**
 * 
 * @param {String} v The value of the tag
 */
let visualTagAdd = (v) => {
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

if (document.getElementById("createItem")) {
  toggleEdit(false);
} else {
  if (document.getElementById("tagsHidden").value)
    tags = document.getElementById("tagsHidden").value.split(",");
  if (document.getElementById("warehousesHidden").value)
    warehouses = document.getElementById("warehousesHidden").value.split(",");
}

if (document.getElementById("edit") && document.getElementById("deleteItem")) {
  document.getElementById("edit").addEventListener("click", () => {
    toggleEdit(false);
  });

  document.getElementById("deleteItem").addEventListener("click", deleteItem);

  document.getElementById("cancelBtn").addEventListener("click", () => {
    resetDefaults();
    toggleEdit(true);
  });
}

/***** EVENT LISTENERS ******/
document.getElementById("saveBtn").addEventListener("click", () => {
  // checking if creating item or editing item
  if (document.getElementById("createItem")) {
    saveItem("POST", "/items");
  } else {
    saveItem("PUT", location.pathname);
  }
});

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

document.getElementById("wareLocs").addEventListener("click", (e) => {
  if (e.target.tagName === "INPUT") {
    console.log(e.target);
    if (e.target.checked) {
      warehouses.push(e.target.id);
    } else {
      warehouses.splice(e.target.id, 1);
    }
    console.log(warehouses);
  }
});

document.getElementById("tags").addEventListener("click", (e) => {
  if (e.target.className === "removeTag") {
    e.target.parentNode.parentNode.removeChild(e.target.parentNode);
  }
});
