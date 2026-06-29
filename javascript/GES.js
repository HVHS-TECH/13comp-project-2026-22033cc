console.log("hello! Welcome to my game")
//all universal constants
    const CANVAS_WIDTH = 500;
    const CANVAS_HEIGHT = 700;
    const LETTER_KEYS =['w','a','s','d','k','l'];
    const ARROW_KEYS=["up","left","down","right","z","x"];
    const PINK_EGG_SIZE =20;
    const PINK_EGG_START_POSITION =[250,300];
    const ENEMY_START_POSITION= 50;
    const BULLET_RECHARGE_TIME = 20;
    const BULLET_COLORS = ['#FFD23C','yellow','orange','white','#F3EEE2'];
    const WALL_THICKNESS = 2;
    const RAN_ARRAY = [-1,1];
    const BUTTON_POSITION=[250,250,250,300]
    const BUTTON_SIZE = [200,30,10]
    const ENEMIES_TO_FIRE = 10;
    
//all universal variables
    var score =0;
    //white Egg variables
    
    var whiteEggsFired  = 0;
    var whiteEggPosition=-200;
    //brown egg variables
    var brownEggsFired =0;
    var bombFinalPosition = 0;
    //bullets variables
    var bulletOutputSpeed = 10;
    var bulletSpeed = -15;
    var bulletPower = 100;
    var bulletRegain=0;
    //bombs variable
    var bombSpeed = -5;
    var bombActive = false;
    var pinkEggSpeed =2;
    var controls = LETTER_KEYS;
    //background variables
    var gameState = 'start';
    var enemyState = 0;
    var randomDraw = 0;
    var buttonOver = 1;
    var enemyCounter = 0;
    var firstDraw = 0;
    var randomTime = 0;
    //shrapnel varaibels
    var shrapnelAngle = -36;
    var shrapnelRotation = [4,7];
    var shrapnelTheta  = 0;
    var shrapnelA = 0;
    var shrapnelB = 0;
    var shrapnelTotal = 0;
    var shrapnelAngle = 0;
    //backgrounds
    var backgroundPlay;
    var backgroundStart;

    let highScore = 0;
/***********************************
 * set up
 ***********************************/
function setup(){
    //CANVAS_WIDTH = 500; CANVAS_HEIGHT=700
    //setting up the canvas
    cnv = new Canvas (CANVAS_WIDTH,CANVAS_HEIGHT,);
    displayMode('centered')
    //creating sprite for player
    pinkEgg = new Sprite(PINK_EGG_START_POSITION[0],PINK_EGG_START_POSITION[1],PINK_EGG_SIZE,'k');
    //making sure firstDraw is 0
    firstDraw = 0;
    //creating groups
    //players bombs and bullets
    bulletGroup = new Group();
    bombGroup = new Group();
    //bombs is seperate from sprite bomb, because you can not call a collsion of a sprite that does not exoist
    bombs = new Group();
    //enemy groups
    whiteEggGang = new Group();
    brownEggGang = new Group();
    brownBulletGang = new Group();
    //walls groups
    walls = new Group();
    allEggs = new Group();
    //startscreen and endscreen
    startScreenSprites = new Group();
    endScreenSprites = new Group();
    
    //make the walls for collisions
    wallBot = new Sprite(CANVAS_WIDTH/2,CANVAS_HEIGHT,CANVAS_WIDTH,   WALL_THICKNESS, "s");
	wallTop = new Sprite(CANVAS_WIDTH/2,0,CANVAS_WIDTH, WALL_THICKNESS, "s");
	wallRH = new Sprite(CANVAS_WIDTH,  CANVAS_HEIGHT/2, WALL_THICKNESS, CANVAS_HEIGHT, "s");
	wallLH = new Sprite(0,  CANVAS_HEIGHT/2, WALL_THICKNESS, CANVAS_HEIGHT, "s");
    //adding walls to wall group
    walls.add(wallTop);
    walls.add(wallBot);
    walls.add(wallRH);
    walls.add(wallLH);
    console.log(walls);

}
/*************************************
 * preload
 *************************************/
function preload(){
    //preload backgrounds
    backgroundPlay = loadImage("./assets/images/GES_assets/green_carton.png");
    backgroundStart = loadImage("./assets/images/GES_assets/normal_carton.png")
    logo = loadImage("./assets/images/GES_assets/titlecard.png");
}
/*************************************
 * draw loop
 *************************************/
function draw(){
    
    //defnine visuals and background
    pinkEgg.color = '#1ef730';
    whiteEggGang.color = 'white';
    brownEggGang.color = 'tan';

    background(backgroundStart)
    if (gameState=='start'){
        //setting up start screen
            
    fill("white")
    text("welcome to ",50,50)
    text("press enter to press a button!, press W and D to select. W is up, s is down.",50, 230);
    text("your HighScore is:"+highScore+" Points!",150,350);
    //create sprites on the first draw loop
    if (firstDraw == 0){
        //check users high score
        import("./GES_fb.mjs").then((module) => {
            highScorePromise = module.GES_checkHighScore().then((_RESULT)=>{
                console.log(_RESULT);
                highScore = _RESULT;
            })
            highScorePromise;
        });
        console.log(highScore);
        logoStart = new Sprite (250,150, 50,20,'n')
        logoStart.image= (logo);
        logoStart.scale = (0.6);
        buttonStart = new Sprite(BUTTON_POSITION[0],BUTTON_POSITION[1],BUTTON_SIZE[0],BUTTON_SIZE[1],'s');
        buttonStart.textsize = BUTTON_SIZE[2]
        buttonStart.text = 'start a game ';
        buttonControl = new Sprite(BUTTON_POSITION[2],BUTTON_POSITION[3],BUTTON_SIZE[0],BUTTON_SIZE[1],'s');
        buttonControl.textsize = BUTTON_SIZE[2];
        buttonControl.text = 'controls- hold enter button to see'
        indicator = new Sprite(140,300,10,'s')
        startScreenSprites.add(buttonStart);
        startScreenSprites.add(buttonControl);
        startScreenSprites.add(indicator);
        startScreenSprites.add(logoStart)
        startScreenSprites.color = 'white'
        firstDraw = 1;
    }
    //check if enter has been pressed
    buttonClicked();
        //switch the indicator if changed
        if (buttonOver== 1){
            //indicator next to controls
            indicator.y = 300;
        }else if (buttonOver==2){
            //indicator next to start
            indicator.y = 250;
        }
    
    } else if (gameState=='playing'){
    //game runing 
        background(backgroundPlay)
        //showing status of score and power level
        text("power-level"+bulletPower,50,100);
        text("score:"+score,50,50);
        //run code of current phase
        if (enemyState==1){
            phase1();
        }
        if (enemyState==2){
            phase2();
        }
        if (enemyState==3){
          phase3();
        }
        // run function for controls
        pinkEggControls()
        if(bombActive == true){
            bombCheck()
        }
        //collisions 
        bulletGroup.collides(allEggs,enemyHitBullet)
        pinkEgg.collides(allEggs,beginningOfTheEnd);
        wallBot.collides(whiteEggGang,allEggsRemover);
        wallLH.collides(brownEggGang,allEggsRemover);
        wallRH.collides(brownEggGang,allEggsRemover);
        walls.collides(brownBulletGang,allEggsRemover);
        bombGroup.collides(allEggs,enemyHitBullet);
        bombs.collides(allEggs,bombHitEnemy);
        
        bulletPowerCharge();

    } else if (gameState=='end'){
        //if the player loses
        background('red');
        //load button sprites
        if (firstDraw == 0){
            if (score > highScore){
                import("./GES_fb.mjs").then((module) => {
                    highScoreChangePromise = module.GES_changeHighScore(score).then((_RESULT)=>{
                        console.log(_RESULT);
                        highScore = _RESULT;
                    })
                highScoreChangePromise;
                });
            }
            
            pinkEgg.x = PINK_EGG_START_POSITION[0];
            pinkEgg.y = PINK_EGG_START_POSITION[1];
            buttonRestart = new Sprite(BUTTON_POSITION[0],BUTTON_POSITION[1],BUTTON_SIZE[0],BUTTON_SIZE[1],'s');
            buttonRestart.textsize = BUTTON_SIZE[2]
            buttonRestart.text = 'Restart game';
            buttonBack = new Sprite(BUTTON_POSITION[2],BUTTON_POSITION[3],BUTTON_SIZE[0],BUTTON_SIZE[1],'s');
            buttonBack.textsize = BUTTON_SIZE[2];
            buttonBack.text = 'back to Start Screen'
            indicator = new Sprite(140,300,10,'s')
            endScreenSprites.add(buttonBack);
            endScreenSprites.add(buttonRestart);
            endScreenSprites.add(indicator);
            endScreenSprites.color = 'white'
            buttonOver = 1;
            firstDraw = 1;
        }
        //define text
        text("Uh oh, you've been cracked!",50,100); 
        text("your score was "+score,50,200);
        text("your High score is "+highScore,50,235);
        text ('good job!',50,250)
        enemyState = 0;
    //call function to check if buttons are pressed
    endButtons();
        //switch the indicator if changed
        if (buttonOver== 1){
            //indicator next to controls
            indicator.y = 300;
        }else if (buttonOver==2){
            //indicator next to start
            indicator.y = 250;
        }

    }
    
   

}


/***********************************************
 * buttonClicked 
 * checking if button is being pressed
************************************************/
function buttonClicked(){
    //(buttonOver = 1)= controls; 
    //(buttonOver = 2)= start;

    //figure out what button the player is over
   if (kb.releases(controls[0])){
    //button up
    buttonOver++
   }

   if (kb.releases(controls[2])){
    //button down
    buttonOver = buttonOver-1;
   }

   if (buttonOver>2){
    buttonOver=1
   }
   if(buttonOver==0){
    buttonOver=2;
   }
    //show a thumbnail of the controls
    if(kb.pressing('enter')&&buttonOver==1){
            text("press WASD to move ", 50, 350);
            text("Press K to fire bullets",50,370);
            text("Press L to fire a bomb",50,390);
            text( "You are a GREEN Egg. The other eggs are jealous of your colour!",50,410)
            text("You need to fire back and rack up points!",50,430)
            text("watch out for your power level!",50,450)
        
    }
    //put game into playing screen
    if (kb.presses('enter')&&buttonOver==2){
            gameState ='playing';
            enemyState = 1;
            score = 0
            startScreenSprites.remove();
           }
}

/********************************************
 * endButtons()
 * buttons for the endscreen
 *********************************************/
function endButtons(){
    //(buttonOver = 1)= back to Start; 
    //(buttonOver = 2)= restart;
    //figure out what button the player is over
   if (kb.releases(controls[0])){
    //button up
    buttonOver++
   }
    
   if (kb.releases(controls[2])){
    //button down
    buttonOver = buttonOver-1;
    }
    
    if (buttonOver>2){
        buttonOver=1
    }

    if(buttonOver==0){
        buttonOver=2;
    }
    
    if(kb.presses('enter')&&buttonOver==1){
        // when button pressed, return to start screen
        gameState = 'start'
        firstDraw = 0;
        score = 0;
        endScreenSprites.removeAll();
        whiteEggsFired = 0
        whiteEggPosition = -200;
        powerLevel = 100;
        brownEggsFired = 0
    }

     if (kb.presses('enter')&&buttonOver==2){
    //if restart button pressed, restart game 
    gameState ='playing';
    enemyState = 1;
    firstDraw = 0;
    whiteEggsFired = 0;
    brownEggsFired = 0;
    whiteEggPosition = -200;
    powerLevel = 100;
    score = 0;
    endScreenSprites.removeAll();
    }
               
}

/**************************************************
 * beginningOfTheEnd())
 * return all movement to 0, remove almost all sprites
 *************************************************/

function beginningOfTheEnd(){
    //return all movement to 0; remove enemy sprites
    firstDraw = 0;
    gameState='end';
    allEggs.remove();
    whiteEggsFired = 0;
    whiteEggPosition = -200;
    bulletPower = 100;
    pinkEgg.vel.x = 0;
    pinkEgg.vel.y = 0;
    enemyState = 0;


}
/**************************************************
 * bulletPowerCharge()
 * check if player has run out of bullet power
 * recharge bullet power
 *************************************************/
function bulletPowerCharge(){
    //check if player has run out of bullet power 
    if (bulletPower<=0){
        text("WARNING! WARNING! NO ENERGY LEFT!",10,10)
        if(frameCount%100==0){
            bulletRegain=bulletRegain+1;  
        }

        if(frameCount%100==0&&bulletRegain==3){
            bulletPower=bulletPower+5;
        }
    //recharge if not the case
    }else if (frameCount%BULLET_RECHARGE_TIME==0 && 100>bulletPower){
        bulletPower=bulletPower+5;
        bulletRegain=0;
    
} 
}

/************************************************
 * phaseMachine()
 * a function to change the phases when the phase is finished
 ************************************************/
function phaseMachine(_enemysFired){
    console.log('changing phases'+enemyState);
    
    if (enemyState == 2 && _enemysFired>=10){
        if (frameCount%200==0){
            whiteEggSweep();
            if (frameCount%100==0){
                firstDraw = 0
                randomDraw = 0;
                enemyState = 3;
            }
            
        }
    }

    if (enemyState == 1 &&_enemysFired==ENEMIES_TO_FIRE){
        whiteEggSweep()
        console.log("finsihed the whiteEggSweep")
        enemyState = 2; 
        firstDraw = 0;
    }

}
/***************************************************
 * phase1()
 * the first phase, having white eggs falling down from outside to inside.
 **************************************************/
function phase1(){
    const enemysToFire = 10;
   //choose a random velocity 
    var enemyVelocity = random(4, 7);

    //decide when to fire
    if (enemysToFire > whiteEggsFired){

        if(frameCount%70==0){
            //move the starting position for white egg  
            if(whiteEggPosition>600){
                whiteEggPosition-=50;   
            } else {
                whiteEggPosition=whiteEggPosition+50; 
            }
            if(whiteEggPosition==(500-whiteEggPosition)){
                whiteEggPosition = whiteEggPosition+20;
            }
            //spawn 2 white eggs
            for (var doubles=0;doubles<2; doubles++){
                whiteEgg =  new Sprite(whiteEggPosition,50,PINK_EGG_SIZE,'d');
                whiteEgg.vel.y =(enemyVelocity);
                whiteEggGang.add(whiteEgg);
                allEggs.add(whiteEgg);
                enemyCounter= enemyCounter+1;
                whiteEggPosition = 500-whiteEggPosition;
            }
            whiteEggsFired++;
        }   
    }else if (enemysToFire == whiteEggsFired){
        phaseMachine(whiteEggsFired);
    }
}
/*******************************************************
 * phase2()
 * The second phase, introducing brown Eggs
 * *************************************************** */    
function phase2(){ 
    if (firstDraw == 0){
        brownEggsFired = 5;
        firstDraw = 1;
    }
    enemyVelocity = 4; 
    console.log(ENEMIES_TO_FIRE<brownEggsFired)
    console.log(brownEggsFired)
    const brownEggPosition= 50;
    if (frameCount%100==0 && ENEMIES_TO_FIRE>brownEggsFired){
        brownEgg = new Sprite(brownEggPosition,brownEggPosition,PINK_EGG_SIZE,'d');
        brownEgg.vel.x = (enemyVelocity);
        brownEggGang.add(brownEgg);
        allEggs.add(brownEgg);
        brownEggsFired++;
    }
   console.log("changes");
    if (frameCount%20==0){
                //fire bullets from brown eggs
                for(count=0;count<brownEggGang.length;count++){
                    brownBullet = new Sprite (brownEggGang[count].x,brownEggGang[count].y,10,10,'dynamic');
                    brownBullet.vel.y = 3;
                    brownBullet.color = BULLET_COLORS[Math.floor(Math.random()*5)];
                    allEggs.add(brownBullet);
                    brownBulletGang.add(brownBullet);
                }
    }

            if (ENEMIES_TO_FIRE==brownEggsFired){
                console.log("switch to randomTime")
                phaseMachine(brownEggsFired)
            } 

}
/********************************************************************
 * phase 3()
 * random time
 ********************************************************************/
function phase3(){
    if (randomDraw == 0){
        randomTime = Math.floor(Math.random()*4)  
        console.log(randomTime);
        console.log(randomTime);
        randomDraw = 1;
    }

    if (frameCount%70==0){
        console.log(randomTime)

        if (randomTime == 0||randomTime == 1 ){
            console.log("randomTime0")
            randomDraw = 2;
            whiteEggSweep();
            randomDraw = 0;
    
        }
        if (randomTime == 2||randomTime == 3){
            console.log("randomTime3")
            whiteEggPosition = 50;
            firstDraw = 0;
            randomDraw = 2;
            whiteEggHoming(16);
            randomDraw = 0;
        }
        if (randomTime == 4){
            randomDraw = 2;
            console.log("randomTime4")
            randomDraw = 0 ;
        }
    }   
}
/**************************************************
 * whiteEggSweep
 * a small total area attack that spawns a few eggs to fall down
 **************************************************/
function whiteEggSweep(){
    enemyVelocity = 4;
    whiteEggPosition =-50;
    console.log("sweepteststarting")
    for (count = 0; count<7;count++) { 
        console.log("sweeptest"+count)
            //move the starting position for white egg        
            if(whiteEggPosition>600){
                whiteEggPosition-=50;   
            } else {
                whiteEggPosition=whiteEggPosition+50; 
            }
            if(whiteEggPosition==500-whiteEggPosition){
                whiteEggPosition = whiteEggPosition-20;
            }
            //spawn 2 white eggs
            for (var double=0;double<2; double++){
                whiteEgg =  new Sprite(whiteEggPosition,50,PINK_EGG_SIZE,'d');
                whiteEgg.vel.y =(enemyVelocity);
                whiteEggGang.add(whiteEgg);
                allEggs.add(whiteEgg);
                enemyCounter= enemyCounter+1;
                whiteEggPosition = 600-whiteEggPosition;
            }

        }
        console.log("finished")
}
/***************************************************
 * whiteEggHoming (_whiteEggBatches)
 * attacks
 * shoot whiteEgg
 ***************************************************/
function whiteEggHoming(_whiteEggBatches){
    //
    if (firstDraw  == 0){
        //return sprites if previously used
        var whiteEggsFired = 0;
        firstDraw = 1;
    }

    if (frameCount%30 == 0 && _whiteEggBatches>whiteEggsFired){
        //create 4 eggs that home
        for (count = 0; count<4; count++){
            //move position
            if (whiteEggPosition<250){
                whiteEggPosition = CANVAS_WIDTH-whiteEggPosition;
            } else if(whiteEggPosition>250){
                whiteEggPosition = whiteEggPosition-CANVAS_WIDTH/2
            }
            //create eggs
            whiteEggHome = new Sprite (whiteEggPosition,20,PINK_EGG_SIZE,PINK_EGG_SIZE,'d')
            whiteEggGang.add(whiteEggHome);
            allEggs.add(whiteEggHome)
            //move towards pink egg
            whiteEggHome.moveTo(pinkEgg.x, pinkEgg.y, 3);
            whiteEggsFired= whiteEggsFired-1;
        } 
         if(_whiteEggBatches==whiteEggsFired){
        whiteEggGang.remove();
        return;
    }
}
};
/************************************************
 * enemyHitBullet(_bullet,_egg)
 * collider
 * removing bullet or enemy egg.
 ***********************************************/
function enemyHitBullet(_bullet,_egg){
    // check if player bullets hit enemy
    _bullet.remove();
    _egg.remove();
    score=score+100;
}
function bombHitEnemy(_bomb,_egg){
    _egg.remove();
    score = score+50;
}
/***********************************************
 * allEggsRemover(_walls,_eggs)
 * collider
 * remove _eggs
 ***********************************************/
function allEggsRemover(_walls,_eggs){
    _eggs.remove();
}


/*******************************************************************
 * pinkEggControls()
 * moves the pink egg if controls are pressed
 * ****************************************************************/
function pinkEggControls(){
    var xPress=0;
    var yPress=0;
    /* controls for x*/
    if (kb.pressing(controls[1])) {
        //left
        xPress= xPress-pinkEggSpeed;
    };
        
     if (kb.pressing (controls[3])) {
        //right
        xPress = xPress+pinkEggSpeed;
    };
    /* controls for y*/
    if (kb.pressing(controls[0])) {
        //up
        yPress= yPress-pinkEggSpeed;
    };
        
     if (kb.pressing (controls[2])) {
        //down
        yPress = yPress+pinkEggSpeed;

    };
 

    if(kb.pressing(controls[4])&&frameCount%bulletOutputSpeed==0&&bulletPower>0){
        //shoot
        bulletPower=bulletPower-5;
        shootBulletPink();
    }
    if(kb.presses(controls[5])&&bulletPower>50){
        //shoot bomb
        bulletPower = bulletPower-50;
        shootBomb();
    }
    pinkEgg.vel.x = xPress;
    pinkEgg.vel.y = yPress;

}
/******************************************************
 * shootBulletPink()
 * shoot pink Egg if K is pressed
 ****************************************************************/
function shootBulletPink(){
    //create sprite
    bullet = new Sprite (pinkEgg.x,pinkEgg.y,10,10,'k');
    bullet.color = BULLET_COLORS[Math.floor(Math.random()*5)];   
    bullet.vel.y=bulletSpeed;
    bulletGroup.add(bullet);
}
/***************************************************************
 * shootBomb()
 * create bomb for shoot
 ***************************************************************/
function shootBomb(){
    bomb = new Sprite(pinkEgg.x,pinkEgg.y,15,'k');
    bombs.add(bomb);
    bomb.color = BULLET_COLORS[0]
    bombFinalPosition = pinkEgg.y-100;
    bombActive = true;
    bomb.vel.y = bombSpeed;
}
/****************************************************************
 * bombCheck()
 * Check if bomb is ready to seperate into shrapnel
 * shoot shrapnel
 ****************************************************************/
function bombCheck(){
    if(bombFinalPosition==bomb.y){
            bombFinalPosition = 0;
            bomb.vel.y = 0;
            bomb.color = 'red'

    //making shrapnel
    shrapnelAngle = -126
        for(count=0;count<8;count++){
            shrapnel = new Sprite(bomb.x,bomb.y,10,10,'k');
            bombGroup.add(shrapnel);
            shrapnel.rotationSpeed = ((Math.random(shrapnelRotation*2))*Math.random(RAN_ARRAY));
            shrapnel.rotation = shrapnelAngle;
            shrapnelAngle = shrapnelAngle+36;
            //figure out the angles and how the shrapnel should move 
        if (shrapnelAngle>90){
            shrapnelTheta = shrapnelAngle-90;
        }else{
            shrapnelTheta = shrapnelAngle
        }
        //turn shrapnelTheta into radians
            shrapnelTheta = shrapnelTheta*Math.PI/180.0;
            shrapnelTheta = Math.tan(shrapnelTheta);
            shrapnelA = (shrapnelTheta*10)
            shrapnelB = 10
            //use shrapnelA and B to find velocity
            shrapnel.vel.x = -shrapnelA
            shrapnel.vel.y = -shrapnelB
        }
    bomb.remove();
    }
}