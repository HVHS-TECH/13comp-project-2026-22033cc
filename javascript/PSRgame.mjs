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
let LOBBYUUID = sessionStorage.getItem("lobby")
console.log(position);
console.log(LOBBYUUID);


if (position == "host"){
    console.log("I am host man");
    PSR_joinerWait();
} else { 
    console.log("joiner");
}
/***************************************************************
// function PSR_PSRJoinerWait(,)
// called creator is waiting for someone to join their lobby
// 
 ****************************************************************/    
async function PSR_joinerWait(){
    console.log('%c PSR_joinerWait running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    gameState = "waiting";
                
    fb_valueChanged("/lobbies/PSR/"+LOBBYUUID,PSR_gameFlow);
}
async function PSR_gameFlow(_DATA){
    console.log('%c PSR_GAmeflow running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    console.log(gameState)
    if (gameState = "waiting"){
        console.log('%c  waiting for someone to join',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
        console.log()
    }else if (gameState)

}
/***************************************************************
// function PSR_STARTROUND(_LOBBYUUID,)
// creates user interface to play a round.
// 
 ****************************************************************/  
function PSR_startRound(){
    console.log ("PSR START ROUND");
for(let i =0; i<=3; i++){
    console.log(PSR[i]);
}
// create buttons
let buttonScissor = document.createElement('button');
let buttonPaper = document.createElement('button');
let buttonRock = document.createElement('button');

let buttonGuess = document.createElement('button');
        buttonGuess.innerHTML = "";
        buttonGuess.onclick = () => op_createLobby(userUid,game);
        document.getElementById("playerScreen").appendChild(buttonGuess);
        console.log("button fullly created.");
}
