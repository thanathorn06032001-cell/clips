#!/bin/bash
# add_music.sh IN.mp4 MUSIC.wav OUT.mp4 [music_db=0]
# Static gain only (keeps the score's quiet-to-loud build), gentle duck under the voice, then static loudness + limiter.
IN="$1"; MU="$2"; OUT="$3"; DB="${4:-0}"; T=$(mktemp -d)
lufs() { ffmpeg -nostats -i "$1" -af ebur128 -f null - 2>&1 | awk '/I:/{v=$2} END{print v}'; }
MI=$(lufs "$MU"); MG=$(python3 -c "print(-24 - ($MI) + $DB)")
ffmpeg -y -loglevel error -i "$IN" -i "$MU" -filter_complex \
 "[0:a]aformat=sample_rates=44100:channel_layouts=stereo,asplit=2[sc][orig];[1:a]aformat=sample_rates=44100:channel_layouts=stereo,volume=${MG}dB[m];[m][sc]sidechaincompress=threshold=0.06:ratio=2:attack=20:release=400:makeup=1[md];[orig][md]amix=inputs=2:duration=first:normalize=0[a]" \
 -map "[a]" -c:a pcm_s16le "$T/mix.wav" || exit 1
XI=$(lufs "$T/mix.wav"); XG=$(python3 -c "print(-17 - ($XI))")
ffmpeg -y -loglevel error -i "$IN" -i "$T/mix.wav" -map 0:v -map 1:a -af "volume=${XG}dB,alimiter=limit=0.84:attack=3:release=80:level=false" -c:v copy -c:a aac -b:a 192k -movflags +faststart "$OUT" && echo "ok: $OUT (music ${MG} dB, master ${XG} dB)"
rm -rf "$T"
