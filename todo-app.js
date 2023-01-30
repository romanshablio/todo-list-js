(function () {
  let listArray = [],
    listName = "";
  // создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement("h2");
    appTitle.innerHTML = title;
    return appTitle;
  }

  // создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement("form");
    let input = document.createElement("input");
    let buttonWrapper = document.createElement("div");
    let button = document.createElement("button");

    form.classList.add("input-group", "mb-3");
    input.classList.add("form-control");
    input.placeholder = "Введите название нового дела";
    buttonWrapper.classList.add("input-group-append");
    button.classList.add("btn", "btn-primary");
    button.textContent = "Добавить дело";
    input.setAttribute("required", null);
    button.setAttribute("disabled", null);

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);
    // начало фрагмента функция на проверку заполненного input
    function ctrlButton() {
      button.disabled = this.value.trim().length === 0;
    }

    input.addEventListener("input", ctrlButton, false);
    ctrlButton.call(input);
    // конец фрагмента функция на проверку заполненного input
    return {
      form,
      input,
      button,
    };
  }

  // создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement("ul");
    list.classList.add("list-group");
    return list;
  }

  function createTodoItem(object) {
    let item = document.createElement("li");

    let buttonGroup = document.createElement("div");
    let doneButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    item.textContent = object.name;

    buttonGroup.classList.add("btn-group", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success");
    doneButton.textContent = "Готово";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Удалить";

    if (object.done == true) {
      item.classList.add("list-group-item-success");
    }

    doneButton.addEventListener("click", function () {
      item.classList.toggle("list-group-item-success");

      for (const listItem of listArray) {
        if (listItem.id == object.id) {
          listItem.done = !listItem.done;
        }
      }
      saveList(listArray, listName);
    });
    deleteButton.addEventListener("click", function () {
      if (confirm("Вы уверены?")) {
        item.remove();

        for (let i = 0; i < listArray.length; i++) {
          if (listArray[i].id == object.id) {
            listArray.splice(i, 1);
          }
          console.log(listArray);
        }
        saveList(listArray, listName);
      }
    });

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  function getNewId(arr) {
    let max = 0;
    for (const item of arr) {
      if (item.id > max) {
        max = item.id;
      }
    }
    return max + 1;
  }

  function saveList(arr, keyName) {
    localStorage.setItem(keyName, JSON.stringify(arr));
  }

  function createTodoApp(container, title = "Список дел", keyName) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    listName = keyName;

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    let localData = localStorage.getItem(listName);

    if (localData != null && localData != "") {
      listArray = JSON.parse(localData);
    }

    for (const itemList of listArray) {
      let todoItem = createTodoItem(itemList);
      todoList.append(todoItem.item);
    }

    todoItemForm.form.addEventListener("submit", function (e) {
      // предотвращение перезагрузки страницы при отправке формы
      e.preventDefault();
      // игнорируем создание элемента если поле пустое
      if (!todoItemForm.input.value) {
        return;
      }

      let newItem = {
        id: getNewId(listArray),
        name: todoItemForm.input.value,
        done: false,
      };

      let todoItem = createTodoItem(newItem);

      listArray.push(newItem);

      saveList(listArray, listName);

      todoList.append(todoItem.item);
      todoItemForm.button.disabled = true;
      todoItemForm.input.value = "";
    });
  }

  window.createTodoApp = createTodoApp;

  // document.addEventListener("DOMContentLoaded", function () {
  //   createTodoApp(document.getElementById("my-todos"), "Мои дела");
  //   createTodoApp(document.getElementById("mom-todos"), "Дела мамы");
  //   createTodoApp(document.getElementById("dad-todos"), "Дела папы");
  // });
})();
