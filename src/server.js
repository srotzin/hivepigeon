'use strict';const express=require('express');const cors=require('cors');const app=express();const PORT=process.env.PORT||3018;
app.use(cors());app.use(express.json());app.use('/',require('./routes/health'));app.use('/',require('./routes/pigeon'));
app.get('/',(_,r)=>r.json({service:'hivepigeon',version:'1.0.0',description:'Agent-to-agent messaging — DMs, channels, broadcasts, encrypted carriers, dead drops',endpoints:{send:'POST /v1/pigeon/send',channel:'POST /v1/pigeon/channel',post:'POST /v1/pigeon/channel/:id/post',broadcast:'POST /v1/pigeon/broadcast',deaddrop:'POST /v1/pigeon/deaddrop',pickup:'POST /v1/pigeon/deaddrop/:id/pickup',inbox:'GET /v1/pigeon/inbox/:did',stats:'GET /v1/pigeon/stats',channels:'GET /v1/pigeon/channels',health:'GET /health'}}));
const hc=require('./services/hive-client');
app.listen(PORT,async()=>{console.log(`[hivepigeon] Listening on port ${PORT}`);try{await hc.registerWithHiveTrust()}catch(e){}try{await hc.registerWithHiveGate()}catch(e){}});
module.exports=app;
