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

            let newPeer = new Peer({ initiator: true, trickle: false, stream });

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

    const handleExit = () => {
        leaveCall()
        setWaitingCall(false)
        endCall()
        if (stream) {
            terminateWebcam()
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
            setInCall(false);
            setCallSignal(null)
            await peerRef.current.destroy()
        }
    }

    const terminateWebcam = async () => {
        await stream.getTracks().forEach(async (track) => {
            await track.stop();
        });
        setVideoOn(false);
        setAudioOn(false);
        setStream(null)
    }

    const initiateWebcam = () => {
        navigator.mediaDevices.enumerateDevices().then(async (devices) => {
            let videoDevices = devices.filter(device => device.kind === "videoinput")
            for (const device of videoDevices) {
                let isVideoAvailable = await navigator.mediaDevices.getUserMedia({
                    video: {
                        deviceId: { exact: device.deviceId }
                    },
                    audio: true
                }).then((currentStream) => {
                    myVideo.current.srcObject = currentStream;
                    setStream(currentStream);
                    return true
                }).catch(error => {
                    return false
                })
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
        if (stream !== null) {
            stream.getTracks().forEach(function (track) {
                if (track.readyState === "live" && track.kind === "video") {
                    track.enabled = !videoOn;
                    setVideoOn(!videoOn);
                }
            })
        };
    }

    const toggleAudio = () => {
        if (stream !== null) {
            stream.getAudioTracks().forEach(function (track) {
                if (track.readyState === "live" &&
                    track.kind === "audio") {
                    track.enabled = !audioOn;
                    setAudioOn(!audioOn);
                }
            });
        }
    }

    return (
        <SocketContext.Provider
            value={{
                callSignal, peerName, inCall, myVideo, peerVideo, stream, waitingCall,
                callUser, leaveCall, answerCall, toggleVideo, videoOn, toggleAudio,
                audioOn, setSocket, initiateWebcam, handleExit, rejectCall
            }}
        >
            {children}
        </SocketContext.Provider>
    )

}

export { ContextProvider, SocketContext };

