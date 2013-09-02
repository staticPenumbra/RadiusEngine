::“Copyright 2013 Clayton Burnett” 
::This program is distributed under the terms of the GNU General Public License
@ECHO off 
set BUILD_DIRECTORY="COREBUILD"
IF EXIST %BUILD_DIRECTORY% (ECHO "%BUILD_DIRECTORY% already created") ELSE mkdir %BUILD_DIRECTORY%
::AICONTROLLER
copy .\AITestBed\AIController.js COREBUILD
::AUDIO_FILES
copy .\AudioTestBed\Audio.js COREBUILD
copy .\AudioTestBed\AudioController.js COREBUILD
::ENTITY_FILES
copy .\EntityTestBed\Entity.js COREBUILD
copy .\EntityTestBed\EntityManager.js COREBUILD
::EVENT_FILES
copy .\EventTestBed\Event.js COREBUILD
copy .\EventTestBed\EventManager.js COREBUILD
::INPUT_FILES
copy .\InputTestBed\Input.js COREBUILD
::MENU_FILES
copy .\MenuTestBed\Menu.js COREBUILD
::RESOURCE_FILES
copy .\ResourceTestBed\ResourceManager.js COREBUILD
copy .\ResourceTestBed\Stage.js COREBUILD
copy .\ResourceTestBed\Installed.png COREBUILD
::SCREENMAP_FILES
copy .\ScreenMapTestBed\ScreenMap.js COREBUILD
::TRIGGER_FILES
copy .\TriggerTestBed\Trigger.js COREBUILD
::UPDATER_FILES
copy .\UpdaterTestBed\Updater.js COREBUILD
::VIDEO_CONTROLLER
copy .\VideoTestBed\VideoController.js COREBUILD
::INDEX
copy .\INDEX.htm COREBUILD
::STYLE
copy .\STYLE.css COREBUILD
