const $searchButton = document.getElementById('iprocurar');
const overlay = document.getElementById('modalOverlay');
const movieName = document.getElementById('inome');
const movieYear = document.getElementById('iano');
const movieListContainer = document.getElementById('movieList');

//?? garante sempre que a váriavel seja uma lista
let movieList = JSON.parse(localStorage.getItem('movieList')) ?? [];

//função responsável pela chamada da api
async function searchClickButtonHandler() {
  try {
    let url = `https://www.omdbapi.com/?apikey=${key}&t=${movieParameterGenerator()}${movieYearParameterGenerator()}`;
    //precisa gerar uma chave no site da omdbapi

    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    if (data.Error) {
      throw new Error('Filme não encontrado');
    }
    createModal(data);

    overlay.classList.add('open');
  } catch (error) {
    notie.alert({ type: 'error', text: error.message });
  }
}

//responsáveis para validar campos do filme e ano
function movieParameterGenerator() {
  if (movieName.value.trim() === '') {
    throw new Error('O nome do filme deve ser informado');
  }
  return movieName.value.split(' ').join('+');
  // console.log(movieName.value.split(' ').join('+'));
}

function movieYearParameterGenerator() {
  if (movieYear.value.trim() === '') {
    return '';
  }
  if (movieYear.value.length !== 4 || Number.isNaN(Number(movieYear.value))) {
    throw new Error('O ano digitado não é valido');
  }
  return `&y=${movieYear.value}`;
}

//add filme a lista
function addToList(movieObject) {
  movieList.push(movieObject);
}
//verifica se o filme existe na lista
function isMovieAlreadyOnList(id) {
  function doesThisIdBelongToThisMovie(movieObject) {
    return movieObject.imdbID === id;
  }
  //acha o id do filme
  return Boolean(movieList.find(doesThisIdBelongToThisMovie));
}

//insere o container do filme no html
function updateUI(movieObject) {
  const movieCard = document.createElement('div');
  movieCard.classList.add('containerMovie');
  movieCard.id = `movieCard${movieObject.imdbID}`;

  const img = document.createElement('img');
  img.src = movieObject.Poster;
  img.alt = `Poster de ${movieObject.Title}`;

  // Evento de clique na imagem para abrir o modal
  img.addEventListener('click', () => {
    openInfoModal(movieObject);
  });

  const button = document.createElement('button');
  button.innerHTML = `Remover <i class="bi bi-trash-fill"></i>`;
  button.addEventListener('click', () =>
    removeMovieFromList(movieObject.imdbID)
  );

  movieCard.appendChild(img);
  movieCard.appendChild(button);
  movieListContainer.appendChild(movieCard);
}

//abre um modal com apenas as info do filme sem o botao de adicionar
function openInfoModal(movie) {
  modalContainer.innerHTML = `  
    <h2 id="movieTilte">${movie.Title} - ${movie.Year}</h2>
    <section id="modalBody">
      <img id="moviePoster" src="${movie.Poster}" alt="Poster de ${movie.Title}">
      <div id="movieInfo">
        <h3 id="moviePlot">${movie.Plot}</h3>
        <div>
          <h4>Elenco:</h4>
          <h5>${movie.Actors}</h5>
        </div>
        <div>
          <h4>Gênero:</h4>
          <h5 id="movieGenre">${movie.Genre}</h5>
        </div>
      </div>
    </section>
  `;

  overlay.classList.add('open');
}
//remove o filme da lista
function removeMovieFromList(id) {
  notie.confirm({
    text: 'Deseja remover o filme da sua lista?',
    submitText: 'Sim',
    cancelText: 'Não',
    position: 'Top',
    submitCallback: function remove() {
      movieList = movieList.filter((movie) => movie.imdbID !== id);
      document.getElementById(`movieCard${id}`).remove();
      updateLocalStorage();
    },
  });
}

//guarda o filme no localStorage
function updateLocalStorage() {
  localStorage.setItem('movieList', JSON.stringify(movieList));
}

//responsável por recarregar os filmes na lista ja existente
for (movieInfo of movieList) {
  updateUI(movieInfo);
}

//evento no butão de busca e abertura do modal
$searchButton.addEventListener('click', searchClickButtonHandler);
