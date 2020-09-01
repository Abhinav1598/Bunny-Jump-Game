import Phaser from '../lib/phaser.js'

//import the carrot class here.
import Carrot from '../game/carrot.js'


export default class Game extends Phaser.Scene 
{   

    /** @type {Phaser.Physics.Arcade.sprite} */
    player
    
    /** @type {Phaser.Physics.Arcade.staticGroup} */
    platforms

    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors

    /** @type {Phaser.Physics.Arcade.Group} */
    carrots

    /**
     *  @param {Phaser.GameObjects.sprite} sprite
     *  */

    horizontalWrap(sprite){
        const halfWidth = sprite.displayWidth * 0.5
         const gameWidth = this.scale.width
         if (sprite.x < -halfWidth)
         {
           sprite.x = gameWidth + halfWidth
            
        }
        else if (sprite.x > gameWidth + halfWidth)
             {
             sprite.x = -halfWidth
            
        }
    }
    
    /**
     * @param {Phaser.GameObjects.sprite} sprite
     */

    addCarrotsAbove(sprite){
        const y = sprite.y - sprite.displayHeight;
        /** @type {Phaser.Physics.Arcade.Sprite} */
        const carrot = this.carrots.get(sprite.x,y,'carrot');
        carrot.setActive(true);
        carrot.setVisible(true);
        this.add.existing(carrot);

        //update the physics body size
       carrot.body.setSize(carrot.width,carrot.height);

       this.physics.world.enable(carrot);

        return  carrot;
    } 

    constructor(){
        super('game');
    }

    preload(){
        this.load.image('background','assets/bg_layer1.png');
        this.load.image('platform','assets/ground_grass.png');
        this.load.image('bunny-stand','assets/bunny1_stand.png');
        this.load.image('bg','assets/bg_layer2.png');
        
        //adding carrot png
        this.load.image('carrot', 'assets/carrot.png');

        this.cursors = this.input.keyboard.createCursorKeys();
        
    }

    create(){

        this.add.image(240,320,'background').setScrollFactor(1,0);
        this.add.image(240,320,'bg');
        this.cameras.main.setDeadzone(this.scale.width*1.5);

        //create carrot instance here from Carrot class
       /*  const carrot = new Carrot(this, 240, 320, 'carrot');
        this.add.existing(carrot);  */

        //good for creating a single image 
        //this.physics.add.staticImage(240,320,'platform').setScale(0.5); 

        // we need a group of same image at different positions

        this.platforms = this.physics.add.staticGroup();
        
        //create 5 platforms from the group
        for(let i=0;i<5;i++){
          const x = Phaser.Math.Between(100,400);
          const y = 150 * i;

          /** @type {Phaser.physics.Arcade.Sprite} */
          const platform = this.platforms.create(x,y,'platform');
          platform.scale = 0.3;

          /** @type  {Phaser.physics.Arcade.StaticBody} */
          const body = platform.body;
          body.updateFromGameObject()
        }

        this.player = this.physics.add.sprite(240,320,'bunny-stand').setScale(0.3);

        this.physics.add.collider(this.platforms,this.player);

        this.player.body.checkCollision.up = false;
        this.player.body.checkCollision.left = false;
        this.player.body.checkCollision.right = false;

        this.cameras.main.startFollow(this.player);


        // adding carrots

        this.carrots =  this.physics.add.group({
            classType:Carrot
        })
        


        //adding collider between platform and carrots 
        this.physics.add.collider(this.platforms,this.carrots);

        //collecting carrots

        this.physics.add.overlap(
            this.player,
            this.carrots,
            this.handleCollectCarrot, // called an overlap
            undefined,
            this            
        )



          


    }


    update()
    {
        const touchingDown = this.player.body.touching.down
        if(touchingDown){
            this.player.setVelocityY(-300);
        }

        this.platforms.children.iterate(child => {
            const platform = child;
            const scrollY = this.cameras.main.scrollY;

            if(platform.y >= scrollY + 700){

                platform.y = scrollY - Phaser.Math.Between(70, 100);
                platform.x = scrollX + Phaser.Math.Between(0, 450); 
                platform.body.updateFromGameObject();

                //add carrot above platform
                this.addCarrotsAbove(platform);
            }

            
        })

       /*  // remove the oprhaned carrots 

        this.carrots.children.iterate(child => {
            const carrot = child;
            const scrollY = this.cameras.main.scrollY;
            if(carrot.y > scrollY + 700){

                
                this.carrots.kill(carrot);
                this.physics.world.disableBody(carrot.body);
                //remove carrots from the physical world
                
            }
        }) */

        // left and right input logic
        if(this.cursors.left.isDown && !touchingDown){
            this.player.setVelocityX(-200);
        }
        else if(this.cursors.right.isDown && !touchingDown){
            this.player.setVelocityX(200);
        }
        else {
            this.player.setVelocityX(0);            
        }

        this.horizontalWrap(this.player)
    }



    // handle colledtor method for collecting the carrots 

   /**
   * @param {Phaser.Physics.Arcade.Sprite} player
   * @param {Carrot} carrot
   */

    handleCollectCarrot(player,carrot){

        this.carrots.killAndHide(carrot);

        // disable from physics world
        this.physics.world.disableBody(carrot.body);
        
    }



}