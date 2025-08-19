import React, { useState, useEffect, useRef, useContext} from 'react';
import { QuizContext } from '../Helpers/context';
import '../App.css';
import { collection, getDocs, addDoc, onSnapshot, query, where} from "firebase/firestore";
import {db} from "../firebase-config";
import MultiplayerQuiz from './MultiplayerQuiz';
import App from '../App';
import { RoomContext } from '../Helpers/context';
import button from '../sound/button-press.mp3'


function Lobby(){
    const { room, setRoom } = useContext(RoomContext);
    const { gameState, setGameState } = useContext(QuizContext);
    const [players, setPlayers] =  useState([])
    const [startQuiz, setStartQuiz] = useState("")
    const questionsCollectionRef = collection(db, "questions");

    const usersCollectionRef = collection(db, "users");
    const [test, setTest] = useState([])
    const startGameCollectionRef = collection(db, "startgame");
    const votesCollectionRef = collection(db, "votes");

    const currentCollectionRef = collection(db, "currentquestion");
        useEffect(() => {
            fetch('https://opentdb.com/api.php?amount=15')
            //https://webbkurs.ei.hv.se/~emju0004/response.json
            //
              .then((res) => {
                return res.json()
              })
              .then((data) => {
                setTest(data.results);                                           
              });
            const queryPlayers = query(usersCollectionRef, where("room", "==", room))
            onSnapshot(queryPlayers, (snapshot) =>{
                let players = []
                snapshot.forEach((doc) => {
                    players.push({...doc.data(), id: doc.id})
                });
                setPlayers(players[0].name);
            });
            const queryGame = query(startGameCollectionRef, where("room", "==", room))
            onSnapshot(queryGame, (snapshot) =>{
                let startQuiz = []
                snapshot.forEach((doc) => {
                    startQuiz.push({...doc.data(), id: doc.id})
                });
                setStartQuiz(startQuiz);
            });
        }, []);
              const sendQuestions = async () => {
                  await addDoc(questionsCollectionRef,{ room:room, questions: test});
              }

        const startQuizFetch = async () => {
            await addDoc(startGameCollectionRef, { room:room, gamestate: "start", firstquestion: "load"});
        }
        const votesCollection = async () => {
            await addDoc(votesCollectionRef, { room:room });
            await addDoc(currentCollectionRef, { room:room, number:0 , question: false});
            
        }
            const buttonSound= () => {
                const play = new Audio(button);
                play.play();
            }

        if(startQuiz == ""){
            return(
            <>
            <p className='welcome-room'>welcome to room:{room}</p>
            <div className='players-in-room'> {players.map((player) => <p>{player}</p>)}</div>
            <button className='btn-join btn' onClick={() => {
                  startQuizFetch();
                  sendQuestions();
                  votesCollection();
                  buttonSound();                        
                }}>START QUIZ</button>
            </>
        )}else if(startQuiz != ""){
            return (
                <>
                <MultiplayerQuiz room={room}/>
                </>
            )  
}
}
export default Lobby