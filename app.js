const L=[[7,'Application','HTTP, DNS, DHCP, FTP','#8e5ab5'],[6,'Presentation','Formato, Cifrado','#536d9d'],[5,'Session','Establece, mantiene','#1a73a8'],[4,'Transport','TCP, UDP','#34a853'],[3,'Network','IP, ICMP','#f9ab00'],[2,'Data Link de Data','Ethernet, ARP','#ff6d00'],[1,'Physical','Señales, Bits','#ea4335']];for(const [n,a,d,c] of L){layers.innerHTML+=`<div class="layer" style="--c:${c}"><b>${n}</b><strong>${a}</strong><small>${d}</small></div>`;live.innerHTML+=`<div class="live" data-n="${n}" style="--c:${c}"><b>${n}</b>${a}</div>`}const S=[['Los datos se generan en la aplicación. El navegador prepara una solicitud HTTP para www.google.com.','La capa de Application genera los datos HTTP.'],['TCP agrega su encabezado con los puertos de origen y destino.','TCP encapsula los datos en un segmento.'],['IPv4 agrega direcciones IP y TTL inicial de 64.','Se crea el paquete IP para el enrutamiento.'],['Ethernet agrega MAC, EtherType y FCS.','Se crea la trama para el enlace local.'],['La información se transmite como bits.','La capa Physical transporta la señal.'],['El router elimina la trama de entrada, analiza IP y reduce el TTL.','El router procesa el paquete y selecciona el siguiente salto.'],['Se construye una nueva trama Ethernet para el siguiente enlace.','Las MAC cambian salto a salto; las IP permanecen.'],['La solicitud llega al servidor de Google y se desencapsula.','El servidor procesa la solicitud HTTP.']];let i=0,t;function draw(){step.innerHTML=`<b>Step ${i+1} de ${S.length}:</b> ${S[i][0]}`;info.textContent=S[i][1];dots.innerHTML=S.map((x,k)=>`<i class="dot ${k===i?'active':''}"></i>`).join('');document.querySelectorAll('.live').forEach(x=>x.classList.toggle('active',+x.dataset.n===Math.max(1,7-i)));ttl.textContent=i>=5?63:64}function stopSimulation(){if(t!==undefined&&t!==null){clearInterval(t);t=null}play.textContent='▶'}
function startSimulation(){if(t!==undefined&&t!==null)return;play.textContent='❚❚';t=setInterval(()=>{i=(i+1)%S.length;draw()},5000)}
next.onclick=()=>{stopSimulation();i=(i+1)%S.length;draw()};
prev.onclick=()=>{stopSimulation();i=(i+S.length-1)%S.length;draw()};
play.onclick=()=>{if(t!==undefined&&t!==null){stopSimulation()}else{startSimulation()}};
draw();

/* ===== ADDITIVE INTERACTIVE MODULES — v1.1 preserved ===== */
const tcpipLayers=[
 [4,'Application','HTTP, DNS, DHCP, FTP','#8e5ab5','Data','Agrupa las funciones de Application, Presentation y Session del modelo OSI.'],
 [3,'Transport','TCP, UDP','#34a853','Segmento / Datagrama','Transporta datos entre procesos y utiliza puertos.'],
 [2,'Internet','IP, ICMP','#f9ab00','Paquete','Realiza direccionamiento lógico y encaminamiento entre redes.'],
 [1,'Network Access','Ethernet, Wi-Fi, ARP','#ff6d00','Trama / Bits','Agrupa las funciones de Data Link de Data y Physical.']
];
let interactiveModel='osi';
const originalLayers=L.map(x=>[...x]);
const originalDraw=draw;

function renderModelPanels(){
  layers.innerHTML='';
  live.innerHTML='';
  const list=interactiveModel==='osi'?originalLayers:tcpipLayers;
  for(const [n,a,d,c] of list){
    layers.innerHTML+=`<div class="layer" style="--c:${c}"><b>${n}</b><strong>${a}</strong><small>${d}</small></div>`;
    live.innerHTML+=`<div class="live" data-n="${n}" style="--c:${c}"><b>${n}</b>${a}</div>`;
  }
  drawForCurrentModel();
}
function drawForCurrentModel(){
  originalDraw();
  if(interactiveModel==='tcpip'){
    const map=[4,3,2,1,1,2,1,4];
    document.querySelectorAll('.live').forEach(x=>x.classList.toggle('active',+x.dataset.n===map[i]));
  }
}

document.querySelectorAll('#modelToggle button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    stopSimulation();
    interactiveModel=btn.dataset.model;
    document.querySelectorAll('#modelToggle button').forEach(b=>b.classList.toggle('model-active',b===btn));
    renderModelPanels();
  });
});

const workspace=document.getElementById('interactiveWorkspace');
const main=document.querySelector('main');

function activateView(view){
  stopSimulation();
  document.querySelectorAll('#mainNav button').forEach(b=>b.classList.toggle('nav-active',b.dataset.view===view));
  if(view==='simulate'){
    workspace.classList.remove('show');
    main.style.display='grid';
    drawForCurrentModel();
    return;
  }
  main.style.display='none';
  workspace.classList.add('show');
  if(view==='learn') renderLearn();
  if(view==='build') renderBuild();
  if(view==='inspect') renderInspect();
  if(view==='coding') renderCoding();
  if(view==='lab') renderNetworkLab();
}
document.querySelectorAll('#mainNav button').forEach(btn=>btn.addEventListener('click',()=>activateView(btn.dataset.view)));

function getLearnData(){
  if(interactiveModel==='tcpip') return tcpipLayers;
  return originalLayers.map(x=>{
    const extra={
      7:['Data','Es el punto donde las aplicaciones utilizan servicios de red y generan información para comunicar.'],
      6:['Data','Se relaciona con la representación, codificación, cifrado y compresión de los datos.'],
      5:['Data','Organiza el establecimiento, mantenimiento y finalización de sesiones de comunicación.'],
      4:['Segmento / Datagrama','Transporta información entre procesos through puertos y protocolos como TCP y UDP.'],
      3:['Paquete','Agrega direccionamiento IP y permite el encaminamiento entre diferentes redes.'],
      2:['Trama','Construye tramas para el enlace local y utiliza direcciones MAC y tecnologías como Ethernet.'],
      1:['Bits','Representa la transmisión through señales eléctricas, ópticas o inalámbricas.']
    }[x[0]];
    return [...x,extra[0],extra[1]];
  });
}

function renderLearn(){
  workspace.innerHTML=`<section>
    <div class="workspaceTitle">
      <h2>APRENDER — Modelos OSI y TCP/IP</h2>
      <p>Primero comprende los dos modelos y su relación. Después selecciona una capa para estudiarla en detalle.</p>
    </div>

    <div class="learnTopTabs" id="learnTopTabs">
      <button class="learnTab active" data-learn="overview">VISIÓN GENERAL</button>
      <button class="learnTab" data-learn="osi">MODELO OSI</button>
      <button class="learnTab" data-learn="tcpip">MODELO TCP/IP</button>
      <button class="learnTab" data-learn="compare">COMPARAR</button>
      <button class="learnTab" data-learn="layers">EXPLORAR CAPAS</button>
    </div>

    <div id="learnPanel"></div>
  </section>`;

  const panel = document.getElementById('learnPanel');
  const tabs = document.querySelectorAll('.learnTab');

  function setTab(name){
    tabs.forEach(t=>t.classList.toggle('active', t.dataset.learn===name));
    if(name==='overview') renderOverview();
    if(name==='osi') renderOSIIntro();
    if(name==='tcpip') renderTCPIPIntro();
    if(name==='compare') renderCompare();
    if(name==='layers') renderLayers();
  }

  function renderOverview(){
    panel.innerHTML=`
      <div class="modelOverviewGrid">
        <div class="modelIntroCard">
          <div class="modelBadge osiBadge">7 CAPAS</div>
          <h2>OSI Model</h2>
          <p>El modelo OSI organiza las funciones de comunicación de red en siete capas. Su gran utilidad es servir como una referencia conceptual para separar y estudiar las distintas responsabilidades que intervienen cuando dos sistemas se comunican.</p>
          <button class="learnJump" data-jump="osi">Explorar OSI</button>
        </div>
        <div class="modelIntroCard">
          <div class="modelBadge tcpipBadge">4 CAPAS</div>
          <h2>TCP/IP Model</h2>
          <p>El modelo TCP/IP representa la arquitectura de comunicación utilizada por la familia de protocolos TCP/IP. Agrupa varias funciones que en OSI aparecen separadas, formando un modelo normalmente representado through cuatro capas.</p>
          <button class="learnJump" data-jump="tcpip">Explorar TCP/IP</button>
        </div>
      </div>
      <div class="learnConcept">
        <h3>La idea más importante</h3>
        <p>Los modelos no describen dos redes diferentes. Son <b>dos formas de organizar y comprender las funciones de la comunicación</b>. Cuando un dispositivo utiliza HTTP, TCP, IP y Ethernet, podemos analizar ese mismo proceso utilizando la separación detallada del modelo OSI o la agrupación funcional del modelo TCP/IP.</p>
      </div>
      <div class="quickMap">
        <div><b>OSI</b><span>7 capas para analizar funciones con mayor detalle.</span></div>
        <div><b>TCP/IP</b><span>4 capas que agrupan esas funciones dentro de una arquitectura de protocolos.</span></div>
        <div><b>Relación</b><span>Ambos permiten estudiar el mismo proceso de comunicación desde perspectivas organizativas diferentes.</span></div>
      </div>`;
    panel.querySelectorAll('.learnJump').forEach(b=>b.onclick=()=>setTab(b.dataset.jump));
  }

  function renderOSIIntro(){
    const rows=[
      ['7','Application','Servicios de red utilizados por las aplicaciones.','#8e5ab5'],
      ['6','Presentation','Representación, formato, cifrado y compresión.','#536d9d'],
      ['5','Session','Establecimiento y gestión de sesiones.','#1a73a8'],
      ['4','Transport','Comunicación entre procesos y uso de puertos.','#34a853'],
      ['3','Network','Direccionamiento lógico y encaminamiento.','#f9ab00'],
      ['2','Data Link de Data','Comunicación en el enlace local y tramas.','#ff6d00'],
      ['1','Physical','Transmisión de bits y señales.','#ea4335']
    ];
    panel.innerHTML=`
      <div class="modelExplanation">
        <h2>OSI Model — 7 capas</h2>
        <p>OSI divide el proceso de comunicación en siete niveles. Esta separación permite estudiar con precisión qué responsabilidad cumple cada capa y facilita el análisis de protocolos, dispositivos, encapsulación y problemas de red.</p>
        <p>Una forma útil de entenderlo es observar cómo la información puede pasar desde una aplicación hacia capas cada vez más cercanas al medio físico. En el destino, el proceso se analiza en sentido inverso.</p>
      </div>
      <div class="stackCard osiStack">${rows.map(r=>`<button class="stackLayer" data-layer="${r[0]}" style="--c:${r[3]}"><b>${r[0]}</b><span>${r[1]}</span><small>${r[2]}</small></button>`).join('')}</div>
      <div class="learnHint">Haz clic en una capa para abrirla en <b>EXPLORAR CAPAS</b>.</div>`;
    panel.querySelectorAll('.stackLayer').forEach(b=>b.onclick=()=>{interactiveModel='osi';setTab('layers');setTimeout(()=>selectLayerByNumber(+b.dataset.layer),0)});
  }

  function renderTCPIPIntro(){
    const rows=[
      ['4','Application','Agrupa funciones de Application, Presentation y Session de OSI.','#8e5ab5','HTTP · DNS · DHCP · FTP'],
      ['3','Transport','Mantiene la comunicación entre procesos.','#34a853','TCP · UDP'],
      ['2','Internet','Direccionamiento IP y encaminamiento entre redes.','#f9ab00','IP · ICMP'],
      ['1','Network Access','Agrupa funciones del enlace y del medio físico.','#ff6d00','Ethernet · Wi‑Fi · ARP']
    ];
    panel.innerHTML=`
      <div class="modelExplanation">
        <h2>TCP/IP Model — 4 capas</h2>
        <p>El modelo TCP/IP organiza la comunicación en cuatro capas. La diferencia principal frente a OSI es que varias funciones que OSI separa en capas individuales aparecen agrupadas.</p>
        <p>Por ejemplo, las funciones de Application, Presentation y Session del modelo OSI se concentran normalmente en la capa de Application de TCP/IP. Del mismo modo, las funciones relacionadas con Data Link de Data y Physical se agrupan en Network Access.</p>
      </div>
      <div class="stackCard tcpipStack">${rows.map(r=>`<button class="stackLayer" data-layer="${r[0]}" style="--c:${r[3]}"><b>${r[0]}</b><span>${r[1]}</span><small>${r[2]}<br>${r[4]}</small></button>`).join('')}</div>
      <div class="learnConcept">
        <h3>¿Cómo funciona en una comunicación?</h3>
        <p>Una aplicación puede generar datos utilizando un protocolo como HTTP. La capa de Transport puede utilizar TCP o UDP. Después, Internet utiliza IP para el direccionamiento entre redes. Finalmente, la capa de Network Access permite transportar esa información sobre una tecnología concreta, como Ethernet o Wi‑Fi.</p>
      </div>
      <div class="learnHint">Haz clic en una capa para abrirla en <b>EXPLORAR CAPAS</b>.</div>`;
    panel.querySelectorAll('.stackLayer').forEach(b=>b.onclick=()=>{interactiveModel='tcpip';setTab('layers');setTimeout(()=>selectLayerByNumber(+b.dataset.layer),0)});
  }

  function renderCompare(){
    const maps=[
      [['Application','Presentation','Session'],['Application']],
      [['Transport'],['Transport']],
      [['Network'],['Internet']],
      [['Data Link de Data','Physical'],['Network Access']]
    ];
    panel.innerHTML=`
      <div class="modelExplanation">
        <h2>OSI ↔ TCP/IP — Relación entre las capas</h2>
        <p>Esta comparación permite ver por qué ambos modelos pueden utilizarse para estudiar una misma comunicación. TCP/IP no agrega una capa equivalente para cada capa OSI: en algunos casos <b>agrupa varias responsabilidades</b>.</p>
      </div>
      <div class="compareTable">
        <div class="compareHead">MODELO OSI</div><div class="compareHead center">RELACIÓN</div><div class="compareHead">MODELO TCP/IP</div>
        ${maps.map((m,k)=>`<div class="compareOSI">${m[0].map(x=>`<div class="compareLayer osi${k}">${x}</div>`).join('')}</div><div class="compareArrow">→<br><small>${k===0?'Agrupa 3 capas':k===1?'Equivalencia directa':k===2?'Función de red':'Agrupa 2 capas'}</small></div><div class="compareTCP"><div class="compareLayer tcp${k}">${m[1][0]}</div></div>`).join('')}
      </div>
      <div class="differenceGrid">
        <div><h3>OSI</h3><p>Permite separar las responsabilidades con mayor granularidad, por eso resulta especialmente útil para aprender, analizar y clasificar funciones de red.</p></div>
        <div><h3>TCP/IP</h3><p>Organiza las funciones alrededor de la arquitectura de protocolos TCP/IP y agrupa varias responsabilidades que OSI presenta por separado.</p></div>
      </div>
      <div class="learnConcept">
        <h3>Ejemplo mental: abrir una página web</h3>
        <p><b>OSI:</b> podemos analizar la aplicación, el transporte, el direccionamiento IP, la trama local y finalmente la señal física por separado.</p>
        <p><b>TCP/IP:</b> podemos analizar el mismo recorrido como Application → Transport → Internet → Network Access.</p>
      </div>`;
  }

  function renderLayers(){
    const data=getLearnData();
    panel.innerHTML=`
      <div class="exploreBar">
        <div><h2>EXPLORAR CAPAS</h2><p>Modelo activo: <b>${interactiveModel==='osi'?'OSI — 7 capas':'TCP/IP — 4 capas'}</b></p></div>
        <div class="exploreSwitch"><button id="exploreOSI" class="${interactiveModel==='osi'?'active':''}">OSI</button><button id="exploreTCP" class="${interactiveModel==='tcpip'?'active':''}">TCP/IP</button></div>
      </div>
      <div class="studyGrid"><div class="studyMenu" id="studyMenu"></div><div class="studyContent" id="studyContent"></div></div>`;
    const menu=document.getElementById('studyMenu');
    data.forEach((x,k)=>menu.innerHTML+=`<button class="studyItem ${k===0?'active':''}" data-k="${k}" data-layer="${x[0]}" style="--c:${x[3]}"><b>${x[0]}. ${x[1]}</b><small>${x[2]}</small></button>`);

    function select(k){
      const x=data[k];
      document.querySelectorAll('.studyItem').forEach(e=>e.classList.toggle('active',+e.dataset.k===k));
      studyContent.innerHTML=`
        <h2 style="color:${x[3]}">${x[0]}. ${x[1]}</h2>
        <p>${x[5]}</p>
        <div class="studyFacts"><div class="studyFact"><b>Función</b>${x[2]}</div><div class="studyFact"><b>PDU</b>${x[4]}</div><div class="studyFact"><b>Modelo</b>${interactiveModel==='osi'?'OSI':'TCP/IP'}</div></div>
        <h4>Protocolos / tecnologías</h4>
        ${x[2].split(',').map(v=>`<span class="tag">${v.trim()}</span>`).join('')}
        <div class="layerConnection">${layerConnection(x[0],interactiveModel)}</div>`;
    }
    window.selectLayerByNumber=function(n){
      const target=[...document.querySelectorAll('.studyItem')].find(e=>+e.dataset.layer===n);
      if(target) target.click();
    }
    document.querySelectorAll('.studyItem').forEach(e=>e.addEventListener('click',()=>select(+e.dataset.k)));
    document.getElementById('exploreOSI').onclick=()=>{interactiveModel='osi';renderLayers()};
    document.getElementById('exploreTCP').onclick=()=>{interactiveModel='tcpip';renderLayers()};
    select(0);
  }

  function layerConnection(n,m){
    if(m==='tcpip'){
      const t={4:'Esta capa reúne funciones que en OSI se distribuyen entre Application, Presentation y Session.',3:'Se relaciona directamente con la capa de Transport de OSI.',2:'Cumple una función comparable a la capa de Network del modelo OSI.',1:'Agrupa funciones relacionadas con Data Link de Data y Physical del modelo OSI.'};
      return `<div class="learnConcept"><b>Relación con OSI:</b> ${t[n]}</div>`;
    }
    const t={7:'En TCP/IP se integra dentro de la capa de Application.',6:'En TCP/IP se integra dentro de la capa de Application.',5:'En TCP/IP se integra dentro de la capa de Application.',4:'En TCP/IP corresponde a la capa de Transport.',3:'En TCP/IP corresponde funcionalmente a la capa de Internet.',2:'En TCP/IP se agrupa dentro de Network Access.',1:'En TCP/IP se agrupa dentro de Network Access.'};
    return `<div class="learnConcept"><b>Relación con TCP/IP:</b> ${t[n]}</div>`;
  }

  tabs.forEach(t=>t.onclick=()=>setTab(t.dataset.learn));
  renderOverview();
}

function renderBuild(){
  workspace.innerHTML=`<section><div class="workspaceTitle"><h2>CONSTRUIR — Encapsulación interactiva</h2><p>Modifica los datos y observa cómo cambian el segmento, el paquete IP y la trama Ethernet.</p></div><div class="builderGrid"><div class="builderControls"><div class="field"><label>Transport</label><select id="buildTransport"><option>TCP</option><option>UDP</option></select></div><div class="field"><label>Data de aplicación (bytes)</label><input id="buildData" type="number" value="85" min="1"></div><div class="field"><label>IP origen</label><input id="buildSrc" value="192.168.1.10"></div><div class="field"><label>IP destino</label><input id="buildDst" value="142.250.72.14"></div></div><div class="builderPreview" id="builderPreview"></div></div></section>`;
  function calc(){
    const d=Math.max(1,+buildData.value||1);
    const proto=buildTransport.value;
    const th=proto==='TCP'?20:8;
    const segment=d+th, ip=segment+20, payload=Math.max(ip,46), padding=Math.max(0,46-ip), frame=14+payload+4;
    builderPreview.innerHTML=`<h3>Resultado</h3><div class="box app"><b>DATOS DE APLICACIÓN</b><br>${d} bytes</div><div class="row"><div class="box tcp"><b>${proto} HEADER</b><br>${th} bytes</div><div class="box app small"><b>${proto} PDU</b><br>${segment} bytes</div></div><div class="row"><div class="box ip"><b>IP HEADER</b><br>${buildSrc.value} → ${buildDst.value}</div><div class="box tcp small"><b>IP PACKET</b><br>${ip} bytes</div></div><div class="row"><div class="box eth"><b>ETHERNET HEADER</b><br>14 bytes</div><div class="box ip small"><b>PAYLOAD</b><br>${payload} bytes</div><div class="box eth fcs"><b>FCS</b><br>4 bytes</div></div><p><b>Total:</b> 14 + ${payload} + 4 = <b>${frame} bytes</b>${padding?`<br><b>Padding:</b> ${padding} bytes para alcanzar el mínimo de 46 bytes de payload Ethernet.`:''}</p>`;
  }
  [buildTransport,buildData,buildSrc,buildDst].forEach(e=>e.addEventListener('input',calc));
  calc();
}

function renderInspect(){
  const fields=[
    ['PREÁMBULO','8 B','#777',8,'Sincroniza la recepción antes de la transmisión.'],
    ['DEST MAC','6 B','#1a73a8',6,'Identifica el destinatario dentro del enlace local.'],
    ['SRC MAC','6 B','#34a853',6,'Identifica la interfaz que transmite la trama.'],
    ['TYPE','2 B','#f9ab00',2,'Indica el protocolo transportado; por ejemplo 0x0800 para IPv4.'],
    ['PAYLOAD','46–1500 B','#8e5ab5',15,'Contiene la PDU de la capa superior y puede incluir padding.'],
    ['FCS','4 B','#ea4335',4,'Se utiliza para detección de errores through CRC.']
  ];
  const ieee=[
    ['802.3','Ethernet','Estándar de redes Ethernet cableadas. Define tecnologías relacionadas con el acceso al medio y la transmisión en redes LAN.','Data Link de Data / Physical','Ethernet sobre medios físicos'],
    ['802.11','Wi‑Fi','Familia de estándares para redes LAN inalámbricas. Utiliza el medio radioeléctrico y mecanismos específicos para el acceso inalámbrico.','Data Link de Data / Physical','Networkes WLAN'],
    ['802.1Q','VLAN','Estándar utilizado para identificar VLAN through etiquetado dentro de tramas Ethernet, permitiendo segmentación lógica de redes.','Data Link de Data','Etiquetado VLAN'],
    ['802.1D','Bridging y STP','Estándar históricamente asociado al funcionamiento de bridges y Spanning Tree Protocol para evitar bucles de Capa 2.','Data Link de Data','Conmutación y prevención de bucles'],
    ['802.1X','Control de acceso','Proporciona un marco de control de acceso basado en autenticación para permitir o restringir el acceso a una red.','Data Link de Data','Autenticación de acceso']
  ];
  workspace.innerHTML=`<section><div class="workspaceTitle"><h2>INSPECCIONAR — Ethernet e IEEE 802.*</h2><p>Explora la estructura de una trama Ethernet y después navega por algunos estándares importantes de la familia IEEE 802.</p></div>
  <div class="inspectGrid"><div class="inspectBox"><h3>Trama Ethernet</h3><div class="inspectFields" id="inspectFields"></div><p id="inspectText">Selecciona un campo.</p></div><div class="inspectBox"><h3>Longitud mínima</h3><p>Desde Destination MAC hasta FCS, una trama Ethernet mínima tiene <b>64 bytes</b>: 14 bytes de encabezado + mínimo 46 bytes de payload + 4 bytes de FCS.</p></div></div>
  <div class="workspaceTitle" style="margin-top:20px"><h2>Familia IEEE 802.*</h2><p>Selecciona un estándar para revisar qué tecnología representa y en qué parte del estudio de redes aparece.</p></div><div class="ieeeTabs" id="ieeeTabs"></div><div class="ieeeDetail" id="ieeeDetail"></div></section>`;
  fields.forEach((x,k)=>inspectFields.innerHTML+=`<div class="inspectField" data-k="${k}" style="--c:${x[2]};--f:${x[3]}"><b>${x[0]}<br>${x[1]}</b></div>`);
  document.querySelectorAll('.inspectField').forEach(e=>e.addEventListener('click',()=>{
    const x=fields[+e.dataset.k];
    document.querySelectorAll('.inspectField').forEach(q=>q.classList.toggle('active',q===e));
    inspectText.innerHTML=`<b>${x[0]}:</b> ${x[4]}`;
  }));
  ieee.forEach((x,k)=>ieeeTabs.innerHTML+=`<button data-k="${k}" class="${k===0?'active':''}">${x[0]}</button>`);
  function showIEEE(k){
    const x=ieee[k];
    document.querySelectorAll('#ieeeTabs button').forEach(b=>b.classList.toggle('active',+b.dataset.k===k));
    ieeeDetail.innerHTML=`<h3>${x[0]} — ${x[1]}</h3><p>${x[2]}</p><div class="ieeeFacts"><div class="studyFact"><b>Modelo</b>${x[3]}</div><div class="studyFact"><b>Uso principal</b>${x[4]}</div><div class="studyFact"><b>Familia</b>IEEE 802.*</div></div>`;
  }
  document.querySelectorAll('#ieeeTabs button').forEach(b=>b.addEventListener('click',()=>showIEEE(+b.dataset.k)));
  showIEEE(0);
}



function renderCoding(){
  workspace.innerHTML=`<section>
    <div class="workspaceTitle">
      <h2>CODIFICACIÓN — Manchester y 4B/5B</h2>
      <p>Explora dos técnicas relacionadas con la transmisión de datos. Manchester muestra cómo se representan bits through transiciones de señal. 4B/5B muestra cómo grupos de 4 bits se transforman en códigos de 5 bits antes de su transmisión física.</p>
    </div>

    <div class="codingTabs">
      <button class="codingTab active" data-coding="manchester">MANCHESTER</button>
      <button class="codingTab" data-coding="4b5b">4B/5B</button>
      <button class="codingTab" data-coding="compare">COMPARAR</button>
    </div>
    <div id="codingPanel"></div>
  </section>`;

  const panel = document.getElementById('codingPanel');

  function setCoding(mode){
    document.querySelectorAll('.codingTab').forEach(b=>b.classList.toggle('active', b.dataset.coding===mode));
    if(mode==='manchester') renderManchesterPanel();
    if(mode==='4b5b') render4B5BPanel();
    if(mode==='compare') renderCodingCompare();
  }

  function renderManchesterPanel(){
    panel.innerHTML=`
      <div class="codingIntro">
        <h2>Manchester</h2>
        <p>En esta visualización, cada bit ocupa un período de tiempo y contiene una transición en el centro. La transición permite representar el valor del bit y proporciona una referencia temporal dentro de cada período.</p>
        <div class="conventionBox"><b>Convención utilizada aquí:</b> 0 = Alto → Bajo · 1 = Bajo → Alto. Existen convenciones que pueden invertir esta asignación; lo importante es que cada bit contiene la transición central característica.</div>
      </div>
      <div class="manchesterControls">
        <div>
          <label><b>Secuencia de bits</b></label>
          <input id="manBits" class="bitInput" value="10110010" maxlength="16">
          <small>Usa únicamente 0 y 1. Máximo 16 bits.</small>
          <div class="manchesterActions">
            <button id="manApply">Aplicar</button>
            <button id="manPrev">◀ Bit</button>
            <button id="manNext">Bit ▶</button>
            <button id="manAuto">▶ Play</button>
          </div>
        </div>
        <div class="waveWrap">
          <div id="waveInfo"></div>
          <svg id="manWave" width="900" height="260" viewBox="0 0 900 260"></svg>
          <div class="waveLegend">Cada bloque vertical representa un período de bit. El área gris indica el bit que se está estudiando.</div>
        </div>
      </div>
      <div id="manStepText" class="waveStep"></div>`;

    let bits='10110010', pos=0, mtimer=null;
    const svg=document.getElementById('manWave');

    function clean(v){
      const r=v.replace(/[^01]/g,'').slice(0,16);
      return r||'0';
    }

    function drawWave(){
      bits=clean(manBits.value);
      manBits.value=bits;
      const W=Math.max(560,bits.length*70+80);
      const left=45, high=75, low=175, bw=(W-left-20)/bits.length;
      svg.setAttribute('width',W);

      let html=`<line x1="${left}" y1="${high}" x2="${W-20}" y2="${high}" stroke="#d5d9dc" stroke-dasharray="4 4"/>
      <line x1="${left}" y1="${low}" x2="${W-20}" y2="${low}" stroke="#d5d9dc" stroke-dasharray="4 4"/>
      <text x="5" y="${high+5}" font-size="12">ALTO</text>
      <text x="8" y="${low+5}" font-size="12">BAJO</text>`;

      for(let k=0;k<bits.length;k++){
        const x=left+k*bw, mid=x+bw/2, nx=x+bw;
        const bit=bits[k];
        const startY=bit==='1'?low:high;
        const endY=bit==='1'?high:low;
        if(k===pos) html+=`<rect x="${x+1}" y="35" width="${bw-2}" height="170" fill="#e1e4e7" rx="4"/>`;
        html+=`<line x1="${x}" y1="${startY}" x2="${mid}" y2="${startY}" stroke="#111" stroke-width="3"/>
        <line x1="${mid}" y1="${startY}" x2="${mid}" y2="${endY}" stroke="#111" stroke-width="3"/>
        <line x1="${mid}" y1="${endY}" x2="${nx}" y2="${endY}" stroke="#111" stroke-width="3"/>
        <line x1="${x}" y1="35" x2="${x}" y2="205" stroke="#cfd5da"/>
        <text x="${x+bw/2-4}" y="230" font-size="16" font-weight="bold">${bit}</text>
        <text x="${x+bw/2-14}" y="250" font-size="10">bit ${k+1}</text>`;
      }
      html+=`<line x1="${left+bits.length*bw}" y1="35" x2="${left+bits.length*bw}" y2="205" stroke="#cfd5da"/>`;
      svg.innerHTML=html;
      waveInfo.innerHTML=`<b>Secuencia:</b> ${bits} · <b>Bit seleccionado:</b> ${pos+1} de ${bits.length}`;
      const b=bits[pos];
      manStepText.innerHTML=`<b>Bit ${pos+1} = ${b}.</b> Con la convención utilizada, ${b==='0'?'la señal comienza en nivel alto y realiza una transición hacia nivel bajo':'la señal comienza en nivel bajo y realiza una transición hacia nivel alto'} en el centro del período.`;
    }

    function stopAuto(){
      if(mtimer!==null){
        clearInterval(mtimer);
        mtimer=null;
        manAuto.textContent='▶ Play';
      }
    }

    manApply.addEventListener('click',()=>{stopAuto(); bits=clean(manBits.value); pos=0; drawWave()});
    manBits.addEventListener('input',()=>{manBits.value=clean(manBits.value)});
    manPrev.addEventListener('click',()=>{stopAuto();pos=(pos-1+bits.length)%bits.length;drawWave()});
    manNext.addEventListener('click',()=>{stopAuto();pos=(pos+1)%bits.length;drawWave()});
    manAuto.addEventListener('click',()=>{
      if(mtimer!==null){stopAuto();return}
      mtimer=setInterval(()=>{pos=(pos+1)%bits.length;drawWave()},1000);
      manAuto.textContent='❚❚ Pause';
    });
    drawWave();
  }

  function render4B5BPanel(){
    const map={
      '0000':'11110','0001':'01001','0010':'10100','0011':'10101',
      '0100':'01010','0101':'01011','0110':'01110','0111':'01111',
      '1000':'10010','1001':'10011','1010':'10110','1011':'10111',
      '1100':'11010','1101':'11011','1110':'11100','1111':'11101'
    };

    panel.innerHTML=`
      <div class="codingIntro">
        <h2>4B/5B — Encoding por bloques</h2>
        <p>4B/5B toma la información en grupos de <b>4 bits</b> y convierte cada grupo en un código de <b>5 bits</b>. El objetivo es utilizar patrones seleccionados para que el flujo codificado tenga suficientes transiciones o cambios útiles para la recuperación de reloj, evitando largas secuencias problemáticas en la representación posterior de la señal.</p>
        <div class="conventionBox"><b>Importante:</b> 4B/5B no dibuja directamente una forma de onda como Manchester. Primero transforma los datos. Después, el resultado puede pasar a un método de señalización de la capa física.</div>
      </div>

      <div class="fourBControls">
        <div>
          <label><b>Data de entrada</b></label>
          <input id="fourInput" class="bitInput" value="10110010" maxlength="32">
          <small>Usa una cantidad de bits múltiplo de 4. Máximo 32 bits.</small>
          <div class="manchesterActions">
            <button id="fourApply">Codificar</button>
            <button id="fourPrev">◀ Group</button>
            <button id="fourNext">Group ▶</button>
            <button id="fourAuto">▶ Play</button>
          </div>
        </div>
        <div class="fourSummary">
          <div><b>Entrada</b><span id="fourInCount"></span></div>
          <div><b>Salida 4B/5B</b><span id="fourOutCount"></span></div>
          <div><b>Groups</b><span id="fourGroupCount"></span></div>
        </div>
      </div>

      <div class="fourVisualizer">
        <div class="fourColumn"><h3>Data originales — 4 bits</h3><div id="fourOriginal"></div></div>
        <div class="fourArrow">4B<br>↓<br>5B</div>
        <div class="fourColumn"><h3>Data codificados — 5 bits</h3><div id="fourEncoded"></div></div>
      </div>
      <div id="fourStepText" class="waveStep"></div>

      <div class="codeTableWrap">
        <h3>Tabla de códigos de datos 4B/5B</h3>
        <p>Cada combinación de 4 bits de datos tiene asignado un patrón de 5 bits.</p>
        <div class="codeTable" id="codeTable"></div>
      </div>`;

    let bits='10110010', group=0, timer=null;

    function clean4(v){
      return v.replace(/[^01]/g,'').slice(0,32);
    }

    function normalize(){
      bits=clean4(fourInput.value);
      const rem=bits.length%4;
      if(rem!==0) bits=bits.slice(0,bits.length-rem);
      if(!bits) bits='0000';
      fourInput.value=bits;
      group=Math.min(group, bits.length/4-1);
    }

    function groups(){
      const out=[];
      for(let i=0;i<bits.length;i+=4){
        const data=bits.slice(i,i+4);
        out.push([data,map[data]]);
      }
      return out;
    }

    function renderTable(){
      codeTable.innerHTML=Object.entries(map).map(([a,b])=>`<div><span>${a}</span><b>→</b><strong>${b}</strong></div>`).join('');
    }

    function renderGroups(){
      normalize();
      const gs=groups();
      const encoded=gs.map(x=>x[1]).join('');

      fourInCount.textContent=`${bits.length} bits`;
      fourOutCount.textContent=`${encoded.length} bits`;
      fourGroupCount.textContent=`${gs.length} grupo${gs.length===1?'':'s'}`;

      fourOriginal.innerHTML=gs.map((x,k)=>`<button class="nibble ${k===group?'active':''}" data-k="${k}"><small>Group ${k+1}</small><b>${x[0]}</b></button>`).join('');
      fourEncoded.innerHTML=gs.map((x,k)=>`<button class="codeword ${k===group?'active':''}" data-k="${k}"><small>Group ${k+1}</small><b>${x[1]}</b></button>`).join('');

      document.querySelectorAll('.nibble,.codeword').forEach(e=>e.addEventListener('click',()=>{
        stopTimer();
        group=+e.dataset.k;
        renderGroups();
      }));

      const current=gs[group];
      fourStepText.innerHTML=`<b>Group ${group+1}:</b> los 4 bits <b>${current[0]}</b> se buscan en la tabla y se transforman en el código de 5 bits <b>${current[1]}</b>. La secuencia completa de salida es: <span class="outputBits">${encoded}</span>.`;
    }

    function stopTimer(){
      if(timer!==null){
        clearInterval(timer);
        timer=null;
        fourAuto.textContent='▶ Play';
      }
    }

    fourApply.addEventListener('click',()=>{stopTimer();normalize();group=0;renderGroups()});
    fourInput.addEventListener('input',()=>{fourInput.value=clean4(fourInput.value)});
    fourPrev.addEventListener('click',()=>{stopTimer();const n=groups().length;group=(group-1+n)%n;renderGroups()});
    fourNext.addEventListener('click',()=>{stopTimer();const n=groups().length;group=(group+1)%n;renderGroups()});
    fourAuto.addEventListener('click',()=>{
      if(timer!==null){stopTimer();return}
      timer=setInterval(()=>{const n=groups().length;group=(group+1)%n;renderGroups()},1000);
      fourAuto.textContent='❚❚ Pause';
    });

    renderTable();
    renderGroups();
  }

  function renderCodingCompare(){
    panel.innerHTML=`
      <div class="codingIntro">
        <h2>Manchester y 4B/5B — ¿Qué diferencia hay?</h2>
        <p>Aunque ambos aparecen en el estudio de la transmisión física de datos, trabajan en momentos diferentes del proceso.</p>
      </div>
      <div class="codingCompareGrid">
        <div class="codingCompareCard">
          <h3>Manchester</h3>
          <div class="compareBig">1 bit → señal</div>
          <p>Trabaja directamente con la representación temporal de cada bit through transiciones de señal.</p>
          <div class="processMini"><span>1011</span><b>→</b><span class="signalMini">⌜┘⌞⌝</span></div>
          <p><b>Idea clave:</b> observar cómo cambia la señal durante cada período de bit.</p>
        </div>
        <div class="codingCompareCard">
          <h3>4B/5B</h3>
          <div class="compareBig">4 bits → 5 bits</div>
          <p>Transforma bloques de datos antes de la señalización física.</p>
          <div class="processMini"><span>1011</span><b>→</b><span>10111</span></div>
          <p><b>Idea clave:</b> modificar el patrón de bits para obtener una secuencia codificada adecuada para la transmisión posterior.</p>
        </div>
      </div>
      <div class="codingFlow">
        <h3>Una forma de visualizar la diferencia</h3>
        <div class="flowSteps">
          <div>DATOS<br><b>1011</b></div>
          <span>→</span>
          <div class="highlightFlow">4B/5B<br><b>10111</b></div>
          <span>→</span>
          <div>SEÑALIZACIÓN FÍSICA<br><b>forma de onda</b></div>
        </div>
        <p>Manchester se enfoca en la representación de los bits como señal. 4B/5B, en cambio, introduce una etapa de codificación de bloques que transforma los datos antes de la representación física correspondiente.</p>
      </div>`;
  }

  document.querySelectorAll('.codingTab').forEach(b=>b.addEventListener('click',()=>setCoding(b.dataset.coding)));
  setCoding('manchester');
}



/* ===== NETWORK LAB — ARP, DNS, DHCP, NAT, VLAN, STP, ROUTING, IPv6, SUBNETTING ===== */
function renderNetworkLab(){
  workspace.innerHTML=`<section>
    <div class="workspaceTitle">
      <h2>NETWORK LAB — Network Protocols and Concepts</h2>
      <p>Explore fundamental network processes step by step. Each lab combines a concise explanation with an interactive representation of the process.</p>
    </div>
    <div class="labTabs" id="labTabs">
      <button class="labTab active" data-lab="arp">ARP</button>
      <button class="labTab" data-lab="dns">DNS</button>
      <button class="labTab" data-lab="dhcp">DHCP</button>
      <button class="labTab" data-lab="nat">NAT</button>
      <button class="labTab" data-lab="vlan">VLAN</button>
      <button class="labTab" data-lab="stp">STP</button>
      <button class="labTab" data-lab="routing">ROUTING</button>
      <button class="labTab" data-lab="ipv6">IPv6</button>
      <button class="labTab" data-lab="subnet">SUBNETTING</button>
    </div>
    <div id="labPanel"></div>
  </section>`;

  const panel=document.getElementById('labPanel');
  const tabs=document.querySelectorAll('.labTab');

  function setLab(name){
    tabs.forEach(t=>t.classList.toggle('active',t.dataset.lab===name));
    if(name==='arp') labARP();
    if(name==='dns') labDNS();
    if(name==='dhcp') labDHCP();
    if(name==='nat') labNAT();
    if(name==='vlan') labVLAN();
    if(name==='stp') labSTP();
    if(name==='routing') labRouting();
    if(name==='ipv6') labIPv6();
    if(name==='subnet') labSubnet();
  }

  function labARP(){
    const steps=[
      ['1. PC A needs a MAC address','The host wants to send traffic to gateway 192.168.1.1, but initially only knows its IP address.'],
      ['2. ARP Request','PC A sends a broadcast ARP request: “Who has 192.168.1.1?”'],
      ['3. The gateway recognizes its IP','The router receives the request and detects that the requested IP address belongs to it.'],
      ['4. ARP Reply','The gateway normally responds by unicast with its MAC address.'],
      ['5. ARP Table actualizada','PC A temporarily stores the IP ↔ MAC relationship and can now build the Ethernet frame.']
    ];
    panel.innerHTML=`<div class="labIntro"><h2>ARP — IP-to-MAC Address Resolution</h2><p>ARP allows an IPv4 host to discover the MAC address associated with an IP address on its local network. ARP operates within the local link context: to reach an external network, the host normally resolves the MAC address of its next hop, such as the default gateway.</p></div>
    <div class="labTopology three"><div>🖥️<b>PC A</b><small>IP 192.168.1.10<br>MAC 11:22:33:44:55:66</small></div><span>⇄</span><div>⌁<b>Gateway</b><small>IP 192.168.1.1<br>MAC AA:BB:CC:DD:EE:FF</small></div></div>
    <div class="labControls"><button id="arpPrev">◀ Previous</button><button id="arpNext">Next ▶</button></div>
    <div id="arpStep" class="processCard"></div><div class="miniTable"><b>ARP Table de PC A</b><div id="arpTable">192.168.1.1 → <em>unknown</em></div></div>`;
    let k=0;
    function draw(){
      arpStep.innerHTML=`<b>${steps[k][0]}</b><p>${steps[k][1]}</p><div class="processProgress">${steps.map((_,x)=>`<i class="${x===k?'active':''}"></i>`).join('')}</div>`;
      arpTable.innerHTML=k<4?'192.168.1.1 → <em>unknown</em>':'192.168.1.1 → <b>AA:BB:CC:DD:EE:FF</b>';
    }
    arpPrev.onclick=()=>{k=Math.max(0,k-1);draw()}; arpNext.onclick=()=>{k=Math.min(steps.length-1,k+1);draw()}; draw();
  }

  function labDNS(){
    const steps=[
      ['Browser','The user enters google.com. The name is not yet an IP address usable for routing.'],
      ['Local resolver','The system queries its configured resolver and may check caches before performing new lookups.'],
      ['DNS resolution','The DNS service looks up or queries the information required to obtain an answer for the requested name.'],
      ['Response','The resolver returns an address or set of addresses associated with the name, depending on the available records.'],
      ['Connection','With an IP address available, the client can continue the communication process toward the destination.']
    ];
    panel.innerHTML=`<div class="labIntro"><h2>DNS — From a Name to an IP Address</h2><p>DNS associates human-readable names with information used by network systems. In web browsing, one of its most visible functions is obtaining an IP address for a domain name.</p></div>
    <div class="dnsFlow">${steps.map((s,k)=>`<div class="dnsNode ${k===0?'active':''}" data-k="${k}"><b>${s[0]}</b><small>${k===0?'google.com':'...'}</small></div>${k<steps.length-1?'<span>→</span>':''}`).join('')}</div>
    <div class="labControls"><button id="dnsPrev">◀ Step</button><button id="dnsNext">Step ▶</button></div><div id="dnsStep" class="processCard"></div>`;
    let k=0;
    function draw(){document.querySelectorAll('.dnsNode').forEach(x=>x.classList.toggle('active',+x.dataset.k===k));dnsStep.innerHTML=`<b>Step ${k+1}: ${steps[k][0]}</b><p>${steps[k][1]}</p>`}
    dnsPrev.onclick=()=>{k=Math.max(0,k-1);draw()};dnsNext.onclick=()=>{k=Math.min(4,k+1);draw()};draw();
  }

  function labDHCP(){
    const dora=[
      ['DISCOVER','The client does not yet have a usable IPv4 configuration and sends a message to discover available DHCP servers.'],
      ['OFFER','A DHCP server can offer a configuration, including an available IP address and other parameters.'],
      ['REQUEST','The client requests the selected offer.'],
      ['ACKNOWLEDGE','The server confirms the assignment and the client can apply the received configuration.']
    ];
    panel.innerHTML=`<div class="labIntro"><h2>DHCP — Automatic Configuration</h2><p>DHCP permite distribuir automáticamente parámetros de red. El proceso introductorio más conocido se resume como <b>DORA</b>: Discover, Offer, Request y Acknowledge.</p></div>
    <div class="doraFlow">${dora.map((x,k)=>`<button class="dora ${k===0?'active':''}" data-k="${k}"><b>${x[0]}</b><small>${['Cliente → Broadcast','Server → Cliente','Cliente → Server','Server → Cliente'][k]}</small></button>`).join('')}</div>
    <div id="doraDetail" class="processCard"></div><div class="configBox">Example final configuration: <b>IP 192.168.1.50 /24</b> · Gateway <b>192.168.1.1</b> · DNS <b>192.168.1.1</b></div>`;
    function select(k){document.querySelectorAll('.dora').forEach(x=>x.classList.toggle('active',+x.dataset.k===k));doraDetail.innerHTML=`<b>${k+1}. ${dora[k][0]}</b><p>${dora[k][1]}</p>`}
    document.querySelectorAll('.dora').forEach(x=>x.onclick=()=>select(+x.dataset.k));select(0);
  }

  function labNAT(){
    panel.innerHTML=`<div class="labIntro"><h2>NAT — Address Translation</h2><p>NAT modifies addressing information when a packet crosses a point where a translation policy is applied. A common case is PAT/NAT overload, where multiple private hosts share one public address by using different ports.</p></div>
    <div class="natDiagram"><div class="natSide"><b>PRIVATE NETWORK</b><div>PC A<br><small>192.168.1.10:51500</small></div><div>PC B<br><small>192.168.1.20:51501</small></div></div><div class="natDevice"><b>NAT ROUTER</b><small>192.168.1.1<br>203.0.113.10</small><button id="natTranslate">Translate</button></div><div class="natSide"><b>INTERNET</b><div>Server<br><small>Destination: 142.250.x.x:443</small></div></div></div>
    <div id="natResult" class="processCard"><b>Before NAT:</b><p>192.168.1.10:51500 → servidor:443</p></div>`;
    natTranslate.onclick=()=>natResult.innerHTML='<b>After NAT/PAT:</b><p>203.0.113.10:40001 → servidor:443</p><small>The NAT device maintains a table to associate the translated flow with the corresponding internal host.</small>';
  }

  function labVLAN(){
    panel.innerHTML=`<div class="labIntro"><h2>VLAN y 802.1Q — Logical Network Segmentation</h2><p>A VLAN logically divides a broadcast domain. On a trunk link, an 802.1Q tag can carry VLAN membership information for multiple VLANs between compatible devices.</p></div>
    <div class="vlanControls"><button class="vlanBtn active" data-v="10">VLAN 10 — Sales</button><button class="vlanBtn" data-v="20">VLAN 20 — Support</button><button class="vlanBtn" data-v="30">VLAN 30 — Administration</button></div>
    <div id="vlanVisual" class="vlanVisual"></div><div class="tagBox">Ejemplo de trama etiquetada: <b>MAC Destination | MAC Source | 802.1Q: VLAN <span id="vlanId">10</span> | EtherType | Data</b></div>`;
    const groups={10:['PC A','PC B'],20:['PC C','PC D'],30:['PC E','Server']};
    function draw(v){document.querySelectorAll('.vlanBtn').forEach(x=>x.classList.toggle('active',x.dataset.v===String(v)));vlanId.textContent=v;vlanVisual.innerHTML=`<div class="switchLab"><b>SWITCH</b><small>Access ports and trunk link</small></div><div class="vlanHosts">${groups[v].map(x=>`<div>🖥️<b>${x}</b><small>VLAN ${v}</small></div>`).join('')}</div><div class="vlanExplain">The displayed devices belong to VLAN ${v}. A different VLAN constitutes another logical domain and requires Layer 3 communication to exchange traffic between VLANs, except in special designs.</div>`}
    document.querySelectorAll('.vlanBtn').forEach(x=>x.onclick=()=>draw(+x.dataset.v));draw(10);
  }

  function labSTP(){
    panel.innerHTML=`<div class="labIntro"><h2>STP — Layer 2 Loop Prevention</h2><p>When redundant links exist between switches, a loop can form. STP builds a loop-free logical topology by blocking certain paths while preserving redundancy options.</p></div>
    <div class="stpCanvas"><button class="stpNode" id="rootSw">SW1<br><small>Root Bridge</small></button><button class="stpNode" id="sw2">SW2</button><button class="stpNode" id="sw3">SW3</button><div class="stpLine l1"></div><div class="stpLine l2"></div><div class="stpLine l3 blocked"></div></div>
    <div class="labControls"><button id="stpToggle">Show / hide logical blocking</button></div><div id="stpText" class="processCard"><b>Topology with redundancy:</b><p>SW1 actúa como referencia conceptual de Root Bridge. El enlace SW2–SW3 se muestra bloqueado en esta simplificación para evitar un camino redundante activo que pueda producir un bucle.</p></div>`;
    let blocked=true;stpToggle.onclick=()=>{blocked=!blocked;document.querySelector('.l3').classList.toggle('blocked',blocked);stpText.innerHTML=blocked?'<b>STP active:</b><p>Uno de los caminos redundantes se encuentra bloqueado lógicamente.</p>':'<b>Redundancy view:</b><p>Se muestran todos los enlaces. Sin un mecanismo de control, una topología de capa 2 con caminos redundantes puede generar bucles.</p>'};
  }

  function labRouting(){
    const routes=[
      ['Router A','192.168.10.0/24','Router B','10.0.0.2'],
      ['Router B','10.10.0.0/16','Router C','10.0.1.2'],
      ['Router C','172.16.0.0/16','Destination','172.16.1.20']
    ];
    panel.innerHTML=`<div class="labIntro"><h2>Routing — Next-Hop Selection</h2><p>A router analyzes the destination IP address and consults its routing information to select a next hop or outgoing interface. The process repeats across the network until a directly connected route or the destination is reached.</p></div>
    <div class="routeVisual"><div>🖥️<b>Source</b></div><span>→</span><div>⌁<b>Router A</b></div><span>→</span><div>⌁<b>Router B</b></div><span>→</span><div>⌁<b>Router C</b></div><span>→</span><div>▤<b>Destination</b></div></div>
    <div class="routeTable" id="routeTable"></div><div class="labControls"><button id="routePrev">◀ Hop</button><button id="routeNext">Next salto ▶</button></div><div id="routeStep" class="processCard"></div>`;
    let k=0;
    function draw(){routeTable.innerHTML=routes.map((r,x)=>`<div class="${x===k?'active':''}"><b>${r[0]}</b><span>Destination ${r[1]}</span><span>Next hop: ${r[3]}</span></div>`).join('');routeStep.innerHTML=`<b>Hop ${k+1}: ${routes[k][0]}</b><p>The router evaluates a route to reach ${routes[k][1]} and forwards the packet toward ${routes[k][2]} through ${routes[k][3]}.</p>`}
    routePrev.onclick=()=>{k=Math.max(0,k-1);draw()};routeNext.onclick=()=>{k=Math.min(2,k+1);draw()};draw();
  }

  function labIPv6(){
    const parts=['2001','0db8','0000','0000','0000','0000','0000','0042'];
    panel.innerHTML=`<div class="labIntro"><h2>IPv6 — 128-bit Addressing</h2><p>Una dirección IPv6 contiene 128 bits y suele representarse through ocho grupos de números hexadecimales separados por dos puntos. Existen reglas de abreviación, como eliminar ceros a la izquierda dentro de un grupo y utilizar <b>::</b> una vez para comprimir una secuencia continua de grupos en cero.</p></div>
    <div class="ipv6Address">${parts.map((x,k)=>`<button class="ipv6Block" data-k="${k}">${x}</button>${k<7?'<span>:</span>':''}`).join('')}</div>
    <div id="ipv6Detail" class="processCard"><b>Full address:</b><p>2001:0db8:0000:0000:0000:0000:0000:0042</p><p>Example abbreviated form: <b>2001:db8::42</b></p></div>
    <div class="ipv6Header"><h3>Basic IPv6 Header</h3><div>Version<br><b>4 bits</b></div><div>Traffic Class<br><b>8 bits</b></div><div>Flow Label<br><b>20 bits</b></div><div>Payload Length<br><b>16 bits</b></div><div>Next Header<br><b>8 bits</b></div><div>Hop Limit<br><b>8 bits</b></div><div>Source Address<br><b>128 bits</b></div><div>Destination Address<br><b>128 bits</b></div></div>`;
    document.querySelectorAll('.ipv6Block').forEach(x=>x.onclick=()=>{const k=+x.dataset.k;document.querySelectorAll('.ipv6Block').forEach(b=>b.classList.toggle('active',b===x));ipv6Detail.innerHTML=`<b>Group ${k+1}</b><p>The selected hexadecimal block represents 16 bits of the IPv6 address. Eight 16-bit groups make up the full 128 bits.</p>`});
  }

  function labSubnet(){
    panel.innerHTML=`<div class="labIntro"><h2>Subnetting — Visually Divide an IPv4 Network</h2><p>Enter an IP address and prefix. The lab calculates the mask, number of addresses, and block range. This tool works with IPv4 networks and demonstrates the basic concepts of prefixes and block size.</p></div>
    <div class="subnetControls"><label>IP / Network<input id="subIp" value="192.168.1.0"></label><label>Prefijo<select id="subPrefix">${Array.from({length:31},(_,i)=>`<option value="${i+1}" ${i+1===24?'selected':''}>/${i+1}</option>`).join('')}</select></label><button id="subCalc">Calculate</button></div>
    <div class="subnetResults" id="subResults"></div><div class="subnetExplain" id="subExplain"></div>`;
    function ipToInt(ip){return ip.split('.').reduce((a,x)=>(a<<8)+(Number(x)&255),0)>>>0}
    function intToIp(n){return [24,16,8,0].map(s=>(n>>>s)&255).join('.')}
    function calc(){
      try{
        const raw=subIp.value.trim();const oct=raw.split('.').map(Number);if(oct.length!==4||oct.some(x=>!Number.isInteger(x)||x<0||x>255))throw Error();
        const p=+subPrefix.value, mask=p===0?0:((0xFFFFFFFF<<(32-p))>>>0), size=2**(32-p), net=(ipToInt(raw)&mask)>>>0, broad=(net+size-1)>>>0;
        const usable=p>=31?0:Math.max(0,size-2), first=p>=31?net:(net+1)>>>0,last=p>=31?broad:(broad-1)>>>0;
        subResults.innerHTML=`<div><b>Mask</b><span>${intToIp(mask)}</span></div><div><b>Total addresses</b><span>${size.toLocaleString()}</span></div><div><b>Usable hosts*</b><span>${usable.toLocaleString()}</span></div><div><b>Network</b><span>${intToIp(net)}/${p}</span></div><div><b>First host</b><span>${intToIp(first)}</span></div><div><b>Last host</b><span>${intToIp(last)}</span></div><div><b>Broadcast</b><span>${intToIp(broad)}</span></div>`;
        const bits=32-p;
        subExplain.innerHTML=`<b>How it is calculated:</b><p>Un prefijo /${p} reserva ${p} bits para la parte de red y deja ${bits} bits para la parte de host. Por eso el bloque contiene 2<sup>${bits}</sup> = <b>${size.toLocaleString()}</b> direcciones. Para prefijos tradicionales de /30 o menores, el cálculo habitual de hosts utilizables es 2<sup>${bits}</sup> − 2.</p><small>* /31 y /32 se utilizan en escenarios especiales y no siguen este cálculo simplificado de hosts utilizables.</small>`;
      }catch(e){subResults.innerHTML='<div class="error">Enter a valid IPv4 address.</div>';subExplain.innerHTML=''}
    }
    subCalc.onclick=calc;calc();
  }

  document.querySelectorAll('.labTab').forEach(t=>t.onclick=()=>setLab(t.dataset.lab));
  setLab('arp');
}
