function fillBoard(){
    let gameBoard=$('#gameboard');
    let frag = $(document.createDocumentFragment());
    
    for(let i=0;i<12;i++){
        frag.append('<div class="card"></div>')        
    }
    gameBoard.append(frag);
}
$(function() {
    fillBoard();
});