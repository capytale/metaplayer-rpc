/**
 * Update all contracts docstrings, updating/adding the markdown link to the user's documentation.
 */

import * as fs from 'fs';

const DOC_SITE = 'https://doctechcapytale-d4cb18.forge.apps.education.fr/'
const PAGE = `${ DOC_SITE }capytale-metaplayer/02-contracts/`

const SRC = 'capytale/contracts/src/'
const TOKEN = '* Documentation :'



const updateFileMdLinks=(file:string)=>{
  const path = SRC + file
  const content = fs.readFileSync(path).toString()
  const updated = content.replace(/(\/\*\*.*?\*\/\n)(export \w+ )(\w+)/gs, updateMdLink)
  if(content!==updated){
    fs.writeFileSync(path, updated)
  }
}

const updateMdLink=(_:string, doc:string, kw:string, name:string)=>{
  const contract = typeToHtmlId(name)
  const link = `${ PAGE }${ contract }`
  const head = doc.split(TOKEN)[0].replace(/[*\s\/]+$/, "")
  return `${ head }
 *
 ${ TOKEN } [${ link }](${ link })
 */
${ kw }${ name }`
}

const typeToHtmlId=(name:string)=>{
  return '#'+name.replace(/V\d+$/, "")
                 .replace(/(?<=.)(?=[A-Z]+)/g, '-')
                 .toLowerCase()
}

const contractsFiles = fs.readdirSync(SRC).filter(f=>f.endsWith('.ts') && f!='index.ts')
contractsFiles.forEach(updateFileMdLinks)
