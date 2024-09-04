// Init variable
let todoList = JSON.parse(localStorage.getItem("todoList")) || [];
let inputTodoList = document.getElementById("input_field");
let todoListContainer = document.getElementById("todo_list_container");
let currentEditId = null; // Track the ID of the todo being edited

// Function to render the todo list
function renderTodoList() {
  todoListContainer.innerHTML = "";

  todoList.forEach((value, i) => {
    todoListContainer.innerHTML += `
      <div id="${value.id}" class="card w-100 my-2">
        <div class="card-body d-flex justify-content-between py-2">
            <p class="m-0">${i + 1}. ${value.title}</p>
            <div>
              <button type="button" class="btn btn-warning btn-sm" onclick="editData('${value.id}')">Edit</button>
              <button type="button" class="btn-close" aria-label="Close" onclick="removeData('${value.id}')"></button>
            </div>
        </div>
      </div>
    `;
  });
}

// Function to create or update a todo item
function createData() {
  const newTodo = {
    id: Date.now().toString(),
    title: inputTodoList.value,
    description: "",
  };

  if (currentEditId) {
    // Update existing todo
    todoList = todoList.map(todo => todo.id === currentEditId ? newTodo : todo);
    currentEditId = null; // Reset edit ID after updating
  } else {
    // Add new todo
    todoList.push(newTodo);
  }

  localStorage.setItem("todoList", JSON.stringify(todoList));
  inputTodoList.value = "";
  renderTodoList();
}

// Function to remove a todo item
function removeData(id) {
  todoList = todoList.filter(todo => todo.id !== id);
  localStorage.setItem("todoList", JSON.stringify(todoList));
  renderTodoList();
}

// Function to edit a todo item
function editData(id) {
  const todoToEdit = todoList.find(todo => todo.id === id);
  if (todoToEdit) {
    inputTodoList.value = todoToEdit.title; // Populate input field with current title
    currentEditId = id; // Set the current edit ID
  }
}

// Initial rendering of the todo list
renderTodoList();

// Event listeners for buttons
document.getElementById("save_button").addEventListener("click", createData);
document.getElementById("logout_button").addEventListener("click", () => {
  localStorage.clear();
  location.href = "./login.html";
});