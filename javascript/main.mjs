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
import { op_writingValue,op_checkProfile,op_loginCheck
 }
    from './ops.mjs';

    window.op_writingValue = op_writingValue;
    window.op_checkProfile = op_checkProfile;
    window.op_loginCheck = op_loginCheck;




fb_initialise();
let fb_Db = sessionStorage.getItem("FBDB");
console.log(fb_Db);
let userUid = sessionStorage.getItem("UID");
    console.log(userUid);

let currentPage = window.location.href;
console.log(currentPage);
fb_detectLoginChange();



/*if (currentPage == "http://127.0.0.1:5500/"||currentPage == "https://hvhs-tech.github.io/13comp-project-2026-22033cc/"){
    console.log("on index.html");
}else{
    console.log("not on index.html");
    let userUid = sessionStorage.getItem("UID");
    console.log("UID out yet?"+userUid);     
}*/
