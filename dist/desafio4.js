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
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// -----------------------------------------------------------------------------
// Funções utilitárias
var hideElm = function (element) { return element.classList.add('_hidden'); };
var showElm = function (element) { return element.classList.remove('_hidden'); };
var delay = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
var HttpClient = /** @class */ (function () {
    function HttpClient() {
    }
    /**
     * Faz uma requisição para a URL em param0.url, usando o método HTTP definido em param0.method,
     * opcionalmente transportando o conteúdo de param0.body.
     *
     * @param param0 THttpClientGetParams object
     * @returns Promise<any>
     */
    HttpClient.request = function (_a) {
        var url = _a.url, method = _a.method, _b = _a.body, body = _b === void 0 ? null : _b;
        return __awaiter(this, void 0, void 0, function () {
            function rejectResult(xhr) {
                var status = xhr.status, statusText = xhr.statusText, response = xhr.response, responseText = xhr.responseText;
                return ({ status: status, statusText: statusText, response: JSON.parse(response), responseText: responseText, xhr: xhr });
            }
            return __generator(this, function (_c) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var xhr = new XMLHttpRequest();
                        xhr.open(method, url, true);
                        xhr.onload = function () {
                            if (xhr.status >= 200 && xhr.status < 300)
                                resolve(JSON.parse(xhr.responseText));
                            else
                                reject(rejectResult(xhr));
                        };
                        xhr.onerror = function () { return reject(rejectResult(xhr)); };
                        if (body) {
                            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                            body = JSON.stringify(body);
                        }
                        xhr.send(body);
                    })];
            });
        });
    };
    HttpClient.get = function (_a) {
        var url = _a.url, _b = _a.body, body = _b === void 0 ? null : _b;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_c) {
                return [2 /*return*/, this.request({ url: url, method: 'GET', body: body })];
            });
        });
    };
    HttpClient.post = function (_a) {
        var url = _a.url, _b = _a.body, body = _b === void 0 ? null : _b;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_c) {
                return [2 /*return*/, this.request({ url: url, method: 'POST', body: body })];
            });
        });
    };
    return HttpClient;
}());
// -----------------------------------------------------------------------------
// Autenticação
var accountStatusElm = document.querySelector('.app-header>.status');
var apiLoginShowFormButton = document.getElementById('show-api-login-button');
var apiLoginSection = document.querySelector('.api-login');
var apiLoginStatus = apiLoginSection.querySelector('.status');
var usernameInput = document.getElementById('username');
var passwordInput = document.getElementById('senha');
var apiKeyInput = document.getElementById('api-key');
var loginButton = document.getElementById('login-button');
var loginCancelButton = document.getElementById('cancel-login-button');
// Conta e chave de api gerada com endereço temporário de e-mail:
var defaultUsername = 'sanav56208';
var defaultPassword = 'sanav56208@agrolivana.com';
var defaultApiKey = '2e2ca706ac131ebae728a324d40f1d31';
var apiKey;
var username;
var password;
var requestToken;
var sessionId;
var account = null;
var userIsAuthenticated = function () { return ((account != null) && (account.id != null) && (account.id != undefined) && apiKey); };
// TODO: Remove before commit
apiKeyInput.value = defaultApiKey;
apiKey = defaultApiKey;
usernameInput.value = defaultUsername;
username = defaultUsername;
passwordInput.value = defaultPassword;
password = defaultPassword;
apiLoginShowFormButton === null || apiLoginShowFormButton === void 0 ? void 0 : apiLoginShowFormButton.addEventListener('click', function () {
    apiLoginSection.classList.remove('_hidden');
});
loginCancelButton.addEventListener('click', function () {
    apiLoginSection.classList.add('_hidden');
});
usernameInput === null || usernameInput === void 0 ? void 0 : usernameInput.addEventListener('change', function () {
    username = usernameInput.value;
    validateLoginButton();
});
passwordInput === null || passwordInput === void 0 ? void 0 : passwordInput.addEventListener('change', function () {
    password = passwordInput.value;
    validateLoginButton();
});
apiKeyInput === null || apiKeyInput === void 0 ? void 0 : apiKeyInput.addEventListener('change', function () {
    apiKey = apiKeyInput.value;
    validateLoginButton();
});
function validateLoginButton() {
    loginButton.disabled = !(password && username && apiKey);
}
validateLoginButton();
function updateAccountStatus(accountIn) {
    if (accountIn === void 0) { accountIn = null; }
    account = accountIn;
    if (account && account.id) {
        var accountName = account.name.trim().length > 0 ? account.name : account.username;
        accountStatusElm.innerHTML = "Ol\u00E1<br>".concat(accountName, "!");
    }
    else
        accountStatusElm.innerHTML = "Usu\u00E1rio<br>AN\u00D4NIMO";
    console.log('Account', account);
}
updateAccountStatus();
loginButton.addEventListener('click', function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_1, statusMessage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('Iniciando login...');
                apiLoginStatus.innerHTML = '';
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                return [4 /*yield*/, criarRequestToken()];
            case 2:
                _a.sent();
                return [4 /*yield*/, logar()];
            case 3:
                _a.sent();
                return [4 /*yield*/, criarSessao()];
            case 4:
                _a.sent();
                return [4 /*yield*/, getAccount()];
            case 5:
                _a.sent();
                apiLoginStatus.innerHTML = 'Login bem sucedido!';
                console.log('Login bem sucedido.');
                delay(1000).then(function () { return apiLoginSection.classList.add('_hidden'); });
                return [4 /*yield*/, getUserLists()];
            case 6:
                _a.sent();
                procurarFilme();
                return [3 /*break*/, 8];
            case 7:
                error_1 = _a.sent();
                statusMessage = 'Erro ao tentar o login.<br/>Login não concluído.';
                if (error_1.response.status_message) {
                    statusMessage += '<br><em>' + error_1.response.status_message + '</em><br>';
                }
                apiLoginStatus.innerHTML = statusMessage + 'Mais detalhes no console do navegador.';
                console.log('Erro ao efetuar login: ', error_1);
                return [3 /*break*/, 8];
            case 8:
                console.log('requestToken', requestToken);
                console.log('sessionId', sessionId);
                return [2 /*return*/];
        }
    });
}); });
function criarRequestToken() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpClient.get({
                        url: "https://api.themoviedb.org/3/authentication/token/new?api_key=".concat(apiKey),
                    })];
                case 1:
                    result = _a.sent();
                    requestToken = result.request_token;
                    return [2 /*return*/];
            }
        });
    });
}
function logar() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpClient.post({
                        url: "https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=".concat(apiKey),
                        body: {
                            username: "".concat(username),
                            password: "".concat(password),
                            request_token: "".concat(requestToken)
                        }
                    })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function criarSessao() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpClient.get({
                        url: "https://api.themoviedb.org/3/authentication/session/new?api_key=".concat(apiKey, "&request_token=").concat(requestToken),
                    })];
                case 1:
                    result = _a.sent();
                    sessionId = result.session_id;
                    return [2 /*return*/];
            }
        });
    });
}
function getAccount() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpClient.get({
                        url: "https://api.themoviedb.org/3/account?api_key=".concat(apiKey, "&session_id=").concat(sessionId),
                    })];
                case 1:
                    result = _a.sent();
                    updateAccountStatus(result);
                    return [2 /*return*/];
            }
        });
    });
}
// -----------------------------------------------------------------------------
// Busca de filmes
var query = '';
var searchButton = document.getElementById('search-button');
var searchInput = document.getElementById('search-input');
var searchResultStatus = document.getElementById('search-result-status');
var searchResultList = document.getElementById('search-result-list');
var searchResultPages = document.getElementById('search-result-pages');
var searchResultMessage = document.getElementById('search-result-message');
searchButton.addEventListener('click', function () { return procurarFilme(); });
searchResultPages.addEventListener('click', function (event) {
    var eventTarget = event.target;
    if (!eventTarget.dataset.page)
        return;
    var page = Number.parseInt(eventTarget.dataset.page);
    if (!page)
        return;
    procurarFilme(page);
});
function procurarFilme(page) {
    if (page === void 0) { page = 1; }
    return __awaiter(this, void 0, void 0, function () {
        var listaDeFilmes, encodedQuery, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Reseta a página se os termos mudaram.
                    if (query != searchInput.value) {
                        page = 1;
                        query = searchInput.value;
                    }
                    if (!(query && query.trim().length > 0))
                        return [2 /*return*/];
                    hideElm(searchResultList);
                    hideElm(searchResultPages);
                    showElm(searchResultMessage);
                    searchResultMessage.innerHTML = 'Buscando...';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    encodedQuery = encodeURI(query);
                    return [4 /*yield*/, HttpClient.get({
                            url: "https://api.themoviedb.org/3/search/movie?api_key=".concat(apiKey, "&page=").concat(page, "&query=").concat(encodedQuery),
                        })];
                case 2:
                    listaDeFilmes = _a.sent();
                    searchResultMessage.innerHTML = 'Busca concluída.';
                    searchResultRender(listaDeFilmes);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    searchResultMessage.innerHTML = 'Falha ao efetuar a busca!<br/>Mais informações no console do navegador.';
                    console.log('Erro ao efetuar a busca: ', error_2);
                    hideElm(searchResultList);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function searchResultRender(searchResult) {
    var results = searchResult.results, total_results = searchResult.total_results, total_pages = searchResult.total_pages, page = searchResult.page;
    var listItems = [];
    if (results.length <= 0)
        return;
    if (total_pages > 1) {
        var pageButtons = [];
        for (var i = 1; i < (total_pages + 1); i++) {
            var disabled_1 = i == page ? 'disabled' : '';
            pageButtons.push("<button data-page=\"".concat(i, "\" ").concat(disabled_1, ">").concat(i, "</button>"));
        }
        searchResultPages.innerHTML = pageButtons.join('');
        showElm(searchResultPages);
    }
    showElm(searchResultStatus);
    searchResultStatus.innerHTML = (total_results > 1 ?
        "Encontrados ".concat(total_results, " resultados.") :
        "Encontrado 1 resultado.");
    var disabled = (userIsAuthenticated() && activeUserListId) ? '' : 'disabled';
    results.map(function (item) { return listItems
        .push("<li class=\"item\">\n                <span class=\"title\">".concat(item.title, "</span>\n                <button class=\"action-add-to-list\" data-id=\"").concat(item.id, "\" ").concat(disabled, ">\n                    Salvar<br>na<br>lista\n                </button>\n            </li>")); });
    searchResultList.innerHTML = listItems.join('');
    hideElm(searchResultMessage);
    showElm(searchResultList);
}
searchResultList.addEventListener('click', function (event) {
    var element = event.target;
    if (!element.classList.contains('action-add-to-list'))
        return;
    if (Number.isNaN(Number(element.dataset.id)))
        return;
    adicionarFilmeNaLista(Number(element.dataset.id));
});
var userLists = document.querySelector('.lists-detail>.lists');
var userListsStatus = document.querySelector('.lists-section>.status');
var userListsRefreshButton = document.getElementById('refresh-list');
var userListsShowCreateFormButton = document.getElementById('show-create-list-form');
var userListCreateForm = document.getElementById('create-list-form');
var userListCreateStatus = document.getElementById('new-list-status');
var userListCreateNameInput = document.getElementById('new-list-name');
var userListCreateDescriptionInput = document.getElementById('new-list-description');
var userListCreateSubmitButton = document.getElementById('create-list');
var userListCreateCancelButton = document.getElementById('close-create-list-form');
var userList = document.querySelector('.lists-detail>.details>.list');
var userListStatus = document.querySelector('.lists-detail>.details>.status');
var activeUserListId;
var activeUserList;
userListsRefreshButton.addEventListener('click', function () {
    if (userIsAuthenticated())
        getUserLists();
});
userListsShowCreateFormButton.addEventListener('click', function () {
    if (userIsAuthenticated())
        userListCreateForm.classList.remove('_hidden');
});
userListCreateCancelButton.addEventListener('click', function () {
    userListCreateForm.classList.add('_hidden');
});
function getUserLists(page) {
    if (page === void 0) { page = 1; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpClient.get({
                        url: "https://api.themoviedb.org/3/account/".concat(account === null || account === void 0 ? void 0 : account.id, "/lists?api_key=").concat(apiKey, "&session_id=").concat(sessionId, "&page=").concat(page),
                    })
                        .then(function (value) {
                        // console.log('value', value);
                        activeUserListId = value.results[0].id;
                        userListsRender(value);
                        pegarLista();
                    })
                        .catch(function (reason) {
                        userListsStatus.innerHTML = 'Erro ao buscar as listas. Mais detalhes no console do navegador.';
                        console.log('Erro ao buscar as listas: ', reason);
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function userListsRender(lists) {
    if (lists.total_results > 0) {
        userListsStatus.innerHTML = lists.total_results == 1 ?
            "Foi encontrada 1 lista." :
            "Foram encontradas ".concat(lists.total_results, " listas.");
        var listItems_1 = [];
        lists.results.forEach(function (list) {
            var active = (list.id == activeUserListId) ? '-active' : '';
            listItems_1.push("<button class=\"item ".concat(active, "\" data-id=\"").concat(list.id, "\">\n                    <span class=\"name\">").concat(list.name, "</span>\n                    <span class=\"id\">").concat(list.id, "</span>\n                    <span class=\"description\">").concat(list.description, "</span>\n                </button>"));
        });
        userLists.innerHTML = listItems_1.join('');
    }
    else {
        userListsStatus.innerHTML = 'Não há listas registradas.';
    }
}
if (userIsAuthenticated())
    getUserLists();
userListCreateSubmitButton.addEventListener('click', function () { return __awaiter(void 0, void 0, void 0, function () {
    var listName, listDescription;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('create list');
                listName = userListCreateNameInput.value;
                listDescription = userListCreateDescriptionInput.value;
                listName = listName.trim();
                listDescription = listDescription.trim();
                console.log(listName, listDescription);
                if (listName.length < 1) {
                    userListCreateStatus.innerHTML = 'Escreva o nome da nova lista.';
                    return [2 /*return*/];
                }
                if (!userIsAuthenticated()) {
                    userListCreateStatus.innerHTML = 'Faça o login para criar uma lista.';
                    return [2 /*return*/];
                }
                return [4 /*yield*/, criarLista(listName, listDescription)
                        .then(function (value) {
                        userListCreateStatus.innerHTML = 'Nova lista criada com sucesso!';
                        console.log('Nova lista criada!', value);
                        getUserLists();
                        delay(1000).then(function () { return userListCreateForm.classList.add('_hidden'); });
                    })
                        .catch(function (reason) {
                        userListCreateStatus.innerHTML = 'Falha ao tentar criar a lista. Mais detalhes no console do navegador.';
                        console.log('Falha ao tentar criar a lista:', reason);
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
function criarLista(nomeDaLista, descricao) {
    if (descricao === void 0) { descricao = ''; }
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpClient.post({
                        url: "https://api.themoviedb.org/3/list?api_key=".concat(apiKey, "&session_id=").concat(sessionId),
                        body: {
                            name: nomeDaLista,
                            description: descricao,
                            language: "pt-br"
                        }
                    })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
userLists === null || userLists === void 0 ? void 0 : userLists.addEventListener('click', function (event) {
    return __awaiter(this, void 0, void 0, function () {
        var button;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    button = event.target.closest('button');
                    if (!button || !button.hasAttribute('data-id'))
                        return [2 /*return*/];
                    activeUserListId = Number.parseInt(button.getAttribute('data-id'));
                    return [4 /*yield*/, pegarLista()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
userList === null || userList === void 0 ? void 0 : userList.addEventListener('click', function (event) {
    var element = event.target;
    if (!element.classList.contains('delete'))
        return;
    // TODO: Delete item
    console.log('TODO: Delete item:', element.dataset.id);
});
function pegarLista(listId) {
    if (listId === void 0) { listId = activeUserListId; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpClient.get({
                        url: "https://api.themoviedb.org/3/list/".concat(listId, "?api_key=").concat(apiKey),
                    })
                        .then(function (value) {
                        console.log('activeUserListId', value);
                        userListDetailsRender(value);
                    })
                        .catch(function (reason) {
                        console.log(reason);
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function userListDetailsRender(listDetails) {
    if (listDetails.item_count > 0) {
        userListStatus.innerHTML = listDetails.item_count == 1 ?
            "1 item encontrado." :
            "".concat(listDetails.item_count, " items encontrados");
    }
    else {
        userListStatus.innerHTML = 'Não há itens na lista.';
    }
    var listItems = [];
    listDetails.items.forEach(function (item) { return listItems
        .push("<li class=\"item\">\n                <span class=\"name\">".concat(item.title, "</span>\n                <span class=\"actions\">\n                    <button class=\"delete\" data-id=\"").concat(item.id, "\">Delete</button>\n                </span>\n            </li>")); });
    userList.innerHTML = listItems.join('');
}
function adicionarFilmeNaLista(filmeId, listaId) {
    if (listaId === void 0) { listaId = activeUserListId; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpClient.post({
                        url: "https://api.themoviedb.org/3/list/".concat(listaId, "/add_item?api_key=").concat(apiKey, "&session_id=").concat(sessionId),
                        body: {
                            media_id: filmeId
                        }
                    })
                        .then(function (value) {
                        userListStatus.innerHTML = 'Filme na sua lista com sucesso!';
                        pegarLista();
                    })
                        .catch(function (reason) {
                        userListStatus.innerHTML = 'Erro ao adicionar filme na sua lista.';
                        console.log('Erro ao adicionar filme na sua lista:', reason);
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
