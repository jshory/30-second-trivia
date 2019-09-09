import React from 'react';
import './App.css';
import Question from './Question';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timerOn: false,
      time: 0,
      displayQuestion: false,
      gameOver: true
    }
  }

  //set 30 second timer, subtract 1 sec. every second until timer reaches 0 and updates state
  startTimer = () => {
    this.setState({
      timerOn: true,
      time: 30,
      displayQuestion: true,
      gameOver: false
    });
    this.timer = setInterval(() => {
      const newTime = this.state.time - 1;
      if (newTime > 0) {
        this.setState({
          time: newTime
        });
      } else {
        clearInterval(this.timer);
        this.setState({ timerOn: false, displayQuestion: false, gameOver: true });
      }
    }, 1000);
  };

  render() {
    return (
      <div className="App">
        <div className="countdown">
          {this.state.timerOn === false &&
            <div>
              <h1>30-Second Trivia</h1>
              <button className="btn" onClick={this.startTimer}>Hit Me!</button>
            </div>
          }
          {this.state.displayQuestion && <h1>{this.state.time} seconds</h1>}
          <Question status={this.state.gameOver} time={this.state.time} />
        </div>
      </div>
    );
  }
}

export default App;
