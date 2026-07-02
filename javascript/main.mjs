/***************************************************************/
// main.mjs
// Written by Conor, Term 1 2026
// Main entry for index.html
//
/**************************************************************/
const COL_B = '#353536'; //console log colours
const COL_C = '#f542c8';

    console.log('%c main.mjs running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
console.log("hello world");

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
import {op_checkProfile,op_loginCheck,op_createLobby
 }
    from './ops.mjs';

    window.op_checkProfile = op_checkProfile;
    window.op_loginCheck = op_loginCheck;
    window.op_createLobby = op_createLobby




    fb_initialise();
    let fb_Db = sessionStorage.getItem("FBDB");
    console.log(fb_Db);
    let userUid = sessionStorage.getItem("UID");
        console.log(userUid);
    sessionStorage.setItem("creatingAccount",false);
    let currentPage = window.location.href;
    console.log(currentPage);
    
    let firstLand = sessionStorage.getItem("firstLanding");
    if (firstLand == null){
        if (document.URL.includes("index.html")){
            console.log("on index.html");
            document.getElementById("login").style = "display:inline-block"
        }else{
            console.log("im on the wrong website! redirecting to index");
            window.location.assign("index.html");
        }
    }
    let isAdmin = await fb_readRecord("/playerStats/UNI/"+userUid+"/","isadmin");
    fb_detectLoginChange();
    console.log(isAdmin);
    if (isAdmin == true){
        let adminPageButton = document.createElement("button");
        adminPageButton.onclick = () =>{
            window.location.assign("admin.html");
        };
        adminPageButton.innerHTML = "admin Page";
        adminPageButton.classList.add("Button");
        document.getElementById("navBar").appendChild(adminPageButton);

    }
    let allUsers = await fb_readRecord("/playerStats/","UNI");
    allUsers = Object.entries(allUsers);

    for (let i = 0; i<allUsers.length; i++){
        let UID = allUsers[i][0];
        fb_writeRecord("/playerStats/PSR/"+UID+"/",{
            wins:0,
            losses:0,
            current_win_streak:0,
            longest_win_streak:0
        })
    }