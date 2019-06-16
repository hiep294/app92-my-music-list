import React from 'react'
import Music from './Music'
import { MusicConsumer } from '../contexts/MusicContext'

function Main({ value }) {
  const { musics } = value

  return (
    <>
      {musics.map(music => <Music key={music._id} music={music} />)}
    </>
  )
}

export default function Musics() {
  return (
    <MusicConsumer>
      {(value) => <Main value={value} />}
    </MusicConsumer>
  )
}
