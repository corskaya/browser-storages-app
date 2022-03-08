// Resets input values
const resetInput = (elements) => {
  elements.forEach(element => element.value = '')
}

// Removes custom elements like expiration date
const removeCustomArea = (element) => {
  element.innerHTML = ''
}

// Cookies
// Renders custom elements for cookie
const renderCookieElements = () => {
  const labelForExpiration = document.createElement('label')
  labelForExpiration.textContent = 'Expiration date: '
  labelForExpiration.setAttribute('for', 'expiration')
  customElArea.appendChild(labelForExpiration)

  const expiration = document.createElement('input')
  expiration.setAttribute('type', 'date')
  expiration.setAttribute('id', 'expiration')
  customElArea.appendChild(expiration)
}

const renderData = (data, element) => {
  if (data === null) {
    element.textContent = `Couldn't find the data`
  } else {
    element.textContent = data
  }
}

const addCookie = () => {
  const expirationDate = document.querySelector('#expiration').value
  const expirationDateArray = expirationDate.split('-')
  // via js-cookie library
  Cookies.set(addKey.value, value.value, {
    expires: new Date(expirationDateArray[0], expirationDateArray[1] - 1, expirationDateArray[2], 3)
  })
}

// IndexedDB
const renderIDBElements = async () => {
  customElArea.innerHTML = ''
  let currentDBLabel
  let currentDatabases

  const databases = await indexedDB.databases()

  if (databases.length === 0) {
    const noDBMessage = document.createElement('p')
    noDBMessage.textContent = 'No Database Exist'
    customElArea.appendChild(noDBMessage)
  } else {
    currentDBLabel = document.createElement('label')
    currentDBLabel.textContent = 'Database: '
    customElArea.appendChild(currentDBLabel)

    currentDatabases = document.createElement('select')
    currentDBLabel.appendChild(currentDatabases)

    databases.forEach(db => {
      const databaseOption = document.createElement('option')
      databaseOption.textContent = db.name
      databaseOption.setAttribute('value', db.name.toLowerCase())
      currentDatabases.appendChild(databaseOption)
    })
  }

  const createNewDBContainer = document.createElement('div')
  customElArea.appendChild(createNewDBContainer)

  const btnCreateNewDB = document.createElement('button')
  btnCreateNewDB.textContent = 'Create New Database'
  createNewDBContainer.appendChild(btnCreateNewDB)

  const objStorageContainer = document.createElement('div')
  customElArea.appendChild(objStorageContainer)

  btnCreateNewDB.addEventListener('click', e => {
    createNewDBContainer.removeChild(e.target)

    const newDBName = document.createElement('input')
    newDBName.setAttribute('placeholder', 'Name')
    createNewDBContainer.appendChild(newDBName)

    const version = document.createElement('input')
    version.setAttribute('type', 'number')
    version.setAttribute('min', '0')
    version.setAttribute('placeholder', 'version')
    createNewDBContainer.appendChild(version)

    const createDB = document.createElement('button')
    createDB.textContent = 'Create'
    createNewDBContainer.appendChild(createDB)

    createDB.addEventListener('click', () => {
      createIDB(newDBName.value, version.value)
    })
  })

  currentDatabases.addEventListener('change', () => {
    objStorageContainer.innerHTML = ''

    const objStorageLabel = document.createElement('label')
    objStorageLabel.textContent = 'Object Storage: '
    objStorageContainer.appendChild(objStorageLabel)

    const currentObjStorages = document.createElement('select')
    objStorageLabel.appendChild(currentObjStorages)

    // Static options for now
    const objStorageOption = document.createElement('option')
    objStorageOption.textContent = 'Todos'
    objStorageOption.setAttribute('value', 'todos')
    currentObjStorages.appendChild(objStorageOption)

    const createNewOSContainer = document.createElement('div')
    objStorageContainer.appendChild(createNewOSContainer)

    const btnCreateNewOS = document.createElement('button')
    btnCreateNewOS.textContent = 'Create New Object Storage'
    createNewOSContainer.appendChild(btnCreateNewOS)

    btnCreateNewOS.addEventListener('click', e => {
      createNewOSContainer.removeChild(e.target)

      const newOSName = document.createElement('input')
      newOSName.setAttribute('placeholder', 'Name')
      createNewOSContainer.appendChild(newOSName)

      const createOS = document.createElement('button')
      createOS.textContent = 'Create'
      createNewOSContainer.appendChild(createOS)
    })
  })
}

let db = null

const createIDB = (dbName, dbVersion) => {
  const request = indexedDB.open(dbName, dbVersion)

  // on upgrade needed
  request.onupgradeneeded = e => {
    db = e.target.result
  }

  // on success
  request.onsuccess = e => {
    db = e.target.result
  }

  // on error
  request.onerror = e => {
    alert(`Error: ${e.target.error}`)
  }
}