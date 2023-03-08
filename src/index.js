import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/style.css';
const axios = require('axios').default;

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
const alertPopup = document.querySelector('.alert');
alertPopup.style.visibility = 'hidden';

let page = 1;

// Controls the number of items in the group
let per_page = 40;
// In our case total number of pages is calculated on frontend
const totalPages = 200 / per_page;

form.addEventListener('submit', async e => {
  e.preventDefault();
  gallery.innerHTML = ''; // очистити галерею перед новим пошуком
  loadMore.style.visibility = 'hidden';

  const searchQuery = e.target.searchQuery.value;
  const images = await searchImages(searchQuery);

  if (page >= totalPages) {
    loadMore.style.visibility = 'hidden';
  } else {
    loadMore.style.visibility = 'visible';
  }

  images.forEach(image => {
    const card = createImageCard(image);
    gallery.appendChild(card);
    card.addEventListener('click', el => {
      el.preventDefault();
      const showImage = new SimpleLightbox('.gallery a', {
        caption: true,
        captionsData: 'alt',
        captionDelay: 250,
      });
    });
  });

  page += 1;
});

loadMore.addEventListener('click', loadMoreImages);

async function loadMoreImages() {
  const searchQuery = form.searchQuery.value;
  const images = await searchImages(searchQuery);

  if (page >= totalPages) {
    loadMore.style.visibility = 'hidden';
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }

  images.forEach(image => {
    const card = createImageCard(image);
    gallery.appendChild(card);
    card.addEventListener('click', l => {
      el.preventDefault();
      const showImage = new SimpleLightbox('.gallery a', {
        caption: true,
        captionsData: 'alt',
        captionDelay: 250,
      });
    });
  });
  page += 1;
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

async function searchImages(searchQuery) {
  const key = '34165774-2822bb13044e476c2c4111310';
  const url = `https://pixabay.com/api/?key=${key}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${per_page}&page=${page}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

    if (data.totalHits === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    return data.hits;
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
}

function createImageCard(image) {
  const card = document.createElement('div');
  card.classList.add('card');

  const link = document.createElement('a');
  link.href = image.largeImageURL;
  link.target = '_top';
  link.classList.add('photo-card');

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.classList.add('photo-image');

  const info = document.createElement('div');
  info.classList.add('info');

  const likes = document.createElement('p');
  likes.textContent = `Likes: ${image.likes}`;
  likes.classList.add('info-item');

  const views = document.createElement('p');
  views.textContent = `Views: ${image.views}`;
  views.classList.add('info-item');

  const comments = document.createElement('p');
  comments.textContent = `Comments: ${image.comments}`;
  comments.classList.add('info-item');

  const downloads = document.createElement('p');
  downloads.textContent = `Downloads: ${image.downloads}`;
  downloads.classList.add('info-item');

  link.appendChild(img);
  info.appendChild(likes);
  info.appendChild(views);
  info.appendChild(comments);
  info.appendChild(downloads);

  card.appendChild(link);
  card.appendChild(info);

  return card;
}
