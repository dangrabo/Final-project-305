window.onload = () => {
    const navButton = document.getElementById('nav');
    let visible = false;
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

