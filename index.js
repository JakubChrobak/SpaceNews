const newsListElement = document.querySelector(`.news-list`)

let articlesPerPage = 15;
let currentPage = 0;
let allArticlesCount = 0;
let allLoadedArticles = 0;

let allArticles = {}


const API_ENDPOINT = "https://api.spaceflightnewsapi.net/v3"

async function getAllArticlesCount(){
    const response = await fetch(API_ENDPOINT + "/articles/count")

    allArticlesCount =  await response.json()
}



async function updateCurrentPage(page){
    currentPage = page;
    await getArticles();
    getShowedArticlesCounter()
}


function cre(element) {
    return document.createElement(element)
}

function createRemoveButton(id){
    const btn = cre('button');
    btn.textContent = "Usuń z biblioteki"
    btn.addEventListener('click',()=>removeArticleFromLibrary(id))
    btn.id = `id${id}`

    return btn;
}

function createAddButton(id){
    const btn = cre('button');
    btn.textContent = "Dodaj do biblioteki"
    btn.addEventListener('click',()=>addArticleToLibrary(id))
    btn.id = `id${id}`

    return btn;
}

async function getArticles(){


    const response = await fetch(API_ENDPOINT +`/articles?_start=${allLoadedArticles}&_limit=${ articlesPerPage}`);

    const articles = await response.json();

    allLoadedArticles+=articlesPerPage;


    articles.forEach((article) => {


        const id = article.id
        const isInLocalStorage = !!localStorage[id]

        allArticles[id] = article;

        const li = cre("li");
        li.classList.add("element");

        const h1 = cre('h1');
        h1.textContent = article.title;

        const p1 = cre('p')
        p1.textContent = article.newsSite
        const p2 = cre('p')
        p2.textContent = article.publishedAt.split("T")[0]
        const p3 = cre('p')
        p3.textContent = article.summary.substring(0,200) + "..."

        const a = cre('a')
        a.setAttribute('href',article.url);
        const button = cre('button');
        button.textContent = "Przeczytaj artykuł"

        let button2;



        if(isInLocalStorage){
            button2 = createRemoveButton(id)
        }else{
            button2 = createAddButton(id)
        }




        a.appendChild(button)
        li.appendChild(h1);
        li.appendChild(p1)
        li.appendChild(p2)
        li.appendChild(p3)
        li.appendChild(a)
        li.appendChild(button2)

        newsListElement.appendChild(li);

    })
}


function getShowedArticlesCounter(){
    document.querySelector(".articles-count").textContent = `${allLoadedArticles} / ${allArticlesCount}`
}

window.addEventListener('scroll', () => {
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
        updateCurrentPage(currentPage+1);
    }
});

async function run(){

    await getAllArticlesCount();

    document.querySelector(`.input`).value = articlesPerPage

    updateCurrentPage(0);
}


function updateArticlesPerPage(e){
    e.preventDefault();
    const value = document.querySelector('.input').value

    newsListElement.innerHTML = "";

    allLoadedArticles = 0;

    articlesPerPage = Number(value);

    updateCurrentPage(0)
}

function addArticleToLibrary(id){
    localStorage.setItem(id,JSON.stringify(allArticles[id]))
    const el = document.querySelector(`#id${id}`)


    const btn = createRemoveButton(id);

    el.parentNode.replaceChild(btn,el)
}

function removeArticleFromLibrary (id) {
    localStorage.removeItem(id)
    const el = document.querySelector(`#id${id}`)
    const btn = createAddButton(id);

    el.parentNode.replaceChild(btn,el)

}

window.addEventListener('load',run)
document.querySelector('.search').addEventListener('submit',updateArticlesPerPage)
