import { useState, useContext, useRef, useEffect} from 'react';
import './App.css';
import MainMenu from './components/MainMenu';
import EndScreen from './components/EndScreen';
import Multiplayer from './components/Multiplayer';
import MultiplayerQuiz from './components/MultiplayerQuiz';
import Lobby from './components/Lobby';
import bgsound from './sound/bg-sound.mp3'
import mute from './images/mute.png'
import Victory from './components/Victory';
import Info from './components/Info';

import { QuizContext } from './Helpers/context';
import { RoomContext } from './Helpers/context';



function App() {
  const [gameState, setGameState] = useState("menu");
  const [room, setRoom] = useState([]);
  const [question, setQuestion] = useState([]);
  const [current, setCurrent] = useState([]);
  const [voteId,setVoteId] = useState([]);
  const [gameId,setGameId] = useState([]);
  const [playerId, setPlayerId] = useState([]);
  const mute = useRef([false])
  const image = useRef([false])

  

const MuteUnmute = () => {
  if (mute.current == false){
    document.getElementById('music-player').pause();
    document.getElementById("mute").src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAAXNSR0IArs4c6QAAA/FJREFUaEPtmu15WjEMhe1J2kzSZJNmkiaTNJmk6STNJi7i8eUx9pF05HshCcAffuCv10eWZJmcruyTr4w33YAvXfGbwkjhUsr3nPP7JajvKlxK+Z1Suk8pPVwCtAlcYX9WZUXhTaFLKbKRP3bj/s05vynWda/9NmNxKnAHu4y9GXQp5U+1nGXsp5zzcw9RSim7drIZj1tYGASWM7vbeVmQfPefVdBVVRm7/7zlnB8U4MOmpJRe14BbCm8ODVQ94tspPKynKty2W7Xh3hneBNpQdQZ46SMm/hI9x4yXXgXtqdouWFH4n3K0pCs899YmuMDSeeZMs6p6wHV+CY1LtOh5QtAUcBQ6oioDXOf/VaGRI6XNmwYmoSWsiBrWZ++NgTNKyKTbgarVyPgI+o7x3iFgAtrzIZK47BOMGeBG6ScwEeW9w8CT0EOMZYFRHr/rK+aNoN3z7MVhMR+Y4TiOrBXgoGpnnpJBMWFJvPSQ0pZSNO9tmraVaS2XBlkUHISAVicPKCwbMyhnzG2qrAEjk5mBVs9VEFg2ffDEhmmrG60Bh8xlMk6zJr2003JttFY1TGnAw2IWJ4FuNIQjG5SeUFhTGSUlcHNkABrYi5FR6Elg5O3lTo1uX9CsNwWOQE8CQweqeGxo1psDs9ApJTl7TFjqjxdyXsisX3LOj8McKDVid99KqwhHNqSH5H14ACmlyMWiT2nhOT6JwstGEHF6RmF0jj8HMGHeM8DvOee7LmtDjmtot7mX1kycVZo0aXirYo/hSU26U8GqnOybksBQOVT76i3hbAoHzvQQOxmQakG91/84kw4ozWRkyEuL9fTA5/fSk2f6CBoojG5On8dLr4UmgdHtDl4Tz+a0lATHLQH3phoo5cLCw4cCE3FazLvNyLRCAJWmWl4a3TFRDakVTn0BtFJQArrtjrw4MmfooaPA3rrld3n6eGbKpf1gRHLCxl8ZWi3zREo8DLC0ETMU6PC7D3HhOCrmKSUeVV1V4Wpm1psOA2+qrf2NgoVWkg1TXQ9YnEVbuWQg+zaq2jXcTBcGlbWZ6prATTooNxGB/2YQS+BHzx9Ll0HtJr7OQqP55gvxETmreS2PXVrXI7W7hGIGup9HLdy1DaeeWozsSZQWcFdtkPuugXZNeVnzpsBNTGXUpko8ZJw+zXNp0MwZtY+GtErBrPf21ri5wu2E5Nk+dPFq31tAnxS48fSU2h4wYd7uG/FZgNmzzQCvhT4bMKE27WkZaFTPohIPzwnM/K6cbdrTNpun3adjr4czEDN96p9UZNGiLvxzqTcucGTmxp3dpD2Amd8baPeWdhHAkU26AUd26yu2vSn8FVWLrPnqFP4P9y0ValF1pf8AAAAASUVORK5CYII=";
  }else{
    document.getElementById('music-player').play();
    document.getElementById("mute").src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAAXNSR0IArs4c6QAAA19JREFUaEPtmm1a7CAMhWElXneiK/G6kqsrUVeiO1FXwp0zD52HlpMQ6IfSaX/aMvJykpAEvLuyx18ZrzuA9674ofCh8M5W4EdNOoTwxzl355z78t5/sLUNIdxJ71q0+BHgCPoSYYd5P3nvn6cQIYRw+g6L8ei9/2qBTMdsDgzFnHPvZOJQ+VYAviyKc+5tDvhmwIKqI76Twtl8osLpd1D5vhV6E2BF1RbgYQxM/LXWxFcFtqg68i+u8KdzDsGNPdTvtUVYDdiqagkY70MICHB/l4BeHNioKvwwU4358AB58uV/EZqpbTbvRYGNqn547+9JMHIacFQaER5qM+hbSyBbBLhCVShxTjBagOM4KP3EtjVL9C4CR5iHQjRkE0iHnFVN/2AFxv+fKhfNm/3PYhATgY2qlXYF+OpF1UbgTyEhkaK3atoaMLIh+Ezrk6naCIzU8tV7/zgZDz/GHKf+rKpMgQvbQGkBRFVnAGMosqtRgaGYtqiyBKxt9hqwqupMYCnXZnMVtykJGGY0fUqBqSqprwha6VyYyiwpERfeDFzaI0t2Pn3fCMyivVR9UbPuDXi2WfcGLAUvZtZZZMfgHoHZFoXCAtBqstMrMPPjXQNnfiwULdTfezRpS+/rbNpsZ+kROAOJeT8SkNGzF2Bm0sinp8C7MWlr0NoNMNuWWFOAppc9+nBWGAhVEy0TewTOcuQQAquYskKjx8RDagSYInQV8OljrTz81k4AWSXVWC1ZmwA0YGnAre0dHH08W9qlDcAsOrPtCFxim0fyYZabWktetHhgetnR58yOh1Vdtb8tAUsNMis0vlPVrlR4EXVFk8aLBdu0VO0K4PdpTzvOj7pdqTNjbcSjjXKjyAsXkE74qNpWYCHgSacP7Y34GttNTie0SD7y7Vbg2hsEWUFRA1b6NoQApbH6RbVJsm89TGPXJTA1mmisCpz4Ps6iSmq3HJdKv2mCVYNWSc3Se6PaxfpVC1BxsPlseFXgCrUv0MKlFi0JqoJdHXggsaptvMUz/KzZjFMzKm5LJdO1vrdEciOw6bBOmtdmwBa1DcC0uW5d9M1MejohQW3qj8nVQxQl9D7mrwdO1B4ulyJXpvcod3G5tEaRpb/d3IeXBqj9vQO4dsV6+/5QuDfFaud7dQr/ByhRrlu1KAkJAAAAAElFTkSuQmCC";
  }
}
  return (
    <div className='screen'>
      <audio id='music-player' controls src={bgsound} className='audio-player'>
    </audio>
    <h1>BEAT THE CHASER</h1>
    <img className='mute' id='mute' onClick={()=> {MuteUnmute(); mute.current = (!mute.current);}} src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAAXNSR0IArs4c6QAAA/FJREFUaEPtmu15WjEMhe1J2kzSZJNmkiaTNJmk6STNJi7i8eUx9pF05HshCcAffuCv10eWZJmcruyTr4w33YAvXfGbwkjhUsr3nPP7JajvKlxK+Z1Suk8pPVwCtAlcYX9WZUXhTaFLKbKRP3bj/s05vynWda/9NmNxKnAHu4y9GXQp5U+1nGXsp5zzcw9RSim7drIZj1tYGASWM7vbeVmQfPefVdBVVRm7/7zlnB8U4MOmpJRe14BbCm8ODVQ94tspPKynKty2W7Xh3hneBNpQdQZ46SMm/hI9x4yXXgXtqdouWFH4n3K0pCs899YmuMDSeeZMs6p6wHV+CY1LtOh5QtAUcBQ6oioDXOf/VaGRI6XNmwYmoSWsiBrWZ++NgTNKyKTbgarVyPgI+o7x3iFgAtrzIZK47BOMGeBG6ScwEeW9w8CT0EOMZYFRHr/rK+aNoN3z7MVhMR+Y4TiOrBXgoGpnnpJBMWFJvPSQ0pZSNO9tmraVaS2XBlkUHISAVicPKCwbMyhnzG2qrAEjk5mBVs9VEFg2ffDEhmmrG60Bh8xlMk6zJr2003JttFY1TGnAw2IWJ4FuNIQjG5SeUFhTGSUlcHNkABrYi5FR6Elg5O3lTo1uX9CsNwWOQE8CQweqeGxo1psDs9ApJTl7TFjqjxdyXsisX3LOj8McKDVid99KqwhHNqSH5H14ACmlyMWiT2nhOT6JwstGEHF6RmF0jj8HMGHeM8DvOee7LmtDjmtot7mX1kycVZo0aXirYo/hSU26U8GqnOybksBQOVT76i3hbAoHzvQQOxmQakG91/84kw4ozWRkyEuL9fTA5/fSk2f6CBoojG5On8dLr4UmgdHtDl4Tz+a0lATHLQH3phoo5cLCw4cCE3FazLvNyLRCAJWmWl4a3TFRDakVTn0BtFJQArrtjrw4MmfooaPA3rrld3n6eGbKpf1gRHLCxl8ZWi3zREo8DLC0ETMU6PC7D3HhOCrmKSUeVV1V4Wpm1psOA2+qrf2NgoVWkg1TXQ9YnEVbuWQg+zaq2jXcTBcGlbWZ6prATTooNxGB/2YQS+BHzx9Ll0HtJr7OQqP55gvxETmreS2PXVrXI7W7hGIGup9HLdy1DaeeWozsSZQWcFdtkPuugXZNeVnzpsBNTGXUpko8ZJw+zXNp0MwZtY+GtErBrPf21ri5wu2E5Nk+dPFq31tAnxS48fSU2h4wYd7uG/FZgNmzzQCvhT4bMKE27WkZaFTPohIPzwnM/K6cbdrTNpun3adjr4czEDN96p9UZNGiLvxzqTcucGTmxp3dpD2Amd8baPeWdhHAkU26AUd26yu2vSn8FVWLrPnqFP4P9y0ValF1pf8AAAAASUVORK5CYII='/>
    <div className="homescreen">
      <QuizContext.Provider value={{gameState, setGameState}}>
      {gameState === "menu" && <MainMenu/>}
      {gameState === "Info" && <Info/>}
      <RoomContext.Provider value={{room, setRoom}}>
      {gameState === "multiplayer" &&<Multiplayer/>}
      {gameState === "lobby" && <Lobby/>}
      </RoomContext.Provider>
      {gameState === "endScreen" && <EndScreen room={room}/>}
      {gameState === "victory" && <Victory room={room}/>}
      </QuizContext.Provider>
    </div>
    </div>
  )
}

export default App
