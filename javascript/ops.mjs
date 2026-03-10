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
    op_writingValue, op_checkProfile
};

    function op_writingValue(){
    console.log("start converting");
    var write1 = document.getElementById("inputDatabase").value;
    var userUid = returnUserUid();
    console.log(userUid);
    var path = "user_Data/"+userUid+"/messages"
    console.log(path);
    console.log(write1);
    fb_writeRecord(write1,path);
}

async function op_checkProfile(_UID){
    console.log('%c op_checkProfile running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    //check
    let profile = await fb_readAll("playerStatsUNI/"+_UID+"/","display_name")
    console.log(profile);
    console.log(profile.display_name);;
}



