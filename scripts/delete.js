const deleteKey = document.querySelector('#delete-key')
const deleteStorages = document.querySelector('#delete-storages')
const btnDelete = document.querySelector('#btn-delete')
const btnBack = document.querySelector('#btn-back')
const customDeleteArea = document.querySelector('#custom-delete-area')

btnDelete.addEventListener('click', () => {
  if (deleteStorages.value === 'local-storage') {
    localStorage.removeItem(deleteKey.value)
  } else if (deleteStorages.value === 'session-storage') {
    sessionStorage.removeItem(deleteKey.value)
  } else if (deleteStorages.value === 'cookie-storage') {
    Cookies.remove(deleteKey.value)
  } else if (deleteStorages.value === 'indexeddb') {
    deleteIndexedDB(deleteKey.value)
  }

  resetInput(deleteKey)
})

deleteStorages.addEventListener('change', e => {
  removeCustomArea(customDeleteArea)
  const value = e.target.value
  if (value === 'indexeddb') {
    renderDeleteIDBElements()
  }
})

btnBack.addEventListener('click', () => {
  location.assign('index.html')
})