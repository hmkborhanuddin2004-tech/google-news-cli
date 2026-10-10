#!/usr/bin/env node

import { Command } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import { fetchNewsXml, TOPICS, resolveTopic } from '../src/api.js';
import { parseNewsXml } from '../src/parser.js';
import { displayNews, displayJson, displayError, printHeader } from '../src/ui.js';
import { runInteractiveMode } from '../src/interactive.js';

const program = new Command();

async function handleFetchNews(type, options, query = '', topic = '') {
  const spinner = !options.json ? ora({ text: 'Fetching latest news from Google News...', color: 'cyan' }).start() : null;

  try {
    const xml = await fetchNewsXml({
      type,
      query,
      topic,
      country: options.country || 'US',
      lang: options.lang || 'en'
    });

    const articles = parseNewsXml(xml);

    if (spinner) {
      spinner.stop();
    }

    if (options.json) {
      displayJson(articles, { limit: parseInt(options.number, 10) || 10 });
      return;
    }

    if (options.interactive) {
      await runInteractiveMode(articles, { limit: parseInt(options.number, 10) || 10 });
      return;
    }

    // Standard CLI display
    let title = 'Top Stories';
    let subtitle = `Region: ${options.country || 'US'} • Language: ${options.lang || 'en'}`;

    if (type === 'search') {
      title = `Search: "${query}"`;
    } else if (type === 'topic') {
      const resolved = resolveTopic(topic);
      title = `Topic: ${resolved.name || topic}`;
    }

    printHeader(title, subtitle);
    displayNews(articles, { limit: parseInt(options.number, 10) || 10 });
  } catch (error) {
    if (spinner) {
      spinner.fail('Failed to retrieve news.');
    }
    displayError(error.message);
    process.exit(1);
  }
}

program
  .name('gnews')
  .description('A fast and sleek CLI to fetch the latest Google News headlines in your terminal')
  .version('1.0.0')
  .option('-n, --number <count>', 'number of articles to show', '10')
  .option('-c, --country <code>', '2-letter country code (e.g. US, GB, IN, CA)', 'US')
  .option('-l, --lang <code>', '2-letter language code (e.g. en, fr, de, es)', 'en')
  .option('-i, --interactive', 'interactive mode with article selector and browser launcher', false)
  .option('--json', 'output articles as JSON', false);

// Default action: Top stories
program
  .action(async (opts) => {
    await handleFetchNews('top', opts);
  });

// Subcommand: Top stories
program
  .command('top')
  .description('fetch top trending stories')
  .action(async () => {
    const opts = program.opts();
    await handleFetchNews('top', opts);
  });

// Subcommand: Search
program
  .command('search <query...>')
  .description('search news stories by keyword or phrase')
  .action(async (queryParts) => {
    const opts = program.opts();
    const query = queryParts.join(' ');
    await handleFetchNews('search', opts, query);
  });

// Subcommand: Topic
program
  .command('topic <topic>')
  .description('fetch news by topic/category (e.g. technology, business, world, sports)')
  .action(async (topic) => {
    const opts = program.opts();
    await handleFetchNews('topic', opts, '', topic);
  });

// Subcommand: Topics listing
program
  .command('topics')
  .description('list all supported news topic categories')
  .action(() => {
    console.log();
    console.log(chalk.bold.bgBlue.white('  AVAILABLE TOPICS  '));
    console.log();
    for (const [key, meta] of Object.entries(TOPICS)) {
      const aliases = meta.aliases ? chalk.gray(` (aliases: ${meta.aliases.join(', ')})`) : '';
      console.log(`  • ${chalk.bold.cyan(key.padEnd(14))} - ${meta.name}${aliases}`);
    }
    console.log();
    console.log(chalk.gray('  Usage: gnews topic <name> (e.g. gnews topic technology)'));
    console.log();
  });

program.parse(process.argv);
