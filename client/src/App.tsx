import React, { useState } from 'react'
import Chat from './components/Chat'
import Join from './components/Join'

const App = () => {
    const [name, setName] = useState("")
    const [room, setRoom] = useState("")
    const [isLogged, setIsLogged] = useState(false)

    const join = (name: string, room: string) => {
        setName(name)
        setRoom(room)
        setIsLogged(true)
    }

    const leave = () => {
        setName("")
        setRoom("")
        setIsLogged(false)
    }

    return (
        <div>
            {isLogged
            ?<Chat name={name} room={room} leave={leave}/>
            :<Join join={join}/>}
        </div>
    )
}

export default App
