let city = document.getElementById("city").value;
let streetNumber = document.getElementById("streetNumber").value;
let streetName = document.getElementById("streetName").value;
let country = document.getElementById("country").value;
let province = document.getElementById("province").value;
let postalCode = document.getElementById("postalCode").value;
let phone = document.getElementById("phone").value;

let resetDefaults = () => {
  document.getElementById("city").value = city
  document.getElementById("streetNumber").value = streetNumber;
  document.getElementById("streetName").value = streetName;
  document.getElementById("country").value = country;
  document.getElementById("province").value = province;
  document.getElementById("postalCode").value = postalCode;
  document.getElementById("phone").value = phone;
};

let toggleEdit = (dis) => {
  document.getElementById("edit").style.display = dis ? "block" : "none";
  document.getElementById("city").disabled = dis;
  document.getElementById("streetNumber").disabled = dis;
  document.getElementById("streetName").disabled = dis;
  document.getElementById("country").disabled = dis;
  document.getElementById("province").disabled = dis;
  document.getElementById("postalCode").disabled = dis;
  document.getElementById("phone").disabled = dis;
  document.getElementById("saveBtn").style.display = dis ? "none" : "inline";
  document.getElementById("cancelBtn").style.display = dis ? "none" : "inline";
};

let saveWarehouse = () => {
  let errorsPresent = false;
  if (!document.getElementById("city").value) {
    errorsPresent = true;
    document.getElementById("cityError").style.display = "inline";
  }
  if (!document.getElementById("streetNumber").value) {
    errorsPresent = true;
    document.getElementById("streetNumberError").style.display = "inline";
  }
  if (!document.getElementById("streetName").value) {
    errorsPresent = true;
    document.getElementById("streetNameError").style.display = "inline";
  }
  if (!document.getElementById("country").value) {
    errorsPresent = true;
    document.getElementById("countryError").style.display = "inline";
  }
  if (!document.getElementById("province").value) {
    errorsPresent = true;
    document.getElementById("provinceError").style.display = "inline";
  }
  if (!document.getElementById("postalCode").value) {
    errorsPresent = true;
    document.getElementById("postalCodeError").style.display = "inline";
  }
  if (!document.getElementById("phone").value) {
    errorsPresent = true;
    document.getElementById("phone").style.display = "inline";
  }
  if (!errorsPresent) {
    let data = {
      city: document.getElementById("city").value,
      streetNumber: document.getElementById("streetNumber").value,
      streetName: document.getElementById("streetName").value,
      country: document.getElementById("country").value,
      province: document.getElementById("province").value,
      postalCode: document.getElementById("postalCode").value,
      phone: document.getElementById("phone").value,
    };

    document.getElementById("cityError").style.display = "none";
    document.getElementById("streetNumberError").style.display = "none";
    document.getElementById("streetNameError").style.display = "none";
    document.getElementById("countryError").style.display = "none";
    document.getElementById("provinceError").style.display = "none";
    document.getElementById("postalCodeError").style.display = "none";
    document.getElementById("phoneError").style.display = "none";

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
          response.json().then((data)=>{
              alert(`An error occurred: ${data.message}`);
          })
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

let deleteWarehouse = ()=>{
    let d = confirm("Are you sure you want to delete this item?");
    if(d){
    fetch(location.pathname, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.status === 204) {
            alert('Deleted successfully!')
            location.href="/items";
          } else {
            response.json().then((data)=>{
                alert(`An error occurred: ${data.message}`);
            })
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
};

document.getElementById("edit").addEventListener("click", () => {
  toggleEdit(false);
});

document.getElementById("delete").addEventListener("click", deleteWarehouse);

document.getElementById("cancelBtn").addEventListener("click", () => {
  resetDefaults();
  toggleEdit(true);
});

document.getElementById("saveBtn").addEventListener("click", saveWarehouse);
