class TodoList {
    constructor() {

        this.editingIndex = -1;
        
        
        this.addButton = document.getElementById('addButton');
        this.todoInput = document.getElementById('todoInput');
        this.todoList = document.getElementById('todoList');
        
        
        this.addButton.addEventListener('click', () => this.addOrUpdateTask());
        this.todoList.addEventListener('click', (e) => {
            const action = e.target.classList.contains('removeButton') ? 'remove' : 
                           e.target.classList.contains('editButton') ? 'edit' : 
                           e.target.classList.contains('doneButton') ? 'done' : null;
            if (action) this[action + 'Task'](e);
        });
    }

   
    addOrUpdateTask() {
        const taskText = this.todoInput.value.trim();
        if (taskText) {
            if (this.editingIndex === -1) {
                this.addTask(taskText);
            } else {
                this.updateTask(taskText); 
            }
            this.todoInput.value = ''; 
        }
    }

    
    addTask(taskText) {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item todo-item';
        
       
        listItem.innerHTML = `
            <span class="task-text">${taskText}</span>
            <div class="timestamp" style="margin-top: 0.5rem; color: gray;">Date Added: ${new Date().toLocaleString()}</div>
            <div style="margin-top: 0.5rem;">
                <button class="btn btn-success btn-sm doneButton">Done</button>
                <button class="btn btn-warning btn-sm editButton">Edit</button>
                <button class="btn btn-danger btn-sm removeButton">Remove</button>
            </div>
        `;
        
       
        this.todoList.appendChild(listItem);
    }

    
    doneTask(event) {
        const taskItem = event.target.closest('.todo-item');
        const taskText = taskItem.querySelector('.task-text');
        
       
        taskText.classList.toggle('completed'); 

       
        const buttons = taskItem.querySelectorAll('button');
        buttons.forEach(button => button.disabled = true);
    }

    
    updateTask(taskText) {
        
        this.todoList.children[this.editingIndex].querySelector('.task-text').textContent = taskText;
        
       
        this.resetEditing();
    }


    removeTask(event) {
        const taskItem = event.target.closest('.todo-item');
        this.todoList.removeChild(taskItem);
    }

    
    editTask(event) {
        const taskItem = event.target.closest('.todo-item');
        
       
        this.todoInput.value = taskItem.querySelector('.task-text').textContent;
        
        
        this.editingIndex = Array.from(this.todoList.children).indexOf(taskItem);
        
        
        this.addButton.textContent = 'Update';
    }

    
    resetEditing() {
        this.editingIndex = -1;
        this.addButton.textContent = 'Add'; 
    }
}document.addEventListener('DOMContentLoaded', () => new TodoList());
