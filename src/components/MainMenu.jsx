import React, { useContext } from 'react';
import { QuizContext } from '../Helpers/context';
import '../App.css';
import Multiplayer from './Multiplayer';
import button from '../sound/button-press.mp3'


function MainMenu(){
    const { gameState, setGameState } = useContext(QuizContext);

    function buttonSound() {
        const play = new Audio(button);
        play.play();
    }
    return(
    <div className='menu'>
        <h2>MAIN MENU</h2>
        <button class="btn-start btn" onClick={() =>{
            setGameState("Info");
        }}>Info</button>
        <button class="btn-multi btn" onClick={() =>{
            setGameState("multiplayer");
            buttonSound();
        }}>create/join</button>
    </div>
)
}
export default MainMenu;
