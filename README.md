StarlightEngine
===============

The latest open starlight HTML5 application engine 


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
