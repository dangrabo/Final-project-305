// Checks to see if basic form requirements are met before submitting task info for backend validation
document.getElementById('add-form').onsubmit = () => {
    clearErrors();
    let isValid = true;

    // Validate Title - Ensures that a titles was entered
    const title = document.getElementById('title').value.trim();
    if (!title) {
        document.getElementById('err-title').style.display = 'flex';
        isValid = false;
    }

    // Validate Date - Ensures that a date was chosen
    const date = document.getElementById('date').value.trim();
    if (!date) {
        document.getElementById('err-date').style.display = 'flex';
        isValid = false;
    }

    // Returns true if form info passes validation, false if it does not
    return isValid;
};

// Clears all error messages before checking
function clearErrors() {
    let errors = document.getElementsByClassName("err");
    for (let err of errors) {
        err.style.display = "none";
    }
}