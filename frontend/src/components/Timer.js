import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer"
import './Timer.css'

// export function Timer() {
//     return (
//         <div
//             style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 margin: '20px'
//             }}
//         >
//             <CountdownCircleTimer
//                 isPlaying
//                 duration={30}
//                 colors={['#004777', '#F7B801', '#A30000', '#A30000']}
//                 colorsTime={[25, 15, 5, 0]}
//             >
//                 {({ remainingTime }) => remainingTime}
//             </CountdownCircleTimer>
//         </div>
//     )
// }


//https://stackoverflow.com/questions/40885923/countdown-timer-in-react
export class Timer extends React.Component {
    constructor() {
        super();
        this.state = { seconds: 30 };
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
    }

    componentDidMount() {
        console.log("start timer")
        this.startTimer()
    }

    startTimer() {
        if (this.timer === 0 && this.state.seconds > 0) {
            this.timer = setInterval(this.countDown, 1000);
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    countDown() {
        let seconds = this.state.seconds - 1;
        this.setState({
            seconds: seconds,
        });

        if (seconds === 0) {
            clearInterval(this.timer);
        }
    }

    render() {
        // https://spin.atomicobject.com/2018/11/08/countdown-timer-react-typescript/
        return (
            <div className="countdown-timer">
                <div className="countdown-timer__circle">
                    <svg>
                        <circle
                            r="75"
                            cx="150"
                            cy="150"
                            style={{
                                animation: `countdown-animation 30s linear`
                            }}
                        />
                    </svg>
                </div>
                <div className="countdown-timer__text">
                    {this.state.seconds}s
                </div>
            </div>
        );
    }
}