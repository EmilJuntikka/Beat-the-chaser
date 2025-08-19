import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import { collection, getDocs, addDoc, onSnapshot, query, where, updateDoc, increment, doc} from "firebase/firestore";
import {db} from "../firebase-config";

function CounterComponent(props) {
                  const [votes, setVotes] = useState([]);
                  const [idOfVote, setIdOfVote] = useState([]);
                  const votesCollectionRef = collection(db, "votes");
          
                      useEffect(() => {
                                    const queryVotes = query(votesCollectionRef, where("room", "==", room))
                                    const unsuscribe = onSnapshot(queryVotes, (snapshot) =>{
                                        let votes = []
                                        snapshot.forEach((doc) => {
                                            votes.push({...doc.data(), id: doc.id})
                                        });
                                        setIdOfVote(votes[0].id);;
                                        setVotes(votes[0].votes);                    
                                    });
                                    return () => unsuscribe(); 
                                                               
                        }, []);
              return(
                  <>
                  <div className='vote-btn-container'>
                  {counters.map((count, index) => (
                    <>
                    <div className='vote-btn-container-item'>
                      <div id='vote-btn'>
                    <button
                      key={index}
                      onClick={() => {updateVote(idOfVote,index); }}
                    >
                      Vote 
                    </button>
                    </div>
                    <p>{count}</p>
                    </div>
                    </>
                          
                  ))}
                  </div>
                </>
            )
}
export default CounterComponent
