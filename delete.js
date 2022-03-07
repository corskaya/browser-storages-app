const deleteKey = document.querySelector('#delete-key')
const deleteStorages = document.querySelector('#delete-storages')
const btnDelete = document.querySelector('#btn-delete')
const btnBack = document.querySelector('#btn-back')

btnDelete.addEventListener('click', () => {
  if (deleteStorages.value === 'local-storage') {
    localStorage.removeItem(deleteKey.value)
  } else if (deleteStorages.value === 'session-storage') {
    sessionStorage.removeItem(deleteKey.value)
  } else if (deleteStorages.value === 'cookie-storage') {
    Cookies.remove(deleteKey.value)
  }

  resetInput([deleteKey])
})

btnBack.addEventListener('click', () => {
  location.assign('index.html')
})