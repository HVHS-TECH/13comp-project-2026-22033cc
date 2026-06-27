/***************************************************************/
// profile.mjs
// Written by Conor, Term 1 2026
// logic for the profile page. 
/**************************************************************/
const COL_B = '#353536'; //console log colours
const COL_C = '#f542c8';

    console.log('%c GTN.mjs running ',
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
const game = ["PSR","OXY"];

const PROFILEPIC = "150px";
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
import { op_checkProfile, op_checkStats
 }
    from './ops.mjs';
    window.op_checkProfile = op_checkProfile;
    window.op_checkStats = op_checkStats;

let fb_Db = sessionStorage.getItem("FBDB");
let userUid = sessionStorage.getItem("UID");

    //get users stats from database
    let userProfile = await op_checkProfile(userUid);
    let userStats = await op_checkStats(userUid,game[0]);
    console.log(userStats);
    console.log(userProfile);
    //create profile page 
    let profileImage = document.createElement('img');
    profileImage.src = userProfile.photo_URL;
    profileImage.alt = "profile picture";
    profileImage.style.borderColor = userProfile.fav_colour;
    profileImage.classList.add("profileImage");
    profileImage.id = "userProfileIMG";
    document.getElementById("userProfileImage").appendChild(profileImage);
    
    // put down every other information.
    document.getElementById("userProfileName").innerHTML = "User Name: "+userProfile.display_name;
    document.getElementById("userProfileAge").innerHTML = "Age: "+userProfile.age;
    document.getElementById("userProfileMovie").innerHTML = "Favourite movie:" +userProfile.fav_movie;
    if (userProfile.handedness == "ambidextrous"){
        document.getElementById("userProfileHandAndShape").innerHTML = "You are Ambidextrous and part of Team "+userProfile.shape;
    }else{
        document.getElementById("userProfileHandAndShape").innerHTML = "You are " + userProfile.handedness + "-handed and part of Team "+userProfile.shape;
    }
    //show Paper Scissors Rock-like game stats
    document.getElementById("userProfileWins").innerHTML = "Wins: "+userStats.wins
    document.getElementById("userProfileLosses").innerHTML = "Losses: "+userStats.losses
    document.getElementById("userProfileStreak1").innerHTML = "Current win streak: "+userStats.current_win_streak
    document.getElementById("userProfileStreak2").innerHTML = "Longest win streak: "+userStats.longest_win_streak

function changeInfo(){
            console.log('%c changeInfo running ',
                        'color: ' + COL_C + '; background-color: ' + COL_B + ';');
                // put users previous values into inputs
                document.getElementById("userName").value = userProfile.display_name;
                document.getElementById("userAge").value = userProfile.age;
                document.getElementById("userMovie").value = userProfile.fav_movie;
                document.getElementById("userCol").value = userProfile.fav_colour;
                document.getElementById("userStats").style = "display:none";
                document.getElementById("form").style = "display:inline-block";
                
        }

async function changeInfoWrite(){
    console.log('%c change information. ',
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
        console.log("usermMovie"+userMovie);
        let userHand = document.getElementById("userHand").value;
        console.log("userHandedness"+userHand);
        let userShape = document.getElementById("userShape").value;
        console.log("userShape"+userShape);
        // create booleans based on validations
         let validationsList  = [
            (userName == null),// users name is null
            (userName.trim() == ""), //username is equal to spaces or empty
            (userName.length <= 5), // username is less than 5 characters
            (userName.length >= 20), // username is more than 20 characters
            (userAge == null), //users age is null
            (userAge == ""), // users age is equal to spaces or empty
            (userAge <= 5), // user age is less than 5
            (userAge >= 120), //users age is more than 120
            (userMovie.trim() == ""), // user's favourite movie is equal to spaces ore empty.
            (userMovie.length>=180)// user favourite movie is more than 120 characters
    ]
        //create messages for valdiations.
        let validationsListMessage = [
                "Name is null, you shouldn't be seeing this",
                "Name is empty", //username is equal to spaces or empty
                "Name must be more than 5 characters",// username is less than 5 characters
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
        document.getElementById("validationError").innerHTML = "";

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
                fb_updateRecord("/playerStats/UNI/"+userUid, {
                    display_name: userName,
                    age: userAge,
                    fav_colour:userCol,
                    fav_movie:userMovie,
                    handedness:userHand,
                    shape:userShape,
                    isadmin:false,
                })
                
                // change details on the page.
                document.getElementById("userProfileName").innerHTML = "User Name: "+ userName;
                document.getElementById("userProfileAge").innerHTML = "Age: "+ userAge;
                document.getElementById("userProfileMovie").innerHTML = "Favourite movie:" +userMovie;
                if (userHand == "ambidextrous"){
                    document.getElementById("userProfileHandAndShape").innerHTML = "You are Ambidextrous and part of Team "+ userShape;
                }else{
                    document.getElementById("userProfileHandAndShape").innerHTML = "You are " + userHand + "-handed and part of Team "+ userShape;
                }
                profileImage.style.borderColor = userCol ;
                userProfile = await op_checkProfile(userUid);
                // Hide form and put back profiles.
                document.getElementById("form").style = "display:none";
                document.getElementById("validationError").style = "display:none";
                document.getElementById("userStats").style = "display:inline";
            }
    }

//make the info changing buttons usable
window.changeInfo =changeInfo;
window.changeInfoWrite = changeInfoWrite; 
