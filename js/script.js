let timerStart = false;

function fillBoard(template){
    let gameBoard=$('#game-table');
    gameBoard.empty();
    
    let frag = $(document.createDocumentFragment());
    let count = 0;
    const [r,c] = findRC();
    $('#board').text(`${r}x${c}`);
    
    for(let i=0; i < r; i++){
        const tr =$(document.createElement('tr'));
        tr.addClass('card-row');
        
        for(let j=0; j < c; j++){
            tr.append(`<td class="card-td"><div data-card="${template[count][0]}${template[count][1]}" class="card card-face hide unsolved" style="color:${template[count][0]}">${template[count][1]}</div><div class="card card-cover"></div></td>`)
            count++;
        }
        frag.append(tr);
    }
    
    gameBoard.append(frag);
}


function findRC(){
    //get rows & columns
    const tSize = Number($('#game-table').attr('data-size'));
    const sqrt = Math.sqrt(tSize);
        
    if(tSize % sqrt === 0){
        return [sqrt,sqrt];
        
    }else{
        let ratios = {}
        const start = (tSize/2)-1;
        
        for (let j = start; j > 0; j--){
            if (tSize%j ===0){
            ratios[`${Math.abs(j-(tSize/j))}`] = [j,tSize/j];
            }
}
    return ratios[Math.min(...Object.keys(ratios))];
    }
}


function createBoard(){
    let matches = Number($('#game-table').attr('data-size'))/2;
    let color = 'blue green red purple pink orange yellow black gray black magenta'.split(' ');
    let sym = '! @ # $ % ^ & * ( ) { } < > ~ / | [ ] ? ; :'.split(' ');
    let boardTemplate = [];
    
    for( let i=0; i < matches; i++){
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
    timerStart = false;

    $('#timer').text('00:00');
    $('table').one('click',timer);
    $('#score').text('***');
    $('#moves').text(0);
    createBoard();
}


function timer(){
    const timer = window.setInterval(time, 1000);
    let count = 1;
    timerStart=true;
    let t = new Date();

    function time() {
        if(!timerStart){
            window.clearInterval(timer);
        }
        else {
            t.setSeconds(count);
            t.setMinutes(count/60);
            $('#timer').text(`${t.getMinutes().toLocaleString('en-us',{minimumIntegerDigits:2})}:${t.getSeconds().toLocaleString('en-us',{minimumIntegerDigits:2})}`);
            count ++;
        }
    }
}


function replay(){
    $('#replay-container').removeClass('hide');
}


function cardClick(){
    let pair = [];
    let flipped=[];
    let turns = 0;
    const CARDS = Number($('#game-table').attr('data-size'));
    let score = $('#score');
    let moves = 0;
    

    $('#game-table').on('click','.card-cover',function(ev){
        let games = Number($('#games').text());
    // }
        pair.push($(ev.target).prev('.card-face').attr('data-card'));
        flipped.push(ev.target)

        if(pair.length === 2){
            moves++;
            $('#moves').text(moves);

            if(pair[0] != pair[1]){
                reverseFlip(flipped);
                turns++;
            }

            else if(pair[0] === pair[1]){
                flipped.forEach(function(el){
                    $(el).prev('.card-face').removeClass('unsolved');
                });
            }
            console.log(turns,'turns');

            pair = [];
            flipped = [];
        }

        flip(ev);
        
        //score ratings
        if(turns <= (CARDS/4)*3){
            score.text('***');
        }
        
        else if(turns > CARDS){
            score.text('*');
        }
        
        else{
            score.text('**');
        }

        //game complete
        if($('.unsolved').length===0){
            replay();
            turns = 0;
            moves = 0;
            games++;
            timerStart=false;
            $('#games').text(games);
        }
    });
}


$(function() {
    gamePlay();
    cardClick();
    events();
});


function events(){
    $('#replay-button').click(function(ev){
        gamePlay();
        $('#replay-container').addClass('hide');
    });

    $('.level-up-button').click(function(ev){
        let size = $('#game-table').attr('data-size');
        
        $('#game-table').attr('data-size',Number(size)+4);
        gamePlay();
        $('#replay-container').addClass('hide');
    });

    $('#level-down-button').click(function(ev){
        let size = Number($('#game-table').attr('data-size'));
        console.log(size);

        if(size > 4){
            $('#game-table').attr('data-size',size-4);
            gamePlay();
        }

    });

    $('#restart-button,#cancel-button').click(function(ev){
        $('#restart-container').toggleClass('hide');
        //'pause' timer when prompt shows up
    });

    $('#restart-game-button').click(function(ev){
        $('#restart-container').toggleClass('hide');
        gamePlay();
    });

    $('#start-over-button').click(function(ev){
        $('#restart-container').toggleClass('hide');
        $('#games').text(0);
        $('#game-table').attr('data-size',4);
        gamePlay();

    });

}

// TODO:Show number of moves during game;
//     create 'modal' for replay displaying stats
//     restart button to start everything over;
//     README
//     Add unique functionality beyond the 
//         minimum requirements (Implement a 
//         leaderboard, store game state using 
//         local storage, etc.)
//     Implement additional optimizations that 
//         improve the performance and user experience 
//         of the game (keyboard shortcuts for gameplay, etc).
