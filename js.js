/**
 * Dropdown Componont
 *  
 *@description
 componot structure should be parent with ID and 2 children
 first child the header (event handler)
 second child the body ( display body controlled by header)
 parent > header + body
 * @param {string} id
 */
const dropdown = id => {
  let dropdown = document.getElementById(id).firstElementChild;
  let toggle = Event => {
    dropdown.nextElementSibling.classList.toggle("dropDownToggle");
    Event.preventDefault();
  };
  dropdown.addEventListener("click", toggle);
};

/**  Activeate the dropdown component
 *  there is 2 dropdown lists
 *  firs one for tasks
 * second one for complated tasks
 */
dropdown("todo-list");
dropdown("done-list");

/*******************************************************
 *   get,add and show  tasks
 ******************************************************
 */

const setTask = (data, type) => {
  tasks[type].push(data);
  setLocalTasks(tasks);
};
const deleteTask = (data, type) => tasks[type].splice(tasks[type].indexOf(data), 1);
const getInputVal = id => document.getElementById(id).value;
const setInputVal = (id, data) => (document.getElementById(id).value = data);
const getLocalTasks = storeName => JSON.parse(localStorage.getItem(storeName));
const setLocalTasks = data => localStorage.setItem("todo-list", JSON.stringify(data));

/**
 * Validate Input field if match string and numbers only
 * validate not empty
 *
 * @param {input} data
 * @returns Boolean
 */
const validateInputText = data => {
  const expression = /^[a-zA-Z0-9_ ]*$/;
  let regex = new RegExp(expression);
  if (!data.match(regex) || data == "") {
    alert("Please dont leave the field empty and  use alphanumeric characters only");
    return false;
  }
  return true;
};

function action() {
  let item = this.parentNode;
  let parent = this.parentNode.parentNode;
  let parentId = parent.id;
  let value = item.firstElementChild.innerText;
  let buttonTrash = this.firstElementChild.classList.contains("trash");

  if (buttonTrash) {
    if (parentId === "todo-list-body") {
      deleteTask(value, "todo");
    } else {
      deleteTask(value, "completed");
    }
  } else {
    if (parentId === "todo-list-body") {
      setTask(value, "completed");
      render(deleteTask(value, "todo"), "done-body");
    } else {
      deleteTask(value, "completed");
    }
  }
  setLocalTasks(tasks);
  parent.removeChild(item);
}

const render = (value, parentId) => {
  const newItem = ele => document.createElement(ele);

  let item = newItem("li");

  let contextParent = newItem("a");
  let text = document.createTextNode(value);
  let buttonDelete = newItem("span");
  let buttonDone = newItem("span");
  let trashIcon = `<svg viewBox="0 0 12 16" width="20" class="trash">
  <path fill-rule="evenodd" d="M11 2H9c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1H2c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1v9c0 .55.45 1 1 1h7c.55 0 1-.45 1-1V5c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 12H3V5h1v8h1V5h1v8h1V5h1v8h1V5h1v9zm1-10H2V3h9v1z"/>
</svg>`;
  let doneIcon = `<svg viewBox="0 0 12 16" width="20" class="done">
  <path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"/>
</svg>`;

  item.classList.add("dropdown_item");
  // buttonDone.addEventListener("click", doneItem);
  contextParent.appendChild(text);
  buttonDelete.innerHTML = trashIcon;
  buttonDone.innerHTML = doneIcon;

  buttonDelete.addEventListener("click", action);
  buttonDone.addEventListener("click", action);

  item.appendChild(contextParent);

  if (parentId == "todo-list-body") {
    item.appendChild(buttonDelete);
  }
  item.appendChild(buttonDone);

  document.getElementById(parentId).appendChild(item);
};

function newTask() {
  let value = getInputVal("todo-input");
  if (validateInputText(value)) {
    setTask(value, "todo");
  render(value, "todo-list-body");
  setInputVal("todo-input","");
  }

}

let tasks;
if (getLocalTasks("todo-list") === null) {
  tasks = {
    todo: [],
    completed: []
  };
} else {
  tasks = getLocalTasks("todo-list");
}

for (let i = 0; i < tasks.todo.length; i++) {
  render(tasks.todo[i], "todo-list-body");
}
for (let i = 0; i < tasks.completed.length; i++) {
  render(tasks.completed[i], "done-body");
}

document.getElementById("todo-button").addEventListener("click", newTask);
