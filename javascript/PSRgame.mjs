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
let score = {
    host_score:0,
    challenger_score:0  
}

if (position == "host"){
    console.log("I am host man");
    PSR_challengerWait();
} else { 
    console.log("challenger");
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
async function PSR_challengerGameFlow(){
    console.log('%c PSR_hostGameflow running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
}
/***************************************************************
// function PSR_gameFlow (_DATA)
// Called every time that changes are made in the lobby. 
// 
 ****************************************************************/    
async function PSR_hostGameFlow(_DATA){
    console.log('%c PSR_hostGameflow running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');

    console.log(gameState);
    //checking if someone has joined 
    if (gameState == "state"){
        console.log("challengerwaiting");
        gameState ="round";
    }
    if (gameState == "waitingJoin" &&_DATA.lobby_open == false){
        console.log('%c someone joined.',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
        
                gameState = "round"
                PSR_startRound();
    }
    //if host is first to answer 
    if (gameState == "round"){
        // host has guessed
        console.log('%c host guessed.',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
        gameState = "waiting";
    
    }
    if (gameState == "waiting"){
        console.log('%c  guessed.',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
        PSR_hostCalculate();
    }

}
/***************************************************************
// function PSR_STARTROUND(_LOBBYUUID,)
// creates user interface to play a round.
// 
 ****************************************************************/  
function PSR_startRound(){
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
}
/***************************************************************
// function PSR_selectAnswer(answer)
// puts the answer in the database.
// 
 ****************************************************************/  
function PSR_selectAnswer(_ANSWER){
    console.log('%c selected '+_ANSWER+' ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    for(let i = 0; i<=2;i++){
        document.getElementById("button"+PSR[i]).remove();
    }
    //creates text for waiting
    let waitingTextElement = document.createElement('span');
    waitingTextElement.id = "waitingTextElement";
    waitingTextElement.innerHTML = "you selected" + _ANSWER + "."+ waitingText.gameState;
    //defines which node to update;
    const GUESS_KEY = position +"_guess"
    fb_updateRecord(lobbyPath,{[GUESS_KEY]:_ANSWER        
    })
}


function PSR_hostCalculate(){
    console.log('%c Calculating who won ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    const LOBBY = fb_readRecord(lobbyPath);
    const HOST_GUESS = LOBBY.host_guess;
    const CHALLENGER_GUESS = LOBBY.challenger_guess;
    if (HOST_GUESS == CHALLENGER_GUESS){
        fb_writeRecord(lobbyPath,{tie:true});
    }else if ((HOST_GUESS == "Paper"&&CHALLENGER_GUESS =="Rock")||(HOST_GUESS=="Scissors"&&CHALLENGER_GUESS=="Paper")||(HOST_GUESS == "Rock"&&CHALLENGER_GUESS == "Scissors")){
        console.log("host won!");
        gameState ="read";
        console.log(score.host_score);
        score.host_win++;
        console.log(score.host_score);
        fb_writeRecord(lobbyPath,{score});
    }else{
        console.log("Challenger Won!");
        gameState = "read";
        console.log(score.challenger_score);
        score.challenger_score++;
        console.log(score.challenger_score);
        fb_writeRecord(lobbyPath,{score});
    }
}