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

enum Profissao {
    Atriz = 'Atriz',
    Padeiro = 'Padeiro'
}

type TPessoa = {
    nome: string;
    idade: number | string;
    profissao: Profissao;
}

let pessoa1 = {} as TPessoa;
pessoa1.nome = "maria";
pessoa1.idade = 29;
pessoa1.profissao =  Profissao.Atriz;

let pessoa2 = {} as TPessoa;
pessoa2.nome = "roberto";
pessoa2.idade = 19;
pessoa2.profissao = Profissao.Padeiro;

let pessoa3: TPessoa = {
    nome: "laura",
    idade: "32",
    profissao: Profissao.Atriz
}

let pessoa4: TPessoa = {
    nome: "carlos",
    idade: 19,
    profissao: Profissao.Padeiro
}