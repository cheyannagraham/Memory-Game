let variables = {
    timerStart : false,
    seconds : 0,
    time : '00:00',
    turns : 0,
    moves : 0,
    games : 0,
    score : '***',
    pair : [],
    boardSize : 4,
    boardDim : '2x2',
    stats : []
}

const restart = {...variables};


function fillBoard(template){
    let gameBoard=$('#game-table');
    gameBoard.empty();
    
    let frag = $(document.createDocumentFragment());
    let count = 0;
    const [r,c] = findRC();
    variables.boardDim = `${r}x${c}`;
    $('#board-dim').text(variables.boardDim);
    
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
    const tSize = variables.boardSize;
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
    let matches =variables.boardSize/2;
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


function reverseFlip(){
    const flipped = $('.flipped');

    for (let card of flipped){
            setTimeout(function(){
                $(card).prev('.card').css('transform','scalex(0)');
    
                setTimeout(function(){
                    $(card).prev('.card').toggleClass('hide');
                    $(card).toggleClass('hide');
                    $(card).css('transform','scalex(1)');
                    $(card).removeClass('flipped');
                },300);
            },1200);
        }
}


function gamePlay(){
    variables.timerStart = false;
    variables.pair = [];
    variables.turns = 0;
    variables.seconds = 0;
    variables.time = '00:00';
    variables.turns = 0;
    variables.moves = 0;
    variables.score = '***';

    setVars();
    createBoard();
    $('table').one('click',timer);
}

function setVars() {
    $('#seconds').text(variables.seconds);
    $('#timer').text(variables.time);
    $('#turns').text(variables.turns);
    $('#moves').text(variables.moves);
    $('#games').text(variables.games);
    $('#score').text(variables.score);


}


function timer(){
    const timer = window.setInterval(time, 1000);
    let count = variables.seconds;
    variables.timerStart=true;
    let t = new Date();

    function time() {
        if(!variables.timerStart){
            window.clearInterval(timer);
        }
        else {
            t.setSeconds(count);
            t.setMinutes(count/60);
            variables.time = `${t.getMinutes().toLocaleString('en-us',{minimumIntegerDigits:2})}:${t.getSeconds().toLocaleString('en-us',{minimumIntegerDigits:2})}`; 
            $('#timer').text(variables.time);
            count ++;
            variables.seconds = count;
        }
    }
}


function replay(){
    $('#replay-container').removeClass('hide');
}

function showStats(){

}


function cardClick(){

    $('#game-table').on('click','.card-cover',function(ev){

        variables.pair.push($(ev.target).prev('.card-face').attr('data-card'));
        $(ev.target).addClass('flipped');

        if(variables.pair.length === 2){
            variables.moves++;
            $('#moves').text(variables.moves);

            if(variables.pair[0] != variables.pair[1]){
                reverseFlip();
                variables.turns++;
            }

            else if(variables.pair[0] === variables.pair[1]){
                $('.flipped').removeClass('unsolved flipped');

            }

            variables.pair = [];
        }

        flip(ev);
        
        //score ratings
        if(variables.turns <= (variables.boardSize/4)*3){
            variables.score =('***');
            $('#score').text(variables.score);
        }
        
        else if(variables.turns > variables.boardSize){
            variables.score =('*');
            $('#score').text(variables.score);
        }
        
        else{
            variables.score =('**');
            $('#score').text(variables.score);
        }

        //game complete
        if($('.unsolved').length===0){
            replay();
            variables.games++;
            variables.stats.push([variables.time,variables.score,variables.moves,variables.boardSize])
            variables.timerStart=false;
            $('#games').text(variables.games);
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
        variables.boardSize = variables.boardSize + 4;
        gamePlay();
        $('#replay-container').addClass('hide');
    });

    $('#level-down-button').click(function(ev){
        if(variables.boardSize > 4){
            variables.boardSize = variables.boardSize-4;
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
        variables = {...restart};
        gamePlay();
    });

    $('#show-stats').click(function(ev){
        //pause mode
    });
    
    $('#save-game').click(function(ev){
        localStorage.setItem('gameboard',$('#gameboard').html());
        localStorage.setItem('variables',JSON.stringify(variables));
    });
    
    $('#load-game').click(function(ev){
        const gameboard = $('#gameboard');
        
        gameboard.empty();
        gameboard.html(localStorage.getItem('gameboard'));

        variables = JSON.parse(localStorage.getItem('variables'));
        variables.timerStart = false;
        
        setVars();
        cardClick();
        $('table').one('click',timer);

    });

}

// TODO create 'modal' for replay displaying stats
//     README
//     Add unique functionality beyond the 
//         minimum requirements (Implement a 
//         leaderboard, store game state using 
//         local storage, etc.)
//     Implement additional optimizations that 
//         improve the performance and user experience 
//         of the game (keyboard shortcuts for gameplay, etc).
