const MAIN_VOTING_CHART_DIV = 'sankey_voting'

let yearDefined;
let monthDefined;

async function drawChart(year, month) {
    google.charts.load('current', {'packages':['sankey']})
    google.charts.setOnLoadCallback(drawSankeyChart)

    yearDefined = year
    monthDefined = month

    async function drawSankeyChart() {

        var data = new google.visualization.DataTable();
        data.addColumn('string', 'From');
        data.addColumn('string', 'To');
        data.addColumn('number', 'Weight');
    
        let datarows = []    
        let drawdata = []
    
        let dataFiles = await getDateMap()
    
        for await (const dataFile of dataFiles[yearDefined][monthDefined]) {
            let res = await getDataFile(dataFile)
            datarows.push(res)
        }
    
        let categoryVoting = {}
      
        datarows.forEach(row => {
    
            let category = guessCategory(row.GL_Text)
    
            if(categoryVoting.hasOwnProperty(category)) {
            categoryVoting[category].push(row)
            } else {
            categoryVoting[category] = []
            categoryVoting[category].push(row)
            }
            
        })
    
        console.log(categoryVoting)
    
    
        for (const themeKey in themeToCategoryMap) {
            for (const categoryKey in categoryVoting) {
            if(themeToCategoryMap[themeKey].includes(categoryKey)) {
                drawdata.push( [ readableThemeMap[themeKey], categoryKey, 100* categoryVoting[categoryKey].length ] )
            }
            }
        }
    
        for (const categoryKey in categoryVoting) {
            for (const voteKey in voteOptions) {
            drawdata.push([ categoryKey, voteOptions[voteKey], categoryVoting[categoryKey].map(e => e.DPList).flat().filter(g => g.DPGolos == voteOptions[voteKey]).length ])
            }
        }
    
        for (const resultKey in resultOptions) {
            resultRows = datarows.filter(row => row.RESULT == resultOptions[resultOptions])
            for (const voteKey in voteOptions) {
            drawdata.push( [ voteOptions[voteKey], resultOptions[resultKey], datarows.filter(row => row.RESULT == resultOptions[resultKey]).map(e => e.DPList).flat().filter(g => g.DPGolos == voteOptions[voteKey]).length ] )
            }
        }
    
    
        data.addRows(drawdata);
    
        // Sets chart options.
        var options = {
            width: Window.innerWidth,
            height: Window.innerHeight
        };
    
        var chart = new google.visualization.Sankey(document.getElementById(MAIN_VOTING_CHART_DIV));
        chart.draw(data);
    }
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
    else if (topic.includes('Про реорганізацію комунального') || (topic.includes('реорганізацію') && topic.includes('комунальній власності'))) return 'Реорганізацію комунального закладів або підприємства'
    else if (topic.includes('реорганізацію Київського міського')) return 'Реорганізацію комунального закладів або підприємства'
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


    else return 'Інша категорія'
}
