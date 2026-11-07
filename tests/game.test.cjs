const fs=require('fs'),vm=require('vm'),assert=require('assert');
class El{constructor(){this.events={};this.value='';this.dataset={};this.children=[];this.classList={toggle(){}};this.style={};}append(e){this.children.push(e)}replaceChildren(...e){this.children=e}setAttribute(k,v){this[k]=v}addEventListener(type,handler){this.events[type]=handler}focus(){}}
const els={};const document={querySelector:s=>els[s]??=new El(),querySelectorAll:()=>[],createElement:()=>new El(),createElementNS:(ns,tag)=>Object.assign(new El(),{tag})};const ctx=vm.createContext({document,window:{},performance:{now:()=>1000},setInterval:()=>1,clearInterval(){},setTimeout:f=>{ctx.next=f;return 1},clearTimeout(){},console});
vm.runInContext(fs.readFileSync(require('path').join(__dirname,'../game.js'),'utf8'),ctx);const run=s=>vm.runInContext(s,ctx);
for(const clef of ['treble','bass'])for(const mode of ['name','place'])for(const chrom of ['natural','all']){run(`mode='${mode}';$('#clef').value='${clef}';defaults();$('#accidentals').value='${chrom}';start();`);assert.equal(run('questions.length'),10);assert.equal(run("$('#staff').children.length"),1);for(let i=0;i<10;i++){assert.equal(run('accepting'),true);assert.equal(run("$('#answers').children.length"),mode==='name'?4:0);run(`answer({...questions[index],step:questions[index].step+7})`);ctx.next();}assert.equal(run('correct'),10);assert.equal(run('score'),12000);assert.equal(run("$('#results').hidden"),false);}
run("start();answer(null)");assert.equal(run('score'),0);assert.equal(run('correct'),0);run("start();answer({step:questions[0].step+1,acc:questions[0].acc})");assert.equal(run('score'),0);assert.equal(run('matches({step:28,acc:0},{step:35,acc:0})'),true);assert.equal(run('matches({step:28,acc:1},{step:28,acc:0})'),false);console.log('PASS: both modes × both clefs × both note pools, 80 correct answers, octave matching, scoring, timeout, wrong answers, preset ranges.');

// Staff activation submits once immediately, with the selected accidental.
for(const activation of ['click','keydown']){
  run("mode='place';$('#clef').value='treble';defaults();start();setAcc(questions[0].acc)");
  const hits=run("$('#staff').children[0].children.filter(e=>e.role==='button')");
  const targetIndex=run('questions[0].step-rangeBounds().from');
  const hit=hits[targetIndex];
  if(activation==='click')hit.events.click();
  else hit.events.keydown({key:'Enter',preventDefault(){}});
  assert.equal(run('accepting'),false);
  assert.equal(run('correct'),1);
  assert.equal(run('score'),12000/10);
  hit.events.click();
  assert.equal(run('correct'),1);
}
console.log('PASS: first staff click / Enter submits immediately; repeated activation cannot score twice.');

// A correct Si in another octave stays in that exact position as one green note.
for(const clef of ['treble','bass']){
  run(`mode='place';$('#clef').value='${clef}';defaults();start();questions[0]={step:27,acc:0};selected=34;acc=0;answer({step:selected,acc})`);
  const heads=run("$('#staff').children[0].children.filter(e=>e.tag==='ellipse')");
  assert.equal(heads.length,1);
  assert.equal(heads[0].fill,'#227b67');
  assert.equal(heads[0].cy,run('28+(high-selected)*staffStep'));
  assert.equal(heads[0].cx,350);
}
console.log('PASS: correct Si feedback marks only the placed octave in green, for both clefs.');


// Each teaching range has exact bounds, shading and only active placement targets.
for(const [clef,expected] of [['treble',[[28,39],[36,42],[25,31]]],['bass',[[16,27],[24,30],[13,19]]]]){
  for(const [i,key] of ['central','upper','lower'].entries()){
    run(`mode='place';$('#clef').value='${clef}';$('#range').value='${key}';defaults();start()`);
    assert.equal(run("$('#range').children.length"),3);
    assert.equal(JSON.stringify(run('rangeBounds()')),JSON.stringify({from:expected[i][0],to:expected[i][1]}));
    assert(run('questions.every(n=>n.step>=rangeBounds().from&&n.step<=rangeBounds().to)'));
    const children=run("$('#staff').children[0].children");
    const hits=children.filter(e=>e.role==='button');
    assert.equal(hits.length,expected[i][1]-expected[i][0]+1);
    const shaded=children.filter(e=>e.fill==='#fce6e0');
    assert.equal(shaded.length,2);
    assert(shaded.every(e=>e.height>0&&!e.events.click));
    hits[0].events.pointerenter();
    assert.equal(run('accepting'),true);
    assert.equal(run('selected'),null);
    hits[0].events.pointerleave();
    hits[0].events.focus();hits[0].events.blur();
    hits[0].events.click();assert.equal(run('selected'),expected[i][0]);
  }
}
run("$('#range').value='';defaults()");assert.equal(run("$('#range').value"),'central');
run("$('#range').value='upper';$('#clef').value='treble';defaults()");assert.equal(run("$('#range').value"),'upper');
console.log('PASS: three teaching ranges per clef, bounds, inactive red shading, active-only click targets and central default.');

// Corrections choose the closest valid octave, including range edges and accidentals.
run("mode='place';$('#clef').value='treble';$('#range').value='central';defaults()");
for(const [target,choice,expected] of [
  [{step:28,acc:0},{step:36,acc:0},35],
  [{step:35,acc:0},{step:29,acc:0},28],
  [{step:32,acc:1},{step:38,acc:0},39],
  [{step:39,acc:-1},{step:28,acc:0},32]
]){
  ctx.target=target;ctx.choice=choice;
  assert.equal(run('nearestCorrectNote(target,choice).step'),expected);
  assert.equal(run('nearestCorrectNote(target,choice).acc'),target.acc);
}
run("start();questions[0]={step:28,acc:0};selected=36;acc=0;answer({step:selected,acc})");
const correction=run("$('#staff').children[0].children.find(e=>e.tag==='ellipse'&&e.fill==='#227b67')");
assert.equal(correction.cy,run('28+(high-35)*staffStep'));
const titles=new Set();
for(let count=0;count<=10;count++){
  run(`correct=${count};finish()`);
  const title=run("$('#result-title').textContent");titles.add(title);
  assert(!title.includes('Beautiful playing'));
  assert.equal(title==='All 10 notes correct!',count===10);
  assert(run("$('#result-message').textContent").includes(`${count} of 10`));
}
assert.equal(titles.size,5);
console.log('PASS: nearest correction position and accidental, rendered correction octave, five score-specific encouragement levels.');

run("mode='place';$('#range').value='central';start()");
const bands=run("$('#staff').children[0].children.filter(e=>e.role==='button')");
assert.equal(bands[0].height,13.8);
for(let i=1;i<bands.length;i++)assert(Math.abs(bands[i-1].y-bands[i].y-bands[i].height)<1e-9);
console.log('PASS: placement bands are 15% taller and remain contiguous without overlap.');
