# Google News CLI (gnews)

A fast, interactive, zero-configuration Node.js command-line application to fetch and browse the latest news headlines from Google News directly inside your terminal.

---

## Features

- **Zero API Key Required:** Queries official Google News RSS feeds directly.
- **Interactive Topic Navigation:** Browse Top Stories, Technology, Business, Science, Health, and Custom Search queries.
- **Interactive Terminal UI:** Powered by Inquirer for smooth keyboard selection and direct article opening in browser.
- **Lightweight & Fast:** Minimal dependencies with immediate startup time.

---

## Installation & Usage

### 1. Run directly with npx

```bash
npx gnews-cli
```

### 2. Or install globally via npm

```bash
npm install -g .
gnews
```

---

## Technical Stack

- **Runtime:** Node.js (CommonJS)
- **CLI Framework:** Inquirer.js, Chalk, Ora
- **Feed Parser:** xml2js, axios
- **Utility:** open (cross-platform URL launcher)

---

## License

This project is licensed under the MIT License.
