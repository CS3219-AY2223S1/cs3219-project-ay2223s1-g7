import React from "react";


// https://stackoverflow.com/questions/40885923/countdown-timer-in-react
export class Timer extends React.Component {
    constructor() {
        super();
        this.state = {seconds: 30};
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
        return (
            <div>
                s: {this.state.seconds}
            </div>
        );
    }
}
