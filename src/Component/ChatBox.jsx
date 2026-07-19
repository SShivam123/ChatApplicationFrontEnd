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
    const [selectedImage, setSelectedImage] = useState(null);
    const [message, setmessage] = useState([])
    const [Input, setInput] = useState("")
    const [StampClient, setStampClient] = useState(null)
    const { roomData, setroomData, currentUser, setcurrentUser, connected, setconnected, userData, setuserData, privateKey } = useContext(chatContext)
    const navigate = useNavigate();
    const [Image, setImage] = useState(null)
    const [ImagePreview, setImagePreview] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [imageUrl, setImageUrl] = useState(null)
    const imageInputRef = useRef()
    const [typingUsers, setTypingUsers] = useState([])
    const typingTimeoutRef = useRef()
    const API_URL = import.meta.env.VITE_API_URL;

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
                let response = await fetch(`${API_URL}/key/${roomData?.roomId}`, {
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
            // console.log("encryptedKeys after fetch:", encryptedKeys);
            // console.log("msg being sent:", msg);
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
            webSocketFactory: () => new SockJS(`${API_URL}/chat`),
            reconnectDelay: 5000, // ✅ Auto reconnect
            debug: () => { },       // ✅ Console spam band

            onConnect: () => {
                setStampClient(client)
                toast.success("Connected!")

                client.subscribe(`/user/queue/room/${roomData?.roomId}`,
                    async (message) => {
                        const newMessage = JSON.parse(message.body);
                        // console.log("myEncriptedkey:", newMessage.myEncriptedkey);
                        // console.log("myEncriptedkey length:", newMessage.myEncriptedkey?.length);
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
        // console.log(currentUser);

        setInput(e.target.value)
        sendTypingEvent(true)
        clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = setTimeout(() => {
            sendTypingEvent(false)
        }, 2000);
    }




    useEffect(() => {
        const loadMessage = async () => {
            if (!roomData?.roomId || !privateKey) return;
            try {
                let response = await fetch(`${API_URL}/api/v1/all-message/${roomData && roomData?.roomId}`, {
                    credentials: "include"
                })
                let data = await response.json()
                if (response.ok) {
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
            let response = await fetch(`${API_URL}/uploadImage`, {
                method: "POST",
                credentials: "include",
                body: formData
            })


            let data = await response.json();

            if (response.status == 200) {
                toast.success("Image Attached Click on send button or press Enter")
                // console.log(data)
                setImageUrl(data?.imgUrl)
            }
        } catch (error) {
            toast.error("Some error occured while uploading the file")
        } finally {
            setUploading(false)
        }
    }

    return (
        <div>
            <header className="fixed top-0 left-0 right-0 h-16 bg-[#212a3e] border-b border-gray-800 flex items-center justify-between px-4 md:px-6 z-50">

                <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex justify-center items-center">
                        🛡️
                    </div>

                    <div>
                        <h1 className="text-white font-bold text-lg">
                            {roomData?.roomId}
                        </h1>

                        <p className="text-green-400 text-xs">
                            ● E2EE Active
                        </p>
                    </div>

                </div>

                <div className="hidden md:block text-right">
                    <p className="text-gray-400 text-xs">
                        Logged in as
                    </p>

                    <h2 className="text-white font-semibold">
                        {userData?.name}
                    </h2>
                </div>

                <button
                    onClick={leaveRoom}
                    className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-xl hover:bg-red-500 hover:text-white transition cursor-pointer"
                >
                    Leave Room
                </button>
            </header>

            {/* <main className="absolute top-16 bottom-20 left-0 right-0 overflow-y-auto bg-[#0B0F19] px-4 py-6 space-y-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]🫥">
                {message.length > 0 &&
                    message.map((msg, idx) => {
                        const isMe = msg.senderUserId === userData?.userId;
                        return (
                            <div
                                key={idx}
                                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                            >
                                <div className="flex gap-3 max-w-[85%] sm:max-w-[70%]">
                                    {!isMe && (
                                        <img
                                            src={
                                                msg.senderImageUrl
                                                    ? msg.senderImageUrl
                                                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                            }
                                            className="w-10 h-10 rounded-full object-cover border border-gray-700 self-end"
                                        />
                                    )}

                                    <div
                                        className={`rounded-2xl px-4 py-3 shadow-lg break-words
                            ${isMe
                                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-md"
                                                : "bg-[#161B2D] text-white border border-gray-700 rounded-bl-md"
                                            }`}
                                    >

                                        {!isMe && (
                                            <p className="text-indigo-400 text-sm font-semibold mb-1">
                                                {msg.senderName}
                                            </p>
                                        )}

                                        {msg.type === "IMAGE" ? (
                                            <>
                                                <img
                                                    src={msg.imageUrl}
                                                    alt=""
                                                    className="rounded-xl max-h-80 w-full object-cover border border-gray-700"
                                                />

                                                {msg.content && (
                                                    <p className="mt-3 text-sm whitespace-pre-wrap break-words">
                                                        {msg.content}
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <p className="text-sm whitespace-pre-wrap break-words">
                                                {msg.content}
                                            </p>
                                        )}

                                        <div className="flex justify-end mt-2">

                                            <span className="text-[11px] text-gray-300">

                                                {new Date(msg.sentAt).toLocaleTimeString(
                                                    "en-IN",
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    }
                                                )}

                                            </span>

                                        </div>

                                    </div>

                                    {isMe && (
                                        <img
                                            src={
                                                msg.senderImageUrl
                                                    ? msg.senderImageUrl
                                                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                            }
                                            className="w-10 h-10 rounded-full object-cover border border-gray-700 self-end"
                                        />
                                    )}

                                </div>

                            </div>

                        );
                    })}

                {typingUsers.length > 0 &&
                    typingUsers.map((user) => (
                        <div
                            key={user.userId}
                            className="flex justify-center"
                        >

                            <div className="bg-[#161B2D] border border-gray-700 rounded-full px-4 py-2 text-gray-300 text-sm italic flex items-center gap-2">

                                {user.name} is typing

                                <PulseLoader
                                    size={6}
                                    color="#6366F1"
                                />

                            </div>

                        </div>
                    ))}
                <div ref={chatBoxRef}></div>
            </main> */}
            <main className="absolute top-16 bottom-20 left-0 right-0 overflow-y-auto bg-[#0B0F19] px-3 sm:px-5 py-5 space-y-5 overflow-x-hidden">
                {message.length > 0 &&
                    message.map((msg, idx) => {
                        const isMe = msg.senderUserId === userData?.userId
                        return (
                            <div
                                key={idx}
                                className={`w-full flex ${isMe ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`flex items-end gap-3 ${isMe ? "flex-row-reverse" : "flex-row"} max-w-[90%] sm:max-w-[75%]`}
                                >
                                    <img
                                        src={
                                            msg.senderImageUrl
                                                ? msg.senderImageUrl
                                                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                        }
                                        className="w-10 h-10 rounded-full object-cover border border-gray-700 flex-shrink-0"
                                    />
                                    <div
                                        className={`
                                w-fit
                                max-w-full
                                rounded-2xl
                                px-4
                                py-3
                                shadow-lg
                                overflow-hidden
                                ${isMe? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-md": "bg-[#161B2D] border border-gray-700 text-white rounded-bl-md"}`}
                                    >
                                        {!isMe && (
                                            <p className="text-indigo-400 font-semibold text-sm mb-2">
                                                {msg.senderName}
                                            </p>
                                        )}

                                        {msg.type === "IMAGE" ? (

                                            <>

                                                <img
                                                    src={msg.imageUrl}
                                                    alt="Chat Image"
                                                    onClick={() => setSelectedImage(msg.imageUrl)}
                                                    className="rounded-xl max-h-80 w-full object-cover border border-gray-700 cursor-pointer hover:scale-[1.02] transition duration-300"
                                                />
                                                {msg.content && (
                                                    <p
                                                        className="
                                                mt-3
                                                text-sm
                                                leading-6
                                                whitespace-pre-wrap
                                                break-all
                                                max-w-full
                                            "
                                                    >
                                                        {msg.content}
                                                    </p>
                                                )}

                                            </>

                                        ) : (

                                            <p
                                                className="
                                        text-sm
                                        leading-6
                                        whitespace-pre-wrap
                                        break-all
                                        max-w-full
                                    "
                                            >
                                                {msg.content}
                                            </p>

                                        )}
                                        <div className="flex justify-end mt-2">
                                            <span className="text-[11px] text-gray-300">
                                                {new Date(msg.sentAt).toLocaleTimeString(
                                                    "en-IN",
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    }
                                                )}

                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        );

                    })}

                {typingUsers.length > 0 &&
                    typingUsers.map((user) => (

                        <div
                            key={user.userId}
                            className="flex justify-center"
                        >

                            <div className="bg-[#161B2D] border border-gray-700 rounded-full px-4 py-2 text-sm italic text-gray-300 flex items-center gap-2">

                                {user.name} is typing

                                <PulseLoader
                                    size={6}
                                    color="#6366F1"
                                />

                            </div>

                        </div>

                    ))}

                <div ref={chatBoxRef}></div>
                <div ref={chatBoxRef}></div>

                {selectedImage && (
                    <div
                        className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex justify-center items-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-5 right-5 text-white text-4xl font-bold hover:text-red-500 transition cursor-pointer"
                        >
                            ✕
                        </button>

                        {/* Image */}
                        <img
                            src={selectedImage}
                            alt="Preview"
                            onClick={(e) => e.stopPropagation()}
                            className="
                max-w-full
                max-h-[90vh]
                object-contain
                rounded-2xl
                shadow-2xl
                select-none
            "
                        />
                    </div>
                )}

            </main>
            {/* Floating Image Preview */}
            {imageUrl && (
                <div className="fixed bottom-24 left-4 z-50">
                    <div className="flex items-center gap-3 bg-[#1E293B] border border-gray-700 rounded-xl p-3 shadow-2xl w-fit">
                        <div className="relative">
                            <img
                                src={imageUrl}
                                alt="preview"
                                className="w-16 h-16 rounded-lg object-cover"
                            />
                            <button
                                onClick={() => setImageUrl("")}
                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex justify-center items-center cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">
                                Image Attached
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Ready to send
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {/* Footer */}
            <footer className="fixed bottom-0 left-0 right-0 bg-[#0B0F19] border-t border-gray-600 px-4 py-3 z-40">
                <div className="flex items-center gap-2">
                    <input
                        hidden
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {/* Attachment */}
                    <button
                        onClick={() => imageInputRef.current.click()}
                        className="w-10 h-10 rounded-full  hover:bg-[#4a5468] flex justify-center items-center transition cursor-pointer flex-shrink-0"
                    >
                        <img
                            src={paper}
                            alt=""
                            className="w-8 h-8 invert rounded-full"
                        />
                    </button>
                    {/* Input */}
                    <input
                        type="text"
                        placeholder="Type a secure message..."
                        value={Input}
                        onChange={handleInput}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                sendMessage();
                            }
                        }}
                        className="flex-1 h-12 bg-[#374151] border border-gray-700 rounded-full px-5 text-white placeholder:text-gray-400 outline-none focus:border-indigo-500"
                    />
                    {/* Send */}
                    <button
                        onClick={sendMessage}
                        className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 transition flex justify-center items-center cursor-pointer flex-shrink-0"
                    >
                        <SendHorizontal
                            size={20}
                            className="text-white"
                        />
                    </button>
                </div>
            </footer>
        </div>
    )
}

export default ChatBox


