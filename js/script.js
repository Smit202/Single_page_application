const API_URL_TRENDING = 'https://api.themoviedb.org/3/trending/movie/week?api_key=d1c4e309768955f1e83ccc8b483122d4&language=en-US&include_adult=false&page=1';
const API_URL_TOP_RATED = 'https://api.themoviedb.org/3/movie/top_rated?api_key=d1c4e309768955f1e83ccc8b483122d4&language=en-US&include_adult=false&page=1';
const API_URL_DISCOVER = 'https://api.themoviedb.org/3/discover/movie?api_key=d1c4e309768955f1e83ccc8b483122d4&language=en-US&sort_by=popularity.desc&include_adult=false&page=';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280/';

let menubtn = document.querySelector('#menu-btn');
let navbar = document.querySelector('.navbar');

menubtn.onclick = () => {
    menubtn.classList.toggle('fa-xmark');
    navbar.classList.toggle('active');
}

document.querySelector('#login-btn').onclick = () => {
    document.querySelector('.login-form-container').classList.toggle('active');
}

document.querySelector('#close-login-btn').onclick = () => {
    document.querySelector('.login-form-container').classList.remove('active');
}


window.onscroll = () => {

    if (window.scrollY > 0) {
        document.querySelector('.header').classList.add('active');
    } else {
        document.querySelector('header').classList.remove('active');
    }

    menubtn.classList.remove('fa-xmark');
    navbar.classList.remove('active');
}

window.onload = () => {

    if (window.scrollY > 0) {
        document.querySelector('.header').classList.add('active');
    } else {
        document.querySelector('header').classList.remove('active');
    }
}

let trending_movies = getMovies(API_URL_TRENDING);
let imgSlider = document.querySelector('.trending-slider-image');
let translate = 0;
console.log(trending_movies);
trending_movies.then((movies) => {
    movies.sort((a,b) => b.popularity - a.popularity);
    movies.every((item, index) => {
        if(index>19) return false;
        const img = document.createElement('img');
        img.src = IMG_PATH + item.backdrop_path;
        img.style.width = '100%';
        imgSlider.appendChild(img);
        return true;
    })
});

setInterval(() => {
    if(translate>=0 && translate<1900) {
        translate += 100;
    }
    else {
        translate = 0;
    }
    imgSlider.style.transition = '1s';
    imgSlider.style.transform = `translateX(${-translate}%)`;
}, 2000);

document.querySelector('.slider-btn-right').onclick = () => {
    if(translate<1900) {
        translate += 100;
        imgSlider.style.transition = '1s';
        imgSlider.style.transform = `translateX(${-translate}%)`;
    }
    if(translate>=1900) {
        translate = 0;
        imgSlider.style.transition = '1s';
        imgSlider.style.transform = `translateX(${-translate}%)`;
    }
}

document.querySelector('.slider-btn-left').onclick = () => {
    if(translate>0) {
        translate -= 100;
        imgSlider.style.transition = '1s';
        imgSlider.style.transform = `translateX(${-translate}%)`;
    }
    if(translate<=0) {
        translate = 1900;
        imgSlider.style.transition = '1s';
        imgSlider.style.transform = `translateX(${-translate}%)`;
    }
}

let wrapper = document.querySelector('.wraper-box');
let top_rated_movies = getMovies(API_URL_TOP_RATED);
console.log(top_rated_movies);

top_rated_movies.then((movies) => {
    wrapper.innerHTML = '';
    movies.every((item,index) => {
        if(index>6) return false;
        const div = document.createElement('div');
        div.classList.add('box');
        if(index===0) {
            div.classList.add('active');
            div.classList.add('fa-solid');
        }
        div.innerHTML = `
            <img src="${IMG_PATH + item.poster_path}" alt="">
            <div class="content">
                <h3>${item.title}</h3>
                <div class="price"><span>Rating: </span>${item.vote_average.toFixed(1)}</div>
                <p>Released on: ${item.release_date}</p>
                <a href="#" class="btn">Watch Now</a>
            </div>  ` ;
        wrapper.appendChild(div);
        return true;
    });

    let changeBox = () => {
    
        if(imgInd > activeBox.length - 1){
            imgInd = 0;
        } else if(imgInd < 0){
            imgInd = activeBox.length - 1;
        }
    
        for(let i = 0; i < activeBox.length; i++){
            if(i === imgInd){
                activeBox[i].classList.add('active');
                activeLable[i].classList.add('fa-solid');
                if(window.screen.width > 450){
                    wrapper.style.transform = `translateX(${imgInd * -250}px)`;
                }
            } else{            
                activeBox[i].classList.remove('active');
                activeLable[i].classList.remove('fa-solid');
            }
        }
    }

    let activeBox = wrapper.querySelectorAll('.box');
    let activeLable = document.querySelector('.activeCircle').querySelectorAll('.fa-circle')
    let nextBtn = document.querySelector('#nextBtn');
    let preBtn = document.querySelector('#preBtn');
    let imgInd = 0;
    // console.log(activeBox.length);

    nextBtn.onclick = ()=>{
        imgInd++;
        changeBox();
    }

    preBtn.onclick = ()=>{
        imgInd--;
        changeBox();
    }
});

const popular = document.getElementById('popular_movies');
const loadMore = document.querySelector('#loadmore-btn');
let page = 1;

getMovies(API_URL_DISCOVER + page).then((movies) => showMovies(movies));

loadMore.onclick = () => {
    page++;
    getMovies(API_URL_DISCOVER + page).then((movies) => showMovies(movies));
};

let rWrapper = document.querySelector('.review-wrapper-box');
let rActBox = rWrapper.querySelectorAll('.box');
let rActLable = document.querySelector('.rActCircle').querySelectorAll('.fa-circle')
let rNextBtn = document.querySelector('#rNextBtn');
let rPreBtn = document.querySelector('#rPreBtn');
let rImgInd = 0;

function showReviews(id) {
    console.log(id);
    getReviews(id).then((reviews) => {
        console.log(reviews);
        if(reviews.length===0) rWrapper.innerHTML = `<div style='width: 100%; text-align: center; font-size: 16pt'>Sorry, no reviews for this movie</div>`;
        else rWrapper.innerHTML = '';

        reviews.every((item,index) => {
            if(index>5) return false;
            const div = document.createElement('div');
            div.classList.add('box');
            if(index===0) {
                div.classList.add('active');
                div.classList.add('fa-solid');
            }

            div.innerHTML = `
                <img src="${IMG_PATH + item.author_details.avatar_path}" alt="">
                <div class="content">
                    <h3>${item.author}</h3>
                    <p>${item.content}</p>
                </div><br><br>
                <a href=${item.url} target='_blank' style='font-size: 14pt'>Full Review</a><br>`;

            rWrapper.appendChild(div);
            return true;
        });
    });
    window.location.href = '#reviews';
}

rNextBtn.onclick = () => {
    rImgInd++;
    rChangeBox();
}

rPreBtn.onclick = ()=>{
    rImgInd--;
    rChangeBox();
}

let rChangeBox = () =>{
    
    if(rImgInd > rActBox.length - 1){
        rImgInd = 0;
    } else if(rImgInd < 0){
        rImgInd = rActBox.length - 1;
    }
    for(let i = 0; i < rActBox.length; i++){
        if(i === rImgInd){
            rActBox[i].classList.add('active');
            rActLable[i].classList.add('fa-solid');
            if(window.screen.width > 768){
                rWrapper.style.transform = `translateX(${rImgInd * -20}vw)`;
            }  
        } else{            
            rActBox[i].classList.remove('active');
            rActLable[i].classList.remove('fa-solid');
        }
    }
}

async function getMovies(url){
    const res = await fetch(url);
    const data = await res.json();
    return data.results;
}

async function getReviews(movie_id){
    const API_URL_REVIEWS = `https://api.themoviedb.org/3/movie/${movie_id}/reviews?api_key=d1c4e309768955f1e83ccc8b483122d4&language=en-US&page=1`
    const res = await fetch(API_URL_REVIEWS);
    const data = await res.json();
    return data.results;
}

function showTrendingMovies(movies) {
    wrapper.innerHTML = '';
    movies.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('box');
        console.log(div.className);
        div.innerHTML = `
            <img src="${IMG_PATH + item.poster_path}" alt="">
            <div class="content">
                <h3>${item.title}</h3>
                <div class="price"><span>price: </span>Rs. 1,200,000</div>
                <p>
                    new
                    <span class="fa-solid fa-circle"></span>2023
                    <span class="fa-solid fa-circle"></span>automatic
                    <span class="fa-solid fa-circle"></span>petrol
                    <span class="fa-solid fa-circle"></span>183mph
                </p>
                <a href="#" class="btn">check out</a>
            </div>  ` ;
        wrapper.appendChild(div);
    });
}

function showMovies(movies) {
    movies.forEach((item) => {
        const {title, poster_path, vote_average, overview} = item;

        const movie = document.createElement('div');
        movie.classList.add('movie');

        movie.innerHTML = `
            <img src="${IMG_PATH + poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <div class="content">
                    <h3>Overview</h3>
                    ${overview}
                </div>
                <div class="review-btn">
                    <button type="button" class="btn movie-review" id="${item.id}" onclick="showReviews(${item.id})">Reviews</button>
                </div>
            </div> `;
        popular.appendChild(movie);
    });
}

function getClassByRate(vote){
    if(vote >= 8){
        return 'green';
    }
    else if (vote >= 5){
        return 'orange';
    } else{
        return 'red';
    }
}