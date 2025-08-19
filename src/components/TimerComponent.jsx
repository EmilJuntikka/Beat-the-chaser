import React, { useState, useEffect, useRef, forceUpdate, useContext, unsubscribe} from 'react';
import '../App.css';
import { collection, getDocs, addDoc, onSnapshot, query, where, updateDoc, increment, doc, arrayUnion, setDoc} from "firebase/firestore";
import {db} from "../firebase-config";
  
  function TimerComponent(props){
    const {id} = props
    const votesCollectionRef = collection(db, "votes");
    function Timer(){
                  const [countdown,setCountdown] = useState(30)
                  const timerid = useRef()
                  const [checkResults, setCheckResults] = useState(false) 
                  useEffect(() => {
                      timerid.current = setInterval(() =>{
                        setCountdown(prev => prev - 1)
                      },1000)
                      return () => clearInterval(timerid.current)
                    }, [])
                    useEffect(() => {
                      if (countdown <= 0){
                        clearInterval(timerid.current);
                        setCheckResults(true);
                        UpdateGameStateAfter(true, id);
                      }                     
                    }, [countdown]);
                    return(
                  <>
                  <div className='timer'>
                      <div className='timer-bar'></div>
                      <p id='countdown'>{countdown}</p>
                  </div>      
                </>
            );
}
                    const UpdateGameStateAfter = async (value, id) =>{
                    const voteDoc = doc(db, "currentquestion", id)
                    const updateVote = {question: value}
                    await updateDoc(voteDoc, updateVote);
                    }
                    return(
                        <>
                        <Timer/>
                        </>
                    )

};
export default TimerComponent