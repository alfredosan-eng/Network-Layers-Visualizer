const $ = (id) => document.getElementById(id);
const layers = $('layers');
const live = $('live');
const dots = $('dots');
const step = $('step');
const info = $('info');
const ttl = $('ttl');
const prev = $('prev');
const play = $('play');
const next = $('next');

const L=[[7,'Application','HTTP, DNS, DHCP, FTP','#8e5ab5'],[6,'Presentation','Formatting, Encryption','#536d9d'],[5,'Session','Establishes, maintains','#1a73a8'],[4,'Transport','TCP, UDP','#34a853'],[3,'Network','IP, ICMP','#f9ab00'],[2,'Data Link','Ethernet, ARP','#ff6d00'],[1,'Physical','Signals, Bits','#ea4335']];for(const [n,a,d,c] of L){layers.innerHTML+=`<div class="layer" style="--c:${c}"><b>${n}</b><strong>${a}</strong><small>${d}</small></div>`;live.innerHTML+=`<div class="live" data-n="${n}" style="--c:${c}"><b>${n}</b>${a}</div>`}const S=[['Data is generated at the Application layer. The browser prepares an HTTP request for www.google.com.','The Application layer generates the HTTP data.'],['TCP adds its header with source and destination ports.','TCP encapsulates the data into a segment.'],['IPv4 adds IP addresses and an initial TTL of 64.','The IP packet is created for routing.'],['Ethernet adds MAC addresses, EtherType, and FCS.','The frame is created for the local link.'],['The information is transmitted as bits.','The Physical layer carries the signal.'],['The router removes the incoming frame, examines IP, and decrements the TTL.','The router processes the packet and selects the next hop.'],['A new Ethernet frame is built for the next link.','MAC addresses change hop by hop; IP addresses remain end to end.'],['The request reaches the Google server and is decapsulated.','The server processes the HTTP request.']];let i=0,t;function draw(){step.innerHTML=`<b>Step ${i+1} of ${S.length}:</b> ${S[i][0]}`;info.textContent=S[i][1];dots.innerHTML=S.map((x,k)=>`<i class="dot ${k===i?'active':''}"></i>`).join('');document.querySelectorAll('.live').forEach(x=>x.classList.toggle('active',+x.dataset.n===Math.max(1,7-i)));ttl.textContent=i>=5?63:64}function stopSimulation(){if(t!==undefined&&t!==null){clearInterval(t);t=null}play.textContent='▶'}
function startSimulation(){if(t!==undefined&&t!==null)return;play.textContent='❚❚';t=setInterval(()=>{i=(i+1)%S.length;draw()},5000)}
next.onclick=()=>{stopSimulation();i=(i+1)%S.length;draw()};
prev.onclick=()=>{stopSimulation();i=(i+S.length-1)%S.length;draw()};
play.onclick=()=>{if(t!==undefined&&t!==null){stopSimulation()}else{startSimulation()}};
draw();

/* ===== ADDITIVE INTERACTIVE MODULES — v1.1 preserved ===== */
const tcpipLayers=[
 [4,'Application','HTTP, DNS, DHCP, FTP','#8e5ab5','Data','Groups the Application, Presentation, and Session responsibilities of the OSI model.'],
 [3,'Transport','TCP, UDP','#34a853','Segment / Datagram','Transports data between processes and uses ports.'],
 [2,'Internet','IP, ICMP','#f9ab00','Packet','Provides logical addressing and routing between networks.'],
 [1,'Network Access','Ethernet, Wi-Fi, ARP','#ff6d00','Frame / Bits','Groups Data Link and Physical responsibilities.']
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

document.getElementById('modelToggle').addEventListener('click',(event)=>{
  const btn=event.target.closest('button[data-model]');
  if(!btn)return;
  stopSimulation();
  interactiveModel=btn.dataset.model;
  document.querySelectorAll('#modelToggle button').forEach(b=>b.classList.toggle('model-active',b===btn));
  renderModelPanels();
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
document.getElementById('mainNav').addEventListener('click',(event)=>{
  const btn=event.target.closest('button[data-view]');
  if(btn) activateView(btn.dataset.view);
});

function getLearnData(){
  if(interactiveModel==='tcpip') return tcpipLayers;
  return originalLayers.map(x=>{
    const extra={
      7:['Data','This is where applications use network services and generate information for communication.'],
      6:['Data','It covers data representation, encoding, encryption, and compression.'],
      5:['Data','Covers session establishment, maintenance, and termination.'],
      4:['Segment / Datagram','Transports information between processes through ports and protocols such as TCP and UDP.'],
      3:['Packet','Adds IP addressing and enables routing between different networks.'],
      2:['Frame','Builds frames for the local link and uses MAC addresses and technologies such as Ethernet.'],
      1:['Bits','Represents transmission through electrical, optical, or wireless signals.']
    }[x[0]];
    return [...x,extra[0],extra[1]];
  });
}

function renderLearn(){
  const protocols={
    ethernet:{title:'Ethernet II',layer:'2 — Data Link',pdu:'Frame',color:'#ff6d00',intro:'Ethernet II encapsulates a Layer 3 packet inside a frame for a local link. The Ethernet II header is 14 bytes; the FCS is an additional 4 bytes.',fields:[
      ['Destination MAC',48,6,'00:1A:2B:3C:4D:5E','Identifies the destination interface on the local link.','Sender / NIC','Switch / receiving NIC'],
      ['Source MAC',48,6,'11:22:33:44:55:66','Identifies the interface transmitting the frame.','NIC sender','Switch / receiver'],
      ['EtherType',16,2,'0x0800','Indicates the encapsulated protocol; 0x0800 identifies IPv4.','NIC / driver','NIC / Layer 2'],
      ['Payload',46*8,46,'IP packet','Carries the upper-layer PDU. Ethernet II supports up to 1500 bytes of payload with a typical Ethernet MTU.','NIC','NIC / Layer 3'],
      ['FCS',32,4,'0x1A2B3C4D','CRC used to detect frame errors.','Transmitting NIC','Receiving NIC']
    ]},
    ipv4:{title:'IPv4',layer:'3 — Network',pdu:'Packet',color:'#f9ab00',intro:'IPv4 provides logical addressing and routing. The base header is 20 bytes and can grow when options are present.',fields:[
      ['Version',4,0.5,'0100 / 4','Indicates the IP version: IPv4.','Host / router','Host / router'],
      ['IHL',4,0.5,'0101 / 5','Indicates the length dthe header in 32-bit words. IHL=5 means 20 bytes.','Host / router','Host / router'],
      ['DSCP/ECN',8,1,'0x00','Service classification and Explicit Congestion Notification.','Host / router','Router / host'],
      ['Total Length',16,2,'125 bytes','Total IPv4 packet length: header + data.','Host / router','Host / router'],
      ['Identifiestion',16,2,'0x1234','Identifies the set of fragments belonging to the same original packet.','Source host','Destination during reassembly'],
      ['Flags',3,0.375,'DF / MF','Controls fragmentation. DF prevents fragmentation; MF indicates that more fragments follow.','Host / router','Router / destination'],
      ['Fragment Offset',13,1.625,'0','Indicates the fragment position within the original payload, in 8-byte units.','Host / router','Destination'],
      ['TTL',8,1,'64','Limits packet lifetime; routers decrement it when forwarding.','Source host','Router'],
      ['Protocol',8,1,'6 / TCP','Identifies the upper-layer PDU: 6 TCP, 17 UDP, 1 ICMP.','Source host','Destination host'],
      ['Header Checksum',16,2,'0x....','Detects errors in the IPv4 header. It is recalculatested when the header changes, for example when TTL is decremented.','Host / router','Host / router'],
      ['Source Address',32,4,'192.168.1.10','Source IPv4 address of the packet.','Source host','Router / destination host'],
      ['Destination Address',32,4,'142.250.72.14','Destination IPv4 address of the packet.','Source host','Router / destination host'],
      ['Options + Padding',0,0,'Variable','Optional fields; if present, IHL increases above 5.','Host / router','Host / router']
    ]},
    tcp:{title:'TCP',layer:'4 — Transport',pdu:'Segment',color:'#34a853',intro:'TCP provides connection-oriented transport, sequencing, ACKs, flow control, and retransmission. Its minimum header is 20 bytes.',fields:[
      ['Source Port',16,2,'51500','Identifies the sending process port.','Source host','Destination host'],
      ['Destination Port',16,2,'443','Identifies the destination service port.','Source host','Destination host'],
      ['Sequence Number',32,4,'1001','Numbers bytes in the TCP stream for ordering and detecting loss.','Source host','Destination host'],
      ['Acknowledgment Number',32,4,'2001','Indicates the next byte expected by the receiver when ACK is set.','Source host','Destination host'],
      ['Data Offset',4,0.5,'0101 / 5','Indicates the length dthe header in 32-bit words.','Source host','Destination host'],
      ['Reserved',3,0.375,'000','Reserved bits for future use.','Source host','Destination host'],
      ['Flags',9,1.125,'SYN/ACK/FIN/PSH/RST...','Control TCP states and functions. SYN starts, ACK acknowledges, FIN terminates, and RST resets.','Source host','Destination host'],
      ['Window Size',16,2,'64240','Advertises available receive space for flow control.','Receiving host','Source host'],
      ['Checksum',16,2,'0x....','Verifies TCP using the IP pseudo-header and data.','Source host','Destination host'],
      ['Urgent Pointer',16,2,'0','Has meaning when URG is set.','Source host','Destination host'],
      ['Options + Padding',0,0,'MSS / SACK / TS...','Options that can extend the header beyond 20 bytes.','Source host','Destination host']
    ]},
    udp:{title:'UDP',layer:'4 — Transport',pdu:'Datagram',color:'#34a853',intro:'UDP provides connectionless transport with a fixed 8-byte header. It does not itself provide reliable delivery, ordering, or retransmission.',fields:[
      ['Source Port',16,2,'53000','Sending process port; it may be 0 in specific contexts.','Source host','Destination host'],
      ['Destination Port',16,2,'53','Destination service port; 53 is commonly used for DNS.','Source host','Destination host'],
      ['Length',16,2,'40','Total UDP datagram length: header + data.','Source host','Destination host'],
      ['Checksum',16,2,'0x....','Error detection using the IP pseudo-header and data.','Source host','Destination host']
    ]},
    icmp:{title:'ICMP Echo',layer:'3 — Network',pdu:'ICMP message',color:'#f9ab00',intro:'ICMP communicates IP control and diagnostic information. Ping uses Echo Request and Echo Reply.',fields:[
      ['Type',8,1,'8 request / 0 reply','Identifies the ICMP message type.','Source host','Destination host'],
      ['Code',8,1,'0','Message subtype. For Echo Request/Reply it is normally 0.','Source host','Destination host'],
      ['Checksum',16,2,'0x....','Verifies the ICMP message.','Source host','Destination host'],
      ['Identifier',16,2,'0x1234','Helps correlate Echo requests and replies.','Source host','Destination host'],
      ['Sequence Number',16,2,'1','Numbers Echo requests.','Source host','Destination host'],
      ['Data',0,0,'payload','Optional data used to test size and content.','Source host','Destination host']
    ]},
    arp:{title:'ARP',layer:'2 — Data Link / Layer 3 support',pdu:'ARP message',color:'#ff6d00',intro:'ARP resolves an IPv4 address to a MAC address on the local LAN. The request is usually broadcast; the reply is usually unicast.',fields:[
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
    3:{name:'Network',color:'#f9ab00',text:'Logical addressing and routing. IPv4, IPv6, and ICMP function here.'},
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
    return `<div class="deepHeaderCard" style="--c:${p.color}"><div class="deepHeaderTitle"><div><span class="modelBadge">${p.layer}</span><h2>${p.title}</h2><p>${p.intro}</p></div><div class="headerSize"><b>${total||'Variable'} ${total?'bytes':''}</b><small>${p.title==='Ethernet II'?'Header = 14 B · FCS = 4 B aparte':p.title==='IPv4'?'Header base = 20 B':p.title==='TCP'?'Header minimum = 20 B':p.title==='UDP'?'Header = 8 B':''}</small></div></div>${fieldTable(p)}<div class="fieldRule"><b>Processing rule:</b> a device does not move one intact header through every layer. Each layer interprets its own PDU, and the next hop may create a new encapsulation.</div></div>`;
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
    panel.innerHTML=`<div class="deepSection"><h2>OSI and TCP/IP Models</h2><p>This view covers the conceptual foundation first, then drills down into protocols and headers.</p><div class="modelCompareDeep"><div><h3>OSI — 7 layers</h3>${Object.entries(layerGuide).map(([n,x])=>`<div class="modelRow" style="--c:${x.color}"><b>${n}</b><span>${x.name}</span><small>${x.text}</small></div>`).join('')}</div><div><h3>TCP/IP — 4 layers</h3><div class="modelRow" style="--c:#8e5ab5"><b>4</b><span>Application</span><small>HTTP, DNS, DHCP, and other application protocols.</small></div><div class="modelRow" style="--c:#34a853"><b>3</b><span>Transport</span><small>TCP and UDP.</small></div><div class="modelRow" style="--c:#f9ab00"><b>2</b><span>Internet</span><small>IP and ICMP.</small></div><div class="modelRow" style="--c:#ff6d00"><b>1</b><span>Network Access</span><small>Ethernet, Wi‑Fi, ARP, and network-access functions.</small></div></div></div></div><div class="deepSection"><h3>Web request map</h3><div class="formulaFlow"><span>HTTP data</span><b>↓</b><span>TCP segment</span><b>↓</b><span>IPv4 packet</span><b>↓</b><span>Ethernet frame</span><b>↓</b><span>bits</span></div></div>`;
  }
  function renderOverview(){
    panel.innerHTML=`<div class="deepIntroGrid">
      <div class="deepIntroCard"><h2>What will you learn?</h2><p>Communication is not just one single “packet.” Each layer works with a PDU and adds its own information. This section lets you inspect the actual fields and their sizes.</p><ul><li>Bits → bytes → campos → PDU.</li><li>Encapsulation at the sender.</li><li>Decapsulation at the receiver.</li><li>TCP segmentation vs IPv4 fragmentation.</li><li>MAC per link vs. IP end to end.</li><li>Fragment reassembly at the destination.</li></ul></div>
      <div class="deepIntroCard"><h2>Mental model</h2><div class="formulaFlow"><span>Data</span><b>+</b><span>TCP/UDP</span><b>+</b><span>IPv4</span><b>+</b><span>Ethernet</span><b>→</b><span>Bits</span></div><p>En el destino the process is reversed: bits → frame → packet → segment/datagram → data.</p></div>
    </div>
    <div class="deepSection"><h2>PDUs and responsibilities</h2><div class="pduGrid"><div><b>Application</b><span>Data</span></div><div><b>Transport</b><span>TCP segment / UDP datagram</span></div><div><b>Network</b><span>Packet IPv4 / IPv6</span></div><div><b>Enlace</b><span>Ethernet frame</span></div><div><b>Physical</b><span>Bits / signals</span></div></div></div>
    <div class="deepSection"><h2>Select a header</h2><div class="protocolCards">${Object.values(protocols).map(p=>`<button type="button" class="protocolCard" data-proto="${p.title==='Ethernet II'?'ethernet':p.title==='IPv4'?'ipv4':p.title.toLowerCase().split(' ')[0]}"><b>${p.title}</b><small>${p.layer}</small><span>${p.fields.length} campos definidos</span></button>`).join('')}</div></div>`;
    panel.querySelectorAll('[data-proto]').forEach(b=>b.onclick=()=>setTab(b.dataset.proto==='ipv4'?'headers':b.dataset.proto));
  }
  function renderEncap(){
    panel.innerHTML=`<div class="deepSection"><h2>Encapsulation — step by step</h2><p>See what each layer adds. The example sizes are deliberately small so the arithmetic is easy to follow.</p><div class="encapFlow">
      <div class="encapStep appStep"><b>1 · DATA</b><span>HTTP / application</span><strong>85 B</strong><small>Generated by the application.</small></div><div class="encapArrow">↓</div>
      <div class="encapStep tcpStep"><b>2 · TCP SEGMENT</b><span>TCP header 20 B + application data 85 B</span><strong>105 B</strong><small>Transport adds ports, sequence numbers, ACKs, flags, etc.</small></div><div class="encapArrow">↓</div>
      <div class="encapStep ipStep"><b>3 · IPv4 PACKET</b><span>IPv4 header 20 B + TCP segment 105 B</span><strong>125 B</strong><small>Network adds source/destination IP addresses, TTL, protocol, etc.</small></div><div class="encapArrow">↓</div>
      <div class="encapStep ethStep"><b>4 · ETHERNET FRAME</b><span>14 B header + 125 B payload + 4 B FCS</span><strong>143 B</strong><small>Data Link adds MAC addresses and EtherType; FCS is added for error detection.</small></div><div class="encapArrow">↓</div>
      <div class="encapStep bitsStep"><b>5 · PHYSICAL</b><span>The frame is transmitted as bits/signals.</span><strong>1144 bits</strong><small>143 B × 8 = 1144 bits, not including the preamble/SFD here.</small></div>
    </div></div>
    <div class="deepSection"><h2>Decapsulation</h2><div class="deencap"><span>Bits</span><i>→</i><span>Frame</span><i>→</i><span>Packet</span><i>→</i><span>Segment</span><i>→</i><span>Data</span></div><p>The receiver consumes each layer's information and delivers the PDU to the upper layer.</p></div>`;
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
      <div class="fragmentCompare"><div><h3>TCP segmentation</h3><p><b>Layer:</b> Transport</p><p><b>Unit:</b> segmento TCP</p><p><b>Responsible:</b> TCP en el sending host</p><p><b>Goal:</b> adapt the data flow and manage sequencing, ACKs, and retransmission.</p><p>Every TCP segment has its own TCP header.</p></div><div><h3>IPv4 fragmentation</h3><p><b>Layer:</b> Network</p><p><b>Unit:</b> IP fragment</p><p><b>Responsible:</b> IPv4 host or router, if DF does not prevent fragmentation.</p><p><b>Goal:</b> allow a packet to cross a link with a smaller MTU.</p><p>Later fragments do not repeat the TCP header; they carry their own IPv4 header.</p></div></div>
      <div class="fragmentExample"><h3>Example: IP packet of 4000 B, MTU = 1500 B</h3><div class="fragBar"><div>Fragmento 1<br><b>1500 B</b><small>IPv4 20 + data 1480<br>Offset 0 · MF=1</small></div><div>Fragmento 2<br><b>1500 B</b><small>IPv4 20 + data 1480<br>Offset 185 · MF=1</small></div><div>Fragmento 3<br><b>1040 B</b><small>IPv4 20 + data 1020<br>Offset 370 · MF=0</small></div></div><p class="note">The offset is expressed in 8-byte units: 1480/8 = 185. The sum of fragmented payloads is 3980 B, which corresponds to the original packet of 4000 B minus its 20-byte IPv4 header.</p></div>
      <div class="fragmentFlags"><div><b>Identifiestion</b><span>16 bits / 2 B</span><small>Same value in all fragments of the original packet.</small></div><div><b>Flags</b><span>3 bits</span><small>DF prevents fragmentation; MF indicates that more fragments follow.</small></div><div><b>Fragment Offset</b><span>13 bits</span><small>Position of the payload within the original packet.</small></div></div></div>`;
  }
  function renderJourney(){
    panel.innerHTML=`<div class="deepSection"><h2>Packet Journey — what changes at each hop</h2><p>The router does not forward the same Ethernet frame end to end. It processes the received frame, extracts the IP packet, selects the next hop, and builds a new frame for the next link.</p><div class="journeyTable"><div class="jHead"><b>Hop</b><b>Ethernet Source</b><b>Ethernet Destination</b><b>IP Source</b><b>IP Destination</b><b>TTL</b></div><div><span>PC A → Router</span><code>11:22:33:44:55:66</code><code>00:AA:BB:CC:DD:01</code><code>192.168.1.10</code><code>142.250.72.14</code><code>64</code></div><div><span>Router → next hop</span><code>00:AA:BB:CC:DD:02</code><code>00:AA:BB:CC:DD:03</code><code>192.168.1.10</code><code>142.250.72.14</code><code>63</code></div><div><span>Last link → server</span><code>00:AA:BB:CC:DD:04</code><code>AA:BB:CC:DD:EE:FF</code><code>192.168.1.10</code><code>142.250.72.14</code><code>62</code></div></div><div class="journeyRules"><div><b>MAC</b><span>Changes per link.</span></div><div><b>IP</b><span>Remains end to end in the basic case, except for functions such as NAT.</span></div><div><b>TTL</b><span>The router decrements it when forwarding.</span></div><div><b>Ethernet FCS</b><span>Generated for each new frame.</span></div></div></div>`;
  }
  function renderMTU(){
    panel.innerHTML=`<div class="deepSection"><h2>MTU — calculate before capturing</h2><p>MTU is the maximum size of the PDU that a link can carry in a single unit. In Ethernet, 1500 B is a typical IP payload value.</p><div class="mtuTool"><label>Packet IPv4 (bytes)<input id="learnIpSize" type="number" min="20" value="4000"></label><label>MTU (bytes)<input id="learnMtu" type="number" min="68" value="1500"></label><button id="learnMtuCalc">Calculate</button></div><div id="learnMtuResult"></div></div><div class="deepSection"><h3>What happens when DF is set</h3><p>If the packet exceeds the MTU and DF=1, the router cannot fragment it. In IPv4, an ICMP Destination Unreachable message related to fragmentation/MTU may be generated, enabling mechanisms such as Path MTU Discovery.</p></div>`;
    function calc(){const size=Math.max(20,+document.getElementById('learnIpSize').value||20),mtu=Math.max(68,+document.getElementById('learnMtu').value||1500),payload=mtu-20,n=Math.ceil((size-20)/payload);let html='';if(size<=mtu){html=`<div class="mtuResult ok"><b>No fragmentation.</b><span>${size} B ≤ ${mtu} B</span></div>`}else{let rem=size-20,off=0,rows=[];for(let k=0;rem>0;k++){let d=Math.min(payload,rem);if(rem>d)d=d-(d%8);rows.push(`<div><b>Fragment ${k+1}</b><span>${d+20} B total</span><small>Offset ${off/8} · ${rem>d?'MF=1':'MF=0'}</small></div>`);off+=d;rem-=d;}html=`<div class="mtuResult"><b>Requires ${n} fragments</b><span>Payload available per fragment: ${payload} B</span><div class="mtuFragments">${rows.join('')}</div></div>`}document.getElementById('learnMtuResult').innerHTML=html}
    document.getElementById('learnMtuCalc').onclick=calc; calc();
  }
  function renderProtocol(k){panel.innerHTML=`<div class="deepSection">${headerView(protocols[k])}</div>`;}
  workspace.addEventListener('click',(event)=>{const button=event.target.closest('#deepTabs .learnTab');if(!button)return;event.preventDefault();setTab(button.dataset.deep);});
  setTab('overview');
}

function renderBuild(){
  workspace.innerHTML=`<section><div class="workspaceTitle"><h2>BUILD — Interactive encapsulation</h2><p>Change the data and observe how the segment, IP packet, and Ethernet frame change.</p></div><div class="builderGrid"><div class="builderControls"><div class="field"><label>Transport</label><select id="buildTransport"><option>TCP</option><option>UDP</option></select></div><div class="field"><label>Application data (bytes)</label><input id="buildData" type="number" value="85" min="1"></div><div class="field"><label>Source IP</label><input id="buildSrc" value="192.168.1.10"></div><div class="field"><label>Destination IP</label><input id="buildDst" value="142.250.72.14"></div></div><div class="builderPreview" id="builderPreview"></div></div></section>`;
  function calc(){
    const d=Math.max(1,+buildData.value||1);
    const proto=buildTransport.value;
    const th=proto==='TCP'?20:8;
    const segment=d+th, ip=segment+20, payload=Math.max(ip,46), padding=Math.max(0,46-ip), frame=14+payload+4;
    builderPreview.innerHTML=`<h3>Result</h3><div class="box app"><b>APPLICATION DATA</b><br>${d} bytes</div><div class="row"><div class="box tcp"><b>${proto} HEADER</b><br>${th} bytes</div><div class="box app small"><b>${proto} PDU</b><br>${segment} bytes</div></div><div class="row"><div class="box ip"><b>IP HEADER</b><br>${buildSrc.value} → ${buildDst.value}</div><div class="box tcp small"><b>IP PACKET</b><br>${ip} bytes</div></div><div class="row"><div class="box eth"><b>ETHERNET HEADER</b><br>14 bytes</div><div class="box ip small"><b>PAYLOAD</b><br>${payload} bytes</div><div class="box eth fcs"><b>FCS</b><br>4 bytes</div></div><p><b>Total:</b> 14 + ${payload} + 4 = <b>${frame} bytes</b>${padding?`<br><b>Padding:</b> ${padding} bytes to reach the Ethernet minimum payload of 46 bytes.`:''}</p>`;
  }
  [buildTransport,buildData,buildSrc,buildDst].forEach(e=>e.addEventListener('input',calc));
  calc();
}

function renderInspect(){
  const fields=[
    ['PREAMBLE','8 B','#777',8,'Synchronizes reception before transmission.'],
    ['DEST MAC','6 B','#1a73a8',6,'Identifies the destination within the local link.'],
    ['SRC MAC','6 B','#34a853',6,'Identifies the interface transmitting the frame.'],
    ['TYPE','2 B','#f9ab00',2,'Indicates the carried protocol; for example, 0x0800 for IPv4.'],
    ['PAYLOAD','46–1500 B','#8e5ab5',15,'Carries the upper-layer PDU and may include padding.'],
    ['FCS','4 B','#ea4335',4,'Used for error detection through CRC.']
  ];
  const ieee=[
    ['802.3','Ethernet','Wired Ethernet networking standard. Defines technologies related to medium access and transmission on LANs.','Data Link / Physical','Ethernet over physical media'],
    ['802.11','Wi‑Fi','Family of standards for wireless LANs using radio-based access mechanisms.','Data Link / Physical','WLAN networking'],
    ['802.1Q','VLAN','Standard used to identify VLANs through tagging inside Ethernet frames, enabling logical network segmentation.','Data Link','VLAN tagging'],
    ['802.1D','Bridging and STP','Historically associated with bridging and Spanning Tree Protocol for Layer 2 loop prevention.','Data Link','Switching and loop prevention'],
    ['802.1X','Access control','Provides an authentication-based framework for controlling network access.','Data Link','Access authentication']
  ];
  workspace.innerHTML=`<section><div class="workspaceTitle"><h2>INSPECT — Ethernet and IEEE 802.*</h2><p>Explore the structure of an Ethernet frame and then review several important standards in the IEEE 802 family.</p></div>
  <div class="inspectGrid"><div class="inspectBox"><h3>Ethernet frame</h3><div class="inspectFields" id="inspectFields"></div><p id="inspectText">Select a field.</p></div><div class="inspectBox"><h3>Minimum length</h3><p>From Destination MAC through FCS, a minimum Ethernet frame has <b>64 bytes</b>: 14-byte header + minimum 46-byte payload + 4-byte FCS.</p></div></div>
  <div class="workspaceTitle" style="margin-top:20px"><h2>IEEE 802.* family</h2><p>Select a standard to review what technology it represents and where it appears in networking.</p></div><div class="ieeeTabs" id="ieeeTabs"></div><div class="ieeeDetail" id="ieeeDetail"></div></section>`;
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
    ieeeDetail.innerHTML=`<h3>${x[0]} — ${x[1]}</h3><p>${x[2]}</p><div class="ieeeFacts"><div class="studyFact"><b>Model</b>${x[3]}</div><div class="studyFact"><b>Primary use</b>${x[4]}</div><div class="studyFact"><b>Family</b>IEEE 802.*</div></div>`;
  }
  document.querySelectorAll('#ieeeTabs button').forEach(b=>b.addEventListener('click',()=>showIEEE(+b.dataset.k)));
  showIEEE(0);
}



function renderCoding(){
  workspace.innerHTML=`<section>
    <div class="workspaceTitle">
      <h2>ENCODING — Manchester and 4B/5B</h2>
      <p>Explore two techniques related to data transmission. Manchester shows how bits are represented through signal transitions. 4B/5B shows how groups of 4 bits are transformed into 5-bit codes before physical transmission.</p>
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
        <p>In this visualization, each bit occupies one time period and contains a transition in the center. The transition represents the bit value and provides a timing reference within each period.</p>
        <div class="conventionBox"><b>Convention used here:</b> 0 = High → Low · 1 = Low → High. Alternative conventions may invert this polarity; the key point is the characteristic center transition in each bit period.</div>
      </div>
      <div class="manchesterControls">
        <div>
          <label><b>Bit sequence</b></label>
          <input id="manBits" class="bitInput" value="10110010" maxlength="16">
          <small>Use only 0 and 1. Maximum 16 bits.</small>
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
          <div class="waveLegend">Each vertical block represents one bit period. The gray area indicates the bit currently being studied.</div>
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
      <text x="5" y="${high+5}" font-size="12">HIGH</text>
      <text x="8" y="${low+5}" font-size="12">LOW</text>`;

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
      waveInfo.innerHTML=`<b>Sequence:</b> ${bits} · <b>Selected bit:</b> ${pos+1} of ${bits.length}`;
      const b=bits[pos];
      manStepText.innerHTML=`<b>Bit ${pos+1} = ${b}.</b> With the convention used here, ${b==='0'?'the signal starts high and transitions to low':'the signal starts low and transitions to high'} at the center of the bit period.`;
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
        <h2>4B/5B — Block coding</h2>
        <p>4B/5B takes information in groups of <b>4 bits</b> and converts each group into a <b>5-bit code</b>. The goal is to use selected patterns so the encoded stream has enough transitions for clock recovery while avoiding problematic long sequences in the later signal representation.</p>
        <div class="conventionBox"><b>Important:</b> 4B/5B does not directly draw a waveform like Manchester. It transforms the data first; the result can then pass to a Physical-layer signaling method.</div>
      </div>

      <div class="fourBControls">
        <div>
          <label><b>Input data</b></label>
          <input id="fourInput" class="bitInput" value="10110010" maxlength="32">
          <small>Use a number of bits that is a multiple of 4. Maximum 32 bits.</small>
          <div class="manchesterActions">
            <button id="fourApply">Encode</button>
            <button id="fourPrev">◀ Group</button>
            <button id="fourNext">Group ▶</button>
            <button id="fourAuto">▶ Play</button>
          </div>
        </div>
        <div class="fourSummary">
          <div><b>Entrada</b><span id="fourInCount"></span></div>
          <div><b>Output 4B/5B</b><span id="fourOutCount"></span></div>
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
        <h3>4B/5B data code table</h3>
        <p>Each 4-bit data combination is assigned a 5-bit pattern.</p>
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
      fourGroupCount.textContent=`${gs.length} group${gs.length===1?'':'s'}`;

      fourOriginal.innerHTML=gs.map((x,k)=>`<button class="nibble ${k===group?'active':''}" data-k="${k}"><small>Group ${k+1}</small><b>${x[0]}</b></button>`).join('');
      fourEncoded.innerHTML=gs.map((x,k)=>`<button class="codeword ${k===group?'active':''}" data-k="${k}"><small>Group ${k+1}</small><b>${x[1]}</b></button>`).join('');

      document.querySelectorAll('.nibble,.codeword').forEach(e=>e.addEventListener('click',()=>{
        stopTimer();
        group=+e.dataset.k;
        renderGroups();
      }));

      const current=gs[group];
      fourStepText.innerHTML=`<b>Group ${group+1}:</b> the 4 bits <b>${current[0]}</b> are looked up in the table and transformed into the 5-bit code <b>${current[1]}</b>. The complete output sequence is: <span class="outputBits">${encoded}</span>.`;
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
        <h2>Manchester and 4B/5B — What is the difference?</h2>
        <p>Although both appear in the study of physical data transmission, they operate at different stages of the process.</p>
      </div>
      <div class="codingCompareGrid">
        <div class="codingCompareCard">
          <h3>Manchester</h3>
          <div class="compareBig">1 bit → signal</div>
          <p>Works directly with the time-domain representation of each bit through signal transitions.</p>
          <div class="processMini"><span>1011</span><b>→</b><span class="signalMini">⌜┘⌞⌝</span></div>
          <p><b>Key idea:</b> observe how the signal changes during each bit period.</p>
        </div>
        <div class="codingCompareCard">
          <h3>4B/5B</h3>
          <div class="compareBig">4 bits → 5 bits</div>
          <p>Transforms blocks of data before physical signaling.</p>
          <div class="processMini"><span>1011</span><b>→</b><span>10111</span></div>
          <p><b>Key idea:</b> modify the bit pattern to obtain an appropriate encoded sequence for later transmission.</p>
        </div>
      </div>
      <div class="codingFlow">
        <h3>One way to visualize the difference</h3>
        <div class="flowSteps">
          <div>DATA<br><b>1011</b></div>
          <span>→</span>
          <div class="highlightFlow">4B/5B<br><b>10111</b></div>
          <span>→</span>
          <div>PHYSICAL SIGNALING<br><b>waveform</b></div>
        </div>
        <p>Manchester focuses on representing bits as a signal. 4B/5B, by contrast, introduces a block-coding stage that transforms data before the corresponding physical representation.</p>
      </div>`;
  }

  document.querySelectorAll('.codingTab').forEach(b=>b.addEventListener('click',()=>setCoding(b.dataset.coding)));
  setCoding('manchester');
}



/* ===== NETWORK LAB — ARP, DNS, DHCP, NAT, VLAN, STP, ROUTING, IPv6, SUBNETTING ===== */
function renderNetworkLab(){
  workspace.innerHTML=`<section>
    <div class="workspaceTitle">
      <h2>NETWORK LAB — Network protocols and concepts</h2>
      <p>Explore fundamental network processes step by step. Each lab combines a short explanation with an interactive representation of the process.</p>
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
      ['1. PC A needs a MAC','The host wants to send traffic to gateway 192.168.1.1, but initially knows only its IP address.'],
      ['2. ARP Request','PC A sends an ARP request as a broadcast: “Who has 192.168.1.1?”'],
      ['3. El gateway reconoce su IP','The router receives the request and recognizes that the queried IP address belongs to it.'],
      ['4. ARP Reply','The gateway normally replies with its MAC address using unicast.'],
      ['5. Updated ARP table','PC A temporarily stores the IP ↔ MAC mapping and can now build the Ethernet frame.']
    ];
    panel.innerHTML=`<div class="labIntro"><h2>ARP — IP-to-MAC address resolution</h2><p>ARP allows an IPv4 host to discover the MAC address associated with an IP address on its local network. ARP operates in the context of the local link: to reach an external network, a host normally resolves the MAC address of its next hop, such as the default gateway.</p></div>
    <div class="labTopology three"><div>🖥️<b>PC A</b><small>IP 192.168.1.10<br>MAC 11:22:33:44:55:66</small></div><span>⇄</span><div>⌁<b>Gateway</b><small>IP 192.168.1.1<br>MAC AA:BB:CC:DD:EE:FF</small></div></div>
    <div class="labControls"><button id="arpPrev">◀ Previous</button><button id="arpNext">Next ▶</button></div>
    <div id="arpStep" class="processCard"></div><div class="miniTable"><b>PC A ARP table</b><div id="arpTable">192.168.1.1 → <em>unknown</em></div></div>`;
    const arpPrev=document.getElementById('arpPrev');
    const arpNext=document.getElementById('arpNext');
    const arpStep=document.getElementById('arpStep');
    const arpTable=document.getElementById('arpTable');
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
      ['Local resolver','The system queries its configured resolver and may check caches before making new queries.'],
      ['DNS resolution','The DNS service looks up or queries the information needed to answer the requested name.'],
      ['Respuesta','The resolver returns an address or set of addresses associated with the name, depending on available records.'],
      ['Connection','With an IP address available, the client can continue communication toward the destination.']
    ];
    panel.innerHTML=`<div class="labIntro"><h2>DNS — From name to IP address</h2><p>DNS maps human-readable names to information used by network systems. In web browsing, one visible function is obtaining an IP address for a domain name.</p></div>
    <div class="dnsFlow">${steps.map((s,k)=>`<div class="dnsNode ${k===0?'active':''}" data-k="${k}"><b>${s[0]}</b><small>${k===0?'google.com':'...'}</small></div>${k<steps.length-1?'<span>→</span>':''}`).join('')}</div>
    <div class="labControls"><button id="dnsPrev">◀ Step</button><button id="dnsNext">Step ▶</button></div><div id="dnsStep" class="processCard"></div>`;
    const dnsPrev=document.getElementById('dnsPrev');
    const dnsNext=document.getElementById('dnsNext');
    const dnsStep=document.getElementById('dnsStep');
    let k=0;
    function draw(){document.querySelectorAll('.dnsNode').forEach(x=>x.classList.toggle('active',+x.dataset.k===k));dnsStep.innerHTML=`<b>Step ${k+1}: ${steps[k][0]}</b><p>${steps[k][1]}</p>`}
    dnsPrev.onclick=()=>{k=Math.max(0,k-1);draw()};dnsNext.onclick=()=>{k=Math.min(4,k+1);draw()};draw();
  }

  function labDHCP(){
    const dora=[
      ['DISCOVER','The client does not yet have usable IPv4 configuration and sends a message to discover available DHCP servers.'],
      ['OFFER','A DHCP server can offer configuration, including an available IP address and other parameters.'],
      ['REQUEST','The client requests the selected offer.'],
      ['ACKNOWLEDGE','The server confirms the assignment and the client can apply the received configuration.']
    ];
    panel.innerHTML=`<div class="labIntro"><h2>DHCP — Automatic configuration</h2><p>DHCP can automatically distribute network configuration parameters. The common introductory exchange is summarized as <b>DORA</b>: Discover, Offer, Request, and Acknowledge.</p></div>
    <div class="doraFlow">${dora.map((x,k)=>`<button class="dora ${k===0?'active':''}" data-k="${k}"><b>${x[0]}</b><small>${['Client → Broadcast','Server → Client','Client → Server','Server → Client'][k]}</small></button>`).join('')}</div>
    <div id="doraDetail" class="processCard"></div><div class="configBox">Example final configuration: <b>IP 192.168.1.50 /24</b> · Gateway <b>192.168.1.1</b> · DNS <b>192.168.1.1</b></div>`;
    const doraDetail=document.getElementById('doraDetail');
    function select(k){document.querySelectorAll('.dora').forEach(x=>x.classList.toggle('active',+x.dataset.k===k));doraDetail.innerHTML=`<b>${k+1}. ${dora[k][0]}</b><p>${dora[k][1]}</p>`}
    document.querySelectorAll('.dora').forEach(x=>x.onclick=()=>select(+x.dataset.k));select(0);
  }

  function labNAT(){
    panel.innerHTML=`<div class="labIntro"><h2>NAT — Address translation</h2><p>NAT modifies addressing information when a packet crosses a point where a translation policy is applied. A common case is PAT/NAT overload, where multiple private hosts share a public address using different ports.</p></div>
    <div class="natDiagram"><div class="natSide"><b>PRIVATE NETWORK</b><div>PC A<br><small>192.168.1.10:51500</small></div><div>PC B<br><small>192.168.1.20:51501</small></div></div><div class="natDevice"><b>ROUTER NAT</b><small>192.168.1.1<br>203.0.113.10</small><button id="natTranslate">Translate</button></div><div class="natSide"><b>INTERNET</b><div>Server<br><small>Destination: 142.250.x.x:443</small></div></div></div>
    <div id="natResult" class="processCard"><b>Before NAT:</b><p>192.168.1.10:51500 → server:443</p></div>`;
    const natTranslate=document.getElementById('natTranslate');
    const natResult=document.getElementById('natResult');
    natTranslate.onclick=()=>natResult.innerHTML='<b>After NAT/PAT:</b><p>203.0.113.10:40001 → server:443</p><small>The NAT device maintains a table that associates the translated flow with the corresponding internal host.</small>';
  }

  function labVLAN(){
    panel.innerHTML=`<div class="labIntro"><h2>VLAN and 802.1Q — Logical network separation</h2><p>A VLAN logically divides a broadcast domain. On a trunk link, an 802.1Q tag can carry VLAN membership information for multiple VLANs between compatible devices.</p></div>
    <div class="vlanControls"><button class="vlanBtn active" data-v="10">VLAN 10 — Sales</button><button class="vlanBtn" data-v="20">VLAN 20 — Support</button><button class="vlanBtn" data-v="30">VLAN 30 — Administration</button></div>
    <div id="vlanVisual" class="vlanVisual"></div><div class="tagBox">Example tagged frame: <b>MAC Destination | MAC Source | 802.1Q: VLAN <span id="vlanId">10</span> | EtherType | Data</b></div>`;
    const groups={10:['PC A','PC B'],20:['PC C','PC D'],30:['PC E','Server']};
    const vlanVisual=document.getElementById('vlanVisual');
    const vlanId=document.getElementById('vlanId');
    function draw(v){document.querySelectorAll('.vlanBtn').forEach(x=>x.classList.toggle('active',x.dataset.v===String(v)));vlanId.textContent=v;vlanVisual.innerHTML=`<div class="switchLab"><b>SWITCH</b><small>Access ports and trunk link</small></div><div class="vlanHosts">${groups[v].map(x=>`<div>🖥️<b>${x}</b><small>VLAN ${v}</small></div>`).join('')}</div><div class="vlanExplain">The displayed devices belong to VLAN ${v}. A different VLAN is a separate logical domain and requires Layer 3 communication to exchange traffic between VLANs, except in special designs.</div>`}
    document.querySelectorAll('.vlanBtn').forEach(x=>x.onclick=()=>draw(+x.dataset.v));draw(10);
  }

  function labSTP(){
    panel.innerHTML=`<div class="labIntro"><h2>STP — Layer 2 loop prevention</h2><p>When redundant links exist between switches, a loop can form. STP builds a loop-free logical topology by blocking selected paths while preserving redundancy options.</p></div>
    <div class="stpCanvas"><button class="stpNode" id="rootSw">SW1<br><small>Root Bridge</small></button><button class="stpNode" id="sw2">SW2</button><button class="stpNode" id="sw3">SW3</button><div class="stpLine l1"></div><div class="stpLine l2"></div><div class="stpLine l3 blocked"></div></div>
    <div class="labControls"><button id="stpToggle">Show / hide logical blocking</button></div><div id="stpText" class="processCard"><b>Redundant topology:</b><p>SW1 is used as the conceptual Root Bridge reference. The SW2–SW3 link is shown blocked in this simplified model to prevent an active redundant path that could create a loop.</p></div>`;
    const stpToggle=document.getElementById('stpToggle');
    const stpText=document.getElementById('stpText');
    let blocked=true;stpToggle.onclick=()=>{blocked=!blocked;document.querySelector('.l3').classList.toggle('blocked',blocked);stpText.innerHTML=blocked?'<b>STP active:</b><p>One redundant path is logically blocked.</p>':'<b>Networkundancy view:</b><p>All links are shown. Without a control mechanism, a Layer 2 topology with redundant paths can create loops.</p>'};
  }

  function labRouting(){
    const routes=[
      ['Router A','192.168.10.0/24','Router B','10.0.0.2'],
      ['Router B','10.10.0.0/16','Router C','10.0.1.2'],
      ['Router C','172.16.0.0/16','Destination','172.16.1.20']
    ];
    panel.innerHTML=`<div class="labIntro"><h2>Routing — Next-hop selection</h2><p>A router examines the destination IP address and consults its routing information to select a next hop or outgoing interface. The process repeats across the network until a directly connected route or the destination is reached.</p></div>
    <div class="routeVisual"><div>🖥️<b>Source</b></div><span>→</span><div>⌁<b>Router A</b></div><span>→</span><div>⌁<b>Router B</b></div><span>→</span><div>⌁<b>Router C</b></div><span>→</span><div>▤<b>Destination</b></div></div>
    <div class="routeTable" id="routeTable"></div><div class="labControls"><button id="routePrev">◀ Hop</button><button id="routeNext">Next hop ▶</button></div><div id="routeStep" class="processCard"></div>`;
    const routeTable=document.getElementById('routeTable');
    const routePrev=document.getElementById('routePrev');
    const routeNext=document.getElementById('routeNext');
    const routeStep=document.getElementById('routeStep');
    let k=0;
    function draw(){routeTable.innerHTML=routes.map((r,x)=>`<div class="${x===k?'active':''}"><b>${r[0]}</b><span>Destination ${r[1]}</span><span>Next hop: ${r[3]}</span></div>`).join('');routeStep.innerHTML=`<b>Hop ${k+1}: ${routes[k][0]}</b><p>The router evaluates a route to reach ${routes[k][1]} and forwards the packet toward ${routes[k][2]} through ${routes[k][3]}.</p>`}
    routePrev.onclick=()=>{k=Math.max(0,k-1);draw()};routeNext.onclick=()=>{k=Math.min(2,k+1);draw()};draw();
  }

  function labIPv6(){
    const parts=['2001','0db8','0000','0000','0000','0000','0000','0042'];
    panel.innerHTML=`<div class="labIntro"><h2>IPv6 — 128-bit addressing</h2><p>An IPv6 address contains 128 bits and is commonly represented using eight groups of hexadecimal digits separated by colons. Abbreviation rules include removing leading zeros within a group and using <b>::</b> once to compress a consecutive sequence of zero groups.</p></div>
    <div class="ipv6Address">${parts.map((x,k)=>`<button class="ipv6Block" data-k="${k}">${x}</button>${k<7?'<span>:</span>':''}`).join('')}</div>
    <div id="ipv6Detail" class="processCard"><b>Full address:</b><p>2001:0db8:0000:0000:0000:0000:0000:0042</p><p>Example abbreviated form: <b>2001:db8::42</b></p></div>
    <div class="ipv6Header"><h3>Basic IPv6 header</h3><div>Version<br><b>4 bits</b></div><div>Traffic Class<br><b>8 bits</b></div><div>Flow Label<br><b>20 bits</b></div><div>Payload Length<br><b>16 bits</b></div><div>Next Header<br><b>8 bits</b></div><div>Hop Limit<br><b>8 bits</b></div><div>Source Address<br><b>128 bits</b></div><div>Destination Address<br><b>128 bits</b></div></div>`;
    const ipv6Detail=document.getElementById('ipv6Detail');
    document.querySelectorAll('.ipv6Block').forEach(x=>x.onclick=()=>{const k=+x.dataset.k;document.querySelectorAll('.ipv6Block').forEach(b=>b.classList.toggle('active',b===x));ipv6Detail.innerHTML=`<b>Group ${k+1}</b><p>The selected hexadecimal block represents 16 bits of the IPv6 address. Eight 16-bit groups form the complete 128-bit address.</p>`});
  }

  function labSubnet(){
    panel.innerHTML=`<div class="labIntro"><h2>Subnetting — Visually divide an IPv4 network</h2><p>Enter a network address and prefix. The lab calculatestes the mask, number of addresses, and block range. This tool works with IPv4 networks and shows basic prefix and block-size concepts.</p></div>
    <div class="subnetControls"><label>IP / Network<input id="subIp" value="192.168.1.0"></label><label>Prefix<select id="subPrefix">${Array.from({length:31},(_,i)=>`<option value="${i+1}" ${i+1===24?'selected':''}>/${i+1}</option>`).join('')}</select></label><button id="subCalc">Calculate</button></div>
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
        subExplain.innerHTML=`<b>How it is calculatested:</b><p>A prefix /${p} reserves ${p} bits for the network portion and leaves ${bits} bits for the host portion. Therefore the block contains 2<sup>${bits}</sup> = <b>${size.toLocaleString()}</b> addresses. For traditional prefixes of /30 or shorter, the usual simplified usable-host calculatestion is 2<sup>${bits}</sup> − 2.</p><small>* /31 and /32 are used in special scenarios and do not follow this simplified usable-host calculatestion.</small>`;
      }catch(e){subResults.innerHTML='<div class="error">Enter a valid IPv4 address.</div>';subExplain.innerHTML=''}
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
