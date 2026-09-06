// =========================
// Global references and app state
// =========================
let homePageredirect = document.getElementById("redirect")
let taskTitleInput = document.querySelector('[name="title"]')
let taskDescriptionInput = document.querySelector('[name="desc"]')
let form = document.querySelector(".input-field")
let taskCont = document.querySelector(".tasks-container")
let inProgressFilter = document.querySelector(".filters p:nth-child(1)")
let completedFilter = document.querySelector(".filters p:nth-child(2)")
let taskCountActive = document.getElementById("task-count-active")
let taskCountCompleted = document.getElementById("task-count-completed")
let makeSure = document.querySelector(".make-sure")
let overlay = document.querySelector(".overlay")
const byTitleSearch = document.querySelector('[name="search-by-letter"]')

// Active and completed task collections
let tasks = []
let completed = []
let recover = localStorage.getItem("saved")
let recoverCompleted = localStorage.getItem("completed")

// Update the floating task count badges
function updateTaskCounters() {
    taskCountActive.textContent = tasks.length
    taskCountCompleted.textContent = completed.length

    taskCountActive.style.display = tasks.length > 0 ? "inline-flex" : "none"
    taskCountCompleted.style.display = completed.length > 0 ? "inline-flex" : "none"
}

// Save both task lists to localStorage so refreshes keep data
function saveTasksState() {
    localStorage.setItem("saved", JSON.stringify(tasks))
    localStorage.setItem("completed", JSON.stringify(completed))
}

// Clear and re-render the visible task list depending on the current filter
function refreshTaskView() {
    taskCont.innerHTML = ""

    if (completedFilter.classList.contains("active")) {
        createCompletedTask()
    } else {
        createTask()
    }

    updateTaskCounters()
}

// Restore saved data from localStorage when the page loads
if (recoverCompleted !== null) {
    completed = JSON.parse(recoverCompleted)
}
if (recover !== null) {
    tasks = JSON.parse(recover)
}

// Default view is the active tasks list
inProgressFilter.classList.add("active")
completedFilter.classList.remove("active")

if (tasks.length > 0) {
    createTask()
} else {
    const emptyStatePlaceholder = document.createElement("h2")
    emptyStatePlaceholder.className = "none"
    emptyStatePlaceholder.textContent = "No Active Tasks"
    taskCont.appendChild(emptyStatePlaceholder)
}

updateTaskCounters()


// Show the custom modal message used for validation feedback
function showCustomPopUp(message) {
    const modal = document.querySelector("#myModal")

    const modalMessage = modal.querySelector("#modalmessage")

    modalMessage.textContent = message
    modal.showModal();

    modal.addEventListener("click", event => {
        event.preventDefault()
        if (event.target.matches("button")) {
            modal.close()
        }
    })
}

// Add a new task from the form and immediately refresh the view
form.addEventListener("submit", event => {
    event.preventDefault()


    if (taskTitleInput.value.trim() === "" && taskDescriptionInput.value.trim() === "") {
        return showCustomPopUp("Sorry, you can't add an empty task")
    }

    if (taskDescriptionInput.value.trim() === "") {
        return showCustomPopUp("Sorry, you can't add a task without a description")

    }

    if (taskTitleInput.value.trim() === "") {
        return showCustomPopUp("Sorry, you can't add a task without a title")
    }

    const formData = new FormData(form)

    const newTask = {
        title: formData.get("title"),
        desc: formData.get("desc")
    }

    tasks.push(newTask)

    saveTasksState()
    refreshTaskView()
    form.reset()

})

// Switch to the active task list when the filter is clicked
inProgressFilter.addEventListener("click", () => {
    inProgressFilter.classList.add("active")
    completedFilter.classList.remove("active")
    refreshTaskView()
})

// Switch to the completed task list when the filter is clicked
completedFilter.addEventListener("click", () => {
    completedFilter.classList.add("active")
    inProgressFilter.classList.remove("active")
    refreshTaskView()
})

// Render all active tasks into the list container
function createTask() {
    inProgressFilter.classList.add("active")
    completedFilter.classList.remove("active")


    tasks.forEach((task, index) => {
        const tasksHouse = document.createElement("div")
        tasksHouse.className = "tasks"

        const number = document.createElement("div")
        number.className = "index"
        const numberP = document.createElement("p")
        numberP.textContent = index + 1
        number.appendChild(numberP)

        const middle = document.createElement("div")
        middle.className = "middle"
        const firstMiddleP = document.createElement("p")
        firstMiddleP.textContent = task.title


        const line = document.createElement("div")
        line.className = "line"


        const secondMiddleP = document.createElement("p")
        secondMiddleP.textContent = task.desc
        middle.append(firstMiddleP, line, secondMiddleP)


        const icons = document.createElement("div")
        icons.className = "action-icons"
        const check = document.createElement("input")
        check.setAttribute("type", "checkbox")
        check.setAttribute("name", "done")
        check.checked = false;
        const edit = document.createElement("span")
        edit.innerHTML = '<i class="fas fa-pen"></i>'
        edit.setAttribute("edit-index", index)
        const del = document.createElement("span")
        del.innerHTML = '<i class="fas fa-trash"></i>'
        del.className = "delete"
        del.setAttribute("data-index", index)
        icons.append(check, edit, del)



        tasksHouse.append(number, middle, icons)

        taskCont.appendChild(tasksHouse)


        edit.addEventListener("click", (event) => {
            const taskIndex = edit.getAttribute("edit-index")
            const formEdit = overlay.querySelector(".edit")

            const newFormEdit = formEdit.cloneNode(true)
            formEdit.parentNode.replaceChild(newFormEdit, formEdit)

            overlay.classList.add("active")

            newFormEdit.querySelector('[name="title-edit"]').value = task.title
            newFormEdit.querySelector('[name="description-edit"]').value = task.desc


            newFormEdit.addEventListener("click", event => {
                if (event.target.matches("p")) {
                    return overlay.classList.remove("active")
                }
            })

            newFormEdit.addEventListener("submit", event => {
                event.preventDefault()

                const formData = new FormData(newFormEdit)

                formData.get("title-edit");
                formData.get("description-edit");

                tasks[taskIndex] = {
                    title: formData.get("title-edit"),
                    desc: formData.get("description-edit")
                }

                saveTasksState()
                overlay.classList.remove("active")
                refreshTaskView()
            })

        })


        del.addEventListener("click", () => {
            const taskIndex = del.getAttribute("data-index")
            const confirmBtn = makeSure.querySelector("#confirm-delete")

            // Remove old listeners
            const newConfirmBtn = confirmBtn.cloneNode(true)
            confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn)

            makeSure.classList.add("active")

            makeSure.querySelector("p").innerHTML = `Are you sure you want to delete task <b><i>${task.title}</i></b>`

            newConfirmBtn.addEventListener("click", () => {
                tasks.splice(taskIndex, 1)
                saveTasksState()
                makeSure.classList.remove("active")
                refreshTaskView()
            })

            makeSure.querySelector("#cancel-delete").addEventListener("click", () => {
                makeSure.classList.remove("active")
            })
        })

        check.addEventListener("click", () => {
            if (completedFilter.classList.contains("active")) {
                tasks.push(task)
                completed.splice(index, 1)
            } else {
                completed.push(task)
                tasks.splice(index, 1)
            }

            saveTasksState()
            refreshTaskView()
        })
    })

    updateTaskCounters()

    if (taskCont.childNodes.length === 0) {
        const emptyStatePlaceholder = document.createElement("h2")
        emptyStatePlaceholder.className = "none"
        emptyStatePlaceholder.textContent = "No Active Tasks"
        taskCont.appendChild(emptyStatePlaceholder)
    }

}

// Render all completed tasks into the list container
function createCompletedTask() {
    completedFilter.classList.add("active")
    inProgressFilter.classList.remove("active")

    completed.forEach((task, index) => {
        const tasksHouse = document.createElement("div")
        tasksHouse.className = "tasks"

        const number = document.createElement("div")
        number.className = "index"
        const numberP = document.createElement("p")
        numberP.textContent = index + 1
        number.appendChild(numberP)

        const middle = document.createElement("div")
        middle.className = "middle"
        const firstMiddleP = document.createElement("p")
        firstMiddleP.textContent = task.title


        const line = document.createElement("div")
        line.className = "line"


        const secondMiddleP = document.createElement("p")
        secondMiddleP.textContent = task.desc
        middle.append(firstMiddleP, line, secondMiddleP)


        const icons = document.createElement("div")
        icons.className = "action-icons"
        const check = document.createElement("input")
        check.setAttribute("type", "checkbox")
        check.setAttribute("name", "done")
        check.checked = true
        const edit = document.createElement("span")
        edit.innerHTML = '<i class="fas fa-pen"></i>'
        edit.setAttribute("edit-index-2", index)
        const del = document.createElement("span")
        del.innerHTML = '<i class="fas fa-trash"></i>'
        del.className = "delete"
        del.setAttribute("data-index-2", index)
        icons.append(check, edit, del)



        tasksHouse.append(number, middle, icons)

        taskCont.appendChild(tasksHouse)

        edit.addEventListener("click", () => {
            showCustomPopUp("Completed tasks can't be deleted")
        })

        del.addEventListener("click", () => {
            const taskIndex = del.getAttribute("data-index-2")
            const confirmBtn = makeSure.querySelector("#confirm-delete")

            // Remove old listeners
            const newConfirmBtn = confirmBtn.cloneNode(true)
            confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn)

            makeSure.classList.add("active")

            makeSure.querySelector("p").innerHTML = `Are you sure you want to delete task <b><i>${task.title}</i></b>`

            newConfirmBtn.addEventListener("click", () => {
                completed.splice(taskIndex, 1)
                saveTasksState()
                makeSure.classList.remove("active")
                refreshTaskView()
            })

            makeSure.querySelector("#cancel-delete").addEventListener("click", () => {
                makeSure.classList.remove("active")
            })
        })


        check.addEventListener("click", () => {
            if (completedFilter.classList.contains("active")) {
                tasks.push(task)
                completed.splice(index, 1)
            } else {
                completed.push(task)
                tasks.splice(index, 1)
            }

            saveTasksState()
            refreshTaskView()
        })
    })

    updateTaskCounters()

    if (taskCont.innerHTML === "") {
        const emptyStatePlaceholder = document.createElement("h2")
        emptyStatePlaceholder.className = "none"
        emptyStatePlaceholder.textContent = "No Completed Tasks"
        taskCont.appendChild(emptyStatePlaceholder)
    }
}

// Return to the homepage from the task page
homePageredirect.addEventListener("click", event => {
    event.preventDefault()

    if (event.target.matches("a")) {
        window.location.replace("index.html")
    }
})







