/***************************************************************/
// ops.mjs
// Written by Conor, Term 1 2026
// functions that preform operations to help with database manipulation 
// All variables & function begin with fb_  all const with FB_
/**************************************************************/
const COL_C = '#353536'; //console log colours
const COL_B = '#f542c8';

    console.log('%c other.mjs running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');

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

    /**************************************************************/
// EXPORT FUNCTIONS
// List all the functions called by code or html outside of this module
/**************************************************************/
export {
     op_checkProfile, op_checkStats,op_loginCheck,op_createLobby,op_readOpenLobbies,op_joinLobby
};

/***************************************************************
// function op_checkProfile(_UID)
// called when users stats need to be seen to create profile.
// uses read all on all the users general information, and return it. 
 ****************************************************************/
async function op_checkProfile(_UID){
    console.log('%c op_checkProfile running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    //check
    let profile = await fb_readAll("playerStatsUNI/"+_UID+"/")
    console.log(profile);
    console.log(profile.display_name);;
    return profile;
}
/***************************************************************
// function op_checkStats(_UID,_GAME)
// called when a certain games stats need to be called
// reads all of the users stats on a certain game and returns it.
 ****************************************************************/
async function op_checkStats(_UID,_GAME){
    console.log('%c op_checkStats running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    //check
    let profile = await fb_readAll("playerStats"+_GAME+"/"+_UID+"/","display_name")
    console.log(profile);
    console.log(profile.display_name);;
    return profile;
}
/***************************************************************
// function op_loginCheck(_UID)
// called if a user is already logged into the site from a previous visit
//  asks the user if they whwant to continue with the account they were previously logged intto
 ****************************************************************/
async function op_loginCheck(_UID){
    console.log('%c op_loginCheck running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    console.log(_UID);
    let userName = await fb_readRecord("playerStatsUNI/"+_UID+"/","display_name");
    console.log("user Name:"+userName);
    
// create title 
let loginContinue = document.createElement('p');
loginContinue.innerHTML = "you are currently signed in as "+userName+", would you like to continue with this account?";
document.getElementById("userCom").appendChild(loginContinue);

//create button to continue with accound
let loginChoiceYes =document.createElement('button');
loginChoiceYes.class = "Button";
loginChoiceYes.onclick = function op_signInYes(){
    console.log('%c op_signInYes running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');

           // Save data to sessionStorage
            sessionStorage.setItem("UID",_UID);
            sessionStorage.setItem("firstLanding",false);
            sessionStorage.setItem("userName",userName);
            window.location.assign("./menu.html");
}
loginChoiceYes.innerHTML = "yes!"
document.getElementById("userCom").appendChild(loginChoiceYes);

// create button to sign out
let loginChoiceNo = document.createElement('button')
loginChoiceNo.class = "Button";
loginChoiceNo.onclick = function op_signInNo(){
    console.log('%c op_signInNo running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    fb_logOut();
    console.log("logged out");
    let loggedOut = document.createElement('p');
    loggedOut.innerHTML = "you have been logged out of "+ userName;
    document.getElementById("userCom").appendChild(loggedOut);
    
}
loginChoiceNo.innerHTML = "No"
document.getElementById("userCom").appendChild(loginChoiceNo);

}
/***************************************************************
// function op_loginCheck(_UID)
// called when user clicks "create lobby"
//  creates a new branch under the users UID with the set up for a lobby.
 ****************************************************************/
async function op_createLobby(_UID,_GAME){
    console.log('%c op_createLobby running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
                let uuid = self.crypto.randomUUID();
                sessionStorage.setItem("UUID",uuid);

                console.log("uid"+_UID);
                console.log("game"+_GAME);
                let userName = sessionStorage.getItem("userName");
                console.log(userName);
        
                const LOBBY_SETUP = {
                    [_UID]:{
                        p1_name:userName,
                        guess:0,
                        score:0
                    },
                    lobby_open:true,
                    display_name:userName,
                    random_Num:0,
                    round:0,
                    score:0,

                }
                const LOBBY_PATH = "/lobbies/"+_GAME+"/"+uuid;
                fb_writeRecord(LOBBY_PATH,LOBBY_SETUP);
                if (_GAME == "GTN"){
                    op_createGTNScreen(userName);
                }
           
    }
/***************************************************************
// function op_killLobby(_UID)
// called when lobby host presses "remove lobby" OR the tab is deleted
// deletes branch under them.
 ****************************************************************/    
async function op_killLobby(){
    console.log('%c op)_createGTNScreen running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    fb_updateRecord()
    

}
/***************************************************************
// function op_createGTNScreen(_UID)
// called when user clicks "create lobby"
//  creates a new branch under the users UID with the set up for a lobby.
 ****************************************************************/    
async function op_createGTNScreen(_NAME){
    console.log('%c op)_createGTNScreen running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');


        //create header and 

        let buttonGuess = document.createElement('button');
        buttonGuess.innerHTML = "";
        buttonGuess.onclick = () => op_createLobby(userUid,game);
        document.getElementById("playerScreen").appendChild(buttonGuess);
        console.log("button fullly created.");
}
/***************************************************************
// function op_readOpenLobbies(_GAME)
// called when user lands on a game HTML page 
// checks what lobbies are open for that game, for buttons to be created for it.
 ****************************************************************/    
async function op_readOpenLobbies(_GAME,_CALLBACK){
    console.log('%c op_readOpenLobbies_running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';')
    
    // read all of the lobbies within the chosen game
    const LOBBIES = await fb_readRecord("lobbies/",_GAME);
    // check the lobby_open node to see if its open, and convert it into an array
    const OPEN_LOBBIES = Object.entries(LOBBIES).filter((_LOBBYCHECKED) => {
        return _LOBBYCHECKED[1].lobby_open == true;
    })
    console.log(OPEN_LOBBIES);
    
    _CALLBACK(OPEN_LOBBIES);
}

async function op_joinLobby(_GAME,_LOBBY){
    console.log('%c op_joinLobby_running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';')
}