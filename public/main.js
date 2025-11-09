const FAVORITES_KEY = "cocinaFavorites";

const tareasList = document.querySelector("#tareasList");
const favoritesList = document.querySelector("#favoritesList");
const searchInput = document.querySelector("#searchInput");

let tareas = []; // se llenará con el fetch

// Normaliza texto (para filtrar sin tildes)
const normalize = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

// Función para aplicar filtro
function applyFilter() {
  const q = normalize(searchInput.value.trim());
  const filtered = q
    ? tareas.filter((t) => normalize(t.name).includes(q))
    : tareas;
  renderTareas(filtered);
}

// Renderizar lista de tareas
function renderTareas(lista) {
  tareasList.innerHTML = "";

  lista.forEach((tarea) => {
    const li = document.createElement("li");
    li.className = "tarea-item";

    const title = document.createElement("h3");
    title.textContent = tarea.name;
    title.className = "tarea-title";
    title.onclick = () => toggleFavorite(tarea);

    const ul = document.createElement("ul");
    ul.className = "tarea-steps";

    tarea.steps.forEach((step) => {
      const stepLi = document.createElement("li");
      stepLi.textContent = step;
      ul.appendChild(stepLi);
    });

    li.appendChild(title);
    li.appendChild(ul);
    tareasList.appendChild(li);
  });
}

// Renderizar favoritos
function renderFavorites(favorites) {
  favoritesList.innerHTML = "";

  favorites.forEach((tarea) => {
    const li = document.createElement("li");
    li.className = "tarea-item favorite";

    const title = document.createElement("h3");
    title.textContent = tarea.name;
    title.className = "tarea-title";
    title.onclick = () => toggleFavorite(tarea);

    const ul = document.createElement("ul");
    ul.className = "tarea-steps";
    tarea.steps.forEach((s) => {
      const stepLi = document.createElement("li");
      stepLi.textContent = s;
      ul.appendChild(stepLi);
    });

    li.appendChild(title);
    li.appendChild(ul);
    favoritesList.appendChild(li);
  });
}

// Añadir o quitar favoritos
function toggleFavorite(tarea) {
  let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  const exists = favorites.find((t) => t.name === tarea.name);
  favorites = exists
    ? favorites.filter((t) => t.name !== tarea.name)
    : [...favorites, tarea];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  renderFavorites(favorites);
}

// Cargar datos desde el JSON con fetch
fetch("assets/tareas.json")
  .then((response) => response.json())
  .then((data) => {
    tareas = data;
    renderTareas(tareas);
    const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
    renderFavorites(favorites);
  })
  .catch((error) => console.error("Error al cargar tareas:", error));

// Escucha el input para filtrar
searchInput.addEventListener("input", applyFilter);
