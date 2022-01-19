/***** ROLLBACK SETUP *****/
let city = document.getElementById("city").value;
let streetNumber = document.getElementById("streetNumber").value;
let streetName = document.getElementById("streetName").value;
let country = document.getElementById("country").value;
let province = document.getElementById("province").value;
let postalCode = document.getElementById("postalCode").value;
let phone = document.getElementById("phone").value;

/***** HELPER FUNCTIONS *****/
let resetDefaults = () => {
  document.getElementById("city").value = city;
  document.getElementById("streetNumber").value = streetNumber;
  document.getElementById("streetName").value = streetName;
  document.getElementById("country").value = country;
  document.getElementById("province").value = province;
  document.getElementById("postalCode").value = postalCode;
  document.getElementById("phone").value = phone;
};

/**
 * Purpose: This function toggles the fields depending on what the user selected (if the user wants to edit or is just viewing).
 * @param {bool} dis Whether or not the fields should be disabled
 */
let toggleEdit = (dis) => {
  if (document.getElementById("edit"))
    document.getElementById("edit").style.display = dis ? "block" : "none";
  document.getElementById("city").disabled = dis;
  document.getElementById("streetNumber").disabled = dis;
  document.getElementById("streetName").disabled = dis;
  document.getElementById("country").disabled = dis;
  document.getElementById("province").disabled = dis;
  document.getElementById("postalCode").disabled = dis;
  document.getElementById("phone").disabled = dis;
  document.getElementById("saveBtn").style.display = dis ? "none" : "inline";
  if (document.getElementById("cancelBtn"))
    document.getElementById("cancelBtn").style.display = dis
      ? "none"
      : "inline";
};

/**
 * Purpose: The purpose of this function is to send the save request to the server.
 * @param {String} method The method that fetch will use. Valid values include {PUT, POST}
 * @param {String} path The path to which the request should be sent (depending on edit or creation)
 */
let saveWarehouse = (method, path) => {
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

    fetch(path, {
      method: method,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status == 200) {
          location.reload();
        } else if (response.status == 201) {
          alert("Warehouse added successfully!");
          location.href = "/warehouses";
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

let deleteWarehouse = () => {
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

/***** EVENT LISTENERS *****/

if (
  document.getElementById("edit") &&
  document.getElementById("delete") &&
  document.getElementById("cancelBtn")
) {
  document.getElementById("edit").addEventListener("click", () => {
    toggleEdit(false);
  });

  document.getElementById("delete").addEventListener("click", deleteWarehouse);

  document.getElementById("cancelBtn").addEventListener("click", () => {
    resetDefaults();
    toggleEdit(true);
  });
} else {
  toggleEdit(false);
}

document.getElementById("saveBtn").addEventListener("click", () => {
  if (document.getElementById("newWarehouse")) {
    saveWarehouse("POST", "/warehouses");
  } else {
    saveWarehouse("PUT", location.pathname);
  }
});
