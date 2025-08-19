import React, { useState, useEffect, useRef, useContext, useRunOnce} from 'react';
import { collection, getDocs, addDoc, onSnapshot, query, where, updateDoc, increment, doc, arrayUnion, setDoc, deleteDoc} from "firebase/firestore";
import {db} from "../firebase-config";
import '../App.css';
import { QuizContext } from '../Helpers/context';
function Victory(props){
    const { gameState, setGameState } = useContext(QuizContext);
        const {room}= props
        const [currentQuestionId,setCurrentQuestionId] = useState([])
        const questionsCollectionRef = collection(db, "questions");
        const [questionCollectionID,setQuestionCollectionID] = useState([])
    
        const currentCollectionRef = collection(db, "currentquestion");
        const [idOfVote, setIdOfVote] = useState([]);
        const votesCollectionRef = collection(db, "votes");
    
        const startGameCollectionRef = collection(db, "startgame");
        const [startGameId, setStartGameId] = useState([]);
    
        const usersCollectionRef = collection(db, "users");
        const [playersId,setPlayerId] = useState([])
        const [isMounted, setIsMounted] = useState(true)
     useEffect(() => {
      if(isMounted == true){
                  const queryPlayers = query(usersCollectionRef, where("room", "==", room))
                   onSnapshot(queryPlayers, (snapshot) =>{
                      let players = []
                      snapshot.forEach((doc) => {
                          players.push({...doc.data(), id: doc.id})
                      });
                      setPlayerId(players[0].id);
                  });
            const queryCurrent = query(currentCollectionRef, where("room", "==", room))
           onSnapshot(queryCurrent, (snapshot) =>{
           let currentQuestion = []
           snapshot.forEach((doc) => {
             currentQuestion.push({...doc.data(), id: doc.id})
             });
             setCurrentQuestionId(currentQuestion[0].id)               
           });
           const queryQuestion = query(questionsCollectionRef, where("room", "==", room))
           onSnapshot(queryQuestion, (snapshot) =>{
           let questions = []
           snapshot.forEach((doc) => {
           questions.push({...doc.data(), id: doc.id})
             });
               const data = questions
               setQuestionCollectionID(data[0].id) 
             });
              const queryGame = query(startGameCollectionRef, where("room", "==", room))
              onSnapshot(queryGame, (snapshot) =>{
                let startQuiz = []
                snapshot.forEach((doc) => {
                    startQuiz.push({...doc.data(), id: doc.id})
                });
                setStartGameId(startQuiz[0].id);
            });
        const queryVotes = query(votesCollectionRef, where("room", "==", room))
            const unsuscribe = onSnapshot(queryVotes, (snapshot) =>{
            let votes = []
            snapshot.forEach((doc) => {
                votes.push({...doc.data(), id: doc.id})
            });
            setIdOfVote(votes[0].id);            
          });
          return () => unsuscribe();
        }
        setIsMounted(false);
      },[]);
    useEffect(()=>{
                 const deleteData = async () =>{
                  await deleteDoc(doc(db, "questions", questionCollectionID));
                  await deleteDoc(doc(db, "currentquestion", currentQuestionId));
                  await deleteDoc(doc(db, "votes", idOfVote));
                  await deleteDoc(doc(db, "startgame", startGameId));
                  await deleteDoc(doc(db, "users", playersId));
                }
                deleteData();
                console.log("rendered")
    },[idOfVote])
    return(
        <>
        <div><h1>VICTORY!!!</h1></div>
        <button className='btn btn-start' onClick={()=>{setGameState("menu")}}>PLAY AGAIN</button>
        </>
    )
}
export default Victory