# Recordify
 
Recordify is a client based screen recording application that runs on the React framework. It utilizes a WASM + JS format of FFmpeg to do all of the processing that would usually be offloaded to an external server.

Beta Version Avaliable At: recordify.surge.sh

Features:
  - Supports screen, video, and audio recording, all of which can be mixed on the website and exported as a .webm file
  - Enables for system audio to be captured and mixed into a .webm file
  - Unlimited recordings (possible as all of the data recorded is stored as a Blob on the client end)


In Progress:
  - Creating better UI
  - Optimizing and cleaning function names 
  - Optimizing FFmpeg to make it less CPU intensive
  - Allow user to choose which mics and cameras they wish to use


