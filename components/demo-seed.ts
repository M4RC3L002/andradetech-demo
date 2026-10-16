const DEFAULT_STATUSES = [
  { id: '1', label: 'Entrada', dot: '#64748B' },
  { id: '2', label: 'Orçamento', dot: '#F59E0B' },
  { id: '3', label: 'Aprovado', dot: '#10B981' },
  { id: '4', label: 'Em Análise', dot: '#007BFF' },
  { id: '5', label: 'Aguardando Aprovação', dot: '#EAB308' },
  { id: '6', label: 'Aguardando Peça', dot: '#8A2BE2' },
  { id: '7', label: 'Finalizado', dot: '#10B981' },
  { id: '8', label: 'Entregue', dot: '#059669' },
  { id: '9', label: 'Cancelado', dot: '#EF4444' },
]

const DEFAULT_SERVICES = [
  { id: '1', name: 'Troca de Tela', default_price: 350, category: 'Hardware' },
  { id: '2', name: 'Reparo de Bateria', default_price: 180, category: 'Hardware' },
  { id: '3', name: 'Formatação + SO', default_price: 150, category: 'Software' },
  { id: '4', name: 'Limpeza Interna e Pasta', default_price: 120, category: 'Manutenção' },
  { id: '5', name: 'Troca de Conector de Carga', default_price: 130, category: 'Hardware' },
  { id: '6', name: 'Diagnóstico e Orçamento', default_price: 0, category: 'Diagnóstico' },
]

const DEFAULT_PRODUCTS = [
  { id: '1001', name: 'SSD 480GB Kingston', brand: 'Kingston', category: 'Armazenamento', cost_price: 130, sale_price: 240, stock: 4 },
  { id: '1002', name: 'Tela iPhone 11 Incell', brand: 'Apple', category: 'Telas', cost_price: 110, sale_price: 250, stock: 2 },
  { id: '1003', name: 'Fonte ATX 500W', brand: 'Corsair', category: 'Fontes', cost_price: 160, sale_price: 280, stock: 3 },
]


export const modules=['dashboard','orders','quotes','clients','pdv','revenue','users','settings'];
export function makeSeed() {
 const day=new Date().toLocaleDateString('pt-BR');
 const created=new Date().toISOString();
 return {
 profiles:[
 {id:'demo-admin',email:'admin@example.invalid',name:'Administrador Demo',role:'admin',active:true,modules,created_at:created},
 {id:'demo-tecnico',email:'tecnico@example.invalid',name:'Técnico Demo',role:'technician',active:true,modules:['dashboard','orders','quotes'],created_at:created}
 ],
 clients:[
 {id:'demo-cliente-1',name:'Cliente Exemplo A',phone:'00000000000',email:'cliente-a@example.invalid',cpf:'',cep:'00000000',address:'Rua Demonstrativa, 10',address_number:'10',city:'Cidade Exemplo',total_orders:2,total_spent:470,last_service:day,devices:['Notebook Exemplo','Smartphone Exemplo']},
 {id:'demo-cliente-2',name:'Cliente Exemplo B',phone:'00000000000',email:'cliente-b@example.invalid',cpf:'',cep:'00000000',address:'Avenida de Teste, 20',address_number:'20',city:'Cidade Exemplo',total_orders:1,total_spent:150,last_service:day,devices:['Desktop Exemplo']}
 ],
 orders:[
 {id:'OS-DEMO-101',client:'Cliente Exemplo A',phone:'00000000000',device:'Notebook Exemplo',service:'Limpeza Interna e Pasta',status:'Em Análise',value:120,date:day,technician:'Técnico Demo',notes:'Registro fictício. Teste os estágios, itens e impressão.',items:[{desc:'Limpeza Interna e Pasta',qty:1,unit:120}],created_at:created},
 {id:'OS-DEMO-102',client:'Cliente Exemplo B',phone:'00000000000',device:'Desktop Exemplo',service:'Formatação + SO',status:'Finalizado',value:150,date:day,technician:'Administrador Demo',notes:'Serviço fictício concluído para testar relatórios.',items:[{desc:'Formatação + SO',qty:1,unit:150}],created_at:created}
 ],
 quotes:[{id:'ORC-DEMO-201',client:'Cliente Exemplo A',phone:'00000000000',device:'Smartphone Exemplo',description:'Troca de tela demonstrativa',value:350,valid_until:new Date(Date.now()+7*86400000).toLocaleDateString('pt-BR'),created_at:created,status:'Pendente',items:[{desc:'Troca de Tela',qty:1,unit:350}],public_token:'demo-orcamento'}],
 sales:[{id:'VENDA-DEMO-301',client:'Cliente Exemplo B',phone:'00000000000',cpf:'',payment_method:'Dinheiro',items:[{desc:'SSD 480GB Kingston',qty:1,unit:240}],total:240,date:day,created_at:created}],
 services:structuredClone(DEFAULT_SERVICES),products:structuredClone(DEFAULT_PRODUCTS),statuses:structuredClone(DEFAULT_STATUSES)
 };
}

