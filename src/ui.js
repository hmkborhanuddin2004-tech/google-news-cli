import chalk from 'chalk';

export function printHeader(title, subtitle = '') {
  console.log();
  console.log(chalk.bold.bgBlue.white(`  GOOGLE NEWS  `) + ' ' + chalk.bold.cyan(title));
  if (subtitle) {
    console.log(chalk.gray(`  ${subtitle}`));
  }
  console.log(chalk.gray('─'.repeat(Math.min(process.stdout.columns || 80, 80))));
  console.log();
}

export function displayNews(articles, options = {}) {
  if (!articles || articles.length === 0) {
    console.log(chalk.yellow('  No news articles found for this query or category.'));
    console.log();
    return;
  }

  const limit = options.limit ? Math.min(options.limit, articles.length) : articles.length;
  const itemsToDisplay = articles.slice(0, limit);

  itemsToDisplay.forEach((article, idx) => {
    const num = chalk.cyan(`[${idx + 1}]`);
    const title = chalk.bold(article.title);
    const publisher = chalk.magenta.bold(article.publisher);
    const time = chalk.gray(article.timeAgo ? `• ${article.timeAgo}` : '');
    const link = chalk.dim.underline(article.link);

    console.log(`  ${num} ${title}`);
    console.log(`      ${chalk.dim('by')} ${publisher} ${time}`);
    console.log(`      ${link}`);
    console.log();
  });

  console.log(chalk.gray(`  Showing ${itemsToDisplay.length} of ${articles.length} stories`));
  console.log();
}

export function displayJson(articles, options = {}) {
  const limit = options.limit ? Math.min(options.limit, articles.length) : articles.length;
  console.log(JSON.stringify(articles.slice(0, limit), null, 2));
}

export function displayError(message) {
  console.error();
  console.error(chalk.bgRed.white.bold(' ERROR ') + ' ' + chalk.red(message));
  console.error();
}
