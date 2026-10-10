# Google News CLI (`gnews`)

A fast, interactive, zero-configuration Node.js command-line application to fetch and browse the latest news headlines from Google News.

## Features

- ⚡ **Zero API Key Needed**: Uses official Google News RSS feeds directly.
- 🌐 **Top Stories, Categories & Search**: Browse top news, specific sections (technology, business, world, etc.), or search for any keyword.
- 🌍 **Localized Feeds**: Filter news by country/region (`-c US`, `-c GB`, `-c IN`, etc.) and language (`-l en`, `-l es`, etc.).
- 🎮 **Interactive Mode (`-i`)**: Browse headlines with arrow keys and open chosen articles directly in your web browser.
- 📦 **JSON Output (`--json`)**: Stream formatted JSON for scripting or piping to tools like `jq`.
- 🎨 **Beautiful Terminal UI**: Colored tags for publishers, publication times (e.g. `2h ago`), spinners, and clickable URLs.

---

## Installation & Setup

Navigate to the project directory:

```bash
cd google-news-cli
npm install
```

### Optional: Global CLI link
To run `gnews` or `google-news` directly anywhere from your terminal:

```bash
npm link
```

---

## Usage & Examples

### 1. Fetch Top Headlines (Default)
```bash
node bin/index.js
# Or if linked:
gnews
```

Control article count (default is 10):
```bash
node bin/index.js -n 5
```

---

### 2. Fetch News by Topic / Category
```bash
node bin/index.js topic technology
node bin/index.js topic business -n 5
node bin/index.js topic world
```

To see all supported topics:
```bash
node bin/index.js topics
```
> Supported topics: `world`, `nation`, `business` (`biz`), `technology` (`tech`), `entertainment`, `sports` (`sport`), `science` (`sci`), `health`.

---

### 3. Search News by Keyword
```bash
node bin/index.js search "artificial intelligence" -n 5
node bin/index.js search "NASA Mars"
```

---

### 4. Interactive Mode
Browse headlines using your arrow keys, press Enter to view article metadata, and open stories directly in your default browser:

```bash
node bin/index.js -i
node bin/index.js topic tech -i
node bin/index.js search "web development" -i
```

---

### 5. Filter by Country & Language
Get localized news from the UK, India, Canada, etc.:

```bash
node bin/index.js -c GB -n 5
node bin/index.js -c IN -n 5
node bin/index.js -c CA -n 5
```

---

### 6. Raw JSON Output
Ideal for scripting, automation, or piping:

```bash
node bin/index.js -n 3 --json
```

---

## Command Options Reference

| Option | Flag | Description | Default |
|---|---|---|---|
| `--number <count>` | `-n` | Number of articles to retrieve | `10` |
| `--country <code>` | `-c` | 2-letter ISO country code (e.g. `US`, `GB`, `IN`) | `US` |
| `--lang <code>` | `-l` | 2-letter ISO language code (e.g. `en`, `es`, `fr`) | `en` |
| `--interactive` | `-i` | Interactive terminal UI with browser launch support | `false` |
| `--json` | | Output raw JSON data | `false` |
| `--help` | `-h` | Display command-line help | |
