const background = document.getElementById('modalBackground');
const modalContainer = document.getElementById('modalContainer');

function backgroundClickHandler() {
  overlay.classList.remove('open');
}

let currentMovie = {};

//FUNÇÃO RESPONSÁVEL PARA CHAMADAS DAS FUNÇÕES SECUNDARIAS NO BOTÃO DO MODAL "ADD FILME A LISTA"
function addCurrentaMovieToList() {
  if (isMovieAlreadyOnList(currentMovie.imdbID)) {
    notie.alert({ type: 'error', text: 'Filme já está na sua lista' });
    return;
  }
  addToList(currentMovie);
  updateUI(currentMovie);
  updateLocalStorage();
  closeModal();
}

//responsável pela criação do modal no HTML
function createModal(data) {
  currentMovie = data;

  modalContainer.innerHTML = `  
  <h2 id="movieTilte">${data.Title} - ${data.Year}</h2>
        <section id="modalBody">
          <img id="moviePoster" src=${data.Poster}
            alt="poster como treinar seu dragão">

          <div id="movieInfo">
            <h3 id="moviePlot">${data.Plot}</h3>
            <div>
              <h4>Elenco:</h4>
              <h5>${data.Actors}</h5>
            </div>

            <div>
              <h4>Gênero:</h4>
              <h5 id="movieGenre">${data.Genre}</h5>
            </div>
          </div>
        </section>
        <section id="modalFooter">
          <button id="addToList" onclick="addCurrentaMovieToList()">Adicionar a lista</button>
        </section>`;
}

//fechar o modal
function closeModal() {
  overlay.classList.remove('open');
}

//evento de quando clicar fora do modal, o mesmo feche.
background.addEventListener('click', backgroundClickHandler);
