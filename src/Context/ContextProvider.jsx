import React, { Children, createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { decryptPrivateKey } from '../Crypto/E2ee';
import toast from 'react-hot-toast';

export const chatContext = createContext(null);
const ContextProvider = ({ children }) => {
  const [roomData, setroomData] = useState(null)
  const [currentUser, setcurrentUser] = useState("")
  const [connected, setconnected] = useState(false)
  const [userData, setuserData] = useState(null)
  const [AllRoom, setAllRoom] = useState([])
  const [isLoggedIn, setisLoggedIn] = useState(false)
  const [privateKey, setPrivateKey] = useState(null)
  const [pvtKeyResponse, setPvtKeyResponse] = useState(null)
  const navigate = useNavigate()

  const getProfile = async () => {
    try {
      let response = await fetch("http://localhost:8080/profile", {
        credentials: "include"
      })
      if (response.status == 200) {
        setisLoggedIn(true)
        response = await response.json();
        setuserData(response)
      } else {
        console.log("Some error occured login again");
        setisLoggedIn(false)
        navigate("/login")
        setuserData(null)
      }
    } catch (error) {
      console.log("please login then try");
    }
  }

  const getRoooms = async () => {
    try {
      let response = await fetch("http://localhost:8080/api/v1/getRoom", {
        credentials: "include"
      })
      let data = await response.json()
      if (response.status == 200) {
        setAllRoom(data)
      } else {
        setAllRoom([])
      }
    } catch (error) {
      console.log("Error occured");

    }
  }

  useEffect(() => {
    getProfile();
    getRoooms();
  }, [])

  useEffect(() => {
    if (!userData) return;
    fetchEncryptedPrivateKey();   // Sirf fetch
  }, [userData]);


  const fetchEncryptedPrivateKey = async () => {
    try {
      let pvtKeyResponse = await fetch("http://localhost:8080/privateKey/user", {
        credentials: "include"
      })
      let PvtKeyResponse = await pvtKeyResponse.json();
      if (pvtKeyResponse.ok) {
        setPvtKeyResponse(PvtKeyResponse)
        return PvtKeyResponse;
      }else{
        return null;
      }
    } catch (error) {
      console.log("Something went wrong");
      return null;
    }
  }
  const decryptPrivateKeyFnc = async (PvtKeyResponse, password) => {
    console.log(PvtKeyResponse);

    console.log(PvtKeyResponse.privateKey);

    try {
      let decryptPvtKey = await decryptPrivateKey(PvtKeyResponse.privateKey, PvtKeyResponse.iv, PvtKeyResponse.salt, password);
      setPrivateKey(decryptPvtKey)
      return decryptPvtKey;
    } catch (error) {
      toast.error("Invalid Password")
    }
  }

  return (
    <chatContext.Provider value={{ roomData, setroomData, currentUser, setcurrentUser, connected, setconnected, userData, setuserData, getProfile, getRoooms, AllRoom, setisLoggedIn, isLoggedIn, fetchEncryptedPrivateKey, decryptPrivateKeyFnc, privateKey, setPrivateKey, pvtKeyResponse, setPvtKeyResponse }}>
      {children}
    </chatContext.Provider>
  )
}

export default ContextProvider