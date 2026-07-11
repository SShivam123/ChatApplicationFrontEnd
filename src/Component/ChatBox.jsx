import React, { useContext, useEffect, useRef, useState } from 'react'
import paper from '../assets/paper.png'
import { SendHorizontal } from 'lucide-react'
import { chatContext } from '../Context/ContextProvider'
import { useNavigate } from 'react-router'
import { Stomp } from '@stomp/stompjs'
import toast from 'react-hot-toast'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { PulseLoader } from 'react-spinners'
import { importPublicKey, loadPrivateKey } from '../Crypto/keymaMnager'
import { decryptAESKey, decryptMessage, encryptAESKeyForMember, encryptMessage, generateAESKey } from '../Crypto/E2ee'

const ChatBox = () => {
    const chatBoxRef = useRef()
    const [message, setmessage] = useState([])
    const [Input, setInput] = useState("")
    const [StampClient, setStampClient] = useState(null)
    const { roomData, setroomData, currentUser, setcurrentUser, connected, setconnected, userData, setuserData,privateKey } = useContext(chatContext)
    const navigate = useNavigate();
    const [Image, setImage] = useState(null)
    const [ImagePreview, setImagePreview] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [imageUrl, setImageUrl] = useState(null)
    const imageInputRef = useRef()
    const [typingUsers, setTypingUsers] = useState([])
    const typingTimeoutRef = useRef()

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = (error) => reject(error);
        });
    };

    const sendMessage = async () => {
        if (Input.trim() === "" && !imageUrl) return;
        sendTypingEvent(false)
        clearTimeout(typingTimeoutRef.current)
        if (StampClient && connected) {
            const aesKey = await generateAESKey();
            const { ciphertext, iv } = await encryptMessage(Input, aesKey);
            const encryptedKeys = {};

            try {
                let response = await fetch(`http://localhost:8080/key/${roomData?.roomId}`, {
                    credentials: "include"
                })

                if (response.ok) {
                    let memberAndKey = await response.json();
                    console.log(memberAndKey);

                    for (const data of memberAndKey) {
                        const pubKey = await importPublicKey(data.publicKey);
                        encryptedKeys[data.userId] = await encryptAESKeyForMember(aesKey, pubKey);
                    }
                } else {
                    console.log("SomeThing went wrong..");
                }
            } catch (error) {
                console.log("Kuch problem hai", error);
            }

            const msg = {
                roomId: roomData?.roomId,
                content: ciphertext || null,
                iv: iv,
                encryptedKeys: encryptedKeys,
                imageUrl: imageUrl || null,
                type: imageUrl ? "IMAGE" : "TEXT"
            }
            console.log("encryptedKeys after fetch:", encryptedKeys);
            console.log("msg being sent:", msg);
            if (imageUrl) {
                msg.imageUrl = imageUrl
            }

            StampClient.publish({  // ✅ .send ki jagah .publish use karo
                destination: `/app/sendMessage/${roomData?.roomId}`,
                body: JSON.stringify(msg)
            })
            setInput("")
            setImageUrl("")
        } else {
            toast.error("Server se connected nahi hai!")
        }
    }



    useEffect(() => {
        if (!connected) {
            navigate("/")
        }
    }, [connected, currentUser, roomData])


    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/chat"),
            reconnectDelay: 5000, // ✅ Auto reconnect
            debug: () => { },       // ✅ Console spam band

            onConnect: () => {
                setStampClient(client)
                toast.success("Connected!")

                client.subscribe(
                    `/user/queue/room/${roomData?.roomId}`,
                    async (message) => {
                        const newMessage = JSON.parse(message.body);
                        console.log("myEncriptedkey:", newMessage.myEncriptedkey);
                        console.log("myEncriptedkey length:", newMessage.myEncriptedkey?.length);
                        console.log("privateKey:", privateKey);

                        let aesKey = await decryptAESKey(newMessage.myEncriptedkey, privateKey && privateKey);
                        let content = await decryptMessage(newMessage.content, newMessage.iv, aesKey);
                        setmessage((prev) => [...prev, { ...newMessage, content: content }]);
                    }
                )

                client.subscribe(`/topic/room/${roomData?.roomId}/typing`, (message) => {
                    const data = JSON.parse(message.body)
                    // ✅ currentUser (naam) se nahi, userData.userId se compare karo
                    if (String(data.userId) === String(userData?.userId)) return;

                    if (data.isTyping) {
                        setTypingUsers((prev) => {
                            let alreadyExists = prev.find(u => u.userId === data.userId);
                            if (alreadyExists) return prev;
                            return [...prev, { userId: data?.userId, name: data?.name }]
                        })
                    } else {
                        setTypingUsers((prev) => prev.filter(user => user.userId !== data.userId))
                    }
                })
            },


            onDisconnect: () => {
                console.log("Disconnected");
            },

            onStompError: (frame) => {
                console.error("STOMP Error:", frame);
                toast.error("Connection error!")
            },

            onWebSocketClose: (event) => {
                console.log(event.code);
                console.log(event.reason);
                console.log("WebSocket closed:", event);
            }
        });

        client.activate(); // ✅ Connect karo

        return () => {
            client.deactivate(); // ✅ Cleanup
        }
    }, [])

    const sendTypingEvent = (isTyping) => {
        if (StampClient && connected) {
            console.log("Typing event bheja:", isTyping)
            StampClient.publish({  // ✅ .send ki jagah .publish use karo
                destination: `/app/typing/${roomData?.roomId}`,
                body: JSON.stringify({ isTyping: isTyping })
            })
        }
    }

    const handleInput = (e) => {
        console.log(currentUser);

        setInput(e.target.value)
        sendTypingEvent(true)
        clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = setTimeout(() => {
            sendTypingEvent(false)
        }, 2000);
    }




    useEffect(() => {
        const loadMessage = async () => {
            try {
                let response = await fetch(`http://localhost:8080/api/v1/all-message/${roomData && roomData?.roomId}`, {
                    credentials: "include"
                })
                let data = await response.json()
                if (response.ok) 
                {
                    const decryptedMessages = await Promise.all(
                        data.map(async (message) => {
                            try {
                                const aesKey = await decryptAESKey(message.myEncriptedkey, privateKey);
                                const content = await decryptMessage(message.content, message.iv, aesKey);
                                return { ...message, content };
                            } catch (e) {
                                console.error("Decrypt failed:", e);
                                return { ...message, content: "🔒 Decrypt failed" };
                            }
                        })
                    );
                    setmessage(decryptedMessages)
                } else {
                    console.log(data.message);
                    toast.error(data.message)
                }
            } catch (error) {
                console.log(error);
                toast.error("Some error occured")
            }
        }
        loadMessage()
    }, [roomData?.roomId])

    const ScrollToBottom = () => {
        chatBoxRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {
        ScrollToBottom()
    }, [message, typingUsers])

    const leaveRoom = () => {
        toast.error("Diconnect")
        setconnected(false);
        setroomData(null);
        setcurrentUser(null);
        navigate("/");
    }

    const handleImageChange = async (e) => {
        console.log(message);

        let file = e.target.files[0];
        if (!file) {
            return;
        }
        if (!file.type.startsWith("image")) {
            toast.error("Please select the image file only");
            return;
        }
        let formData = new FormData();
        formData.append("file", file)
        try {
            setUploading(true)
            let response = await fetch("http://localhost:8080/uploadImage", {
                method: "POST",
                credentials: "include",
                body: formData
            })


            let data = await response.json();

            if (response.status == 200) {
                toast.success("Image Attached Click on send button or press Enter")
                console.log(data)
                setImageUrl(data?.imgUrl)
            }
        } catch (error) {
            toast.error("Some error occured while uploading the file")
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className='h-screen relative'>
            <header className='flex justify-between items-center bg-amber-400 px-5 py-3 fixed top-0 w-full'>
                <div>
                    <h1 className='font-bold'>Room:-<span>{roomData && roomData.roomId}</span></h1>
                </div>
                <div>
                    <h1 className='font-bold'>User:-<span>{userData && userData.name}</span></h1>
                </div>
                <div>
                    <button className='bg-red-500 rounded p-2 font-bold cursor-pointer' onClick={leaveRoom}>Leave Room</button>
                </div>
            </header>
            <div>
                <main className='p-5 bg-gray-200 absolute top-15 h-[calc(100vh-70px)] w-full flex flex-col gap-3  overflow-y-auto main pb-12'>

                    {message.length > 0 && message.map((msg, idx) => (

                        <div key={idx} className={`flex ${msg.senderUserId === userData?.userId ? "justify-end" : "justify-start"}`}>

                            <div className='bg-slate-800 rounded flex gap-3 p-2 max-w-xs' >
                                <div className='flex-shrink-0'>
                                    <img src={msg.senderImageUrl ? msg.senderImageUrl : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                        alt="Sender Avatar" className='rounded-full h-9 w-9' />
                                </div>
                                <div className='flex flex-col '>
                                    <h1 className='font-semibold text-blue-400'>{msg.senderName}</h1>

                                    <p className='text-gray-400 text-sm'>{new Date(msg.sentAt).toLocaleString('en-IN')}</p>
                                    {msg.type == "IMAGE" ?
                                        <div>
                                            <img src={msg.imageUrl} alt='image' />
                                            {msg.content && <p className={`break-all ${msg.senderUserId === currentUser ? "text-black" : "text-white"}`}>{msg.content}</p>}
                                        </div>
                                        : <p className={`break-all ${msg.senderUserId === currentUser ? "text-white" : "text-white"}`}>{msg.content}</p>
                                    }

                                </div>
                            </div>
                        </div>
                    ))}
                    {typingUsers.length > 0 && typingUsers.map(user => (
                        <div className=" text-gray-500 text-sm italic">
                            <p className='flex items-center justify-center text-center'> <span>{user.name} is Typing </span><span><PulseLoader size={10} /></span></p>
                        </div>
                    ))
                    }
                    <div ref={chatBoxRef}></div>
                </main>
            </div>

            {imageUrl && (
                <div className="fixed bottom-14 left-[10%] bg-slate-800 border border-gray-700 p-2 rounded-lg flex items-center gap-3 shadow-2xl z-20 animate-bounce-short">
                    <div className="relative">
                        {/* Choti si Photo */}
                        <img
                            src={imageUrl}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded-md border border-gray-600"
                        />

                        {/* Cancel (X) Button: Agar user ka mood badal gaya to remove karne ke liye */}
                        <button
                            onClick={() => setImageUrl("")} // Ispe click karte hi state khali, preview gayab!
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold cursor-pointer transition shadow"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400">Ready to send</span>
                        <span className="text-xs text-emerald-400 font-semibold">Image attached ✅</span>
                    </div>
                </div>
            )}
            <footer className='px-4 py-2 flex items-center gap-3 bg-amber-400 absolute bottom-0 w-full'>
                <input type="text" placeholder='Type a message...' className='p-1 rounded w-full border-2 font-semibold border-white bg-white ' value={Input} onChange={(e) => handleInput(e)} onKeyDown={(e) => {
                    if (e.key == "Enter") {
                        sendMessage()
                    }
                }} />
                <input type='file' ref={imageInputRef} accept='image/**' hidden onChange={handleImageChange} />
                <img src={paper} onClick={() => imageInputRef.current.click()} className='h-10 w-10 text-white cursor-pointer' />
                <button className='bg-blue-400 rounded px-2 py-1 border-sky-100 text-white border border-white cursor-pointer' onClick={sendMessage}><SendHorizontal /></button>
            </footer>
        </div>
    )
}

export default ChatBox


