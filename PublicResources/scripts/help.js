//Menu control
document.getElementById("openMenu").addEventListener("click", () => {
    document.querySelector(".dropdownContent").classList.toggle("open");
});
document.getElementById("closeMenu").addEventListener("click", () => {
    document.querySelector(".dropdownContent").classList.toggle("open");
});

let text = document.createElement("p")
    let header = document.createElement("h1") //A dynamic header is created with the proper name for the subpage
    header.textContent = "Help"
    document.getElementById("text").prepend(header) //The header is inserted as the first element in the section "menu"