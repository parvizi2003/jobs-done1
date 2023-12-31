
let form = document.querySelector('.register');
let UNInp = form.querySelector('.username-input');
let UNErr = form.querySelector('.userName-error');
let PInps = form.querySelectorAll('.password-input');
let PErr = form.querySelector('.password-error');
let sub = form.querySelector('.submit-input');
let Ferr = form.querySelector('.form-err');
UNInp.addEventListener('blur', function() {
    if (this.value == '') {
        UNErr.textContent = 'This area must be filled';
        form.dataset.err = true;
    } else {
        UNErr.textContent = '';
        form.dataset.err = false;
    }
})

PInps[0].addEventListener('blur', function() {
    if (PInps[0].value == PInps[1].value && PInps[0].value != '') {
        PErr.textContent = '';
        form.dataset.err = false;
    } else {
        PErr.textContent = 'Passwords should be same';
        form.dataset.err = true;
    }
})

PInps[1].addEventListener('blur', function() {
    if (PInps[0].value == PInps[1].value && PInps[0].value != '') {
        PErr.textContent = '';
        form.dataset.err = false;
    } else {
        PErr.textContent = 'Passwords should be same';
        form.dataset.err = true;
    }
})


form.addEventListener('submit', function(event) {
    event.preventDefault();
    if (this.dataset.err == 'false') {
        this.submit();
    } else {
        Ferr.textContent = 'Set username or match passwords';
    }
})
