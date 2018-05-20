function fillBoard(){
    let gameBoard=$('#gameboard');
    let frag = $(document.createDocumentFragment());
    let color = createBoard();
    
    for(let i=0;i<12;i++){
        frag.append(`<div class="card" style="background:${color[i]}"></div>`)
    }
    
    gameBoard.append(frag);
}

function createBoard(){
    let color = 'blue green red purple pink orange yellow black gray'.split(' ');
    let boardColor = [];
    
    for( let i=0;i<12;i++){
        boardColor.push(color[randomNumber(color.length)]);
    }
    return boardColor;
}

function randomNumber(m) {
    //helper code (2018https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random )
    return Math.floor(Math.random() * Math.floor(m));
}

$(function() {
    fillBoard();
});

