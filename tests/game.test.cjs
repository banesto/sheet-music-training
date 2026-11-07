const fs=require('fs'),vm=require('vm'),assert=require('assert');
class El{constructor(){this.events={};this.value='';this.dataset={};this.children=[];this.classList={toggle(){}};this.style={};}append(e){this.children.push(e)}replaceChildren(...e){this.children=e}setAttribute(k,v){this[k]=v}addEventListener(type,handler){this.events[type]=handler}focus(){}}
const els={};const document={querySelector:s=>els[s]??=new El(),querySelectorAll:()=>[],createElement:()=>new El(),createElementNS:(ns,tag)=>Object.assign(new El(),{tag})};const ctx=vm.createContext({document,window:{},performance:{now:()=>1000},setInterval:()=>1,clearInterval(){},setTimeout:f=>{ctx.next=f;return 1},clearTimeout(){},console});
vm.runInContext(fs.readFileSync(require('path').join(__dirname,'../game.js'),'utf8'),ctx);const run=s=>vm.runInContext(s,ctx);
for(const clef of ['treble','bass'])for(const mode of ['name','place'])for(const chrom of ['natural','all']){run(`mode='${mode}';$('#clef').value='${clef}';defaults();$('#accidentals').value='${chrom}';start();`);assert.equal(run('questions.length'),10);assert.equal(run("$('#staff').children.length"),1);for(let i=0;i<10;i++){assert.equal(run('accepting'),true);assert.equal(run("$('#answers').children.length"),mode==='name'?4:0);run(`answer({...questions[index],step:questions[index].step+7})`);ctx.next();}assert.equal(run('correct'),10);assert.equal(run('score'),12000);assert.equal(run("$('#results').hidden"),false);}
run("start();answer(null)");assert.equal(run('score'),0);assert.equal(run('correct'),0);run("start();answer({step:questions[0].step+1,acc:questions[0].acc})");assert.equal(run('score'),0);assert.equal(run('matches({step:28,acc:0},{step:35,acc:0})'),true);assert.equal(run('matches({step:28,acc:1},{step:28,acc:0})'),false);run("$('#range-from').value=35;$('#range-to').value=28");assert.equal(run('validate()'),false);run("$('#range-from').value=28;$('#range-to').value=28;start()");assert.equal(run('questions.length'),10);console.log('PASS: both modes × both clefs × both note pools, 80 correct answers, octave matching, scoring, timeout, wrong answers, invalid and single-note ranges.');

// Staff activation submits once immediately, with the selected accidental.
for(const activation of ['click','keydown']){
  run("mode='place';$('#clef').value='treble';defaults();start();setAcc(questions[0].acc)");
  const hits=run("$('#staff').children[0].children.filter(e=>e.role==='button')");
  const targetIndex=run('questions[0].step-low');
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
  assert.equal(heads[0].cy,run('28+(high-selected)*12'));
  assert.equal(heads[0].cx,350);
}
console.log('PASS: correct Si feedback marks only the placed octave in green, for both clefs.');
