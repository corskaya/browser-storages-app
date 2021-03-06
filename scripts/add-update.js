const addKey = document.querySelector('#add-key')
const value = document.querySelector('#value')
const addStorages = document.querySelector('#add-storages')
const btnAdd = document.querySelector('#btn-add')
const customAddArea = document.querySelector('#custom-add-area')
const btnBack = document.querySelector('#btn-back')

addStorages.value = 'local-storage'

addStorages.addEventListener('change', () => {
  removeCustomArea(customAddArea)

  if (addStorages.value === 'cookie-storage') {
    renderCookieElements()
  } else if (addStorages.value === 'indexeddb') {
    renderAddIDBElements()
  } else if (addStorages.value === 'websql') {
    // renderWebSqlElements()
  }
})

btnAdd.addEventListener('click', () => {
  if (addKey.value === '' || value.value === '') return

  if (addStorages.value === 'local-storage') {
    localStorage.setItem(addKey.value, value.value)
  } else if (addStorages.value === 'session-storage') {
    sessionStorage.setItem(addKey.value, value.value)
  } else if (addStorages.value === 'cookie-storage') {
    addCookie()
  } else if (addStorages.value === 'indexeddb') {
    addIndexedDB()
  }

  resetInput(addKey, value)
})

btnBack.addEventListener('click', () => {
  location.assign('index.html')
})