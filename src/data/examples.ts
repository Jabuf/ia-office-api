import { ChartData, SpreadsheetData } from '../utils/google/SheetsApiUtils'

export const spreadsheetExample: SpreadsheetData = {
  title: 'My spreadsheet title',
  sheetsData: [
    {
      name: 'MySheet1',
      tables: [
        {
          values: [
            ['Product', 'Month', 'Vendor', 'Amount'],
            ['Cheese', 'January', 'John', '150'],
            ['Cheese', 'February', 'John', '50'],
            ['Milk', 'January', 'John', '200'],
            ['Lamb', 'March', 'John', '15'],
            ['Cheese', 'February', 'Robert', '25'],
            ['Milk', 'January', 'Robert', '50'],
            ['Milk', 'February', 'Robert', '100'],
            ['Milk', 'March', 'Robert', '100'],
          ],
        },
        {
          values: [
            ['Stock', 'January', 'February', 'March'],
            ['Cheese', '200', '150', '120'],
            ['Milk', '150', '250', '320'],
            ['Lamb', '100', '50', '75'],
          ],
        },
      ],
      comment: 'Here you can find some useful comments about this sheet.',
    },
    {
      name: 'MySheet2',
      tables: [
        {
          values: [
            ['Name', 'Total Sales (€)'],
            ['John', '=SUM(FILTER(MySheet1!D2:D9,A2=MySheet1!C2:C9))'],
            ['Robert', '=SUM(FILTER(MySheet1!D2:D9,A3=MySheet1!C2:C9))'],
            ['Total', '=SUM(B2:B3)'],
          ],
        },
      ],
      comment:
        'Here you can find some useful comments.\n' +
        'You can find more information about how this work here : www.google.com',
    },
  ],
}

export const chartExample: ChartData = {
  title: 'My chart title',
  chartType: 'BAR',
  axes: [
    {
      title: 'Sales',
      position: 'BOTTOM_AXIS',
    },
    {
      title: 'Names',
      position: 'LEFT_AXIS',
    },
  ],
  series: [
    {
      series: {
        sourceRange: {
          sources: [
            {
              sheetName: 'MySheet1',
              startRowIndex: 0,
              endRowIndex: 3,
              startColumnIndex: 1,
              endColumnIndex: 2,
            },
          ],
        },
      },
      targetAxis: 'BASIC_CHART_AXIS_POSITION_UNSPECIFIED',
    },
  ],
}
