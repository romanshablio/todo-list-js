import { createTodoApp } from "./todo-app";

document.addEventListener("DOMContentLoaded", function () {
  createTodoApp(document.getElementById("my-todos"), "Мои дела");
});
