'use strict';const{Router}=require('express');const hc=require('../services/hive-client');const{getStats}=require('../services/messaging-engine');const r=Router();const BT=new Date().toISOString();
r.get('/health',(_,s)=>s.json({status:'operational',service:'hivepigeon',version:'1.0.0',did:hc.AGENT_DID,uptime_seconds:Math.floor(process.uptime()),boot_time:BT}));
r.get('/.well-known/hive-pulse.json',(_,s)=>s.json({schema:'hive-pulse/v1',agent:'hivepigeon',did:hc.AGENT_DID,status:'online',capabilities:hc.AGENT_IDENTITY.capabilities,stats:getStats(),pulse_time:new Date().toISOString()}));
r.get('/.well-known/ai.json',(_,s)=>s.json({schema_version:'1.0',name:'HivePigeon',description:'Agent-to-agent messaging — DMs, channels, broadcasts, dead drops',type:'agent-service',did:hc.AGENT_DID}));
r.get('/robots.txt',(_,s)=>s.type('text/plain').send(`User-agent: *\nAllow: /\n\n# HivePigeon — DID: ${hc.AGENT_DID}`));
module.exports=r;
