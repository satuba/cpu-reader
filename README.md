# CPU reader

This program is hosted by Ubuntu virtual machine (Azure). It displays live CPU and RAM usage of the virtual machine in a chart that updates once per second. It gets the data using linux /proc/meminfo file.

Dependencies:
- Node.js (Express.js for routing)
- D3.js
- Lua
- LuaJIT
- lj2procfs
