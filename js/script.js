// global game variables
let _GAME = {
    timerStart: false,
    seconds: 1,
    time: '00:00',
    moves: 0,
    games: 0,
    score: '\u2605\u2605\u2605',
    boardSize: 4,
    boardDim: '2x2',
    stats: [],
    match: [],
}

//create table and make cards according to template
function fillBoard(template) {
    let gameBoard = $('#game-table');
    let frag = $(document.createDocumentFragment());
    let count = 0;
    const [r, c] = findRC();
    const w = Math.min(r, c);
    const h = Math.max(r, c);

    gameBoard.empty();

    _GAME.boardDim = `${h}x${w}`;
    $('#board-dim').text(_GAME.boardDim);

    for (let i = 0; i < h; i++) {
        const tr = $(document.createElement('tr'));
        tr.addClass('card-row');

        for (let j = 0; j < w; j++) {
            tr.append(`<td class="card-td"><div id="cd${count}" data-card="${template[count][0]}${template[count][1]}" class="card card-face hide unsolved" style="color:${template[count][0]}">${template[count][1]}</div><div id="cv${count}"class="card card-cover"></div></td>`);
            count++;
        }
        frag.append(tr);
    }

    gameBoard.append(frag);

    //set card width size according to # of cards
    $('.card').css({ width: `${60 / w}vw`, height: `${60 / h}vh`, 'font-size': `` });
    setFont();
}

//find best width x height ratio for table
function findRC() {
    const tSize = _GAME.boardSize;
    const sqrt = Math.sqrt(tSize);

    if (tSize % sqrt === 0) {
        return [sqrt, sqrt];

    } else {
        let ratios = {};
        const start = (tSize / 2) - 1;

        for (let j = start; j > 0; j--) {
            if (tSize % j === 0) {
                ratios[`${Math.abs(j - (tSize / j))}`] = [j, tSize / j];
            }
        }
        return ratios[Math.min(...Object.keys(ratios))];
    }
}

//randomly pick color/sym combo and push to array for board template
function createBoard() {
    let matches = _GAME.boardSize / 2;
    let color = 'gray #ceb40e brown blue green red purple magenta orange black'.split(' ');
    let sym = '! @ # $ % " \' ^ & * = + - _ ( ) { } < > ~ / \\ | [ ] ? ; . , :'.split(' ');
    let boardTemplate = [];

    for (let i = 0; i < matches; i++) {
        //pick random combo of color/sym
        boardTemplate.push([color[randomNumber(color.length)], sym[randomNumber(sym.length)]]);
    }
    //creates 2 of every card
    boardTemplate.push(...boardTemplate);
    fillBoard(shuffleBoard(boardTemplate));
}

//shuffle template
function shuffleBoard(boardTemplate) {
    let shuffled = [];
    const len = boardTemplate.length;

    for (let i = 0; i < len; i++) {
        let randNum = randomNumber(boardTemplate.length);
        shuffled.push(boardTemplate[randNum]);
        boardTemplate.splice(randNum, 1);
    }

    return shuffled;
}

//return random number
function randomNumber(m) {
    //helper code (2018-https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
    return Math.floor(Math.random() * Math.floor(m));
}

// flip animation
function flip(ev) {
    $(ev.target).css('transform', 'scalex(0)');

    setTimeout(function () {
        $(ev.target).addClass('hide');
        $(ev.target).prev('.card').removeClass('hide');

        setTimeout(function () {
            $(ev.target).prev('.card').css('transform', 'scalex(1)');
        }, 50);
    }, 300);
}

//reverse flip animation
function reverseFlip() {
    for (let card of _GAME.match) {
        setTimeout(function () {
            $(`#${card}`).css('transform', 'scalex(0)');

            setTimeout(function () {
                $(`#${card}`).addClass('hide');
                $(`#${card}`).next('.card-cover').removeClass('hide');
                $(`#${card}`).next('.card-cover').css('transform', 'scalex(1)');
            }, 300);
        }, 1200);
    }
    _GAME.match = [];
}

//reset variables for new game
function gamePlay() {
    _GAME.timerStart = false;
    _GAME.pair = [];
    _GAME.match = [];
    _GAME.turns = 0;
    _GAME.seconds = 1;
    _GAME.time = '00:00';
    _GAME.turns = 0;
    _GAME.moves = 0;
    _GAME.score = '\u2605\u2605\u2605';

    setVars();
    createBoard();
    $('table').one('click', timer);
}

//display game data in html elements
function setVars() {
    $('#seconds').text(_GAME.seconds);
    $('#timer').text(_GAME.time);
    $('#turns').text(_GAME.turns);
    $('#moves').text(_GAME.moves);
    $('#games').text(_GAME.games);
    $('#score').text(_GAME.score);
}


function timer() {
    const timer = window.setInterval(time, 1000);
    let count = _GAME.seconds;
    let t = new Date();

    _GAME.timerStart = true;

    function time() {
        if (!_GAME.timerStart) {
            window.clearInterval(timer);

        } else {
            t.setSeconds(count);
            t.setMinutes(count / 60);
            _GAME.time = `${t.getMinutes().toLocaleString('en-us', { minimumIntegerDigits: 2 })}:${t.getSeconds().toLocaleString('en-us', { minimumIntegerDigits: 2 })}`;
            $('#timer').text(_GAME.time);
            count++;
            _GAME.seconds = count;
        }
    }
}

//show and populate replay container
function replay() {
    $('#replay-container').removeClass('hide');
    $('#replay-score').text(_GAME.score);
    $('#replay-time').text(_GAME.time);
    $('#replay-moves').text(_GAME.moves);
}

// show and populate stats container
function showStats() {
    $('#stats-display-container').removeClass('hide');
    let tbody = $('#stats-table-body');
    let frag = $(document.createDocumentFragment());

    tbody.empty();

    _GAME.stats.forEach(function (stat) {
        const tr = document.createElement('tr');
        $(tr).addClass('stat-row');

        stat.forEach(function (s) {
            $(tr).append(`<td class="stat-info">${s}</td>`);
        });

        frag.append(tr);
    });

    tbody.append(frag);
}

//miss match animation
function miss() {
    _GAME.match.forEach(function (card) {
        $(`#${card}`).addClass('animate');
    });

    setTimeout(function () {
        $('.animate').addClass('miss-animate');
    }, 600);

    setTimeout(function () {
        $('.animate').removeClass('animate miss-animate');
    }, 1000);

    setTimeout(function () {
        reverseFlip();

        $('#game-table').on('click', '.card-cover', function (ev) {
            cardClick(ev);
        });

    }, 100);
}

//correct match animation
function match() {
    _GAME.match.forEach(function (card) {
        $(`#${card}`).addClass('animate');
    });

    setTimeout(function () {
        $('.animate').addClass('match-animate');
        $('.animate').css({ 'color': '#424d4f', 'background': '#59ff5c' });
    }, 500);

    setTimeout(function () {
        _GAME.match.forEach(function (card) {
            $(`#${card}`).removeClass('animate match-animate unsolved');
        });
    }, 800);

    setTimeout(function () {
        _GAME.match = [];

        //game complete
        if ($('.unsolved').length === 0) {
            replay();
            _GAME.games++;
            _GAME.stats.push([_GAME.time, _GAME.score, _GAME.moves, _GAME.boardDim]);
            _GAME.timerStart = false;
            $('#games').text(_GAME.games);
        }

        $('#game-table').on('click', '.card-cover', function (ev) {
            cardClick(ev);
        });

    }, 1000);
}

//control the game flow
function cardClick(ev) {
    _GAME.match.push($(ev.target).prev('.card-face').attr('id'));
    flip(ev);

    if (_GAME.match.length === 2) {
        _GAME.moves++;
        $('#moves').text(_GAME.moves);

        if (_GAME.moves / _GAME.boardSize <= 0.75) {
            _GAME.score = ('\u2605\u2605\u2605');
            $('#score').text(_GAME.score);

        } else if (_GAME.moves > _GAME.boardSize) {
            _GAME.score = ('\u2605');
            $('#score').text(_GAME.score);

        } else {
            _GAME.score = ('\u2605\u2605');
            $('#score').text(_GAME.score);
        }

        $('#game-table').off('click', '.card-cover');

        if ($(`#${_GAME.match[0]}`).attr('data-card') != $(`#${_GAME.match[1]}`).attr('data-card')) {
            miss();

        } else if ($(`#${_GAME.match[0]}`).attr('data-card') === $(`#${_GAME.match[1]}`).attr('data-card')) {
            match();
        }
    }
}


$(function () {
    gamePlay();
    events();
    $('#game-table').on('click', '.card-cover', function (ev) {
        cardClick(ev);
    });
});

//adust font size of card based on height/width of card
function setFont() {
    let cardHeight = Number($('.card').css('height').split('px')[0]);
    let cardWidth = Number($('.card').css('width').split('px')[0]);

    if (cardHeight < cardWidth) {
        $('.card').css('font-size', `${cardHeight - 15}px`);

    } else if (cardWidth < cardHeight) {
        $('.card').css('font-size', `${cardWidth - 15}px`);

    } else {
        $('.card').css('font-size', `${cardHeight - 25}px`);
    }
}

//event handleres
function events() {
    $('#replay-button').click(function (ev) {
        gamePlay();
        $('#replay-container').addClass('hide');
    });


    $('.level-up-button').click(function (ev) {
        _GAME.boardSize = _GAME.boardSize + 4;
        gamePlay();
        $('#replay-container').addClass('hide');
    });


    $('#level-down-button').click(function (ev) {
        if (_GAME.boardSize > 4) {
            _GAME.boardSize = _GAME.boardSize - 4;
            gamePlay();
        }
    });


    $('#restart-button,#cancel-button').click(function (ev) {
        $('#restart-container').toggleClass('hide');
    });


    $('#restart-game-button').click(function (ev) {
        $('#restart-container').toggleClass('hide');
        gamePlay();
    });


    $('#start-over-button').click(function (ev) {
        $('#restart-container').toggleClass('hide');
        _GAME.stats = [];
        _GAME.games = 0;
        _GAME.boardSize = 4;
        gamePlay();
    });


    $('#show-stats').click(function (ev) {
        showStats();
    });


    $('#save-game').click(function (ev) {
        localStorage.setItem('table', $('#game-table').html());
        localStorage.setItem('game', JSON.stringify(_GAME));
        const saved = $('#saved-container');

        setTimeout(function () {
            saved.addClass('slide-down');
            saved.removeClass('hide');
        }, 500);

        setTimeout(function () {
            saved.addClass('hide');
            saved.removeClass('slide-down');
        }, 2000);
    });


    $('#load-game').click(function (ev) {
        savedGame = JSON.parse(localStorage.getItem('game'));
        if (savedGame) {
            _GAME = savedGame;
            const table = $('#game-table');
            table.empty();
            table.html(localStorage.getItem('table'));
            _GAME.timerStart = false;
            setVars();
            $('table').one('click', timer);
        } else {
            alert("Sorry! No game data available.");
        }
    });


    $('#menu-button-icon').click(function (ev) {
        $('#main-buttons-container').toggleClass('hide');

        setTimeout(function () {
            $('#main-buttons-container').css('transform', 'scaley(1)');
        }, 0);
    });


    $('#main-buttons-container,#close').click(function (ev) {
        $('#main-buttons-container').css('transform', 'scaley(0)');
        $('#main-buttons-container').addClass('hide');
    });


    $('#close-stats').click(function (ev) {
        $('#stats-display-container').addClass('hide');
    });

    $(window).resize(function () {
        setFont();
    });
}