const toggleBtn = document.querySelector('.fa-moon');
const body = document.body;

toggleBtn.addEventListener('click', () => {
    body.classList.toggle('light-mode');
});

const openCLoudBot = document.getElementById("openCLoudBot");
const CLoudBot = document.getElementById("CLoudBot");
const closeCLoudBot =  document.getElementById("closeCLoudBot");

openCLoudBot.addEventListener("click", () => {
    CLoudBot.classList.add("active")
});

closeCLoudBot.addEventListener("click", () => {
    CLoudBot.classList.remove("active")
});
