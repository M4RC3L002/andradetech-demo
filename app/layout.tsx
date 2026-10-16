import type {Metadata,Viewport} from 'next';
import './globals.css';
export const metadata:Metadata={title:'AndradeTech Demo | Teste o sistema',description:'Demonstração pública do AndradeTech com dados fictícios. Teste ordens de serviço, clientes, orçamentos, PDV, estoque e relatórios.',robots:{index:true,follow:true}};
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:'#0b1324',viewportFit:'cover'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body>{children}</body></html>;}
