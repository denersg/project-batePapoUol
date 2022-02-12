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
        loadMessages();
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

    //Envia o nome do usuário a cada 5 segundos
    setInterval( function (){
        promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", data);
    }, 5000)
}

function loadMessages(){
    let messages = [];
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promise.then(mostrarResposta);
}

function mostrarResposta(resposta){
    // console.log("RESPOSTA:")
    // console.log(resposta.data)
    let messages = resposta.data;
    for(let i = 0; i < messages.length; i++){
        // console.log(messages[i].text)
        const message = messages[i];
        message.innerHTML = mostrarMensagemNaTela(message);
        /*Para strings sem espaço q/ escapam da tela. O máximo de caracteres q/ cabem na tela é 40*/
        // console.log(message.text.length)
    }
}

function mostrarMensagemNaTela(message){
    const ul = document.querySelector("ul");
    ul.innerHTML += `
        <li>
            ${message.text}
        </li>
    `;
}