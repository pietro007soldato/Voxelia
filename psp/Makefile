TARGET = voxelia
OBJS = src/autotest.o src/main.o src/gfx.o src/models.o src/data.o src/world.o src/game.o src/ui.o src/audio.o
INCDIR = src
CFLAGS = -O2 -G0 -Wall -Wno-unused-variable -Wno-unused-function -ffast-math $(EXTRA)
CXXFLAGS = $(CFLAGS)
ASFLAGS = $(CFLAGS)
LIBS = -lpspdebug -lpspgum -lpspgu -lpspaudio -lpsprtc -lpsppower -lm
EXTRA_TARGETS = EBOOT.PBP
PSP_EBOOT_TITLE = Voxelia - Il Regno Perduto
PSP_EBOOT_ICON = ICON0.PNG
PSP_EBOOT_PIC1 = PIC1.PNG
BUILD_PRX = 1
PSP_FW_VERSION = 500
PSPSDK=$(shell psp-config --pspsdk-path)
include $(PSPSDK)/lib/build.mak
