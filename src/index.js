import React from 'react'
import ReactDOM from 'react-dom'
import '../src/index.css'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import githublogo from '../src/25231.png';
const d = new Date()
const ffmpeg = createFFmpeg({log: true})
const loading = (
    <div id = "mainpage">
        <h3 id = "loading">Loading...</h3>
    </div>
)
ReactDOM.render(loading, document.getElementById('root'))
console.log("Initializing ffmpeg")
initffmpeg()
async function initffmpeg(){
    await ffmpeg.load()
    console.log("Loaded")
    class Github extends React.Component {
        render(){
            return <img onClick = {githubOnClick} id = "githublogo" height = "30" width = "30" src = {githublogo} alt = "My Github Page"></img>
        }
    }
    const page = (
        <div id = "mainpage">
            <h2 id = "title">Recordify</h2>
            <br></br>
            <button id = "start" onClick = {init}>Start</button>
            <br></br>
            <button id = "stop">Stop</button>
            <br></br>
            <div id = "audiotogglecontainer">
            <label class="switch">
                <input type="checkbox" id = "audiotoggle"/>
                <span class="slider round"></span>
            </label>
            <h6 id = "audiotext">Audio</h6>
            </div>
            <div id = "videotogglecontainer">
            <label class="switch">
                <input type="checkbox" id = "videotoggle"/>
                <span class="slider round"></span>
            </label>
                <h6 id = "videotext">Video</h6>
            </div>
            <div id = "output">
                <br></br>
                <h3 id = "outputtext">Output</h3>
                <br></br>
                <video controls autoPlay width = "800" height = "500" id = "vidplay"></video>
                <br></br>
                <div id = "downloadcontainer">
                    <a href = "https://google.com" id = "download">Download</a>
                </div>
                <div id = "invisiblechecker">
                    <video id = "invisiblevid" height = "1" src = "https://google.com"></video>
                </div>
            </div>
            <div id = "logos">
                <Github/>
            </div>
            <br></br>
        </div>
    )
    ReactDOM.render(page, document.getElementById('root'))
    function githubOnClick() {
        window.open("https://github.com/amruthn1")
    }
    let recorder, stream, audiostream, audiorecorder, completeBlob, audioBlob, videostream, videoBlob, videorecorder, outputdata, outputdatawithcam, shouldprocess;
    document.getElementById('output').style.visibility = 'hidden'
    document.getElementById('invisiblechecker').style.visibility = 'hidden'
    async function init(){
        let finalurl = "";
        let audio = false;
        let chosevideo = false;
        shouldprocess = true
        if(document.getElementById('audiotoggle').checked){
            audio = true;
        }
        if(document.getElementById('videotoggle').checked){
            chosevideo = true;
        }
        document.getElementById('start').disabled = true
        document.getElementById('stop').disabled = false
        document.getElementById('stop').onclick = function(){
            stream.getVideoTracks()[0].stop()
            function finished(){
                if(chosevideo){
                    a(outputdata)
                    shouldprocess = false
                }
            }
            function a(){
                b(outputdata)
                async function b(){
                    ffmpeg.FS("writeFile", "newinput.webm", await fetchFile(outputdata))
                    ffmpeg.FS("writeFile", "overlay.webm", await fetchFile(videoBlob))
                    await ffmpeg.run("-i", "newinput.webm", "-i", "overlay.webm", "-filter_complex", "[0:v][1:v]overlay=25:25", "-shortest", "-pix_fmt", "yuv420p", "-preset", "fast", "-c:a", "copy", "finaloutput.webm")
                    setTimeout(c, 500)
                    async function c(){
                        outputdatawithcam = ffmpeg.FS("readFile", "finaloutput.webm")
                        console.log(outputdatawithcam)
                        var blob = new Blob([outputdatawithcam], {type:'video/webm'});
                        console.log("Blob:" + blob)
                        let videoplayer = document.querySelectorAll("video")
                        videoplayer[0].src = URL.createObjectURL(blob)
                    }
                }
            }
            if(audio && shouldprocess){
                setTimeout(temp, 2000)
                async function temp(){
                    let videoplayer = document.querySelectorAll("video")
                    videoplayer[1].src = URL.createObjectURL(completeBlob)
                    hasAudio(videoplayer[1])
                    videoplayer[1].play()
                    await new Promise(r => setTimeout(r, 1000));
                    videoplayer[1].pause()
                    const whichffmpeg = hasAudio(videoplayer[1])
                    function hasAudio (video) {
                        return video.mozHasAudio ||
                        Boolean(video.webkitAudioDecodedByteCount) ||
                        Boolean(video.audioTracks && video.audioTracks.length);
                    }
                    ffmpegrunner()
                    async function ffmpegrunner(){
                        if (whichffmpeg){
                            stream.getAudioTracks()[0].stop()
                            ffmpeg.FS("writeFile", "video.webm", await fetchFile(completeBlob))
                            ffmpeg.FS("writeFile", "audio.weba", await fetchFile(audioBlob))
                            await ffmpeg.run('-i', 'video.webm', '-i', 'audio.weba', "-filter_complex", "[0:a:0][1:a:0]amix=inputs=2", '-map', '0:v:0', '-map', '0:a:0', '-map', '1:a:0', '-c:v', 'copy', 'output.webm')
                            outputdata = ffmpeg.FS('readFile', "output.webm")
                            finished(outputdata)
                            if(!chosevideo){
                            waitforffmpeg()
                            }
                        } else {
                            ffmpeg.FS("writeFile", "video.webm", await fetchFile(completeBlob))
                            ffmpeg.FS("writeFile", "audio.weba", await fetchFile(audioBlob))
                            await ffmpeg.run("-i", "video.webm", "-i", "audio.weba", "-c", "copy", "output.webm")
                            outputdata = ffmpeg.FS('readFile', "output.webm")
                            finished(outputdata)
                            if(!chosevideo){
                                waitforffmpeg()
                            }                        
                        }
                    }
                    function waitforffmpeg(){
                        finalurl = URL.createObjectURL(new Blob([outputdata.buffer], {type: 'video/webm'}))
                        video.src = finalurl
                        var a = document.getElementById('download')
                        a.href = finalurl;
                        a.download = d.getMonth()+"-"+ d.getDate()+"-"+d.getFullYear()+"-"+d.getHours()+"-"+d.getMinutes()+".webm";
                    }
                }
            }
            document.getElementById('output').style.visibility = 'visible'
            recorder.stop()
            if (audio){
                audiorecorder.stop()
            }
            if (chosevideo){
                videorecorder.stop()
            }
            document.getElementById('stop').disabled = true
            document.getElementById('start').disabled = false
        }
        const video = document.querySelector("video");
        startRecording()
        async function startRecording() {
        stream = await navigator.mediaDevices.getDisplayMedia({
            video: { mediaSource: "screen" },
            audio: true
        });
        if(chosevideo){
            videoRecorder()
            async function videoRecorder(){
                console.log("madeit")
                videostream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: 320, height: 180
                    }
                });
                const options = {mimeType: 'video/webm'}
                videorecorder = new MediaRecorder(videostream, options)
                //videorecorder.start()
                const camerachunks = []
                videorecorder.ondataavailable = g => camerachunks.push(g.data)
                videorecorder.onstop = g => {
                videoBlob = new Blob(camerachunks, {type: 'video/webm'})
            }
        }
        }
        if(audio){
            audiostream = await navigator.mediaDevices.getUserMedia({
                audio:true
            })
            audiorecorder = new MediaRecorder(audiostream, {mimeType: 'audio/webm'})
            //audiorecorder.start()
            const audiochunks = [];
            audiorecorder.ondataavailable = f => audiochunks.push(f.data)
            audiorecorder.onstop = f => {
                audioBlob = new Blob(audiochunks, {type: 'audio/webm'})
            }
        }
        recorder = new MediaRecorder(stream, {mimeType: 'video/webm; codecs=vp9'});
        const chunks = [];
        recorder.ondataavailable = e => chunks.push(e.data);
        stream.getVideoTracks()[0].onended = function (){
            stream.getVideoTracks()[0].stop()
            function finished(){
                if(chosevideo){
                    a(outputdata)
                    shouldprocess = false
                }
            }
            function a(){
                b(outputdata)
                async function b(){
                    ffmpeg.FS("writeFile", "newinput.webm", await fetchFile(outputdata))
                    ffmpeg.FS("writeFile", "overlay.webm", await fetchFile(videoBlob))
                    await ffmpeg.run("-i", "newinput.webm", "-i", "overlay.webm", "-filter_complex", "[0:v][1:v]overlay=25:25", "-shortest", "-pix_fmt", "yuv420p", "-preset", "fast", "-c:a", "copy", "finaloutput.webm")
                    setTimeout(c, 500)
                    async function c(){
                        outputdatawithcam = ffmpeg.FS("readFile", "finaloutput.webm")
                        console.log(outputdatawithcam)
                        var blob = new Blob([outputdatawithcam], {type:'video/webm'});
                        console.log("Blob:" + blob)
                        let videoplayer = document.querySelectorAll("video")
                        videoplayer[0].src = URL.createObjectURL(blob)
                    }
                }
            }
            if(audio && shouldprocess){
                setTimeout(temp, 2000)
                async function temp(){
                    let videoplayer = document.querySelectorAll("video")
                    videoplayer[1].src = URL.createObjectURL(completeBlob)
                    hasAudio(videoplayer[1])
                    videoplayer[1].play()
                    await new Promise(r => setTimeout(r, 1000));
                    videoplayer[1].pause()
                    const whichffmpeg = hasAudio(videoplayer[1])
                    function hasAudio (video) {
                        return video.mozHasAudio ||
                        Boolean(video.webkitAudioDecodedByteCount) ||
                        Boolean(video.audioTracks && video.audioTracks.length);
                    }
                    ffmpegrunner()
                    async function ffmpegrunner(){
                        if (whichffmpeg){
                            stream.getAudioTracks()[0].stop()
                            ffmpeg.FS("writeFile", "video.webm", await fetchFile(completeBlob))
                            ffmpeg.FS("writeFile", "audio.weba", await fetchFile(audioBlob))
                            await ffmpeg.run('-i', 'video.webm', '-i', 'audio.weba', "-filter_complex", "[0:a:0][1:a:0]amix=inputs=2", '-map', '0:v:0', '-map', '0:a:0', '-map', '1:a:0', '-c:v', 'copy', 'output.webm')
                            outputdata = ffmpeg.FS('readFile', "output.webm")
                            finished(outputdata)
                            if(!chosevideo){
                            waitforffmpeg()
                            }
                        } else {
                            ffmpeg.FS("writeFile", "video.webm", await fetchFile(completeBlob))
                            ffmpeg.FS("writeFile", "audio.weba", await fetchFile(audioBlob))
                            await ffmpeg.run("-i", "video.webm", "-i", "audio.weba", "-c", "copy", "output.webm")
                            outputdata = ffmpeg.FS('readFile', "output.webm")
                            finished(outputdata)
                            if(!chosevideo){
                                waitforffmpeg()
                            }                        
                        }
                    }
                    function waitforffmpeg(){
                        finalurl = URL.createObjectURL(new Blob([outputdata.buffer], {type: 'video/webm'}))
                        video.src = finalurl
                        var a = document.getElementById('download')
                        a.href = finalurl;
                        a.download = d.getMonth()+"-"+ d.getDate()+"-"+d.getFullYear()+"-"+d.getHours()+"-"+d.getMinutes()+".webm";
                    }
                }
            }
            document.getElementById('output').style.visibility = 'visible'
            recorder.stop()
            if (audio){
                audiorecorder.stop()
            }
            if (chosevideo){
                videorecorder.stop()
            }
            document.getElementById('stop').disabled = true
            document.getElementById('start').disabled = false
        }
        recorder.onstop = e => {
            completeBlob = new Blob(chunks, { type: 'video/webm; codecs=vp9' });
            var downloaduri = URL.createObjectURL(completeBlob)
            if (audio){
            } else{
                prepdownload()
                async function prepdownload(){
                    video.src = downloaduri
                    var a = document.getElementById('download')
                    a.href = downloaduri;
                    a.download = d.getMonth()+"-"+ d.getDate()+"-"+d.getFullYear()+"-"+d.getHours()+"-"+d.getMinutes()+".webm";
                }
            }
        };
        recorder.start();
        if (audio){
            audiorecorder.start()
        } 
        if (chosevideo){
            videorecorder.start()
        }
}        
}
}
