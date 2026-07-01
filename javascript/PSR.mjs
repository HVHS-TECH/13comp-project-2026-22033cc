/***************************************************************/
// PSR.mjs
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
/***************************************************************/
// Import all external constants & functions required
/***************************************************************/
// Import all the constants & functions required from fb_io module
import { fb_initialise, fb_authenticate,fb_detectLoginChange,fb_logOut,fb_writeRecord,
    fb_readRecord,fb_readAll, fb_updateRecord, fb_read_sorted,fb_createAccount,returnUserUid,fb_killRecord 
    ,fb_changeOnDisconnect
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
    window.fb_changeOnDisconnect = fb_changeOnDisconnect;
//Import all functions required from ops.mjs
import { op_checkProfile, op_checkStats, op_createLobby,op_readOpenLobbies,op_joinLobby, op_createLeaderboard
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
let userStats = await op_checkStats(userUid,game);;

//create profile page 
let profileImage = document.createElement('img');
profileImage.src = userProfile.photo_URL;
profileImage.alt = "profile picture";
profileImage.id = "userProfileIMG";
profileImage.classList.add("profileImage");
profileImage.style.borderColor = userProfile.fav_colour;
document.getElementById("userProfileImage").appendChild(profileImage);
sessionStorage.setItem("userName",userProfile.display_name);

document.getElementById("userProfileName").innerHTML = "User name: "+userProfile.display_name
document.getElementById("userProfileWins").innerHTML = "Wins: "+userStats.wins
document.getElementById("userProfileLosses").innerHTML = "Losses: "+userStats.losses
document.getElementById("userProfileStreak1").innerHTML = "Current win streak: "+userStats.current_win_streak
document.getElementById("userProfileStreak2").innerHTML = "Longest win streak: "+userStats.longest_win_streak

// create buttons to create lobby

let buttonCreateLobby = document.createElement('button');
buttonCreateLobby.innerHTML = "creating lobby";
buttonCreateLobby.classList.add("Button");
buttonCreateLobby.onclick = () => op_createLobby(userUid,game);
document.getElementById("buttonLobby").appendChild(buttonCreateLobby);
console.log("button fullly created.");

// create buttons to join lobby
op_readOpenLobbies("PSR",( (_LOBBIES) => {
    console.log(_LOBBIES);
    let tBody = document.getElementById("lobbyJoin")
    tBody.replaceChildren()
    //create buttons to join lobby
    for (let i = 0; i < _LOBBIES.length;i++){
        //create Elements 
        let lobbyRow = document.createElement('tr');
        let lobbyName = document.createElement('td');
        let lobbyButton1 = document.createElement('td');
        let lobbyButton2 = document.createElement('button');
        //change the insides of these elements to match hosts name and redirect them.
        lobbyName.innerHTML = _LOBBIES[i][1].host_display_name;
        lobbyButton2.classList.add("Button")
        const LOBBYUUID = _LOBBIES[i][0];
        lobbyButton2.onclick = ()=> op_joinLobby("PSR",LOBBYUUID,psr_Redirect);    
        lobbyButton2.innerHTML = "Join!";
            
        lobbyButton1.appendChild(lobbyButton2);
        document.getElementById("lobbyJoin").append(lobbyRow,lobbyName,lobbyButton1);
    }
    }));

  

function psr_Redirect(_GAME,_LOBBYUUID){
    console.log('%c op) psr_Redirect running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';')
    console.log(_LOBBYUUID);
    sessionStorage.setItem("lobby",_LOBBYUUID);
    sessionStorage.setItem('position',"challenger");
    window.location.assign("PSRscreen.html");
    
}
if(sessionStorage.getItem("InGame") !== null){
    let UUID = sessionStorage.getItem("lobbyUUID");
    let position = sessionStorage.getItem("position");
    const active = position+"_active";
    fb_updateRecord("/lobbies/"+UUID+"/",{
        [active]:false,
    })
    sessionStorage.removeItem("InGame");
    sessionStorage.removeItem("lobbyUUID");
}