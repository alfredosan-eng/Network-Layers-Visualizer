🌐 Interactive Network Learning Lab

<p align="center">
  <a href="https://alfredosan-eng.github.io/Network-Layers-Visualizer-English-Version/" target="_blank">
    <img src="https://img.shields.io/badge/🚀%20OPEN%20NETWORK%20LAB-222222?style=for-the-badge" alt="Open Network Layers Visualizer">
  </a>
</p>
# Network Layers Visualizer — English Version

**Network Layers Visualizer** is an educational and interactive web application designed to help users understand how network communication works across multiple levels: layered models, encapsulation, Ethernet, protocols, addressing, switching, routing, and encoding.

The project is designed as a **visual learning lab**. Rather than presenting definitions alone, it allows users to explore processes step by step and connect concepts that are often studied separately.

```text
APPLICATION
    ↓
TRANSPORT
    ↓
IP / ROUTING
    ↓
DATA LINK AND FRAMES
    ↓
BITS AND ENCODING
    ↓
COMMUNICATION ACROSS THE NETWORK
```

---

# ✨ Features

## 📚 LEARN — OSI and TCP/IP

Study the two main models used to analyze network communications.

### OSI Model

Explore the seven layers:

1. Application
2. Presentation
3. Session
4. Transport
5. Network
6. Data Link
7. Physical

### TCP/IP Model

Explore its four layers:

1. Application
2. Transport
3. Internet
4. Network Access

The application also includes a visual **OSI ↔ TCP/IP comparison** to show how TCP/IP groups functions that appear as separate layers in the OSI model.

Individual layers can be explored to review:

- their purpose;
- the associated PDU;
- related protocols or technologies;
- their relationship with the other model.

---

## 🧱 BUILD — Encapsulation

Visualize how data receives additional information as it moves through the protocol stack.

```text
Application Data
        ↓
TCP Segment / UDP Datagram
        ↓
IP Packet
        ↓
Ethernet Frame
        ↓
Bits
```

Includes concepts related to:

- headers;
- payload;
- sizes;
- padding;
- frame construction.

---

## ▶ SIMULATE — Communication Path

Uses a visual scenario in which a device requests a web page:

```text
PC A → Switch → Router → Internet → Server
```

The simulator lets you move through the process and observe concepts such as:

- HTTP data generation;
- TCP encapsulation;
- IP addressing;
- Ethernet frame construction;
- physical transmission;
- router processing;
- TTL decrement;
- construction of a new frame for the next link;
- decapsulation at the destination.

It also allows switching between **OSI and TCP/IP** conceptual representations.

---

## 🔍 INSPECT — Ethernet and IEEE 802

Study the structure of an Ethernet frame visually.

```text
PREAMBLE
SFD
DESTINATION MAC
SOURCE MAC
TYPE
PAYLOAD
FCS
```

Includes explanations of:

- MAC addresses;
- EtherType;
- payload;
- padding;
- FCS;
- minimum frame size.

It also introduces selected **IEEE 802.\*** standards:

- IEEE 802.3 — Ethernet
- IEEE 802.11 — Wi-Fi
- IEEE 802.1Q — VLAN
- IEEE 802.1D — Bridging and STP
- IEEE 802.1X — Access Control

---

## 📡 ENCODING — Manchester and 4B/5B

### Manchester

Enter a bit sequence and observe a representation based on transitions within the bit period.

Includes:

- custom input sequence;
- bit-by-bit navigation;
- backward navigation;
- automatic playback;
- active-bit explanation.

### 4B/5B

Observe how groups of 4 bits are transformed into groups of 5 bits.

Example:

```text
1011 → 10111
0010 → 10100
```

Includes:

- automatic grouping;
- group navigation;
- playback;
- code table;
- conceptual comparison with Manchester.

---

# 🌐 NETWORK LAB

The current version includes an interactive laboratory with nine additional areas.

## ARP

Visualizes the process by which a host can discover the MAC address associated with an IPv4 address on a local network.

```text
Need a MAC address
      ↓
ARP Request
      ↓
Device recognizes the IP
      ↓
ARP Reply
      ↓
ARP table updated
```

## DNS

Shows conceptually how a name such as:

```text
google.com
```

can go through a resolution process until information is obtained that allows communication with a destination to continue.

## DHCP

Includes an interactive visualization of the **DORA** process:

```text
DISCOVER
    ↓
OFFER
    ↓
REQUEST
    ↓
ACKNOWLEDGE
```

and demonstrates how a client can receive parameters such as an IP address, gateway, and DNS server.

## NAT

Visualizes private addresses being translated when traffic passes through a NAT device.

Also introduces **PAT**, where different connections can share one public IP address by being distinguished through ports.

## VLAN and 802.1Q

Switch between different VLANs and visualize the logical separation of device groups.

Introduces the 802.1Q tag in a simplified frame representation:

```text
DESTINATION MAC
SOURCE MAC
802.1Q — VLAN ID
EtherType
DATA
```

## STP

Uses a switch topology with redundant links to explain why Layer 2 loops can occur and how STP can logically block selected paths.

## ROUTING

Shows the conceptual journey of a packet through multiple routers:

```text
Source
  ↓
Router A
  ↓
Router B
  ↓
Router C
  ↓
Destination
```

Each hop introduces the concepts of:

- destination network;
- next hop;
- forwarding decision.

## IPv6

Includes a visual introduction to IPv6 addressing:

- 128 bits;
- eight hexadecimal groups;
- zero compression;
- use of `::`;
- basic IPv6 header structure.

Example:

```text
2001:0db8:0000:0000:0000:0000:0000:0042

2001:db8::42
```

## SUBNETTING

Includes a basic visual calculator for IPv4 networks.

Enter:

- an IPv4 address;
- a CIDR prefix.

The tool calculates:

- subnet mask;
- total number of addresses;
- usable hosts using the traditional model;
- network address;
- first host;
- last host;
- broadcast address.

It also explains the relationship between the prefix, network bits, host bits, and powers-of-two calculations.

---

# 🧠 What This Project Connects

Network Layers Visualizer brings together concepts such as:

```text
LAYERED MODELS
        ↓
PROTOCOLS
        ↓
DNS / DHCP
        ↓
TCP / UDP
        ↓
IPv4 / IPv6
        ↓
ARP / NAT
        ↓
ROUTING
        ↓
VLAN / STP
        ↓
ETHERNET
        ↓
ENCAPSULATION
        ↓
BITS
        ↓
MANCHESTER / 4B/5B
```

The goal is to support progressive understanding, from the application that generates data to the mechanisms used to address, encapsulate, forward, and transmit information.

---

# 🎯 Purpose

This project is aimed at students, people beginning to learn networking, and anyone who prefers a visual and interactive approach.

It is not intended to replace real labs, technical documentation, or specialized books. Its purpose is to complement study and help build a mental model for questions such as:

- What is the difference between OSI and TCP/IP?
- How is data encapsulated?
- What is the difference between a segment, packet, and frame?
- How is a MAC address resolved with ARP?
- How is an address obtained through DHCP?
- How is a name resolved through DNS?
- What does NAT do?
- What is a VLAN?
- Why does STP prevent loops?
- How does a router make forwarding decisions?
- How is an IPv6 address represented?
- How does subnetting work?
- What is the difference between Manchester and 4B/5B?

---

# 🚀 Running the Project

No installation or dependencies are required.

1. Download or clone the repository.
2. Open the project folder.
3. Open:

```text
index.html
```

in a modern web browser.

---

# 🗂️ Structure

```text
network-layers-visualizer/
├── index.html
├── style.css
├── app.js
├── README.md
└── LICENSE
```

- `index.html` — application structure.
- `style.css` — interface and visual styling.
- `app.js` — simulations and interactive modules.
- `README.md` — project documentation.
- `LICENSE` — MIT License.

---

# ✅ Current Status

- [x] OSI Model
- [x] TCP/IP Model
- [x] OSI ↔ TCP/IP Comparison
- [x] Layer Exploration
- [x] Communication Simulation
- [x] Encapsulation
- [x] Size and Padding Calculations
- [x] Ethernet Frame Inspection
- [x] IEEE 802.\*
- [x] Manchester Encoding
- [x] 4B/5B Encoding
- [x] ARP
- [x] DNS
- [x] DHCP / DORA
- [x] NAT / PAT
- [x] VLAN / 802.1Q
- [x] STP
- [x] Routing
- [x] IPv6
- [x] Subnetting

---

# 👤 Author

**Alfredo San**  
Founder & Lead Developer

---

# 📄 License

This project is licensed under the **MIT License**.

The MIT License allows people to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, provided that the original copyright and license notice are included.

See the [LICENSE](LICENSE) file for the full license text.

---

# 📌 Repository Name

## `network-layers-visualizer`

A broad name that represents the application as an interactive visualizer and learning laboratory for networking concepts.

---

## 🌎 Language Version

This package is the **English Version** of Network Layers Visualizer.
