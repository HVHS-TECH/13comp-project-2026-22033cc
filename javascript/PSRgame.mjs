/***************************************************************/
// PSRgame.mjs
// Written by Conor, Term 1 2026
// Guess the number game logic
// all functions prefixed by PSR_
/**************************************************************/
const COL_B = '#353536'; //console log colours
const COL_C = '#f542c8';

    console.log('%c PSR.mjs running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
console.log("hello world");
const game = "PSR";
import { createElement } from 'react';
const PSR = ["Paper","Scissors","Rock"];
/***************************************************************/
// Import all external constants & functions required
/***************************************************************/
// Import all the constants & functions required from fb_io module
import { fb_initialise, fb_authenticate,fb_detectLoginChange,fb_logOut,fb_writeRecord,
    fb_readRecord,fb_readAll, fb_updateRecord, fb_read_sorted,fb_createAccount,returnUserUid
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
//Import all functions required from ops.mjs
import { op_checkProfile, op_checkStats, op_createLobby,op_readOpenLobbies,op_joinLobby
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

// create user's screen
//let userPosition = sessionStorage.getItem("position");
//console.log(userPosition);
function psr_startRound(){
for(let i =0; i<=3; i++){
    console.log(PSR[i]);
}
let buttonScissor = createElement('button');

let buttonPaper = createElement('button');
let buttonRock = createElement('button');


let buttonGuess = document.createElement('button');
        buttonGuess.innerHTML = "";
        buttonGuess.onclick = () => op_createLobby(userUid,game);
        document.getElementById("playerScreen").appendChild(buttonGuess);
        console.log("button fullly created.");
}