const getKey = document.querySelector('#get-key')
const getStorages = document.querySelector('#get-storages')
const btnGet = document.querySelector('#btn-get')
const btnBack = document.querySelector('#btn-back')

btnGet.addEventListener('click', () => {
  let data
  if (getStorages.value === 'local-storage') {
    data = localStorage.getItem(getKey.value)
  } else if (getStorages.value === 'session-storage') {
    data = sessionStorage.getItem(getKey.value)
  } else if (getStorages.value === 'cookie-storage') {
    data = Cookies.get(getKey.value)
  }

  const dataArea = document.querySelector('#data-area')
  if (getKey.value !== '') {
    renderData(data, dataArea)
  }
  resetInput(getKey)
})

btnBack.addEventListener('click', () => {
  location.assign('index.html')
})