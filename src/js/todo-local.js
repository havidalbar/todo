// Init variable
let todoList = JSON.parse(localStorage.getItem("todoList")) || [];
let inputTodoList = document.getElementById("input_field");
let inputDay = document.getElementById("input_day");
let inputNote = document.getElementById("input_note");
let todoListContainer = document.getElementById("todo_list_container");
let currentEditId = null; // Track the ID of the todo being edited
let currentTodoId = null; // Track the ID of the todo being edited for details

// Function to render the todo list
function renderTodoList() {
  todoListContainer.innerHTML = "";

  todoList.forEach((value, i) => {
    todoListContainer.innerHTML += `
      <div id="${value.id}" class="card w-100 my-2 todo-card">
        <div class="card-body d-flex justify-content-between py-2">
          <div>
            <p class="m-0 todo-title">${i + 1}. ${value.title}</p>
            <p class="m-0 text-muted">${value.day} - ${value.note}</p>
          </div>
          <div>
            <button type="button" class="btn btn-info btn-sm" onclick="showDetailModal('${value.id}')">Details</button>
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
    day: inputDay.value,
    note: inputNote.value,
    details: []
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
  inputDay.value = "Select a day";
  inputNote.value = "";
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
    inputDay.value = todoToEdit.day; // Populate day field
    inputNote.value = todoToEdit.note; // Populate note field
    currentEditId = id; // Set the current edit ID
  }
}

// Function to show the detail modal
function showDetailModal(todoId) {
  currentTodoId = todoId;
  const todo = todoList.find(todo => todo.id === todoId);
  document.getElementById("detail_activity").value = "";
  document.getElementById("detail_category").value = "";
  document.getElementById("detail_note").value = "";
  
  // Populate the form with existing details if available
  const existingDetail = todo.details[0]; // Assuming only one detail per todo for simplicity
  if (existingDetail) {
    document.getElementById("detail_activity").value = existingDetail.activity;
    document.getElementById("detail_category").value = existingDetail.category;
    document.getElementById("detail_note").value = existingDetail.note;
  }
  
  const detailModal = new bootstrap.Modal(document.getElementById('detailModal'));
  detailModal.show();
}

// Function to save todo detail
function saveDetail() {
  const todo = todoList.find(todo => todo.id === currentTodoId);
  const newDetail = {
    todoId: currentTodoId,
    activity: document.getElementById("detail_activity").value,
    category: document.getElementById("detail_category").value,
    note: document.getElementById("detail_note").value
  };
  
  // Update existing detail or add a new one
  todo.details[0] = newDetail; // Assuming only one detail per todo for simplicity
  
  localStorage.setItem("todoList", JSON.stringify(todoList));
  renderTodoList();
  const detailModal = bootstrap.Modal.getInstance(document.getElementById('detailModal'));
  detailModal.hide();
}

// Initial rendering of the todo list
renderTodoList();

// Event listeners for buttons
document.getElementById("save_button").addEventListener("click", createData);
document.getElementById("logout_button").addEventListener("click", () => {
  localStorage.clear();
  location.href = "./login.html";
});