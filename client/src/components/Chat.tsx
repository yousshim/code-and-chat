import React, { useEffect, useState } from 'react'
import io from "socket.io-client"

type ChatProps = {
    name: string,
    room: string,
    leave: () => void,
}
var socket: SocketIOClient.Socket
const Chat = ({ name, room, leave }: ChatProps) => {
    const [messages, setMessages] = useState<{user: string, txt: string}[]>([])
    const [message, setMessage] = useState<string>("")
    const [code, setCode] = useState<string>("")
    useEffect(() => {
        socket = io("http://localhost:8888")
        socket.emit("join", {name, room}, (error: string) => {
            alert(error)
            leave()
        })
        socket.on("announce", ({txt}: {txt: string}) => {
            setMessages(messages => [...messages, {user: "admin", txt}])
        })
        socket.on("message", ({user, txt}: {user: string, txt: string}) => {
            setMessages(messages => [...messages, {user, txt}])
        })
        socket.on("code update", ({ code }: {code: string}) => {
            setCode(code)
        })
        return () => {
            socket.emit("leave")
            socket.disconnect()
        }
    }, [name, room, leave])
    return (
        <div className="container-fluid">
            <h1>{name} {room}</h1>
            <button className="btn btn-danger" onClick={(e) => {
                e.preventDefault()
                leave()
            }}>Leave</button>
                <div className="d-flex d-flex-row">
                <div className="card">
                    <textarea value={code} onChange={(e) => {
                        setCode(e.target.value)
                        socket.emit("code update", {code})
                    }}/>
                </div>
                    <div className="card">
                        <ul className="scroll card-body">
                            {messages.map((message => (
                                <li className={"d-flex " + (message.user === name ? "justify-content-start" : "justify-content-end")}>
                                    <div className="msg-body">{message.txt}</div>
                                    {message.user !== name ? <span className="sender-info">{message.user}</span> : null}
                                </li>
                            )))}
                        </ul>
                        <form className="card-footer input-group flex-nowrap" onSubmit={(e) => {
                            e.preventDefault()
                            if (message === ""){
                                return
                            }
                            socket.emit("message", {user: name, txt: message})
                            setMessages(messages => [...messages, {user: name, txt: message}])
                            setMessage("")
                            }}>
                            <input className="form-control" type="text" value={message} onChange={(e) => setMessage(e.target.value)}/>
                            <input className="btn btn-primary" type="submit" value="Send"/>
                        </form>
                    </div>
                </div>
        </div>
    )
}

export default Chat
