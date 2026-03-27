/**************************************************************/
// fb_io.mjs
// Generalised firebase routines
// Written by Conor Church, Term 1 2026
//
// All variables & function begin with fb_  all const with FB_
// Diagnostic code lines have a comment appended to them //DIAG
/**************************************************************/
const COL_B = '#353536';
const COL_C = '#f542c8';

console.log('%c fb_io.mjs running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');

var fb_Db;
var userUid;
userUid = sessionStorage.getItem("UID");
console.log(userUid);
var userEmail;
var userPhoto;
var userName;

/**************************************************************/
// Import all external constants & functions required
/**************************************************************/
// Import all the methods you want to call from the firebase modules
import { initializeApp }
    from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

import { getDatabase }
    from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut }
    from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

import { ref, set, get, update, query, orderByChild, limitToFirst }
    from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
/**************************************************************/
// EXPORT FUNCTIONS
// List all the functions called by code or html outside of this module
/**************************************************************/
export {
    fb_initialise, fb_authenticate, fb_detectLoginChange, fb_logOut, fb_writeRecord, fb_readRecord,
    fb_readAll, fb_updateRecord, fb_read_sorted,fb_createAccount,returnUserUid
};


/***************************************************************
// function fb_intitialise()
// called by html button "fb_initialise()"
// intatilises connecting to firebase
 ****************************************************************/
function fb_initialise() {
    console.log('fb_initialise ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    const FB_GAMECONFIG = {
        apiKey: "AIzaSyBVWKOTOShkaWo4VevhGlPLN_YsdNH98So",
        authDomain: "comp-e16ea.firebaseapp.com",
        databaseURL: "https://comp-e16ea-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "comp-e16ea",
        storageBucket: "comp-e16ea.firebasestorage.app",
        messagingSenderId: "165553586665",
        appId: "1:165553586665:web:607df0b6514d45c9764b78"
    };
    const FB_GAMEAPP = initializeApp(FB_GAMECONFIG);
    fb_Db= getDatabase(FB_GAMEAPP);
    console.info(fb_Db); 
    sessionStorage.setItem("fBDB",fb_Db);        	

}

/***************************************************************
// function fb_authenticate()
//
//
 ****************************************************************/
async function fb_authenticate() {
    console.log('%c authenticate():',
        'color:' + COL_C +
        'background-color:' + COL_B + ';');
    const AUTH = getAuth(); 
    const PROVIDER = new GoogleAuthProvider();
    PROVIDER.setCustomParameters({
        prompt:'select_account'
    });
    //login to users email
    let result = await signInWithPopup(AUTH,PROVIDER);
    
    //signInWithPopup(AUTH, PROVIDER).then((result) => {
        document.getElementById("playertalk").style = "display:inline-block"
        document.getElementById("playertalk").innerHTML = "thank you for signing in correctly!"
        //take users uid, email, and photo url
        userUid = result.user.uid;
        userEmail = result.user.email;
        userPhoto = result.user.photoURL;
        console.log(userPhoto);
        console.log(userUid)
        const REF = ref(fb_Db, "uid")

        //see if they have logged in before:
        
        let resultName = await fb_readRecord("playerStatsUNI/"+userUid+"/","display_name");
        console.log
        console.log("their first name is "+resultName);
        userName = resultName;
        console.log(userName);
            //if they haven't, make them choose username
            if (userName == null){              
                document.getElementById("playertalk").innerHTML = "Seems like you haven't made an account yet, "
                document.getElementById("form").style = "display: inline-block"
            } else{    
            //display game links and such no that they are logged in 
            // the website redirects to menu page.
            console.log('%c fully logged in! ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
                
           // Save data to sessionStorage
            sessionStorage.setItem("UID",userUid);
            window.location.assign("/menu.html")
            }
        

}


/***************************************************************
// function fb_detectLoginChange()
//
//
 ****************************************************************/
function fb_detectLoginChange() {
console.log('%c fb_detectLoginChange ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');

}

/***************************************************************
// function fb_logOut()
// 
//
 ****************************************************************/
function fb_logOut() {
console.log('%c fb_authenticate ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
}

/***************************************************************
// function fb_writeRecord()
//
//
 ****************************************************************/
    function fb_writeRecord(_path,_data){
        console.log('%c fb_writeRecord ',
        'color: ' + COL_C +
        '; background-color: ' + COL_B + ';');
        console.log(_path);
        console.log(_data);
        
        const REF = ref(fb_Db,_path);
        set(REF,_data).then(() => {
            console.log('%c writing successful',
                'color: ' + COL_C +
                '; background-color: ' + COL_B + ';');
        })
            .catch((error) => {
                console.log(error);
                console.log('%c something went wrong! ',
                    'color: ' + COL_C +
                    '; background-color: ' + COL_B + ';');
        })
    }
/***************************************************************
// function fb_readRecord()
//
//
 ****************************************************************/
async function fb_readRecord(_path,_key,) {
    console.log('%c fb_readRecord running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    console.log(_path+_key);
    //define the path and key and read the record
    const dbReference= ref(fb_Db, _path+_key);
    let snapshot = await get(dbReference)
        // return data back.
        var fb_data = snapshot.val();
        console.log(fb_data);
        if (fb_data != null) {
            console.log("successful read");
            console.log(fb_data);
            return fb_data;
        } else {
            console.log('nothing here');
        }
}

/***************************************************************
// function fb_readAll()
//
//
 ****************************************************************/
async function fb_readAll(_path) {
    console.log('%c fb_readAll ',
                    'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    console.log(_path);
    //define path and read record 
    const dbReference= ref(fb_Db, _path);
    let snapshot = await get(dbReference)
    //get(dbReference).then((snapshot) => {
        var fb_data = snapshot.val();
        if (fb_data != null) {
            console.log(fb_data)
            return fb_data
        } else {
            console.log("node is empty");
        }
    /*}).catch((error) => {
        console.log(error)
    });*/
    

}

/***************************************************************
// function fb_updateRecord()
//
//
 ****************************************************************/
async function fb_updateRecord() {
    
}
/****************************************************************
 // function fb_read_sorted()
 //
 //
 ****************************************************************/

async function fb_read_sorted(){
    console.log('%c read sorted ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
 }

/****************************************************************
 // function fb_createAccount()
 //
 //
 ****************************************************************/
 async function fb_createAccount(){
    console.log('%c Fb_createAccount ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    //console log all values (remove later)

    let userForm = ["userName","userAge",,"userMovie"];
    let userFormReply =["Name","Age","Movie"];
    for (let i=0; i<6; i++){
        console.log(i);
        console.log((document.getElementById(userForm[i]).value));
        console.log(document.getElementById(userForm[i]).value);
        if (document.getElementById(userForm[i]).value == null||document.getElementById(userForm[i]).value == ""||document.getElementById(userForm[i]).value == undefined){
            console.log("nothing in this one")
            document.getElementsById("playertalk").innerHTML = "please choose your "+userFormReply[i]+"!";
            return
        };
    }
    //get all values from the site into variables
    let userName = document.getElementById('userName').value;
    let userAge = document.getElementById("userAge").value;
    let userCol = document.getElementById("userCol").value;
    let userMovie = document.getElementById("userMovie").value;
    let userHand = document.getElementById("userhandedness").value;
    let userShape = document.getElementById("userShape").value;
    
    console.log(userName+"is the chosen username")
    if (userName == null){
        console.log("balls")
        console.log(userName)
    }

    if(userName == null || userName == undefined || userName.trim() == ""||userName == ""){
        document.getElementById("playertalk").innerHTML =userName +" is an invalid user Name"
    }else{   
        if(userAge == null&& userAge == undefined&&userAge.trim() == ""&&userAge =="e"&&userAge == 120 && userAge <= 5){
            document.getElementById("playertalk").innerHTML ="please express your age as an interger rounded down & you must be between the ages 5-120"    
        }else{
            //creates nodes for display name, email, age, and photo URL (universal stats)        
            fb_writeRecord("/playerStatsUNI/"+userUid, {
                display_name: userName,
                email: userEmail,
                photo_URL: userPhoto,
                age: userAge,
                fav_colour:userCol,
                fav_movie:userMovie,
                handedness:userHand,
                shape:userShape,
            })
            //create nodes for playerstatsGTN
            fb_writeRecord("/playerStatsGTN/"+userUid,{
                wins:0,
                losses:0,
                winRate:0
            })
        }

    }
    document.getElementById("form").style = "display:none"
    document.getElementById("playertalk").innerHTML = "account successfully created! redirecting to menu..."
    //redirecting to menu....
    sessionStorage.setItem("UID",userUid);
   // window.location.assign("/menu.html")
            

}

//  <label for="num">Your Name,Please:</label>
//         <input type="text" id="userName" name="name" /><br>
//     <label for="userage"> your Age, Please </label>
//         <input type="number" id="userAge" name="userage" /><br>
//      <label for="usercol"> your favourite colour?: </label>
//         <input type="color" id="usercol" name="usercol" value="#00000" /><br>
//     <label for="userMovie"> your favourite movie?:</label>
//         <input type="text" id="userMovie" name="userMovie" /><br>
//     <button class="Button" onclick="fb_createAccount()">Create Account!</button>

/*<form>
        <p>What handedness are you? (there is only one correct answer)</p>
        <input type="radio" id="userLeftHand" name="handedness" value="Left">
            <label for="userLeftHand">Left handed</label><br>
        <input type="radio" id="userRightHand" name="handedness" value="Right">
            <label for="userRightHand">Right</label><br>
        <input type="radio" id="userambidextrous" name="handedness" value="Ambidextrous">
        <label for="javascript">ambidextrous</label>
    </form>*/
/***************************************************************
// function fb_readRecord()
//
//
 ****************************************************************/
async function returnUserUid(){
    return userUid;
}