import  BLOCKS from "./blocks.js"


//DOM
const playground=document.querySelector(".playground > ul");
const gameText=document.querySelector('.game-text');
const scoreDisplay=document.querySelector(".score");
const restartButton=document.querySelector(".game-text>button");

//Setting
const GAME_ROWS=20;
const GAME_COLS=10;


//variables
let score=0;
let duration=500;
let downInterval;
let tempMovingItem;

const movingItem={
    type: "",
    direction:0,
    top:0,
    left:0,
};



//functions

//게임 초기화 함수
init()
function init(){
    
    tempMovingItem={ ...movingItem};
    for(let i=0;i<GAME_ROWS;i++){
        prependNewLine();
    }
    generateNewBlock();
}


//새로운 테트리스 칸 만드는 함수
function prependNewLine(){
        const li=document.createElement("li");
        const ul=document.createElement("ul");
        for(let j=0;j<10;j++){
            const matrix=document.createElement("li");
            ul.prepend(matrix);
        }
        li.prepend(ul);
        playground.prepend(li);
}

//
function renderBlocks(moveType = ""){
    const{type,direction,top,left}=tempMovingItem;
    const movingBlocks=document.querySelectorAll(".moving");
    movingBlocks.forEach(moving =>{
        moving.classList.remove(type,"moving");
    })
 
    BLOCKS[type][direction].some(block=>{
        const x=block[0]+left;
        const y=block[1]+top;
        const target=playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x]:null;
        const isAvailable=checkEmpty(target);
        if(isAvailable){
            target.classList.add(type,"moving")
        }else{
            tempMovingItem={...movingItem}
            if(moveType==='retry'){
                clearInterval(downInterval); 
                showGameoverText();
            }
            setTimeout(()=>{
                renderBlocks('retry');
                if(moveType==="top"){
                    seizeBlocks();
                }           
            },0)

            return true;
        }
    })
    movingItem.left=left;
    movingItem.top=top;
    movingItem.direction=direction;
}
function showGameoverText()
{
    gameText.style.display='flex';
 //   document.getElementById(".text.game").style.display='flex';

}



//끝에서 내려갈 곳이 없으면 새로운 블럭을 만드는 함수입니당
function seizeBlocks(){
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving=>{
        moving.classList.remove("moving");
        moving.classList.add("seized");
    })
    checkMatch()
}

//한줄 잘 맞췄는지 확인하는 함수 
function checkMatch(){
    const childNodes =playground.childNodes;
    childNodes.forEach(child=>{
        let matched=true;
        child.children[0].childNodes.forEach(li=>{
            if(!li.classList.contains("seized")){
                matched=false;
            }
        })
        if(matched){
            child.remove();
            prependNewLine();
            score++;
            scoreDisplay.innerHTML=score;
        }
    })
    generateNewBlock()
}
//새로운 블럭을 만드는 함수 
function generateNewBlock(){
     clearInterval(downInterval);
     downInterval=setInterval(()=>{
        moveBlock('top',1);
     },duration)
    const blockArray=Object.entries(BLOCKS);
    const randomIndex =Math.floor(Math.random() * blockArray.length);
    movingItem.type=blockArray[randomIndex][0];
    movingItem.top=0;
    movingItem.left=3;
    movingItem.direction=0;
    tempMovingItem={...movingItem};
    renderBlocks();
}


function checkEmpty(target){
    //contains는 클래스를 가지고 있는  지 확인
    if(!target || target.classList.contains("seized")){
        return false;
    }
    return true;
}
// 
function moveBlock(moveType,amount){
    tempMovingItem[moveType]+=amount;
    renderBlocks(moveType)
}

//방향 조정하는 함수 
function changeDirection(){
    const direction = tempMovingItem.direction;
    //방향이 3이 되면 0으로 초기화 
    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction +=1;
    renderBlocks();
}

//빠르게 떨어지게 하는 함수
function dropBlock(){
    clearInterval(downInterval);
    downInterval=setInterval(()=>{
        moveBlock("top",1);
    },10)
}


//event handling
document.addEventListener("keydown", e=>{
    switch(e.keyCode){
        case 39:
            moveBlock("left",1);
            break;
        case 37:
            moveBlock("left",-1);
            break;
        case 40:
            moveBlock("top", 1);
            break;
        case 38:
            changeDirection();
            break;      
        case 32:
            dropBlock();
            break;
        default:
            break;
    }
   // console.log(e);
}) 

restartButton.addEventListener("click",()=>{
    playground.innerHTML="";
    gameText.style.display="none";
    init();
})