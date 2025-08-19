import React, { useState, useEffect, useRef, forceUpdate, useContext, unsubscribe} from 'react';
import '../App.css';
import { collection, getDocs, addDoc, onSnapshot, query, where, updateDoc, increment, doc, arrayUnion, setDoc, deleteDoc} from "firebase/firestore";
import {db} from "../firebase-config";
import TimerComponent from './TimerComponent';
import { QuizContext } from '../Helpers/context';
import button from '../sound/button-press.mp3'


function MultiplayerQuiz(props){


    const {room} = props
    const { gameState, setGameState } = useContext(QuizContext);
    const [response, setResponse] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState([])
    const currentQuestionId = useRef([])
    const [correctAnswer, setCorrectAnswer] = useState([])
    const [allAnswers,setAllAnswers] = useState([])
    const [category, setCategory] = useState([])
    const [difficulty, setDifficulty] = useState ([])


    const loadfirstQuestion = useRef("");
    const [questionState,setQuestionState] = useState([]);

    

    const questionsCollectionRef = collection(db, "questions");
    const questionCollectionID = useRef([])

    const currentCollectionRef = collection(db, "currentquestion");
    const answersNameArray = useRef([]);
    const answersArray = useRef([]);
    const votesArray = useRef([]);
    const chaserMoved = useRef([]);
    const idOfVote = useRef([]);
    const votesCollectionRef = collection(db, "votes");

    const startGameCollectionRef = collection(db, "startgame");
    const [startGameId, setStartGameId] = useState([]);

    const usersCollectionRef = collection(db, "users");
    const playersId = useRef([])

    const votes = useRef(1)
    const voteClick = useRef(true)
    const [checkVotes, setCheckVotes] = useState(false)
    const stepsBox = useRef(["steps-box", "steps-box", "steps-box", "steps-box", "steps-box","steps-box", "player-box" , "steps-box", "steps-box", "chaser-box"])
    const playerSteps = useRef(6);
    const computerSteps = useRef(9);

          useEffect(() => {
              const queryPlayers = query(usersCollectionRef, where("room", "==", room))
              onSnapshot(queryPlayers, (snapshot) =>{
                  let players = []
                  snapshot.forEach((doc) => {
                      players.push({...doc.data(), id: doc.id})
                  });
                  playersId.current = players[0].id;
              });      
          }, []);
      useEffect(() => {
        const queryCurrent = query(currentCollectionRef, where("room", "==", room))
        onSnapshot(queryCurrent, (snapshot) =>{
       let currentQuestion = []
       snapshot.forEach((doc) => {
         currentQuestion.push({...doc.data(), id: doc.id})
         });
         setCurrentQuestion(currentQuestion[0].number);
         currentQuestionId.current = currentQuestion[0].id
         setQuestionState(currentQuestion[0].question)                    
       });
       const queryPlayers = query(questionsCollectionRef, where("room", "==", room))
       onSnapshot(queryPlayers, (snapshot) =>{
       let questions = []
       snapshot.forEach((doc) => {
       questions.push({...doc.data(), id: doc.id})
         });
           const data = questions
           questionCollectionID.current = data[0].id
           const answers = data[0].questions[currentQuestion].incorrect_answers;
           const correct = data[0].questions[currentQuestion].correct_answer;
           setAllAnswers(data[0].questions[currentQuestion].incorrect_answers);
           setCorrectAnswer(data[0].questions[currentQuestion].correct_answer);
           setCategory((data[0].questions[currentQuestion].category).replace(/&amp;/g, '&')
           .replace(/&lt;/g, '<')
           .replace(/&gt;/g, '>')
           .replace(/&quot;/g, '"')
           .replace(/&#39;/g, "'"));
           setDifficulty(data[0].questions[currentQuestion].difficulty);
           setResponse((data[0].questions[currentQuestion].question).replace(/&amp;/g, '&')
           .replace(/&lt;/g, '<')
           .replace(/&gt;/g, '>')
           .replace(/&quot;/g, '"')
           .replace(/&#39;/g, "'"));
          const random = () => {
          answers.splice(Math.floor(Math.random() * (answers.length + 1)),0,correct);
          setAllAnswers(answers);
          }
          random();
         });
          const queryGame = query(startGameCollectionRef, where("room", "==", room))
          onSnapshot(queryGame, (snapshot) =>{
            let startQuiz = []
            snapshot.forEach((doc) => {
                startQuiz.push({...doc.data(), id: doc.id})
            });
            setStartGameId(startQuiz[0].id);
            loadfirstQuestion.current = startQuiz[0].firstquestion
        });
        const queryPlayerVotes = query(votesCollectionRef, where("room", "==", room))
        onSnapshot(queryPlayerVotes, (snapshot) =>{
        let array = []
        snapshot.forEach((doc) => {
        array.push({...doc.data(), id: doc.id})
        });
        votesArray.current = array[0].votes;
        chaserMoved.current = array[0].chaser;
        answersNameArray.current = (Object.getOwnPropertyNames(array[0].votes))
        answersArray.current = (Object.values(array[0].votes))

        });
        console.log("this function ran")
      },[currentQuestion])

  useEffect(() => {
    const queryVotes = query(votesCollectionRef, where("room", "==", room))
        onSnapshot(queryVotes, (snapshot) =>{
        let votes = []
        snapshot.forEach((doc) => {
            votes.push({...doc.data(), id: doc.id})
        });
        idOfVote.current = votes[0].id;            
      });
      
  },[]);
        const buttonSound= () => {
            const play = new Audio(button);
            play.play();
        }

          const updateGamestate = async (id) =>{
            const voteDoc = doc(db, "currentquestion", id)
            const array = "number"
            const updateVote = {[array]: increment(1), question: false}
            await updateDoc(voteDoc, updateVote);
            const addState =  doc(db, "startgame" , startGameId)
            await updateDoc(addState, {firstquestion: "load"});           
          }

          const updateVote = async (id,value) => {

            if(value.length == 4){
          const addRef = doc(db, "votes" , id)
          await updateDoc(addRef, {votes:{[value[0]]: 0, [value[1]]: 0,[value[2]]: 0,[value[3]]: 0 }, chaser: false});
          }else{
            const addRef = doc(db, "votes" , id)
            await updateDoc(addRef, {votes:{[value[0]]: 0, [value[1]]: 0}, chaser: false});
          }
          const addState =  doc(db, "startgame" , startGameId)
          await updateDoc(addState, {firstquestion: "start"});   
          };           
            const vote = async (option,id) => {            
            const addRef = doc(db, "votes" , id)
            const updatevote = "votes."+[option];
            await updateDoc(addRef, {[updatevote]: increment(votes.current)});         
            votes.current = 0;
            console.log(votes.current)
          };
          const moved = async (id) => {
            const addRef = doc(db, "votes" , id)
            await updateDoc(addRef, {chaser: true});
          };
          const incVoteTo = () =>{
            votes.current = 1;
            console.log(votes.current)
            return votes.current
          }
          const changeColor = (id) =>{
            if(voteClick.current == true){
            const color = document.getElementById(id);
            color.style.background = "background: rgb(16,147,4)";
            color.style.background = "linear-gradient(45deg, rgba(16,147,4,1) 0%, rgba(4,152,153,1) 100%)";
            }
            voteClick.current = false
          }


    const checkAnswer = (data) =>{
      let votesList = []; //The list we're gonna push the values to and then get the maximum out of it
      for (const key in data) { //Looping through
        if (data.hasOwnProperty(key)) { //Check if key exists in the object (optional)
          const element = data[key]; //Get the value of that key and assign it to a variable
          votesList.push(element); //Push that to the array
        }
      }
      const max = Math.max(...votesList); //Find the maximum value in the array(array will contain only values of the object)
      return max; //Returning it
    }
    function getKeyByValue(object, value) {
    for (let prop in object) {
        if (object.hasOwnProperty(prop)) {
            if (object[prop] === value)
                return prop;
        }
    }
}
if(computerSteps.current == playerSteps.current){   
    setGameState("endScreen")
}
if(playerSteps.current === 0){
    setGameState("victory")  
}

 const computerChanceSteps = () =>{
  if(checkVotes == true){
   const temp = stepsBox.current
  let pct = 0;
    if (difficulty === "hard") {
    pct = 0.5;
  }else if (difficulty === "medium") {
    pct = 0.7;
  }else{
    pct = 0.9;
  }
  var rand = Math.random();
  if (rand < pct) {
    moved(idOfVote.current);
    console.log("succes");
    } else {
    console.log("Failure. :(");
  } 

}
}
function ChaserTookStep(){
  if(chaserMoved.current == true){
    return(
      <>
      <p>Chaser took a step!</p>
      </>
  )
  }else{
    return(
      <>
      <p>Lucky you the chaser failed to take a step!</p>
      </>
    )
  }
}

const chaserCanMove = () =>{


  if(chaserMoved.current == true){

    const indexFrom = computerSteps.current; // Index of element to move
    const indexTo = computerSteps.current -1; // New index for the element

    let temp = stepsBox.current;
    
    [temp[indexFrom], temp[indexTo]] = [temp[indexTo], temp[indexFrom]]; 
    
    computerSteps.current = computerSteps.current -1;
    stepsBox.current = temp
 
}

  return computerSteps.current;
}
const ans = getKeyByValue(votesArray.current, checkAnswer(votesArray.current));

function CalcPlayerMoves(){
  incVoteTo();
  if(ans === correctAnswer){

    const indexFrom = playerSteps.current; // Index of element to move
    const indexTo = playerSteps.current -1; // New index for the element
    
    [stepsBox.current[indexFrom], stepsBox.current[indexTo]] = [stepsBox.current[indexTo], stepsBox.current[indexFrom]]; 
    playerSteps.current = indexTo;
}

  return(
    <>
    {stepsBox.current.map((value, index) => (
      <div className={value} key={index}>  
      </div>     
    ))}
    </>
  )
}

function CalcVotesArray(){
  return(
    <>
    <div className='flex-container'>

    <div className='flex'>
    {answersNameArray.current.map((value, index) => (
      <div className="answers-array" key={index} id={value}>
        <p>{index +1}. {value}</p>  
      </div>     
    ))}
    </div>
    <div className='flex'>
    {answersArray.current.map((value, index) => (
      <div className={value} key={index}>
        <p>Votes: {value}</p>  
      </div>     
    ))}
    </div>
    </div>
    </>
  )
}
    function Render(){
      if(loadfirstQuestion.current == "load"){  
        voteClick.current = true;
    return(
      <div className='Quiz'>
      <>
      <div className='quiz-header'>
      </div>    
      <div className='container'>
        <p className='difficulty'>next Question is {difficulty}</p>
       </div>
      <button className='btn btn-start' onClick={() => {updateVote(idOfVote.current,allAnswers);buttonSound();computerChanceSteps()}}>QUESTION:{currentQuestion + 1}</button>
      </>   
    </div>
    )
  }else if(questionState == false && loadfirstQuestion.current == "start"){
    return(
      <>
    <div className='Quiz'>  
      <div className='quiz-header'>
        <p className='category'>{category}</p>
        <p>Difficulty:{difficulty}</p>
      </div>
        <p className='response'>{response}</p>     
        <div className='container'>
          <div className='choices-container'>
            
            {allAnswers.map((option, index) => (
              <div className='choices' id={option} key={index} onClick={() => {vote(option,idOfVote.current); buttonSound();changeColor(option)}}>  
                <p>{index + 1}.{option}</p>
              </div>     
            ))}
        </div>
      </div>
      <TimerComponent id={currentQuestionId.current}/>   
    </div>
    </>
  );
}else{
  chaserCanMove();
  setCheckVotes(true)
  return (
  <div className='Quiz'>
  <>
  <div className='quiz-header'>
  <ChaserTookStep/>  
  </div>    
  <div className='container-steps'>
  
  <div className='votes-container'>
    <p className='Correct'>Correct Answer :{correctAnswer}</p>
    <p>Your Answer:{ans} </p>
    <CalcVotesArray />
  </div>
  <div className='player-steps-container'>
    <CalcPlayerMoves/>
  </div>
   </div>
  <button className='btn btn-start' onClick={() => {updateGamestate(currentQuestionId.current);votes.current = 1;buttonSound();}}>NEXT</button>
  </>   
</div>
)
}
}
return(
  <>
  <Render />
  </>
)


}
export default MultiplayerQuiz