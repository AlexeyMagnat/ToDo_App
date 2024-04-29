// находим элементы на странице
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

// создаем массив для хранения задач
let tasks = [];

/* проверить данные в LocalStorage , если есть то вытащить их */
if (localStorage.getItem("tasks")) {
	// получили данные из массива
	console.log(localStorage.getItem("tasks"));
/* перевели данные (спарсили) в другой вид (в массив)
 и вернули в исходный массив новые данные */
tasks = JSON.parse(localStorage.getItem("tasks"));
/* записать стрелочной функцией   tasks.forEach((task) => renderTask(task)); */ 


/* рендеринг данных из массива на страницу */
tasks.forEach(function (task) {
	console.log(task);
	// вызов функции рендера
	renderTask(task);
});
}

// запуск функции убрать блок empty list
checkEmptyList();

/*блок кода с проверкой наличия сохраненной разметки в LocalStorage 
if (localStorage.getItem("tasksHTML")) {
	tasksList.innerHTML = localStorage.getItem("tasksHTML");
}*/

/* прослушка событий (блок кода с объявлениями функций)   */
// добавление задачи
form.addEventListener("submit", addTask);

// удаление задачи
tasksList.addEventListener("click", deleteTask)

// Отмечаем задачу завершенной
tasksList.addEventListener("click", doneTask)



/* (блок кода с описанием функций которые объявлены выше)  */

// создали новую функцию "добавить задачу" чтобы добавить в прослушку
// function-declaration вид функции которую можно вызывать до того когда она объявлена в коде 
function addTask(event) {
	// Отменяем отправку формы и перезагрузку страницы
	event.preventDefault();
	//console.log("SUBMIT!!!");

	// достаем текст задачи из поля ввода
	const taskText = taskInput.value;
	//console.log(taskText);

	// создаем объект задачи для хранения в массиве(tasks), чтобы потом хранить в LS
	const newTask = {
		id: Date.now(), // текущее время в миллисекундах (удобно для ID)
		text: taskText,
		done: false,
	}

	// далее добавляем объект в массив
	tasks.push(newTask);
	console.log(tasks);

	//вызов функции saveToLocalStorage
	saveToLocalStorage();

	// вызов функции рендера задач
	renderTask(newTask);

	// очищаем поле ввода и возвращаем на него фокус
	taskInput.value = "";
	taskInput.focus();

	/* проверка если в списке задач более 1-го элемента, скрываем блок "Список пуст"
	if (tasksList.children.length > 1) {
		emptyList.classList.add("none")
	}*/

	// запуск функции убрать блок empty list
	checkEmptyList();

	/* вызываем функцию сохранения разметки в LocalStorage
	saveHTMLtoLS();*/
}

// описание функции удаления
function deleteTask(event) {
	// выводит в консоль элемент по которому кликнули
	console.log(event.target);

	// проверяем если клик был НЕ по кнопке "удалить задачу"
	if (event.target.dataset.action !== "delete") {
		return
	}
	// проверка если кнопка имеет атрибут data-action-delete (клик был по кнопке "удалить задачу")
	/* if (event.target.dataset.action === "delete") { */
	console.log("DELETE!!!");
	const parenNode = event.target.closest(".list-group-item");
	//console.log(parenNode);

	// определяем ID задачи и переводим в число
	const id = Number(parenNode.id);
	console.log(id);
	// находим индекс задачи в массиве
	const index = tasks.findIndex(function(task) {
		console.log(task);
		/* сокращенная версия return task.id === id; */
		if (task.id === id) {
			return true
		}
	})
	/* или сократить стрелочной функцией 
	const index = tasks.findIndex((function(task) => task.id === id); */
	console.log(index);

	// удаляем задачу из массива с задачами
	tasks.splice(index, 1);

/* удаляем задачу через фильтрацию массива
tasks = tasks.filter((task) => task.id !== id);  */

	//вызов функции saveToLocalStorage
	saveToLocalStorage();
	// удаляем задачу из разметки
	parenNode.remove()

	/* проверка если в списке задач 1 элемент, показываем блок "Список пуст"
	if (tasksList.children.length === 1) {
		emptyList.classList.remove("none")
	}*/

	// запуск функции убрать блок empty list
	checkEmptyList();


	/* вызываем функцию сохранения разметки в LocalStorage
	saveHTMLtoLS();*/
}


// описание функции завершения задачи
function doneTask(event) {
	// проверяем что клик был НЕ по кнопке "задача выполнена"(data-action-done)
	if (event.target.dataset.action !== "done") {
		return
	}
	// проверяем что клик был по кнопке "задача выполнена"(data-action-done)
	/*if (event.target.dataset.action === "done") {*/
	console.log("DONE!!!");
	const parentNode = event.target.closest(".list-group-item");
	//console.log(parentNode);

	// Определяем ID задачи
const id = Number(parentNode.id);

const task = tasks.find(function (task) {
	if (task.id === id) {
		return true
	}
});

task.done = !task.done;

	//вызов функции saveToLocalStorage
	saveToLocalStorage();

	// поиск внутри элемента
	const taskTitle = parentNode.querySelector(".task-title");
	//console.log(taskTitle);
	/* передаем класс этой переменной
	toggle отличается от add тем что добавляет если нет класса или убирает если есть класс*/
	taskTitle.classList.toggle("task-title--done");
	/* вызываем функцию сохранения разметки в LocalStorage
	saveHTMLtoLS();*/
}



/* 1 способ записи разметки в LocalStorage
function saveHTMLtoLS() {
	localStorage.setItem("tasksHTML", tasksList.innerHTML);
}*/

/* Убираем блок "Список пуст" через работу с данными массива*/
function checkEmptyList() {
	// проверка количества задач
	if (tasks.length === 0) {
		const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
					<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Список дел пуст</div>
				</li>`;
				tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
	}

	if (tasks.length > 0) {
		const emptyListEl = document.querySelector("#emptyList");
		emptyListEl ? emptyListEl.remove() : null;
	}
}

// функция сохранения данных массива (списка дел) в Local Storage
function saveToLocalStorage() {
	localStorage.setItem("tasks", JSON.stringify(tasks))
}

// функция для рендера данных из массива, которая избавит от дублирования кода выше
function renderTask(task) {
	// добавляем или не добавляем класс о выполнении задачи
	const cssClass = task.done ? "task-title task-title--done" : "task-title";


	//формируем разметку для новой задачи
	//шаблонные строки (обратные кавычки)
	const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>`;
	//console.log(taskHTML);

	//добавляем задачу на страницу
	tasksList.insertAdjacentHTML("beforeend", taskHTML);
}