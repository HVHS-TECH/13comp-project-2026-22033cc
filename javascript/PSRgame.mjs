/***************************************************************/
// PSRgame.mjs
// Written by Conor, Term 1 2026
// Guess the number game logic
// all functions prefixed by PSR_
/**************************************************************/
const COL_B = '#0d0d0d '; //console log colours
const COL_C = '#d92323';

    console.log('%c PSR.mjs running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
console.log("hello world");
const game = "PSR";
const PSR = ["Paper","Scissors","Rock"];

let gameState = "start";
let joined = false;
/***************************************************************/
// Import all external constants & functions required
/***************************************************************/
// Import all the constants & functions required from fb_io module
import { fb_initialise, fb_authenticate,fb_detectLoginChange,fb_logOut,fb_writeRecord,
    fb_readRecord,fb_readAll, fb_updateRecord, fb_read_sorted,fb_createAccount,returnUserUid,fb_valueChanged
    ,fb_changeOnDisconnect,
    fb_killRecord
 }
    from './fb_io.mjs';

    window.fb_initialise = fb_initialise;
    window.fb_authenticate = fb_authenticate;
    window.fb_detectLoginChange = fb_detectLoginChange;
    window.fb_logOut = fb_logOut;
    window.fb_writeRecord = fb_writeRecord;
    window.fb_readRecord = fb_readRecord;
    window.fb_readAll = fb_readAll;
    window.fb_updateRecord  = fb_updateRecord;
    window.fb_read_sorted = fb_read_sorted;
    window.fb_createAccount = fb_createAccount;
    window.returnUserUid = returnUserUid;
    window.fb_valueChanged = fb_valueChanged;
    window.fb_changeOnDisconnect = fb_changeOnDisconnect;
//Import all functions required from ops.mjs
import { op_checkProfile, op_checkStats, op_createLobby,op_readOpenLobbies,op_joinLobby,
 }
    from './ops.mjs';
    window.op_checkProfile = op_checkProfile;
    window.op_checkStats = op_checkStats;
    window.op_createLobby = op_createLobby;
    window.op_readOpenLobbies = op_readOpenLobbies;
    window.op_joinLobby = op_joinLobby;
let fb_Db = sessionStorage.getItem("FBDB");
let userUid = sessionStorage.getItem("UID");
let userProfile = await op_checkProfile(userUid);
let position = sessionStorage.getItem("position");
let LOBBYUUID = sessionStorage.getItem("lobby");
sessionStorage.setItem("InGame","true");
sessionStorage.setItem("lobbyUUID",LOBBYUUID);
let lobbyPath = "/lobbies/PSR/"+LOBBYUUID;
console.log(position);
console.log(LOBBYUUID);
let opponent;
let waitingText = {
    round:"waiting for opponent to answer",
    waiting:"calculating result..."
}
let round = 1;

document.getElementById("position").innerHTML = "You are the "+position+"!";
document.getElementById("playerTalk").innerHTML = "Waiting for a challenger..."

//ondisconnect function for when they disconnect...
console.log("run change on disconnect")
fb_changeOnDisconnect(lobbyPath+"/"+position+"_active",false);

//check if what user is.
if (position == "host"){
    opponent = "challenger";
    PSR_challengerWait();

    
} else { 
    opponent = "host";
    console.log(gameState);
    gameState = "round";
    // create users image and name
    document.getElementById("challengerName").innerHTML = userProfile.display_name;
    let challengerImage = document.createElement('img');
    challengerImage.src = userProfile.photo_URL;
    challengerImage.alt = "challenger picture";
    challengerImage.style.borderColor = userProfile.fav_colour;
    challengerImage.classList.add("profileImage");
    challengerImage.id = "userProfileIMG";
    document.getElementById("challengerImage").appendChild(challengerImage);
    //create hosts image and name 
    let lobby = await fb_readRecord(lobbyPath,"/");
    console.log(lobby);
    document.getElementById("hostName").innerHTML = lobby.host_display_name;
    let hostImage = document.createElement('img');
    hostImage.src = lobby.host_photo_URL;
    hostImage.alt = "host picture";
    hostImage.style.borderColor = lobby.fav_col;
    hostImage.classList.add("profileImage");
    hostImage.id = "userProfileIMG";
    document.getElementById("hostImage").appendChild(hostImage);
    fb_valueChanged(lobbyPath,null,PSR_gameFlow);
    
}
/***************************************************************
// function PSR_PSRchallengerWait(,)
// called creator is waiting for someone to join their lobby
// 
 ****************************************************************/    
async function PSR_challengerWait(){
    console.log('%c PSR_challengerWait running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';')
    gameState = "waitingJoin";
    fb_valueChanged(lobbyPath,null,PSR_gameFlow);
    //create users image and name.
    document.getElementById("hostName").innerHTML = userProfile.display_name;
    let hostImage = document.createElement('img');
    hostImage.src = userProfile.photo_URL;
    hostImage.alt = "host picture";
    hostImage.style.borderColor = userProfile.fav_colour;
    hostImage.classList.add("profileImage");
    hostImage.id = "userProfileIMG";
    document.getElementById("hostImage").appendChild(hostImage);
}
/***************************************************************
// function PSR_gameFlow (_DATA)
// Called every time that changes are made in the lobby. 
// 
 ****************************************************************/    
async function PSR_gameFlow(_DATA){
    console.log('%c PSR_hostGameflow running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    console.log(opponent);
    let opponentName = opponent +"_display_name";
    console.log(opponentName);
    console.log(_DATA.challenger_display_name);
    opponentName = _DATA[opponentName];
    console.log(opponentName);    
    console.log(gameState);
    //when challenger joins the lobby.
    if (gameState == "waitingJoin" &&_DATA.lobby_open == false){
        console.log('%c someone joined.',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
        let lobby = await fb_readRecord(lobbyPath,"/");

        // create challengers profile.
        document.getElementById("challengerName").innerHTML = lobby.challenger_display_name;
        let challengerImage = document.createElement('img');
        challengerImage.src = lobby.challenger_photo_URL;
        challengerImage.alt = "challenger picture";
        challengerImage.style.borderColor = lobby.fav_col;
        challengerImage.classList.add("profileImage");
        challengerImage.id = "userProfileIMG";
        document.getElementById("challengerImage").appendChild(challengerImage);
        PSR_onOpponentDisconnect(opponent);
        // create listeners for score table.
        const CHALLENGER_SCORE_PATH = lobbyPath + "/challenger_score";
        const HOST_SCORE_PATH = lobbyPath + "/host_score";
        fb_valueChanged(CHALLENGER_SCORE_PATH,null,(_SCORE)=>{
            document.getElementById("challengerScore").innerHTML = _SCORE;
        });
        fb_valueChanged(HOST_SCORE_PATH,null,(_SCORE)=>{
            document.getElementById("hostScore").innerHTML = _SCORE;
        });
        document.getElementById("playerTalk").innerHTML = "A challenger has appeared! Their name is " +opponentName;
        gameState = "round"
    }
    if (gameState =="nextRoundWaiting"){
        document.getElementById("nextRoundButton").remove();
        gameState = "round";
    }
    if (gameState == "guessed"){
        console.log(position+ "is changing to calculate")
        gameState = "calculate";
    }
    console.log(gameState);
    if (gameState == "round"){
        if (position == "challenger"){
            document.getElementById("playerTalk").innerHTML = "You are playing against "+opponentName+"!";
        }
        PSR_startRound();
    }else if (gameState == "guessing"){
        console.log('%c someone guessed.',
            'color: ' + COL_C + '; background-color: ' + COL_B + ';');
        //response on other side saying they guessed should be here.
        gameState = "guessed";
    }else if (gameState == "calculate"){
        if (position == "host"){
            PSR_hostCalculate(_DATA);
        }else if (position == "challenger"){
            console.log("challenger changing to wait");
            gameState = "waiting"
        }else{
            console.log("you shouldn't be seeing this!")
        }
    }else if (gameState == "waiting"){
        //checking if someone won.
        const CHALLENGER_SCORE = _DATA.challenger_score;
        console.log("challenger:"+CHALLENGER_SCORE);
        const HOST_SCORE = _DATA.host_score;
        console.log("host"+HOST_SCORE);
        if (CHALLENGER_SCORE == 3||HOST_SCORE == 3){
            gameState = "end";
        }
        console.log("waiting for next round...");
        PSR_nextRound(_DATA); 
    }else if (gameState == "waiting"&&_DATA.rematch == true){
    console.log(gameState);
    console.log("they want a rematch!");
    }else if (gameState == "end"){
        gameState = "rematch";
        PSR_Rematch(_DATA);
    }else if (gameState == "nextRound"){
        gameState = "nextRoundWaiting";
    }else if (gameState == "rematch"){
        gameState = "rematchSent";
        const OPPONENT_NAME = opponent+"_display_name"
        let rematchSent = document.createElement('span');
        rematchSent.innerHTML = _DATA[OPPONENT_NAME] +" sent a rematch request";
        document.getElementById("playerTalk").appendChild(rematchSent);
        
    }else if (gameState == "rematchSent"){
        gameState = "round";
        document.getElementById("playerScreen").innerHTML = "";
        if (position == "host"){
            fb_updateRecord(lobbyPath,{
                challenger_guess:"none",
                challenger_score:0,
                host_guess:"none",
                host_score:0
            })
        }
    }
}
/***************************************************************
// function PSR_STARTROUND(_LOBBYUUID,)
// creates user interface to play a round.
// 
 ****************************************************************/  
async function PSR_startRound(){
    console.log('%c start round running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    //create buttons
    for(let i =0; i<=2; i++){
        console.log(PSR[i]);
        let button = document.createElement('button');
        let image = document.createElement('img');
        button.id = "button"+PSR[i];
        button.onclick = () => PSR_selectAnswer(PSR[i]);
        button.innerHTML = PSR[i];
        button.classList.add("Button")
        image.src = "./assets/images/PSR_assets/PSR_"+PSR[i]+".png";
        image.alt = PSR[i];
        image.style.width = "100px"; 
        button.appendChild(image);
        document. getElementById("playerScreen").appendChild(button);

    }
    console.log("All answer buttons created.")
    gameState = "guessing";
    console.log(gameState);
}
/***************************************************************
// function PSR_selectAnswer(answer)
// puts the answer in the database.
// 
 ****************************************************************/  
async function PSR_selectAnswer(_ANSWER){
    console.log('%c selected '+_ANSWER+' ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    console.log(position);
    for(let i = 0; i<=2;i++){
        document.getElementById("button"+PSR[i]).remove();
    }
    //creates text for waiting
    let waitingTextElement = document.createElement('p');
    waitingTextElement.id = "waitingTextElement";
    waitingTextElement.innerHTML = "you selected " + _ANSWER + ".";
    document.getElementById("playerScreen").append(waitingTextElement);
    //defines which node to update;
    const GUESS_KEY = position +"_guess"
    await fb_updateRecord(lobbyPath,{[GUESS_KEY]:_ANSWER})
    console.log("answer guessed");
}


async function PSR_hostCalculate(_DATA){
    console.log('%c Calculating who won ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    const LOBBY_DATA = _DATA;
    const HOST_GUESS = LOBBY_DATA.host_guess;
    const CHALLENGER_GUESS = LOBBY_DATA.challenger_guess;
    console.log(HOST_GUESS);
    console.log(CHALLENGER_GUESS);
    console.log(LOBBY_DATA);
    if (HOST_GUESS == CHALLENGER_GUESS){
        console.log("it was a tie!");
        gameState = "waiting";
        await fb_updateRecord(lobbyPath,{tie:true});
    }else if ((HOST_GUESS == "Paper"&&CHALLENGER_GUESS =="Rock")||(HOST_GUESS=="Scissors"&&CHALLENGER_GUESS=="Paper")||(HOST_GUESS == "Rock"&&CHALLENGER_GUESS == "Scissors")){
        console.log("host won!");
        gameState ="waiting";
        const HOST_SCORE = LOBBY_DATA.host_score + 1;
        const HOST_NAME = LOBBY_DATA.host_display_name;
        console.log(HOST_SCORE);
        //update the lobby that host won, and their name, and increasing their score.
        await fb_updateRecord(lobbyPath,{
            host_score:HOST_SCORE,
            round_winner:HOST_NAME,
            round_winner_position:"host",
        });
    }else{
        console.log("Challenger Won!");
        gameState = "waiting";
        const CHALLENGER_SCORE = LOBBY_DATA.challenger_score + 1;
        const CHALLENGER_NAME = LOBBY_DATA.challenger_display_name;
        //update the lobby that challenger won, their name, and increasing their score
        await fb_updateRecord(lobbyPath,{
            challenger_score:CHALLENGER_SCORE,
            round_winner:CHALLENGER_NAME,
            round_winner_position:"challenger"
        });
    }
    round = round + 1;
}

async function PSR_Rematch(_DATA){
    gameState = "ready";
    //create rematch button.
    console.log(_DATA);
    let rematchButton = document.createElement('button');
    rematchButton.id = "rematchButton";
    rematchButton.classList.add("Button");
    rematchButton.onclick = () => {
    console.log("clicked rematch");
    let guess = position+"_guess";
    fb_updateRecord(lobbyPath, {
            [guess]:"rematch",
        })
    }
    rematchButton.innerHTML = "Request rematch";
    document.getElementById("playerScreen").appendChild(rematchButton);
    //create exit lobby button.
    let exitButton = document.createElement('button');
    exitButton.id = "exitButton";
    exitButton.classList.add("Button");
    exitButton.innerHTML = "exit Lobby";
    const position_active = position+"_active";
    exitButton.onclick = () => {
        fb_updateRecord(lobbyPath,{
            [position_active]:false,
        })
        window.location.assign("PSR.html");
    }
    document.getElementById("playerScreen").appendChild(exitButton);

    
}
async function PSR_nextRound(_DATA){
    console.log('%c next round  changed ',
        'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    let result = document.createElement('p');
    result.id = "result";
    if (_DATA.tie == true){
        result.innerHTML = "It was a Tie!";
    }else{
        console.log(_DATA);
        const WINNER_GUESS_FIELD = _DATA.round_winner_position + "_guess";
        console.log(WINNER_GUESS_FIELD);
        const WINNER_GUESS = _DATA[WINNER_GUESS_FIELD];
        console.log(WINNER_GUESS);
        result.innerHTML = _DATA.round_winner + " won this round by picking " + WINNER_GUESS + "!"
    }
    document.getElementById("playerScreen").innerHTML = "";
    document.getElementById("playerScreen").appendChild(result);
    
    // button to confirm next round.    
    if (gameState == "end"){
        PSR_gameFinish(_DATA);
        round = round
    } else {
        let nextRoundButton = document.createElement('button');
        nextRoundButton.id = "nextRoundButton";
        nextRoundButton.innerHTML = "Onto the Next round!"
        nextRoundButton.classList.add("Button");
        nextRoundButton.onclick = () => {
            console.log("clicked rematch");
            document.getElementById("nextRoundButton").style = "display:none"; 
            fb_updateRecord(lobbyPath, {
                challenger_guess:"none",
                host_guess:"none",
                tie:false,
                round:round,
                rematch:true
            })
        }
        document.getElementById("playerScreen").appendChild(nextRoundButton);
        gameState = "nextRound";    
    }
}

function PSR_ScoreChanged(_SCORE){
    console.log('%c score changed ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    console.log(_SCORE);


}

async function PSR_gameFinish(_DATA){
    console.log('%c game finish running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    //grab all things that we need to tell users and their stats.
    const HOST_SCORE = _DATA.host_score;
    const CHALLENGER_SCORE = _DATA.challenger_score;
    let playerStats = await fb_readRecord("/playerStats/PSR/",userUid);
    const USER_PATH = "/playerStats/PSR/"+userUid+"/"
        console.log ("host won!");
        if ((HOST_SCORE == 3 && position == "host")||(CHALLENGER_SCORE == 3 && position == "challenger")){
            //tell user that they won
            let result = document.createElement('p');
            result.id = "result"
            result.innerHTML = "You won! Adding win to your profile";
            document.getElementById("playerScreen").appendChild(result);
            //check if they are still their longest win streak
            if (playerStats.current_win_streak == playerStats.longest_win_streak){
                // update their record and their longest win streak
                fb_updateRecord(USER_PATH,{
                    wins:playerStats.wins+1,
                    current_win_streak:playerStats.current_win_streak+1,
                    longest_win_streak:playerStats.current_win_streak +1
                })
            }else{
                // update their record
                fb_updateRecord(USER_PATH,{
                    wins:playerStats.wins+1,
                    current_win_streak:playerStats.current_win_streak+1,
                })
            }
        }else{
             //tell user that they lost
            let result = document.createElement('p');
            result.id = "result"
            result.innerHTML = "You lost... Adding loss to your profile";
            document.getElementById("playerScreen").appendChild(result);  
            
            //update their record in the database
            fb_updateRecord(USER_PATH,{
                losses:playerStats.losses+1,
                current_win_streak:0
            });
        }
        PSR_Rematch(_DATA);
        gameState = "rematch";
}

    async function PSR_onOpponentDisconnect(_OPPONENT){
        const OPPONENT = _OPPONENT
        fb_valueChanged(lobbyPath+"/"+OPPONENT+"_active",null,(_DATA)=>{
            if (_DATA == false||_DATA == null){
                console.log(OPPONENT+" is offline");
                alert(OPPONENT+" disconnected....");
                fb_killRecord(lobbyPath);
                window.location.assign("PSR.html");
            }
        })
        fb_valueChanged(lobbyPath+"/"+position+"_active",null,(_DATA)=>{
            if (_DATA == false||_DATA == null){
                console.log("YOU went  offline");
                alert("you disconnected....");
                fb_killRecord(lobbyPath);
                window.location.assign("PSR.html");
            }
    })

    }