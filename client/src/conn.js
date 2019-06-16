const conn = {
  index: (handleSuccess) => {
    fetch('/musics', {
      method: 'get', // or 'PUT'
    }).then(res => res.json())
      .then(response => handleSuccess(response.good))
      .catch(error => console.error('Error:', error));
  },
  create: (music, handleSuccess, handleInvalid) => {
    const formData = new FormData()
    formData.append("file", music.file)
    fetch(`/musics/${music.name}`, {
      method: 'post',
      body: formData
    }).then(res => res.json())
      .then(res => {
        if (res.success) {
          handleSuccess(res.good)
        } else {
          handleInvalid(res.error)
        }
      })
      .catch(err => console.log(err))
  },
  update: (music, handleSuccess, handleInvalid) => {
    fetch(`/musics/${music._id}`, {
      method: 'put',
      body: JSON.stringify(music),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
      .then(res => {
        if (res.success) {
          handleSuccess()
        } else {
          handleInvalid(res.error)
        }
      })
      .catch(err => console.log(err))
  },
  delete: (_id, handleSuccess) => {
    fetch(`/musics/${_id}`, {
      method: 'delete'
    }).then(res => res.json())
      .then(res => {
        if (res.success) handleSuccess()
      })
      .catch(err => console.log(err))
  }
}

export default conn