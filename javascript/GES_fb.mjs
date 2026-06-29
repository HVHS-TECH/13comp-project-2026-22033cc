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
    let userUid = sessionStorage.getItem("UID");
        console.log(userUid);
    const USER_SCORE_PATH = "/playerStats/GES/"+userUid+"/"
//Import all functions required from ops.mjs
import { op_checkProfile, op_checkStats,op_createLeaderboard
 }
    from './ops.mjs';
    window.op_checkProfile = op_checkProfile;
    window.op_checkStats = op_checkStats;
    window.op_createLeaderboard = op_createLeaderboard;

export async function GES_checkHighScore(){
    console.log("checking high Score");
    let highScore = await fb_readRecord(USER_SCORE_PATH,"high_score");
    console.log(highScore);
    if (highScore == null){
        fb_writeRecord(USER_SCORE_PATH,{
            high_score:0
        })
    highScore = 0;
    }
    return highScore;
}
export async function GES_changeHighScore(_SCORE){
    console.log(_SCORE);
    console.log("running change function!");
    await fb_updateRecord(USER_SCORE_PATH,{
        high_score:_SCORE
    })
    return _SCORE;ssw
}
/*console.log("running function!");
    const HIGH_SCORE = new Promise((resolve, reject) => {
        let highScore = fb_readRecord("playerStats/PSR/"+userUid+"/","high_score").
        resolve(highScore);
    });

    HIGH_SCORE.then((highScore)=>{
        if (highScore == null){
        fb_writeRecord("/playerStats/GES/"+userUid,{
            high_score:0,
        }).catch(error)(
            console.log(error)
        )
        highScore = 0
    }
    const high_score = highScore;
    return high_score;
    })*/