let game = {
    timerStart : false,
    seconds : 1,
    time : '00:00',
    moves : 0,
    games : 0,
    score : '\u2605\u2605\u2605',
    boardSize : 4,
    boardDim : '2x2',
    stats : [],
    match : [],
}


function fillBoard(template){
    let gameBoard=$('#game-table');
    let frag = $(document.createDocumentFragment());
    let count = 0;
    const [r,c] = findRC();
    const w = Math.min(r,c);
    const h = Math.max(r,c);

    gameBoard.empty();

    game.boardDim = `${h}x${w}`;
    $('#board-dim').text(game.boardDim);

    for(let i=0; i < h; i++){
        const tr =$(document.createElement('tr'));
        tr.addClass('card-row');

        for(let j=0; j < w; j++){
            tr.append(`<td class="card-td"><div id="cd${count}" data-card="${template[count][0]}${template[count][1]}" class="card card-face hide unsolved" style="color:${template[count][0]}">${template[count][1]}</div><div id="cv${count}"class="card card-cover"></div></td>`);
            count++;
        }
        frag.append(tr);
    }

    gameBoard.append(frag);

    //set card width size according to # of cards
    $('.card').css({width:`${60/w}vw`,height:`${60/h}vh`,'font-size':``});
    setFont();
}


function findRC(){
    //find best width x height ratio
    const tSize = game.boardSize;
    const sqrt = Math.sqrt(tSize);

    if(tSize % sqrt === 0){
        return [sqrt,sqrt];

    }else{
        let ratios = {};
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
    let matches =game.boardSize/2;
    let color ='gray #ceb40e brown blue green red purple magenta orange black'.split(' ');
    let sym = '! @ # $ % " \' ^ & * = + - _ ( ) { } < > ~ / \\ | [ ] ? ; . , :'.split(' ');
    let boardTemplate = [];

    for( let i=0; i < matches; i++){
        //pick random combo of color/sym
        boardTemplate.push([color[randomNumber(color.length)],sym[randomNumber(sym.length)]]);
    }
    //creates 2 of every card
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
    //helper code (2018-https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
    return Math.floor(Math.random() * Math.floor(m));
}


function flip(ev){
    // flip animation
    $(ev.target).css('transform','scalex(0)');

    setTimeout(function(){
        $(ev.target).addClass('hide');
        $(ev.target).prev('.card').removeClass('hide');

        setTimeout(function(){
        $(ev.target).prev('.card').css('transform','scalex(1)');
        },50);
    },300);
}


function reverseFlip(){
    for (let card of game.match){
        setTimeout(function(){
            $(`#${card}`).css('transform','scalex(0)');

            setTimeout(function(){
                $(`#${card}`).addClass('hide');
                $(`#${card}`).next('.card-cover').removeClass('hide');
                $(`#${card}`).next('.card-cover').css('transform','scalex(1)');
            },300);
        },1200);
    }
    game.match = [];
}


function gamePlay(){
    //reset variables for new game
    game.timerStart = false;
    game.pair = [];
    game.match = [];
    game.turns = 0;
    game.seconds = 1;
    game.time = '00:00';
    game.turns = 0;
    game.moves = 0;
    game.score = '\u2605\u2605\u2605';

    setVars();
    createBoard();
    $('table').one('click',timer);
}


function setVars() {
    $('#seconds').text(game.seconds);
    $('#timer').text(game.time);
    $('#turns').text(game.turns);
    $('#moves').text(game.moves);
    $('#games').text(game.games);
    $('#score').text(game.score);
}


function timer(){
    const timer = window.setInterval(time, 1000);
    let count = game.seconds;
    let t = new Date();

    game.timerStart=true;

    function time() {
        if(!game.timerStart){
            window.clearInterval(timer);

        } else {
            t.setSeconds(count);
            t.setMinutes(count/60);
            game.time = `${t.getMinutes().toLocaleString('en-us',{minimumIntegerDigits:2})}:${t.getSeconds().toLocaleString('en-us',{minimumIntegerDigits:2})}`;
            $('#timer').text(game.time);
            count ++;
            game.seconds = count;
        }
    }
}


function replay(){
    $('#replay-container').removeClass('hide');
    $('#replay-score').text(game.score);
    $('#replay-time').text(game.time);
    $('#replay-moves').text(game.moves);
}


function showStats(){
    $('#stats-display-container').removeClass('hide');
    let tbody = $('#stats-table-body');
    let frag = $(document.createDocumentFragment());

    tbody.empty();

    game.stats.forEach(function(stat){
        const tr = document.createElement('tr');
        $(tr).addClass('stat-row');

        stat.forEach(function(s){
            $(tr).append(`<td class="stat-info">${s}</td>`);
        });

        frag.append(tr);
    });

    tbody.append(frag);
}


function miss(){
    game.match.forEach(function(card){
        $(`#${card}`).addClass('animate');
    });

    setTimeout(function(){
        $('.animate').addClass('miss-animate');
    },600);

    setTimeout(function(){
        $('.animate').removeClass('animate miss-animate');
    },1000);

    setTimeout(function(){
        reverseFlip();

        $('#game-table').on('click','.card-cover',function(ev){
        cardClick(ev);
        });

    },100);
}


function match() {
    game.match.forEach(function(card){
        $(`#${card}`).addClass('animate');
    });

    setTimeout(function(){
        $('.animate').addClass('match-animate');
        $('.animate').css({'color':'#424d4f','background': '#59ff5c'});
    },500);

    setTimeout(function(){
        game.match.forEach(function (card){
            $(`#${card}`).removeClass('animate match-animate unsolved');
        });
    },800);

    setTimeout(function(){
        game.match = [];

        //game complete
        if($('.unsolved').length===0){
            replay();
            game.games++;
            game.stats.push([game.time,game.score,game.moves,game.boardDim]);
            game.timerStart=false;
            $('#games').text(game.games);
        }

        $('#game-table').on('click','.card-cover',function(ev){
            cardClick(ev);
        });

    },1000);
}


function cardClick(ev){
    game.match.push($(ev.target).prev('.card-face').attr('id'));
    flip(ev);

    if(game.match.length === 2){
        game.moves++;
        $('#moves').text(game.moves);

        if (game.moves/game.boardSize <= 0.75){
            game.score =('\u2605\u2605\u2605');
            $('#score').text(game.score);

        }else if (game.moves > game.boardSize){
            game.score =('\u2605');
            $('#score').text(game.score);

        }else {
            game.score =('\u2605\u2605');
            $('#score').text(game.score);
        }

        $('#game-table').off('click','.card-cover');

        if($(`#${game.match[0]}`).attr('data-card') != $(`#${game.match[1]}`).attr('data-card')){
            miss();

        }else if ($(`#${game.match[0]}`).attr('data-card') === $(`#${game.match[1]}`).attr('data-card')){
            match();
        }
    }
}


$(function() {
    gamePlay();
    events();
    $('#game-table').on('click','.card-cover',function(ev){
        cardClick(ev);
    });
});


function setFont(){
    let cardHeight = Number($('.card').css('height').split('px')[0]);
    let cardWidth = Number($('.card').css('width').split('px')[0]);

    if(cardHeight < cardWidth){
        $('.card').css('font-size',`${cardHeight-15}px`);

    }else if(cardWidth < cardHeight){
        $('.card').css('font-size',`${cardWidth-15}px`);

    }else{
        $('.card').css('font-size',`${cardHeight-25}px`);
    }
}


function events(){
    $('#replay-button').click(function(ev){
        gamePlay();
        $('#replay-container').addClass('hide');
    });


    $('.level-up-button').click(function(ev){
        game.boardSize = game.boardSize + 4;
        gamePlay();
        $('#replay-container').addClass('hide');
    });


    $('#level-down-button').click(function(ev){
        if(game.boardSize > 4){
            game.boardSize = game.boardSize-4;
            gamePlay();
        }
    });


    $('#restart-button,#cancel-button').click(function(ev){
        $('#restart-container').toggleClass('hide');
    });


    $('#restart-game-button').click(function(ev){
        $('#restart-container').toggleClass('hide');
        gamePlay();
    });


    $('#start-over-button').click(function(ev){
        $('#restart-container').toggleClass('hide');
        game.stats = [];
        game.games = 0;
        game.boardSize= 4;
        gamePlay();
    });


    $('#show-stats').click(function(ev){
        showStats();
    });


    $('#save-game').click(function(ev){
        localStorage.setItem('table',$('#game-table').html());
        localStorage.setItem('game',JSON.stringify(game));
        const saved = $('#saved-container');

        setTimeout(function(){
            saved.addClass('slide-down');
            saved.removeClass('hide');
        },500);

        setTimeout(function(){
            saved.addClass('hide');
            saved.removeClass('slide-down');
        },2000);
    });


    $('#load-game').click(function(ev){
        const table = $('#game-table');

        table.empty();
        table.html(localStorage.getItem('table'));

        game = JSON.parse(localStorage.getItem('game'));
        game.timerStart = false;

        setVars();

        $('table').one('click',timer);
    });


    $('#menu-button-icon').click(function(ev){
        $('#main-buttons-container').toggleClass('hide');

        setTimeout(function(){
            $('#main-buttons-container').css('transform','scaley(1)');
        },0);
    });


    $('#main-buttons-container,#close').click(function(ev){
        $('#main-buttons-container').css('transform','scaley(0)');
        $('#main-buttons-container').addClass('hide');
    });


    $('#close-stats').click(function(ev){
        $('#stats-display-container').addClass('hide');
    });

    $(window).resize(function(){
        setFont();
    });
}