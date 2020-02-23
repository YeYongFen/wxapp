const express = require('express');
const axios = require('axios');

const app = express();

const config = {   //记录配置信息
  appId:'wx08a765c3d02cc509',
  appSecret:'c654d65e55c53c7ee40cad07a0abfa04'
}



const userTable = {} //记录用户信息表

app.get('/oauth/login', (req, resp) => {
  const { code } = req.query;
  
  if(!code){
    return resp.json({
      status:"error"
    })
  }


  axios.get('https://api.weixin.qq.com/sns/jscode2session', {
    params: {
      appid: config.appId,
      secret: config.appSecret,
      js_code: code,
      grant_type: 'authorization_code'
    }
  }).then(({data}) => {
    let {openid , session_key} = data
    let user = userTable[openid]
    if (!user) {       //'新用户'
      userTable[openid] = {
        openid,
      }
      console.log('新用户', user)
    } else {  //老用户'
      console.log('老用户', user)
    }
    resp.json({
      status:"success",
      openid
    })

  }).catch((e)=>{
    resp.json({
      status:"error",
      message:e.message
    })
  })




})

app.listen("8888", () => {
  console.log("http://localhost:" + 8888)
})
