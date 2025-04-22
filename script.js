const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
    if (inputBox.value === '') {
        alert("You Must Write Something!");
    } else {
        let li = document.createElement("li");

        // Create timestamp
        const now = new Date();
        const formattedDate = now.toLocaleDateString(); // e.g., 4/22/2025
        const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // e.g., 10:35 AM

        // Add task content and time
        li.innerHTML = `
            <div class="task-content">${inputBox.value}</div>
            <div class="timestamp">${formattedDate} • ${formattedTime}</div>
        `;

        listContainer.appendChild(li);

        // Add delete (×) button
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
        li.setAttribute("draggable", "true");

    }

    inputBox.value = "";
    saveData();
    addDragAndDropHandlers(); // after saving data

}

document.getElementById("sort-name").addEventListener("click", () => {
    sortTasks("name");
});

document.getElementById("sort-time").addEventListener("click", () => {
    sortTasks("time");
});


let dragSrcEl = null;

function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    this.classList.add('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    return false;
}

function handleDragEnter() {
    this.classList.add('over');
}

function handleDragLeave() {
    this.classList.remove('over');
}

function handleDrop(e) {
    e.stopPropagation();
    if (dragSrcEl !== this) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');

        // Reattach event listeners after drop
        addDragAndDropHandlers();
        saveData();
    }
    return false;
}

function handleDragEnd() {
    const items = listContainer.querySelectorAll('li');
    items.forEach((item) => {
        item.classList.remove('over', 'dragging');
    });
}

function addDragAndDropHandlers() {
    const items = listContainer.querySelectorAll('li');
    items.forEach((item) => {
        item.setAttribute("draggable", "true");
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragenter', handleDragEnter);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('dragleave', handleDragLeave);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragend', handleDragEnd);
    });
}


function sortTasks(by) {
    const tasks = Array.from(listContainer.getElementsByTagName("li"));

    tasks.sort((a, b) => {
        if (by === "name") {
            const textA = a.querySelector(".task-content")?.textContent.toLowerCase() || '';
            const textB = b.querySelector(".task-content")?.textContent.toLowerCase() || '';
            return textA.localeCompare(textB);
        } else if (by === "time") {
            const timeA = new Date("01/01/2000 " + (a.querySelector(".timestamp")?.textContent.split("•")[1].trim() || ''));
            const timeB = new Date("01/01/2000 " + (b.querySelector(".timestamp")?.textContent.split("•")[1].trim() || ''));
            return timeA - timeB;
        }
    });

    // Clear and re-add sorted tasks
    listContainer.innerHTML = "";
    tasks.forEach(task => listContainer.appendChild(task));
    saveData();
}


listContainer.addEventListener("click", function(e){
    if(e.target.tagName === "LI"){
        e.target.classList.toggle("checked");
        saveData();
    }
    else if (e.target.tagName === "SPAN"){
        e.target.parentElement.remove();
        saveData()
    }
}, false);

inputBox.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});


function saveData(){
    localStorage.setItem("data", listContainer.innerHTML);
}
function showTask(){
    listContainer.innerHTML = localStorage.getItem("data");
}
showTask();
addDragAndDropHandlers(); // after saving data
