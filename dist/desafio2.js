"use strict";
// Como podemos melhorar o esse código usando TS?
// let pessoa1 = {};
// pessoa1.nome = "maria";
// pessoa1.idade = 29;
// pessoa1.profissao = "atriz"
// let pessoa2 = {}
// pessoa2.nome = "roberto";
// pessoa2.idade = 19;
// pessoa2.profissao = "Padeiro";
// let pessoa3 = {
//     nome: "laura",
//     idade: "32",
//     profissao: "Atriz"
// };
// let pessoa4 = {
//     nome = "carlos",
//     idade = 19,
//     profissao = "padeiro"
// }
// -----------------------------------------------------------------------------
// Resposta 1
var Profissao;
(function (Profissao) {
    Profissao["Atriz"] = "Atriz";
    Profissao["Padeiro"] = "Padeiro";
})(Profissao || (Profissao = {}));
var pessoa1 = {};
pessoa1.nome = "maria";
pessoa1.idade = 29;
pessoa1.profissao = Profissao.Atriz;
var pessoa2 = {};
pessoa2.nome = "roberto";
pessoa2.idade = 19;
pessoa2.profissao = Profissao.Padeiro;
var pessoa3 = {
    nome: "laura",
    idade: "32",
    profissao: Profissao.Atriz
};
var pessoa4 = {
    nome: "carlos",
    idade: 19,
    profissao: Profissao.Padeiro
};
