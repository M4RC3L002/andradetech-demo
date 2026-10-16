import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
class MemoryStorage{map=new Map();getItem(key){return this.map.get(key)??null}setItem(key,value){this.map.set(key,String(value))}removeItem(key){this.map.delete(key)}}
const setup=async(storage=new MemoryStorage())=>{
 global.window={localStorage:storage,sessionStorage:new MemoryStorage(),dispatchEvent:()=>true};
 return import(new URL('../components/demo-store.ts',import.meta.url).href+'?case='+Math.random());
};
test('CRUD local persiste e pode ser restaurado sem rede',async()=>{
 const store=await setup();store.resetDemo();
 await store.supabase.from('clients').upsert({id:'teste',name:'Cliente de teste',password:'nao-salvar'});
 assert.equal((await store.supabase.from('clients').select().eq('id','teste').single()).data.name,'Cliente de teste');
 assert.equal(store.exportDemo().clients.find(x=>x.id==='teste').password,undefined);
 await store.supabase.from('clients').update({name:'Cliente alterado'}).eq('id','teste');
 assert.equal((await store.supabase.from('clients').select().eq('id','teste').single()).data.name,'Cliente alterado');
 await store.supabase.from('clients').delete().eq('id','teste');
 assert.equal((await store.supabase.from('clients').select().eq('id','teste').single()).data,null);
 store.resetDemo();assert.equal(store.exportDemo().clients.length,2);
});
test('visitantes em armazenamentos separados não compartilham dados',async()=>{
 const first=new MemoryStorage();const a=await setup(first);await a.supabase.from('clients').insert({id:'privado',name:'Exemplo'});
 const b=await setup(new MemoryStorage());assert.equal(b.exportDemo().clients.some(x=>x.id==='privado'),false);
 const reloaded=await setup(first);assert.equal(reloaded.exportDemo().clients.some(x=>x.id==='privado'),true);
});
test('estoque e orçamento são locais; endpoints desconhecidos falham fechados',async()=>{
 const s=await setup();s.resetDemo();await s.supabase.from('products').update({stock:2}).eq('id','1001');assert.equal(s.exportDemo().products[0].stock,2);
 const result=await s.demoFetch('/api/quote-portal',{method:'POST',body:JSON.stringify({token:'demo-orcamento',action:'approve'})});assert.equal((await result.json()).quote.status,'Aprovado');
 await assert.rejects(()=>s.demoFetch('https://producao.invalid/api/pagamento'));
});
test('entrada e usuários são fictícios; senha não é persistida',async()=>{
 const s=await setup();assert.equal((await s.supabase.auth.getSession()).data.session,null);await s.supabase.auth.signInWithPassword({});assert.equal((await s.supabase.auth.getSession()).data.session.user.id,'demo-admin');
 const user=await s.supabase.auth.signUp({email:'novo@example.invalid',password:'descartada'});assert.ok(user.data.user.id);await s.supabase.auth.signOut();assert.equal((await s.supabase.auth.getSession()).data.session,null);
});
test('armazenamento inválido retorna aos exemplos',async()=>{
 const storage=new MemoryStorage();storage.setItem('andradetech-demo-data-v1','{malformado');const s=await setup(storage);assert.equal(s.exportDemo().orders.length,2);
});
test('fonte não contém conexões ou cobrança do sistema real',()=>{
 const source=fs.readFileSync(new URL('../components/andradetech-app.tsx',import.meta.url),'utf8');
 assert.doesNotMatch(source,/supabase\.co|@supabase\/supabase-js|infinitepay|qrserver|window\.open|https:\/\/wa\.me/);
 assert.doesNotMatch(source,/(?<!demo)fetch\(/);
 const config=fs.readFileSync(new URL('../next.config.mjs',import.meta.url),'utf8');assert.match(config,/connect-src 'none'/);
});
