function createTable(id, name) {
    let parentDiv = document.getElementById('details-tables')

    let table = document.createElement('table')
    table.setAttribute('class', 'table table-striped table-hover table-fixed-head')
    parentDiv.appendChild(table)

    let head = document.createElement('thead')
    table.appendChild(head)

    let headTr = document.createElement('tr')
    headTr.setAttribute('class', 'table-header')
    head.appendChild(headTr)

    let headName = document.createElement('th')
    headName.setAttribute('scope', 'col-md-10')
    headName.innerText = name
    headTr.appendChild(headName)

    for (const voteOption in voteOptions) {
        let column = document.createElement('th')
        column.setAttribute('scope', 'col')
        column.setAttribute('class', 'rotate')
        column.innerHTML = voteOptionsEmoji[voteOption]

        headTr.appendChild(column)
    }

    let resultColumn = document.createElement('th')
    resultColumn.setAttribute('scope', 'col')
    resultColumn.setAttribute('class', 'rotate')
    resultColumn.innerHTML = '📑'
    headTr.appendChild(resultColumn)


    let tableBody = document.createElement('tbody')
    tableBody.setAttribute('id', id)
    table.appendChild(tableBody)
}

// function createMainHeader(headerValue) {
//     let parentDiv = document.getElementById('details-tables')

//     let container = document.createElement('div')
//     container.setAttribute('class', 'container')
//     parentDiv.appendChild(container)

//     let header = document.createElement('h2')
//     header.innerText = headerValue
//     container.appendChild(header)
// }

// function createSubHeader(headerValue) {
//     let parentDiv = document.getElementById('details-tables')

//     let container = document.createElement('div')
//     container.setAttribute('class', 'container')
//     parentDiv.appendChild(container)

//     let header = document.createElement('h4')
//     header.innerText = headerValue
//     container.appendChild(header)
// }

function addRows(tableId, datarows) {
    let table = document.getElementById(tableId)

    datarows.forEach(datarow => {

        let row = document.createElement("tr")

        appendRowItems(row, [ datarow.GL_Text, datarow.YESCnt, datarow.NOCnt, datarow.UTRCnt, datarow.NGCnt, datarow.ABSCnt, datarow.RESULT === resultOptions.YES ? '✅' : '❌' ])

        table.appendChild(row)
        
    })
}

function appendRowItems(element, values) {

    values.forEach(value => {
        let rowEntry = document.createElement("td")
        rowEntry.innerText = value

        element.appendChild(rowEntry)
    })
}

function createThemeTables(votesByCategory) {
    for (const theme in themeToCategoryMap) {
        for (const item in themeToCategoryMap[theme]) {

            if(votesByCategory.hasOwnProperty(themeToCategoryMap[theme][item])) {
                createTable(themeToCategoryMap[theme][item], `${readableThemeMap[theme]}: ${themeToCategoryMap[theme][item]}`)

                try {
                    addRows(themeToCategoryMap[theme][item], votesByCategory[themeToCategoryMap[theme][item]])
                } catch (e) {
                    console.log(e)
                }
            }
        }
    }
}