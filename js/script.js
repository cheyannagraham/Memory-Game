function fillBoard(){
    let gameBoard=$('#game-table');
    let frag = $(document.createDocumentFragment());
    let color = createBoard();
    let count = 0;
    
    for(let i=0;i<3;i++){
        const tr =$(document.createElement('tr'));
        tr.addClass('card-row');
        for(let r=0;r<4;r++){
            tr.append(`<td><div class="card" style="background:${color[count]}"></div></td>`)
            count++;
        }
        frag.append(tr);
    }
    
    gameBoard.append(frag);
}


function createBoard(){
    let color = 'blue green red purple pink orange yellow black gray white black magenta'.split(' ');
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

