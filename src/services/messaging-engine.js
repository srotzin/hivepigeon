'use strict';const{v4:uuid}=require('uuid');
const messages=new Map();const channels=new Map();const deadDrops=new Map();
let stats={messages_sent:0,channels_created:0,broadcasts_sent:0,dead_drops_placed:0,messages_encrypted:0};

function send(fromDid,toDid,content,opts={}){const id=uuid();const m={id,from:fromDid,to:toDid,content,encrypted:opts.encrypted||false,priority:opts.priority||'normal',type:'dm',ttl_seconds:opts.ttl_seconds||86400,sent_at:new Date().toISOString(),read:false,status:'delivered'};messages.set(id,m);stats.messages_sent++;if(m.encrypted)stats.messages_encrypted++;return m}

function createChannel(name,members,opts={}){const id=uuid();const c={id,name,members,type:opts.type||'squad',topic:opts.topic||'',created_by:opts.created_by||'system',created_at:new Date().toISOString(),message_count:0,status:'active'};channels.set(id,c);stats.channels_created++;return c}

function postToChannel(channelId,fromDid,content){const c=channels.get(channelId);if(!c)return null;const id=uuid();const m={id,channel_id:channelId,from:fromDid,content,sent_at:new Date().toISOString(),type:'channel'};messages.set(id,m);c.message_count++;stats.messages_sent++;return m}

function broadcast(fromDid,content,opts={}){const id=uuid();const b={id,from:fromDid,content,scope:opts.scope||'all',priority:opts.priority||'normal',type:'broadcast',sent_at:new Date().toISOString(),reach:opts.reach||'ecosystem'};messages.set(id,b);stats.broadcasts_sent++;stats.messages_sent++;return b}

function placeDeadDrop(agentDid,content,opts={}){const id=uuid();const d={id,placed_by:agentDid,content_hash:`sha256:${uuid().replace(/-/g,'')}`,location:opts.location||`drop-${id.slice(0,8)}`,pickup_code:opts.pickup_code||uuid().slice(0,8),encrypted:true,expires_at:new Date(Date.now()+(opts.ttl_hours||24)*3600000).toISOString(),placed_at:new Date().toISOString(),picked_up:false};deadDrops.set(id,d);stats.dead_drops_placed++;return d}

function pickupDeadDrop(dropId,code){const d=deadDrops.get(dropId);if(!d)return null;if(d.pickup_code!==code)return{error:'invalid_code'};d.picked_up=true;d.picked_up_at=new Date().toISOString();return d}

function getInbox(agentDid){return[...messages.values()].filter(m=>m.to===agentDid&&!m.read)}
function getStats(){return{...stats,active_channels:[...channels.values()].filter(c=>c.status==='active').length,pending_dead_drops:[...deadDrops.values()].filter(d=>!d.picked_up).length}}
function listChannels(){return[...channels.values()]}
module.exports={send,createChannel,postToChannel,broadcast,placeDeadDrop,pickupDeadDrop,getInbox,getStats,listChannels};
