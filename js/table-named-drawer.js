const tableId = "named-table-details"
const tableHeadName = "Депутат"
const fraction = "Фракція"


function getDpGolosFlatList(categoryVoting) {
    let flatRows = []

    for (const categoryKey in categoryVoting) {
        (categoryVoting[categoryKey]).forEach(item => flatRows.push(item))
    }

    let list = []



    flatRows.forEach(entry => entry.DPList.forEach(dp => {
        if (!list.some(e => e.name === dp.DPName)) {

            let dpVotes = {}
            for (const voteOption in voteOptions) {
                dpVotes[voteOption] = 0
            }

            list.push({ name: dp.DPName, fraction: dp.DPFraction, votes: dpVotes })

        }

        let index = list.findIndex(e => e.name === dp.DPName)

        let vote = dp.DPGolos

        for (const voteOption in voteOptions) {
            if (voteOptions[voteOption] === vote) {
                list[index].votes[voteOption]++
            }
        
        }
        
    }))

    console.log(list)

    return list
}

function drawDpGolosTable(categoryVoting) {
    var tableData = getDpGolosFlatList(categoryVoting)

    console.log(tableData)

    let parentDiv = document.getElementById('named-table')

    let table = document.createElement('table')
    table.setAttribute('class', 'table table-striped table-hover table-fixed-head')
    parentDiv.appendChild(table)

    let head = document.createElement('thead')
    table.appendChild(head)

    let headTr = document.createElement('tr')
    headTr.setAttribute('class', 'table-header')
    head.appendChild(headTr)

    let headName = document.createElement('th')
    headName.setAttribute('scope', 'col')
    headName.innerText = tableHeadName
    headTr.appendChild(headName)

    let fractionName = document.createElement('th')
    fractionName.setAttribute('scope', 'col')
    fractionName.innerText = fraction
    headTr.appendChild(fractionName)

    for (const voteOption in voteOptions) {
        let column = document.createElement('th')
        column.setAttribute('scope', 'col-md-2')
        column.innerHTML = voteOptionsEmoji[voteOption]

        headTr.appendChild(column)
    }

    let resultColumn = document.createElement('th')
    resultColumn.setAttribute('scope', 'col')
    resultColumn.setAttribute('class', 'rotate')
    resultColumn.innerHTML = '🥷 (%)'
    headTr.appendChild(resultColumn)


    let tableBody = document.createElement('tbody')
    tableBody.setAttribute('id', tableId)
    table.appendChild(tableBody)

    addDpGolosRows(tableId, tableData)
}

function addDpGolosRows(tableId, dpGolosList) {
    let table = document.getElementById(tableId)

    dpGolosList.sort((a, b) => a.votes.NO_SHOW > b.votes.NO_SHOW ? -1 : 1)

    dpGolosList.forEach(dp => {
        let row = document.createElement("tr")

        let abscentPercent = parseInt((dp.votes.NO_SHOW / (dp.votes.YES + dp.votes.NO + dp.votes.NO_VOTE + dp.votes.DID_NOT_VOTE + dp.votes.NO_SHOW)) * 100)

        appendDpGolosRowItems(row, [ dp.name, dp.fraction, dp.votes.YES, dp.votes.NO, dp.votes.NO_VOTE, dp.votes.DID_NOT_VOTE, dp.votes.NO_SHOW, abscentPercent + ' %' ])

        table.appendChild(row)
    })

}

function appendDpGolosRowItems(element, values) {

    values.forEach(value => {
        let rowEntry = document.createElement("td")
        rowEntry.innerHTML = value

        element.appendChild(rowEntry)
    })
}