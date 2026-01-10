const groupInput = document.getElementById('groupInput');
const addGroupBtn = document.getElementById('addGroupBtn');
const groupsContainer = document.getElementById('groupsContainer');
const counter = document.getElementById("taskCounter");

let groups = JSON.parse(localStorage.getItem('groups')) || [];
let currentGroupIndex = null;

// =========================
// RENDER GRUPE / render groups
// =========================
function renderGroups() {
    groupsContainer.innerHTML = '';
    groups.forEach((group, gIndex) => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'group';
        if (currentGroupIndex === null) currentGroupIndex = 0;
        if (gIndex === currentGroupIndex) groupDiv.classList.add('active-group');

        // HEADER + DELETE
        const header = document.createElement('div');
        header.className = 'group-header';
        header.textContent = group.name;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✕';
        deleteBtn.addEventListener('click', e => {
            e.stopPropagation();
            if (confirm(`Obriši grupu "${group.name}"?`)) {
                groups.splice(gIndex, 1);
                currentGroupIndex = groups.length ? 0 : null;
                saveGroups();
                renderGroups();
            }
        });
        header.appendChild(deleteBtn);
        header.addEventListener('click', () => {
            currentGroupIndex = gIndex;
            renderGroups();
        });
        groupDiv.appendChild(header);

        // INPUT ZA TASK unutar grupe / TASK INPUT inside group
        const taskSection = document.createElement('div');
        taskSection.className = 'input-section';
        const taskInput = document.createElement('input');
        taskInput.type = 'text';
        taskInput.placeholder = 'Dodaj zadatak...';
        const taskBtn = document.createElement('button');
        taskBtn.textContent = 'Dodaj';
        taskBtn.addEventListener('click', () => {
            const text = taskInput.value.trim();
            if (!text) return;
            group.tasks.push({ text, completed: false });
            taskInput.value = '';
            saveGroups();
            renderGroups();
        });
        taskInput.addEventListener('keydown', e => { if(e.key==='Enter') taskBtn.click(); });
        taskSection.appendChild(taskInput);
        taskSection.appendChild(taskBtn);
        groupDiv.appendChild(taskSection);

        // LISTA TASKOVA / TASK LIST
        const ul = document.createElement('ul');
        ul.className = 'task-list';
        group.tasks.forEach((task, tIndex) => {
            const li = document.createElement('li');
            li.className = 'task-item';
            if(task.completed) li.classList.add('completed');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                li.classList.toggle('completed', task.completed);
                saveGroups();
                updateCounter();
            });

            const span = document.createElement('span');
            span.textContent = task.text;
            span.addEventListener('click', () => {
                const newText = prompt('Izmeni zadatak:', task.text);
                if(newText && newText.trim()!==''){
                    task.text = newText.trim();
                    saveGroups();
                    renderGroups();
                }
            });

            const deleteTaskBtn = document.createElement('button');
            deleteTaskBtn.textContent = '✕';
            deleteTaskBtn.addEventListener('click', () => {
                group.tasks.splice(tIndex,1);
                saveGroups();
                renderGroups();
            });

            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(deleteTaskBtn);
            ul.appendChild(li);
        });
        groupDiv.appendChild(ul);
        groupsContainer.appendChild(groupDiv);
    });
    updateCounter();
}

// =========================
// BROJAČ / COUNTER
// =========================
function updateCounter() {
    if(currentGroupIndex===null){
        counter.textContent="Izaberi grupu za prikaz zadataka";
        return;
    }
    const tasks = groups[currentGroupIndex].tasks;
    const total = tasks.length;
    const done = tasks.filter(t=>t.completed).length;
    const left = total - done;
    counter.textContent = `Ukupno: ${total} | Završeno: ${done} | Preostalo: ${left}`;
}

// =========================
// SAVE / sacuvaj
// =========================
function saveGroups(){ localStorage.setItem('groups', JSON.stringify(groups)); }

// =========================
// ADD GRUPA / dodaj group
// =========================
addGroupBtn.addEventListener('click', () => {
    const name = groupInput.value.trim();
    if(!name) return;
    groups.push({ name, tasks: [] });
    currentGroupIndex = groups.length-1;
    groupInput.value='';
    saveGroups();
    renderGroups();
});

// =========================
// START
// =========================
renderGroups();
