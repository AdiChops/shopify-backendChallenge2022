localStorage.setItem('name', document.getElementById('name').value);
localStorage.setItem('price', document.getElementById('price').value);
localStorage.setItem('stock', document.getElementById('stock').value);

let resetDefaults = ()=>{
    document.getElementById('name').value = localStorage.getItem('name');
    document.getElementById('stock').value = localStorage.getItem('stock');
    document.getElementById('price').value = localStorage.getItem('price');
};

let toggleEdit = (dis) =>{
    document.getElementById('edit').style.display = (dis)?'block':'none';
    document.getElementById('name').disabled = dis;
    document.getElementById('stock').disabled = dis;
    document.getElementById('price').disabled = dis;
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