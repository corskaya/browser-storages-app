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

const indexedDB = window.indexedDB || window.mozIndexedDB
let db = null

// IndexedDB
const renderIDBElements = async () => {
  customElArea.innerHTML = ''
  let currentDBLabel
  let currentDatabases

  const databases = await indexedDB.databases()
  console.log(databases)

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

  const objStoreContainer = document.createElement('div')
  customElArea.appendChild(objStoreContainer)

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

    createDB.addEventListener('click', async () => {
      const result = await createIDB(newDBName.value, version.value)
      console.log(result)
      await renderIDBElements()
    })
  })

  const renderOSElements = () => {
    objStoreContainer.innerHTML = ''
    let currentObjStores

    const objStoreLabel = document.createElement('label')
    objStoreLabel.textContent = 'Object Storage: '
    objStoreContainer.appendChild(objStoreLabel)

    if (!db || db.objectStoreNames.length === 0) {
      const noOSMessage = document.createElement('p')
      noOSMessage.textContent = 'No Object Store Exist'
      objStoreLabel.appendChild(noOSMessage)
    } else {
      currentObjStores = document.createElement('select')
      objStoreLabel.appendChild(currentObjStores)

      for (let i = 0; i < db.objectStoreNames.length; i++) {
        const objStoreOption = document.createElement('option')
        objStoreOption.textContent = db.objectStoreNames[i]
        objStoreOption.setAttribute('value', db.objectStoreNames[i])
        currentObjStores.appendChild(objStoreOption)
      }
    }

    const createNewOSContainer = document.createElement('div')
    objStoreContainer.appendChild(createNewOSContainer)

    const btnCreateNewOS = document.createElement('button')
    btnCreateNewOS.textContent = 'Create New Object Store'
    createNewOSContainer.appendChild(btnCreateNewOS)

    if (currentObjStores) {
      currentObjStores.addEventListener('change', e => {
        selectedOS = e.target.value
      })
    }

    btnCreateNewOS.addEventListener('click', e => {
      createNewOSContainer.removeChild(e.target)

      const newOSName = document.createElement('input')
      newOSName.setAttribute('placeholder', 'Name')
      createNewOSContainer.appendChild(newOSName)

      const createOS = document.createElement('button')
      createOS.textContent = 'Create'
      createNewOSContainer.appendChild(createOS)

      createOS.addEventListener('click', async () => {
        console.log('createOS clicked1')
        await createIDB(db.name, db.version + 1, newOSName.value)
        renderOSElements()
        console.log('createOS clicked2')
      })
    })
  }

  if (currentDatabases) {
    currentDatabases.addEventListener('change', async e => {
      const selectedDBName = e.target.value
      const selectedDBVersion = databases.forEach(function (db) {
        if (db.name === selectedDBName) {
          return db.version
        }
      })
      await createIDB(selectedDBName, selectedDBVersion)
      renderOSElements()
    })
  }
}

const createIDB = (dbName, dbVersion, osName = null, key = null, value = null) => new Promise((resolve, reject) => {
  const request = indexedDB.open(dbName, dbVersion)

  request.onversionchange = () => {
    console.log('version change')
  }

  request.onupgradeneeded = e => {
    console.log('upgrade')
    db = e.target.result
    if (osName) {
      db.createObjectStore(osName)
    }
  }

  request.onsuccess = e => {
    console.log('success')
    db = e.target.result
    if (osName && key && value) {
      const transaction = db.transaction(osName, 'readwrite')
      const store = transaction.objectStore(osName)
      store.add(value, key)
    }
    resolve(e.target.result)
    db.close()
  }

  request.onerror = e => {
    console.log('error')
    reject(e.target.error)
  }
})