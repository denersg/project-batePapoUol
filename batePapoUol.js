registerUserAndEnterTheRoom();

function registerUserAndEnterTheRoom(){
    const userName = prompt("Qual o seu nome?");
    // console.log(userName)
    const data = { name: userName };
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", data);

    promise.then(quandoSucesso);
    promise.catch(quandoErro);
}

function quandoSucesso(response){
    console.log("SUCESSO!!");
    console.log("Status code: " + response.status)
    // console.log(response.data)
}

function quandoErro(error){
    // Se a resposta for 400 é pq já tem um usuário com o nome
    // digitado. Então, eu devo chamar novamente a função de
    // registrar.
    if(error.response.status === 400){
        registerUserAndEnterTheRoom();
    }
    console.log("Status code: " + error.response.status)
    console.log("Mensagem de erro: " + error.response.data)
}