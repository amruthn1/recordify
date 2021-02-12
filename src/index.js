import React from 'react'
import ReactDOM from 'react-dom'
import '../src/index.css'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import githublogo from '../src/25231.png';
const ffmpeg = createFFmpeg({log: true})
const loading = (
    <div>
        <h3 id = "loading">Loading...</h3>
    </div>
)
ReactDOM.render(loading, document.getElementById('root'))
console.log("Initializing ffmpeg")
initffmpeg()
async function initffmpeg(){
    var d = new Date()
    await ffmpeg.load()
    console.log("Loaded")
    class Github extends React.Component {
        render(){
            return <img onClick = {githubOnClick} id = "githublogo" height = "30" width = "30" src = {githublogo} alt = "My Github Page"></img>
        }
    }
    const page = (
        <div>
            <h2 id = "title">Screen Recorder</h2>
            <br></br>
            <button id = "start" onClick = {init}>Start</button>
            <br></br>
            <button id = "stop">Stop</button>
            <br></br>
            <input id="audiotoggle" type="checkbox"/>
            <h6 id = "audiotext">Audio</h6>
            <div id = "output">
                <br></br>
                <h3 id = "outputtext">Output</h3>
                <br></br>
                <video controls autoPlay width = "800" height = "500" id = "vidplay"></video>
                <br></br>
                <div id = "downloadcontainer">
                    <a href = "nothing.com" id = "download">Download</a>
                </div>
                <div id = "invisiblechecker">
                    <video id = "invisiblevid" height = "1" src = "nowhereland.com"></video>
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
        window.open("https://github.com")
    }
    let recorder, stream, audiostream, audiorecorder, completeBlob, audioBlob;
    document.getElementById('output').style.visibility = 'hidden'
    document.getElementById('invisiblechecker').style.visibility = 'hidden'
    async function init(){
        let finalurl = "";
        let audio = false;
        if(document.getElementById('audiotoggle').checked){
            audio = true;
        }
        document.getElementById('start').disabled = true
        document.getElementById('stop').disabled = false
        document.getElementById('stop').onclick = function(){
            if(audio){
                setTimeout(temp, 2000)
                async function temp(){
                    var outputdata;
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
                            ffmpeg.FS("writeFile", "video.webm", await fetchFile(completeBlob))
                            ffmpeg.FS("writeFile", "audio.weba", await fetchFile(audioBlob))
                            await ffmpeg.run('-i', 'video.webm', '-i', 'audio.weba', "-filter_complex", "[0:a:0][1:a:0]amix=inputs=2", '-map', '0:v:0', '-map', '0:a:0', '-map', '1:a:0', '-c:v', 'copy', 'output.webm')
                            outputdata = ffmpeg.FS('readFile', "output.webm")
                            waitforffmpeg()
                        } else {
                            ffmpeg.FS("writeFile", "video.webm", await fetchFile(completeBlob))
                            ffmpeg.FS("writeFile", "audio.weba", await fetchFile(audioBlob))
                            await ffmpeg.run("-i", "video.webm", "-i", "audio.weba", "-c", "copy", "output.webm")
                            outputdata = ffmpeg.FS('readFile', "output.webm")
                            waitforffmpeg()
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
        if(audio){
            audiostream = await navigator.mediaDevices.getUserMedia({
                audio:true
            })
            audiorecorder = new MediaRecorder(audiostream, {mimeType: 'audio/webm'})
            audiorecorder.start()
            const audiochunks = [];
            audiorecorder.ondataavailable = f => audiochunks.push(f.data)
            audiorecorder.onstop = f => {
                audioBlob = new Blob(audiochunks, {type: 'audio/webm'})
            }
        }
        recorder = new MediaRecorder(stream, {mimeType: 'video/webm; codecs=vp9'});
        const chunks = [];
        recorder.ondataavailable = e => chunks.push(e.data);
        recorder.onstop = e => {
            completeBlob = new Blob(chunks, { type: 'video/webm; codecs=vp9' });
            var downloaduri = URL.createObjectURL(completeBlob)
            if (audio){
                audiorecorder.stop()
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
        }
    }
}