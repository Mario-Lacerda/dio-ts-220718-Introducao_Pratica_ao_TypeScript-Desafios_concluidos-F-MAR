/**
 * Um desenvolvedor tentou criar um projeto que consome a base de dados de filme
 * do TMDB para criar um organizador de filmes, mas desistiu pois considerou o
 * seu código inviável.
 *
 * Você consegue usar typescript para organizar esse código e a partir daí
 * aprimorar o que foi feito?
 *
 * A ideia dessa atividade é criar um aplicativo que:
 * - Busca filmes
 * - Apresenta uma lista com os resultados pesquisados
 * - Permite a criação de listas de filmes e a posterior adição de filmes nela
 *
 * Todas as requisições necessárias para as atividades acima já estão prontas,
 * mas a implementação delas ficou pela metade (não vou dar tudo de graça).
 *
 * Atenção para o listener do botão login-button que devolve o sessionID do
 * usuário
 * É necessário fazer um cadastro no https://www.themoviedb.org/ e seguir a
 * documentação do site para entender como gera uma API key
 * https://developers.themoviedb.org/3/getting-started/introduction
 */

/**
 * Eu mantive alguns os nomes de alguns elementos como no código original.
 */

'use strict'


// -----------------------------------------------------------------------------
// Funções utilitárias

const hideElm = (element: HTMLElement) => element.classList.add('_hidden');
const showElm = (element: HTMLElement) => element.classList.remove('_hidden');
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));










// -----------------------------------------------------------------------------
// Manipulador de requisições via HTTP

type THttpClientGetParams = {
    url: string,
    method: 'GET' | 'POST',
    body?: any
}

class HttpClient {
    /**
     * Faz uma requisição para a URL em param0.url, usando o método HTTP definido em param0.method,
     * opcionalmente transportando o conteúdo de param0.body.
     *
     * @param param0 THttpClientGetParams object
     * @returns Promise<any>
     */
    static async request({ url, method, body = null }: THttpClientGetParams): Promise<any> {
        function rejectResult(xhr: XMLHttpRequest) {
            const { status, statusText, response, responseText } = xhr;
            return ({ status, statusText, response: JSON.parse(response), responseText, xhr });
        }

        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();

            xhr.open(method, url, true);

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300)
                    resolve(JSON.parse(xhr.responseText));
                else
                    reject(rejectResult(xhr));
            }

            xhr.onerror = () => reject(rejectResult(xhr));

            if (body) {
                xhr.setRequestHeader(
                    "Content-Type",
                    "application/json;charset=UTF-8"
                );
                body = JSON.stringify(body);
            }

            xhr.send(body);
        })
    }

    static async get({ url, body = null }: { url: string, body?: any }) {
        return this.request({ url, method: 'GET', body });
    }

    static async post({ url, body = null }: { url: string, body?: any }) {
        return this.request({ url, method: 'POST', body });
    }
}










// -----------------------------------------------------------------------------
// Autenticação

const accountStatusElm: HTMLElement = document.querySelector('.app-header>.status') as HTMLElement;
const apiLoginShowFormButton: HTMLAnchorElement = document.getElementById('show-api-login-button') as HTMLAnchorElement;

const apiLoginSection: HTMLElement = document.querySelector('.api-login') as HTMLElement;
const apiLoginStatus: HTMLElement = apiLoginSection.querySelector('.status') as HTMLElement;
const usernameInput: HTMLInputElement = document.getElementById('username') as HTMLInputElement;
const passwordInput: HTMLInputElement = document.getElementById('senha') as HTMLInputElement;
const apiKeyInput: HTMLInputElement = document.getElementById('api-key') as HTMLInputElement;
const loginButton: HTMLButtonElement = document.getElementById('login-button') as HTMLButtonElement;
const loginCancelButton: HTMLButtonElement = document.getElementById('cancel-login-button') as HTMLButtonElement;

// Conta e chave de api gerada com endereço temporário de e-mail:

const defaultUsername = 'sanav56208';
const defaultPassword = 'sanav56208@agrolivana.com';
const defaultApiKey = '2e2ca706ac131ebae728a324d40f1d31';

let apiKey: string;
let username: string;
let password: string;

let requestToken: string;
let sessionId: string;

interface IAccount {
    id: number,
    name: string,
    username: string,
}
let account: IAccount | null = null;

const userIsAuthenticated = () => ((account != null) && (account.id != null) && (account.id != undefined) && apiKey);

// TODO: Remove before commit
apiKeyInput.value = defaultApiKey;
apiKey = defaultApiKey
usernameInput.value = defaultUsername;
username = defaultUsername
passwordInput.value = defaultPassword;
password = defaultPassword;

apiLoginShowFormButton?.addEventListener('click', () => {
    apiLoginSection.classList.remove('_hidden');
});

loginCancelButton.addEventListener('click', () => {
    apiLoginSection.classList.add('_hidden');
});

usernameInput?.addEventListener('change', function () {
    username = usernameInput.value;
    validateLoginButton();
});

passwordInput?.addEventListener('change', function () {
    password = passwordInput.value;
    validateLoginButton();
});

apiKeyInput?.addEventListener('change', function () {
    apiKey = apiKeyInput.value;
    validateLoginButton();
});

function validateLoginButton() {
    loginButton.disabled = !(password && username && apiKey);
}

validateLoginButton();

function updateAccountStatus(accountIn: IAccount | null = null) {
    account = accountIn;
    if (account && account.id) {
        const accountName = account.name.trim().length > 0 ? account.name : account.username;
        accountStatusElm.innerHTML = `Olá<br>${accountName}!`
    }
    else
        accountStatusElm.innerHTML = `Usuário<br>ANÔNIMO`;
    console.log('Account', account)
}
updateAccountStatus();

loginButton.addEventListener('click', async () => {
    console.log('Iniciando login...')
    apiLoginStatus.innerHTML = '';
    try {
        await criarRequestToken();
        await logar();
        await criarSessao();
        await getAccount();
        apiLoginStatus.innerHTML = 'Login bem sucedido!';
        console.log('Login bem sucedido.')
        delay(1000).then(() => apiLoginSection.classList.add('_hidden'));
        await getUserLists();
        procurarFilme();
    }
    catch (error: any) {
        let statusMessage: string = 'Erro ao tentar o login.<br/>Login não concluído.';
        if (error.response.status_message) {
            statusMessage += '<br><em>' + error.response.status_message + '</em><br>';
        }
        apiLoginStatus.innerHTML = statusMessage + 'Mais detalhes no console do navegador.';
        console.log('Erro ao efetuar login: ', error);
    }
    console.log('requestToken', requestToken);
    console.log('sessionId', sessionId);
});

async function criarRequestToken() {
    let result: any = await HttpClient.get({
        url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
    });
    requestToken = result.request_token;
}

async function logar() {
    let result: any = await HttpClient.post({
        url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
        body: {
            username: `${username}`,
            password: `${password}`,
            request_token: `${requestToken}`
        }
    });
}

async function criarSessao() {
    let result = await HttpClient.get({
        url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
    })
    sessionId = result.session_id;
}

async function getAccount() {
    // if (!(apiKey && sessionId)) return;
    let result = await HttpClient.get({
        url: `https://api.themoviedb.org/3/account?api_key=${apiKey}&session_id=${sessionId}`,
    })
    updateAccountStatus(result);
}










// -----------------------------------------------------------------------------
// Busca de filmes

let query: string = '';

type TSearchResultItem = {
    adult: boolean,
    backdrop_path: string,
    genre_ids: number[],
    id: number,
    original_language: string,
    original_title: string,
    overview: string,
    popularity: number,
    poster_path: string,
    release_date: string,
    title: string,
    video: boolean,
    vote_average: number,
    vote_count: number
};

type TSearchResult = {
    page: number,
    results: TSearchResultItem[],
    total_pages: number,
    total_results: number
}

const searchButton: HTMLButtonElement = document.getElementById('search-button') as HTMLButtonElement;
const searchInput: HTMLInputElement = document.getElementById('search-input') as HTMLInputElement;

const searchResultStatus: HTMLElement = document.getElementById('search-result-status') as HTMLElement;
const searchResultList: HTMLUListElement = document.getElementById('search-result-list') as HTMLUListElement;
const searchResultPages: HTMLElement = document.getElementById('search-result-pages') as HTMLElement;
const searchResultMessage: HTMLElement = document.getElementById('search-result-message') as HTMLElement;

searchButton.addEventListener('click', () => procurarFilme());

searchResultPages.addEventListener('click', function (this: HTMLElement, event: MouseEvent) {
    const eventTarget = event.target as HTMLElement;
    if (!eventTarget.dataset.page) return;
    const page: number = Number.parseInt(eventTarget.dataset.page);
    if (!page) return;
    procurarFilme(page);
})

async function procurarFilme(page: number = 1) {
    // Reseta a página se os termos mudaram.
    if (query != searchInput.value) {
        page = 1;
        query = searchInput.value;
    }
    if (!(query && query.trim().length > 0)) return;

    let listaDeFilmes: TSearchResult;
    hideElm(searchResultList);
    hideElm(searchResultPages);
    showElm(searchResultMessage);
    searchResultMessage.innerHTML = 'Buscando...';
    try {
        let encodedQuery = encodeURI(query);
        listaDeFilmes = await HttpClient.get({
            url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&page=${page}&query=${encodedQuery}`,
        })
        searchResultMessage.innerHTML = 'Busca concluída.';
        searchResultRender(listaDeFilmes);
    }
    catch (error) {
        searchResultMessage.innerHTML = 'Falha ao efetuar a busca!<br/>Mais informações no console do navegador.';
        console.log('Erro ao efetuar a busca: ', error);
        hideElm(searchResultList);
    }
}

function searchResultRender(searchResult: TSearchResult) {
    const { results, total_results, total_pages, page } = searchResult;
    let listItems: string[] = [];
    if (results.length <= 0) return;

    if (total_pages > 1) {
        let pageButtons: string[] = [];
        for (let i = 1; i < (total_pages + 1); i++) {
            let disabled = i == page ? 'disabled' : '';
            pageButtons.push(`<button data-page="${i}" ${disabled}>${i}</button>`);
        }
        searchResultPages.innerHTML = pageButtons.join('');
        showElm(searchResultPages);
    }

    showElm(searchResultStatus);
    searchResultStatus.innerHTML = (
        total_results > 1 ?
            `Encontrados ${total_results} resultados.` :
            `Encontrado 1 resultado.`
    );

    let disabled = (userIsAuthenticated() && activeUserListId) ? '' : 'disabled';
    results.map(item => listItems
        .push(
            `<li class="item">
                <span class="title">${item.title}</span>
                <button class="action-add-to-list" data-id="${item.id}" ${disabled}>
                    Salvar<br>na<br>lista
                </button>
            </li>`
        )
    );
    searchResultList.innerHTML = listItems.join('');
    hideElm(searchResultMessage);
    showElm(searchResultList);
}

searchResultList.addEventListener('click', function (event: MouseEvent) {
    let element = event.target as HTMLElement;
    if (!element.classList.contains('action-add-to-list')) return;
    if (Number.isNaN(Number(element.dataset.id))) return;
    adicionarFilmeNaLista(Number(element.dataset.id));
});










// -----------------------------------------------------------------------------
// Manutenção de listas de filmes

// let listId: string = '7101979';

type TUserListsResponse = {
    page: number,
    results: {
        description: string,
        favorite_count: number,
        id: number,
        item_count: number,
        iso_639_1: string,
        list_type: string,
        name: string,
        poster_path: null,
    }[],
    total_pages: number,
    total_results: number,
}

const userLists: HTMLElement = document.querySelector('.lists-detail>.lists') as HTMLElement;
const userListsStatus: HTMLElement = document.querySelector('.lists-section>.status') as HTMLElement;
const userListsRefreshButton: HTMLButtonElement = document.getElementById('refresh-list') as HTMLButtonElement;
const userListsShowCreateFormButton: HTMLButtonElement = document.getElementById('show-create-list-form') as HTMLButtonElement;


const userListCreateForm: HTMLElement = document.getElementById('create-list-form') as HTMLElement;
const userListCreateStatus: HTMLElement = document.getElementById('new-list-status') as HTMLElement;
const userListCreateNameInput: HTMLInputElement = document.getElementById('new-list-name') as HTMLInputElement;
const userListCreateDescriptionInput: HTMLTextAreaElement = document.getElementById('new-list-description') as HTMLTextAreaElement;
const userListCreateSubmitButton: HTMLButtonElement = document.getElementById('create-list') as HTMLButtonElement;
const userListCreateCancelButton: HTMLButtonElement = document.getElementById('close-create-list-form') as HTMLButtonElement;

const userList: HTMLElement = document.querySelector('.lists-detail>.details>.list') as HTMLElement;
const userListStatus: HTMLElement = document.querySelector('.lists-detail>.details>.status') as HTMLElement;

type TUserListDetailsItem = {
    poster_path: string | null,
    adult: boolean,
    overview: string,
    release_date: string,
    genre_ids: number[],
    id: number,
    original_title: string,
    original_language: string,
    title: string,
    backdrop_path: string | null,
    popularity: number,
    vote_count: number,
    video: boolean,
    vote_average: number,
}

type TUserListDetailsResponse = {
    created_by: string,
    description: string,
    favorite_count: number,
    id: string,
    items: TUserListDetailsItem[],
    item_count: number,
    iso_639_1: string,
    name: string,
    poster_path: string | null,
}


let activeUserListId: number;
let activeUserList: TUserListDetailsItem;


userListsRefreshButton.addEventListener('click', () => {
    if (userIsAuthenticated()) getUserLists()
});
userListsShowCreateFormButton.addEventListener('click', () => {
    if (userIsAuthenticated()) userListCreateForm.classList.remove('_hidden');
});
userListCreateCancelButton.addEventListener('click', () => {
    userListCreateForm.classList.add('_hidden');
});


async function getUserLists(page: number = 1) {
    await HttpClient.get({
        url: `https://api.themoviedb.org/3/account/${account?.id}/lists?api_key=${apiKey}&session_id=${sessionId}&page=${page}`,
    })
        .then(value => {
            // console.log('value', value);
            activeUserListId = (value as TUserListsResponse).results[0].id;
            userListsRender(value);
            pegarLista();
        })
        .catch(reason => {
            userListsStatus.innerHTML = 'Erro ao buscar as listas. Mais detalhes no console do navegador.';
            console.log('Erro ao buscar as listas: ', reason)
        })
}


function userListsRender(lists: TUserListsResponse) {
    if (lists.total_results > 0) {
        userListsStatus.innerHTML = lists.total_results == 1 ?
            `Foi encontrada 1 lista.` :
            `Foram encontradas ${lists.total_results} listas.`;

        let listItems: string[] = [];
        lists.results.forEach(list => {
            const active = (list.id == activeUserListId) ? '-active' : '';
            listItems.push(
                `<button class="item ${active}" data-id="${list.id}">
                    <span class="name">${list.name}</span>
                    <span class="id">${list.id}</span>
                    <span class="description">${list.description}</span>
                </button>`
            );
        });
        userLists.innerHTML = listItems.join('');
    }
    else {
        userListsStatus.innerHTML = 'Não há listas registradas.';
    }
}


if (userIsAuthenticated()) getUserLists();









userListCreateSubmitButton.addEventListener('click', async () => {
    console.log('create list')
    let listName: string = userListCreateNameInput.value;
    let listDescription: string = userListCreateDescriptionInput.value;
    listName = listName.trim();
    listDescription = listDescription.trim();
    console.log(listName, listDescription);
    if (listName.length < 1) {
        userListCreateStatus.innerHTML = 'Escreva o nome da nova lista.'
        return;
    }
    if (!userIsAuthenticated()) {
        userListCreateStatus.innerHTML = 'Faça o login para criar uma lista.'
        return;
    }
    await criarLista(listName, listDescription)
        .then(value => {
            userListCreateStatus.innerHTML = 'Nova lista criada com sucesso!';
            console.log('Nova lista criada!', value);
            getUserLists();
            delay(1000).then(() => userListCreateForm.classList.add('_hidden'));
        })
        .catch(reason => {
            userListCreateStatus.innerHTML = 'Falha ao tentar criar a lista. Mais detalhes no console do navegador.';
            console.log('Falha ao tentar criar a lista:', reason);
        })
});

async function criarLista(nomeDaLista: string, descricao: string = '') {
    let result = await HttpClient.post({
        url: `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
        body: {
            name: nomeDaLista,
            description: descricao,
            language: "pt-br"
        }
    });
    return result;
}










userLists?.addEventListener('click', async function (event: MouseEvent) {
    let button = (event.target as HTMLElement).closest('button');
    if (!button || !button.hasAttribute('data-id')) return;
    activeUserListId = Number.parseInt(button.getAttribute('data-id') as string);
    await pegarLista()
});

userList?.addEventListener('click', function (event: MouseEvent) {
    let element = event.target as HTMLElement;
    if (!element.classList.contains('delete')) return;
    // TODO: Delete item
    console.log('TODO: Delete item:', element.dataset.id);
});


async function pegarLista(listId: number = activeUserListId) {
    await HttpClient.get({
        url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
    })
        .then(value => {
            console.log('activeUserListId', value);
            userListDetailsRender(value);
        })
        .catch(reason => {
            console.log(reason);
        });
}

function userListDetailsRender(listDetails: TUserListDetailsResponse) {
    if (listDetails.item_count > 0) {
        userListStatus.innerHTML = listDetails.item_count == 1 ?
            `1 item encontrado.` :
            `${listDetails.item_count} items encontrados`;

    }
    else {
        userListStatus.innerHTML = 'Não há itens na lista.';
    }
    let listItems: string[] = [];
    listDetails.items.forEach(item => listItems
        .push(
            `<li class="item">
                <span class="name">${item.title}</span>
                <span class="actions">
                    <button class="delete" data-id="${item.id}">Delete</button>
                </span>
            </li>`
        )
    );
    userList.innerHTML = listItems.join('');
}





async function adicionarFilmeNaLista(filmeId: number, listaId: number = activeUserListId) {
    return await HttpClient.post({
        url: `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
        body: {
            media_id: filmeId
        }
    })
    .then(value => {
        userListStatus.innerHTML = 'Filme na sua lista com sucesso!';
        pegarLista()
    })
    .catch(reason => {
        userListStatus.innerHTML = 'Erro ao adicionar filme na sua lista.';
        console.log('Erro ao adicionar filme na sua lista:', reason);
    })
}
