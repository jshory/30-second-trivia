import React, { Component } from 'react';
import './Question.css';

class Question extends Component {
    constructor(props) {
        super(props);

        this.state = {
            question: "",
            correctAnswer: "",
            shuffledAnswers: [],
            unclickable: false,
            clicked: false,
            correctAnswerSelected: false,
            gameStarted: false,
            score: 0
        }

        this.fetchQuestion = this.fetchQuestion.bind(this);
    }

    componentDidMount() {
        this.fetchQuestion();
    }

    //to clear previous game's score
    static getDerivedStateFromProps(nextProps) {
        if (nextProps.time === 30) {
            // Question.fetchQuestion();
            return {
                score: 0,
                unclickable: false,
                clicked: false,
                correctAnswerSelected: false
            };
        } else {
            return null;
        }
    }

    //api call to retrieve question and 4 possible answers
    fetchQuestion() {
        this.setState({
            unclickable: false,
            clicked: false,
            correctAnswerSelected: false
        });

        fetch('https://opentdb.com/api.php?amount=1&type=multiple')
            .then(res => res.json())
            .then((data) => {
                this.setState({
                    question: this.decodeHtml(data.results[0].question),
                    correctAnswer: this.decodeHtml(data.results[0].correct_answer),
                    shuffledAnswers: this.shuffle([this.decodeHtml(data.results[0].correct_answer), this.decodeHtml(data.results[0].incorrect_answers[0]), this.decodeHtml(data.results[0].incorrect_answers[1]), this.decodeHtml(data.results[0].incorrect_answers[2])])
                });
            })
            .catch(console.log)
    }

    //to deal with special characters, from Open TDB api
    decodeHtml(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    //shuffle correct answer and incorrect answers
    shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        while (0 !== currentIndex) {

            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    //to be called on user click
    checkCorrectAnswer(answer) {
        if (this.state.correctAnswer === answer.item) {
            this.setState({
                unclickable: true,
                clicked: true,
                correctAnswerSelected: true,
                score: this.state.score + 1,
                gameStarted: true
            });
        } else {
            this.setState({
                unclickable: true,
                clicked: true,
                correctAnswerSelected: false,
                gameStarted: true
            });
        }
    }

    render() {
        return (
            <div className="question">
                {!this.props.status &&
                    <div>
                        <div className="question-line">
                            <h3 className="question-text">{this.state.question}</h3>
                        </div>

                        <div className="answers">
                            <ul>
                                {this.state.shuffledAnswers.map((item, i) => (
                                    <li className={this.state.unclickable ? 'noHover' : 'hover'}
                                        key={i}
                                        onClick={this.state.unclickable ? null : () => {
                                            this.checkCorrectAnswer({ item })
                                        }}>
                                        {item}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="footer">
                            <h3 className="score">Score: {this.state.score}</h3>
                            {this.state.clicked && <h3 className="answer-message">{this.state.correctAnswerSelected ? 'Correct!' : 'Not quite...'}</h3>}
                            <button className="next-button" onClick={this.fetchQuestion}>Next</button>
                        </div>
                    </div>
                }

                {this.props.status && this.state.gameStarted && <h1 className="final-score">Final Score: {this.state.score}</h1>}
            </div>
        );
    }
}

export default Question;