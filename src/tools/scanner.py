
# pip install scapy && python3 src/tools/scanner.py

from scapy.all import ARP, Ether, srp

def scan_network(ip_range):
    # IP Address for the destination
    # create ARP packet
    arp = ARP(pdst=ip_range)
    # create the Ether broadcast packet
    ether = Ether(dst="ff:ff:ff:ff:ff:ff")
    # stack them
    packet = ether/arp

    result = srp(packet, timeout=3, verbose=False)[0]

    # a list of clients, we will fill this in the upcoming loop
    clients = []

    for sent, received in result:
        # for each response, append ip and mac address to `clients` list
        clients.append({'ip': received.psrc, 'mac': received.hwsrc})

    return clients

# Adjust the IP range; this is just an example
ip_range = "192.168.1.1/24"
devices = scan_network(ip_range)

print("Available devices in the network:")
print("IP" + " "*18+"MAC")
for device in devices:
    print("{:16}    {}".format(device['ip'], device['mac']))

## store this data as json in file devices.json
import json
with open('devices.json', 'w') as f:
    json.dump(devices, f, indent=4)