let form = document.querySelector('.register');
let UNInp = form.querySelector('.username-input');
let UNErr = form.querySelector('.userName-error');
let PInps = form.querySelectorAll('.password-input');
let PErr = form.querySelector('.password-error');
let sub = form.querySelector('.submit-input');
let Ferr = form.querySelector('.form-err');

UNInp.addEventListener('blur', function() {
    let booleans = form.dataset.err.split(',');
    if (this.value == '') {
        UNErr.textContent = 'This area must be filled';
        booleans[0] = 0
    } else {
        UNErr.textContent = '';
        booleans[0] = 1
    }
    form.dataset.err = booleans.join(',');
})

PInps[0].addEventListener('blur', function() {
    let booleans = form.dataset.err.split(',');
    if (PInps[0].value == PInps[1].value && PInps[0].value != '') {
        PErr.textContent = '';
        booleans[1] = 1;
    } else {
        PErr.textContent = 'Passwords should be same';
        booleans[1] = 0;
    }
    form.dataset.err = booleans.join(',');
})

PInps[1].addEventListener('blur', function() {
    let booleans = form.dataset.err.split(',');
    if (PInps[0].value == PInps[1].value && PInps[0].value != '') {
        PErr.textContent = '';
        booleans[1] = 1;
        booleans[2] = 1;
    } else {
        PErr.textContent = 'Passwords should be same';
        booleans[2] = 0;
    }
    form.dataset.err = booleans.join(',');
})


form.addEventListener('submit', function(event) {
    event.preventDefault();
    if (this.dataset.err == '1,1,1') {
        this.submit();
    } else {
        Ferr.textContent = 'Set username or match passwords';
    }
})
