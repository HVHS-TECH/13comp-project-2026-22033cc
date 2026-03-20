/***************************************************************/
// GTN.mjs
// Written by Conor, Term 1 2026
// Guess the number game logic
// all functions prefixed by GTN_
/**************************************************************/
const COL_B = '#353536'; //console log colours
const COL_C = '#f542c8';

    console.log('%c GTN.mjs running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
console.log("hello world");
const game = "GTN";
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
import { op_writingValue,op_checkProfile, op_checkStats
 }
    from './ops.mjs';
    window.op_writingValue = op_writingValue;
    window.op_checkProfile = op_checkProfile;
    window.op_checkStats = op_checkStats;

let fb_Db = sessionStorage.getItem("FBDB");
let userUid = sessionStorage.getItem("UID");

let userProfile = await op_checkProfile(userUid);
let userStats = await op_checkStats(userUid,game);
console.log(userStats.wins);

//create profile page 
let profileImage = document.createElement('img');
profileImage.src = userProfile.photo_URL;
profileImage.alt = "profile picture";
profileImage.style = "width: 50px; height: 50px"
document.getElementById("userProfileImage").appendChild(profileImage);


document.getElementById("userProfileName").innerHTML = "user name: "+userProfile.display_name
document.getElementById("userProfileAge").innerHTML = "age: "+userProfile.age
document.getElementById("userProfileWins").innerHTML = "Wins: "+userStats.wins
document.getElementById("userProfileLosses").innerHTML = "Losses: "+userStats.losses
document.getElementById("userProfileStreak1").innerHTML = "Current win streak: "+userStats.winStreakCurrent
document.getElementById("userProfileStreak2").innerHTML = "Longest win streak: "+userStats.winStreakLong






