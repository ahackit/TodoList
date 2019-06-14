let token = "blah";

let addNewBtn = NaN;
let deleteBtn = NaN;
let completeBtn = NaN;
let newTaskField = NaN;
let itemList = NaN;

let currentTasks = [];

class Task {
  constructor(id, desc) {
    this.id = id;
    this.desc = desc;
  }
}

document.getElementById("loginBtn").addEventListener("click", authenticate);

function authenticate(e) {
  let user = document.getElementById("userInput").value;
  let pass = document.getElementById("passInput").value;

  // login(user, pass).then(data => (token = data.access_token));
  login(user, pass).then(function(data) {
    console.log(data);
    if (data.status_code == 401) {
      console.log("Wrong Password");
    } else {
      token = data.access_token;
      drawUI();
      setUpEvents();
      getTasks();
    }
  });

  e.preventDefault();
}

const login = async (user, pass) => {
  const response = await fetch("http://127.0.0.1:5000/auth", {
    method: "POST",
    body: JSON.stringify({ username: user, password: pass }),
    headers: {
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();
  return data;
};

function drawUI() {
  ui = ` <div class="row">
  <div class="col-md-12 todolist">
    <div class="d-flex justify-content-between buttons">
    <button class="btn btn-primary my-3" id='addBtn'>Add New Task</button>
    <button class="btn btn-danger my-3" id='deleteBtn'>Delete Task</button>
    <button class="btn btn-success my-3" id='completeBtn'>Complete Task</button>
  </div>
    <div class="form-group">
      <label for="taskinfo">Task Desc</label>
      <input
        type="text"
        name="taskinfo"
        id="newTaskInfo"
        class="form-control"
        placeholder="Task info..."
      />
    </div>
  
    <h1 class="text-center">ToDo List</h1>
    <ul id="item-list" class="list-group">
        <!-- <li class="list-group-item  d-flex justify-content-between align-items-center">
            test
            <input type="checkbox" id="action">
        </li>
        <li class="list-group-item  d-flex justify-content-between align-items-center">
              test
          <input type="checkbox" id="action">
          </li>
          <li class="list-group-item  d-flex justify-content-between align-items-center">
                  test
          <input type="checkbox" id="action">
          </li> -->
    </ul>
  
    </div>
  </div>
  </div>`;
  document.querySelector(".container").innerHTML = ui;
}

function setUpEvents() {
  addNewBtn = document.getElementById("addBtn");
  deleteBtn = document.getElementById("deleteBtn");
  completeBtn = document.getElementById("completeBtn");
  newTaskField = document.getElementById("newTaskInfo");
  itemList = document.getElementById("item-list");

  addNewBtn.addEventListener("click", addNewTask);
  deleteBtn.addEventListener("click", deleteTask);
  completeBtn.addEventListener("click", completeTask);
}

function addNewTask(e) {
  if (newTaskField.value !== "") {
    fetch(`http://127.0.0.1:5000/api/tasks/${newTaskField.value}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `jwt ${token}`
      },
      body: JSON.stringify(newTaskField.value)
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        let task = new Task(data.task_id, data.task_name);
        currentTasks.push(task);
        const li = document.createElement("li");
        li.id = `${task.id}`;
        li.className =
          "list-group-item  d-flex justify-content-between align-items-center";
        li.innerHTML = `${task.desc}
        <input type="checkbox" id="action">`;
        itemList.appendChild(li);
        console.log(task);
      })
      .catch(function(err) {
        console.log(err);
      });
    newTaskField.value = "";
  } else {
    ShowError("A value must be entered");
  }
  e.preventDefault();
}

function ShowError(message) {
  if (document.querySelector(".alert") === null) {
    element = document.createElement("div");
    element.className = "container alert";
    element.innerHTML = `<p class="bg-danger text-center mt-5">${message}</p>`;
    document
      .querySelector(".todolist")
      .insertBefore(element, document.querySelector(".buttons"));

    setTimeout(clearError, 3000);
  }
}

function clearError() {
  document.querySelector(".alert").remove();
}

function populateTasks(data) {
  tasks = Array.from(data);
  tasks.forEach(function(task) {
    newTask = new Task(task.task_id, task.task_name);
    currentTasks.push(newTask);
    const li = document.createElement("li");
    li.id = `${newTask.id}`;
    li.className =
      "list-group-item  d-flex justify-content-between align-items-center";
    li.innerHTML = `${newTask.desc}
    <input type="checkbox" id="action">`;
    itemList.appendChild(li);
  });
}

function deleteTask(e) {
  tasks = document.querySelectorAll("#action");
  tasks = Array.from(tasks);

  tasks.forEach(function(task) {
    if (task.checked) {
      li = task.parentElement;
      fetch(`http://127.0.0.1:5000/api/tasks/delete/${li.id}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          Authorization: `jwt ${token}`
        }
      })
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {})
        .catch(function(err) {
          console.log(err);
        });

      itemList.removeChild(li);
    }
  });
  e.preventDefault();
}
function completeTask(e) {
  tasks = document.querySelectorAll("#action");
  tasks = Array.from(tasks);

  tasks.forEach(function(task) {
    if (task.checked) {
      li = task.parentElement;
      fetch(`http://127.0.0.1:5000/api/tasks/complete/${li.id}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          Authorization: `jwt ${token}`
        }
      })
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {})
        .catch(function(err) {
          console.log(err);
        });
      itemList.removeChild(li);
    }
  });
  e.preventDefault();
}

function getTasks() {
  fetch("http://127.0.0.1:5000/api/tasks", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `jwt ${token}`
    }
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      populateTasks(data);
    })
    .catch(function(err) {
      console.log(err);
    });
}
