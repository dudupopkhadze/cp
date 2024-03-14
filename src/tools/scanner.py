
# pip install scapy && python3 src/tools/scanner.py

from scapy.all import ARP, Ether, srp

def scan_network(ip_range):
    arp = ARP(pdst=ip_range)
    ether = Ether(dst="ff:ff:ff:ff:ff:ff")
    packet = ether/arp

    result = srp(packet, timeout=3, verbose=False)[0]

    clients = []

    for sent, received in result:
        clients.append({'ip': received.psrc, 'mac': received.hwsrc})

    return clients

ip_range = "192.168.1.1/24"
devices = scan_network(ip_range)

print("Available devices in the network:")
print("IP" + " "*18+"MAC")
for device in devices:
    print("{:16}    {}".format(device['ip'], device['mac']))

import json
with open('devices.json', 'w') as f:
    json.dump(devices, f, indent=4)