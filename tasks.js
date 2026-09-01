// GLOBAL VARIABLES
let homePageredirect = document.getElementById("redirect")
let taskTitleInput = document.querySelector('[name="title"]')
let taskDescriptionInput = document.querySelector('[name="description"]')
let form = document.querySelector(".input-field")
let taskCont = document.querySelector(".tasks-container")
let inProgressFilter = document.querySelector(".filters p:nth-child(1)")
let completedFilter = document.querySelector(".filters p:nth-child(2)")
let makeSure = document.querySelector(".make-sure")
let overlay = document.querySelector(".overlay")
const byTitleSearch = document.querySelector('[name="search-by-letter"]')

let tasks = []
let completed = []
let recover = localStorage.getItem("saved")
let recoverCompleted = localStorage.getItem("completed")

// LOCAL STORAGE CODES
if (recoverCompleted !== null) {
    completed = JSON.parse(recoverCompleted)
    taskCont.innerHTML = ""
    createCompletedTask()
}
if (recover !== null) {
    tasks = JSON.parse(recover)
    taskCont.innerHTML = ""
    createTask()
    inProgressFilter.classList.add("active")
    completedFilter.classList.remove("active")
} else {
    inProgressFilter.classList.add("active")
    completedFilter.classList.remove("active")
    const emptyStatePlaceholder = document.createElement("h2")
    emptyStatePlaceholder.className = "none"
    emptyStatePlaceholder.textContent = "No Tasks in Progress"
    taskCont.appendChild(emptyStatePlaceholder)
}


// CODE BLOCK TO ADD A NEW TASK
form.addEventListener("submit", event => {
    event.preventDefault()

    if (taskTitleInput.value === "" || taskDescriptionInput.value === "") {
        console.log("Fill all");
        return
    }

    const formData = new FormData(form)

    const newTask = {
        title: formData.get("title"),
        desc: formData.get("description")
    }

    tasks.push(newTask)
    console.log(tasks);

    // form.reset()

    taskCont.innerHTML = ""

    createTask()



    const savedTasks = JSON.stringify(tasks)
    localStorage.setItem("saved", savedTasks)

})

// CODE BLOCK THAT CALLS THE FUNCTION TO DISPLAY ACTIVE TASKS
inProgressFilter.addEventListener("click", () => {
    taskCont.innerHTML = ""
    createTask()
})

// CODE BLOCK THAT CALLS THE FUNCTION TO DISPLAY COMPLETED TASKS
completedFilter.addEventListener("click", () => {
    taskCont.innerHTML = ""
    createCompletedTask()
})

// CODE BLOCK TO PRINT ACTIVE TASKS TO THE DOM
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
        // middle.appendChild(firstMiddleP)
        console.log(firstMiddleP);


        const line = document.createElement("div")
        line.className = "line"
        // middle.appendChild(line)
        console.log(line);


        const secondMiddleP = document.createElement("p")
        secondMiddleP.textContent = task.desc
        console.log(secondMiddleP);
        middle.append(firstMiddleP, line, secondMiddleP)
        console.log(middle);


        const icons = document.createElement("div")
        icons.className = "action-icons"
        const check = document.createElement("input")
        check.setAttribute("type", "checkbox")
        check.setAttribute("name", "done")
        check.checked = false;
        // icons.appendChild(check)
        const edit = document.createElement("span")
        edit.innerHTML = '<i class="fas fa-pen"></i>'
        edit.setAttribute("edit-index", index)
        // icons.appendChild(edit)
        const del = document.createElement("span")
        del.innerHTML = '<i class="fas fa-trash"></i>'
        del.className = "delete"
        del.setAttribute("data-index", index)
        icons.append(check, edit, del)
        console.log(icons);



        tasksHouse.append(number, middle, icons)

        taskCont.appendChild(tasksHouse)

        // del.addEventListener("click", () => {
        //     tasks.splice(pendingDeleteIndex, 1)
        //     localStorage.setItem("saved", JSON.stringify(tasks))
        //     taskCont.innerHTML = ""
        //     createTask()
        // })

        edit.addEventListener("click", () => {
            const taskIndex = edit.getAttribute("edit-index")
            const formEdit = overlay.querySelector(".edit")

            const newFormEdit = formEdit.cloneNode(true)
            formEdit.parentNode.replaceChild(newFormEdit, formEdit)

            overlay.classList.add("active")

            newFormEdit.querySelector('[name="title-edit"]').value = task.title
            newFormEdit.querySelector('[name="description-edit"]').value = task.desc

            newFormEdit.addEventListener("submit", event => {
                event.preventDefault()

                const formData = new FormData(newFormEdit)

                formData.get("title-edit");
                formData.get("description-edit");

                tasks[taskIndex] = {
                    title: formData.get("title-edit"),
                    desc: formData.get("description-edit")
                }

                localStorage.setItem("saved", JSON.stringify(tasks))

                taskCont.innerHTML = ""

                overlay.classList.remove("active")

                createTask()
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
                // rest of code
                localStorage.setItem("saved", JSON.stringify(tasks))
                taskCont.innerHTML = ""
                createTask()
                makeSure.classList.remove("active")
            })

            makeSure.querySelector("#cancel-delete").addEventListener("click", () => {
                makeSure.classList.remove("active")
            })
        })

        check.addEventListener("click", () => {

            if (check.checked) {
                completed.push(task)
                tasks.splice(index, 1)
                localStorage.setItem("saved", JSON.stringify(tasks))
                localStorage.setItem("completed", JSON.stringify(completed))
                taskCont.innerHTML = ""
                // tasksHouse.style.opacity = "0.5"
                // check.checked = true;
                createTask()
            } else {
                tasks.push(task)
                completed.splice(index, 1)
                localStorage.setItem("saved", JSON.stringify(tasks))
                localStorage.setItem("completed", JSON.stringify(completed))
                taskCont.innerHTML = ""
                // tasksHouse.style.opacity = "1"
                // check.checked = false;
                createTask()
            }
        })
    })

    if (taskCont.childNodes.length === 0) {
        const emptyStatePlaceholder = document.createElement("h2")
        emptyStatePlaceholder.className = "none"
        emptyStatePlaceholder.textContent = "No Tasks in Progress"
        taskCont.appendChild(emptyStatePlaceholder)
    }

}

// CODE BLOCK TO PRINT COMPLETED TASKS TO THE DOM
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
        // middle.appendChild(firstMiddleP)
        console.log(firstMiddleP);


        const line = document.createElement("div")
        line.className = "line"
        // middle.appendChild(line)
        console.log(line);


        const secondMiddleP = document.createElement("p")
        secondMiddleP.textContent = task.desc
        console.log(secondMiddleP);
        middle.append(firstMiddleP, line, secondMiddleP)
        console.log(middle);


        const icons = document.createElement("div")
        icons.className = "action-icons"
        const check = document.createElement("input")
        check.setAttribute("type", "checkbox")
        check.setAttribute("name", "done")
        check.checked = true
        // icons.appendChild(check)
        const edit = document.createElement("span")
        edit.innerHTML = '<i class="fas fa-pen"></i>'
        edit.setAttribute("edit-index-2", index)
        // icons.appendChild(edit)
        const del = document.createElement("span")
        del.innerHTML = '<i class="fas fa-trash"></i>'
        del.className = "delete"
        del.setAttribute("data-index-2", index)
        icons.append(check, edit, del)
        console.log(icons);



        tasksHouse.append(number, middle, icons)

        taskCont.appendChild(tasksHouse)



        // del.addEventListener("click", () => {
        //     const completedIndex = del.getAttribute("data-index")
        //     completed.splice(completedIndex, 1)
        //     localStorage.setItem("completed", JSON.stringify(completed))
        //     taskCont.innerHTML = ""
        //     createCompletedTask()
        // })

        edit.addEventListener("click", () => {

            console.log("Completed Tasks can't be edited.");

            // const taskIndex = edit.getAttribute("edit-index-2")
            // const formEdit = overlay.querySelector(".edit")

            // const newFormEdit = formEdit.cloneNode(true)
            // formEdit.parentNode.replaceChild(newFormEdit, formEdit)

            // overlay.classList.add("active")

            // newFormEdit.querySelector('[name="title-edit"]').value = task.title
            // newFormEdit.querySelector('[name="description-edit"]').value = task.desc

            // console.log(completed);


            // newFormEdit.addEventListener("submit", event => {
            //     event.preventDefault()

            //     const formData = new FormData(newFormEdit)

            //     formData.get("title-edit");
            //     formData.get("description-edit");

            //     completed[taskIndex] = {
            //         title: formData.get("title-edit"),
            //         desc: formData.get("description-edit")
            //     }

            //     localStorage.setItem("completed", JSON.stringify(completed))

            //     taskCont.innerHTML = ""

            //     overlay.classList.remove("active")

            //     createCompletedTask()
            // })

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
                // rest of code
                localStorage.setItem("completed", JSON.stringify(completed))
                taskCont.innerHTML = ""
                createCompletedTask()
                makeSure.classList.remove("active")
            })

            makeSure.querySelector("#cancel-delete").addEventListener("click", () => {
                makeSure.classList.remove("active")
            })
        })


        check.addEventListener("click", () => {
            if (check.checked) {
                completed.push(task)
                tasks.splice(index, 1)
                localStorage.setItem("saved", JSON.stringify(tasks))
                localStorage.setItem("completed", JSON.stringify(completed))
                taskCont.innerHTML = ""
                // tasksHouse.style.opacity = "0.5"
                createCompletedTask()
            } else {
                tasks.push(task)
                completed.splice(index, 1)
                localStorage.setItem("saved", JSON.stringify(tasks))
                localStorage.setItem("completed", JSON.stringify(completed))
                taskCont.innerHTML = ""
                // tasksHouse.style.opacity = "1"
                createCompletedTask()
            }
        })
    })

    if (taskCont.innerHTML === "") {
        const emptyStatePlaceholder = document.createElement("h2")
        emptyStatePlaceholder.className = "none"
        emptyStatePlaceholder.textContent = "No Completed Tasks"
        taskCont.appendChild(emptyStatePlaceholder)
    }
}

// CODE BLOCK TO REDIRECT TO THE HOMEPAGE
homePageredirect.addEventListener("click", event => {
    event.preventDefault()

    if (event.target.matches("a")) {
        window.location.replace("index.html")
    }
})







