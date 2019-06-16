import React, { useReducer } from 'react'
import { MusicConsumer } from '../contexts/MusicContext'
import './Form.css'

const initialState = {
  name: '',
  file: null,
  error: {}
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_NEW_NAME':
      return { ...state, name: action.payload }
    case 'CREATE_NEW_FILE':
      return { ...state, file: action.payload }
    case 'RESET_STATE':
      document.getElementById('file-input').value = ''
      return initialState
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'EDIT_MUSIC':
      const { _id, filename } = action.payload
      return { _id, name: filename, error: {} }//return id, name, error is resetted to empty
    default:
      throw new Error()
  }
}


function Main({ value }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const { buttonOfCreating, editedMusic, buttonOfClosingEditing, buttonOfUpdating } = value

  const editIconsStyle = {
    transition: 'opacity 0.3s',
    opacity: 1,
    cursor: 'pointer'
  }

  //set field for editing
  if (state._id !== editedMusic._id) {
    dispatch({ type: 'EDIT_MUSIC', payload: editedMusic })
  }
  // set disable for input file:in comp

  return (
    <div className="card form">
      <div className="card-body">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group" style={{ marginBottom: '0.5rem' }}>
            <label htmlFor="name">
              Name&nbsp;<span style={{ color: 'red', position: 'absolute' }}>{state.error.name}</span>
            </label>

            <input type="text" placeholder="" className="form-control" id="name"
              value={state.name || ''}
              onChange={(e) => dispatch({ type: 'CREATE_NEW_NAME', payload: e.target.value })}
            />
          </div>
          <div className="input-group mb-3" style={{ flexDirection: 'column' }}>
            <label htmlFor="file-input" style={{ marginBottom: '0' }}>
              File&nbsp;<span style={{ color: 'red', position: 'absolute' }}>{state.error.file}</span>
            </label>
            <div className="custom-file">
              <input type="file" accept="audio/*"
                onChange={(e) => {
                  dispatch({ type: 'CREATE_NEW_FILE', payload: e.target.files[0] })
                }}
                multiple={false}
                id="file-input"
                style={{ outline: 'none' }}
                disabled={state._id ? true : false}
              />
            </div>

          </div>


          <div className="buttons">

            {state._id ? (
              <span style={editIconsStyle}>
                {buttonOfUpdating({ _id: state._id, name: state.name }, dispatch)}
                {buttonOfClosingEditing}
              </span>
            ) : (
                <>
                  {buttonOfCreating({
                    name: state.name,
                    file: state.file
                  }, dispatch)}
                </>
              )}


          </div>
        </form>
      </div>
    </div>
  )
}


export default function Form() {
  return (
    <MusicConsumer>
      {value => <Main value={value} />}
    </MusicConsumer>
  )
}

