let userName;

registerUserAndEnterTheRoom();

function registerUserAndEnterTheRoom(){
    userName = prompt("Qual o seu nome?");
    
    const data = { name: userName };
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", data);

    promise.then(whenSuccessful);//Quando sucesso
    promise.catch(inCaseOfError);//Quando erro

    if(whenSuccessful){
        stayConnected();
    }
}

//Verifica se requisição foi bem-sucedida
function whenSuccessful(response){
    console.log("SUCESSO!!");
    console.log("Status code: " + response.status)
}

//Verifica se requisição falhou
function inCaseOfError(error){
    // Se a resposta for 400 é pq já tem um usuário com o nome
    // digitado. Então, eu devo chamar novamente a função de
    // registrar.
    if(error.response.status === 400){
        alert("Este nome já está em uso. Por favor, digite outro nome.");
        registerUserAndEnterTheRoom();
    }
    console.log("Status code: " + error.response.status)
    console.log("Mensagem de erro: " + error.response.data)
}

//Mantém o usuário conectado
function stayConnected(){
    let data = {name: userName}, promise;
    setInterval( function (){
        promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", data);
    }, 5000)
}