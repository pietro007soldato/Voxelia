#!/bin/sh
# compila la versione di prova, la fa girare nell'emulatore e converte le foto
export PSPDEV=/home/claude/psptc/pspdev; export PATH=$PSPDEV/bin:$PATH
cd /home/claude/vxpsp && make clean >/dev/null && make EXTRA=-DAUTOTEST 2>&1 | grep -E "error" 
G=/home/claude/ms/PSP/GAME/VOXELIA; rm -rf $G/shots $G/autotest.log $G/save.dat; cp EBOOT.PBP $G/
cd /home/claude/ppsspp/build-headless && ./PPSSPPHeadless --memstick=/home/claude/ms --timeout-wall=${1:-900} $G/EBOOT.PBP > /home/claude/vxpsp/run.log 2>&1
rm -rf /home/claude/vxpsp/shots; mkdir -p /home/claude/vxpsp/shots
python3 -c "
from PIL import Image;import glob,os
fs=sorted(glob.glob('$G/shots/*.bmp'))
for f in fs: Image.open(f).save('/home/claude/vxpsp/shots/'+os.path.basename(f)[:-4]+'.png')
W,H=480,272
for k in range(0,len(fs),9):
  sheet=Image.new('RGB',(W*3,H*3))
  for i,f in enumerate(fs[k:k+9]): sheet.paste(Image.open(f),((i%3)*W,(i//3)*H))
  sheet.save('/home/claude/vxpsp/shots/sheet_%02d.png'%(k//9))
print(len(fs),'foto')
"
cp $G/autotest.log /home/claude/vxpsp/autotest.log 2>/dev/null; grep -v "^foto" /home/claude/vxpsp/autotest.log
