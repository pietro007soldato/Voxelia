# genera src/font.h: atlante 256x128 (alfa 8 bit) con i glifi del font, per il testo sulla PSP
from PIL import Image, ImageDraw, ImageFont
import sys
F='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
SZ=int(sys.argv[1]) if len(sys.argv)>1 else 10
font=ImageFont.truetype(F,SZ)
chars=[chr(c) for c in range(32,127)]+list('àèéìòùÀÈÉÌÒÙ«»’…·★°•→←↑↓♥⚔✦□△○✕▶◀')
W,H=256,128;img=Image.new('L',(W,H),0);d=ImageDraw.Draw(img)
asc,desc=font.getmetrics();LH=asc+desc
x=y=1;G=[]
for ch in chars:
    try: bb=font.getbbox(ch)
    except Exception: bb=(0,0,0,0)
    adv=round(font.getlength(ch))
    gw=max(1,bb[2]-bb[0]);
    if x+gw+2>W: x=1;y+=LH+2
    d.text((x-bb[0],y),ch,font=font,fill=255)
    G.append((ord(ch),x,y,gw,LH,adv,bb[0]));x+=gw+2
assert y+LH<H, 'atlante pieno'
px=img.tobytes()
o=open('/home/claude/vxpsp/src/font.h','w')
o.write('/* generato da tools/mkfont.py: DejaVu Sans Bold %dpx */\n#define FONT_LH %d\n#define FONT_N %d\n'%(SZ,LH,len(G)))
o.write('static const struct{unsigned short c;unsigned char x,y,w,h,adv;signed char ox;} FONTG[]={\n'+',\n'.join('{%d,%d,%d,%d,%d,%d,%d}'%g for g in G)+'};\n')
o.write('static const unsigned char FONTA[%d]={'%(W*H)+','.join(str(b) for b in px)+'};\n')
print('ok',LH,len(G),y+LH)
