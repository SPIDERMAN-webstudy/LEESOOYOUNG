const todoForm = document.querySelector("#todo-form");
const todoInput = todoForm.querySelector("input");
const todoList = document.querySelector("#todo-list");

const TODOS_KEY = "ToDos";

let todos = [];

function saveToDos(){
    localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
}

function deleteToDo(event){
    const li = event.target.parentElement;
    li.remove();
    console.dir(event.target);
    todos.splice(event.target.parentElement,1);
}

function paintToDo(newTodo){
    const li = document.createElement("li");
    const span = document.createElement("span");
    const button = document.createElement("button");
    span.innerText = newTodo;
    button.innerText = "X";
    button.addEventListener("click", deleteToDo);
    li.appendChild(span);
    li.appendChild(button);
    todoList.appendChild(li);
}

function handleToDoSubmit(event){
    event.preventDefault();
    const newTodo = todoInput.value;
    todoInput.value="";
    todos.push(newTodo);
    paintToDo(newTodo);
    saveToDos();
}

todoForm.addEventListener("submit", handleToDoSubmit);


const savedToDos = localStorage.getItem(TODOS_KEY);

if (savedToDos !== null){
    todos = JSON.parse(localStorage.getItem(TODOS_KEY));
    const parsedToDos = JSON.parse(savedToDos);
    parsedToDos.forEach(paintToDo);
}


