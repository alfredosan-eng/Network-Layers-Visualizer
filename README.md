[**🚀 OPEN NETWORK LAYERS VISUALIZER**](https://alfredosan-eng.github.io/Network-Layers-Visualizer/)


# Network Layers Visualizer

**Network Layers Visualizer** is an educational, interactive web application for learning how network communication works across protocol layers. It combines visual simulation, protocol anatomy, encapsulation, addressing, switching, routing, fragmentation, subnetting, and encoding.

The project is designed as a **visual networking laboratory**. Instead of presenting isolated definitions, it lets students follow processes step by step and connect theory with observable packet structures.

```text
APPLICATION
    ↓
TRANSPORT
    ↓
NETWORK / ROUTING
    ↓
DATA LINK / FRAMES
    ↓
PHYSICAL / BITS
    ↓
COMMUNICATION ACROSS THE NETWORK
```

---

# Version 3.4

Version 3.4 is the English-first release of the interactive visualizer. It keeps the existing simulation and lab structure while making the Learning experience a detailed protocol-study environment.

The study model is:

**field name → bits → bytes → example value → function → who adds it → who processes it**

All application and documentation text is written in English.

---

# Main areas

- **LEARN** — protocol anatomy, OSI/TCP-IP models, encapsulation, headers, IPv4 fragmentation, MTU, ARP, TCP, UDP, ICMP, and packet journey.
- **BUILD** — interactive packet construction and size calculations.
- **SIMULATE** — step-by-step packet travel through hosts, switches, routers, and the Internet.
- **INSPECT** — Ethernet and IEEE 802 family concepts.
- **CODING** — Manchester and 4B/5B visualization.
- **NETWORK LAB** — interactive ARP, DNS, DHCP, NAT/PAT, VLAN, STP, routing, IPv6, and subnetting exercises.

---

# LEARN — Protocol Anatomy and Encapsulation

The Learning area moves from network models to real protocol fields and packet transformations.

## OSI and TCP/IP models

### OSI

1. Application
2. Presentation
3. Session
4. Transport
5. Network
6. Data Link
7. Physical

### TCP/IP

1. Network Access
2. Internet
3. Transport
4. Application

The comparison explains how TCP/IP combines responsibilities that are represented separately in the conceptual OSI model.

## Detailed protocol headers

The Learning area covers:

- Ethernet II
- IPv4
- TCP
- UDP
- ICMP Echo
- ARP

Each protocol provides a field-by-field study table containing the field name, size in bits, size in bytes, example value, purpose, who adds it, and who processes it.

### Ethernet II

```text
Destination MAC    48 bits / 6 bytes
Source MAC         48 bits / 6 bytes
EtherType           16 bits / 2 bytes
-----------------------------------
Ethernet II header 112 bits / 14 bytes

FCS                32 bits / 4 bytes
```

The preamble and SFD are presented separately as synchronization/transmission elements. They are not included in the 14-byte Ethernet II header.

### IPv4

The base IPv4 header is 20 bytes. The visualizer covers Version, IHL, DSCP/ECN, Total Length, Identification, Flags, Fragment Offset, TTL, Protocol, Header Checksum, Source Address, Destination Address, and optional fields.

### TCP

The minimum TCP header is 20 bytes. Fields include Source Port, Destination Port, Sequence Number, Acknowledgment Number, Data Offset, Reserved bits, Flags, Window Size, Checksum, Urgent Pointer, and options/padding.

### UDP

The UDP header is 8 bytes and contains Source Port, Destination Port, Length, and Checksum.

### ICMP Echo

The ICMP Echo study covers Type, Code, Checksum, Identifier, Sequence Number, and Data. Ping uses Echo Request and Echo Reply messages.

### ARP

ARP maps an IPv4 address to a MAC address on the local link. The study covers HTYPE, PTYPE, HLEN, PLEN, OPER, SHA, SPA, THA, and TPA.

---

# Encapsulation and Decapsulation

```text
Application data
       ↓
TCP segment / UDP datagram
       ↓
IP packet
       ↓
Ethernet frame
       ↓
Bits / signals
```

At the receiver the process is reversed:

```text
Bits / signals
       ↓
Ethernet frame
       ↓
IP packet
       ↓
TCP segment / UDP datagram
       ↓
Application data
```

The visualizer explains what each layer adds and what each receiving layer processes or removes.

---

# TCP Segmentation vs IPv4 Fragmentation

These are different processes for different purposes.

### TCP segmentation

- Transport-layer process.
- The sending TCP implementation divides application data into TCP segments.
- Each segment has its own TCP header.
- TCP provides sequencing, acknowledgments, flow control, and retransmission.

### IPv4 fragmentation

- Network-layer process.
- An IPv4 host or router may fragment a packet when the next-link MTU is smaller than the packet, unless fragmentation is prevented.
- Every fragment receives its own IPv4 header.
- The TCP header is not repeated in every fragment.
- The destination host performs IP reassembly.

Example:

```text
Original IPv4 packet = 4000 bytes
Next-link MTU          = 1500 bytes

Fragment 1 = 1500 bytes
  IPv4 header 20 + data 1480
  Offset 0 · MF=1

Fragment 2 = 1500 bytes
  IPv4 header 20 + data 1480
  Offset 185 · MF=1

Fragment 3 = 1040 bytes
  IPv4 header 20 + data 1020
  Offset 370 · MF=0

                 ↓

       DESTINATION HOST
            REASSEMBLY
```

The fragment offset is measured in 8-byte units. `1480 / 8 = 185`.

---

# Packet Journey

The packet journey demonstrates a basic path:

```text
PC A → Switch → Router → Internet → Web Server
```

The basic model emphasizes:

1. IP source and destination remain end to end in the basic non-NAT example.
2. MAC source and destination are local to each link and change hop by hop.
3. A router processes the incoming frame, makes a routing decision, decrements TTL, and builds a new frame for the next link.

NAT is handled separately in the Network Lab.

---

# MTU Study

```text
Packet size <= MTU
    → no IPv4 fragmentation required

Packet size > MTU
    → fragmentation may occur when IPv4 fragmentation is permitted
```

The MTU tool also explains the DF flag and the relationship between an oversized packet and path MTU behavior.

---

# BUILD

The packet builder demonstrates how application data becomes a transport PDU, an IP packet, and an Ethernet frame. It also calculates Ethernet minimum-payload padding and total frame size.

---

# SIMULATE

The simulator presents a step-by-step web request scenario and supports previous, next, and play controls. It shows application data generation, transport encapsulation, IP addressing, Ethernet framing, physical transmission, router processing, TTL decrement, new framing on the next link, and destination decapsulation.

---

# INSPECT

The Inspector presents Ethernet framing and selected IEEE 802 concepts.

```text
Preamble
SFD
Destination MAC
Source MAC
EtherType
Payload
FCS
```

The Ethernet II header is **14 bytes**: 6-byte destination MAC + 6-byte source MAC + 2-byte EtherType. The FCS is an additional 4 bytes.

Selected IEEE 802 topics include 802.3 Ethernet, 802.11 Wi-Fi, 802.1Q VLAN tagging, 802.1D bridging/STP context, and 802.1X network access control.

---

# CODING

## Manchester

Visualize a custom bit sequence and inspect the center transition used by the selected Manchester convention.

## 4B/5B

Transform 4-bit data symbols into 5-bit codewords and inspect the mapping one group at a time.

Example:

```text
1011 → 10111
0010 → 10100
```

---

# NETWORK LAB

The Network Lab provides interactive exercises for:

- **ARP** — IPv4-to-MAC resolution and ARP table behavior.
- **DNS** — a simplified name-resolution sequence.
- **DHCP** — DORA: Discover, Offer, Request, Acknowledge.
- **NAT/PAT** — address and port translation.
- **VLAN / 802.1Q** — logical segmentation and tagged-frame concepts.
- **STP** — simplified Layer 2 loop prevention.
- **Routing** — next-hop selection.
- **IPv6** — 128-bit addressing and compressed notation.
- **Subnetting** — IPv4 mask, network, broadcast, host range, and address-count calculations.

---

# File structure

```text
network-layers-visualizer/
├── index.html
├── style.css
├── app.js
├── README.md
└── LICENSE
```

The project uses standard HTML, CSS, and vanilla JavaScript. No backend or package manager is required.

For GitHub Pages, publish from the `main` branch and use the repository root (`/`) as the deployment folder.

---

# Educational workflow

```text
LEARN
  ↓
UNDERSTAND THE FIELDS
  ↓
SIMULATE THE PACKET JOURNEY
  ↓
INSPECT THE STRUCTURE
  ↓
PRACTICE IN NETWORK LAB
  ↓
VERIFY WITH REAL TRAFFIC / WIRESHARK
```

---

# License

MIT License

Copyright (c) 2026 Alfredo San
