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
    resultColumn.innerHTML = '๐'
    headTr.appendChild(resultColumn)


    let tableBody = document.createElement('tbody')
    tableBody.setAttribute('id', id)
    table.appendChild(tableBody)
}

function addRows(tableId, datarows) {
    let table = document.getElementById(tableId)

    datarows.forEach(datarow => {

        let row = document.createElement("tr")

        appendRowItems(row, [ getResultTextWithLinks(datarow.GL_Text), datarow.YESCnt, datarow.NOCnt, datarow.UTRCnt, datarow.NGCnt, datarow.ABSCnt, datarow.RESULT === resultOptions.YES ? 'โ' : 'โ' ])

        table.appendChild(row)
        
    })
}

function appendRowItems(element, values) {

    values.forEach(value => {
        let rowEntry = document.createElement("td")
        rowEntry.innerHTML = value

        element.appendChild(rowEntry)
    })
}

function getResultTextWithLinks(str) {
    const baseGoogleUrl = 'https://www.google.com/search?q='

    // We're trying to guess company by ยซยป so that e.g. ยซะคะะ?ะะะะยป is a company. 
    // We skip 1-character string in such quotation marks, since it mightbe building number, 
    // and all the sthings strating with ยซะฟัะพยป since that might be document name, not company
    //
    // Example
    // ะัะพ ะทะฐัะฒะตัะดะถะตะฝะฝั ะฝะฐะนะผะตะฝัะฒะฐะฝะฝั ัะพะฒะฐััะฒ, ะฟะพัะปัะณ, ัะบั ะฝะฐะดะฐััััั ะฑะตะทะพะฟะปะฐัะฝะพ ะ?ะธััะฐะปัะฝะพั ัะปัะถะฑะพั ัะฟะตััะฐะปัะทะพะฒะฐะฝะพะณะพ 
    // ะบะพะผัะฝะฐะปัะฝะพะณะพ ะฟัะดะฟัะธัะผััะฒะฐ ยซะกะฟะตััะฐะปัะทะพะฒะฐะฝะธะน ะบะพะผะฑัะฝะฐั ะฟัะดะฟัะธัะผััะฒ ะบะพะผัะฝะฐะปัะฝะพ-ะฟะพะฑััะพะฒะพะณะพ ะพะฑัะปัะณะพะฒัะฒะฐะฝะฝัยป ะฒะธะบะพะฝะฐะฒัะพะณะพ 
    // ะพัะณะฐะฝั ะะธัะฒัะฐะดะธ (ะะธัะฒััะบะพั ะผัััะบะพั ะดะตัะถะฐะฒะฝะพั ะฐะดะผัะฝััััะฐััั) ัะฐ ะ?ะธััะฐะปัะฝะพั ัะปัะถะฑะพั ัะฟะตััะฐะปัะทะพะฒะฐะฝะพะณะพ ะบะพะผัะฝะฐะปัะฝะพะณะพ 
    // ะฟัะดะฟัะธัะผััะฒะฐ ยซะะธัะฒััะบะธะน ะบัะตะผะฐัะพััะนยป ะฒะธะบะพะฝะฐะฒัะพะณะพ ะพัะณะฐะฝั ะะธัะฒัะฐะดะธ (ะะธัะฒััะบะพั ะผัััะบะพั ะดะตัะถะฐะฒะฝะพั ะฐะดะผัะฝััััะฐััั) ะฟัะธ 
    // ะฟะพัะพะฒะฐะฝะฝั ะบะฐัะตะณะพััะน ะพััะฑ, ะฟะตัะตะดะฑะฐัะตะฝะธั ะฟัะฝะบัะฐะผะธ ยซะฒยป ั ยซะณยป ัะฐััะธะฝะธ ะฟะตััะพั ััะฐััั 14 ะะฐะบะพะฝั ะฃะบัะฐัะฝะธ
    // ยซะัะพ ะฟะพัะพะฒะฐะฝะฝั ัะฐ ะฟะพัะพัะพะฝะฝั ัะฟัะฐะฒัยป. (ะัะด 15.08.2022 โ 08/231-988/ะะ?)
    const company = new RegExp(/\ยซ(?!ะัะพ)(?!ะฟัะพ)[^ยป*]{2,}\ยป/g)

    const docId = new RegExp(/\([0-9]+\)/g)
    const docDate = new RegExp(/\(ะัะด [0-9]*\.[0-9]*\.[0-9]*.โ.[0-9]*\/[0-9]*-[0-9]*\/ะะ?\)/g)

    function makeCompanyGoogleLinks(match) {
        return `<a href=${encodeURI(`${baseGoogleUrl}"${match.replace('ยป', '').replace('ยซ', '')}"`)} target="_blank">${match}</a>`
    }

    function makeDocsGoogleLinks(match) {
        let removedBrackets = match.substring(1, match.length - 1)
        let br1 = match.charAt(0)
        let br2 = match.charAt(match.length - 1)

        return `${br1}<a href=${encodeURI(`${baseGoogleUrl}"${removedBrackets}"`)} target="_blank">${removedBrackets}</a>${br2}`
    }

    return str.replace(company, makeCompanyGoogleLinks).replace(docId, makeDocsGoogleLinks).replace(docDate, makeDocsGoogleLinks)
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