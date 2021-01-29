const formItem = document.querySelector(".grocery-form");
const alertItem = document.querySelector(".alert");
const groceryItem = document.getElementById("grocery");
const submitButtonItem = document.querySelector(".submit-btn");
const containerItem = document.querySelector(".grocery-container");
const listItem = document.querySelector(".grocery-list");
const clearButtonItem = document.querySelector(".clear-btn");


let editElement;
let editFlag = false;
let editID = "";


formItem.addEventListener("submit", addItem);

clearButtonItem.addEventListener("click", clearItems);

window.addEventListener("DOMContentLoaded", setupItems);


var addItem = (e) => {

  e.preventDefault();
  const value = groceryItem.value;
  const id = new Date().getTime().toString();

  if (value !== "" && !editFlag) {
    const element = document.createElement("article");
    let attributeItem = document.createAttribute("data-id");
    attributeItem.value = id;
    element.setAttributeNode(attributeItem);
    element.classList.add("grocery-item");
    element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;

    const deleteButton = element.querySelector(".delete-btn");
    deleteButton.addEventListener("click", deleteItem);
    const editButton = element.querySelector(".edit-btn");
    editButton.addEventListener("click", editItem);

    listItem.appendChild(element);

    displayAlert("item added to the list", "success");

    containerItem.classList.add("show-container");

    addToLocalStorage(id, value);

    setBackToDefault();
  } else if (value !== "" && editFlag) {
    editElement.innerHTML = value;
    displayAlert("value changed", "success");

    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("please enter value", "danger");
  }
}

var displayAlert = (text, action) => {

  alertItem.textContent = text;
  alertItem.classList.add(`alert-${action}`);

  setTimeout(function () {
    alertItem.textContent = "";
    alertItem.classList.remove(`alert-${action}`);
  }, 1000);
}

var clearItems = () => {

  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach(function (item) {
      listItem.removeChild(item);
    });
  }
  containerItem.classList.remove("show-container");
  displayAlert("empty list", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}


var deleteItem = (e )=> {

  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;

  listItem.removeChild(element);

  if (listItem.children.length === 0) {
    containerItem.classList.remove("show-container");
  }
  displayAlert("item removed", "danger");

  setBackToDefault();

  removeFromLocalStorage(id);
}


var editItem = (e) => {

  const element = e.currentTarget.parentElement.parentElement;

  editElement = e.currentTarget.parentElement.previousElementSibling;

  groceryItem.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;

  submitButtonItem.textContent = "edit";
}


var setBackToDefault = () => {

  groceryItem.value = "";
  editFlag = false;
  editID = "";
  submitButtonItem.textContent = "submit";
}


var addToLocalStorage = (id, value) => {

  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}


var getLocalStorage = () => {

  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}


var removeFromLocalStorage = (id) => {

  let items = getLocalStorage();

  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });

  localStorage.setItem("list", JSON.stringify(items));
}


var editLocalStorage = (id, value) => {

  let items = getLocalStorage();

  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });

  localStorage.setItem("list", JSON.stringify(items));
}


var setupItems = () => {

  let items = getLocalStorage();

  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    containerItem.classList.add("show-container");
  }
}


var createListItem = (id, value) => {

  const element = document.createElement("article");
  let attributeItem = document.createAttribute("data-id");

  attributeItem.value = id;
  element.setAttributeNode(attributeItem);
  element.classList.add("grocery-item");

  element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;

  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);

  listItem.appendChild(element);
}