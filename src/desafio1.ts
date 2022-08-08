// Como podemos rodar isso em um arquivo .ts sem causar erros?

// let employee = {};
// employee.code = 10;
// employee.name = "John";

// -----------------------------------------------------------------------------
// Resposta 1
let employee = {
    code: 10,
    name: "John"
}

// -----------------------------------------------------------------------------
// Resposta 2

let employee2 : {code: number, name: string} = {
    code: 10,
    name: "John"
};

// -----------------------------------------------------------------------------
// Resposta 3

type TEmployee = {
    code: number;
    name: string;
}

let employee3 : TEmployee = {
    code: 10,
    name: "John"
}

// -----------------------------------------------------------------------------
// Resposta 4

interface IEmployee { // Employable / EmployeeInterface / etc.
    code: number;
    name: string;
}

let employee4 : IEmployee = {
    code: 10,
    name: "John"
}

let employee5 = {} as IEmployee;
employee5.code= 10;
employee5.name= "John";
