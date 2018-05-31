# Memory-Game

## About 

This is a basic memory match game.

## How to Play

1. Click on a card.
2. Try to find the match by clicking on another card.
3. The game is won once all matches have been found.

## Save Game

You can save a game. Doing so will save the entire game state. This includes:
* Stats History
* Moves
* Score
* Time
* Games Played

Each save overwrites the previous.

## Load Game

Loading a game will restore your saved game and allow you to continue. 

## Restart

There are two restart options. 

1. Restart current game
2. Start over

Restarting the current game will reset:
* Score
* Time
* Moves

Games played and prev stats will not be cleared.

Starting the game over will clear everything. It's the same
as refreshing the page. 

## My Stats

After a game is won, the Score, Time, Moves, and Board size 
are stored for later reference via the MyStats button.

This is cleared upon window refreshing and restarting the game. 
To save your history after the browser closes, use the save
game option. Upon loading the saved game, the stats will be restored. 

## Level Up/Down

Increase difficulty by adding more cards. Vise Versa

## Score

The score is based on the number of moves made to solve the game. 
Your score decreases as your number of moves increase. 

### Dependencies

This game uses [jQuery](https://jquery.com/)
