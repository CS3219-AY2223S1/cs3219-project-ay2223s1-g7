import React, { createContext, useState, useRef, useEffect } from "react";
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import * as process from 'process';

import { getCookie } from './utils/cookies.js'

window.global = window;
window.process = process;
window.Buffer = [];
const SocketContext = createContext();


const ContextProvider = ({ children }) => {
    const [stream, setStream] = useState(null);
    const [callSignal, setCallSignal] = useState(null);
    const [socket, setSocket] = useState(io());

    const [inCall, setInCall] = useState(false);
    const [waitingCall, setWaitingCall] = useState(false);
    
    const [peerName, setPeerName] = useState("");

    const [videoOn, setVideoOn] = useState(false);
    const [audioOn, setAudioOn] = useState(false);

    const [webcamList, setWebcamList] = useState([]);
    const [audioList, setAudioList] = useState([]);

    const [videoDeviceLabel, setVideoDeviceLabel] = useState('');
    const [audioDeviceLabel, setAudioDeviceLabel] = useState('');

    const myVideo = useRef();
    const peerVideo = useRef();
    const peerRef = useRef();

    useEffect(() => {
        // remove old listeners
        socket.removeListener('calluser')
        socket.removeListener('callended')
        socket.removeListener('joinRoomSuccess')

        socket.on('calluser', ({ signal }) => {
            setCallSignal(signal)
        });
        socket.on('callended', () => {
            console.log("BYEBYE");
            endCall()
        });

        socket.on('joinRoomSuccess', (data) => {
            let username = getCookie("user")
            let users = data.users
            let collaborator = users.filter(user => user.name !== username)[0]
            setPeerName(collaborator.name)
        })


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, stream, videoOn, inCall])

    const answerCall = () => {
        if (stream === null) {
            alert("Please turn on your video feed first!");
        }
        else {
            setInCall(true);

            let newPeer = new Peer({ initiator: false, trickle: false, stream });

            newPeer.on('signal', (data) => {
                socket.emit('answercall', { signal: data });
            });

            newPeer.on('stream', (currentStream) => {
                peerVideo.current.srcObject = currentStream;
            });

            newPeer.signal(callSignal);

            peerRef.current = newPeer
        }
    }

    const rejectCall = () => {
        socket.emit("rejectCall")
        setCallSignal(null)
    }

    const callUser = () => {
        if (stream === null) {
            alert("Please turn on your video feed first!");
        } else {
            setWaitingCall(true)

            let newPeer = new Peer({initiator: true, trickle: false, stream });

            
            newPeer.on('signal', (data) => {
                socket.emit('calluser', { signalData: data });
                socket.once('rejectCall', () => {
                    setWaitingCall(false)
                    endCall()
                })
            });

            newPeer.on('stream', (currentStream) => {
                peerVideo.current.srcObject = currentStream;

            });

            socket.on('callaccepted', (signal) => {
                setWaitingCall(false)
                setInCall(true);
                newPeer.signal(signal);
            })

            peerRef.current = newPeer
        }
    }

    const handleExit = async () => {
        leaveCall()
        await endCall()
        if (stream) {
            await terminateWebcam()
        }
        socket.disconnect()
    }

    const leaveCall = async () => {
        if (inCall) {
            socket.emit("endCall")
        }
    }

    const endCall = async () => {
        if (inCall) {
            socket.removeListener("callaccepted")
            socket.removeListener("rejectCall")
            setWaitingCall(false)
            setInCall(false);
            setCallSignal(null)
            await peerRef.current.destroy()
        }
    }

    const terminateWebcam = async () => {
        console.log("terminating webcam")
        await stream.getTracks().forEach(async (track) => {
            await track.stop();
        });
        console.log(stream.getTracks())
        myVideo.current.srcObject = null
        setVideoOn(false);
        setAudioOn(false);
        setStream(null)
    }

    const updateWebcam = async (device) => {
        await navigator.mediaDevices.getUserMedia({
            video: {
                deviceId: { exact: device}
            },
            audio: false
        }).then((currentStream) => {
            if(inCall) {
                peerRef.current.replaceTrack(stream.getVideoTracks()[0], currentStream.getVideoTracks()[0], stream);
            }
            // https://github.com/feross/simple-peer/issues/634
            stream.getAudioTracks().forEach(track => track.stop())
            stream.removeTrack(stream.getVideoTracks()[0])
            stream.addTrack(currentStream.getVideoTracks()[0])
            myVideo.current.srcObject = stream;
            let vLabel = webcamList.find(element => element.key == currentStream.getVideoTracks()[0].label)
            setVideoDeviceLabel(vLabel.value)
            return true
        }).catch(error => {
            return false
        })
        setVideoOn(true);
        setAudioOn(true);
    }

    const updateAudio = async (device) => {
        await navigator.mediaDevices.getUserMedia({
            audio: {
                deviceId: { exact: device}
            },
            video: false
        }).then(async (currentStream) => {
            if(inCall) {
                peerRef.current.replaceTrack(stream.getAudioTracks()[0], currentStream.getAudioTracks()[0], stream);
            }
            stream.removeTrack(stream.getAudioTracks()[0])
            stream.addTrack(currentStream.getAudioTracks()[0])
            myVideo.current.srcObject = stream;

            let aLabel = audioList.find(element => element.key == currentStream.getAudioTracks()[0].label)
            console.log(aLabel)
            setAudioDeviceLabel(aLabel.value)
            return true
        }).catch(error => {
            return false
        })
        setAudioOn(true);

    }


    const initiateWebcam = async() => {

        let permissions = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then((dummyStream) => {
            return true
        }).catch( (error) => {
            return false
        })

        console.log('permissions', permissions)

        await navigator.mediaDevices.enumerateDevices().then(async (devices) => {
            console.log(devices)
            let videoDevices = devices.filter(device => device.kind === "videoinput")
            let audioDevices = devices.filter(device => device.kind === "audioinput")
            let v_sources = [];
            for (const device of videoDevices) {
                v_sources.push({
                    key:   device.label,
                    value: device.deviceId,
                });
            }
            setWebcamList(v_sources)

            let a_sources = [];
            for (const device of audioDevices) {
                a_sources.push({
                    key:   device.label,
                    value: device.deviceId,
                });            
            }
            setAudioList(a_sources)

            for (const device of videoDevices) {

                let isVideoAvailable = await navigator.mediaDevices.getUserMedia({
                    video: {
                        deviceId: { exact: device.deviceId }
                    },
                    audio: true
                }).then((currentStream) => {
                    myVideo.current.srcObject = currentStream;
                    setStream(currentStream);
                    let v_label = v_sources.find(element => element.key === device.label)
                    setVideoDeviceLabel(v_label.value)
                    let a_label = a_sources.find(element => element.key === currentStream.getAudioTracks()[0].label)
                    setAudioDeviceLabel(a_label.value)

                    return true
                }).catch(error => {
                    return false
                })
                console.log('isVideoAvailable', isVideoAvailable)
                if (!isVideoAvailable) {
                    continue
                }
                setVideoOn(true);
                setAudioOn(true)
                break
            }
        })
    }

    const toggleVideo = () => {
        if (myVideo.current.srcObject !== null) {
            myVideo.current.srcObject.getTracks().forEach(function (track) {
                if (track.readyState === "live" && track.kind === "video") {
                    track.enabled = !videoOn;
                    setVideoOn(!videoOn);
                }
            })
        };
    }

    const toggleAudio = () => {
        if (myVideo.current.srcObject !== null) {
            myVideo.current.srcObject.getTracks().forEach(function (track) {
                if (track.readyState === "live" && track.kind === "audio") {
                    track.enabled = !audioOn;
                    setAudioOn(!audioOn);
                }
            })
        };

    }

    return (
        <SocketContext.Provider
            value={{
                callSignal, peerName, inCall, myVideo, peerVideo, stream, waitingCall,
                callUser, leaveCall, answerCall, toggleVideo, videoOn, toggleAudio,
                audioOn, setSocket, initiateWebcam, handleExit, rejectCall, webcamList, 
                audioList, updateWebcam, updateAudio, videoDeviceLabel, audioDeviceLabel
            }}
        >
            {children}
        </SocketContext.Provider>
    )

}

export { ContextProvider, SocketContext };

