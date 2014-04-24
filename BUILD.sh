#Copyright 2014 Clayton Burnett 
#This program is distributed under the terms of the GNU General Public License 
BUILD_DIRECTORY="COREBUILD"
if [ -d "$BUILD_DIRECTORY" ]; then
  echo "$BUILD_DIRECTORY exists please remove to rebuild"
fi
if [ ! -d "$BUILD_DIRECTORY" ]; then
  mkdir ./$BUILD_DIRECTORY
#AICONTROLLER
cp ./AITestBed/AIController.js $BUILD_DIRECTORY
#AUDIO_FILES
cp ./AudioTestBed/Audio.js $BUILD_DIRECTORY
cp ./AudioTestBed/AudioController.js $BUILD_DIRECTORY
#ENTITY_FILES
cp ./EntityTestBed/Entity.js $BUILD_DIRECTORY
cp ./EntityTestBed/EntityManager.js $BUILD_DIRECTORY
#EVENT_FILES
cp ./EventTestBed/Event.js $BUILD_DIRECTORY
cp ./EventTestBed/EventManager.js $BUILD_DIRECTORY
#INPUT_FILES
cp ./InputTestBed/Input.js $BUILD_DIRECTORY
#MENU_FILES
cp ./MenuTestBed/Menu.js $BUILD_DIRECTORY
#RESOURCE_FILES
cp ./ResourceTestBed/ResourceManager.js $BUILD_DIRECTORY
cp ./ResourceTestBed/Stage.js $BUILD_DIRECTORY
#SCREENMAP_FILES
cp ./ScreenMapTestBed/ScreenMap.js $BUILD_DIRECTORY
#TRIGGER_FILES
cp ./TriggerTestBed/Trigger.js $BUILD_DIRECTORY
#UPDATER_FILES
cp ./UpdaterTestBed/Updater.js $BUILD_DIRECTORY
#INDEX
cp ./INDEX.htm $BUILD_DIRECTORY
#STYLE
cp ./STYLE.css $BUILD_DIRECTORY
#RESOURCES
cp -r ./img $BUILD_DIRECTORY
cp -r ./sounds $BUILD_DIRECTORY
fi

