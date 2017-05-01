Welcome to the Radius Project!
==============================	

FOR PROJECT UPDATES AND DEV JOURNAL AS WELL AS LIVE DEMO SEE:
www.penumbra.systems

(old blog here)
http://tvzdev.blogspot.com

OVERVIEW
=========

Thank you for checking out radius, an HTML5 CMS and web application engine.  The original version was a game engine known as Gemini.  Components were migrated to Radius and reused to create a fully extensible open application engine.  Current engines tend to conform to current industry trends, while radius takes a radically different approach by treating a web page as a hardware profile and describing content in javascript.

Radius is designed to be plugin extensible, with the core distribution only implementing the barest web page features for efficiency.  The system is also designed to be very easy to create content for without a need to know HTML CSS or web browser quirks.  Simply describe your site the way you would on a piece of graph paper and then the engine handles the rest, including resizing and browser compatibility. This makes deployment fast and efficient so the user only has to focus on content details.

3/21/2014
As of this writing Radius is still in a pre alpha phase, any testing or feedback is greatly appreciated!  Send feedback questions to: radiusdev@codequest.co 

QUICK START
==============
Config Steps:

1.) Download the zip or the latest revision and run the included BUILD.bat file to compile the runtime files into one folder called COREBUILD

2.) Use a text editor to modify the file Stage.js.  The prototype function "index" describes the homepage that the user will first be taken to.  Play around with throwing images in the image path containers or DOM containers to change background image layers or text and links on the page:
DOMKeys = key reference for the text object
DOMData = (Upperleftxposofitem, upperleftypos, width, height, textstring, cssstylestring, color)
Backgrounds = the background images in the layering order they will be rendered

3.) Simply open the INDEX.htm file to display the page

So far no tutorials are released, however any questions can be sent to the feedback e-mail.  Once there is a working alpha a few video tutorials should pop up.  Thank you for your help and support!




							ENGINE DEBUGGING(Using Firefox)

Description:
Core files for regression testing the HTML5 application and game engine. 

Purpose:
These files are intended to serve as a template for usage and coding conventions to be used concurrently with API documentation.  Users are encouraged to add their
own test suggestions to produce a more stable build and to track down bugs early in the development cycle.  Added tests will be run against any subsequent build
of the application engine.

Homepage: http://www.codequest.co

--Development Team




TEST PROCEDURE(INDIVIDUAL COMPONENTS):

1.)Make sure the component you are testing contains the most recent versions of the files to test as well as any supplementary
library dependencies

2.)Open the included HTML document with firefox

TEST PROCEDURE(ENTIRE TEST SUITE):

1.)Make sure all components contain the most recent versions of the files to test as well as any supplementary  
library dependencies

2.)Add firefox to your PATH system environment variable(windows)

2.)Run TESTSUITE.bat from the root directory

TEST PROCEDURE(CORE ENGINE RUNTIME):

1.)Run BUILD.bat from the root folder directory to compile the dependencies from each component.  A folder will be created
   called COREBUILD

2.)Open INDEX.htm from the COREBUILD directory in firefox
