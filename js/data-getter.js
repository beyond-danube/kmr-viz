const BASE_URL = 'http://localhost/kmr-data/'

async function fetchData(path) {
    let response = await fetch(path)
    return await response.json()
}

async function getDateMap() {
    return await fetchData(BASE_URL + 'date-files-map/date-map.json')
}

async function getDataFile(fileName) {
    return await fetchData(`${BASE_URL}data-final-lite/${fileName}`)
}