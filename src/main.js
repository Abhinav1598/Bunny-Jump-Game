// the main Phaser class here
import Phaser from "./lib/phaser.js"

//import game class here.
import Game from './scenes/game.js'

//import gameOver class here.
import GameOver from './scenes/gameOver.js'

export default new Phaser.Game ({    
    type : Phaser.AUTO,
    parent:'bunny-game',    
    width: 520,
    height: 640,
    scene: [Game,GameOver],
    physics: {
        default: 'arcade',
        arcade : {
            gravity:{
                y:200                
            }            
        }
    }
})