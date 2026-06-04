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
if (position == "host"){
    console.log("host host ");
    opponent = "challenger"
    PSR_challengerWait();
} else { 
    console.log("challenger");
    opponent = "host";
    console.log(gameState);
    gameState = "round";
    fb_valueChanged(lobbyPath,PSR_hostGameFlow);
    
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
    fb_valueChanged(lobbyPath,PSR_hostGameFlow);
}
/***************************************************************
// function PSR_gameFlow (_DATA)
// Called every time that changes are made in the lobby. 
// 
 ****************************************************************/    
async function PSR_hostGameFlow(_DATA){
    console.log('%c PSR_hostGameflow running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    console.log(opponent);
    const OPPONENT_GUESS = opponent+"_guess";
    console.log(OPPONENT_GUESS);
    
    
    console.log(gameState);
    //when challenger joins the lobby.
    if (gameState == "waitingJoin" &&_DATA.lobby_open == false){
        console.log('%c someone joined.',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
        const CHALLENGER_SCORE_PATH = lobbyPath + "/challenger_score";
        const HOST_SCORE_PATH = lobbyPath + "/host_score";
        fb_valueChanged(CHALLENGER_SCORE_PATH,PSR_ScoreChanged);
        fb_valueChanged(HOST_SCORE_PATH,PSR_ScoreChanged);
        document.getElementById("playerTalk").innerHTML = "A challenger has appeared!";
        gameState = "round"
    }
    if (gameState == "guessed"){
        console.log(position+ "is changing to calculate")
        gameState = "calculate";
    }
    console.log(gameState);
    if (gameState == "round"){
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
        console.log("running rematch");
            PSR_Rematch(_DATA);
    }else if (gameState == "waiting"&&_DATA.)
    console.log(gameState);
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
        button.id = "button"+PSR[i];
        button.onclick = () => PSR_selectAnswer(PSR[i]);
        button.innerHTML = PSR[i];
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
    let waitingTextElement = document.createElement('span');
    waitingTextElement.id = "waitingTextElement";
    waitingTextElement.innerHTML = "you selected" + _ANSWER + "."+ waitingText.gameState;
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
        await fb_updateRecord(lobbyPath,{tie:true});
    }else if ((HOST_GUESS == "Paper"&&CHALLENGER_GUESS =="Rock")||(HOST_GUESS=="Scissors"&&CHALLENGER_GUESS=="Paper")||(HOST_GUESS == "Rock"&&CHALLENGER_GUESS == "Scissors")){
        console.log("host won!");
        gameState ="waiting";
        const HOST_SCORE = LOBBY_DATA.host_score + 1;
        console.log(HOST_SCORE);
        await fb_updateRecord(lobbyPath,{host_score:HOST_SCORE});
    }else{
        console.log("Challenger Won!");
        gameState = "waiting";
        const CHALLENGER_SCORE = LOBBY_DATA.challenger_score + 1;
        console.log(CHALLENGER_SCORE);
        await fb_updateRecord(lobbyPath,{challenger_score:CHALLENGER_SCORE});
    }
    round = round + 1;
}

async function PSR_Rematch(_DATA){
    console.log("challenger is reading....");
    gameState = "ready";
    let rematchButton = document.createElement('button');
        button.id = "rematchButton";
        button.onclick = () => {
            console.log("clicked rematch");
            fb_updateRecord(lobbyPath, {
                challenger_guess:"none",
                host_guess:"none",
                round:round,
                rematch:true
            })
        }
        button.innerHTML = "Request rematch";
        document. getElementById("playerScreen").appendChild(button);
}

function PSR_ScoreChanged(_SCORE){
    console.log('%c challengerScoreChanged ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    console.log(_SCORE);

}

