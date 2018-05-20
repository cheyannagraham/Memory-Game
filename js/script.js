function fillBoard(){
    let gameBoard=document.querySelector('#gameboard');
    
    for(let i=0;i<12;i++){
        const card = document.createElement('div');
        card.innerHTML = 'class="card"';
        gameBoard.appendChild(card);
        
    }
}

document.addEventListener('DOMContentLoaded',fillBoard);