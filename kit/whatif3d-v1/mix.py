import json, subprocess, wave, os, numpy as np
SR = 44100; rng = np.random.default_rng(7)
tl = json.load(open("timeline.json")); DUR = tl["duration"]; N = int(DUR * SR)
NOBED = os.environ.get("NOBED") == "1"
def ff(x, af):
    p = subprocess.run(["ffmpeg","-v","error","-f","f32le","-ar",str(SR),"-ac","1","-i","-","-af",af,"-f","f32le","-"], input=x.astype(np.float32).tobytes(), capture_output=True)
    y = np.frombuffer(p.stdout, np.float32).copy(); return y[:len(x)] if len(y) >= len(x) else np.pad(y,(0,len(x)-len(y)))
def env(n, a, d): t=np.arange(n)/SR; return np.minimum(t/max(a,1e-4),1)*np.exp(-t/d)
def noise(d): return rng.standard_normal(int(d*SR))
def knock(heavy=False):
    d=0.35; n=int(d*SR); tt=np.arange(n)/SR; f=(90 if heavy else 150)*(1+0.6*np.exp(-tt/0.01))
    body=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt/(0.1 if heavy else 0.06))
    clk=ff(noise(0.03)*env(int(0.03*SR),0.0005,0.006),"bandpass=f=1800:w=1500"); body[:len(clk)]+=clk*0.9
    return ff(body,"lowpass=f=3500,aecho=0.8:0.6:45|90:0.35|0.18")
def creak():
    d=1.1; tt=np.arange(int(d*SR))/SR; f=180+80*np.sin(2*np.pi*0.9*tt)+30*np.sin(2*np.pi*7*tt)
    x=np.sign(np.sin(2*np.pi*np.cumsum(f)/SR))*(0.5+0.5*np.sin(2*np.pi*31*tt)); return ff(x*0.3*np.sin(np.pi*tt/d),"bandpass=f=700:w=900")
def hit():
    d=1.6; tt=np.arange(int(d*SR))/SR
    boom=np.sin(2*np.pi*(42+30*np.exp(-tt/0.08))*tt)*np.exp(-tt/0.5)
    scr=(np.sin(2*np.pi*1244*tt)+np.sin(2*np.pi*1318*tt)+0.6*np.sin(2*np.pi*1866*tt))*np.exp(-tt/0.35)*0.16
    return boom*0.9+scr+ff(noise(d)*np.exp(-tt/0.3),"lowpass=f=900")*0.3
def heart():
    out=np.zeros(int(0.8*SR))
    for o,a in ((0,1),(0.22,0.7)):
        n=int(0.18*SR); tt=np.arange(n)/SR; s=int(o*SR); out[s:s+n]+=np.sin(2*np.pi*48*tt)*np.exp(-tt/0.05)*a
    return out
def tick(): n=int(0.05*SR); return ff(noise(0.05)*env(n,0.0005,0.006),"bandpass=f=3000:w=2000")*0.7
def whoosh(): d=0.9; tt=np.arange(int(d*SR))/SR; return ff(noise(d)*np.sin(np.pi*tt/d)**2,"bandpass=f=500:w=600")*0.8
def flash(): d=0.25; return ff(noise(d)*env(int(d*SR),0.002,0.05),"highpass=f=1500")*0.6
def pop(): n=int(0.25*SR); tt=np.arange(n)/SR; return (np.sin(2*np.pi*880*tt)+0.5*np.sin(2*np.pi*1320*tt))*env(n,0.002,0.08)*0.5
def thud(): n=int(0.4*SR); tt=np.arange(n)/SR; return np.sin(2*np.pi*(70+40*np.exp(-tt/0.03))*tt)*env(n,0.001,0.12)
def step(): n=int(0.2*SR); return ff(noise(0.2)*env(n,0.002,0.04),"lowpass=f=600")*1.2
def click(): n=int(0.06*SR); return ff(noise(0.06)*env(n,0.0003,0.004),"bandpass=f=2500:w=1500")
def glitch():
    d=0.7; x=np.sign(np.sin(2*np.pi*np.cumsum(200+1800*rng.random(int(d*SR))//300*300)/SR))*0.25
    gate=np.repeat(rng.random(int(d*40))>0.4, int(SR/40))[:len(x)]; x[:len(gate)]*=gate; return ff(x,"lowpass=f=4000")
def crt():
    d=0.6; tt=np.arange(int(d*SR))/SR; z=np.sin(2*np.pi*np.cumsum(9000*np.exp(-tt/0.1)+60)/SR)*np.exp(-tt/0.2)*0.4
    return z+ff(noise(d)*np.exp(-tt/0.08),"lowpass=f=2000")*0.4
def riser():  # rising noise + tone, cut dead at the end (the scare lands right after)
    d=1.4; tt=np.arange(int(d*SR))/SR; f=200+1800*(tt/d)**2
    x=np.sin(2*np.pi*np.cumsum(f)/SR)*0.25+ff(noise(d),"highpass=f=800")*0.35
    return x*(tt/d)**2.2
def scare():  # jump-scare blast: sub boom + harsh screech + distortion
    d=1.2; tt=np.arange(int(d*SR))/SR
    boom=np.sin(2*np.pi*(38+60*np.exp(-tt/0.05))*tt)*np.exp(-tt/0.45)
    scr=sum(np.sin(2*np.pi*f0*(1+0.03*np.sin(2*np.pi*31*tt))*tt) for f0 in (1180,1247,1661,2093))*np.exp(-tt/0.5)*0.22
    x=boom*1.0+scr+ff(noise(d)*np.exp(-tt/0.25),"bandpass=f=2500:w=3000")*0.5
    return np.tanh(x*2.2)*0.8
SYN={"riser":riser,"scare":scare,"knockdoor":lambda:knock(True),"creak":creak,"hit":hit,"heart":heart,"tick":tick,"whoosh":whoosh,"flash":flash,"pop":pop,"thud":thud,"step":step,"click":click,"glitch":glitch,"crt":crt}
GAIN={"riser":0.7,"scare":1.0,"knockdoor":1.0,"creak":0.5,"hit":0.6,"heart":0.8,"tick":0.3,"whoosh":0.4,"flash":0.25,"pop":0.4,"thud":0.6,"step":0.5,"click":0.5,"glitch":0.35,"crt":0.6}
cache={k:f() for k,f in SYN.items()}
sfx=np.zeros(N+SR*2)
DUCKS=[]
for t,n,gn in json.load(open("cues.json")):
    if n=="duck": DUCKS.append((t,gn)); continue
    s=int(t*SR); x=cache[n]; sfx[s:s+len(x)]+=x*GAIN[n]*gn
sfx=sfx[:N]
w=wave.open("vo/vo.wav"); vo=np.frombuffer(w.readframes(w.getnframes()),"<i2").astype(np.float32)/32768; vo=np.pad(vo,(0,max(0,N-len(vo))))[:N]
tt=np.arange(N)/SR; bed=np.zeros(N)
if not NOBED:
    x=0.5*np.sin(2*np.pi*55*tt)+0.4*np.sin(2*np.pi*55.7*tt)+0.25*np.sin(2*np.pi*82.4*tt)*(0.5+0.5*np.sin(2*np.pi*0.07*tt))
    x+=0.12*np.sin(2*np.pi*1046*tt+3*np.sin(2*np.pi*0.3*tt))*(0.5+0.5*np.sin(2*np.pi*0.05*tt+1))**4
    wind=ff(rng.standard_normal(N)*0.5,"bandpass=f=420:w=500")*(0.6+0.4*np.sin(2*np.pi*0.11*tt))
    bed=ff(x*0.6+wind*0.5,"lowpass=f=2500"); bed*=0.22/(np.max(np.abs(bed))+1e-9)
    end_black=float(os.environ.get("ENDB", DUR-1.2)); bed*=np.minimum(tt/1.5,1)*np.clip((end_black-tt)/0.05,0,1)
voenv=ff(np.abs(vo),"lowpass=f=8"); duck=1-0.45*np.clip(voenv/0.08,0,1)
mix=vo*1.0+sfx*0.55*(0.75+0.25*duck)+bed*duck
for t0,dd in DUCKS:  # silence beat before a scare: everything drops to ~5 %
    dk=np.clip(np.minimum((tt-t0)/0.06,(t0+dd-tt)/0.03),0,1); mix=mix*(1-0.95*dk)
mix=ff(mix,"acompressor=threshold=-14dB:ratio=3:attack=5:release=120,alimiter=limit=0.95")
out="out/soundtrack-nomusic.wav" if NOBED else "out/soundtrack.wav"
o=wave.open(out,"wb"); o.setnchannels(1); o.setsampwidth(2); o.setframerate(SR); o.writeframes((np.clip(mix,-1,1)*32767).astype("<i2").tobytes()); o.close(); print(out, round(N/SR,2))
