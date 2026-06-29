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

import { ref, set, get, update, query, onValue, orderByChild, limitToFirst,limitToLast}
    from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
/**************************************************************/
// Import functions from op.mjs
// /**************************************************************/
import { op_loginCheck
 }
    from './ops.mjs';

    window.op_loginCheck = op_loginCheck;


/**************************************************************/
// EXPORT FUNCTIONS
// List all the functions called by code or html outside of this module
/**************************************************************/
export {
    fb_initialise, fb_authenticate, fb_detectLoginChange, fb_logOut, fb_writeRecord, fb_readRecord,
    fb_readAll, fb_updateRecord, fb_read_sorted,fb_createAccount,returnUserUid, fb_killRecord,fb_valueChanged,
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
    sessionStorage.setItem("FBDB",fb_Db);        	

}

/**************************************************************
// function fb_authenticate()
//
//
 ****************************************************************/
async function fb_authenticate() {
    console.log('%c authenticate running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    sessionStorage.setItem("creatingAccount",true);
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
        const REF = ref(fb_Db, "uid");
        //see if they have logged in before:
        let resultName = await fb_readRecord("playerStats/UNI/"+userUid+"/","display_name");
        console.log("their first name is "+resultName);
        console.log(resultName);
        sessionStorage.setItem("NAME",resultName);
            //if they haven't, make them choose usernamed
            if (resultName == null){     
                sessionStorage.setItem("creatingAccount",true);
                document.getElementById("login").style = "display:none";  
                document.getElementById("playertalk").innerHTML = "Seems like you haven't made an account yet, "
                document.getElementById("userCom").style = "display:none";
                document.getElementById("login").style = "display:none";
                document.getElementById("form").style = "display: inline-block";
                sessionStorage.setItem("accountAvailable",false);
                
            }else{    
            //display game links and such no that they are logged in 
            // the website redirects to menu page.
            console.log('%c fully logged in! ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
            
           // Save data to sessionStorage
            sessionStorage.setItem("UID",userUid);
            sessionStorage.setItem("firstLanding",false);
            sessionStorage.setItem("userName",userName);
            sessionStorage.setItem("creatingAccount",false);
            window.location.assign("menu.html");
            }
        

}

/***************************************************************
// function fb_logOut()
// 
//
 ****************************************************************/
async function fb_logOut() {
console.log('%c fb_logOut ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    const AUTH = getAuth();
    signOut(AUTH).then(() => {
        console.log("successfully signed out");
    })
    .catch((error) => {
        console.log("NOT LOGGED OUT");
        console.log(error)
    });
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
    //define path and read record.
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
async function fb_updateRecord(_path,_data){
        console.log('%c fb_updateRecord ',
        'color: ' + COL_C +
        '; background-color: ' + COL_B + ';');
        console.log(_path);
        console.log(_data);
        const REF = ref(fb_Db,_path);
        update(REF,_data).then(() => {
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
/****************************************************************
 // function fb_read_sorted()
 //
 //
 ****************************************************************/

async function fb_read_sorted(_PATH, _SORTKEY){
    console.log('%c read sorted ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');

    const SORTKEY = _SORTKEY;
    console.log(_SORTKEY)
    console.log(_PATH);
    return new Promise((resolve, reject) => {
        const dbReference = query(ref(fb_Db,_PATH), orderByChild(_SORTKEY), limitToFirst(100))
        get(dbReference).then((snapshot) => {
            var fb_data = snapshot.val();
            console.log(fb_data);
            if (fb_data != null) {
            let playerSorted = Object.entries(fb_data).sort((a,b)=>{return b[1][_SORTKEY] - a[1][_SORTKEY]});
            console.log(playerSorted);
            playerSorted = playerSorted.splice(0,10);
            console.log(playerSorted);
            console.log("hello?");
            resolve(playerSorted);
            } else {
                console.log("something went wrong")
                resolve("failed")

            }

        }).catch((error) => {
            console.log(error)
            reject(error)
        })
    })
    

 }
/****************************************************************
 // function fb_killRecord()
 //
 //
 ****************************************************************/

async function fb_killRecord(){
    console.log('%c killRecord ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
 }


/****************************************************************
 // function fb_createAccount()
 // runs when the user authenticates but isn't signed in
 // checks if their answer on the HTML Fourms is valid and then
 // writes it under their uid on the database
 ****************************************************************/
 async function fb_createAccount(){
    document.getElementById("playertalk").style = "display:none";
    console.log('%c Fb_createAccount ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    //console log all values (remove later)
    let userForm = ["userName","userAge","userMovie"];
    let userFormReply = ["Name","Age","Movie"];
    
    //get all values from the site into variables
    let userName = document.getElementById('userName').value;
    console.log("username"+userName);
    let userAge = document.getElementById("userAge").value;
    console.log("userAge"+userAge);
    let userCol = document.getElementById("userCol").value;
    console.log("usercol"+userCol);
    let userMovie = document.getElementById("userMovie").value;
    console.log("usermovie"+userMovie);
    let userHand = document.getElementById("userHand").value;
    console.log("userhandedness"+userHand);
    let userShape = document.getElementById("userShape").value;
    console.log("usershape"+userShape);
    // create booleans based on validations
     let validationsList  = [
        (userName == null),// users name is null
        (userName.trim() == ""), //username is equal to spaces or empty
        (userName.length <= 5), // username is less than 5 characters
        (userName.length >= 20), // username is more than 20 characters
        (userAge == null), //users age is null
        (userAge == ""), // users age is equal to spaces or empty
        (userAge <= 5), // user age is less than 5
        (userAge > 120), //users age is more than 120
        (userMovie.trim() == ""), // user's favourite movie is equal to spaces ore empty.
        (userMovie.length>=180)// user favourite movie is more than 120 characters
]
    //create messages for valdiations.
    let validationsListMessage = [
            "Name is null, you shouldn't be seeing this",
            "Name is empty", //username is equal to spaces or empty
            "must be more than 5 characters",// username is less than 5 characters
            "Name must be less than 20 characters",// username is more than 20 characters
            "Age is null, you hsouldn't be seeing this",
            "Age is empty",// users age is equal to spaces or empty
            "You must be more than 5 years to join my website game! You're too young! Go outside!",// user age is less than 5
            "You must be less than 120 years old to join my website game!", //users age is more than 120
            "Movie is Empty",// user's favourite movie is equal to spaces ore empty
            "Movie name must be less than 180 characters long."// user favourite movie is more than 120 characters
        ]
    //create booleans for validation to argue against.
    console.log(validationsList);
    let validationclear = 0;
    for (let i = 0; i < validationsList.length; i++){
        if (validationsList[i] == true){
            console.log(validationsListMessage[i]);
            let message = document.createElement('p');
            message.innerHTML = validationsListMessage[i];
            console.log(message.innerHTML);
            document.getElementById("validationError").appendChild(message);
            validationclear = validationclear+1;
        }
    }
    document.getElementById("validationError").style = "display:inline"
    //check if they pass all validation (valdiationClear equals 0 if there is no issues)
    if (validationclear == 0){
            //creates nodes for display name, email, age, and photo URL (universal stats)        
            fb_writeRecord("/playerStats/UNI/"+userUid, {
                display_name: userName,
                email: userEmail,
                photo_URL: userPhoto,
                age: userAge,
                fav_colour:userCol,
                fav_movie:userMovie,
                handedness:userHand,
                shape:userShape,
                isadmin:false,
            })
            //create nodes for playerstatsPSR
            fb_writeRecord("/playerStats/PSR/"+userUid,{
                wins:0,
                losses:0,
                current_win_streak:0,
                longest_win_streak:0
            })
            fb_writeRecord("playerStats/PSR/"+userUid,{
                high_score:0
            })
        document.getElementById("form").style = "display:none";
        document.getElementById("playertalk").innerHTML = "account successfully created! redirecting to menu..."
        //redirecting to menu....
        sessionStorage.setItem("UID",userUid);
        sessionStorage.setItem("firstLanding",false);
        window.location.assign("menu.html");
    }           
}

/***************************************************************
// function fb_detectLoginChange()
// 
//
 ****************************************************************/

async function fb_detectLoginChange() {
console.log('%c Fb_detectLoginChange ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    const AUTH = getAuth();
    let currentPage = window.location.pathname;
    console.log(currentPage);
    //runs when user's auth changes.
    onAuthStateChanged(AUTH,(user) => {
    if (user){
        console.log("user is signed in");
        let userUid = user.uid;
        console.log(userUid);
        op_loginCheck(userUid);
    }else{
        //user is not logged in
        console.log("he ain't logged in!");
        let firstLand = sessionStorage.getItem("firstLanding");
        console.log(firstLand);
        if (firstLand == null){
            if (document.URL.includes("index.html")){
                console.log("on index.html");
                document.getElementById("login").style = "display:inline-block"
            }else{
            console.log("im on the wrong website! redirecting to index");
            window.location.assign("index.html");
            }
        } else{
            if (document.URL.includes("index.html")){
            console.log("not firstLanding");
            op_loginCheck(userUid)
            }
        }
    }
    
    }, (error) =>{
        console.log("ERROR")
        console.log(error);
    });
}

/***************************************************************
// function 
//
//
 ****************************************************************/
async function returnUserUid(){
    return userUid;
}

/***************************************************************
// function 
//
//
 ****************************************************************/
    async function fb_valueChanged(_PATH,_ORDERKEY,_CALLBACK,){
        console.log('%c fb_valueChanged ',
                    'color: ' + COL_C + '; background-color: ' + COL_B + ';');
        console.log(_PATH);
        console.log(_ORDERKEY);
        let dbQuery; 
        if (_ORDERKEY == null){
            dbQuery = ref (fb_Db, _PATH);
            console.log(dbQuery);
        }else{
            dbQuery = query(ref(fb_Db,_PATH), orderByChild(_ORDERKEY));
        }
        console.log(dbQuery);
        onValue(dbQuery,(snapshot)=>{
            const DATA = snapshot.val();
            console.log(DATA);
            if (DATA != null){
                _CALLBACK(DATA);
            }
        })
    }

