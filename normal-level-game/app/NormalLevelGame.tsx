"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Phase = "ready" | "playing" | "paused" | "won" | "lost";
type Monster = { id: string; name: string; monsterType: "NORMAL" | "ELITE" | "BOSS"; atk: number; hp: number; gold: number; desc: string };
type Hero = { id: string; name: string; atk: number; hp: number };
type Round = { id: number; round: number; monsterTimes: number[]; monsterIds: string[]; atkMultiple: number; hpMultiple: number };
type Level = { id: number; chapter: number; name: string; fightscene: string; homeHp: number; enemyHomeHp: number; enemyHomeGold: number; atkMultiple: number; hpMultiple: number; goldMultiple: number; recommendHeroIds: string[]; roundIds: number[] };
type GameData = { source: string; levelCount: number; roundCount: number; levels: Level[]; rounds: Record<string, Round>; monsters: Record<string, Monster>; heroes: Record<string, Hero> };
type Point = { x: number; y: number };
type Enemy = { uid: number; cfg: Monster; x: number; y: number; segment: number; progress: number; hp: number; maxHp: number; rawHp: number; rawAtk: number; speed: number; radius: number };
type Beam = { from: Point; to: Point; life: number; color: string };
type Engine = { phase: Phase; level: Level; roundIndex: number; elapsed: number; delay: number; spawnIndex: number; enemies: Enemy[]; beams: Beam[]; towers: number[]; cooldowns: number[]; baseHp: number; gold: number; kills: number; skillCd: number; speed: 1 | 2; serial: number; clearDelay: number; last: number; uiClock: number };
type Snapshot = { phase: Phase; round: number; total: number; baseHp: number; gold: number; kills: number; enemies: number; skillCd: number; speed: 1 | 2; towers: number[] };

const W = 960, H = 540, TIME_SCALE = .32;
const PATH: Point[] = [{x:-25,y:132},{x:180,y:132},{x:180,y:338},{x:418,y:338},{x:418,y:188},{x:662,y:188},{x:662,y:390},{x:985,y:390}];
const PADS: Point[] = [{x:105,y:245},{x:290,y:250},{x:515,y:290},{x:580,y:100},{x:775,y:285}];
const COSTS = [70,110,165,235,320];
const EMPTY: Snapshot = { phase:"ready", round:0, total:0, baseHp:100, gold:220, kills:0, enemies:0, skillCd:0, speed:1, towers:[1,0,0,0,0] };

function fmt(value: number) { return new Intl.NumberFormat("zh-CN", { maximumFractionDigits: value < 100 ? 1 : 0 }).format(value); }
function colorOf(monster: Monster) {
  if (monster.monsterType === "BOSS") return "#d6534e";
  if (monster.monsterType === "ELITE") return "#9d61ba";
  const palette = ["#648f6d", "#d0914d", "#5686a1", "#8e705f"];
  return palette[[...monster.id].reduce((n,c)=>n+c.charCodeAt(0),0)%palette.length];
}
function sceneColors(scene = "") {
  if (scene.includes("_02")) return ["#d7e7ed","#86a7b7","#526f80"];
  if (scene.includes("_03")) return ["#f0d7aa","#c68d52","#805b3a"];
  if (scene.includes("_04")) return ["#382f35","#9f4f3e","#e1a45a"];
  return ["#dbe2bd","#839c67","#4d684c"];
}
function newEngine(level: Level): Engine {
  return { phase:"playing", level, roundIndex:0, elapsed:0, delay:1.4, spawnIndex:0, enemies:[], beams:[], towers:[1,0,0,0,0], cooldowns:[0,0,0,0,0], baseHp:100, gold:220, kills:0, skillCd:0, speed:1, serial:0, clearDelay:0, last:performance.now(), uiClock:0 };
}

export function NormalLevelGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataRef = useRef<GameData | null>(null);
  const engineRef = useRef<Engine | null>(null);
  const rafRef = useRef(0);
  const [data,setData] = useState<GameData|null>(null);
  const [selectedId,setSelectedId] = useState(1001);
  const [snap,setSnap] = useState<Snapshot>(EMPTY);
  const [highest,setHighest] = useState(1000);
  const [error,setError] = useState("");

  useEffect(()=>{
    const saved = Number(localStorage.getItem("normal-level-highest-clear") || 1000);
    if (Number.isFinite(saved)) setHighest(saved);
    fetch("/data/normal-levels.json").then(r=>{ if(!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() as Promise<GameData>; }).then(payload=>{ dataRef.current=payload; setData(payload); setSnap({...EMPTY,total:payload.levels[0]?.roundIds.length||0}); }).catch((e:Error)=>setError(e.message));
  },[]);

  const level = useMemo(()=>data?.levels.find(item=>item.id===selectedId)||null,[data,selectedId]);
  const heroes = useMemo(()=>(level?.recommendHeroIds.map(id=>data?.heroes[id]).filter((item): item is Hero=>Boolean(item)))||[],[data,level]);

  function publish(engine: Engine) {
    setSnap({ phase:engine.phase, round:Math.min(engine.roundIndex+1,engine.level.roundIds.length), total:engine.level.roundIds.length, baseHp:Math.max(0,engine.baseHp), gold:Math.floor(engine.gold), kills:engine.kills, enemies:engine.enemies.length, skillCd:engine.skillCd, speed:engine.speed, towers:[...engine.towers] });
  }
  function complete(engine: Engine, won: boolean) {
    engine.phase = won ? "won" : "lost";
    if (won) setHighest(current=>{ const next=Math.max(current,engine.level.id); localStorage.setItem("normal-level-highest-clear",String(next)); return next; });
    publish(engine);
  }
  function kill(engine: Engine, enemy: Enemy) {
    engine.enemies = engine.enemies.filter(item=>item.uid!==enemy.uid);
    engine.kills += 1;
    engine.gold += enemy.cfg.monsterType === "BOSS" ? 42 : enemy.cfg.monsterType === "ELITE" ? 18 : 8;
  }
  function start() { if(!level) return; const engine=newEngine(level); engineRef.current=engine; publish(engine); }
  function pause() { const e=engineRef.current; if(!e||!["playing","paused"].includes(e.phase)) return; e.phase=e.phase==="paused"?"playing":"paused"; e.last=performance.now(); publish(e); }
  function speed() { const e=engineRef.current; if(!e) return; e.speed=e.speed===1?2:1; publish(e); }
  function skill() { const e=engineRef.current; if(!e||e.phase!=="playing"||e.skillCd>0) return; e.skillCd=12; [...e.enemies].forEach(enemy=>{ enemy.hp-=Math.max(24,enemy.maxHp*.42); if(enemy.hp<=0) kill(e,enemy); }); publish(e); }
  function tower(index:number) { const e=engineRef.current; if(!e||["won","lost"].includes(e.phase)) return; const lvl=e.towers[index]; if(lvl>=5||e.gold<COSTS[lvl]) return; e.gold-=COSTS[lvl]; e.towers[index]+=1; publish(e); }
  function choose(id:number) { setSelectedId(id); engineRef.current=null; const next=dataRef.current?.levels.find(item=>item.id===id); setSnap({...EMPTY,total:next?.roundIds.length||0}); }

  useEffect(()=>{
    const onKey=(event:KeyboardEvent)=>{ if(event.code==="Space"){event.preventDefault();skill();} if(event.key.toLowerCase()==="p") pause(); };
    window.addEventListener("keydown",onKey); return()=>window.removeEventListener("keydown",onKey);
  });

  useEffect(()=>{
    const canvas=canvasRef.current, ctx=canvas?.getContext("2d");
    if(!canvas||!ctx||!data) return;
    const drawPath=()=>{ ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle="rgba(52,42,35,.28)";ctx.lineWidth=53;ctx.beginPath();PATH.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();ctx.strokeStyle="#dbc89d";ctx.lineWidth=40;ctx.stroke();ctx.setLineDash([6,14]);ctx.strokeStyle="rgba(95,74,51,.35)";ctx.lineWidth=2;ctx.stroke();ctx.setLineDash([]); };
    const spawn=(e:Engine,r:Round,id:string)=>{ const cfg=data.monsters[id]; if(!cfg)return; const rawHp=cfg.hp*(e.level.hpMultiple/10000)*(r.hpMultiple/10000), rawAtk=cfg.atk*(e.level.atkMultiple/10000)*(r.atkMultiple/10000); const tough=Math.log10(Math.max(10,rawHp))/Math.log10(Math.max(100,rawHp+800)); const bonus=cfg.monsterType==="BOSS"?1.55:cfg.monsterType==="ELITE"?1.2:1; const hp=(18+50*tough)*bonus; e.enemies.push({uid:++e.serial,cfg,x:PATH[0].x,y:PATH[0].y,segment:0,progress:0,hp,maxHp:hp,rawHp,rawAtk,speed:cfg.monsterType==="BOSS"?50:cfg.monsterType==="ELITE"?61:72,radius:cfg.monsterType==="BOSS"?17:cfg.monsterType==="ELITE"?14:11}); };
    const update=(e:Engine,dt:number)=>{
      if(e.phase!=="playing") return;
      const r=data.rounds[String(e.level.roundIds[e.roundIndex])]; if(!r)return;
      e.skillCd=Math.max(0,e.skillCd-dt);
      if(e.delay>0)e.delay-=dt; else { e.elapsed+=dt; while(e.spawnIndex<r.monsterIds.length && r.monsterTimes[e.spawnIndex]*.001*TIME_SCALE<=e.elapsed){spawn(e,r,r.monsterIds[e.spawnIndex]);e.spawnIndex++;} }
      for(const enemy of [...e.enemies]){
        let left=enemy.speed*dt;
        while(left>0&&enemy.segment<PATH.length-1){const a=PATH[enemy.segment],b=PATH[enemy.segment+1],len=Math.hypot(b.x-a.x,b.y-a.y),remain=len*(1-enemy.progress);if(left>=remain){left-=remain;enemy.segment++;enemy.progress=0;}else{enemy.progress+=left/len;left=0;}}
        if(enemy.segment>=PATH.length-1){ e.enemies=e.enemies.filter(item=>item.uid!==enemy.uid); const pressure=Math.min(8,Math.log10(Math.max(10,enemy.rawAtk))); e.baseHp-= (enemy.cfg.monsterType==="BOSS"?18:enemy.cfg.monsterType==="ELITE"?10:5)+pressure; if(e.baseHp<=0)complete(e,false); continue; }
        const a=PATH[enemy.segment],b=PATH[enemy.segment+1];enemy.x=a.x+(b.x-a.x)*enemy.progress;enemy.y=a.y+(b.y-a.y)*enemy.progress;
      }
      PADS.forEach((pad,index)=>{const lvl=e.towers[index];if(!lvl)return;e.cooldowns[index]-=dt;if(e.cooldowns[index]>0)return;const range=128+lvl*13;const target=e.enemies.filter(enemy=>Math.hypot(enemy.x-pad.x,enemy.y-pad.y)<=range).sort((a,b)=>(b.segment+b.progress)-(a.segment+a.progress))[0];if(!target)return;e.cooldowns[index]=Math.max(.26,.82-lvl*.09);target.hp-=9+lvl*7.5;e.beams.push({from:pad,to:{x:target.x,y:target.y},life:.08,color:index%2?"#8de0d0":"#ffe58a"});if(target.hp<=0)kill(e,target);});
      e.beams.forEach(beam=>beam.life-=dt);e.beams=e.beams.filter(beam=>beam.life>0);
      if(e.spawnIndex>=r.monsterIds.length&&e.enemies.length===0){e.clearDelay+=dt;if(e.clearDelay>=1.05){e.clearDelay=0;if(e.roundIndex>=e.level.roundIds.length-1)complete(e,true);else{e.roundIndex++;e.elapsed=0;e.delay=1.25;e.spawnIndex=0;e.gold+=34;}}}else e.clearDelay=0;
    };
    const draw=(e:Engine|null)=>{
      const current=e?.level||level, colors=sceneColors(current?.fightscene);const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,colors[0]);g.addColorStop(1,colors[1]);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      ctx.save();ctx.globalAlpha=.18;ctx.fillStyle=colors[2];for(let x=35;x<W;x+=88)for(let y=34;y<H;y+=76){ctx.beginPath();ctx.arc(x+((y/76)%2)*24,y,14,0,Math.PI*2);ctx.fill();}ctx.restore();drawPath();
      ctx.fillStyle="#33483d";ctx.beginPath();ctx.roundRect(W-44,351,72,78,14);ctx.fill();ctx.fillStyle="#f6e5ad";ctx.font="700 13px system-ui";ctx.fillText("BASE",W-35,395);
      PADS.forEach((pad,index)=>{const lvl=e?.towers[index]||0;ctx.fillStyle="rgba(50,57,48,.22)";ctx.beginPath();ctx.arc(pad.x,pad.y,31,0,Math.PI*2);ctx.fill();ctx.strokeStyle="rgba(255,248,218,.75)";ctx.lineWidth=2;ctx.stroke();if(lvl){ctx.fillStyle=index%2?"#4f6179":"#3f7160";ctx.beginPath();ctx.roundRect(pad.x-19,pad.y-22,38,42,11);ctx.fill();ctx.fillStyle="#f6d976";ctx.beginPath();ctx.arc(pad.x,pad.y-15,8,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff6cf";ctx.font="800 12px system-ui";ctx.textAlign="center";ctx.fillText(`L${lvl}`,pad.x,pad.y+43);ctx.textAlign="left";}else{ctx.fillStyle="rgba(255,250,224,.85)";ctx.font="800 22px system-ui";ctx.textAlign="center";ctx.fillText("+",pad.x,pad.y+8);ctx.textAlign="left";}});
      e?.enemies.forEach(enemy=>{ctx.fillStyle="rgba(31,35,31,.22)";ctx.beginPath();ctx.ellipse(enemy.x,enemy.y+enemy.radius+5,enemy.radius,enemy.radius*.38,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=colorOf(enemy.cfg);ctx.beginPath();ctx.arc(enemy.x,enemy.y,enemy.radius,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff2c9";ctx.beginPath();ctx.arc(enemy.x-enemy.radius*.35,enemy.y-2,2.2,0,Math.PI*2);ctx.arc(enemy.x+enemy.radius*.35,enemy.y-2,2.2,0,Math.PI*2);ctx.fill();const bw=enemy.radius*2.3;ctx.fillStyle="rgba(30,30,30,.5)";ctx.fillRect(enemy.x-bw/2,enemy.y-enemy.radius-10,bw,4);ctx.fillStyle="#dce889";ctx.fillRect(enemy.x-bw/2,enemy.y-enemy.radius-10,bw*Math.max(0,enemy.hp/enemy.maxHp),4);});
      e?.beams.forEach(beam=>{ctx.save();ctx.globalAlpha=Math.min(1,beam.life*12);ctx.strokeStyle=beam.color;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(beam.from.x,beam.from.y);ctx.lineTo(beam.to.x,beam.to.y);ctx.stroke();ctx.restore();});
      if(e?.delay&&e.delay>0&&e.phase==="playing"){ctx.fillStyle="rgba(32,38,34,.84)";ctx.beginPath();ctx.roundRect(W/2-118,28,236,54,18);ctx.fill();ctx.fillStyle="#fff0bc";ctx.textAlign="center";ctx.font="800 19px system-ui";ctx.fillText(`第 ${e.roundIndex+1} 波准备`,W/2,61);ctx.textAlign="left";}
      if(e?.phase==="paused"){ctx.fillStyle="rgba(26,31,28,.72)";ctx.fillRect(0,0,W,H);ctx.fillStyle="#fff0bc";ctx.textAlign="center";ctx.font="900 42px system-ui";ctx.fillText("战斗暂停",W/2,H/2);ctx.textAlign="left";}
      if(!e){ctx.fillStyle="rgba(34,42,36,.8)";ctx.beginPath();ctx.roundRect(W/2-180,H/2-44,360,88,20);ctx.fill();ctx.fillStyle="#fff1bf";ctx.textAlign="center";ctx.font="800 24px system-ui";ctx.fillText("选择关卡，部署防线",W/2,H/2+8);ctx.textAlign="left";}
    };
    const frame=(time:number)=>{const e=engineRef.current;if(e){const dt=Math.min(.045,(time-e.last)/1000);e.last=time;update(e,dt*e.speed);e.uiClock+=dt;if(e.uiClock>.12){e.uiClock=0;publish(e);}}draw(e);rafRef.current=requestAnimationFrame(frame);};
    rafRef.current=requestAnimationFrame(frame);return()=>cancelAnimationFrame(rafRef.current);
  },[data,level]);

  function canvasClick(event:React.PointerEvent<HTMLCanvasElement>){const canvas=canvasRef.current;if(!canvas)return;const rect=canvas.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width*W,y=(event.clientY-rect.top)/rect.height*H,index=PADS.findIndex(p=>Math.hypot(p.x-x,p.y-y)<42);if(index>=0)tower(index);}
  const phaseText={ready:"待部署",playing:"战斗中",paused:"已暂停",won:"关卡完成",lost:"防线失守"}[snap.phase];
  if(error)return <main className="load-state"><p className="eyebrow">DATA ERROR</p><h1>关卡配置载入失败</h1><p>{error}</p></main>;

  return <main className="game-shell">
    <header className="topbar"><div className="brand"><span className="brand-mark">仓</span><div><p className="eyebrow">NORMAL FRONT / 主线重建</p><h1>仓鼠防线</h1></div></div><div className="status-strip"><div><span>状态</span><strong data-phase={snap.phase}>{phaseText}</strong></div><div><span>最高完成</span><strong>{highest>1000?highest:"—"}</strong></div><div><span>配置覆盖</span><strong>{data?`${data.levelCount} 关`:"载入中"}</strong></div></div></header>
    <section className="control-ribbon"><button className="small-button" disabled={!data||selectedId<=1001} onClick={()=>choose(selectedId-1)}>←</button><label className="level-picker"><span>当前关卡</span><select value={selectedId} onChange={e=>choose(Number(e.target.value))} disabled={!data}>{data?.levels.map(item=><option key={item.id} value={item.id}>{item.id} · {item.name}</option>)}</select></label><button className="small-button" disabled={!data||selectedId>=1200} onClick={()=>choose(selectedId+1)}>→</button><div className="level-facts"><span><b>{level?.roundIds.length||"—"}</b> 波</span><span>攻击 <b>{level?`${(level.atkMultiple/10000).toFixed(2)}×`:"—"}</b></span><span>生命 <b>{level?`${(level.hpMultiple/10000).toFixed(2)}×`:"—"}</b></span></div></section>
    <div className="play-layout"><section className="battle-card"><div className="battle-hud"><div className="base-meter"><span>防线完整度</span><div className="meter"><i style={{width:`${snap.baseHp}%`}}/></div><strong>{Math.ceil(snap.baseHp)}%</strong></div><div className="hud-pills"><span>波次 {snap.round}/{snap.total||"—"}</span><span>场上 {snap.enemies}</span><span>击破 {snap.kills}</span><span className="gold-pill">齿轮币 {snap.gold}</span></div></div><div className="canvas-wrap"><canvas ref={canvasRef} width={W} height={H} onPointerDown={canvasClick} aria-label="正常关卡战斗画面，点击圆形塔位建造或升级"/>{["won","lost"].includes(snap.phase)&&<div className="result-panel"><p className="eyebrow">{snap.phase==="won"?"MISSION CLEAR":"LINE BROKEN"}</p><h2>{snap.phase==="won"?"关卡完成":"防线失守"}</h2><p>第 {selectedId} 关 · 击破 {snap.kills} 个敌人</p><div className="result-actions"><button onClick={start}>重新挑战</button>{snap.phase==="won"&&selectedId<1200&&<button className="primary" onClick={()=>choose(selectedId+1)}>下一关</button>}</div></div>}</div><div className="battle-actions"><button className="primary action-main" onClick={start}>{snap.phase==="ready"?"开始关卡":"重新部署"}</button><button onClick={pause} disabled={["ready","won","lost"].includes(snap.phase)}>{snap.phase==="paused"?"继续":"暂停"}<kbd>P</kbd></button><button onClick={speed} disabled={snap.phase==="ready"}>{snap.speed}× 倍速</button><button className="skill-button" onClick={skill} disabled={snap.phase!=="playing"||snap.skillCd>0}>{snap.skillCd>0?`脉冲 ${snap.skillCd.toFixed(1)}s`:"全域脉冲"}<kbd>Space</kbd></button></div></section>
      <aside className="briefing"><div className="briefing-head"><p className="eyebrow">BATTLE BRIEF / 作战简报</p><h2>{selectedId}<span>{level?.name||"载入中"}</span></h2></div><div className="briefing-section"><div className="section-label"><span>推荐阵容</span><small>配置原值</small></div><div className="hero-list">{heroes.length?heroes.map((hero,index)=><article key={hero.id} className="hero-card"><span className="hero-avatar">{index+1}</span><div><strong>{hero.name}</strong><small>ATK {fmt(hero.atk)} · HP {fmt(hero.hp)}</small></div></article>):<p className="muted">本关没有配置推荐英雄</p>}</div></div><div className="briefing-section"><div className="section-label"><span>防御塔位</span><small>点击画面塔位也可升级</small></div><div className="tower-grid">{PADS.map((_,index)=>{const lvl=snap.towers[index]||0,max=lvl>=5,cost=COSTS[lvl]||0;return <button key={index} className="tower-control" onClick={()=>tower(index)} disabled={snap.phase==="ready"||max||snap.gold<cost}><span>塔位 {index+1}</span><strong>{lvl?`L${lvl}`:"未部署"}</strong><small>{max?"已满级":`${cost} 齿轮币`}</small></button>})}</div></div><div className="briefing-section compact-stats"><div><span>基地配置生命</span><strong>{fmt(level?.homeHp||0)}</strong></div><div><span>初始敌方金币</span><strong>{fmt(level?.enemyHomeGold||0)}</strong></div><div><span>数据来源</span><strong>{data?.source||"—"}</strong></div></div><p className="prototype-note">当前为正常关卡可玩骨架。关卡、波次、怪物和倍率使用真实配置；战斗血条与塔伤害经过归一化，便于先打通完整流程。</p></aside>
    </div>
  </main>;
}
