import React, { useEffect } from 'react'
import './Music.css'
import { MusicConsumer } from '../contexts/MusicContext'

function Main({ music, value }) {
  const { buttonOfEditing, buttonOfDeleting, onPlay } = value
  useEffect(() => {
    document.getElementById(`music${music._id}`).style.opacity = 1
  })

  return (
    <div className="card recipe" id={`music${music._id}`}>
      <div className="card-body">
        <h4 className="card-title mb-3" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>{music.filename}</div>

          <div className="buttons" >
            {buttonOfDeleting(music._id)}
            {buttonOfEditing(music)}
          </div>
        </h4>

        <div className="footer">
          <audio controls
            style={{ width: '100%', outline: 'none' }}
            onPlay={(e) => onPlay(e.target.id)}
            id={`play${music._id}`}
          >
            <source src={`/musics/${music._id}`} type="audio/mpeg" />
          </audio>
        </div>
      </div>
    </div>
  )
}

export default function Music({ music }) {
  return (
    <MusicConsumer>
      {value => <Main value={value} music={music} />}
    </MusicConsumer>
  )
}

