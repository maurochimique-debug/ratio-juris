// Testes sem rede: garantem reconhecimento genérico dos artigos por diploma e numeração.
import assert from 'node:assert/strict';
import {extract} from '../api/artigo-oficial.mjs';

const cases=[
 ['CLT, art. 780', 'Art. 779. Texto do artigo anterior.\nArt. 780. Os documentos juntados aos autos podem ser consultados.\nArt. 781. Texto do artigo seguinte.', '780', 'Art. 780.'],
 ['CPC, art. 1.009', 'Art. 1.008. A decisão substitui a sentença.\nArt. 1.009. Da sentença cabe apelação.\n§ 1º Questões resolvidas na fase de conhecimento.\nArt. 1.010. A apelação, interposta por petição.', '1009', 'Art. 1.009.'],
 ['CPC, art. 1009 sem ponto', 'Art. 1008. Texto anterior.\nArt. 1009. Da sentença cabe apelação.\nArt. 1010. Texto posterior.', '1009', 'Art. 1009.'],
 ['CPP, art. 28-A', 'Art. 28. Texto anterior.\nArt. 28-A. Não sendo caso de arquivamento do inquérito policial, observadas as condições legais.\nArt. 29. Texto posterior.', '28-A', 'Art. 28-A.'],
 ['CF, art. 5º', 'Art. 4º A República rege-se nas relações internacionais.\nArt. 5º Todos são iguais perante a lei, sem distinção de qualquer natureza.\nArt. 6º São direitos sociais.', '5', 'Art. 5º'],
 ['Lei com Artigo escrito por extenso', 'Artigo 20. Nas esferas administrativa, controladora e judicial, não se decidirá com base em valores jurídicos abstratos.\nArtigo 21. A decisão que decretar a invalidação de ato.', '20', 'Artigo 20.'],
 ['Documento com linhas HTML extraídas', 'Art.\n780. A juntada foi registrada.\nArt. 781. Seguinte.', '780', null],
 ['Artigo inexistente', 'Art. 70. Texto existente no diploma.\nArt. 71. Texto inexistente no exemplo.', '77', null],
 ['Evitar captura do art. 7801 para 780', 'Art. 7801. Texto de outro dispositivo distinto.\nArt. 7802. Outra referência.', '780', null],
 ['Evitar art. 28 para 28-A', 'Art. 28. Texto do artigo sem sufixo.\nArt. 29. Outro artigo.', '28-A', null]
];
let count=0;
for(const [name,text,number,expected] of cases){
 const result=extract(text,number);
 if(expected===null)assert.equal(result,null,name);
 else {assert.ok(result?.startsWith(expected),name);assert.ok(!result.includes('Art. 781.'),name);}
 count++;
}
console.log('PASS: '+count+' cenários de identificação de artigos, com fonte simulada e sem rede.');
