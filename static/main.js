let rows = document.querySelectorAll('.index__table-row');

for (let i = 0; i < rows.length; i++) {
    let cells = rows[i].children;
    for (let j = 0; j < cells.length; j++) {
        cells[j].addEventListener('click', function addEditor() {
        let content = this.textContent;
        this.textContent = '';

        let input = createInput('text', content, 'edit');
        let form = createForm('/editCell-' + i + j);
        form.append(input);
        input.addEventListener('blur', function() {
            form.submit();
        })
        this.append(form);
        input.focus();
        this.removeEventListener('click', addEditor);
        })
    }

    let td = document.createElement('td');
    let form = createForm('/delRow-' + i);
    let input = createInput('submit', 'Delete', 'del');
    form.append(input);
    td.append(form);
    rows[i].append(td);
}

function createForm(action) {
    let form = document.createElement('form');
    form.action = action;
    form.method = 'post';
    return form;
}

function createInput(type, value, name) {
    let input = document.createElement('input');
    input.type = type;
    input.value = value;
    input.name = name;
    return input;
}
