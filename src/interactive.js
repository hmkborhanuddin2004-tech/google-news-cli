import { select } from '@inquirer/prompts';
import open from 'open';
import chalk from 'chalk';

export async function runInteractiveMode(articles, options = {}) {
  const limit = options.limit ? Math.min(options.limit, articles.length) : articles.length;
  const items = articles.slice(0, limit);

  if (items.length === 0) {
    console.log(chalk.yellow('No articles available for interactive browsing.'));
    return;
  }

  let running = true;

  while (running) {
    console.clear();
    console.log(chalk.bold.bgBlue.white('  GOOGLE NEWS INTERACTIVE READER  '));
    console.log(chalk.gray('Use arrow keys to navigate, Enter to select, or choose Exit.\n'));

    const choices = items.map((art, idx) => ({
      name: `${chalk.cyan(`[${idx + 1}]`)} ${art.title.slice(0, 65)}${art.title.length > 65 ? '...' : ''} ${chalk.magenta(`(${art.publisher})`)}`,
      value: art
    }));

    choices.push({
      name: chalk.red('Exit interactive mode'),
      value: 'exit'
    });

    try {
      const selected = await select({
        message: 'Select an article to view or open:',
        choices,
        pageSize: 12
      });

      if (selected === 'exit') {
        running = false;
        console.log(chalk.green('\nGoodbye!'));
        break;
      }

      console.log('\n' + chalk.gray('─'.repeat(80)));
      console.log(chalk.bold.yellow(`Headline:  `) + chalk.bold(selected.title));
      console.log(chalk.bold.yellow(`Publisher: `) + chalk.magenta(selected.publisher));
      console.log(chalk.bold.yellow(`Published: `) + chalk.white(selected.pubDate || 'Unknown') + ` (${chalk.cyan(selected.timeAgo || 'recent')})`);
      console.log(chalk.bold.yellow(`Link:      `) + chalk.underline.cyan(selected.link));
      console.log(chalk.gray('─'.repeat(80)) + '\n');

      const action = await select({
        message: 'What would you like to do?',
        choices: [
          { name: '🌐  Open article in web browser', value: 'open' },
          { name: '↩️   Back to headlines list', value: 'back' },
          { name: '❌  Exit', value: 'exit' }
        ]
      });

      if (action === 'open') {
        console.log(chalk.green(`\nOpening ${selected.link} in your browser...`));
        try {
          await open(selected.link);
        } catch (openErr) {
          console.log(chalk.red(`Failed to launch browser: ${openErr.message}`));
        }
        await new Promise(r => setTimeout(r, 1500));
      } else if (action === 'exit') {
        running = false;
        console.log(chalk.green('\nGoodbye!'));
        break;
      }
    } catch (err) {
      // User pressed Ctrl+C or exited prompt
      running = false;
      console.log();
      break;
    }
  }
}
