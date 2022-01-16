localStorage.setItem('city', document.getElementById('city').value);
localStorage.setItem('streetNumber', document.getElementById('streetNumber').value);
localStorage.setItem('streetName', document.getElementById('streetName').value);
localStorage.setItem('country', document.getElementById('country').value);
localStorage.setItem('province', document.getElementById('province').value);
localStorage.setItem('postalCode', document.getElementById('postalCode').value);

let resetDefaults = ()=>{
    document.getElementById('city').value = localStorage.getItem('city');
    document.getElementById('streetNumber').value = localStorage.getItem('streetNumber');
    document.getElementById('streetName').value = localStorage.getItem('streetName');
    document.getElementById('country').value = localStorage.getItem('country');
    document.getElementById('province').value = localStorage.getItem('province');
    document.getElementById('postalCode').value = localStorage.getItem('postalCode');
};

let toggleEdit = (dis) =>{
    document.getElementById('edit').style.display = (dis)?'block':'none';
    document.getElementById('city').disabled = dis;
    document.getElementById('streetNumber').disabled = dis;
    document.getElementById('streetName').disabled = dis;
    document.getElementById('country').disabled = dis;
    document.getElementById('province').disabled = dis;
    document.getElementById('postalCode').disabled = dis;
    document.getElementById('saveBtn').style.display = (dis)?'none':'inline';
    document.getElementById('cancelBtn').style.display = (dis)?'none':'inline';
};

document.getElementById('edit').addEventListener('click', ()=>{
    toggleEdit(false);
});

document.getElementById('cancelBtn').addEventListener('click', ()=>{
    resetDefaults();
    toggleEdit(true);
});