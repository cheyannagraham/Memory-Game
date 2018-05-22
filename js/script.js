function fillBoard(){
    let gameBoard=$('#game-table');
    let frag = $(document.createDocumentFragment());
    let template = createBoard();
    let count = 0;
    
    for(let i=0;i<3;i++){
        const tr =$(document.createElement('tr'));
        tr.addClass('card-row');
        for(let r=0;r<4;r++){
            tr.append(`<td><div class="card card-face hide" style="color:${template[count][0]}">${template[count][1]}</div><div class="card card-cover"></div></td>`)
            count++;
        }
        frag.append(tr);
    }
    
    gameBoard.append(frag);
}


function createBoard(){
    let color = 'blue green red purple pink orange yellow black gray black magenta'.split(' ');
    let sym = '! @ # $ % ^ & * ( ) { } < > ~ / | [ ] ? ; :'.split(' ');
    let boardTemplate = [];
    
    for( let i=0;i<12;i++){
        boardTemplate.push([color[randomNumber(color.length)],sym[randomNumber(sym.length)]]);
    }
    console.log(boardTemplate);
    return boardTemplate;
}


function randomNumber(m) {
    //helper code (2018-https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random )
    return Math.floor(Math.random() * Math.floor(m));
}

function flip(ev){
        $(ev.target).css('transform','scalex(0)');

        setTimeout(function(){
          $(ev.target).toggleClass('hide');
          $(ev.target).prev('.card').toggleClass('hide');
          
          setTimeout(function(){
            $(ev.target).prev('.card').css('transform','scalex(1)');
          },50);
        },500); 
}

function findMatch(){

}

function events(){
    let pair = [];

    $('#game-table').on('click','.card-cover',function(ev){
        pair.push(ev.target);

        if(pair.length ==2){
            findMatch(pair);
            pair = [];
        }

        flip(ev);
    });

}


$(function() {
    fillBoard();
    events();
});

// TODO: ADD click event and open&hide class & 'turn'
