class Board {
  constructor() {
    this.todoItem = [];
  }

  saveData() {
    localStorage.setItem("todo", JSON.stringify(this.todoItem));
  }
  loadData() {
    return localStorage.getItem("todo") === null ? [] : JSON.parse(localStorage.getItem("todo"));
  }
  addItem() {
    let input = document.querySelector(".new-todo");//choose the inputblock to add todo-item
    let todoItem = input.value;
    if (todoItem === '') {
      return;
    }
    input.value = "";
    this.todoItem.push({ todoItem: todoItem, done: false });
    this.saveData();
    this.render();
  }
  update(i) {
    this.todoItem[i].done = !this.todoItem[i].done;
    this.saveData();
    this.render();
  }
  remove(i) {
    this.todoItem.splice(i, 1);
    this.saveData();
    this.render();
  }
  edit(i) {
    let li_div = document.querySelector(`.doneList${i} div`);
    let input = document.createElement("input");
    input.value = li_div.innerText;
    li_div.innerText = "";
    input.setAttribute("class", "editInput");
    li_div.appendChild(input);
    input.focus();
    input.addEventListener("keyup", (event) => {
      if (event.keyCode === 13) {
        if (input.value != "") {
          this.todoItem[i].todoItem = input.value;
          this.saveData();
          this.render();
        } else {
          this.todoItem.splice(i, 1);
          this.saveData();
          this.render();
        }
      }
    });
    input.addEventListener("mouseleave", () => {
      if (input.value != "") {
        this.todoItem[i].todoItem = input.value;
        this.saveData();
        this.render();
      } else {
        this.todoItem.splice(i, 1);
        this.saveData();
        this.render();
      }
    })
  }

  clearAll() {
    for (let i = 0; i < this.todoItem.length; i++) {
      if (this.todoItem[i].done === true) {
        this.todoItem.splice(i, 1);
        i--;
      }
    }
    this.saveData();
    this.render();
  }

  render() {
    let todoList = document.querySelector(".todo-list");
    let tempHTML = "";
    let todoItemNumber = document.querySelector(".footer .todo-count strong");
    let tempItemNumber = 0;
    let todoItems = this.loadData();
    for (let i = 0; i < todoItems.length; i++) {
      if (todoItems[i].done === false) {
        tempHTML += `
          <li class="doneList${i}">
            <div class="view">
              <img class="toggle" src="click.png" onclick="board.update(${i})">
              <label class="todo" ondblclick="board.edit(${i})">${todoItems[i].todoItem}</label>
              <button class="destory" onclick="board.remove(${i})"></button>
            </div>
          </li>`
        tempItemNumber++
      } else {
        tempHTML += `
          <li>
            <div class="view">
              <img class="toggle-finished" src="clicked.png" onclick="board.update(${i})">
              <label class="done" ondblclick="board.edit(${i})">${todoItems[i].todoItem}</label>
              <button class="destory" onclick="board.remove(${i})"></button>
            </div>
          </li>`
      }
    }
    todoList.innerHTML = tempHTML;
    todoItemNumber.innerText = tempItemNumber;
  }
}

window.onload = function () {
  board.todoItem = board.loadData();
  board.render();
  document.querySelector(".new-todo").addEventListener("keypress", (event) => {
    if (event.keyCode === 13) {
      board.addItem();
    }
  });
  document.querySelector(".clear-completed").addEventListener("click", () => { board.clearAll() });
}

let board = new Board();