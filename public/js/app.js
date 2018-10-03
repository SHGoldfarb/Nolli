const APIKEY = '9dff6a76a3214010abbeb89d9f90a332'
const COUNTRIES = {
    none: 'Elija país',
    ar: 'Argentina',
    br: 'Brazil',
    us: 'United States',
    jp: 'Japan'
};

const addNews = (shadowRoot, article) => {
    const thisTemplate = document.createElement('template');
    thisTemplate.innerHTML = `
        <news-box url="${article.url}">
            <h5>${article.title}</h5>
            <div>${article.source.name}</div>
        </neews-box>
    `;
    shadowRoot.appendChild(thisTemplate.content.cloneNode(true));
}

let newsContainerShadow;

const addCountries = (country) => {
    const url = `https://newsapi.org/v2/top-headlines?` +
        `country=${country}&` +
        `apiKey=9dff6a76a3214010abbeb89d9f90a332`;
    const req = new Request(url);
    fetch(req)
        .then((response) => {
            response.json().then(news => {
                console.log(news.articles);
                removeNews()
                this.news = true;
                news.articles.forEach((article) => addNews(newsContainerShadow, article))
            });
        });
};

const removeNews = () => {
    let newsBox = newsContainerShadow.querySelector('news-box');
    console.log(newsBox);
    while (newsBox) {
        newsContainerShadow.removeChild(newsBox);
        newsBox = newsContainerShadow.querySelector('news-box');
    }

}

window.customElements.define('news-container', class NewsContainer extends HTMLElement {
    set news(val) {
        if (val) {
            this.setAttribute('news', true)
        }
    }
    constructor() {
        super();

        newsContainerShadow = this.attachShadow({ mode: 'open' });

        ['css/styles.css', 'css/materialize.css'].forEach((style => {
            const stylesLink = document.createElement('link');
            stylesLink.setAttribute('rel', 'stylesheet');
            stylesLink.setAttribute('href', style);
            newsContainerShadow.appendChild(stylesLink.cloneNode(true));
        }))

        console.log('news-container defined');

    }
});

window.customElements.define('news-box', class NewsBox extends HTMLElement {
    get url() {
        return this.getAttribute('url');
    }
    constructor() {
        super();
        const url = this.url;
        this.addEventListener("click", e => {
            window.location.href = url;
        })
    }
})

window.customElements.define('country-selector', class CountrySelector extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        // ['css/styles.css', 'css/materialize.css'].forEach((style => {
        //     const stylesLink = document.createElement('link');
        //     stylesLink.setAttribute('rel', 'stylesheet');
        //     stylesLink.setAttribute('href', style);
        //     shadowRoot.appendChild(stylesLink.cloneNode(true));
        // }));
        shadowRoot.innerHTML += `
            <select>
                ${Object.entries(COUNTRIES).map(([key, value]) =>
                `<option value="${key}">${value}</option>`).join('')}
            </select >
    `;


        console.log('country-selector defined');
        const selector = shadowRoot
            .querySelector('select');


        selector.addEventListener('change', () => {
            addCountries(selector.value);
        });
    }
})