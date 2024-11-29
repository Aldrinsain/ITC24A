class TodoList {
    constructor() {
        // Keep track of the task currently being edited
        this.editingIndex = -1;
        
        // Get elements
        this.addButton = document.getElementById('addButton');
        this.todoInput = document.getElementById('todoInput');
        this.todoList = document.getElementById('todoList');
        
        // Event listeners for adding tasks and handling button clicks (done, edit, remove)
        this.addButton.addEventListener('click', () => this.addOrUpdateTask());
        this.todoList.addEventListener('click', (e) => {
            const action = e.target.classList.contains('removeButton') ? 'remove' : 
                           e.target.classList.contains('editButton') ? 'edit' : 
                           e.target.classList.contains('doneButton') ? 'done' : null;
            if (action) this[action + 'Task'](e);
        });
    }

    // Add new task or update an existing one
    addOrUpdateTask() {
        const taskText = this.todoInput.value.trim();
        if (taskText) {
            if (this.editingIndex === -1) {
                this.addTask(taskText); // Add new task
            } else {
                this.updateTask(taskText); // Update existing task
            }
            this.todoInput.value = ''; // Clear the input field
        }
    }

    // Add a new task to the list
    addTask(taskText) {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item todo-item';
        
        // Build the task item with buttons for Done, Edit, Remove
        listItem.innerHTML = `
            <span class="task-text">${taskText}</span>
            <div class="timestamp" style="margin-top: 0.5rem; color: gray;">Date Added: ${new Date().toLocaleString()}</div>
            <div style="margin-top: 0.5rem;">
                <button class="btn btn-success btn-sm doneButton">Done</button>
                <button class="btn btn-warning btn-sm editButton">Edit</button>
                <button class="btn btn-danger btn-sm removeButton">Remove</button>
            </div>
        `;
        
        // Append the new task to the list
        this.todoList.appendChild(listItem);
    }

    // Mark the task as done (strikethrough text)
    doneTask(event) {
        const taskItem = event.target.closest('.todo-item');
        const taskText = taskItem.querySelector('.task-text');
        
        // Toggle 'completed' class to strike through text
        taskText.classList.toggle('completed'); 

        // Disable all buttons for the completed task
        const buttons = taskItem.querySelectorAll('button');
        buttons.forEach(button => button.disabled = true);
    }

    // Update the task text when editing
    updateTask(taskText) {
        // Update the task text
        this.todoList.children[this.editingIndex].querySelector('.task-text').textContent = taskText;
        
        // Reset editing mode
        this.resetEditing();
    }

    // Remove a task from the list
    removeTask(event) {
        const taskItem = event.target.closest('.todo-item');
        this.todoList.removeChild(taskItem);
    }

    // Begin editing a task
    editTask(event) {
        const taskItem = event.target.closest('.todo-item');
        
        // Set input value to the current task text for editing
        this.todoInput.value = taskItem.querySelector('.task-text').textContent;
        
        // Set the index of the task being edited
        this.editingIndex = Array.from(this.todoList.children).indexOf(taskItem);
        
        // Change button text to "Update"
        this.addButton.textContent = 'Update';
    }

    // Reset editing state to prepare for adding a new task
    resetEditing() {
        this.editingIndex = -1;
        this.addButton.textContent = 'Add'; // Change button text back to "Add"
    }
}

// Instantiate the TodoList class once the DOM is loaded
document.addEventListener('DOMContentLoaded', () => new TodoList());
