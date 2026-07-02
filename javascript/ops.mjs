/***************************************************************/
// ops.mjs
// Written by Conor, Term 1 2026
// functions that preform operations to help with database manipulation 
// All variables & function begin with fb_  all const with FB_
/**************************************************************/
const COL_C = '#353536'; //console log colours
const COL_B = '#f542c8';

    console.log('%c ops.mjs running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');

/***************************************************************/
// Import all external constants & functions required
/***************************************************************/
// Import all the constants & functions required from fb_io module

import { fb_initialise, fb_authenticate,fb_detectLoginChange,fb_logOut,fb_writeRecord,
    fb_readRecord,fb_readAll, fb_updateRecord, fb_read_sorted,fb_createAccount,returnUserUid,
    fb_valueChanged
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
     op_checkProfile, op_checkStats,op_loginCheck,op_createLobby,op_readOpenLobbies,op_joinLobby,op_createLeaderboard
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
    let profile = await fb_readAll("playerStats/UNI/"+_UID+"/")
    console.log(profile);
    //puts all of the profile in sessionStorage if hasn't been done already
    console.log(sessionStorage.getItem('entireProfile')==undefined);
    if (sessionStorage.getItem('entireProfile')== undefined){
        sessionStorage.setItem("entireProfile",profile);
    }
    
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
    let profile = await fb_readAll("playerStats/"+_GAME+"/"+_UID+"/","display_name")
    console.log(profile);
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
    let userName = await fb_readRecord("playerStats/UNI/"+_UID+"/","display_name");
    console.log("user Name:"+userName);
    let creatingAccountCheck = sessionStorage.getItem("creatingAccount");
    console.log(creatingAccountCheck);
    if ((userName == undefined ||userName == null)&&(creatingAccountCheck =="false")){
        fb_logOut();
        document.getElementById("login").style = "display:inline-block";

    } else if (creatingAccountCheck == "false"){ 
        document.getElementById("login").style = "display:none";
        // create "do you want to sign in " element 
        let loginContinue = document.createElement('p');
        loginContinue.innerHTML = "you are currently signed in as "+userName+", would you like to continue with this account?";
        document.getElementById("userCom").appendChild(loginContinue);

        //create button to continue with accound
        let loginChoiceYes =document.createElement('button');
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
        loginChoiceYes.classList.add("Button")
        document.getElementById("userCom").appendChild(loginChoiceYes);

        // create button to sign out
        let loginChoiceNo = document.createElement('button')
        loginChoiceNo.class = "Button";
        loginChoiceNo.classList.add("Button")
        loginChoiceNo.onclick = function op_signInNo(){
            console.log('%c op_signInNo running ',
                        'color: ' + COL_C + '; background-color: ' + COL_B + ';');
            fb_logOut();
            console.log("logged out");
            document.getElementById("userCom").innerHTML = "";
            let loggedOut = document.createElement('p');
            loggedOut.innerHTML = "you have been logged out of "+ userName;
            document.getElementById("userCom").appendChild(loggedOut);
            sessionStorage.setItem("logOut",true);
            
        }
        loginChoiceNo.innerHTML = "No"
        document.getElementById("userCom").appendChild(loginChoiceNo);
    }else{
        console.log("user is creating account");
        document.getElementById("login").style = "display:none";
    }

}

/***************************************************************
// function op_create(_UID)
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
                //get users name and photo
                const USER_PROFILE = await op_checkProfile(_UID);
                const USER_NAME = USER_PROFILE.display_name;
                const USER_PHOTO_URL = USER_PROFILE.photo_URL;
                const USER_FAV_COL = USER_PROFILE.fav_colour;
    
                const LOBBY_SETUP = {
                    //lobby stats
                    lobby_open:true,
                    round:0,
                    //host stats
                    host_display_name:USER_NAME,
                    host_photo_URL:USER_PHOTO_URL,
                    host_fav_col:USER_FAV_COL,
                    host_guess:"none",
                    host_score:0,
                    host_UID:_UID,
                    host_active:true,
                    //challenger stats
                    challenger_display_name:"none",
                    challenger_photo_URL:"none",
                    challenger_fav_col:"none",
                    challenger_guess:"none",
                    challenger_score:0,
                    challenger_UID:_UID,
                    challenger_active:false,
                    rematch: false,
                    tie:false,
                    round_winner:"none",
                    round_winner_position:"none"
                }
                const LOBBY_PATH = "/lobbies/"+_GAME+"/"+uuid;
                fb_writeRecord(LOBBY_PATH,LOBBY_SETUP);
                //
                if (_GAME == "PSR"){
                    sessionStorage.setItem('lobby',uuid);
                    sessionStorage.setItem('position','host');
                    window.location.assign("PSRscreen.html");
                }
           
    }
/***************************************************************
// function op_killLobby(_UID)
// called when lobby host presses "remove lobby" OR the tab is deleted
// deletes branch under them.
 ****************************************************************/    
async function op_killLobby(){
    console.log('%c op)_createPSRScreen running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    const pathLobby =
    fb_updateRecord(_PATH);
    

}
/***************************************************************
// function op_createPSRScreen(_UID)
// called when user clicks "create lobby"
//  creates a new branch under the users UID with the set up for a lobby.
 ****************************************************************/    
async function op_createPSRScreen(_NAME){
    console.log('%c op)_createPSRScreen running ',
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
    let openLobbies = "pizzas";
    //put listener on the entire lobbies node. Whenever it runs, check if its open, then converts into an array
    fb_valueChanged("lobbies/"+_GAME+"/",null,(LOBBIES)=> {
        console.log("lobby status has changed!")
        openLobbies = Object.entries(LOBBIES).filter((_LOBBYCHECKED) => {
            return _LOBBYCHECKED[1].lobby_open == true;
        })
        console.log(openLobbies);
        _CALLBACK(openLobbies);
    })
    
}
    
/***************************************************************
// function op_joinLobby(_GAME,LOBBY)
// called when user clicks "join" button on at GTN.HTML 
// 
 ****************************************************************/    
async function op_joinLobby(_GAME,_LOBBYUUID,_CALLBACK){
    console.log('%c op_joinLobby_running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';')
    //get user stats
    console.log(_LOBBYUUID);
    const UID = sessionStorage.getItem("UID")
    const USER_PROFILE = await op_checkProfile(UID);
    const USER_NAME = USER_PROFILE.display_name;
    const USER_PHOTO_URL = USER_PROFILE.photo_URL;
    const USER_FAV_COL = USER_PROFILE.fav_colour;
    //update lobby
    const path = "/lobbies/"+_GAME+"/"+_LOBBYUUID+"/";
    fb_updateRecord(path,{
        challenger_display_name:USER_NAME,
        challenger_photo_URL:USER_PHOTO_URL,
        challenger_fav_col:USER_FAV_COL,
        challenger_active:true,
        lobby_open:false,
    })
    sessionStorage.setItem("position","challenger")
    _CALLBACK(_GAME,_LOBBYUUID);   
}
/***************************************************************
// function op_createLeaderboard(_GAME,)
// called when user clicks "join" button on at GTN.HTML 
// 
 ****************************************************************/    
async function op_createLeaderboard(_GAME,_SORTKEY,_CALLBACK){
    console.log('%c create leaderboard running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    console.log(_GAME);
    console.log(_SORTKEY);
    const SORT_KEY = _SORTKEY
    
    // run Read sorted on the score node to find ordered amount. 
    let playerSorted = await fb_read_sorted("/playerStats/"+_GAME+"/",_SORTKEY);
    console.log(playerSorted);
    // read all of the lobbies within the chosen game
    try{
        for (let i = 0; i<9; i++){
            const UID = playerSorted[i][0]
            console.log(UID);
            let displayName = await fb_readRecord("/playerStats/UNI/"+UID+"/","display_name");
            console.log(displayName);
            let leaderboardRow = document.createElement('tr');
            let leaderboardName = document.createElement('td');
            let leaderboardScore = document.createElement('td');

            leaderboardName.innerHTML = displayName;
            console.log(_SORTKEY);
            console.log(playerSorted[i][1]);
            console.log(playerSorted[i][1][SORT_KEY]);
            leaderboardScore.innerHTML = playerSorted[i][1][SORT_KEY];
            document.getElementById("leaderboard"+_GAME).append(leaderboardRow,leaderboardName,leaderboardScore);
        }
    }catch{
        for (let i = 0; i<10; i++){            
            let leaderboardRow = document.createElement('tr');
            let leaderboardName = document.createElement('td');
            let leaderboardScore = document.createElement('td');
            leaderboardName.innerHTML = "server is offline at the moment.";
            document.getElementById("leaderboard"+_GAME).append(leaderboardRow,leaderboardName,leaderboardScore);
    }
    
    }
    document.getElementById("leaderboard"+_GAME).style = "display:inline-block";
    document.getElementById("playButton"+_GAME).style = "display:inline-block";
    console.log("function finished");
    _CALLBACK("GES","high_score",()=>{
        console.log("leaderboards finsihed")
    });
}
