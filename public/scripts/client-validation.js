document.getElementById('add-form').onsubmit = () => {

    clearErrors();
    let isValid = true;

    // Validate Title - must be there
    const title = document.getElementById('title').value.trim();
    if (!title) {
        document.getElementById('err-title').style.display = 'flex';
        isValid = false;
    }

    // Validate Date - must choose one
    const date = document.getElementById('date').value.trim();
    if (!date) {
        document.getElementById('err-date').style.display = 'flex';
        isValid = false;
    }

    return isValid;

};

function clearErrors() {
    let errors = document.getElementsByClassName("err");
    for (let err of errors) {
        err.style.display = "none";
    }
}