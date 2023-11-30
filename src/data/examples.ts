import { ChartData, SpreadsheetData } from '../utils/google/SheetsApiUtils'
import { DocumentData } from '../utils/google/DocsApiUtils'

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
      ],
      comment: 'Here you can find some useful comments about this sheet.',
    },
    {
      name: 'MySheet2',
      tables: [
        {
          values: [
            ['Name', 'Total Sales (€)'],
            ['John', "=SUM(FILTER('MySheet1'!D2:D9,A2='MySheet1'!C2:C9))"],
            ['Robert', "=SUM(FILTER('MySheet1'!D2:D9,A3='MySheet1'!C2:C9))"],
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

export const documentExample: DocumentData = {
  title: 'Notice of Lease Termination',
  content: [
    {
      order:0,
      sectionName: '',
      text: `[Your Name]
    [Your Address]
    [City, State, ZIP Code]
    [Email Address]
    [Phone Number]
    [Date]
    
    [Landlord's Name]
    [Landlord's Address]
    [City, State, ZIP Code]
    
    Dear [Landlord's Name],
    
    I hope this letter finds you well. I am writing to officially inform you that I will be terminating my lease agreement for the property located at [Your Current Address]. After careful consideration, I have decided to move out, and my last day in the property will be [Intended Move-Out Date, typically 30 days from the date of the letter].
    
    I have thoroughly enjoyed my time living at [Your Current Address] and appreciate your prompt attention to any maintenance requests and concerns. I believe this decision is in my best interest at this time.
    
    To facilitate a smooth transition, I commit to fulfilling the terms of the lease agreement, including [mention any specific requirements outlined in your lease]. I am more than willing to cooperate with you to schedule a move-out inspection and address any necessary arrangements to return the keys.
    
    Please find my forwarding address for the return of my security deposit. You can send it to:
    
    [Your New Address]
    [City, State, ZIP Code]
    
    I kindly request your assistance in coordinating the final inspection and settling any outstanding matters related to my tenancy. I would appreciate it if we could schedule a mutually convenient time for the move-out inspection.
    
    I would like to express my gratitude for your understanding and cooperation during my time as your tenant. If you require any additional information or need further clarification, please feel free to contact me at [Your Phone Number] or [Your Email Address].
    
    Thank you for your attention to this matter. I look forward to a smooth transition during the move-out process.
    
    Sincerely,
    
    [Your Full Name]`,
    },
  ],
}
