# [Візуалізація відкритих даних](https://beyond-danube.github.io/kmr-viz/) щодо поіменних голосувань Київради
Київрада публікує відкриті дані, а тут вони візуалізовані.
  
Досить очевидно, голосування не мають сенсу, адже майже ніколи не мають голосів «Проти», тобто все що винесене на голосування з високою ймовірністю буде прийнятим.

## Про проєкт
Наявніть відкритих даних щодо державних стуктур — великий крок суспільтва і держави. Не все виходить з першого разу, проте ми перші хто проаналізував ці дані.

## Про дані
Структура відкритих даних та повнота даних на яких побудовані графіки надана на [cайті КМДА](https://kmr.gov.ua/uk/result_golosuvanya).
  
Дані не повні, деталі рішень не представлені у форматі відкритих даних, тому ми зробили лінк на конкретні рішення через пошук у Google та прямі лінки на портал КМДА. 
  
Наприклад, нас цікавить рішення з певним номером, скажімо №430395651. Його неможливо отримати у зрозумілому форматі, а можливо тільки чере портал. Тому ми додали лінк на Google пошук у таблитці «Всі рішення списком», щоб хоч якось отримати деталі.
  
Щоб знайти деталі, у таблиці рішень треба натиснути на номер рішення, це приведе на сторінку пошуку, наприклад [430395651](https://www.google.com/search?q=%22430395651%22), звідти перший результат приведе знов на [портал КМДА](https://kmr.gov.ua/en/node/42312) — тут варто зауважити, що номер не співпадає, а якийсь новий. Тут внизу знов знаходимо лінк про відкриті дані, в цьому прикладі — [цей лінк](https://kmr.ligazakon.net/?dbegin=21.10.2021&dend=21.10.2021&number=3081%2F3122&status=ALL&srt=1&max=100), після чого натискаємо на ще один лінк з [нашим документом](https://kmr.ligazakon.net/document/mr212890$2021_10_21)
  
Як бачимо, задача знайти тескт рішення досить нетривіальна, навіть знаючи номер документу.
  
## Ще про дані
Дані, які є дійсно відкритими (у форматі JSON, який дає можливіть машинного аналізу і візуалізації) теж мають ряд труднощів, окремий проєкт із просто збору даних, та приведеням їх до вигляду де можливий аналіз — [окремий репозиторій](https://github.com/beyond-danube/kmr-data/)
