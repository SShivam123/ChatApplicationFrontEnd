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
  const [loadingProfile, setloadingProfile] = useState(false)
  const navigate = useNavigate()
   const API_URL = import.meta.env.VITE_API_URL;

  const getProfile = async () => {
    try {
      setloadingProfile(true)
      let response = await fetch(`${API_URL}/profile`, {
        credentials: "include"
      })
      if (response.status == 200) {
        setisLoggedIn(true)
        response = await response.json();
        setuserData(response)
      } else {
        console.log("Some error occured login again");
        setisLoggedIn(false)
        //   if (!window.location.pathname.includes('/reset-password')) {
        //   navigate("/login")
        //   console.log("Some Error Occured Please Login Again")
        // }
        setuserData(null)
      }
    } catch (error) {
      console.log("please login then try");
    } finally {
      setloadingProfile(false)
    }
  }

  const getRoooms = async () => {
    try {
      let response = await fetch(`${API_URL}/api/v1/getRoom`, {
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
      let pvtKeyResponse = await fetch(`${API_URL}/privateKey/user`, {
        credentials: "include"
      })
      let PvtKeyResponse = await pvtKeyResponse.json();
      if (pvtKeyResponse.ok) {
        setPvtKeyResponse(PvtKeyResponse)
        return PvtKeyResponse;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Something went wrong");
      return null;
    }
  }
  const decryptPrivateKeyFnc = async (PvtKeyResponse, password) => {
    console.log(PvtKeyResponse);

    // console.log(PvtKeyResponse.privateKey);

    try {
      let decryptPvtKey = await decryptPrivateKey(PvtKeyResponse.privateKey, PvtKeyResponse.iv, PvtKeyResponse.salt, password);
      setPrivateKey(decryptPvtKey)
      return decryptPvtKey;
    } catch (error) {
      toast.error("Invalid Password")
    }
  }

  return (
    <chatContext.Provider value={{ roomData, setroomData, currentUser, setcurrentUser, connected, setconnected, userData, setuserData, getProfile, getRoooms, AllRoom, setisLoggedIn, isLoggedIn, fetchEncryptedPrivateKey, decryptPrivateKeyFnc, privateKey, setPrivateKey, pvtKeyResponse, setPvtKeyResponse, loadingProfile }}>
      {children}
    </chatContext.Provider>
  )
}

export default ContextProvider