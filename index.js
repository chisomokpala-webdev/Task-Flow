let redirectToTasks = document.getElementById("redirect")

redirectToTasks.addEventListener("click", event =>{
    event.preventDefault()

    if (event.target.matches("a div")) {
        window.location.replace("tasks.html")
    }
})