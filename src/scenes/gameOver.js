import Phaser from '../lib/phaser.js'
//move from game scene to this scene when game is over
export default class GameOver extends Phaser.Scene
{
    constructor()
    {
        super('game-over');
    }
    create()
    {

        const width = this.scale.width;
        const height = this.scale.height;

        this.add.text(width*0.5,height*0.5 - 30,'Game Over',{fontSize:48}).setOrigin(0.5,0);
        this.add.text(width * 0.5 - 150, height * 0.5 + 20, 'Press space bar to restart', { fontSize: 20 })
            .setOrigin(0, 0);
        
        this.input.keyboard.once('keydown_SPACE',()=>{
            this.scene.start('game');
        })    


    }
}