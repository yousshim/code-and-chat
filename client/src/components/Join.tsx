import React, { useState } from 'react'

type JoinProps = {
    join: (name: string, room: string) => void
}
const Join = ({ join }: JoinProps) => {
    const [name, setName] = useState("")
    const [room, setRoom] = useState("")
    return (
        <div className="container-sm">
            <form onSubmit={(e) => {
                    e.preventDefault()
                    if (name === "" || room === "") {
                        alert("Please enter a name and room")
                        return
                    }
                    setName("")
                    setRoom("")
                    join(name, room)
                }}>
                <div className="input-group mb-3">
                    <label className="input-group-text">Name: </label>
                    <input className="form-control" type="text" value={name} onChange={(e) => {
                        setName(e.target.value)
                    }}/>
                </div>
                <div className="input-group mb-3">
                    <label className="input-group-text">Room: </label>
                    <input className="form-control" type="text" value={room} onChange={(e) => {
                        setRoom(e.target.value)
                    }}/>
                </div>
                <input className="btn btn-primary" type="submit" value="Join"/>
            </form>
        </div>
    )
}

export default Join
