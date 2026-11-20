#!/bin/bash
# start the local page server for the kit (run from this folder)
cd "$(dirname "$0")" && (nohup python3 -m http.server 8765 >/dev/null 2>&1 &) && sleep 1 && echo "serving on :8765"
