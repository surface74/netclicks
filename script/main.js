"use strict";

// menu
const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowsList = document.querySelector('.tv-shows__list');

//FUNCTIONS
const swapCardImg = (event) => {
    const target = event.target;
    if (target.classList.contains('tv-card__img') && target.dataset.backdrop) {
        [target.src, target.dataset.backdrop] = [target.dataset.backdrop, target.src];
    }
}

//EVENT HANDLERS
// open|close menu
hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});

document.body.addEventListener('click', (e) => {
    if (!e.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
    }
});

leftMenu.addEventListener('click', (e) => {
    const dropdown = e.target.closest('.dropdown');

    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }
});

//change image when hover card
tvShowsList.addEventListener('mouseover', swapCardImg);
tvShowsList.addEventListener('mouseout', swapCardImg);

// Day 1 Basics JS https://www.youtube.com/watch?v=FX0LOM10NtI&feature=youtu.be
// Day 1 Start coding https://www.youtube.com/watch?v=WbH26yOM4Ww&feature=youtu.be