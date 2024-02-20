const socket = io();
let isLogined = false;
const msgBox = document.getElementById('msg');
const loginBox = document.getElementById('login');
const textBox = document.getElementById('main');

//기본상태
textBox.hidden = true;
msgBox.style.display = "none";

// 기능
function addMessage(msg) {
    const ul = textBox.querySelector('ul');
    const li = document.createElement('li');
    li.innerText = msg;
    ul.appendChild(li);
}


socket.on('enter', (data)=>{
    let enterMsg = `☑${data.payload} 님이 입장하셨습니다.`
    addMessage(enterMsg);
})

socket.on("msg", (data)=>{
    addMessage(`${data.nickName} : ${data.payload}`);
    prepareScroll()
})

socket.on("bye", (data)=>{
    let enterMsg = `☑${data.nickName} 님이 퇴장하셨습니다.`
    addMessage(enterMsg);
    updatCounter(data.number);
})
function updatCounter(data) {
    let title = document.querySelector('h1');
    title.innerText = `기본설계계획(${data})`
}
socket.on("count", updatCounter)
//메세지
const msgForm = msgBox.querySelector('form');
msgForm.addEventListener('submit', (event)=>{
    event.preventDefault();
    const input = msgForm.querySelector('input');
    const value = input.value;
    socket.emit('msg', {'payload': value})
    addMessage(`나 : ${value}`)
    input.value = ""
    prepareScroll()
})


//로그인되었을때
function handleLogin(value){
  if(isLogined){
    textBox.hidden = false;
    msgBox.style.display = "block";
    loginBox.style.display = "none";
  }
  let p = document.querySelector('p');
  p.innerText = `[-][Top][2D ${value}]`
}


const loginForm = loginBox.querySelector('form');

loginForm.addEventListener('submit', (event)=>{
    event.preventDefault();
    const input = loginForm.querySelector('input');
    const value = input.value;

    isLogined = true;
    socket.emit('nickName', {'payload' : value}, handleLogin)
})

//스크롤
function prepareScroll() {
    window.setTimeout(scrollUl, 50);
}

function scrollUl() {
    let chatul = document.querySelector('#main');
    chatul.scrollTop = chatul.scrollHeight
}
// 창 최소화
let isSizeClick = false;
const sizeBtn = msgForm.querySelector('#size');
sizeBtn.addEventListener('click', ()=>{
    let size = document.querySelector('#main');
    if (isSizeClick){
        size.classList.remove("h-[80px]")
        size.classList.add("h-[200px]")
        isSizeClick = false;
        sizeBtn.innerText = "최소화"

    }else {
        size.classList.remove("h-[200px]")
        size.classList.add("h-[80px]")
        isSizeClick = true;
        sizeBtn.innerText = "최대화"
    }
})
//비상탈출
const exit = msgForm.querySelector('#exit');
const openWindow = () => {
    const wind =  window.open('','_blank','');
    
    // save the old close function
    const actualClose = wind.close;
    
    // Override wind.close and setup a promise that is resolved on wind.close
    const closePromise = new Promise(r=>{wind.close = ()=>{r(undefined);}});
  
    // Setup an async function
    // that closes the window after resolution of the above promise
    (async ()=>{
      await closePromise; // wait for promise resolution
      actualClose(); // closing the window here is legal
    })();
  
    return wind;
  }
exit.addEventListener('click',openWindow)

//배경바꾸기
let num = 0;
const bg = msgForm.querySelector('#bg');
function handleChangeBg() {
    num++
    switch(num) {
        case 0 :
            document.body.style.backgroundImage = `url('/bgA.JPG')`
        break
        case 1 :
            document.body.style.backgroundImage = `url('/bgB.JPG')`
        break
        case 2 :
            document.body.style.backgroundImage = `url('/bgC.jpg')`
        break
        case 3 :
            document.body.style.backgroundImage = `url('/bgD.JPG')`
            num=-1
        break
    }
    
}
bg.addEventListener('click', handleChangeBg)

//오목열기
const gameBtn = document.querySelector('#game');
const gameBox = document.querySelector('#gameBox');
gameBox.style.display = 'none';

function handleGameClick() {
    if(gameBox.style.display == 'none') {
        gameBox.style.display = 'inline-block';
    } else gameBox.style.display = 'none';
    console.log('hh')
}
gameBtn.addEventListener('click', handleGameClick)