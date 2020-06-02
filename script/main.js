"use strict";

// VARIABLES
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const SEARCH_TITLE = 'Результат поиска';

const leftMenu = document.querySelector('.left-menu'),
    hamburger = document.querySelector('.hamburger'),
    tvShowsList = document.querySelector('.tv-shows__list'),
    tvShows = document.querySelector('.tv-shows'),
    modal = document.querySelector('.modal'),
    tvCardImg = document.querySelector('.tv-card__img'),
    genresList = document.querySelector('.genres-list'),
    rating = document.querySelector('.rating'),
    modalTitle = document.querySelector('.modal__title'),
    description = document.querySelector('.description'),
    modalLink = document.querySelector('.modal__link'),
    preloaderModalCard = document.querySelector('.preloader'),
    searchForm = document.querySelector('.search__form'),
    searchFormInput = document.querySelector('.search__form-input'),
    tvShowsHead = document.querySelector('.tv-shows__head'),
    imageContent = document.querySelector('.image__content')
    ;

const loading = document.createElement('div');
loading.className = 'loading';

class DBService {
    constructor() {
        this.SERVER = 'https://api.themoviedb.org/3';
        this.API_KEY = 'd3902ace4c4cc0a2492d55d2205a42bd';
    }

    getData = async (url) => {
        const res = await fetch(url);
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`Не удалось получить данные по адресу ${url}`);
        }

    }
    // getTestData = () => {
    //     return this.getData('test.json');
    // }
    // getTestCard = () => {
    //     return this.getData('card.json');
    // }
    getSearchResult = (query) => {
        return this.getData(
            `${this.SERVER}/search/tv?api_key=${this.API_KEY}&language=ru-RU&query=${query}&page=1`);
    }
    //get top rated shows
    getTopRatedShows = () => {
        return this.getData(
            `${this.SERVER}/tv/top_rated?api_key=${this.API_KEY}&language=ru-RU&page=1`);
    }
    //get popular shows
    getPopularShows = () => {
        return this.getData(
            `${this.SERVER}/tv/popular?api_key=${this.API_KEY}&language=ru-RU&page=1`);
    }
    //get today shows
    getTodayShows = () => {
        return this.getData(
            `${this.SERVER}/tv/airing_today?api_key=${this.API_KEY}&language=ru-RU&page=1`);
    }
    //get week shows
    getWeekShows = () => {
        return this.getData(
            `${this.SERVER}/tv/on_the_air?api_key=${this.API_KEY}&language=ru-RU&page=1`);
    }
    getTvShow = id => {
        return this.getData(
            `${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`);
    }
}

//FUNCTIONS
const swapCardImg = (event) => {
    const target = event.target;
    if (target.matches('.tv-card__img') && target.dataset.backdrop) {
        [target.src, target.dataset.backdrop] = [target.dataset.backdrop, target.src];
    }
};

const closeLeftSideMenu = () => {
    leftMenu.classList.remove('openMenu');
    hamburger.classList.remove('open');
}

const renderCards = (response, title = SEARCH_TITLE) => {
    tvShowsList.textContent = '';

    if (title !== SEARCH_TITLE) {
        searchForm.classList.add('hide');
    }

    if (response.total_results) {
        tvShowsHead.textContent = title;
        response.results.forEach(item => {
            const { name: title,
                vote_average: vote,
                poster_path: poster,
                backdrop_path: backdrop,
                id
            } = item;

            const posterURL = (poster) ? IMG_URL + poster : './img/no-poster.jpg';
            const backdropURL = (backdrop) ? IMG_URL + backdrop : '';
            const voteElem = (vote) ? `<span class="tv-card__vote">${vote}</span>` : '';

            const card = document.createElement('li');
            card.className = 'tv-shows__item';
            card.innerHTML = `
            <a class="tv-card" data-id=${id}>
                ${voteElem}
                <img class="tv-card__img" src="${posterURL}"
                    data-backdrop="${backdropURL}"
                    alt="${title}">
                <h4 class="tv-card__head">${title}</h4>
            </a>
        `;
            tvShowsList.append(card);
        })
    } else {
        tvShowsHead.textContent = 'По вашему запросу сериалов не найдено';
    }
    loading.remove();
}

const renderModalCard = cardInfo => {
    const { poster_path,
        name: title,
        genres: genresArr,
        vote_average,
        overview,
        homepage
    } = cardInfo;

    if (poster_path) {
        imageContent.style.display = '';
        tvCardImg.src = IMG_URL + poster_path;
    } else {
        imageContent.style.display = 'none';
    }

    modalTitle.textContent = title;
    genresList.innerHTML = genresArr
        .reduce((acc, item) => `${acc}<li>${item.name}</li>`, '');
    rating.textContent = vote_average || '';
    description.textContent = overview;
    modalLink.href = homepage;
}

//EVENT HANDLERS
searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const value = searchFormInput.value.trim();
    if (value) {
        tvShows.append(loading);
        new DBService().getSearchResult(value)
            .then(renderCards)
            .then(searchFormInput.value = '');
    }
});

// open|close menu
hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});

document.body.addEventListener('click', e => {
    if (!e.target.closest('.left-menu')) {
        closeLeftSideMenu();
    }
});

//manage left-side menu
leftMenu.addEventListener('click', e => {
    e.preventDefault();
    const target = e.target;
    const dropdown = target.closest('.dropdown');

    if (dropdown) { //open menu
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    } else if (target.querySelector('#search') || target.closest('#search')) {
        searchForm.classList.remove('hide');
        closeLeftSideMenu();
    } else if (target.querySelector('#popular') || target.closest('#popular')) {
        closeLeftSideMenu();
        tvShows.append(loading);
        new DBService().getPopularShows()
            .then(data => renderCards(data, 'Популярные'));
    } else if (target.querySelector('#top-rated') || target.closest('#top-rated')) {
        closeLeftSideMenu();
        tvShows.append(loading);
        new DBService().getTopRatedShows()
            .then(data => renderCards(data, 'Топ сериалы'));
    } else if (target.querySelector('#today') || target.closest('#today')) {
        closeLeftSideMenu();
        tvShows.append(loading);
        new DBService().getTodayShows()
            .then(data => renderCards(data, 'Сегодня'));
    } else if (target.querySelector('#week') || target.closest('#week')) {
        closeLeftSideMenu();
        tvShows.append(loading);
        new DBService().getWeekShows()
            .then(data => renderCards(data, 'На этой неделе'));
    }

});

//change image when hover card
tvShowsList.addEventListener('mouseover', swapCardImg);
tvShowsList.addEventListener('mouseout', swapCardImg);

//open modal window
tvShowsList.addEventListener('click', e => {
    const card = e.target.closest('.tv-card');
    if (card) {
        preloaderModalCard.style.display = 'block';

        new DBService().getTvShow(card.dataset.id)
            .then(renderModalCard)
            .then(() => {
                preloaderModalCard.style.display = 'none';
                document.body.style.overflow = 'hidden';
                modal.classList.remove('hide');
            });
    }
});
//close modal windows
modal.addEventListener('click', e => {
    const target = e.target;
    if (target.matches('.modal') || target.closest('.cross')) {
        document.body.style.overflow = '';
        modal.classList.add('hide');
    }
});



// Day1 Basics JS https://www.youtube.com/watch?v=FX0LOM10NtI
// Day1 Start coding https://www.youtube.com/watch?v=WbH26yOM4Ww

// Day2 https://www.youtube.com/watch?v=-FdfhYxUbNc
//      to get API go to https://tmdb.org

// Day3 https://www.youtube.com/watch?v=I7qCBct9mYs

// Day4 https://www.youtube.com/watch?v=S79s6TWxc48


// Изучаем JavaScript -2019 Фримен Эрик
// Выразительный JS