function fillBoard(template){
    let gameBoard=$('#game-table');
    let frag = $(document.createDocumentFragment());
    let count = 0;
    const [r,c] = findRC(template.length);
    
    for(let i=0; i < r; i++){
        const tr =$(document.createElement('tr'));
        tr.addClass('card-row');
        
        for(let j=0; j < c; j++){
            tr.append(`<td><div data-card="${template[count][0]}${template[count][1]}" class="card card-face hide unsolved" style="color:${template[count][0]}">${template[count][1]}</div><div class="card card-cover"></div></td>`)
            count++;
        }
        frag.append(tr);
    }
    
    gameBoard.append(frag);
}


function findRC(cards){
    //get rows & columns
    const rc = Math.sqrt(cards);
    if(cards % rc ===0){
        return [rc,rc];
    }
    

}


function createBoard(tiles){
    let color = 'blue green red purple pink orange yellow black gray black magenta'.split(' ');
    let sym = '! @ # $ % ^ & * ( ) { } < > ~ / | [ ] ? ; :'.split(' ');
    let boardTemplate = [];
    
    for( let i=0; i < tiles/2 ;i++){
            boardTemplate.push([color[randomNumber(color.length)],sym[randomNumber(sym.length)]]);
    }
    boardTemplate.push(...boardTemplate);
    fillBoard(shuffleBoard(boardTemplate));

}


function shuffleBoard(boardTemplate){
    let shuffled = [];
    const len = boardTemplate.length;
    
    for(let i = 0; i < len; i++){
        let randNum=randomNumber(boardTemplate.length);
            shuffled.push(boardTemplate[randNum]);
            boardTemplate.splice(randNum,1);
    }

    return shuffled;
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


function reverseFlip(covers){
    covers.forEach(function(card){

        setTimeout(function(){
            $(card).prev('.card').css('transform','scalex(0)');
            
            setTimeout(function(){
                $(card).prev('.card').toggleClass('hide');
                $(card).toggleClass('hide');
                $(card).css('transform','scalex(1)');
            },300);
        },1200);
    });
}


function gamePlay(){
    const tiles = 4;
    createBoard(tiles);
}


function cardClick(){
    let pair = [];
    let flipped=[];

    $('#game-table').on('click','.card-cover',function(ev){
        pair.push($(ev.target).prev('.card-face').attr('data-card'));
        flipped.push(ev.target)

        if(pair.length === 2){

            if(pair[0] != pair[1]){
                console.log('no match');
                reverseFlip(flipped);
            }
            else if(pair[0] === pair[1]){
                flipped.forEach(function(el){
                    $(el).prev('.card-face').removeClass('unsolved');
                });
            }
            pair = [];
            flipped = [];
        }
        flip(ev);
        if($('.unsolved').length===0){
            alert("You Won!");
        }
    });

}


$(function() {
    cardClick();
    gamePlay();
});

//create actual matches, score, timer