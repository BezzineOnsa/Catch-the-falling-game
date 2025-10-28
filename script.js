
const message = document.querySelector(".message");
const scoreOutput = document.querySelector(".score");
const lostOutput = document.querySelector(".lost");
const targetOutput = document.querySelector(".target");
const btn = document.querySelector(".btn");
document.addEventListener("keydown", function(e) {
    if (e.key === "Enter" && btn.style.display !== "none") {
        btn.click();
    }
});

const basket = document.querySelector(".basket");
const container = document.querySelector(".container");

let basketPos = { x: 0, y: 0 };
let keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
let player = { score:0, lost:0, totalBad:0, inPlay:false, speed:7, target:20, enemiesOnScreen:0 };

function initGame() {
    basketPos.x = container.offsetWidth/2 - basket.offsetWidth/2;
    basketPos.y = container.offsetHeight - basket.offsetHeight - 20;
    basket.style.left = basketPos.x + "px";
    basket.style.top = basketPos.y + "px";
    targetOutput.textContent = player.target;
}

btn.addEventListener("click", startGame);
document.addEventListener("keydown", e=> { if(keys.hasOwnProperty(e.key)) { e.preventDefault(); keys[e.key]=true; }});
document.addEventListener("keyup", e=> { if(keys.hasOwnProperty(e.key)) { e.preventDefault(); keys[e.key]=false; }});

function startGame() {
    message.style.display = "none";
    btn.style.display = "none";
    basket.style.display = "block";

    player.score = 0;
    player.lost = 0;
    player.totalBad = 30; 
    player.enemiesOnScreen = 0;
    player.inPlay = true;
    player.target = 20; 

    targetOutput.textContent = player.target;

    updateScore();

    document.querySelectorAll(".baddy").forEach(e=>e.remove());

    setupBadGuys(6); 
    requestAnimationFrame(playGame);
}

function setupBadGuys(num) { for(let i=0;i<num;i++) makeBad(); }

function makeBad() {
    if(player.totalBad>0){
        player.totalBad--;
        player.enemiesOnScreen++;
        updateScore();

        let div = document.createElement("div");
        div.classList.add("baddy");
        const emojis=["🍎","👑","⭐","🍒","🥝","🍇","🎲","🎃"];
        div.textContent = emojis[Math.floor(Math.random()*emojis.length)];

        div.style.left = Math.floor(Math.random()*(container.offsetWidth-60)) + "px";
        div.style.top = "-60px";
        div.x = parseInt(div.style.left);
        div.y = parseInt(div.style.top);
        div.speed = Math.random()*3 + 2;

        container.appendChild(div);
    }
}

function playGame() {
    if(!player.inPlay) return;


    if(keys.ArrowUp && basketPos.y>0) basketPos.y-=player.speed;
    if(keys.ArrowDown && basketPos.y<container.offsetHeight - basket.offsetHeight) basketPos.y+=player.speed;
    if(keys.ArrowLeft && basketPos.x>0) basketPos.x-=player.speed;
    if(keys.ArrowRight && basketPos.x<container.offsetWidth - basket.offsetWidth) basketPos.x+=player.speed;
    basket.style.left = basketPos.x + "px";
    basket.style.top = basketPos.y + "px";


    const enemies = document.querySelectorAll(".baddy");
    enemies.forEach(e=>{
        e.y += e.speed;
        if(e.y>container.offsetHeight){
            player.lost++; 
            player.enemiesOnScreen--;
            e.remove();
            updateScore();
            if(player.totalBad>0) makeBad();
            return; 
        }
        e.style.left = e.x + "px";
        e.style.top = e.y + "px";

        if(isCollide(basket,e)){
            player.score++;
            player.enemiesOnScreen--;
            e.remove();
            updateScore();
            if(player.totalBad>0) makeBad();
        }
    });

    
    if(player.score>=player.target){ endGame("win"); return;}
    if(player.enemiesOnScreen===0 && player.totalBad===0){ endGame("lose"); return;}

    requestAnimationFrame(playGame);
}

function endGame(result){
    player.inPlay=false;
    basket.style.display="none";
    message.style.display="block";
    if(result==="win"){
        message.textContent=`🎉 Congratulations! You won! 🎉\nCaught: ${player.score} | Missed: ${player.lost}`;
        message.style.color="#00ff00";
        message.style.textShadow="0 0 10px #00ff00";
    }else{
        message.textContent=`Game Over 😥\nCaught: ${player.score} | Missed: ${player.lost}`;
        message.style.color="#ff3300";
        message.style.textShadow="0 0 10px #ff3300";
    }
     btn.style.display="block";
    btn.textContent="Play Again";
}

function isCollide(a,b){
    const aRect=a.getBoundingClientRect();
    const bRect=b.getBoundingClientRect();
    return !(aRect.bottom<bRect.top || aRect.top>bRect.bottom || aRect.right<bRect.left || aRect.left>bRect.right);
}

function updateScore(){
    scoreOutput.textContent = player.score;
    lostOutput.textContent = player.lost;
}

window.addEventListener('load', initGame);
