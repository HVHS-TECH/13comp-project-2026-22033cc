/***************************************************************/
// PSR.mjs
// Written by Conor, Term 1 2026
// Guess the number game logic
// all functions prefixed by adm_
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
let userStats = await op_checkStats(userUid,game);


let allUsers = await fb_readRecord("/playerStats/","UNI");
allUsers = Object.entries(allUsers);
console.log(allUsers);
for (let i=0; i<allUsers.length ;i++){
    let userStats = await op_checkStats(allUsers[i][0],"PSR");
    console.log(allUsers[i][1]);
    //create all elements to be used
    let userRow = document.createElement('tr');
    let userName = document.createElement('td');
    let userAge = document.createElement('td');
    let userMovie = document.createElement('td');  
    let userHand = document.createElement('td');
    let userShape = document.createElement('td');
    let userPSRwins = document.createElement('td');
    let userPSRlosses = document.createElement('td');
    let userEmail = document.createElement('td');
    let userButton1 = document.createElement('td');
    let userButton2 = document.createElement('button');
    
    //change the insides of these elements to match hosts name and redirect them.
    userRow.id = allUsers[i][0];
    userName.innerHTML = allUsers[i][1].display_name;
    userAge.innerHTML = allUsers[i][1].age;
    userMovie.innerHTML = allUsers[i][1].fav_movie;
    userEmail.innerHTML = allUsers[i][1].email;
    userHand.innerHTML = allUsers[i][1].handedness;
    userShape.innerHTML = allUsers[i][1].shape;
    
    userPSRwins.innerHTML = userStats.wins;
    userPSRlosses.innerHTML = userStats.losses;
    //button to change some infomration.
    userButton2.classList.add("Button")
    userButton2.onclick = ()=> adm_changeInfo(allUsers[i][0],i);
    userButton2.innerHTML = "change!";
    userButton1.appendChild(userButton2);
    //append into row and append into site.
    userRow.append(userName,userAge,userMovie,userHand,userShape,userPSRwins,userPSRlosses,userEmail,userButton2)
    document.getElementById("users").append(userRow);

}

async function adm_changeInfo(_UID,_NUMBER){
    console.log(_UID);
    let UID = _UID;
    let userInfo = allUsers[_NUMBER][1];
    let userStat = await op_checkStats(_UID,"PSR");
    console.log(userStat);
    //delete previous stuff to rewrite
    document.getElementById(_UID).innerHTML = "";
    //create containers for inputs

    //create name input
    let userName = document.createElement('td');
    let userNameInput = document.createElement('input');
    userNameInput.type = "text";
    userNameInput.id = "userNameInput";
    userNameInput.value = userInfo.display_name;
    userName.appendChild(userNameInput);

    //create Age input
    let userAge = document.createElement('td');
    let userAgeInput = document.createElement('input');
    userAgeInput.type = "number";
    userAgeInput.id = "userAgeInput";
    userAgeInput.value = userInfo.age;
    userAge.appendChild(userAgeInput);

    //create movie input
    let userMovie = document.createElement('td');
    let userMovieInput = document.createElement('input');
    userMovieInput.type = "text";
    userMovieInput.id = "userMovieInput";
    userMovieInput.value = userInfo.fav_movie;
    userMovie.appendChild(userMovieInput);
    
    
    //create handedness selection
    let userHand = document.createElement('td');
    let userHandSelect = document.createElement('select');
    let userHandLeft = document.createElement('option');
    userHandLeft.innerHTML = "Left handed";
    let userHandRight = document.createElement('option');
    userHandRight.innerHTML = "Right handed";
    userHandSelect.append(userHandLeft,userHandRight);
    userHandSelect.id = "userHandSelect"
    userHand.appendChild(userHandSelect);

    //create shapes seletion
    let userShape = document.createElement('td');
    let userShapeSelect = document.createElement('select');
    let userShapeTriangle = document.createElement('option');
    userShapeTriangle.innerHTML = "triangle";
    let userShapeSquare = document.createElement('option');
    userShapeSquare.innerHTML = "squares";
    userShapeSelect.append(userShapeTriangle,userShapeSquare);
    userShapeSelect.id = "userShapeSelect";
    userShape.appendChild(userShapeSelect);

    // create PSR wins input
    let userPSRwins = document.createElement('td');
    let userPSRwinsInput = document.createElement('input');
    userPSRwinsInput.type = "number";
    userPSRwinsInput.id = "userPSRwinsInput";
    userPSRwinsInput.value = userStat.wins;
    userPSRwins.appendChild(userPSRwinsInput);

    // create PSR losses input
    let userPSRlosses = document.createElement('td');
    let userPSRlossesInput = document.createElement('input');
    userPSRlossesInput.type = "number";
    userPSRlossesInput.id = "userPSRlossesInput";
    userPSRlossesInput.value = userStat.losses;
    userPSRlosses.appendChild(userPSRlossesInput);

    // users email
    let userEmail = document.createElement('td');
    userEmail.innerHTML = allUsers[_NUMBER][1].email;

    //users button to do so. 
    let userButton1 = document.createElement('td');
    let userButton2 = document.createElement('button');
    userButton2.innerHTML = "Change!"
    userButton2.classList.add("Button");
    userButton2.onclick =  async function () {
        // I don't bother with validation here, because I trust that admins won't make mistakes
        let uName = document.getElementById("userNameInput").value;
        let uAge = document.getElementById("userAgeInput").value;
        let uMovie = document.getElementById("userMovieInput").value;
        let uHand = document.getElementById("userHandSelect").value;
        let uShape = document.getElementById("userShapeSelect").value;
        let uPSRwins = document.getElementById("userPSRwinsInput").value;
        let uPSRlosses = document.getElementById("userPSRlossesInput").value;
        //update unversal stats
        await fb_updateRecord("/playerStats/UNI/"+_UID+"/",{
            display_name:uName,
            age:uAge,
            fav_movie:uMovie,
            handedness:uHand,
            shape:uShape,
        })
        //update PSR states
        await fb_updateRecord("/playerStats/PSR/"+_UID+"/",{
            wins:uPSRwins,
            losses:uPSRlosses
        })
    // return that row back to normal
    let updatedInfo = await fb_readRecord("/playerStats/UNI/",_UID);
    let updateStats = await op_checkStats(_UID,"PSR");
    console.log(updatedInfo);
    console.log(updateStats);
    //create all elements to be used
    let userName = document.createElement('td');
    let userAge = document.createElement('td');
    let userMovie = document.createElement('td');  
    let userHand = document.createElement('td');
    let userShape = document.createElement('td');
    let userPSRwins = document.createElement('td');
    let userPSRlosses = document.createElement('td');
    let userEmail = document.createElement('td');
    let userButton1 = document.createElement('td');
    let userButton2 = document.createElement('button');
    console.log("is this runing?");
    
    //change the insides of these elements to match hosts name and redirect them.
    userName.innerHTML = updatedInfo.display_name;
    userAge.innerHTML = updatedInfo.age;
    userMovie.innerHTML = updatedInfo.fav_movie;
    userEmail.innerHTML = updatedInfo.email;
    userHand.innerHTML = updatedInfo.handedness;
    userShape.innerHTML = updatedInfo.shape;
    console.log("is it still running?");
    userPSRwins.innerHTML = updateStats.wins;
    userPSRlosses.innerHTML = updateStats.losses;
    //button to change some infomration.
    userButton2.classList.add("Button")
    console.log("is is still running now?")
    userButton2.onclick = ()=> adm_changeInfo(_UID,_NUMBER);
    userButton2.innerHTML = "change!";
    userButton1.appendChild(userButton2);
    console.log("Ok whats the problem here");
    //append into row and append into site.
    document.getElementById(_UID).innerHTML = "";
    document.getElementById(_UID).append(userName,userAge,userMovie,userHand,userShape,userPSRwins,userPSRlosses,userEmail,userButton2)
    }
    document.getElementById(_UID).append(userName,userAge,userMovie,userHand,userShape,userPSRwins,userPSRlosses,userEmail,userButton2);
}


