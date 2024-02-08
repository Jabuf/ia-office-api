# IA Office

## Overview

IA Office is an API that allow the generation of office files (docs, sheets, and slides) from a simple prompt. This versatile tool enables users to create a wide range of office documents effortlessly.

**Disclaimer:** This project is still early in the development phase and is subject to major changes, including potential removal or renaming of endpoints.

## Features

- **Office File Generation:** Quickly generate office files with a single call to the API and a simple prompt.
- **Ease of Use:** A user-friendly approach for creating a variety of office documents without the need for complex configurations or specific knowledge.

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Jabuf/ia-office-api.git
   ```

2. **Configure Environment Variables:**
   - Rename the `.env.template` file to `.env`.
   - Replace the necessary values in the `.env` file.

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Run the Application:**
   ```bash
   npm run dev
   ```

## Roadmap
- [x] Add Docs generation
- [x] Dissociate Docs generation into mutliple templates
- [x] Split Sheets generation into multiple LLM interactions
- [ ] Implement Slides generation
- [ ] Rework charts generation

## Contributing

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement" or "bug". Don't forget to give the project a star! Thanks again!

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and ensure the code style adheres to the project's guidelines.
4. Write tests if applicable.
5. Submit a pull request.

For major changes, please open an issue first to discuss the proposed changes and ensure they align with the project's direction.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

[github](https://github.com/Jabuf) - [mail](jason.buffet.pro@gmail.com)
