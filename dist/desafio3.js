"use strict";
// O código abaixo tem alguns erros e não funciona como deveria.
// Você pode identificar quais são e corrigi-los em um arquivo TS?
/*
let botaoAtualizar = document.getElementById('atualizar-saldo');
let botaoLimpar = document.getElementById('limpar-saldo');
let soma = document.getElementById('soma');
let campoSaldo = document.getElementById('campo-saldo');

campoSaldo.innerHTML = 0

function somarAoSaldo(soma) {
    campoSaldo.innerHTML += soma;
}

function limparSaldo() {
    campoSaldo.innerHTML = '';
}

botaoAtualizar.addEventListener('click', function () {
    somarAoSaldo(soma.value);
});

botaoLimpar.addEventListener('click', function () {
    limparSaldo();
});
*/
/**
    <h4>Valor a ser adicionado: <input id="soma"> </h4>
    <button id="atualizar-saldo">Atualizar saldo</button>
    <button id="limpar-saldo">Limpar seu saldo</button>
    <h1>"Seu saldo é: " <span id="campo-saldo"></span></h1>
 */
var botaoAtualizar = document.getElementById('atualizar-saldo');
var botaoLimpar = document.getElementById('limpar-saldo');
var soma = document.getElementById('soma');
var campoSaldo = document.getElementById('campo-saldo');
var saldo = 0;
function mostrarSaldo() {
    campoSaldo.innerHTML = saldo.toString();
}
function somarAoSaldo(value) {
    if (value === void 0) { value = 0; }
    saldo += value;
}
function limparSaldo() {
    saldo = 0;
}
botaoAtualizar === null || botaoAtualizar === void 0 ? void 0 : botaoAtualizar.addEventListener('click', function () {
    var somaValue = Number(soma.value);
    somarAoSaldo(Number.isNaN(somaValue) ? 0 : somaValue);
    mostrarSaldo();
});
botaoLimpar === null || botaoLimpar === void 0 ? void 0 : botaoLimpar.addEventListener('click', function () {
    limparSaldo();
    mostrarSaldo();
});
mostrarSaldo();
