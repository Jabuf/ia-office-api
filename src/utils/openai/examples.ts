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

export const letterExample: DocumentData = {
  title: 'Notice of Lease Termination',
  content: [
    {
      order: 0,
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

export const mailExample: DocumentData = {
  title: 'Christmas Vacation and Office Closure',
  content: [
    {
      order: 0,
      text: `Subject: Christmas Vacation and Office Closure

    Dear [Team/Employee Name],
    
    I hope this message finds you well. As we approach the festive season, I wanted to take a moment to inform you about our company's plans for the Christmas holiday.
    
    In celebration of Christmas, [Company Name] will be closed from [Start Date] to [End Date]. During this period, all employees are encouraged to take some well-deserved time off to rest and recharge.
    
    Key details about the office closure:
    
    Dates: [Start Date] to [End Date]
    Office Closure: The office will be closed during this time.
    Availability: [Optional: Mention if there's any need for employees to be reachable in case of emergencies, or specify the point of contact.]
    We believe that taking time to relax and spend quality moments with family and friends is essential, especially during the holiday season. We appreciate your hard work and dedication throughout the year, and we want to ensure that everyone has the opportunity to enjoy a joyful and restful Christmas break.
    
    If you have any urgent matters or concerns that need attention before the holiday closure, please feel free to reach out to [Point of Contact] at [Contact Information].
    
    Wishing you and your loved ones a wonderful holiday season filled with joy and happiness. We look forward to reconvening in the new year, refreshed and ready for new challenges and successes.
    
    Thank you for your understanding, and enjoy your well-deserved break!
    
    Best regards,
    
    [Your Full Name]
    [Your Position]
    [Company Name]
    [Contact Information]`,
    },
  ],
}

export const blockExample: DocumentData = {
  title: 'Important Notice: COVID-19 Safety Guidelines',
  content: [
    {
      order: 0,
      sectionName: 'Important Notice: COVID-19 Safety Guidelines',
      text: `Dear [Team/Employee Name],

    As we continue to navigate the challenges posed by the COVID-19 pandemic, the health and well-being of our employees remain our top priority. We are committed to ensuring a safe working environment for everyone. Please take a moment to review the following safety guidelines and precautions that should be observed while working:
    
    Health Monitoring:
    
    Self-Assessment: Conduct a self-assessment each day before coming to the office. If you experience any symptoms such as fever, cough, or difficulty breathing, please stay home and notify your supervisor.
    Hygiene Practices:
    
    Hand Hygiene: Wash your hands frequently with soap and water for at least 20 seconds. Hand sanitizer stations are available throughout the office for your convenience.
    Respiratory Etiquette: Cover your mouth and nose with a tissue or your elbow when coughing or sneezing. Dispose of used tissues properly.
    Social Distancing:
    
    Maintain Distance: Practice social distancing by keeping a minimum of [X feet/meters] distance from your colleagues.
    Meeting Protocols: Whenever possible, opt for virtual meetings. If in-person meetings are necessary, ensure that the meeting space allows for adequate distancing.
    Mask Usage:
    
    Mask Requirement: Masks are required in all common areas and when social distancing is not possible. Please ensure that your mask covers your nose and mouth.
    Sanitization Measures:
    
    Workstation Sanitization: Regularly clean and disinfect your workstation, including desk surfaces, keyboards, and mouse.
    Common Areas: Follow posted guidelines for the sanitization of common areas such as breakrooms and restrooms.
    Reporting Symptoms or Exposure:
    
    Immediate Reporting: If you experience COVID-19 symptoms or have been in contact with someone who has tested positive, report it to your supervisor immediately.
    These guidelines are in place to protect the health and safety of everyone in our workplace. We appreciate your cooperation in adhering to these measures and helping us maintain a secure working environment.
    
    If you have any questions or concerns, please do not hesitate to reach out to [Contact Person] at [Contact Information].
    
    Thank you for your continued dedication and commitment to the well-being of our team.
    
    Stay safe and healthy!
    
    Best regards,
    
    [Your Full Name]
    [Your Position]
    [Company Name]
    [Contact Information]`,
    },
  ],
}

export const presentationExample: DocumentData = {
  title: 'The Impact of Artificial Intelligence on Business',
  content: [
    {
      order: 0,
      sectionName: 'Introduction',
      text: `Welcome and Introduction
        Briefly introduce the topic: "The Impact of Artificial Intelligence on Business."
        Highlight the growing significance of AI in today's business landscape.`,
    },
    {
      order: 1,
      sectionName: 'What is Artificial Intelligence?',
      text: `Definition of AI
          Explain the concept of artificial intelligence and its evolution.
        Types of AI
          Briefly introduce categories like narrow AI and general AI.`,
    },
    {
      order: 2,
      sectionName: 'Current State of AI in Business',
      text: `Overview
          Provide a snapshot of how AI is currently being used in various industries.
        Real-world Examples
          Highlight specific examples of AI applications in business, such as chatbots, predictive analytics, and automation.`,
    },
    {
      order: 3,
      sectionName: 'Benefits of AI in Business',
      text: `Increased Efficiency
          Discuss how AI contributes to increased operational efficiency.
        Cost Savings
          Explore how AI can lead to cost reductions through automation and optimization.
        Improved Decision-Making
          Explain how AI-driven insights empower better decision-making processes.`,
    },
    {
      order: 4,
      sectionName: 'Future Trends in AI',
      text: `Integration with Emerging Technologies
        Explore how AI is likely to integrate with other emerging technologies.
      Advancements in AI Research
        Highlight ongoing research and potential breakthroughs in AI.`,
    },
    {
      order: 5,
      sectionName: 'Conclusion',
      text: `Recap Key Points
        Summarize the impact of AI on business.
      Closing Remarks
        Thank the audience for their attention and invite questions.`,
    },
  ],
}

export const documentExamples = {
  block: blockExample,
  letter: letterExample,
  mail: mailExample,
  presentation: presentationExample,
}
