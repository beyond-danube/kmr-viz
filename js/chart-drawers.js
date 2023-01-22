const MAIN_VOTING_CHART_DIV = 'sankey_voting'

const DONUT_CHART_OPTIONS = {
    pieHole: 0.4} 

function drawChart(categoryVoting) {
    google.charts.load('current', {'packages':['sankey']})
    google.charts.setOnLoadCallback(drawSankeyChart)

    function drawSankeyChart() {

        let data = new google.visualization.DataTable()
        data.addColumn('string', 'From')
        data.addColumn('string', 'To')
        data.addColumn('number', 'Weight')
    
        let drawdata = []

    
        for (const themeKey in themeToCategoryMap) {
            for (const categoryKey in categoryVoting) {
                if(themeToCategoryMap[themeKey].includes(categoryKey)) {
                    drawdata.push( [ readableThemeMap[themeKey], categoryKey, 100 * categoryVoting[categoryKey].length ] )
                }
            }
        }
    
        for (const categoryKey in categoryVoting) {
            for (const voteKey in voteOptions) {

                let count = 0
                categoryVoting[categoryKey].forEach(item => { 
                    count = count + item[voteToCountMap[voteKey]]
                })

                drawdata.push([ categoryKey, voteOptions[voteKey], count ])
            }
        }

        // Back to flat view
        let flatRows = []

        for (const categoryKey in categoryVoting) {
            (categoryVoting[categoryKey]).forEach(item => flatRows.push(item))
        }


        for (const resultKey in resultOptions) {
            for (const voteKey in voteOptions) {

                let count = 0
                let filteredArray = flatRows.filter(row => row.RESULT == resultOptions[resultKey])

                filteredArray.forEach(item => {
                    count = count + item[voteToCountMap[voteKey]]
                })

                drawdata.push( [ voteOptions[voteKey], resultOptions[resultKey], count ] )
            }
        }
    
    
        data.addRows(drawdata)
    
        let chart = new google.visualization.Sankey(document.getElementById(MAIN_VOTING_CHART_DIV))
        chart.draw(data)
    }
}


function getVotingResultsByCategory(data) {
    
    let result = {}
    
    data.forEach(row => {
  
        let category = guessCategory(row.GL_Text)
  
        if(result.hasOwnProperty(category)) {
            result[category].push(row)
        } else {
            result[category] = []
            result[category].push(row)
        }
        
    })
  
    return result
}

function guessCategory(topic) {

    // порядок денний
    if(topic.includes('За включення до порядку') || topic.includes('За внесення до порядку')) return 'Порядок денний: прийняття, зміни, тощо'
    else if (topic.includes('За зняття з розгляду')) return 'Порядок денний: прийняття, зміни, тощо'
    else if (topic.includes('За прийняття порядку денного') || topic.includes('За основу питання порядку денного') || topic.includes('За основу питання порпядку денного') || topic.includes('За основу  питання порядку денного')) return 'Порядок денний: прийняття, зміни, тощо' // including typo variations
    else if (topic.includes('За правку в питанні порядку денного')) return 'Порядок денний: прийняття, зміни, тощо'
    else if (topic.includes('За зміну черговості розгляду')) return 'Порядок денний: прийняття, зміни, тощо'
    else if (topic.includes('За перенесення питання порядку')) return 'Порядок денний: прийняття, зміни, тощо'
    else if (topic.includes('За правку в питанні порядку денного')) return 'Порядок денний: прийняття, зміни, тощо'
    else if (topic.includes('За правку до питання порядку денного')) return 'Порядок денний: прийняття, зміни, тощо'
    else if (topic.includes('перенесення питання порядку денного')) return 'Порядок денний: прийняття, зміни, тощо'
    else if (topic.includes('За внесення правок до питання порядку денного')) return 'Порядок денний: прийняття, зміни, тощо'
    else if (topic.includes('За повернення до розгляду питання порядку денного')) return 'Порядок денний: прийняття, зміни, тощо'
    else if (topic.includes('За регламент 20 хвилин на депутатські запити')) return 'Порядок денний: прийняття, зміни, тощо'
    else if (topic.includes('Про зняття з порядку денного питання')) return 'Порядок денний: прийняття, зміни, тощо'
    else if (topic.includes('вкл до порядку денного')) return 'Порядок денний: прийняття, зміни, тощо'
    else if (topic.includes('За прийняття порячдку денного в цілому') || topic.includes('Про затвердження порядку денного в цілому')) return 'Порядок денний: прийняття, зміни, тощо' // typo here, hardcoded include
    else if (topic.includes('Про включення питання  до порядку денного')) return 'Порядок денний: прийняття, зміни, тощо' // typo here, hardcoded include
    else if (topic.includes('Про внесення до порядку денного питання')) return 'Порядок денний: прийняття, зміни, тощо' // phrase variation
    else if (topic.includes('Про перенесення питання порчядку денного')) return 'Порядок денний: прийняття, зміни, тощо' // phrase variation
    else if (topic.includes('За прийняття питаннь') && topic.includes('порядку денного')) return 'Порядок денний: прийняття, зміни, тощо' // typo here, hardcoded include
    else if (topic.includes('За продовження пленарного засідання')) return 'Порядок денний: прийняття, зміни, тощо'
    else if (topic.includes('За правки до питання порядку денного')) return 'Порядок денний: прийняття, зміни, тощо'
    else if (topic.includes('За пропозицію депутата')) return 'Порядок денний: прийняття, зміни, тощо'
    else if (topic.includes('За перерву в пленарному засіданні')) return 'Порядок денний: прийняття, зміни, тощо'
    else if (topic.includes('За розділ') && topic.includes('порядку денного')) return 'Порядок денний: прийняття, зміни, тощо'
    else if (topic.includes('За зняття') && topic.includes('питань порядку денного')) return 'Порядок денний: прийняття, зміни, тощо'
    else if (topic.includes('За виключення питання порядку денного')) return 'Порядок денний: прийняття, зміни, тощо'
    else if (topic.includes('За виключення з порядку денного')) return 'Порядок денний: прийняття, зміни, тощо'
     
    
    else if (topic.includes('Про внесення змін')) return 'Внесення змін у попередні рішення'


    // надання слова
    else if (topic.includes('За надання слова')) return 'Надання слова'
    else if (topic.includes('Про надання слова')) return 'Надання слова'
    else if (topic.includes('За правку депутата')) return 'Правку депутата'


    // земельні ділянки та будівлі
    else if (topic.includes('зміну цільового призначення земельної ділянки') || topic.includes('зміну цільового призначення земельних ділянок')) return 'Зміна призначення земельної ділянки'
    else if (topic.includes('Про виплату') && topic.includes('за належну для одержання земельну ділянку')) return 'Виплата громадянину за земельну ділянку'
    else if (topic.includes('продаж земельної ділянки')) return 'Продаж земельної ділянки'
    else if (topic.includes('Про відмову') && topic.includes('оренди земельної ділянки')) return 'Відмова в оренді земельної ділянки'
    else if ((topic.includes('надання') || topic.includes('передачу')) && (topic.includes('постійне користування земельної ділянки') || topic.includes('ділянки у постійне користування') || topic.includes('земельних ділянок у постійне користування') || topic.includes('земельної ділянки в постійне користування'))) return 'Постійне користування земельної ділянки'
    else if (topic.includes('приватизацію') && topic.includes('земельної ділянки')) return 'Приватизація земельної ділянки'
    else if (topic.includes('передачу') && topic.includes('у приватну власність земельної ділянки')) return 'Приватизація земельної ділянки'
    else if (topic.includes('передачу') && topic.includes('земельної ділянки у приватну власність')) return 'Приватизація земельної ділянки'
    
    
    
    


    else if (topic.includes('передачу') && (topic.includes('в оренду земельної ділянки') || topic.includes('земельної ділянки в оренду') || topic.includes('земельних ділянок в оренду'))) return 'Оренда земельної ділянки'

  
    else if (topic.includes('розірвання договору оренди земельної ділянки')) return 'Розірвання договору оренди земельної ділянки'
    else if (topic.includes('поновлення') && topic.includes('договору оренди земельної ділянки')) return 'Поновлення договору оренди земельної ділянки'
    else if (topic.includes('відмову') && topic.includes('в поновленні договорів оренди')) return 'Відмова в поновленні аренди земельної ділянки'

    // дозвіл на оцінкку
    else if (topic.includes('надання дозволу') && topic.includes('експертної грошової оцінки земельної ділянки')) return 'Дозвіл на оцінку земельної ділянки'

    
    
    // надання дозволів на проєкти
    else if (topic.includes('надання') && (topic.includes('дозволу на розроблення проєкту землеустрою') || topic.includes('надання дозволу на розроблення проекту землеустрою'))) return 'Дозвіл на розроблення проєкту землеустрою'
    
    else if (topic.includes('звернення Київської міської ради до')) return 'Зверняння КМДА до державних стуктур'
    else if (topic.includes('звернення Київської міської ради до')) return 'Зверняння КМДА до державних стуктур'

    
    else if (topic.includes('За підтримку депутатських запитів')) return 'Підтрика депутатських запитів'
    else if (topic.includes('За складання депутатських повноважень')) return 'Cкладання депутатських повноважень'

    // комунальна власнысть та підприємства
    else if (topic.includes('прийняття до комунальної власності')) return 'Прийняття до комунальної власності'
    else if (topic.includes('Про реорганізацію комунального') || (topic.includes('реорганізацію') && topic.includes('комунальній власності'))) return 'Реорганізація комунального підприємства'
    else if (topic.includes('реорганізацію Київського міського')) return 'Реорганізація комунального підприємства'
    else if (topic.includes('створення') && topic.includes('комунальної')) return 'Створення комунальної установи'
    
    
    
    else if (topic.includes('створення') && topic.includes('комісії')) return 'Створення комісії'
    
    
    
    else if (topic.includes('Про надання згоди на реалізацію проєкту')) return 'Згода на реалізацію проєкту'

    else if (topic.includes('надання пільг')) return 'Надання пільг'
    
    
    // зміна типу і найменування навчалих закладів
    else if (topic.includes('зміну типу та найменування загальноосвітнього навчального закладу') || topic.includes('Про зміну типу та найменування деяких закладів освіти') || topic.includes('зміну найменування загальноосвітнього навчального закладу')) return 'Зміна типу або найменування навчального закладу'
    

    // Міські теми
    else if (topic.includes('здійснення благоустрою')) return 'Благоустрій'


    // дозволи на ОСН
    else if (topic.includes('на створення органу самоорганізації населення')) return 'Дозвіл на створення органу самоорганізації населення'



    else if (topic.includes('затвердження') && topic.includes('цільової програми')) return 'Міські цільові програми'



    // Перейменування
    else if (topic.includes('перейменування вулиці') || topic.includes('перейменування площі') || topic.includes('перейменування бульвару') || topic.includes('перейменування провулку') || topic.includes('перейменування проспекту') || topic.includes('всі питання перейменувань')) return 'Перейменування'


    else return 'Інша категорія'
}

function getDrawingData(categotyVotingData) {
    let flatViewData = []

    for (const categoty in categotyVotingData) {
        votesByCategory[categoty].forEach(entry => flatViewData.push(entry))
    }

    function sortDataByYearAndMonth(data) {
        return data.sort(function(x, y) {
            let v1 = parseInt(x[0].split('-')[0]) + (parseInt(x[0].split('-')[1]) / 100)
            let v2 = parseInt(y[0].split('-')[0]) + (parseInt(y[0].split('-')[1]) / 100)
            let value = v1 - v2
    
            return value
        })
    }

    return {
        voteChartData: () => { 
            let dataElements = []

            for (const voteKey in voteOptions) {
                let total = 0

                flatViewData.forEach(entry => total = total + entry[voteToCountMap[voteKey]])
                dataElements.push([ voteOptions[voteKey], total ])
            }

            return { columns: [['string', 'Голос'], ['number', 'Число']], rows: dataElements }
        },
        resultChartData: () => {
            let dataElements = []

            for (const resultKey in resultOptions) {
                dataElements.push([ resultOptions[resultKey], flatViewData.filter(res => res.RESULT === resultOptions[resultKey]).length ])
            }

            return { columns: [['string', 'Результат'], ['number', 'Число']], rows: dataElements }
        },
        resultsByCategoryData: () => {
            let dataElements = {}

            for (const resultKey in resultOptions) {
                dataElements[resultOptions[resultKey]] = []
            }

            for (const resultKey in resultOptions) { 

                for (const theme in themeToCategoryMap) {
                    let total = 0
                    themeToCategoryMap[theme].forEach(themeItem => categotyVotingData.hasOwnProperty(themeItem) ? total = total + categotyVotingData[themeItem].filter(item => item.RESULT === resultOptions[resultKey]).length : total = total)

                    dataElements[resultOptions[resultKey]].push( [ readableThemeMap[theme], total ] )
                }
            }
            return { columns: [['string', 'Тема'], ['number', 'Число']], rowsYes: dataElements[resultOptions.YES], rowsNo: dataElements[resultOptions.NO] }
        },
        votesByMonthChartData: () => {
            let votesByMonthColumns = []

            votesByMonthColumns.push(['string', 'місяць'])

            for (const voteOption in voteOptions) {
                votesByMonthColumns.push(['number', voteOptions[voteOption]])      
            }

            let dataElements = []

            let dataByYearAndMonth = {}

            flatViewData.forEach(entry => {

                let yearAndMonth = `20${entry.docId.substring(0, 2)}-${entry.docId.substring(2, 4)}`

                if(!dataByYearAndMonth.hasOwnProperty(yearAndMonth)) {
                    dataByYearAndMonth[yearAndMonth] = {}
                    for (const voteOption in voteOptions) {
                        dataByYearAndMonth[yearAndMonth][voteOptions[voteOption]] = 0
                    }
                }

                for (const key in voteToCountMap) {
                    dataByYearAndMonth[yearAndMonth][voteOptions[key]] += entry[voteToCountMap[key]]
                }
                
            })

            for (const yearMonth in dataByYearAndMonth) {
                let dataKey = [ yearMonth ]
                let dataValues = []

                for (const voteValue in dataByYearAndMonth[yearMonth]) {
                    dataValues.push(dataByYearAndMonth[yearMonth][voteValue])
                }

                let dataElement = dataKey.concat(dataValues)
                dataElements.push(dataElement)
            }

            let sortedDataElements = sortDataByYearAndMonth(dataElements)

            return { columns: votesByMonthColumns, rows: sortedDataElements }
        },
        resultsByMonthByCategoryData: () => {
            let resultsByMonthByCategoryColumns = []

            resultsByMonthByCategoryColumns.push(['string', 'місяць'])

            for (const themeName in readableThemeMap) {
                resultsByMonthByCategoryColumns.push(['number', readableThemeMap[themeName]])
            }

            let dataElements = []

            let dataByYearAndMonth = {}

            for (const category in categotyVotingData) {
                for (const entry in categotyVotingData[category]) {

                    let yearAndMonth = `20${categotyVotingData[category][entry].docId.substring(0, 2)}-${categotyVotingData[category][entry].docId.substring(2, 4)}`

                    if(!dataByYearAndMonth.hasOwnProperty(yearAndMonth)) {
                        dataByYearAndMonth[yearAndMonth] = {}
                        for (const themeName in readableThemeMap) {
                            dataByYearAndMonth[yearAndMonth][readableThemeMap[themeName]] = 0
                        }
                    }
                    
                    for (const theme in themeToCategoryMap) {
                        for (const categortyName in themeToCategoryMap[theme]) {
                            if(themeToCategoryMap[theme][categortyName] === category) dataByYearAndMonth[yearAndMonth][readableThemeMap[[theme]]]++
                        }
                    }
                }
            }

            for (const yearMonth in dataByYearAndMonth) {
                let dataKey = [ yearMonth ]
                let dataValues = []

                for (const voteValue in dataByYearAndMonth[yearMonth]) {
                    dataValues.push(dataByYearAndMonth[yearMonth][voteValue])
                }

                let dataElement = dataKey.concat(dataValues)
                dataElements.push(dataElement)
            }

            let sortedDataElements = sortDataByYearAndMonth(dataElements)

            return { columns: resultsByMonthByCategoryColumns, rows: sortedDataElements }
        },
        resultByMonthChartData: () => {

            let resultColumnsByMonth = []
            resultColumnsByMonth.push(['string', 'місяць'])

            for (const resultOption in resultOptions) {
                resultColumnsByMonth.push(['number', resultOptions[resultOption]])      
            }

            let dataElements = []

            let dataByYearAndMonth = {}

            flatViewData.forEach(entry => {

                let yearAndMonth = `20${entry.docId.substring(0, 2)}-${entry.docId.substring(2, 4)}`
    
                if(!dataByYearAndMonth.hasOwnProperty(yearAndMonth)) {
                    dataByYearAndMonth[yearAndMonth] = {}
                    for (const resultOption in resultOptions) {
                        dataByYearAndMonth[yearAndMonth][resultOptions[resultOption]] = 0
                    }
                }
    
                switch (entry.RESULT) {
                    case resultOptions.YES:
                        dataByYearAndMonth[yearAndMonth][resultOptions.YES]++
                        break
    
                    case resultOptions.NO:
                        dataByYearAndMonth[yearAndMonth][resultOptions.NO]++
                        break
            
                    default:
                        break
                }
                
            })
    
            for (const yearMonth in dataByYearAndMonth) {
                let dataKey = [ yearMonth ]
                let dataValues = []
    
                for (const resultValue in dataByYearAndMonth[yearMonth]) {
                    dataValues.push(dataByYearAndMonth[yearMonth][resultValue])
                }
    
                let dataElement = dataKey.concat(dataValues)
                dataElements.push(dataElement)
            }

            let sortedDataElements = sortDataByYearAndMonth(dataElements)

            return { columns: resultColumnsByMonth, rows: sortedDataElements }
        },
        landCategoryByMonthChartData: () => {
            
            let resultColumnsByMonth = [ ]
            resultColumnsByMonth.push(['string', 'місяць'])

            for (const category of themeToCategoryMap.LAND) {
                resultColumnsByMonth.push(['number', category])
            }

            let dataElements = []

            let dataByYearAndMonth = {}


            for (const category of themeToCategoryMap.LAND) {
                if(categotyVotingData.hasOwnProperty(category)) {
                    for (const entry in categotyVotingData[category]) {

                        let yearAndMonth = `20${categotyVotingData[category][entry].docId.substring(0, 2)}-${categotyVotingData[category][entry].docId.substring(2, 4)}`
    
                        if(!dataByYearAndMonth.hasOwnProperty(yearAndMonth)) {
                            dataByYearAndMonth[yearAndMonth] = {}
                            for (const categoryItem in themeToCategoryMap.LAND) {
                                dataByYearAndMonth[yearAndMonth][themeToCategoryMap.LAND[categoryItem]] = 0
                            }
                        }
                        
                        dataByYearAndMonth[yearAndMonth][category]++
                    }
                }
                
            }

            for (const yearMonth in dataByYearAndMonth) {
                let dataKey = [ yearMonth ]
                let dataValues = []

                for (const categoryValue in dataByYearAndMonth[yearMonth]) {
                    dataValues.push(dataByYearAndMonth[yearMonth][categoryValue])
                }

                let dataElement = dataKey.concat(dataValues)
                dataElements.push(dataElement)
            }

            let sortedDataElements = sortDataByYearAndMonth(dataElements)

            return { columns: resultColumnsByMonth, rows: sortedDataElements }
        }

    }
           
}

function drawPieChart(columns, rows, id) {
    google.charts.load('current', {'packages':['corechart']})
    google.charts.setOnLoadCallback(pieChartCallback)

    function pieChartCallback() {
        let drawdata = new google.visualization.DataTable()

        for (const column of columns) {
            drawdata.addColumn(column[0], column[1])
        }

        drawdata.addRows(rows)

        let piechart = new google.visualization.PieChart(document.getElementById(id))
        piechart.draw(drawdata, DONUT_CHART_OPTIONS)
    }
}

function drawColumnChart(columns, rows, id, legendPosition, percent) {
    google.charts.load('current', {'packages':['corechart', 'bar']})
    google.charts.setOnLoadCallback(drawColumnChartCallback)

    function drawColumnChartCallback() { 
        let drawdata = new google.visualization.DataTable()

        for (const column of columns) {
            drawdata.addColumn(column[0], column[1])
        }

        drawdata.addRows(rows)

        let options = {
            legend: { position: legendPosition },
            bar: { groupWidth: '50%' },
            isStacked: true,
        }

        if(percent == true) {
            options.isStacked = 'percent'
            options.vAxis = {}
            options.vAxis = {
                minValue: 0,
                ticks: [0, .3, .6, .9, 1]
            }
        } 

        let columntChart = new google.visualization.ColumnChart(document.getElementById(id))
        columntChart.draw(drawdata, options)
    }
}

function drawLineChart(columns, rows, id) {
    google.charts.load('current', {packages: ['corechart', 'line']})
    google.charts.setOnLoadCallback(drawLineChartCallback)

    function drawLineChartCallback() {
        let drawdata = new google.visualization.DataTable()

        for (const column of columns) {
            drawdata.addColumn(column[0], column[1])
        }

        drawdata.addRows(rows)

        let options = {
            curveType: 'function',
            legend: { position: 'bottom' },
            vAxis:{ viewWindow: {min: 0} }
        }

        let lineChart = new google.visualization.LineChart(document.getElementById(id))
        lineChart.draw(drawdata, options)
        
    }
}
