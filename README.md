# Network Layers Visualizer

**Network Layers Visualizer** es una aplicación web educativa e interactiva para comprender cómo funcionan las comunicaciones de red desde varios niveles: modelos de capas, encapsulación, Ethernet, protocolos, direccionamiento, switching, routing y codificación.

El proyecto está pensado como un **laboratorio visual de aprendizaje**. En lugar de presentar únicamente definiciones, permite explorar procesos paso a paso y relacionar conceptos que normalmente se estudian de forma aislada.

```text
APLICACIÓN
    ↓
TRANSPORTE
    ↓
IP / ENCAMINAMIENTO
    ↓
ENLACE Y TRAMAS
    ↓
BITS Y CODIFICACIÓN
    ↓
COMUNICACIÓN A TRAVÉS DE LA RED
```

---

# 🚀 Versión 3.2

Esta versión mantiene los nueve módulos interactivos de **NETWORK LAB** y añade una revisión profunda de **APRENDER** orientada al estudio de la anatomía de los protocolos.

El objetivo de v3.3 es que el estudiante pueda pasar de la definición conceptual a la inspección de los campos reales: **nombre del campo → bits → bytes → valor de ejemplo → función → quién lo agrega → quién lo procesa**.

También se mantiene la corrección de inicialización de los controles interactivos del laboratorio: cada botón y campo obtiene su referencia DOM de forma explícita.

### Corrección v3.0 — NETWORK LAB

- [x] ARP — navegación paso a paso y actualización de tabla ARP.
- [x] DNS — navegación por etapas de resolución.
- [x] DHCP — DORA interactivo.
- [x] NAT/PAT — traducción interactiva.
- [x] VLAN — selección de VLAN y visualización 802.1Q.
- [x] STP — alternancia del bloqueo lógico.
- [x] Routing — navegación por saltos y tabla de rutas.
- [x] IPv6 — selección de grupos de 16 bits.
- [x] Subnetting — cálculo interactivo de máscara, red, hosts y broadcast.

---

# ✨ Funcionalidades

## 📚 APRENDER — OSI y TCP/IP

Permite estudiar los dos modelos principales utilizados para analizar las comunicaciones de red.

### Modelo OSI

Explora las siete capas:

1. Aplicación
2. Presentación
3. Sesión
4. Transporte
5. Red
6. Enlace de Datos
7. Física

### Modelo TCP/IP

Explora sus cuatro capas:

1. Aplicación
2. Transporte
3. Internet
4. Acceso a la red

También incluye una comparación visual **OSI ↔ TCP/IP** para entender cómo TCP/IP agrupa funciones que en OSI aparecen separadas.

Cada capa puede explorarse individualmente para revisar:

- su función;
- la PDU asociada;
- protocolos o tecnologías relacionadas;
- su relación con el otro modelo.

### Anatomía de headers — v3.3

La sección **APRENDER** incorpora ahora una vista de estudio detallada para: **Ethernet II, IPv4, TCP, UDP, ICMP Echo y ARP**.

Cada protocolo muestra sus campos con tamaño en bits y bytes, ejemplo de valor, función y responsables de procesamiento.

Ejemplos de tamaños fundamentales:

```text
Ethernet II header = 14 bytes
  Destination MAC = 48 bits / 6 bytes
  Source MAC      = 48 bits / 6 bytes
  EtherType       = 16 bits / 2 bytes
  FCS             = 32 bits / 4 bytes (separado del header)

IPv4 base header = 20 bytes
TCP minimum header = 20 bytes
UDP header = 8 bytes
```

La vista también distingue el **preámbulo y SFD** de los 14 bytes del header Ethernet II: son elementos de transmisión/sincronización y no deben sumarse como parte del header Ethernet II.

### Encapsulación y desencapsulación

```text
Datos de aplicación
        ↓
TCP segment / UDP datagram
        ↓
IPv4 packet
        ↓
Ethernet frame
        ↓
Bits / señales
```

En el receptor el proceso se invierte. El visualizador muestra qué información agrega cada capa y qué información procesa o consume el receptor.

### TCP segmentation vs IPv4 fragmentation

La versión 3.2 separa explícitamente ambos conceptos. **TCP segmentation** ocurre en Transporte y produce segmentos TCP. **IPv4 fragmentation** ocurre en Red cuando un paquete IPv4 supera el MTU del siguiente enlace y la fragmentación está permitida.

El laboratorio visual muestra `Identification`, `Flags` y `Fragment Offset`, además de un ejemplo de un paquete de 4000 bytes atravesando un enlace con MTU de 1500 bytes. Los fragmentos se reensamblan en el host destino.

### Packet Journey

El recorrido por routers muestra que las **MAC cambian por enlace**, mientras que las **IP permanecen extremo a extremo en el caso básico**. El router procesa la trama recibida, toma una decisión de encaminamiento, decrementa TTL y crea una nueva trama para el siguiente enlace.
---

## 🧱 CONSTRUIR — Encapsulación

Permite visualizar cómo los datos reciben información adicional a medida que atraviesan la pila de protocolos.

```text
Datos de aplicación
        ↓
Segmento TCP / Datagrama UDP
        ↓
Paquete IP
        ↓
Trama Ethernet
        ↓
Bits
```

Incluye conceptos relacionados con:

- encabezados;
- payload;
- tamaños;
- padding;
- construcción de la trama.

---

## ▶ SIMULAR — Recorrido de una comunicación

Utiliza un escenario visual donde un equipo solicita una página web:

```text
PC A → Switch → Router → Internet → Servidor
```

El simulador permite avanzar por el proceso y observar conceptos como:

- generación de datos HTTP;
- encapsulación TCP;
- direccionamiento IP;
- construcción de la trama Ethernet;
- transmisión física;
- procesamiento en el router;
- decremento de TTL;
- reconstrucción de una nueva trama para el siguiente enlace;
- desencapsulación en el destino.

También permite alternar la representación conceptual entre **OSI y TCP/IP**.

---

## 🔍 INSPECCIONAR — Ethernet e IEEE 802

Permite estudiar visualmente la estructura de una trama Ethernet.

```text
PREÁMBULO
SFD
MAC DESTINO
MAC ORIGEN
TYPE
PAYLOAD
FCS
```

Incluye explicaciones sobre:

- direcciones MAC;
- EtherType;
- payload;
- padding;
- FCS;
- tamaño mínimo de la trama.

También incorpora una introducción a estándares de la familia **IEEE 802.\***, incluyendo:

- IEEE 802.3 — Ethernet
- IEEE 802.11 — Wi-Fi
- IEEE 802.1Q — VLAN
- IEEE 802.1D — Bridging y STP
- IEEE 802.1X — Control de acceso

---

## 📡 CODIFICACIÓN — Manchester y 4B/5B

### Manchester

Permite introducir una secuencia de bits y observar una representación basada en transiciones dentro del período del bit.

Incluye:

- secuencia personalizada;
- avance bit por bit;
- retroceso;
- reproducción automática;
- explicación del bit activo.

### 4B/5B

Permite observar cómo grupos de 4 bits se transforman en grupos de 5 bits.

Ejemplo:

```text
1011 → 10111
0010 → 10100
```

Incluye:

- agrupación automática;
- navegación por grupos;
- reproducción;
- tabla de códigos;
- comparación conceptual con Manchester.

---

# 🌐 NETWORK LAB

La versión actual incorpora un laboratorio interactivo con nueve áreas adicionales.

## ARP

Visualiza el proceso mediante el cual un host puede descubrir la dirección MAC asociada a una dirección IPv4 dentro del contexto de una red local.

El recorrido muestra:

```text
Necesito una MAC
      ↓
ARP Request
      ↓
El dispositivo reconoce la IP
      ↓
ARP Reply
      ↓
Tabla ARP actualizada
```

---

## DNS

Muestra conceptualmente cómo un nombre como:

```text
google.com
```

puede pasar por un proceso de resolución hasta obtener información que permita continuar la comunicación hacia un destino.

---

## DHCP

Incluye una visualización del proceso **DORA**:

```text
DISCOVER
    ↓
OFFER
    ↓
REQUEST
    ↓
ACKNOWLEDGE
```

y muestra cómo un cliente puede recibir parámetros como dirección IP, gateway y DNS.

---

## NAT

Permite visualizar un escenario donde direcciones privadas se traducen al atravesar un dispositivo NAT.

También introduce el concepto de **PAT**, donde diferentes conexiones pueden utilizar una misma dirección pública distinguiéndose mediante puertos.

---

## VLAN y 802.1Q

Permite alternar entre diferentes VLAN y visualizar la separación lógica de grupos de dispositivos.

Incluye el concepto de etiqueta 802.1Q dentro de una representación simplificada de una trama:

```text
MAC DESTINO
MAC ORIGEN
802.1Q — VLAN ID
EtherType
Datos
```

---

## STP

Utiliza una topología de switches con enlaces redundantes para explicar visualmente por qué pueden producirse bucles de capa 2 y cómo STP puede bloquear lógicamente determinados caminos.

---

## ROUTING

Muestra el recorrido conceptual de un paquete a través de varios routers.

```text
Origen
  ↓
Router A
  ↓
Router B
  ↓
Router C
  ↓
Destino
```

Cada salto permite observar la idea de:

- red de destino;
- siguiente salto;
- decisión de reenvío.

---

## IPv6

Incluye una introducción visual al direccionamiento IPv6:

- 128 bits;
- ocho grupos hexadecimales;
- abreviación de ceros;
- uso de `::`;
- estructura básica del encabezado IPv6.

Ejemplo:

```text
2001:0db8:0000:0000:0000:0000:0000:0042

2001:db8::42
```

---

## SUBNETTING

Incluye una calculadora visual básica para redes IPv4.

Permite introducir:

- dirección IPv4;
- prefijo CIDR.

Y calcula:

- máscara;
- cantidad total de direcciones;
- hosts utilizables según el modelo tradicional;
- dirección de red;
- primer host;
- último host;
- broadcast.

Además explica visualmente la relación:

```text
/24
│
├── 24 bits de red
└── 8 bits de host

2⁸ = 256 direcciones
256 − 2 = 254 hosts utilizables
```

Para `/31` y `/32`, la interfaz aclara que existen usos especiales que no siguen el cálculo simplificado tradicional de hosts.

---

# 🧠 Qué conecta este proyecto

Network Layers Visualizer reúne en una misma aplicación conceptos como:

```text
MODELOS DE CAPAS
        ↓
PROTOCOLOS
        ↓
DNS / DHCP
        ↓
TCP / UDP
        ↓
IP / IPv4 / IPv6
        ↓
ARP / NAT
        ↓
ROUTING
        ↓
VLAN / STP
        ↓
ETHERNET
        ↓
ENCAPSULACIÓN
        ↓
BITS
        ↓
MANCHESTER / 4B/5B
```

La intención es facilitar una comprensión progresiva: desde la aplicación que genera datos hasta los mecanismos utilizados para direccionar, encapsular, reenviar y transmitir información.

---

# 🎯 Objetivo

Este proyecto está orientado a estudiantes, personas que comienzan a aprender redes y cualquier persona que prefiera una aproximación visual e interactiva.

No pretende reemplazar laboratorios reales, documentación técnica o libros especializados. Su función es complementar el estudio y ayudar a construir una imagen mental de preguntas como:

- ¿Qué diferencia existe entre OSI y TCP/IP?
- ¿Cómo se encapsulan los datos?
- ¿Qué diferencia existe entre segmento, paquete y trama?
- ¿Cómo se resuelve una MAC con ARP?
- ¿Cómo se obtiene una dirección mediante DHCP?
- ¿Cómo se resuelve un nombre con DNS?
- ¿Qué hace NAT?
- ¿Qué es una VLAN?
- ¿Por qué STP evita bucles?
- ¿Cómo toma decisiones un router?
- ¿Cómo se representa una dirección IPv6?
- ¿Cómo funciona el subnetting?
- ¿Qué diferencia existe entre Manchester y 4B/5B?

---

# 🚀 Ejecutar el proyecto

No requiere instalación ni dependencias.

1. Descarga o clona el repositorio.
2. Abre la carpeta del proyecto.
3. Ejecuta:

```text
index.html
```

en un navegador moderno.

---

# 🗂️ Estructura

```text
network-layers-visualizer/
├── index.html
├── style.css
├── app.js
└── README.md
```

- `index.html` — estructura de la aplicación.
- `style.css` — interfaz y estilos.
- `app.js` — simulaciones y módulos interactivos.
- `README.md` — documentación del proyecto.

---

# ✅ Estado actual

- [x] Modelo OSI
- [x] Modelo TCP/IP
- [x] Comparación OSI ↔ TCP/IP
- [x] Exploración de capas
- [x] Simulación de comunicación
- [x] Encapsulación
- [x] Cálculo de tamaños y padding
- [x] Inspección de trama Ethernet
- [x] IEEE 802.\*
- [x] Manchester
- [x] 4B/5B
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

The MIT License allows people to use, copy, modify, merge, publish, distribute, sublicense, and sell copies of the software, provided that the original copyright and license notice are included.

See the [LICENSE](LICENSE) file for the full license text.


# 📌 Nombre del repositorio

## `network-layers-visualizer`

Un nombre suficientemente amplio para representar la aplicación como un visualizador y laboratorio interactivo de conceptos de redes.

---

# Changelog v3.3

- Deep Learning redesign focused on protocol anatomy.
- Field-by-field tables for Ethernet II, IPv4, TCP, UDP, ICMP and ARP.
- Bits and bytes shown for each field.
- Encapsulation and decapsulation study flow.
- Explicit TCP segmentation vs IPv4 fragmentation explanation.
- Interactive MTU/fragmentation calculation.
- Packet Journey with per-hop MAC/IP/TTL behavior.
- Preserved NETWORK LAB modules and v3.0 interaction fixes.
