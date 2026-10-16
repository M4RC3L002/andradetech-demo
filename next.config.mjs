import {lstatSync} from 'node:fs';
import path from 'node:path';
const linked=lstatSync(path.join(process.cwd(),'node_modules')).isSymbolicLink();
const policy="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'none'; frame-src 'none'; object-src 'none'; form-action 'none'; base-uri 'self'; frame-ancestors 'none'";
export default {turbopack:{root:linked?path.resolve(process.cwd(),'..'):process.cwd()},async headers(){return [{source:'/:path*',headers:[{key:'Content-Security-Policy',value:policy},{key:'Referrer-Policy',value:'no-referrer'},{key:'X-Content-Type-Options',value:'nosniff'}]}]}};
