/* Auditoria estrutural de provas oficiais Ratio Juris.
   Execute: node auditoria-oab.js
   Nao substitui verificacao documental da FGV/OAB ou teste visual no navegador. */
"use strict";
const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync("oab-data.js", "utf8"), sandbox, { filename: "oab-data.js" });
const data = sandbox.window.RATIO_OAB_DATA;
const pendentesEsperados = new Set([30, 13, 12, 11, 10]);
const erros = [];
let integrados = 0;
for (let numero = 47; numero >= 10; numero--) {
  const prova = data["exam" + numero];
  const catalogo = data.archive.find(e => e.exame === numero);
  if (!catalogo || !/^https:\/\//.test(catalogo.fgvUrl || "")) erros.push(numero + "º: pagina historica ausente");
  if (!prova) {
    if (!pendentesEsperados.has(numero)) erros.push(numero + "º: exame inesperadamente ausente");
    continue;
  }
  integrados++;
  if (pendentesEsperados.has(numero)) erros.push(numero + "º: atualizar lista de pendencias deste auditor");
  if (!Array.isArray(prova.gabaritos) || prova.gabaritos.length !== 4) {
    erros.push(numero + "º: nao ha quatro gabaritos"); continue;
  }
  for (const [i, chave] of prova.gabaritos.entries()) {
    if (typeof chave !== "string" || !/^[ABCD*]{80}$/.test(chave)) erros.push(numero + "º Tipo " + (i + 1) + ": chave invalida");
  }
  if (!Array.isArray(prova.cadernos) || prova.cadernos.length !== 4) {
    erros.push(numero + "º: nao ha quatro cadernos");
  } else {
    for (const [i, livro] of prova.cadernos.entries()) {
      if (livro.tipo !== i + 1 || !/^https:\/\//.test(livro.pdf || "")) erros.push(numero + "º: PDF do Tipo " + (i + 1) + " invalido");
    }
  }
  if (!/^https:\/\//.test(prova.gabaritoPDF || "")) erros.push(numero + "º: PDF de gabarito ausente");
  if (prova.correspondencia && (prova.correspondencia.length !== 80 ||
     prova.correspondencia.some(linha => !Array.isArray(linha) || linha.length !== 3 ||
       linha.some(n => !Number.isInteger(n) || n < 1 || n > 80)))) {
    erros.push(numero + "º: correspondencia entre tipos invalida");
  }
  if (prova.anulacoesPorTipo && (prova.anulacoesPorTipo.length !== 4 ||
    prova.anulacoesPorTipo.some((lista, i) => !Array.isArray(lista) ||
      lista.some(n => !Number.isInteger(n) || n < 1 || n > 80 || prova.gabaritos[i][n - 1] !== "*")))) {
    erros.push(numero + "º: anulacoes nao conciliadas com asteriscos");
  }
}
const declarados = data.metadata.examesCorrigiveis || [];
const realmenteIntegrados = Array.from({length:38}, (_,i) => 47-i).filter(n => !!data["exam"+n]);
if (JSON.stringify(declarados) !== JSON.stringify(realmenteIntegrados)) erros.push("metadata.examesCorrigiveis divergente");
console.log("Integrados:", integrados + "/38", "| Pendentes:", [...pendentesEsperados].join(", "));
if (erros.length) { console.error(erros.join("\n")); process.exitCode = 1; }
else console.log("PASS: auditoria estrutural; nao atesta conteudo integral, links HTTP ou renderizacao mobile.");
