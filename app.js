const L=[[7,'Application','HTTP, DNS, DHCP, FTP','#8e5ab5'],[6,'Presentation','Formatting, Encryption','#536d9d'],[5,'Session','Establishes, maintains','#1a73a8'],[4,'Transport','TCP, UDP','#34a853'],[3,'Red','IP, ICMP','#f9ab00'],[2,'Data Link','Ethernet, ARP','#ff6d00'],[1,'Physical','Signals, Bits','#ea4335']];for(const [n,a,d,c] of L){layers.innerHTML+=`<div class="layer" style="--c:${c}"><b>${n}</b><strong>${a}</strong><small>${d}</small></div>`;live.innerHTML+=`<div class="live" data-n="${n}" style="--c:${c}"><b>${n}</b>${a}</div>`}const S=[['Data is generated at the Application layer. The browser prepares an HTTP request for www.google.com.','The Application layer generates the HTTP data.'],['TCP adds its header with source and destination ports.','TCP encapsulates the data into a segment.'],['IPv4 adds IP addresses and an initial TTL of 64.','The IP packet is created for routing.'],['Ethernet adds MAC addresses, EtherType, and FCS.','The frame is created for the local link.'],['The information is transmitted as bits.','The Physical layer carries the signal.'],['The router removes the incoming frame, examines IP, and decrements the TTL.','The router processes the packet and selects the next hop.'],['A new Ethernet frame is built for the next link.','MAC addresses change hop by hop; IP addresses remain end to end.'],['The request reaches the Google server and is decapsulated.','The server processes the HTTP request.']];let i=0,t;function draw(){step.innerHTML=`<b>Paso ${i+1} de ${S.length}:</b> ${S[i][0]}`;info.textContent=S[i][1];dots.innerHTML=S.map((x,k)=>`<i class="dot ${k===i?'active':''}"></i>`).join('');document.querySelectorAll('.live').forEach(x=>x.classList.toggle('active',+x.dataset.n===Math.max(1,7-i)));ttl.textContent=i>=5?63:64}function stopSimulation(){if(t!==undefined&&t!==null){clearInterval(t);t=null}play.textContent='▶'}
function startSimulation(){if(t!==undefined&&t!==null)return;play.textContent='❚❚';t=setInterval(()=>{i=(i+1)%S.length;draw()},5000)}
next.onclick=()=>{stopSimulation();i=(i+1)%S.length;draw()};
prev.onclick=()=>{stopSimulation();i=(i+S.length-1)%S.length;draw()};
play.onclick=()=>{if(t!==undefined&&t!==null){stopSimulation()}else{startSimulation()}};
draw();

/* ===== ADDITIVE INTERACTIVE MODULES — v1.1 preserved ===== */
const tcpipLayers=[
 [4,'Application','HTTP, DNS, DHCP, FTP','#8e5ab5','Datos','Agrupa las funciones de Application, Presentation y Session del modelo OSI.'],
 [3,'Transport','TCP, UDP','#34a853','Segmento / Datagrama','Transporta datos entre procesos y utiliza puertos.'],
 [2,'Internet','IP, ICMP','#f9ab00','Paquete','Realiza direccionamiento lógico y encaminamiento entre redes.'],
 [1,'Network Access','Ethernet, Wi-Fi, ARP','#ff6d00','Trama / Bits','Agrupa las funciones de Data Link y Physical.']
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
      7:['Datos','Es el punto donde las aplicaciones utilizan servicios de red y generan información para comunicar.'],
      6:['Datos','Se relaciona con la representación, codificación, cifrado y compresión de los datos.'],
      5:['Datos','Organiza el establecimiento, mantenimiento y finalización de sesiones de comunicación.'],
      4:['Segmento / Datagrama','Transporta información entre procesos mediante puertos y protocolos como TCP y UDP.'],
      3:['Paquete','Adds direccionamiento IP y permite el encaminamiento entre diferentes redes.'],
      2:['Trama','Construye tramas para el enlace local y utiliza direcciones MAC y tecnologías como Ethernet.'],
      1:['Bits','Representa la transmisión mediante señales eléctricas, ópticas o inalámbricas.']
    }[x[0]];
    return [...x,extra[0],extra[1]];
  });
}

function renderLearn(){
  const protocols={
    ethernet:{title:'Ethernet II',layer:'2 — Data Link',pdu:'Trama',color:'#ff6d00',intro:'Ethernet II encapsula a packet de Capa 3 dentro de una trama para un enlace local. El header Ethernet II tiene 14 bytes; el FCS tiene 4 bytes y se considera aparte.',fields:[
      ['Destination MAC',48,6,'00:1A:2B:3C:4D:5E','Identifica la interfaz destino en el enlace local.','Emisor / NIC','Switch / NIC receptor'],
      ['Source MAC',48,6,'11:22:33:44:55:66','Identifica la interfaz que transmite la trama.','NIC emisora','Switch / receptor'],
      ['EtherType',16,2,'0x0800','Indica the protocol encapsulado; 0x0800 identifica IPv4.','NIC / driver','NIC / capa 2'],
      ['Payload',46*8,46,'IP packet','Carries the upper-layer PDU. Ethernet II supports up to 1500 bytes of payload with a typical Ethernet MTU.','NIC','NIC / capa 3'],
      ['FCS',32,4,'0x1A2B3C4D','CRC usado para detectar errores en la trama.','NIC transmisora','NIC receptora']
    ]},
    ipv4:{title:'IPv4',layer:'3 — Red',pdu:'Paquete',color:'#f9ab00',intro:'IPv4 provides logical addressing and routing. The base header is 20 bytes and can grow when options are present.',fields:[
      ['Version',4,0.5,'0100 / 4','Indicates the IP version: IPv4.','Host / router','Host / router'],
      ['IHL',4,0.5,'0101 / 5','Indica the length dthe header en palabras de 32 bits. IHL=5 significa 20 bytes.','Host / router','Host / router'],
      ['DSCP/ECN',8,1,'0x00','Service classification and Explicit Congestion Notification.','Host / router','Router / host'],
      ['Total Length',16,2,'125 bytes','Total IPv4 packet length: header + data.','Host / router','Host / router'],
      ['Identification',16,2,'0x1234','Identifies the set of fragments belonging to the same original packet.','Host emisor','Destino durante reensamblaje'],
      ['Flags',3,0.375,'DF / MF','Controls fragmentation. DF prevents fragmentation; MF indicates that more fragments follow.','Host / router','Router / destino'],
      ['Fragment Offset',13,1.625,'0','Indicates the fragment position within the original payload, in 8-byte units.','Host / router','Destino'],
      ['TTL',8,1,'64','Limits packet lifetime; routers decrement it when forwarding.','Host emisor','Router'],
      ['Protocol',8,1,'6 / TCP','Identifies the upper-layer PDU: 6 TCP, 17 UDP, 1 ICMP.','Host emisor','Host destino'],
      ['Header Checksum',16,2,'0x....','Detects errors in the IPv4 header. It is recalculated when the header changes, for example when TTL is decremented.','Host / router','Host / router'],
      ['Source Address',32,4,'192.168.1.10','Source IPv4 address of the packet.','Host emisor','Router / host destino'],
      ['Destination Address',32,4,'142.250.72.14','Destination IPv4 address of the packet.','Host emisor','Router / host destino'],
      ['Options + Padding',0,0,'Variable','Optional fields; if present, IHL increases above 5.','Host / router','Host / router']
    ]},
    tcp:{title:'TCP',layer:'4 — Transport',pdu:'Segmento',color:'#34a853',intro:'TCP provides connection-oriented transport, sequencing, ACKs, flow control, and retransmission. Its minimum header is 20 bytes.',fields:[
      ['Source Port',16,2,'51500','Identifies the sending process port.','Host emisor','Host destino'],
      ['Destination Port',16,2,'443','Identifies the destination service port.','Host emisor','Host destino'],
      ['Sequence Number',32,4,'1001','Numbers bytes in the TCP stream for ordering and detecting loss.','Host emisor','Host destino'],
      ['Acknowledgment Number',32,4,'2001','Indicates the next byte expected by the receiver when ACK is set.','Host emisor','Host destino'],
      ['Data Offset',4,0.5,'0101 / 5','Indica the length dthe header en palabras de 32 bits.','Host emisor','Host destino'],
      ['Reserved',3,0.375,'000','Reserved bits for future use.','Host emisor','Host destino'],
      ['Flags',9,1.125,'SYN/ACK/FIN/PSH/RST...','Control TCP states and functions. SYN starts, ACK acknowledges, FIN terminates, and RST resets.','Host emisor','Host destino'],
      ['Window Size',16,2,'64240','Advertises available receive space for flow control.','Host receptor','Host emisor'],
      ['Checksum',16,2,'0x....','Verifies TCP using the IP pseudo-header and data.','Host emisor','Host destino'],
      ['Urgent Pointer',16,2,'0','Has meaning when URG is set.','Host emisor','Host destino'],
      ['Options + Padding',0,0,'MSS / SACK / TS...','Options that can extend the header beyond 20 bytes.','Host emisor','Host destino']
    ]},
    udp:{title:'UDP',layer:'4 — Transport',pdu:'Datagrama',color:'#34a853',intro:'UDP provides connectionless transport with a fixed 8-byte header. It does not itself provide reliable delivery, ordering, or retransmission.',fields:[
      ['Source Port',16,2,'53000','Sending process port; it may be 0 in specific contexts.','Host emisor','Host destino'],
      ['Destination Port',16,2,'53','Destination service port; 53 is commonly used for DNS.','Host emisor','Host destino'],
      ['Length',16,2,'40','Total UDP datagram length: header + data.','Host emisor','Host destino'],
      ['Checksum',16,2,'0x....','Error detection using the IP pseudo-header and data.','Host emisor','Host destino']
    ]},
    icmp:{title:'ICMP Echo',layer:'3 — Red',pdu:'Mensaje ICMP',color:'#f9ab00',intro:'ICMP communicates IP control and diagnostic information. Ping uses Echo Request and Echo Reply.',fields:[
      ['Type',8,1,'8 request / 0 reply','Identifies the ICMP message type.','Host emisor','Host destino'],
      ['Code',8,1,'0','Message subtype. For Echo Request/Reply it is normally 0.','Host emisor','Host destino'],
      ['Checksum',16,2,'0x....','Verifies the ICMP message.','Host emisor','Host destino'],
      ['Identifier',16,2,'0x1234','Helps correlate Echo requests and replies.','Host emisor','Host destino'],
      ['Sequence Number',16,2,'1','Numbers Echo requests.','Host emisor','Host destino'],
      ['Data',0,0,'payload','Optional data used to test size and content.','Host emisor','Host destino']
    ]},
    arp:{title:'ARP',layer:'2 — Data Link / soporte de Capa 3',pdu:'Mensaje ARP',color:'#ff6d00',intro:'ARP resolves an IPv4 address to a MAC address on the local LAN. The request is usually broadcast; the reply is usually unicast.',fields:[
      ['HTYPE',16,2,'1','Hardware type; Ethernet is 1.','Host','Host'],
      ['PTYPE',16,2,'0x0800','Protocol type; IPv4.','Host','Host'],
      ['HLEN',8,1,'6','Length of the hardware MAC address.','Host','Host'],
      ['PLEN',8,1,'4','Length of the IPv4 protocol address.','Host','Host'],
      ['OPER',16,2,'1 request / 2 reply','Indicates an ARP request or reply.','Host','Host'],
      ['SHA',48,6,'11:22:33:44:55:66','MAC address of the ARP sender.','Host','Host'],
      ['SPA',32,4,'192.168.1.10','IPv4 address of the ARP sender.','Host','Host'],
      ['THA',48,6,'00:00:00:00:00:00','Target MAC address; it may be unknown in a request.','Host','Host'],
      ['TPA',32,4,'192.168.1.1','IPv4 address whose MAC is being resolved.','Host','Host']
    ]}
  };

  const layerGuide={
    7:{name:'Application',color:'#8e5ab5',text:'This is where protocols that provide services to applications live. Examples: HTTP, DNS, DHCP, and FTP.'},
    6:{name:'Presentation',color:'#536d9d',text:'It covers information representation, formatting, encoding, encryption, and compression in the conceptual OSI model.'},
    5:{name:'Session',color:'#1a73a8',text:'It covers session establishment, maintenance, and termination in the conceptual OSI model.'},
    4:{name:'Transport',color:'#34a853',text:'End-to-end communication between processes. TCP uses segments and UDP uses datagrams; both use ports.'},
    3:{name:'Red',color:'#f9ab00',text:'Logical addressing and routing. IPv4, IPv6, and ICMP function here.'},
    2:{name:'Data Link',color:'#ff6d00',text:'Delivery over the local link using frames and link-layer addresses. Ethernet and ARP are relevant examples for this visualizer.'},
    1:{name:'Physical',color:'#ea4335',text:'Transmits bits using electrical, optical, or radio signals over a medium.'}
  };

  const nav=[['overview','STUDY MAP'],['models','OSI/TCP-IP MODELS'],['encap','ENCAPSULATION'],['headers','HEADERS'],['fragment','IPv4 FRAGMENTATION'],['journey','PACKET JOURNEY'],['mtu','MTU'],['arp','ARP'],['tcp','TCP'],['udp','UDP'],['icmp','ICMP']];
  workspace.innerHTML=`<section class="learningDeep">
    <div class="workspaceTitle"><h2>LEARN — Protocol Anatomy and Encapsulation</h2><p>Study what each PDU contains, the size of every field, and who adds, processes, modifies, or removes each header.</p></div>
    <div class="learnTopTabs" id="deepTabs">${nav.map((n,k)=>`<button type="button" class="learnTab ${k===0?'active':''}" data-deep="${n[0]}">${n[1]}</button>`).join('')}</div>
    <div id="deepPanel"></div>
  </section>`;
  const panel=document.getElementById('deepPanel');

  function bytes(bits){return bits===0?'—':(bits/8)+' B';}
  function fieldTable(p){
    return `<div class="headerTableWrap"><table class="headerTable"><thead><tr><th>Field</th><th>Bits</th><th>Bytes</th><th>Example</th><th>Function</th><th>Adds</th><th>Processes</th></tr></thead><tbody>${p.fields.map(f=>`<tr><td><b>${f[0]}</b></td><td>${f[1]}</td><td>${f[2]===0?'Variable':f[2]}</td><td><code>${f[3]}</code></td><td>${f[4]}</td><td>${f[5]}</td><td>${f[6]}</td></tr>`).join('')}</tbody></table></div>`;
  }
  function headerView(p){
    const total=p.fields.reduce((a,f)=>a+(typeof f[2]==='number'?f[2]:0),0);
    return `<div class="deepHeaderCard" style="--c:${p.color}"><div class="deepHeaderTitle"><div><span class="modelBadge">${p.layer}</span><h2>${p.title}</h2><p>${p.intro}</p></div><div class="headerSize"><b>${total||'Variable'} ${total?'bytes':''}</b><small>${p.title==='Ethernet II'?'Header = 14 B · FCS = 4 B aparte':p.title==='IPv4'?'Header base = 20 B':p.title==='TCP'?'Header mínimo = 20 B':p.title==='UDP'?'Header = 8 B':''}</small></div></div>${fieldTable(p)}<div class="fieldRule"><b>Processing rule:</b> a device does not move one intact header through every layer. Each layer interprets its own PDU, and the next hop may create a new encapsulation.</div></div>`;
  }
  function setTab(name){
    document.querySelectorAll('.learnTab').forEach(b=>b.classList.toggle('active',b.dataset.deep===name));
    if(name==='overview') renderOverview();
    if(name==='models') renderModels();
    if(name==='encap') renderEncap();
    if(name==='headers') renderHeaders();
    if(name==='fragment') renderFragment();
    if(name==='journey') renderJourney();
    if(name==='mtu') renderMTU();
    if(['arp','tcp','udp','icmp'].includes(name)) renderProtocol(name);
  }
  function renderModels(){
    panel.innerHTML=`<div class="deepSection"><h2>OSI and TCP/IP Models</h2><p>This view covers the conceptual foundation first, then drills down into protocols and headers.</p><div class="modelCompareDeep"><div><h3>OSI — 7 capas</h3>${Object.entries(layerGuide).map(([n,x])=>`<div class="modelRow" style="--c:${x.color}"><b>${n}</b><span>${x.name}</span><small>${x.text}</small></div>`).join('')}</div><div><h3>TCP/IP — 4 capas</h3><div class="modelRow" style="--c:#8e5ab5"><b>4</b><span>Application</span><small>HTTP, DNS, DHCP y otros protocolos de application.</small></div><div class="modelRow" style="--c:#34a853"><b>3</b><span>Transport</span><small>TCP y UDP.</small></div><div class="modelRow" style="--c:#f9ab00"><b>2</b><span>Internet</span><small>IP e ICMP.</small></div><div class="modelRow" style="--c:#ff6d00"><b>1</b><span>Network Access</span><small>Ethernet, Wi‑Fi, ARP y funciones de acceso.</small></div></div></div></div><div class="deepSection"><h3>Web request map</h3><div class="formulaFlow"><span>HTTP data</span><b>↓</b><span>TCP segment</span><b>↓</b><span>IPv4 packet</span><b>↓</b><span>Ethernet frame</span><b>↓</b><span>bits</span></div></div>`;
  }
  function renderOverview(){
    panel.innerHTML=`<div class="deepIntroGrid">
      <div class="deepIntroCard"><h2>What will you learn?</h2><p>Communication is not just one single “packet.” Each layer works with a PDU and adds its own information. This section lets you inspect the actual fields and their sizes.</p><ul><li>Bits → bytes → campos → PDU.</li><li>Encapsulation at the sender.</li><li>Decapsulation at the receiver.</li><li>TCP segmentation vs IPv4 fragmentation.</li><li>MAC per link vs. IP end to end.</li><li>Fragment reassembly at the destination.</li></ul></div>
      <div class="deepIntroCard"><h2>Regla mental</h2><div class="formulaFlow"><span>Datos</span><b>+</b><span>TCP/UDP</span><b>+</b><span>IPv4</span><b>+</b><span>Ethernet</span><b>→</b><span>Bits</span></div><p>En el destino the process se invierte: bits → trama → paquete → segmento/datagrama → datos.</p></div>
    </div>
    <div class="deepSection"><h2>PDUs and responsibilities</h2><div class="pduGrid"><div><b>Application</b><span>Datos</span></div><div><b>Transport</b><span>Segmento TCP / Datagrama UDP</span></div><div><b>Red</b><span>Paquete IPv4 / IPv6</span></div><div><b>Enlace</b><span>Trama Ethernet</span></div><div><b>Physical</b><span>Bits / señales</span></div></div></div>
    <div class="deepSection"><h2>Select a header</h2><div class="protocolCards">${Object.values(protocols).map(p=>`<button type="button" class="protocolCard" data-proto="${p.title==='Ethernet II'?'ethernet':p.title==='IPv4'?'ipv4':p.title.toLowerCase().split(' ')[0]}"><b>${p.title}</b><small>${p.layer}</small><span>${p.fields.length} campos definidos</span></button>`).join('')}</div></div>`;
    panel.querySelectorAll('[data-proto]').forEach(b=>b.onclick=()=>setTab(b.dataset.proto==='ipv4'?'headers':b.dataset.proto));
  }
  function renderEncap(){
    panel.innerHTML=`<div class="deepSection"><h2>Encapsulation — step by step</h2><p>See what each layer adds. The example sizes are deliberately small so the arithmetic is easy to follow.</p><div class="encapFlow">
      <div class="encapStep appStep"><b>1 · DATOS</b><span>HTTP / application</span><strong>85 B</strong><small>Generated by the application.</small></div><div class="encapArrow">↓</div>
      <div class="encapStep tcpStep"><b>2 · TCP SEGMENT</b><span>TCP header 20 B + datos 85 B</span><strong>105 B</strong><small>Transport agrega puertos, secuencia, ACK, flags, etc.</small></div><div class="encapArrow">↓</div>
      <div class="encapStep ipStep"><b>3 · IPv4 PACKET</b><span>IPv4 header 20 B + segmento 105 B</span><strong>125 B</strong><small>Red agrega IP origen/destino, TTL, protocolo, etc.</small></div><div class="encapArrow">↓</div>
      <div class="encapStep ethStep"><b>4 · ETHERNET FRAME</b><span>14 B header + 125 B payload + 4 B FCS</span><strong>143 B</strong><small>Data Link adds MAC addresses and EtherType; FCS is added for error detection.</small></div><div class="encapArrow">↓</div>
      <div class="encapStep bitsStep"><b>5 · FÍSICA</b><span>The frame is transmitted as bits/signals.</span><strong>1144 bits</strong><small>143 B × 8 = 1144 bits, not including the preamble/SFD here.</small></div>
    </div></div>
    <div class="deepSection"><h2>Decapsulation</h2><div class="deencap"><span>Bits</span><i>→</i><span>Trama</span><i>→</i><span>Paquete</span><i>→</i><span>Segmento</span><i>→</i><span>Datos</span></div><p>The receiver consumes each layer's information and delivers the PDU to the upper layer.</p></div>`;
  }
  function renderHeaders(){
    panel.innerHTML=`<div class="deepSection"><h2>HEADERS — field-by-field inspection</h2><p>Select a protocol. Each row shows the exact size and role of the field.</p><div class="headerSelector">${[['ethernet','Ethernet II'],['ipv4','IPv4'],['tcp','TCP'],['udp','UDP'],['icmp','ICMP'],['arp','ARP']].map((x,k)=>`<button type="button" class="headerSelect ${k===0?'active':''}" data-hdr="${x[0]}">${x[1]}</button>`).join('')}</div><div id="headerDetail"></div></div>`;
    const detail=document.getElementById('headerDetail');
    function show(k){document.querySelectorAll('.headerSelect').forEach(b=>b.classList.toggle('active',b.dataset.hdr===k));detail.innerHTML=headerView(protocols[k]);}
    const selector=panel.querySelector('.headerSelector');
    selector.addEventListener('click',(event)=>{const button=event.target.closest('.headerSelect');if(!button)return;event.preventDefault();show(button.dataset.hdr);});
    show('ethernet');
  }
  function renderFragment(){
    panel.innerHTML=`<div class="deepSection"><h2>IPv4 Fragmentation — when the packet exceeds the MTU</h2><p><b>Fragmentation is not TCP segmentation.</b> TCP can divide application data into segments before IP forms packets. IPv4 can divide an already-formed IP packet when it must cross a link with a smaller MTU.</p>
      <div class="fragmentCompare"><div><h3>TCP segmentation</h3><p><b>Layer:</b> Transport</p><p><b>Unit:</b> segmento TCP</p><p><b>Responsible:</b> TCP en el sending host</p><p><b>Goal:</b> adapt the data flow and manage sequencing, ACKs, and retransmission.</p><p>Every TCP segment has its own TCP header.</p></div><div><h3>IPv4 fragmentation</h3><p><b>Layer:</b> Red</p><p><b>Unit:</b> IP fragment</p><p><b>Responsible:</b> IPv4 host or router, if DF does not prevent fragmentation.</p><p><b>Goal:</b> allow a packet to cross a link with a smaller MTU.</p><p>Later fragments do not repeat the TCP header; they carry their own IPv4 header.</p></div></div>
      <div class="fragmentExample"><h3>Example: paquete IP de 4000 B, MTU = 1500 B</h3><div class="fragBar"><div>Fragmento 1<br><b>1500 B</b><small>IPv4 20 + datos 1480<br>Offset 0 · MF=1</small></div><div>Fragmento 2<br><b>1500 B</b><small>IPv4 20 + datos 1480<br>Offset 185 · MF=1</small></div><div>Fragmento 3<br><b>1040 B</b><small>IPv4 20 + datos 1020<br>Offset 370 · MF=0</small></div></div><p class="note">The offset is expressed in 8-byte units: 1480/8 = 185. The sum of fragmented payloads is 3980 B, which corresponds to the original packet of 4000 B minus its 20-byte IPv4 header.</p></div>
      <div class="fragmentFlags"><div><b>Identification</b><span>16 bits / 2 B</span><small>Same value in all fragments of the original packet.</small></div><div><b>Flags</b><span>3 bits</span><small>DF prevents fragmentation; MF indicates that more fragments follow.</small></div><div><b>Fragment Offset</b><span>13 bits</span><small>Position of the payload within the original packet.</small></div></div></div>`;
  }
  function renderJourney(){
    panel.innerHTML=`<div class="deepSection"><h2>Packet Journey — what changes at each hop</h2><p>The router does not forward the same Ethernet frame end to end. It processes the received frame, extracts the IP packet, selects the next hop, and builds a new frame for the next link.</p><div class="journeyTable"><div class="jHead"><b>Salto</b><b>Ethernet Source</b><b>Ethernet Destination</b><b>IP Source</b><b>IP Destination</b><b>TTL</b></div><div><span>PC A → Router</span><code>11:22:33:44:55:66</code><code>00:AA:BB:CC:DD:01</code><code>192.168.1.10</code><code>142.250.72.14</code><code>64</code></div><div><span>Router → next hop</span><code>00:AA:BB:CC:DD:02</code><code>00:AA:BB:CC:DD:03</code><code>192.168.1.10</code><code>142.250.72.14</code><code>63</code></div><div><span>Last link → server</span><code>00:AA:BB:CC:DD:04</code><code>AA:BB:CC:DD:EE:FF</code><code>192.168.1.10</code><code>142.250.72.14</code><code>62</code></div></div><div class="journeyRules"><div><b>MAC</b><span>Changes per link.</span></div><div><b>IP</b><span>Remains end to end in the basic case, except for functions such as NAT.</span></div><div><b>TTL</b><span>The router decrements it when forwarding.</span></div><div><b>Ethernet FCS</b><span>Generated for each new frame.</span></div></div></div>`;
  }
  function renderMTU(){
    panel.innerHTML=`<div class="deepSection"><h2>MTU — calculate before capturing</h2><p>MTU is the maximum size of the PDU that a link can carry in a single unit. In Ethernet, 1500 B is a typical IP payload value.</p><div class="mtuTool"><label>Paquete IPv4 (bytes)<input id="learnIpSize" type="number" min="20" value="4000"></label><label>MTU (bytes)<input id="learnMtu" type="number" min="68" value="1500"></label><button id="learnMtuCalc">Calcular</button></div><div id="learnMtuResult"></div></div><div class="deepSection"><h3>What happens when DF is set</h3><p>If the packet exceeds the MTU and DF=1, the router cannot fragment it. In IPv4, an ICMP Destination Unreachable message related to fragmentation/MTU may be generated, enabling mechanisms such as Path MTU Discovery.</p></div>`;
    function calc(){const size=Math.max(20,+document.getElementById('learnIpSize').value||20),mtu=Math.max(68,+document.getElementById('learnMtu').value||1500),payload=mtu-20,n=Math.ceil((size-20)/payload);let html='';if(size<=mtu){html=`<div class="mtuResult ok"><b>No fragmentation.</b><span>${size} B ≤ ${mtu} B</span></div>`}else{let rem=size-20,off=0,rows=[];for(let k=0;rem>0;k++){let d=Math.min(payload,rem);if(rem>d)d=d-(d%8);rows.push(`<div><b>Fragmento ${k+1}</b><span>${d+20} B total</span><small>Offset ${off/8} · ${rem>d?'MF=1':'MF=0'}</small></div>`);off+=d;rem-=d;}html=`<div class="mtuResult"><b>Requires ${n} fragments</b><span>Payload available per fragment: ${payload} B</span><div class="mtuFragments">${rows.join('')}</div></div>`}document.getElementById('learnMtuResult').innerHTML=html}
    document.getElementById('learnMtuCalc').onclick=calc; calc();
  }
  function renderProtocol(k){panel.innerHTML=`<div class="deepSection">${headerView(protocols[k])}</div>`;}
  const deepTabs=document.getElementById('deepTabs');
  deepTabs.addEventListener('click',(event)=>{const button=event.target.closest('.learnTab');if(!button)return;event.preventDefault();setTab(button.dataset.deep);});
  setTab('overview');
}

function renderBuild(){
  workspace.innerHTML=`<section><div class="workspaceTitle"><h2>CONSTRUIR — Encapsulación interactiva</h2><p>Modifica los datos y observa cómo cambian el segmento, el paquete IP y la trama Ethernet.</p></div><div class="builderGrid"><div class="builderControls"><div class="field"><label>Transport</label><select id="buildTransport"><option>TCP</option><option>UDP</option></select></div><div class="field"><label>Datos de application (bytes)</label><input id="buildData" type="number" value="85" min="1"></div><div class="field"><label>IP origen</label><input id="buildSrc" value="192.168.1.10"></div><div class="field"><label>IP destino</label><input id="buildDst" value="142.250.72.14"></div></div><div class="builderPreview" id="builderPreview"></div></div></section>`;
  function calc(){
    const d=Math.max(1,+buildData.value||1);
    const proto=buildTransport.value;
    const th=proto==='TCP'?20:8;
    const segment=d+th, ip=segment+20, payload=Math.max(ip,46), padding=Math.max(0,46-ip), frame=14+payload+4;
    builderPreview.innerHTML=`<h3>Resultado</h3><div class="box app"><b>APPLICATION DATA</b><br>${d} bytes</div><div class="row"><div class="box tcp"><b>${proto} HEADER</b><br>${th} bytes</div><div class="box app small"><b>${proto} PDU</b><br>${segment} bytes</div></div><div class="row"><div class="box ip"><b>IP HEADER</b><br>${buildSrc.value} → ${buildDst.value}</div><div class="box tcp small"><b>IP PACKET</b><br>${ip} bytes</div></div><div class="row"><div class="box eth"><b>ETHERNET HEADER</b><br>14 bytes</div><div class="box ip small"><b>PAYLOAD</b><br>${payload} bytes</div><div class="box eth fcs"><b>FCS</b><br>4 bytes</div></div><p><b>Total:</b> 14 + ${payload} + 4 = <b>${frame} bytes</b>${padding?`<br><b>Padding:</b> ${padding} bytes para alcanzar el mínimo de 46 bytes de payload Ethernet.`:''}</p>`;
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
    ['PAYLOAD','46–1500 B','#8e5ab5',15,'Contiene la upper-layer PDU y puede incluir padding.'],
    ['FCS','4 B','#ea4335',4,'Se utiliza para detección de errores mediante CRC.']
  ];
  const ieee=[
    ['802.3','Ethernet','Estándar de redes Ethernet cableadas. Define tecnologías relacionadas con el acceso al medio y la transmisión en redes LAN.','Data Link / Physical','Ethernet sobre medios físicos'],
    ['802.11','Wi‑Fi','Familia de estándares para redes LAN inalámbricas. Utiliza el medio radioeléctrico y mecanismos específicos para el acceso inalámbrico.','Data Link / Physical','Redes WLAN'],
    ['802.1Q','VLAN','Estándar utilizado para identificar VLAN mediante etiquetado dentro de tramas Ethernet, permitiendo segmentación lógica de redes.','Data Link','Etiquetado VLAN'],
    ['802.1D','Bridging y STP','Estándar históricamente asociado al funcionamiento de bridges y Spanning Tree Protocol para evitar bucles de Capa 2.','Data Link','Conmutación y prevención de bucles'],
    ['802.1X','Control de acceso','Proporciona un marco de control de acceso basado en autenticación para permitir o restringir el acceso a una red.','Data Link','Autenticación de acceso']
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
      <p>Explora dos técnicas relacionadas con la transmisión de datos. Manchester muestra cómo se representan bits mediante transiciones de señal. 4B/5B muestra cómo grupos de 4 bits se transforman en códigos de 5 bits antes de su transmisión física.</p>
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
            <button id="manAuto">▶ Reproducir</button>
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
        manAuto.textContent='▶ Reproducir';
      }
    }

    manApply.addEventListener('click',()=>{stopAuto(); bits=clean(manBits.value); pos=0; drawWave()});
    manBits.addEventListener('input',()=>{manBits.value=clean(manBits.value)});
    manPrev.addEventListener('click',()=>{stopAuto();pos=(pos-1+bits.length)%bits.length;drawWave()});
    manNext.addEventListener('click',()=>{stopAuto();pos=(pos+1)%bits.length;drawWave()});
    manAuto.addEventListener('click',()=>{
      if(mtimer!==null){stopAuto();return}
      mtimer=setInterval(()=>{pos=(pos+1)%bits.length;drawWave()},1000);
      manAuto.textContent='❚❚ Pausar';
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
        <h2>4B/5B — Codificación por bloques</h2>
        <p>4B/5B toma la información en grupos de <b>4 bits</b> y convierte cada grupo en un código de <b>5 bits</b>. El objetivo es utilizar patrones seleccionados para que el flujo codificado tenga suficientes transiciones o cambios útiles para la recuperación de reloj, evitando largas secuencias problemáticas en la representación posterior de la señal.</p>
        <div class="conventionBox"><b>Importante:</b> 4B/5B no dibuja directamente una forma de onda como Manchester. Primero transforma los datos. Después, el resultado puede pasar a un método de señalización de la capa física.</div>
      </div>

      <div class="fourBControls">
        <div>
          <label><b>Datos de entrada</b></label>
          <input id="fourInput" class="bitInput" value="10110010" maxlength="32">
          <small>Usa una cantidad de bits múltiplo de 4. Máximo 32 bits.</small>
          <div class="manchesterActions">
            <button id="fourApply">Codificar</button>
            <button id="fourPrev">◀ Grupo</button>
            <button id="fourNext">Grupo ▶</button>
            <button id="fourAuto">▶ Reproducir</button>
          </div>
        </div>
        <div class="fourSummary">
          <div><b>Entrada</b><span id="fourInCount"></span></div>
          <div><b>Salida 4B/5B</b><span id="fourOutCount"></span></div>
          <div><b>Grupos</b><span id="fourGroupCount"></span></div>
        </div>
      </div>

      <div class="fourVisualizer">
        <div class="fourColumn"><h3>Datos originales — 4 bits</h3><div id="fourOriginal"></div></div>
        <div class="fourArrow">4B<br>↓<br>5B</div>
        <div class="fourColumn"><h3>Datos codificados — 5 bits</h3><div id="fourEncoded"></div></div>
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

      fourOriginal.innerHTML=gs.map((x,k)=>`<button class="nibble ${k===group?'active':''}" data-k="${k}"><small>Grupo ${k+1}</small><b>${x[0]}</b></button>`).join('');
      fourEncoded.innerHTML=gs.map((x,k)=>`<button class="codeword ${k===group?'active':''}" data-k="${k}"><small>Grupo ${k+1}</small><b>${x[1]}</b></button>`).join('');

      document.querySelectorAll('.nibble,.codeword').forEach(e=>e.addEventListener('click',()=>{
        stopTimer();
        group=+e.dataset.k;
        renderGroups();
      }));

      const current=gs[group];
      fourStepText.innerHTML=`<b>Grupo ${group+1}:</b> los 4 bits <b>${current[0]}</b> se buscan en la tabla y se transforman en el código de 5 bits <b>${current[1]}</b>. La secuencia completa de salida es: <span class="outputBits">${encoded}</span>.`;
    }

    function stopTimer(){
      if(timer!==null){
        clearInterval(timer);
        timer=null;
        fourAuto.textContent='▶ Reproducir';
      }
    }

    fourApply.addEventListener('click',()=>{stopTimer();normalize();group=0;renderGroups()});
    fourInput.addEventListener('input',()=>{fourInput.value=clean4(fourInput.value)});
    fourPrev.addEventListener('click',()=>{stopTimer();const n=groups().length;group=(group-1+n)%n;renderGroups()});
    fourNext.addEventListener('click',()=>{stopTimer();const n=groups().length;group=(group+1)%n;renderGroups()});
    fourAuto.addEventListener('click',()=>{
      if(timer!==null){stopTimer();return}
      timer=setInterval(()=>{const n=groups().length;group=(group+1)%n;renderGroups()},1000);
      fourAuto.textContent='❚❚ Pausar';
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
          <p>Trabaja directamente con la representación temporal de cada bit mediante transiciones de señal.</p>
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
      <h2>NETWORK LAB — Protocolos y conceptos de red</h2>
      <p>Explora paso a paso procesos fundamentales que ocurren dentro de una red. Cada laboratorio combina una explicación breve con una representación interactiva del proceso.</p>
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
      ['1. PC A necesita una MAC','El host quiere enviar tráfico al gateway 192.168.1.1, pero inicialmente solo conoce su dirección IP.'],
      ['2. ARP Request','PC A envía una solicitud ARP en broadcast: “¿Quién tiene 192.168.1.1?”'],
      ['3. El gateway reconoce su IP','El router recibe la solicitud y detecta que la dirección IP consultada le pertenece.'],
      ['4. ARP Reply','El gateway responde normalmente en unicast con su dirección MAC.'],
      ['5. Tabla ARP actualizada','PC A guarda temporalmente la relación IP ↔ MAC y ya puede construir la trama Ethernet.']
    ];
    panel.innerHTML=`<div class="labIntro"><h2>ARP — Resolución de dirección IP a MAC</h2><p>ARP permite que un host IPv4 descubra la dirección MAC asociada a una dirección IP dentro de su red local. Es importante recordar que ARP funciona en el contexto del enlace local: para llegar a una red externa, el host normalmente resuelve la MAC de su siguiente salto, como el gateway predeterminado.</p></div>
    <div class="labTopology three"><div>🖥️<b>PC A</b><small>IP 192.168.1.10<br>MAC 11:22:33:44:55:66</small></div><span>⇄</span><div>⌁<b>Gateway</b><small>IP 192.168.1.1<br>MAC AA:BB:CC:DD:EE:FF</small></div></div>
    <div class="labControls"><button id="arpPrev">◀ Anterior</button><button id="arpNext">Siguiente ▶</button></div>
    <div id="arpStep" class="processCard"></div><div class="miniTable"><b>Tabla ARP de PC A</b><div id="arpTable">192.168.1.1 → <em>desconocida</em></div></div>`;
    const arpPrev=document.getElementById('arpPrev');
    const arpNext=document.getElementById('arpNext');
    const arpStep=document.getElementById('arpStep');
    const arpTable=document.getElementById('arpTable');
    let k=0;
    function draw(){
      arpStep.innerHTML=`<b>${steps[k][0]}</b><p>${steps[k][1]}</p><div class="processProgress">${steps.map((_,x)=>`<i class="${x===k?'active':''}"></i>`).join('')}</div>`;
      arpTable.innerHTML=k<4?'192.168.1.1 → <em>desconocida</em>':'192.168.1.1 → <b>AA:BB:CC:DD:EE:FF</b>';
    }
    arpPrev.onclick=()=>{k=Math.max(0,k-1);draw()}; arpNext.onclick=()=>{k=Math.min(steps.length-1,k+1);draw()}; draw();
  }

  function labDNS(){
    const steps=[
      ['Navegador','El usuario escribe google.com. El nombre todavía no es una dirección IP utilizable para el encaminamiento.'],
      ['Resolver local','El sistema consulta su resolver configurado y puede revisar cachés antes de realizar nuevas consultas.'],
      ['Resolución DNS','El servicio DNS busca o consulta la información necesaria para obtener una respuesta para el nombre solicitado.'],
      ['Respuesta','El resolver devuelve una dirección o conjunto de direcciones asociadas al nombre, según los registros disponibles.'],
      ['Conexión','Con una dirección IP disponible, el cliente puede continuar con el proceso de comunicación hacia el destino.']
    ];
    panel.innerHTML=`<div class="labIntro"><h2>DNS — Del nombre a una dirección IP</h2><p>DNS permite asociar nombres legibles por personas con información utilizada por los sistemas de red. En una navegación web, una de las funciones más visibles es obtener una dirección IP para un nombre de dominio.</p></div>
    <div class="dnsFlow">${steps.map((s,k)=>`<div class="dnsNode ${k===0?'active':''}" data-k="${k}"><b>${s[0]}</b><small>${k===0?'google.com':'...'}</small></div>${k<steps.length-1?'<span>→</span>':''}`).join('')}</div>
    <div class="labControls"><button id="dnsPrev">◀ Paso</button><button id="dnsNext">Paso ▶</button></div><div id="dnsStep" class="processCard"></div>`;
    const dnsPrev=document.getElementById('dnsPrev');
    const dnsNext=document.getElementById('dnsNext');
    const dnsStep=document.getElementById('dnsStep');
    let k=0;
    function draw(){document.querySelectorAll('.dnsNode').forEach(x=>x.classList.toggle('active',+x.dataset.k===k));dnsStep.innerHTML=`<b>Paso ${k+1}: ${steps[k][0]}</b><p>${steps[k][1]}</p>`}
    dnsPrev.onclick=()=>{k=Math.max(0,k-1);draw()};dnsNext.onclick=()=>{k=Math.min(4,k+1);draw()};draw();
  }

  function labDHCP(){
    const dora=[
      ['DISCOVER','El cliente todavía no tiene una configuración IPv4 utilizable y envía un mensaje para descubrir servidores DHCP disponibles.'],
      ['OFFER','Un servidor DHCP puede ofrecer una configuración, incluyendo una dirección IP disponible y otros parámetros.'],
      ['REQUEST','El cliente solicita la oferta seleccionada.'],
      ['ACKNOWLEDGE','El servidor confirma la asignación y el cliente puede aplicar la configuración recibida.']
    ];
    panel.innerHTML=`<div class="labIntro"><h2>DHCP — Obtención automática de configuración</h2><p>DHCP permite distribuir automáticamente parámetros de red. El proceso introductorio más conocido se resume como <b>DORA</b>: Discover, Offer, Request y Acknowledge.</p></div>
    <div class="doraFlow">${dora.map((x,k)=>`<button class="dora ${k===0?'active':''}" data-k="${k}"><b>${x[0]}</b><small>${['Cliente → Broadcast','Servidor → Cliente','Cliente → Servidor','Servidor → Cliente'][k]}</small></button>`).join('')}</div>
    <div id="doraDetail" class="processCard"></div><div class="configBox">Example de configuración final: <b>IP 192.168.1.50 /24</b> · Gateway <b>192.168.1.1</b> · DNS <b>192.168.1.1</b></div>`;
    const doraDetail=document.getElementById('doraDetail');
    function select(k){document.querySelectorAll('.dora').forEach(x=>x.classList.toggle('active',+x.dataset.k===k));doraDetail.innerHTML=`<b>${k+1}. ${dora[k][0]}</b><p>${dora[k][1]}</p>`}
    document.querySelectorAll('.dora').forEach(x=>x.onclick=()=>select(+x.dataset.k));select(0);
  }

  function labNAT(){
    panel.innerHTML=`<div class="labIntro"><h2>NAT — Traducción entre direcciones</h2><p>NAT modifica información de direccionamiento cuando un paquete cruza un punto donde se aplica una política de traducción. Un caso habitual es PAT/NAT overload, donde múltiples hosts privados comparten una dirección pública utilizando diferentes puertos.</p></div>
    <div class="natDiagram"><div class="natSide"><b>RED PRIVADA</b><div>PC A<br><small>192.168.1.10:51500</small></div><div>PC B<br><small>192.168.1.20:51501</small></div></div><div class="natDevice"><b>ROUTER NAT</b><small>192.168.1.1<br>203.0.113.10</small><button id="natTranslate">Traducir</button></div><div class="natSide"><b>INTERNET</b><div>Servidor<br><small>Destino: 142.250.x.x:443</small></div></div></div>
    <div id="natResult" class="processCard"><b>Antes de NAT:</b><p>192.168.1.10:51500 → servidor:443</p></div>`;
    const natTranslate=document.getElementById('natTranslate');
    const natResult=document.getElementById('natResult');
    natTranslate.onclick=()=>natResult.innerHTML='<b>Después de NAT/PAT:</b><p>203.0.113.10:40001 → servidor:443</p><small>El dispositivo NAT mantiene una tabla para asociar el flujo traducido con el host interno correspondiente.</small>';
  }

  function labVLAN(){
    panel.innerHTML=`<div class="labIntro"><h2>VLAN y 802.1Q — Separación lógica de redes</h2><p>Una VLAN permite dividir lógicamente un dominio de broadcast. En un enlace trunk, una etiqueta 802.1Q puede transportar información de pertenencia a VLAN para múltiples VLAN entre dispositivos compatibles.</p></div>
    <div class="vlanControls"><button class="vlanBtn active" data-v="10">VLAN 10 — Ventas</button><button class="vlanBtn" data-v="20">VLAN 20 — Soporte</button><button class="vlanBtn" data-v="30">VLAN 30 — Administración</button></div>
    <div id="vlanVisual" class="vlanVisual"></div><div class="tagBox">Example de trama etiquetada: <b>MAC Destino | MAC Origen | 802.1Q: VLAN <span id="vlanId">10</span> | EtherType | Datos</b></div>`;
    const groups={10:['PC A','PC B'],20:['PC C','PC D'],30:['PC E','Servidor']};
    const vlanVisual=document.getElementById('vlanVisual');
    const vlanId=document.getElementById('vlanId');
    function draw(v){document.querySelectorAll('.vlanBtn').forEach(x=>x.classList.toggle('active',x.dataset.v===String(v)));vlanId.textContent=v;vlanVisual.innerHTML=`<div class="switchLab"><b>SWITCH</b><small>Puertos de acceso y enlace trunk</small></div><div class="vlanHosts">${groups[v].map(x=>`<div>🖥️<b>${x}</b><small>VLAN ${v}</small></div>`).join('')}</div><div class="vlanExplain">Los equipos mostrados pertenecen a la VLAN ${v}. Una VLAN diferente constituye otro dominio lógico y requiere comunicación de capa 3 para intercambiar tráfico entre VLAN, salvo diseños especiales.</div>`}
    document.querySelectorAll('.vlanBtn').forEach(x=>x.onclick=()=>draw(+x.dataset.v));draw(10);
  }

  function labSTP(){
    panel.innerHTML=`<div class="labIntro"><h2>STP — Prevención de bucles de capa 2</h2><p>Cuando existen enlaces redundantes entre switches, puede formarse un bucle. STP construye una topología lógica sin bucles bloqueando determinados caminos mientras mantiene opciones de redundancia.</p></div>
    <div class="stpCanvas"><button class="stpNode" id="rootSw">SW1<br><small>Root Bridge</small></button><button class="stpNode" id="sw2">SW2</button><button class="stpNode" id="sw3">SW3</button><div class="stpLine l1"></div><div class="stpLine l2"></div><div class="stpLine l3 blocked"></div></div>
    <div class="labControls"><button id="stpToggle">Mostrar / ocultar bloqueo lógico</button></div><div id="stpText" class="processCard"><b>Topología con redundancia:</b><p>SW1 actúa como referencia conceptual de Root Bridge. El enlace SW2–SW3 se muestra bloqueado en esta simplificación para evitar un camino redundante activo que pueda producir un bucle.</p></div>`;
    const stpToggle=document.getElementById('stpToggle');
    const stpText=document.getElementById('stpText');
    let blocked=true;stpToggle.onclick=()=>{blocked=!blocked;document.querySelector('.l3').classList.toggle('blocked',blocked);stpText.innerHTML=blocked?'<b>STP activo:</b><p>Uno de los caminos redundantes se encuentra bloqueado lógicamente.</p>':'<b>Vista de redundancia:</b><p>Se muestran todos los enlaces. Sin un mecanismo de control, una topología de capa 2 con caminos redundantes puede generar bucles.</p>'};
  }

  function labRouting(){
    const routes=[
      ['Router A','192.168.10.0/24','Router B','10.0.0.2'],
      ['Router B','10.10.0.0/16','Router C','10.0.1.2'],
      ['Router C','172.16.0.0/16','Destino','172.16.1.20']
    ];
    panel.innerHTML=`<div class="labIntro"><h2>Routing — Selección del siguiente salto</h2><p>Un router analiza la dirección IP de destino y consulta su información de encaminamiento para seleccionar un siguiente salto o una interfaz de salida. El proceso se repite a través de la red hasta alcanzar una ruta conectada directamente o el destino.</p></div>
    <div class="routeVisual"><div>🖥️<b>Origen</b></div><span>→</span><div>⌁<b>Router A</b></div><span>→</span><div>⌁<b>Router B</b></div><span>→</span><div>⌁<b>Router C</b></div><span>→</span><div>▤<b>Destino</b></div></div>
    <div class="routeTable" id="routeTable"></div><div class="labControls"><button id="routePrev">◀ Salto</button><button id="routeNext">Siguiente salto ▶</button></div><div id="routeStep" class="processCard"></div>`;
    const routeTable=document.getElementById('routeTable');
    const routePrev=document.getElementById('routePrev');
    const routeNext=document.getElementById('routeNext');
    const routeStep=document.getElementById('routeStep');
    let k=0;
    function draw(){routeTable.innerHTML=routes.map((r,x)=>`<div class="${x===k?'active':''}"><b>${r[0]}</b><span>Destino ${r[1]}</span><span>Next hop: ${r[3]}</span></div>`).join('');routeStep.innerHTML=`<b>Salto ${k+1}: ${routes[k][0]}</b><p>El router evalúa una ruta para alcanzar ${routes[k][1]} y reenvía el paquete hacia ${routes[k][2]} mediante ${routes[k][3]}.</p>`}
    routePrev.onclick=()=>{k=Math.max(0,k-1);draw()};routeNext.onclick=()=>{k=Math.min(2,k+1);draw()};draw();
  }

  function labIPv6(){
    const parts=['2001','0db8','0000','0000','0000','0000','0000','0042'];
    panel.innerHTML=`<div class="labIntro"><h2>IPv6 — Direccionamiento de 128 bits</h2><p>Una dirección IPv6 contiene 128 bits y suele representarse mediante ocho grupos de números hexadecimales separados por dos puntos. Existen reglas de abreviación, como eliminar ceros a la izquierda dentro de un grupo y utilizar <b>::</b> una vez para comprimir una secuencia continua de grupos en cero.</p></div>
    <div class="ipv6Address">${parts.map((x,k)=>`<button class="ipv6Block" data-k="${k}">${x}</button>${k<7?'<span>:</span>':''}`).join('')}</div>
    <div id="ipv6Detail" class="processCard"><b>Dirección completa:</b><p>2001:0db8:0000:0000:0000:0000:0000:0042</p><p>Forma abreviada de ejemplo: <b>2001:db8::42</b></p></div>
    <div class="ipv6Header"><h3>Encabezado IPv6 básico</h3><div>Version<br><b>4 bits</b></div><div>Traffic Class<br><b>8 bits</b></div><div>Flow Label<br><b>20 bits</b></div><div>Payload Length<br><b>16 bits</b></div><div>Next Header<br><b>8 bits</b></div><div>Hop Limit<br><b>8 bits</b></div><div>Source Address<br><b>128 bits</b></div><div>Destination Address<br><b>128 bits</b></div></div>`;
    const ipv6Detail=document.getElementById('ipv6Detail');
    document.querySelectorAll('.ipv6Block').forEach(x=>x.onclick=()=>{const k=+x.dataset.k;document.querySelectorAll('.ipv6Block').forEach(b=>b.classList.toggle('active',b===x));ipv6Detail.innerHTML=`<b>Grupo ${k+1}</b><p>El bloque hexadecimal seleccionado representa 16 bits de la dirección IPv6. Ocho grupos de 16 bits forman los 128 bits completos.</p>`});
  }

  function labSubnet(){
    panel.innerHTML=`<div class="labIntro"><h2>Subnetting — Divide una red IPv4 visualmente</h2><p>Introduce una dirección de red y un prefijo. El laboratorio calcula máscara, cantidad de direcciones y rango del bloque. Esta herramienta trabaja con redes IPv4 y muestra los conceptos básicos de prefijo y tamaño de bloque.</p></div>
    <div class="subnetControls"><label>IP / Red<input id="subIp" value="192.168.1.0"></label><label>Prefijo<select id="subPrefix">${Array.from({length:31},(_,i)=>`<option value="${i+1}" ${i+1===24?'selected':''}>/${i+1}</option>`).join('')}</select></label><button id="subCalc">Calcular</button></div>
    <div class="subnetResults" id="subResults"></div><div class="subnetExplain" id="subExplain"></div>`;
    function ipToInt(ip){return ip.split('.').reduce((a,x)=>(a<<8)+(Number(x)&255),0)>>>0}
    function intToIp(n){return [24,16,8,0].map(s=>(n>>>s)&255).join('.')}
    function calc(){
      try{
        const raw=subIp.value.trim();const oct=raw.split('.').map(Number);if(oct.length!==4||oct.some(x=>!Number.isInteger(x)||x<0||x>255))throw Error();
        const p=+subPrefix.value, mask=p===0?0:((0xFFFFFFFF<<(32-p))>>>0), size=2**(32-p), net=(ipToInt(raw)&mask)>>>0, broad=(net+size-1)>>>0;
        const usable=p>=31?0:Math.max(0,size-2), first=p>=31?net:(net+1)>>>0,last=p>=31?broad:(broad-1)>>>0;
        subResults.innerHTML=`<div><b>Máscara</b><span>${intToIp(mask)}</span></div><div><b>Direcciones totales</b><span>${size.toLocaleString()}</span></div><div><b>Hosts utilizables*</b><span>${usable.toLocaleString()}</span></div><div><b>Red</b><span>${intToIp(net)}/${p}</span></div><div><b>Primer host</b><span>${intToIp(first)}</span></div><div><b>Último host</b><span>${intToIp(last)}</span></div><div><b>Broadcast</b><span>${intToIp(broad)}</span></div>`;
        const bits=32-p;
        subExplain.innerHTML=`<b>Cómo se calcula:</b><p>Un prefijo /${p} reserva ${p} bits para la parte de red y deja ${bits} bits para la parte de host. Por eso el bloque contiene 2<sup>${bits}</sup> = <b>${size.toLocaleString()}</b> direcciones. Para prefijos tradicionales de /30 o menores, el cálculo habitual de hosts utilizables es 2<sup>${bits}</sup> − 2.</p><small>* /31 y /32 se utilizan en escenarios especiales y no siguen este cálculo simplificado de hosts utilizables.</small>`;
      }catch(e){subResults.innerHTML='<div class="error">Introduce una dirección IPv4 válida.</div>';subExplain.innerHTML=''}
    }
    const subIp=document.getElementById('subIp');
    const subPrefix=document.getElementById('subPrefix');
    const subCalc=document.getElementById('subCalc');
    const subResults=document.getElementById('subResults');
    const subExplain=document.getElementById('subExplain');
    subCalc.onclick=calc;calc();
  }

  document.querySelectorAll('.labTab').forEach(t=>t.onclick=()=>setLab(t.dataset.lab));
  setLab('arp');
}
