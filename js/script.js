function fillBoard(){
    let gameBoard=$('#game-table');
    let frag = $(document.createDocumentFragment());
    let template = createBoard();
    let count = 0;
    
    for(let i=0;i<3;i++){
        const tr =$(document.createElement('tr'));
        tr.addClass('card-row');
        for(let r=0;r<4;r++){
            tr.append(`<td><div data-card="${template[count][0]}${template[count][1]}" class="card card-face hide" style="color:${template[count][0]}">${template[count][1]}</div><div class="card card-cover"></div></td>`)
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
        },300); 
}

function events(){
    let pair = [];

    $('#game-table').on('click','.card-cover',function(ev){
        pair.push($(ev.target).prev('.card-face').attr('data-card'));

        if(pair.length === 2){

            if(pair[0] != pair[1]){
                console.log('no match');
            }

            pair = [];
        }

        flip(ev);
    });

}


$(function() {
    fillBoard();
    events();
});

// complete findmatch();
