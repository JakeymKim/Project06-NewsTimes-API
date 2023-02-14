const openNav = () => {
    document.getElementById("mySidenav").style.width = "250px";
  };
  
const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0";
};

const openSearchBox = () => {
    let inputArea = document.getElementById("input-area");
    if (inputArea.style.display === "inline") {
      inputArea.style.display = "none";
    } else {
      inputArea.style.display = "inline";
    };
};



let news = [];
let page = 1;
let total_pages = 0;
let url;

let menus = document.querySelectorAll(".menus button");
menus.forEach(menu => menu.addEventListener("click", (event)=>getNewsByTopic(event)));
let sideMenuList = document.querySelectorAll(".side-menu-list button");
sideMenuList.forEach(menu => menu.addEventListener("click", (event)=>getNewsByTopic(event)));

let searchButton = document.getElementById("search-button");
let searchInput = document.getElementById("search-input");
searchInput.addEventListener("focus", function(){searchInput.value=""});
searchInput.addEventListener("keypress",function(event) {
    if(event.key === "Enter") {
        event.preventDefault();
        document.getElementById("search-button").click();
        searchInput.value="";
    };
});


const getNews = async() => {
    try {
        let header = new Headers({'x-api-key':'rhT9h52YyTysyDBSC1Y1bt8ccOPUiXdzVih3gQru9oc'});
        url.searchParams.set('page', page);
        let response = await fetch(url,{headers:header});
        let data = await response.json();

        if(response.status == 200) {
            if(data.total_hits == 0) {
                throw new Error("No news was detected.");
            };
            news = data.articles;
            total_pages = data.total_pages;
            page = data.page;
            render();
            pagination();
        } else {
            throw new Error(data.message);
        };

    } catch(error) {
        errorRender(error.message);
    };
};

const getLatestNew = async() => {
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=kr&page_size=10`);
    getNews();
};

const getNewsByTopic = async(event) => {
    let topic = event.target.textContent.toLowerCase();
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=kr&page_size=10&topic=${topic}`);
    page = 1;
    getNews();
}

const getNewsByKeyword = async() => {
    let keyword = document.getElementById("search-input").value;
    url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`);
    page = 1;
    getNews();
}



const render = () => {
    let newsHTML = "";
    newsHTML = news.map((item) => {
        return `<div class="row news-padding">
        <div class="col-lg-4">
            <img class="news-img-size" src="${item.media || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"}"/>
        </div>
        <div class="col-lg-8">
            <h2>${item.title}</h2>
            <p>${item.summary == null || item.summary == "" ? "내용없음" : item.summary.length > 200 ? item.summary.substring(0, 200) + "..." : item.summary}</p>
            <div>${item.rights || "no source"} | ${moment(item.published_date).fromNow()}</div>
        </div>
        </div>`;
    }).join('');

    console.log(newsHTML);
    document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (message) => {
    let errorHTML = 
    `<div class="alert alert-danger text-center" role="alert">
        ${message}
    </div>`;
    document.getElementById("news-board").innerHTML = errorHTML;
};



const pagination = () => {
    let paginationHTML = ``;
    let pageGroup = Math.ceil(page/5);
    let last = pageGroup*5;
    if (last > total_pages) {
        last = total_pages;
    };
    let first = last-4 <= 0 ? 1 : last-4;


    if(first > 5) {
        paginationHTML += `<li class="page-item">
            <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page==1})">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
        <li class="page-item">
            <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page-1})">
             <span aria-hidden="true">&lt;</span>
            </a>
        </li>`;
    };

    for(let i=first; i<=last; i++) {
        paginationHTML += `<li class="page-item ${page==i?"active":""}"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`;
    };

    if(first < total_pages-4) {
        paginationHTML += `<li class="page-item">
            <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${page+1})">
                <span aria-hidden="true">&gt;</span>
            </a>
        </li>
        <li class="page-item">
            <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${total_pages})">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>`;
    };

    document.querySelector(".pagination").innerHTML = paginationHTML;
};

const moveToPage = (pageNumber) => {
    page = pageNumber;
    getNews();
};

searchButton.addEventListener("click", getNewsByKeyword);
getLatestNew();