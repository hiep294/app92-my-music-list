import React from 'react'
import conn from '../conn'
import DeleteLaunchModal from '../components/DeleteLaunchModal'
import editIcon from '../icons/edit.png'

const MusicContext = React.createContext()
const Provider = MusicContext.Provider

export const MusicConsumer = MusicContext.Consumer
export class MusicProvider extends React.Component {
  state = {
    musics: [],
    editedMusic: {},
    songIdInPlay: '',
    onPlay: (elementId) => {
      document.getElementById(elementId).play()
      if (this.state.songIdInPlay && this.state.songIdInPlay !== elementId) {
        document.getElementById(this.state.songIdInPlay).pause()
      }
      this.setState({ songIdInPlay: elementId })
    },
    buttonOfCreating: (newMusic, dispatch) => (
      <button className="btn btn-light btn-submit"
        type="button"
        onClick={() => {
          this.state.createMusic(newMusic, dispatch)
        }}
      >Submit</button>
    ),
    buttonOfEditing: (music) => (
      <img src={editIcon} alt="" onClick={() => {
        this.setState({ editedMusic: music })
      }} />
    ),
    buttonOfClosingEditing: (
      <button className="btn btn-light" type="button"
        onClick={() => this.setState({ editedMusic: {} })}
      >Close</button>
    ),
    buttonOfUpdating: (music, dispatch) => (
      <button className="btn btn-light" type="button"
        onClick={() => {
          this.state.updateMusic(music, dispatch)
        }}
      >Update</button>
    ),
    buttonOfDeleting: (_id) => (
      <>
        <DeleteLaunchModal onDelete={() => {
          this.state.deleteMusic(_id)
        }} />

      </>
    ),
    createMusic: (music, dispatch) => {
      if (!music.name) {
        dispatch({ type: "SET_ERROR", payload: { name: "!Please input one." } })
        return
      }
      conn.create(music, (resItem) => {
        // console.log(resItem)
        resItem._id = resItem.id
        this.setState({ musics: [resItem, ...this.state.musics] })
        setTimeout(() => {
          dispatch({ type: 'RESET_STATE' })
        }, 1)
      }, (error) => {
        dispatch({ type: "SET_ERROR", payload: error })
      })
    },
    updateMusic: (music, dispatch) => {
      conn.update(music, () => {
        // console.log('ok')
        //update music
        this.setState({
          musics: this.state.musics.map(item => {
            if (item._id === music._id) {
              item.filename = music.name
            }
            return item
          })
        })
        //close editing    
        this.setState({ editedMusic: {} })
      }, (err) => {
        dispatch({ type: 'SET_ERROR', payload: err })
      })
    },
    deleteMusic: (_id) => {
      conn.delete(_id, () => {
        // delete in state
        this.setState({
          musics: this.state.musics.filter(item => item._id !== _id)
        })
      })
      // for animation
      document.getElementById(`music${_id}`).style.opacity = 0.3
    },
  }

  componentDidMount() {
    conn.index((musics) => this.setState({ musics }))
  }

  render() {
    return (
      <Provider value={this.state}>
        {this.props.children}
      </Provider>
    )
  }
}

