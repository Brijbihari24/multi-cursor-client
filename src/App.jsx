import React, { useEffect, useState } from 'react'
import { io } from "socket.io-client"

const socket = io("http://localhost:5001")

function App() {
  const [cursors, setCursors] = useState({})

  useEffect(() => {
    socket.on('connect', () => {
      console.log(`New User Connected with Id: ${socket.id}`);
    })

    socket.on('cursor-update', (data) => {
      setCursors((prev) => ({
        ...prev,
        [data.id]: { x: data.x, y: data.y }
      }))
    })

    socket.on('cursor-remove', (id) => {
      setCursors((prev) => {
        const updated = { ...prev };
        delete updated[id]
        return updated;
      }
      )
    })

    // send mouse/cursor move
    const handleMouseMove = (e) => {
      socket.emit('cursor-move', { x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove);

    return (() => {
      window.removeEventListener('mousemove', handleMouseMove)
      socket.off('connect')
      socket.off('cursor-update')
      socket.off('cursor-remove')
    }
    )

  }, [])
  return (
    <div>
      <p>Move your mouse around! Open more tabs to see other cursors.</p>
      {
        Object.entries(cursors).map(([id, pos]) => (
          <div
            key={id}
            style={{
              position: 'fixed',
              left: pos.x,
              top: pos.y,
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: 'red',
              pointerEvents: 'none', // important! warna cursor div khud mouse events block karega
              zIndex: 9999
            }}
          />
        ))
      }
    </div>
  )
}

export default App