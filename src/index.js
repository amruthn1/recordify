import React from 'react'
import '../src/index.css'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import githublogo from '../src/25231.png'
import loadinggif from '../src/Ajax-Preloader.gif'
import gearicon from '../src/gearicon.png'
import crossicon from '../src/cross.png'
import { createRoot } from 'react-dom/client'
const container = document.getElementById('root')
const root = createRoot(container)
const d = new Date()
var percentage;
const ffmpeg = createFFmpeg({ log: true })
const loading = (
    <div id="mainpage">
        <h3 id="loading">Loading...</h3>
    </div>
)
async function getConnectedDevices(type) {
    const devices = await navigator.mediaDevices.enumerateDevices()
    return devices.filter(device => device.kind === type)
}
root.render(loading)
console.log("Initializing ffmpeg")
initffmpeg()
async function initffmpeg() {
    const page = (
        <div id="mainpage">
            <div id="uppercontainer">
                <h2 id="title">Recordify</h2>
                <img src={gearicon} id="gearicon" onClick={clickGear} alt="settings"/>
                <div className="dropdown" id="dropdown">
                    <img src={crossicon} id="dropdowncross" onClick={clickedCross} alt="dropdown"></img>
                    <div className="dropdown-content">
                        <br></br>
                        <p>Dark Mode</p>
                        <br></br>
                        <p>Light Mode</p>
                    </div>
                </div>
            </div>
            <div id="popup" className="modal">
                <div className="modal-content">
                    <span className="close" id="popupcross">&times;</span>
                    <p id="popuptext">Screencapturing with your video and no audio or only screenshared audio is currently not supported by Recordify.</p>
                </div>
            </div>
            <br></br>
            <button id="start" onClick={init}>Start</button>
            <br></br>
            <button id="stop">Stop</button>
            <br></br>
            <div id="audiotogglecontainer">
                <label className="switch">
                    <input type="checkbox" id="audiotoggle" />
                    <span className="slider round"></span>
                </label>
                <h6 id="audiotext">Audio</h6>
            </div>
            <div id="videotogglecontainer">
                <label className="switch">
                    <input type="checkbox" id="videotoggle" />
                    <span className="slider round"></span>
                </label>
                <h6 id="videotext">Video</h6>
            </div>
            <div id="screentogglecontainer">
                <label className="switch">
                    <input type="checkbox" id="screentoggle" />
                    <span className="slider round"></span>
                </label>
                <h6 id="screentext">Screen</h6>
            </div>
            <div id="loadingcontainer">
                <img id="loadinggif" src={loadinggif} alt="Loading..." height="200" width="300"></img>
                <h6 id="progresstext">Please wait while the video is encoding...</h6>
                <br></br>
                <div className="w3-light-grey w3-round" id="progresscontainer">
                    <div className="w3-container w3-round w3-blue" id="progressbar"></div>
                </div>
            </div>
            <div id="output">
                <br></br>
                <h3 id="outputtext">Output</h3>
                <br></br>
                <video controls autoPlay width="800" height="500" id="vidplay"></video>
                <br></br>
                <div id="downloadcontainer">
                    <a href="" id="download">Download</a>
                </div>
                <br></br>
                <div id="invisiblechecker">
                    <video id="invisiblevid" height="1" src=""></video>
                </div>
            </div>
            <div id="logos">
                <img onClick={githubOnClick} id="githublogo" height="30" width="30" src={githublogo} alt="My Github Page"></img>
            </div>
            <br></br>
            <br></br>
            <br></br>
            <div id="log"></div>
            <br></br>
        </div>
    )
    root.render(page)
    await ffmpeg.load()
    console.log("Loaded")
    const mics = getConnectedDevices('audioinput')
    const cameras = getConnectedDevices('videoinput')
    console.log("Mics:", mics, "Cameras:", cameras)
    function clickGear() {
        document.getElementById("dropdown").style.visibility = "visible"
    }
    function clickedCross() {
        document.getElementById("dropdown").style.visibility = "hidden"
    }
    function githubOnClick() {
        window.open("https://github.com/amruthn1")
    }
    let recorder, stream, audiostream, audiorecorder, completeBlob, audioBlob, videostream, videoBlob, videorecorder, outputdata, outputdatawithcam, shouldprocess;
    document.getElementById('output').style.visibility = 'hidden'
    document.getElementById('invisiblechecker').style.visibility = 'hidden'
    document.getElementById('loadingcontainer').style.visibility = 'hidden'
    document.getElementById("progresscontainer").style.visibility = 'hidden'
    async function init() {
        let finalurl = "";
        let audio = false;
        let chosevideo = false;
        let chosescreen = false;
        var newiteraton1;
        shouldprocess = true
        if (document.getElementById('audiotoggle').checked) {
            audio = true;
        }
        if (document.getElementById('videotoggle').checked) {
            chosevideo = true;
        }
        if (document.getElementById('screentoggle').checked) {
            chosescreen = true;
        }
        if (chosevideo && !audio) {
            var modal = document.getElementById("popup");
            var span = document.getElementsByClassName("close")[0];
            window.onclick = function (event) {
                if (event.target === modal) {
                    modal.style.display = "none";
                }
            }
            modal.style.display = "block"
            span.onclick = () => {
                modal.style.display = "none"
            }
        } else {
            document.getElementById('start').disabled = true
            document.getElementById('stop').disabled = false
            document.getElementById('stop').onclick = function () {
                document.getElementById('loadingcontainer').style.visibility = 'visible'
                stream.getVideoTracks()[0].stop()
                function finished() {
                    if (chosevideo) {
                        if (audio) {
                            a(outputdata)
                            shouldprocess = false
                        }
                    }
                }
                function a() {
                    b(outputdata)
                    async function b() {
                        ffmpeg.FS("writeFile", "newinput.webm", await fetchFile(outputdata))
                        ffmpeg.FS("writeFile", "overlay.webm", await fetchFile(videoBlob))
                        var old = console.log;
                        var logger = document.getElementById('log');
                        console.log = function (message) {
                            if (typeof message == 'object') {
                                logger.scrollTop = logger.scrollHeight;
                                logger.innerHTML += "   " + (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
                            } else {
                                logger.scrollTop = logger.scrollHeight;
                                logger.innerHTML += "   " + message + '<br />';
                                if (message.includes("DURATION ")) {
                                    newiteraton1 = message.split(" :")[1]
                                }
                                if (message.includes("time=")) {
                                    var iteration1 = message.split("=")[5]
                                    var iteration2 = iteration1.split(" ")[0]
                                    function totalSeconds(time) {
                                        var parts = time.split(':');
                                        return parts[0] * 3600 + parts[1] * 60 + parts[2];
                                    }
                                    document.getElementById("progresscontainer").style.visibility = "visible"
                                    document.getElementById('progresstext').style.visibility = 'visible'
                                    document.getElementById("loadingcontainer").style.visibility = "hidden"
                                    percentage = (100 * totalSeconds(iteration2) / totalSeconds(newiteraton1)).toFixed(2);
                                    if (percentage < 1) {
                                        document.getElementById("progressbar").style.width = (percentage * 100) + "%"
                                    } else {
                                        document.getElementById("progressbar").style.width = percentage + "%"
                                    }
                                }
                            }
                        }
                        document.getElementById('start').disabled = true
                        await ffmpeg.run("-i", "newinput.webm", "-i", "overlay.webm", "-filter_complex", "[0:v][1:v]overlay=25:25", "-shortest", "-crf", "40", "-preset", "ultrafast", "-vcodec", "libvpx", "-pix_fmt", "yuv420p", "finaloutput.webm")
                        document.getElementById('start').disabled = false
                        setTimeout(c, 500)
                        async function c() {
                            outputdatawithcam = ffmpeg.FS("readFile", "finaloutput.webm")
                            var blob = new Blob([outputdatawithcam], { type: 'video/webm' })
                            let videoplayer = document.querySelectorAll("video")
                            let tempurl = URL.createObjectURL(blob)
                            videoplayer[0].src = tempurl
                            document.getElementById('output').style.visibility = 'visible'
                            document.getElementById('loadingcontainer').style.visibility = 'hidden'
                            document.getElementById('progresstext').style.visibility = 'hidden'
                            document.getElementById("progresscontainer").style.visibility = "hidden"
                            var a = document.getElementById('download')
                            a.href = tempurl
                            a.download = d.getMonth() + "-" + d.getDate() + "-" + d.getFullYear() + "-" + d.getHours() + "-" + d.getMinutes() + ".webm"
                        }
                    }
                }
                if (audio && shouldprocess && chosescreen) {
                    setTimeout(temp, 2000)
                    async function temp() {
                        let videoplayer = document.querySelectorAll("video")
                        videoplayer[1].muted = true;
                        videoplayer[1].src = URL.createObjectURL(completeBlob)
                        hasAudio(videoplayer[1])
                        videoplayer[1].play()
                        await new Promise(r => setTimeout(r, 1000));
                        videoplayer[1].pause()
                        const whichffmpeg = hasAudio(videoplayer[1])
                        function hasAudio(video) {
                            return video.mozHasAudio ||
                                Boolean(video.webkitAudioDecodedByteCount) ||
                                Boolean(video.audioTracks && video.audioTracks.length);
                        }
                        ffmpegrunner()
                        async function ffmpegrunner() {
                            if (whichffmpeg) {
                                stream.getAudioTracks()[0].stop()
                                ffmpeg.FS("writeFile", "video.webm", await fetchFile(completeBlob))
                                await ffmpeg.run("-i", "video.webm", "-vcodec", "copy", "-af", "volume=-10dB", "-preset", "veryfast", "mixedoutput.webm")
                                let mixeddata = ffmpeg.FS("readFile", "mixedoutput.webm")
                                ffmpeg.FS("writeFile", "withadjustedaudio.webm", await fetchFile(mixeddata))
                                ffmpeg.FS("writeFile", "audio.weba", await fetchFile(audioBlob))
                                await ffmpeg.run('-i', 'withadjustedaudio.webm', '-i', 'audio.weba', "-filter_complex", "[0:a:0][1:a:0]amix=inputs=2", '-map', '0:v:0', '-map', '0:a:0', '-map', '1:a:0', '-c:v', 'copy', 'output.webm')
                                outputdata = ffmpeg.FS('readFile', "output.webm")
                                finished(outputdata)
                                if (!chosevideo) {
                                    waitforffmpeg()
                                }
                            } else {
                                ffmpeg.FS("writeFile", "video.webm", await fetchFile(completeBlob))
                                ffmpeg.FS("writeFile", "audio.weba", await fetchFile(audioBlob))
                                await ffmpeg.run("-i", "video.webm", "-i", "audio.weba", "-c", "copy", "output.webm")
                                outputdata = ffmpeg.FS('readFile', "output.webm")
                                finished(outputdata)
                                if (!chosevideo) {
                                    waitforffmpeg()
                                }
                            }
                        }
                        function waitforffmpeg() {
                            finalurl = URL.createObjectURL(new Blob([outputdata.buffer], { type: 'video/webm' }))
                            video.src = finalurl
                            document.getElementById('output').style.visibility = 'visible'
                            document.getElementById('progresstext').style.visibility = 'hidden'
                            document.getElementById('loadingcontainer').style.visibility = 'hidden'
                            document.getElementById("progresscontainer").style.visibility = "hidden"
                            var a = document.getElementById('download')
                            a.href = finalurl;
                            a.download = d.getMonth() + "-" + d.getDate() + "-" + d.getFullYear() + "-" + d.getHours() + "-" + d.getMinutes() + ".webm";
                        }
                    }
                } else if ((!chosescreen && audio && !chosevideo)) {
                    
                } else if ((!chosescreen && !audio && chosevideo)) {

                } else if ((!chosescreen && audio && chosevideo)) {

                }
                if (chosescreen) {
                    recorder.stop()
                }
                if (audio) {
                    audiostream.getAudioTracks()[0].stop()
                }
                if (chosevideo) {
                    videostream.getVideoTracks()[0].stop()
                }
                document.getElementById('stop').disabled = true
                document.getElementById('start').disabled = false
            }
            const video = document.querySelector("video");
            startRecording()
            async function startRecording() {
                try {
                    stream = await navigator.mediaDevices.getDisplayMedia({
                        video: { mediaSource: "screen" },
                        audio: true
                    });
                } catch (e) {
                    console.log("failed to get user media")
                    document.getElementById('stop').disabled = true
                    document.getElementById('start').disabled = false
                    window.location.reload()
                }
                if (chosevideo) {
                    videoRecorder()
                    async function videoRecorder() {
                        videostream = await navigator.mediaDevices.getUserMedia({
                            video: {
                                width: 320,
                                height: 180,
                            }
                        });
                        const options = { mimeType: 'video/webm' }
                        videorecorder = new MediaRecorder(videostream, options)
                        const camerachunks = []
                        videorecorder.ondataavailable = g => camerachunks.push(g.data)
                        videorecorder.onstop = g => {
                            videoBlob = new Blob(camerachunks, { type: 'video/webm' })
                        }
                    }
                }
                if (audio) {
                    audiostream = await navigator.mediaDevices.getUserMedia({
                        audio: true
                    })
                    // audio: { deviceId: chosendeviceidhere}
                    audiorecorder = new MediaRecorder(audiostream, { mimeType: 'audio/webm' })
                    const audiochunks = [];
                    audiorecorder.ondataavailable = f => audiochunks.push(f.data)
                    audiorecorder.onstop = f => {
                        audioBlob = new Blob(audiochunks, { type: 'audio/webm' })
                    }
                }
                if (chosescreen) {
                    const chunks = []
                    recorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
                    recorder.ondataavailable = e => chunks.push(e.data);
                    //only shows if screen is recording so can only use stop button on website to stop without screen recording
                    stream.getVideoTracks()[0].onended = function () {
                        document.getElementById('loadingcontainer').style.visibility = 'visible'
                        stream.getVideoTracks()[0].stop()
                        function finished() {
                            if (chosevideo) {
                                a(outputdata)
                                shouldprocess = false
                            }
                        }
                        function a() {
                            b(outputdata)
                            async function b() {
                                ffmpeg.FS("writeFile", "newinput.webm", await fetchFile(outputdata))
                                ffmpeg.FS("writeFile", "overlay.webm", await fetchFile(videoBlob))
                                var old = console.log;
                                var logger = document.getElementById('log');
                                console.log = function (message) {
                                    if (typeof message == 'object') {
                                        logger.innerHTML += "   " + (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
                                    } else {
                                        logger.innerHTML += "   " + message + '<br />';
                                        if (message.includes("DURATION ")) {
                                            newiteraton1 = message.split(" :")[1]
                                        }
                                        if (message.includes("time=")) {
                                            var iteration1 = message.split("=")[5]
                                            var iteration2 = iteration1.split(" ")[0]
                                            function totalSeconds(time) {
                                                var parts = time.split(':');
                                                return parts[0] * 3600 + parts[1] * 60 + parts[2];
                                            }
                                            document.getElementById("progresscontainer").style.visibility = "visible"
                                            document.getElementById('progresstext').style.visibility = 'visible'
                                            document.getElementById("loadingcontainer").style.visibility = "hidden"
                                            percentage = (100 * totalSeconds(iteration2) / totalSeconds(newiteraton1)).toFixed(2);
                                            if (percentage < 1) {
                                                document.getElementById("progressbar").style.width = (percentage * 100) + "%"
                                            } else {
                                                document.getElementById("progressbar").style.width = percentage + "%"
                                            }
                                        }
                                    }
                                }
                                document.getElementById('start').disabled = true
                                await ffmpeg.run("-i", "newinput.webm", "-i", "overlay.webm", "-filter_complex", "[0:v][1:v]overlay=25:25", "-shortest", "-crf", "40", "-preset", "ultrafast", "-vcodec", "libvpx", "-pix_fmt", "yuv420p", "finaloutput.webm")
                                document.getElementById('start').disabled = false
                                setTimeout(c, 500)
                                async function c() {
                                    outputdatawithcam = ffmpeg.FS("readFile", "finaloutput.webm")
                                    var blob = new Blob([outputdatawithcam], { type: 'video/webm' })
                                    let videoplayer = document.querySelectorAll("video")
                                    let tempurl = URL.createObjectURL(blob)
                                    videoplayer[0].src = tempurl
                                    document.getElementById('output').style.visibility = 'visible'
                                    document.getElementById('progresstext').style.visibility = 'hidden'
                                    document.getElementById('loadingcontainer').style.visibility = 'hidden'
                                    document.getElementById("progresscontainer").style.visibility = "hidden"
                                    var a = document.getElementById('download')
                                    a.href = tempurl
                                    a.download = d.getMonth() + "-" + d.getDate() + "-" + d.getFullYear() + "-" + d.getHours() + "-" + d.getMinutes() + ".webm"
                                }
                            }
                        }
                        if (audio && shouldprocess) {
                            setTimeout(temp, 2000)
                            async function temp() {
                                let videoplayer = document.querySelectorAll("video")
                                videoplayer[1].muted = true;
                                videoplayer[1].src = URL.createObjectURL(completeBlob)
                                hasAudio(videoplayer[1])
                                videoplayer[1].play()
                                await new Promise(r => setTimeout(r, 1000));
                                videoplayer[1].pause()
                                const whichffmpeg = hasAudio(videoplayer[1])
                                function hasAudio(video) {
                                    return video.mozHasAudio ||
                                        Boolean(video.webkitAudioDecodedByteCount) ||
                                        Boolean(video.audioTracks && video.audioTracks.length);
                                }
                                ffmpegrunner()
                                async function ffmpegrunner() {
                                    if (whichffmpeg) {
                                        stream.getAudioTracks()[0].stop()
                                        ffmpeg.FS("writeFile", "video.webm", await fetchFile(completeBlob))
                                        await ffmpeg.run("-i", "video.webm", "-vcodec", "copy", "-af", "volume=-10dB", "-preset", "veryfast", "mixedoutput.webm")
                                        let mixeddata = ffmpeg.FS("readFile", "mixedoutput.webm")
                                        ffmpeg.FS("writeFile", "audio.weba", await fetchFile(audioBlob))
                                        ffmpeg.FS("writeFile", "withadjustedaudio.webm", await fetchFile(mixeddata))
                                        await ffmpeg.run('-i', 'withadjustedaudio.webm', '-i', 'audio.weba', "-filter_complex", "[0:a:0][1:a:0]amix=inputs=2", '-map', '0:v:0', '-map', '0:a:0', '-map', '1:a:0', '-c:v', 'copy', 'output.webm')
                                        outputdata = ffmpeg.FS('readFile', "output.webm")
                                        finished(outputdata)
                                        if (!chosevideo) {
                                            waitforffmpeg()
                                        }
                                    } else {
                                        ffmpeg.FS("writeFile", "video.webm", await fetchFile(completeBlob))
                                        ffmpeg.FS("writeFile", "audio.weba", await fetchFile(audioBlob))
                                        await ffmpeg.run("-i", "video.webm", "-i", "audio.weba", "-c", "copy", "output.webm")
                                        outputdata = ffmpeg.FS('readFile', "output.webm")
                                        finished(outputdata)
                                        if (!chosevideo) {
                                            waitforffmpeg()
                                        }
                                    }
                                }
                                function waitforffmpeg() {
                                    finalurl = URL.createObjectURL(new Blob([outputdata.buffer], { type: 'video/webm' }))
                                    video.src = finalurl
                                    document.getElementById('output').style.visibility = 'visible'
                                    document.getElementById('progresstext').style.visibility = 'hidden'
                                    document.getElementById('loadingcontainer').style.visibility = 'hidden'
                                    document.getElementById("progresscontainer").style.visibility = "hidden"
                                    var a = document.getElementById('download')
                                    a.href = finalurl;
                                    a.download = d.getMonth() + "-" + d.getDate() + "-" + d.getFullYear() + "-" + d.getHours() + "-" + d.getMinutes() + ".webm";
                                }
                            }
                        }
                        recorder.stop()
                        if (audio) {
                            audiostream.getAudioTracks()[0].stop()
                        }
                        if (chosevideo) {
                            videostream.getVideoTracks()[0].stop()
                        }
                        document.getElementById('stop').disabled = true
                        document.getElementById('start').disabled = false
                    }
                    recorder.onstop = e => {
                        completeBlob = new Blob(chunks, { type: 'video/webm; codecs=vp9' });
                        var downloaduri = URL.createObjectURL(completeBlob)
                        if (audio) {
                        } else {
                            prepdownload()
                            async function prepdownload() {
                                video.src = downloaduri
                                document.getElementById('output').style.visibility = 'visible'
                                document.getElementById('progresstext').style.visibility = 'hidden'
                                document.getElementById('loadingcontainer').style.visibility = 'hidden'
                                document.getElementById("progresscontainer").style.visibility = "hidden"
                                var a = document.getElementById('download')
                                a.href = downloaduri;
                                a.download = d.getMonth() + "-" + d.getDate() + "-" + d.getFullYear() + "-" + d.getHours() + "-" + d.getMinutes() + ".webm";
                            }
                        }
                    };
                    recorder.start();
                    if (audio) {
                        audiorecorder.start()
                    }
                    if (chosevideo) {
                        videorecorder.start()
                    }
                }
            }
        }
    }
}
