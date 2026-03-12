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
import { op_writingValue,op_checkProfile
 }
    from './ops.mjs';
    

console.log("hello");
fb_initialise();
let fb_Db = sessionStorage.getItem("FBDB");
console.log(fb_Db);
let userUid = sessionStorage.getItem("UID");
console.log(userUid);

op_checkProfile(userUid);

window.op_writingValue = op_writingValue;
window.op_writingValue = op_checkProfile;

