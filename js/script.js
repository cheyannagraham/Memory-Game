function fillBoard(){
    let gameBoard=$('#game-table');
    let frag = $(document.createDocumentFragment());
    let template = createBoard();
    let count = 0;
    
    for(let i=0;i<3;i++){
        const tr =$(document.createElement('tr'));
        tr.addClass('card-row');
        for(let r=0;r<4;r++){
            tr.append(`<td><div class="card" style="color:${template[count][0]}">${template[count][1]}</div></td>`)
            count++;
        }
        frag.append(tr);
    }
    
    gameBoard.append(frag);
}


function createBoard(){
    let color = 'blue green red purple pink orange yellow black gray black magenta'.split(' ');
    let sym = '! @ # $ % ^ & * ( ) { } < > ~'.split(' ');
    let boardTemplate = [];
    
    for( let i=0;i<12;i++){
        boardTemplate.push([color[randomNumber(color.length)],sym[randomNumber(sym.length)]]);
    }
    console.log(boardTemplate);
    return boardTemplate;
}


function randomNumber(m) {
    //helper code (2018https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random )
    return Math.floor(Math.random() * Math.floor(m));
}


$(function() {
    fillBoard();
});

