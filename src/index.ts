import { v4 as uuidv4 } from "uuid";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
};

const list = document.querySelector<HTMLUListElement>("#list");
const form = document.querySelector<HTMLFormElement>("#new-task-form");
const input = document.querySelector<HTMLInputElement>("#new-task-title");
const tasks: Task[] = loadTasks();
tasks.forEach(addListItem);

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input?.value == "" || input?.value == null) return;
  const newTask: Task = {
    id: uuidv4(),
    title: input?.value,
    completed: false,
    createdAt: new Date(),
  };
  tasks.push(newTask);
  addListItem(newTask);
  saveTasks(tasks)
  input.value = "";
});

function addListItem(task: Task) {
  const item = document.createElement("li");
  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  const deleteItem = document.createElement("button");
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    saveTasks(tasks);
  });
  deleteItem.dataset.taskId = task.id;
  deleteItem.textContent = "Delete";

  deleteItem.addEventListener("click", () => {
    const taskId = deleteItem.dataset.taskId;
    const filteredTasks: Task[] = tasks.filter((task) => task.id !== taskId);
    saveTasks(filteredTasks);
    item.remove();
    tasks.length = 0;
    tasks.push(...filteredTasks);
  });
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  label.append(checkbox, task.title);
  item.append(label);
  list?.append(item);
  item.append(deleteItem);
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem("Tasks", JSON.stringify(tasks));
}

function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem("Tasks");
  if (taskJSON == null) return [];
  return JSON.parse(taskJSON);
}
