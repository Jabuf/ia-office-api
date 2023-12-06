import { ChartData, SpreadsheetData } from '../google/SheetsApiUtils'
import { DocumentData } from '../google/DocsApiUtils'

export const spreadsheetExample: SpreadsheetData = {
  title: 'My spreadsheet title',
  sheetsData: [
    {
      name: 'MySheet1',
      tables: [
        {
          values: [
            ['Pokemon', 'Encounter', 'Shiny'],
            ['Magikarp', '250', '2'],
            ['Roucool', '137', '0'],
            ['Magmar', '208', '1'],
            ['Canarticho', '853', '2'],
          ],
        },
      ],
      comment: `Here you can find some useful comments about this sheet.
      My comment should be spread on multiple lines if it's too long.`,
    },
    {
      name: 'MySheet2',
      tables: [
        {
          values: [
            ['Encounter', 'Shiny', 'Percentage'],
            [
              "=SUM('MySheet1'!B2:B5)",
              "=SUM('MySheet1'!C2:C5)",
              '=DIVIDE(B2,A2)',
            ],
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
      order: 0,
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
