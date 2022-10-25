import React, {createContext, useState, useRef, useEffect}  from "react";
import {io} from 'socket.io-client';
import Peer from 'simple-peer';

const  SocketContext = createContext();

const socket = io ('http://localhost:8004');

const ContextProvider = ({ children }) => {
    const [stream, setStream] = useState(null);
    const [me, setMe] = useState("");
    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState("");

    const [videoInitialized, setInitialized] = useState(false);

    const [videoSetting, setVideo] = useState(false);
    const [audioSetting, setAudio] = useState(false);


    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {
        socket.on('me', (id) => setMe(id));
        socket.on('calluser', ({from, name: callerName, signal}) => {
            console.log("HELLO");
            setCall({ isReceivingCall: true, from, name: callerName, signal})
        });
        socket.on('callended', () => {
            console.log("BYEBYE");
            setCallEnded(true);
            connectionRef.current.destroy();
            window.location.reload();
        
        });

    }, [])

    const answerCall = () => {
        if(!videoInitialized) {
            alert("Please turn on your video feed first!");
        } 
        else {
            setCallAccepted(true);

            const peer = new Peer({initiator: false, trickle: false, stream });

            peer.on('signal', (data) => {
                socket.emit('answercall', {signal: data, to: call.from});
            });

            // Sometimes returns undefined for currentStream and causes one side to have no video 
            peer.on('stream', (currentStream) => {
                userVideo.current.srcObject = currentStream;

            });

            peer.signal(call.signal);
            connectionRef.current = peer;
        }

    }
    const callUser = (id) => 
    {
        if(!videoInitialized) {
            alert("Please turn on your video feed first!");
        } 
        
        else{
            console.log(name);
                const peer = new Peer({initiator: true, trickle: false, stream});

                peer.on('signal', (data) => {
                    socket.emit('calluser', {userToCall: id, signalData: data, from: me, name});
                });

                // Sometimes returns undefined for currentStream and causes one side to have no video 
                peer.on('stream', (currentStream) => {
                    userVideo.current.srcObject = currentStream;
                    
                });

                socket.on('callaccepted', (signal) => {
                    setCallAccepted(true);
                    peer.signal(signal);

                })
                connectionRef.current = peer;
        }
    }

    const leaveCall = () => {
        if(callAccepted) {
            socket.disconnect();
            setCallEnded(true);
            connectionRef.current.destroy();
            window.location.reload();
        }
    }


    const toggleVideo = () => {
        if(!videoInitialized) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true})
            .then((currentStream) => {
                setStream(currentStream);
                myVideo.current.srcObject = currentStream;
            });
            setInitialized(true);  
        }
        else {
            setVideo(!videoSetting);
            myVideo.current.srcObject.getVideoTracks()[0].enabled = videoSetting;
        }
    }

    const toggleAudio = () => {
        setAudio(!audioSetting);
        myVideo.current.srcObject.getAudioTracks()[0].enabled = audioSetting;
    }

    return (
        <SocketContext.Provider value= {{ call, callAccepted, myVideo, userVideo, stream, name, setName, callEnded, me, callUser, leaveCall, answerCall, toggleVideo, videoSetting, toggleAudio, audioSetting, videoInitialized}}>
            {children}
        </SocketContext.Provider>
    )

}

export {ContextProvider, SocketContext};

