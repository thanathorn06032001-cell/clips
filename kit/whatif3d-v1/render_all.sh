#!/bin/bash
# render every shot in shots.txt in 2 lanes; safe to rerun (existing frames are skipped). Stops itself after ~8.5 min; rerun until it prints "ALL DONE".
cd "$(dirname "$0")"; ./serve.sh >/dev/null; L=${LANES:-2}
lane() { awk -v L=$L -v k=$1 'NR%L==k' shots.txt | while read n s d f; do node animr.js $n $s $d $f ep.js; done; }
for k in $(seq 0 $((L-1))); do timeout 510 bash -c "$(declare -f lane); L=$L; lane $k" & done; wait
N=$(awk '{n+=int($3*30+0.5)} END{print n}' shots.txt); H=$(ls frames 2>/dev/null | wc -l); echo "frames $H / $N"; [ "$H" -ge "$N" ] && echo "ALL DONE"
