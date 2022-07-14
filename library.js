let articles = Object.values(localStorage).map(article=> JSON.parse(article));
const newsListElement = document.querySelector('.news-list')

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

function render(){

    newsListElement.innerHTML = "";


    articles.forEach((article,index) => {

        const id = article.id

        const li = cre("li");
        li.classList.add("element");

        const h1 = cre('h1');
        h1.textContent = article.title;

        const p1 = cre('p')
        p1.textContent = article.newsSite
        const p2 = cre('p')
        p2.textContent = article.publishedAt.split("T")[0]
        const p3 = cre('p')
        p3.textContent = article.summary.substring(0,200)

        const a = cre('a')
        a.setAttribute('href',article.url);
        const button = cre('button');
        button.textContent = "Przeczytaj artykuł"

        const button2 = createRemoveButton(id);

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

function removeArticleFromLibrary (id) {
    localStorage.removeItem(id)
    articles = articles.filter(article => article.id !== id)
    render();

}


function getTimeFromString(string){
    return new Date(string).getTime()
}

function sortAscendingByPublishedAt (){
    articles = articles.sort((a,b) => getTimeFromString(a.publishedAt) > getTimeFromString(b.publishedAt) ? 1 : -1)
    render()
}

function sortDescendingByPublishedAt (){
    articles = articles.sort((a,b) => getTimeFromString(a.publishedAt) < getTimeFromString(b.publishedAt) ? 1 : -1)
    render()
}

document.querySelector('.search').addEventListener('submit',(e)=>{
    e.preventDefault();

    const value  = document.querySelector('.input').value;

    if(value === "1"){
        sortDescendingByPublishedAt()
    }
    else if(value === "2"){
        sortAscendingByPublishedAt()
    }
})


window.addEventListener('load',render)

document.querySelector('.search-query').addEventListener('submit',(e)=>{
    e.preventDefault();

    const value  = document.querySelector('.input-query').value;

    articles = Object.values(localStorage).map(article=> JSON.parse(article));

    articles = articles.filter(article => new RegExp(`${value}`,"i").test(article.title))

    render();



})