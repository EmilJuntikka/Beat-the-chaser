const clickedOption = async (index) => {
    console.log(counters)

      if (counters[index] === 4){
        return;
      }
      if (activeIndex === index) {
        setCounters((prevCounters) =>
          prevCounters.map((count, i) => (i === index ? count + 1 : count))
        );
      } else {
        // If a new div is clicked, decrement the previous active div's counter by 1
        if (activeIndex !== null) {
          setCounters((prevCounters) =>
            prevCounters.map((count, i) =>
              i === activeIndex ? count - 1 : count
            )
          );
        }
        // Set the new div as active and increment its counter
        setCounters((prevCounters) =>
          prevCounters.map((count, i) =>
            i === index && count < 1 ? count + 1 : count
          )
          
        );
        setActiveIndex(index); // Update the active index
      }
    };

    import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import { collection, getDocs, addDoc, onSnapshot, query, where, updateDoc, increment, doc} from "firebase/firestore";
import {db} from "../firebase-config";
import MultiplayerQuiz from './MultiplayerQuiz';

function CounterComponent(props) {
                  const {room} = props
                  const [counters, setCounters] = useState([]);
                  const [idOfVote, setIdOfVote] = useState([]);
                  const [activeIndex, setActiveIndex] = useState(null);
                  const [voted, setVoted] = useState("");
                  const votesCollectionRef = collection(db, "votes");
          
                      useEffect(() => {
                                    const queryVotes = query(votesCollectionRef, where("room", "==", room))
                                    const unsuscribe = onSnapshot(queryVotes, (snapshot) =>{
                                        let votes = []
                                        snapshot.forEach((doc) => {
                                            votes.push({...doc.data(), id: doc.id})
                                        });
                                        setIdOfVote(votes[0].id);
                                        const votesCounter = [votes[0].vote0,votes[0].vote1,votes[0].vote2,votes[0].vote3];
                                        setCounters(votesCounter);
                                        setVoted(localStorage.getItem("voted"));                        
                                    });
                                    return () => unsuscribe(); 
                                                               
                        }, []);
              return(
                  <>
                  <div className='vote-btn-container'>
                    <MultiplayerQuiz voteid={idOfVote}/>
                  {counters.map((count) => (
                    <>
                    <div className='vote-btn-container-item'>
                    <p>{count}</p>
                    </div>
                    </>
                          
                  ))}
                  </div>
                </>
            )
}
export default CounterComponent
                    useEffect(() => {
                      if (countdown <= 0){
                        clearInterval(timerid.current);
                        setCheckResults(true);
                        
                      }
                    }, [countdown]);
                    useEffect(() =>{
                      if (checkResults == true){
                        UpdateGameStateAfter(true);
                      const queryVotes = query(votesCollectionRef, where("room", "==", room))
                      onSnapshot(queryVotes, (snapshot) =>{
                          let array = []
                          snapshot.forEach((doc) => {
                              array.push({...doc.data(), id: doc.id})
                          });
                          setVotesArray(array[0].votes);                 
                      });
                      }
                    }, [checkResults])
                      useEffect(() => {
                        const queryVotes = query(votesCollectionRef, where("room", "==", room))
                        const cleanUp = onSnapshot(queryVotes, (snapshot) =>{
                            let votes = []
                            snapshot.forEach((doc) => {
                                votes.push({...doc.data(), id: doc.id})
                            });
                            idOfVote.current = votes[0].id;
                            console.log("thisran")        
                        });
                        return () => cleanUp();     
                    }, []);
