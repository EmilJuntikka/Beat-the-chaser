import React, { useState, useEffect, useRef, useContext} from 'react';

import '../App.css';
import { collection, getDocs, addDoc, onSnapshot, query, where, doc, updateDoc, arrayUnion} from "firebase/firestore";
import {db} from "../firebase-config";
import Lobby from './Lobby';
import App from '../App';
import { QuizContext } from '../Helpers/context';
import { RoomContext } from '../Helpers/context';
import button from '../sound/button-press.mp3'

function Multiplayer(){
    const { room, setRoom } = useContext(RoomContext);
    const { gameState, setGameState } = useContext(QuizContext);
    const [roomId, setRoomId] = useState([]);
    const [newRoom, setNewRoom] = useState([]);
    const [newName, setNewName] = useState("");
    const [startGame, SetStartGame] = useState(0);
    const [players, setPlayers] =  useState([])
    const roomInputRef = useRef(null)

    const [UsersId,setUsersId] = useState([])

    const usersCollectionRef = collection(db, "users");

    useEffect(() => {
        const queryPlayers = query(usersCollectionRef, where("room", "==", roomId))
        onSnapshot(queryPlayers, (snapshot) =>{
            let players = []
            snapshot.forEach((doc) => {
                players.push({...doc.data(), id: doc.id})
            });
            setUsersId(players[0].id);
        });      
    }, [roomId]);

    const inLobby = async (id) => {
        const addRef = doc(db, "users" , id)
        await updateDoc(addRef, {
            name: arrayUnion(newName)
        });
    }

    const loadLobby = () =>{
        SetStartGame((prevCount) => {
            const newCount = prevCount + 1;
            return newCount;
          });
    }
        const buttonSound= () => {
            const play = new Audio(button);
            play.play();
        }


        const createRoom = (length) => {
            
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            let result = "";
            for (let i = 0; i < length; i++) {
              result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            setRoomId(result);
            console.log(roomId)
            const addRoom = async (room) => {
                await addDoc(usersCollectionRef, { room:room, name:null });
            }
            addRoom(result);
          }

        if(roomId == "" && startGame == 0){
                return(
        <div className='multiplayer'>
            <h2>Multiplayer</h2>      
            <button class="btn-create btn" onClick={() => {createRoom(6);buttonSound()}}>CREATE ROOM</button>
            <div className='room'>
                <div className='room-input-cont'>
                    <label htmlFor="room-code">skriv in Rumskod:</label>
                    <input ref={roomInputRef}/>
                </div>
            <button className='btn-join btn' onClick={() => {setRoomId(roomInputRef.current.value);buttonSound()}}>JOIN ROOM</button>
            </div>
            <button className='btn-multi btn' onClick={() => {setGameState("menu");}}>BACK</button>
        </div>
    )
    }
    else if(roomId != null && startGame == 0){
    return(
        <div className='multiplayer'>
        <h2>Multiplayer</h2>
        <div className='room-code-cont'>
            <h3 className='room-code'>Rumskod: {roomId}</h3>
            <button className='btn-copy btn' onClick={() =>  {navigator.clipboard.writeText(roomId);buttonSound()}}>COPY</button>
        </div>
        <div className='room-input-cont'>
            <label htmlFor="name">Username:</label>
            <input type="text" onChange={(event) => {
            setNewName(event.target.value);
            }}/>
        </div>
        <button className='btn-join btn' onClick={() => {
                  inLobby(UsersId);
                  loadLobby();
                  setGameState("lobby");
                  setRoom(roomId);
                  buttonSound();
                             
                }}>JOIN LOBBY</button>
        </div>
    )
    }
}
export default Multiplayer;