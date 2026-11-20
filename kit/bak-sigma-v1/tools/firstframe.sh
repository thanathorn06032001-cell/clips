#!/bin/bash
# Put the cover image on the first frames so platforms that use frame 1 as the thumbnail show the cover.
# usage: firstframe.sh IN.mp4 COVER.jpg OUT.mp4 [hold=0.5] [fade=0.2]
IN="$1"; CV="$2"; OUT="$3"; H="${4:-0.5}"; F="${5:-0.2}"
IFS=x read W HH < <(ffprobe -v error -select_streams v -show_entries stream=width,height -of csv=p=0:s=x "$IN")
ffmpeg -y -loglevel error -i "$IN" -loop 1 -t "$(python3 -c "print($H+$F)")" -i "$CV" -filter_complex \
 "[1:v]scale=${W}:${HH}:force_original_aspect_ratio=increase,crop=${W}:${HH},setsar=1,format=yuva420p,fade=t=out:st=${H}:d=${F}:alpha=1[c];[0:v][c]overlay=0:0:eof_action=pass,format=yuv420p[v]" \
 -map "[v]" -map 0:a? -c:v libx264 -preset veryfast -crf 18 -c:a copy -movflags +faststart "$OUT" || exit 1
echo "ok: $OUT (cover on frame 1 for ${H}s)"
