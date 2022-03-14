const getKey = document.querySelector('#get-key')
const getStorages = document.querySelector('#get-storages')
const btnGet = document.querySelector('#btn-get')
const btnBack = document.querySelector('#btn-back')
const customDeleteArea = document.querySelector('#custom-get-area')
const dataArea = document.querySelector('#data-area')

btnGet.addEventListener('click', async () => {
  let data

  if (getStorages.value === 'local-storage') {
    data = localStorage.getItem(getKey.value)
  } else if (getStorages.value === 'session-storage') {
    data = sessionStorage.getItem(getKey.value)
  } else if (getStorages.value === 'cookie-storage') {
    data = Cookies.get(getKey.value)
  } else if (getStorages.value === 'indexeddb') {
    data = await getIndexedDB(getKey.value)
  }

  if (getKey.value !== '') {
    renderData(data, dataArea)
  }
  resetInput(getKey)
})

getStorages.addEventListener('change', e => {
  removeCustomArea(customDeleteArea)
  const value = e.target.value
  if (value === 'indexeddb') {
    renderDeleteIDBElements()
  }
})


btnBack.addEventListener('click', () => {
  location.assign('index.html')
})