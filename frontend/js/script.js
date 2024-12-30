// login elements
const login = document.querySelector(".login");
const loginForm = login.querySelector(".login__form");
const loginInput = login.querySelector(".login__input");
const user = {id: "", name: "", color: "" };


const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat__form");
const chatInput = chat.querySelector(".chat__input");
const chatMessages = chat.querySelector(".chat__messages");


const colors = [    //uma const com varias cores, para cada usuario receber uma
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold",
    "red",
    "yellow",
    "orange"
];

let websocket;  //Usara para estabelecer a conexao com o banco de dados

const createMessageSelfElement = (content) => {  // Função que cria a nossa menssagem no chat
    const div = document.createElement("div")  // Criou uma div
    div.classList.add("message--self")  // atribuiu uma classe a essa div criada
    div.innerHTML = content  // Inseriu o que foi guardado no content(no caso a menssagem inserida no input) dentro da div
    return div
}


const createMessageOtherElement = (content, sender, senderColor) => {  // Função que cria a nossa menssagem no chat
    const div = document.createElement("div")  // Criou uma div
    const span = document.createElement("span")
    div.classList.add("message--other")  // atribuiu uma classe a essa div criada
    div.classList.add("message--self")
    span.classList.add("message--sender")
    span.style.color = senderColor
    div.appendChild(span)
    span.innerHTML = sender
    div.innerHTML += content  // Inseriu o que foi guardado no content(no caso a menssagem inserida no input) dentro da div
    return div
}


const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);  //guardei nesta const um gerador de aleatorio de numeros de 0 ate 8, o Math.random() * colors.length gera um numero aleatorio de 0 a 8, porem um numero quebrado, e o Math.floor o arredonda
    return colors[randomIndex];    // Pediu para retornar o index gerado aleotoriamente no ramdomIndex da constante colors, ou seja, se o ramdomINdex gerou o 5, ele vai pegar a cor do index 5 da const colors
}
// Math.random gera um numero aleatorio entre 0 e 1, que se multiplicado por 10 por exemplo, gera numeros de 0 ate 10.
// Math.floor arredonda o numero para baixo, ent se der 9.7, vai arredondar para 9. para arredondar para cima seria math.round


const scrollScreen = () => {  // Funlçao para rolar a tela para baixo ao chegar novas menssagens
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}


const processMessage = ({data}) => {  // função para mostrar as menssagens que vamos receber do servidor, por isso o evento "data"
    const { userId, userName, userColor, content } = JSON.parse(data)  //O JSON.parse transforma os dados que estavam em string, em objeto de novo, para podermos manipulalos
    const message = userId == user.id ? createMessageSelfElement(content) : createMessageOtherElement(content, userName, userColor)


    const element = createMessageOtherElement(content, userName, userColor)
    chatMessages.appendChild(message)
    scrollScreen()
}


const handleLogin = (event) => {  
    event.preventDefault();  //faz com que a pagina nao recarregue, no caso, quando enviar o submit(o formulario)
    user.id = crypto.randomUUID(); //Gera de forma automatica um ID unico para o user
    user.color = getRandomColor(); //vai colocar a cor gerada pela funcao getRandomColor
    user.name = loginInput.value;  // O valor de name do user, sera o valor inserido no input
    login.style.display = "none";  //Mudando o display para none, pois assim ao dar o submit, a tela de login ira sumir
    chat.style.display = "flex"; //para apos sumir o login aparecer o chat(com o display flex, que 'e como ele deve ser)
    websocket = new WebSocket("ws://localhost:8080")  //fiz a conexao com o back, colocando ai dentro a porta estabelecida anteriormente de conexao, no caso 8080
    websocket.onmessage = processMessage // O websocket.onmessage é para quando o servidor nos manda uma menssagem, ou seja, quando ele nos mandar uma mensagem, faça tal coisa
}


const sendMessage = (event) => {
    event.preventDefault();  // Sempre colocar isso de nao recarregar a pag quando for para envio de submit

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message))  // Manda para o servidor a menssagem inserida(dada submit) no input, no caso vai mandar a mensagem e o id, nome e cor, e vai como string por conta do JSON.stringify
    chatInput.value = ""  // vai limpar o que tava escrito no input após o submit
}


loginForm.addEventListener("submit", handleLogin);  //adicionou a funcao handlesubmit, quando ocorrer um submit, ou seja, ira executar e funcao criada, ao o se enviar o formulario(submit)
chatForm.addEventListener("submit", sendMessage);

























































