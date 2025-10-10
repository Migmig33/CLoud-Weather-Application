const toggleBtn = document.querySelector('.fa-moon');
const body = document.body;

toggleBtn.addEventListener('click', () => {
    body.classList.toggle('light-mode');
});
