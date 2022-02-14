let userName;

//Tempo para carregar a página de entrada
setTimeout(registerUserAndEnterTheRoom, 500);

function registerUserAndEnterTheRoom(){
    userName = prompt("Qual o seu nome?");
    
    const data = { name: userName };
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", data);

    promise.then(whenSuccessful);//Quando sucesso
    promise.catch(inCaseOfError);//Quando erro

    if(whenSuccessful){
        loadHomePage();
        stayConnected();
        // loadMessages();

        //Carrega as mensagens do servidor a cada 3 segundos
        setInterval(loadMessages, 3000);

        //Envia a mensagem quando o usuário teclar 'Enter'
        sendWithEnter();
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

//Carrega a página inicial
function loadHomePage(){
    const hideEntryScreen = document.querySelector(".entry-screen");
    hideEntryScreen.classList.add("hidden");

    const elemHomeScreen = document.querySelector(".home-screen");
    if(elemHomeScreen.classList.contains("hidden")){
        elemHomeScreen.classList.remove("hidden");
    }
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
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promise.then(showResponse);
}

function showResponse(response){
    // console.log("RESPOSTA:")
    // console.log(resposta.data)

    //Atribui o array de mensagens
    const messages = response.data;
    const ul = document.querySelector("ul");
    
    ul.innerHTML = "";
    for(let i = 0; i < messages.length; i++){

        //Verifica se a mensagem é privada
        if(messages[i].type === "private_message"){
            //Verifica se é uma mensagem privada de outras pessoas e 'continua' o LOOP sem mostrá-la
            if(messages[i].to !== userName && messages[i].from !== userName && messages[i].to !== "Todos"){

                // console.log(i + " >>>>> sai fora xereta <<<<")

                continue;//Continua o loop, ignorando este índice
            }
        }
        
        // console.log(i + " mensagem criada com SUCESSO")
        
        
        // console.log(messages[i].text)
        const message = messages[i];
        message.innerHTML = showMessageOnScreen(message, i);
        /*Para strings sem espaço q/ escapam da tela. O máximo de caracteres q/ cabem na tela é 47*/
        // console.log(message.text.length)
    }

    scrollToLastElement();
}

function showMessageOnScreen(message, cont){
    const ul = document.querySelector("ul");
    // console.log(cont)
    // console.log(message.type)
    if(message.type == "status"){
        // console.log("STATUS!!!")
        ul.innerHTML += `
            <li class="status-message message-box" data-identifier="message">
                <span>(${message.time})</span> <strong>${message.from}</strong> ${message.text}
            </li>
        `;
    }
    else if(message.type == "message"){
        // console.log("MESSAGE!!!")
        ul.innerHTML += `
            <li class="normal-message message-box" data-identifier="message">
                <span>(${message.time})</span> <strong>${message.from}</strong> para <strong>${message.to}</strong>: ${message.text}
            </li>
        `;
    }
    else if(message.type == "private_message"){
        // console.log("Nome: " + userName)

        

        // console.log("PRIVATE!!!")
        ul.innerHTML += `
            <li class="private-message message-box" data-identifier="message">
                <span>(${message.time})</span> <strong>${message.from}</strong> reservadamente para <strong>${message.to}</strong>: ${message.text}
            </li>
        `;
    }

    
    

    // ul.innerHTML += `
    //     <li>
    //         ${cont} -> ${message.text}
    //     </li>
    // `;
}

function scrollToLastElement(){
    //Seleciona a última mensagem que aparece e desce a tela até ela
    const lastMessageThatAppears = document.querySelector(".message-box:last-child");
    // console.log(lastMessageThatAppears)
    lastMessageThatAppears.scrollIntoView();
}




function sendMessage(){
    const inputMessage = document.querySelector(".footer input");
    // console.log(inputMessage)
    console.dir(inputMessage)

    const data = {
        from: userName,
        to: "Todos",
        text: inputMessage.value,
        type: "message"
    };

    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", data);

    //Reseta a caixa de digitação para o usuário poder inserir mais texto
    inputMessage.value = "";
    
    promise.then(loadMessages);
    promise.catch(reloadPage);
}

function reloadPage(){
    window.location.reload();
}

function sendWithEnter(){
    const inputMessage = document.querySelector("footer input");
    inputMessage.onkeydown = (e) => {
        if(e.code === "Enter"){
            sendMessage();
        }
    };
}