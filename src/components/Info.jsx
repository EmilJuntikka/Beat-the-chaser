import React, { useContext } from 'react';
import { QuizContext } from '../Helpers/context';
import '../App.css';
import button from '../sound/button-press.mp3'
import image from '../images/info.png'


function Info(){
    const { gameState, setGameState } = useContext(QuizContext);

    function buttonSound() {
        const play = new Audio(button);
        play.play();
    }
    return(
    <div className='menu'>
        <h2>INFO</h2>
        <div className='information'>
        <p className='paragraph'>Beat the game by reaching the top before the chaser (<span className='red'>red</span>) catches you (<span className='green'>green</span>)</p>
        <img src={image} alt="" className='image'/>
        <h4>HOW TO SCORE POINTS:</h4>
        <p className='paragraph'>You take a step everytime you guess the question right.</p>
        <p className='paragraph'>The chaser might take a step: <br /> If the question is easy the chaser has a 90% chance to take a step. <br />
        If the question is medium the chaser has a 70% chance to take a step. <br />
        On hard questions the chaser has a 50/50 chance to take a step.</p>
      </div>
        <button class="btn-multi btn" onClick={() =>{
            setGameState("menu");
            buttonSound();
        }}>GO BACK</button>
    </div>
)
}
export default Info;
