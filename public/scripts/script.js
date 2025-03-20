// Implements navigation button functionality on load
window.onload = () => {
    const navButton = document.getElementById('nav');
    let visible = false;
    // Displays or hides the navigation menu appropriatley based on the state of display
    navButton.onclick = () => {
        if (!visible) {
            document.querySelector('.dropdown').style.display = 'block';
            visible = true;
        }
        else {
            document.querySelector('.dropdown').style.display = 'none';
            visible = false;
        }
    }
}