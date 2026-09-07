// Redirect button for the homepage hero section
let redirectToTasks = document.getElementById("redirect")

// Navigate to the tasks page when the CTA is clicked
redirectToTasks.addEventListener("click", event =>{
    event.preventDefault()

    if (event.target.matches("a div")) {
        window.location.replace("Tasks-Page-Folder/tasks.html")
    }
})