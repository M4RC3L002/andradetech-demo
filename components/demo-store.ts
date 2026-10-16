import { makeSeed, modules } from './demo-seed.ts';
type Row=Record<string,any>;
type Result={data:any,error:any};
type Database=Record<string,Row[]>;
export const DEMO_KEY='andradetech-demo-data-v1';
const SESSION_KEY='andradetech-demo-session-v1';
let memory:Database|null=null;
let activeSession:any=null;
const listeners=new Set<(event:string,session:any)=>void>();
const clone=<T,>(value:T):T=>structuredClone(value);
function storageNotice(){if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('demo-storage-warning'));}
function database():Database {
 if(memory)return memory;
 const seed=makeSeed();
 try {
  const raw=window.localStorage.getItem(DEMO_KEY);
  if(raw&&raw.length<2000000){
   const parsed=JSON.parse(raw);
   if(parsed.version===1&&Object.keys(seed).every(key=>Array.isArray(parsed.tables?.[key])&&parsed.tables[key].length<=500&&parsed.tables[key].every((row:any)=>row&&typeof row==='object'&&typeof row.id==='string'))){memory=parsed.tables;return memory!;}
  }
 }catch{storageNotice();}
 memory=seed;return memory!;
}
function persist(){try{window.localStorage.setItem(DEMO_KEY,JSON.stringify({version:1,tables:database()}));}catch{storageNotice();}}
export function resetDemo(){memory=makeSeed();persist();}
export function exportDemo(){return clone(database());}
export function showDemoMessage(text:string,link?:string){
 if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('demo-message',{detail:{text,link}}));
}
class Query implements PromiseLike<Result> {
 private operation='select';private rows:Row[]=[];private filters:[string,any][]=[];private sortKey='';private ascending=true;private one=false;
 constructor(private table:string){}
 select(_columns='*'){return this;}
 eq(key:string,value:any){this.filters.push([key,value]);return this;}
 order(key:string,options:{ascending?:boolean}={}){this.sortKey=key;this.ascending=options.ascending!==false;return this;}
 single(){this.one=true;return this;}
 upsert(rows:Row[]|Row){this.operation='upsert';this.rows=Array.isArray(rows)?rows:[rows];return this;}
 insert(rows:Row[]|Row){this.operation='insert';this.rows=Array.isArray(rows)?rows:[rows];return this;}
 update(row:Row){this.operation='update';this.rows=[row];return this;}
 delete(){this.operation='delete';return this;}
 async execute():Promise<{data:any,error:any}>{
  const db=database();if(!Object.hasOwn(db,this.table))return {data:null,error:{message:'Tabela indisponível na demonstração.'}};
  const table=db[this.table];const matches=(row:Row)=>this.filters.every(([key,value])=>row[key]===value);
  let selected:Row[]=[];
  if(this.operation==='select')selected=table.filter(matches);
  if(this.operation==='delete'){selected=table.filter(matches);db[this.table]=table.filter(row=>!matches(row));}
  if(this.operation==='update'){selected=table.filter(matches);for(const row of selected)Object.assign(row,clone(this.rows[0]));}
  if(this.operation==='insert'||this.operation==='upsert'){
   if(table.length+this.rows.length>500)return {data:null,error:{message:'Limite de 500 registros por módulo nesta demonstração. Restaure os exemplos.'}};
   for(const incoming of this.rows){
    // Password inputs exist only to demonstrate the form; never persist them.
    const {password,...safe}=clone(incoming);
    const row={...safe,id:safe.id||crypto.randomUUID(),created_at:safe.created_at||new Date().toISOString()};
    const existing=table.findIndex(item=>item.id===row.id);
    if(existing>=0&&this.operation==='insert')return {data:null,error:{message:'Identificação já cadastrada na demonstração.'}};
    if(existing>=0){Object.assign(table[existing],safe);selected.push(table[existing]);}else{table.push(row);selected.push(row);}
   }
  }
  if(this.operation!=='select')persist();
  if(this.sortKey)selected=[...selected].sort((a,b)=>String(a[this.sortKey]||'').localeCompare(String(b[this.sortKey]||''))*(this.ascending?1:-1));
  return {data:clone(this.one?selected[0]||null:selected),error:null};
 }
 then<T=Result,U=never>(resolve?:((value:Result)=>T|PromiseLike<T>)|null,reject?:((reason:any)=>U|PromiseLike<U>)|null):Promise<T|U>{return this.execute().then(resolve,reject);}
}
function session(){
 if(activeSession)return activeSession;
 try{if(window.sessionStorage.getItem(SESSION_KEY)==='1')activeSession={user:{id:'demo-admin',email:'admin@example.invalid'}};}catch{}
 return activeSession;
}
function announce(event:string){listeners.forEach(listener=>listener(event,activeSession));}
export const supabase={
 supabaseUrl:'demo://local',supabaseKey:'no-network',
 from:(table:string)=>new Query(table),
 auth:{
  async getSession(){return {data:{session:session()},error:null};},
  onAuthStateChange(listener:(event:string,session:any)=>void){listeners.add(listener);return {data:{subscription:{unsubscribe:()=>{listeners.delete(listener);}}}};},
  async signInWithPassword(_credentials:any){
   // This is a demo entry, not a real authentication or password check.
   activeSession={user:{id:'demo-admin',email:'admin@example.invalid'}};
   try{window.sessionStorage.setItem(SESSION_KEY,'1');}catch{}
   announce('SIGNED_IN');return {data:{...activeSession,session:activeSession},error:null};
  },
  async signOut(){activeSession=null;try{window.sessionStorage.removeItem(SESSION_KEY);}catch{}announce('SIGNED_OUT');return {error:null};},
  async signUp({email}:{email:string;password?:string;options?:any}){return {data:{user:{id:crypto.randomUUID(),email}},error:null};}
 },
 channel:(_name:string,_options?:any)=>{
  const channel:any={on:()=>channel,subscribe:(callback?:any)=>{callback?.('SUBSCRIBED');return channel;},track:async()=>{},send:async()=>{showDemoMessage('Comando simulado de desconexão. Nenhuma sessão real foi afetada.');},presenceState:()=>({'demo-admin':[{user_id:'demo-admin',email:'admin@example.invalid'}]})};return channel;
 },
 removeChannel:(_channel:any)=>{}
};
export function createClient(_url:string,_key:string,_options?:any){return supabase;}
export async function demoFetch(input:string,init?:{method?:string;headers?:any;body?:string}):Promise<{ok:boolean;json:()=>Promise<any>}>{
 const url=new URL(input,'https://demo.invalid');
 if(url.hostname==='viacep.com.br')return {ok:true,json:async()=>({logradouro:'Rua Demonstrativa',bairro:'Bairro Exemplo',localidade:'Cidade Exemplo',uf:'BA'})};
 if(url.pathname==='/api/quote-portal'){
  const body=init?.body?JSON.parse(init.body):{};
  const token=body.token||url.searchParams.get('token');
  const row=database().quotes.find(quote=>quote.public_token===token);
  if(!row)return {ok:false,json:async()=>({error:'Este orçamento é local e só existe no navegador onde foi criado.'})};
  if(init?.method==='POST'){
   if(!['approve','reject'].includes(body.action))return {ok:false,json:async()=>({error:'Ação inválida.'})};
   row.status=body.action==='approve'?'Aprovado':'Reprovado';persist();
  }
  return {ok:true,json:async()=>({quote:clone(row)})};
 }
 throw new Error('Conexões externas não existem nesta demonstração.');
}
