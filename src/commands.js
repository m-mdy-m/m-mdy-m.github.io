import { buildVirtualFS } from './tree';

const contentModules = import.meta.glob('/src/content/**/*.md', { eager: true });

const contentEntries = Object.entries(contentModules).map(([file, mod]) => ({
  file,
  module: mod,
}));

const commandRegistry = {
  // Basic commands
  help: {
    description: 'Display available commands',
    execute: async () => {
      return generateHelpOutput();
    },
  },

  ls: {
    description: 'List directory contents',
    execute: async args => {
      return generateLsOutput(args);
    },
  },

  cat: {
    description: 'Display file contents',
    execute: async args => {
      if (!args || args.length === 0) {
        return errorOutput('Missing filename. Usage: cat [filename]');
      }

      return generateCatOutput(args[0]);
    },
  },

  cd: {
    description: 'Change directory',
    execute: async args => {
      if (!args || args.length === 0) {
        return textOutput('Current directory: /home/x0');
      }

      const directory = args[0];

      if (directory === '..') {
        // Navigate to the previous URL
        const currentPath = window.location.pathname.split('/');
        if (currentPath.length > 1) {
          currentPath.pop();
          const newPath = currentPath.join('/') || '/';
          window.location.href = newPath;
          return textOutput(`Navigating to ${newPath}...`);
        } else {
          return textOutput('Already at root directory.');
        }
      }

      // Handle navigation to specific directories
      const validDirectories = ['posts', 'projects', 'articles', 'about', 'contact'];

      if (validDirectories.includes(directory)) {
        window.location.href = `/${directory}`;
        return textOutput(`Navigating to /${directory}...`);
      } else {
        return errorOutput(`Directory '${directory}' not found.`);
      }
    },
  },

  whoami: {
    description: 'Display user information',
    execute: async () => {
      return commandRegistry['cat'].execute(['whoami.md']);
    },
  },

  clear: {
    description: 'Clear the terminal',
    execute: async () => {
      document.getElementById('terminal-output').innerHTML = '';
      return '';
    },
  },

  // Additional commands
  github: {
    description: 'Open GitHub profile',
    execute: async () => {
      window.open('https://github.com/m-mdy-m', '_blank');
      return textOutput('Opening GitHub profile...');
    },
  },

  pwd: {
    description: 'Print working directory',
    execute: async () => {
      const path = window.location.pathname || '/';
      return textOutput(`/home/x0${path}`);
    },
  },

  date: {
    description: 'Display current date and time',
    execute: async () => {
      const now = new Date();
      return textOutput(now.toUTCString());
    },
  },

  echo: {
    description: 'Display a line of text',
    execute: async args => {
      if (!args || args.length === 0) {
        return textOutput('');
      }

      return textOutput(args.join(' '));
    },
  },

  history: {
    description: 'Display command history',
    execute: async () => {
      const commandHistory = window.terminalHistory || [];

      if (commandHistory.length === 0) {
        return textOutput('No command history.');
      }

      let historyOutput = `
        <h2 class="text-terminal-accent text-xl mb-4">Command History:</h2>
        <div class="space-y-1">
      `;

      commandHistory.forEach((cmd, index) => {
        historyOutput += `<div><span class="text-terminal-muted">${index + 1}</span> <span class="text-terminal-text">${cmd}</span></div>`;
      });

      historyOutput += '</div>';
      return historyOutput;
    },
  },

  man: {
    description: 'Display manual page for a command',
    execute: async args => {
      if (!args || args.length === 0) {
        return errorOutput('What manual page do you want? Usage: man [command]');
      }

      const command = args[0].toLowerCase();

      if (!commandRegistry[command]) {
        return errorOutput(`No manual entry for ${command}`);
      }

      return generateManOutput(command);
    },
  },

  uname: {
    description: 'Print system information',
    execute: async () => {
      return textOutput('AstroOS Terminal v1.0.0');
    },
  },

  neofetch: {
    description: 'Display system information in a visually pleasing way',
    execute: async () => {
      return generateNeofetchOutput();
    },
  },
};

// Helper functions to generate command outputs
function textOutput(text) {
  return `<div class="text-terminal-muted">${text}</div>`;
}

function errorOutput(text) {
  return `<div class="text-terminal-red">${text}</div>`;
}

function generateHelpOutput() {
  let output = `
    <h2 class="text-terminal-accent text-xl mb-4">Available Commands:</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 ml-4">
  `;

  Object.entries(commandRegistry).forEach(([cmd, info]) => {
    output += `
      <div class="terminal-command-help">
        <span class="text-terminal-text">${cmd}</span>
        <span class="text-terminal-muted"> - ${info.description}</span>
      </div>
    `;
  });

  output += '</div>';
  return output;
}

function generateLsOutput(args = []) {
  const virtualFS = buildVirtualFS(contentEntries);

  let pathParts = args.length > 0 ? args[0].split('/') : [];
  let current = virtualFS;

  for (let part of pathParts) {
    if (!current[part]) {
      return errorOutput(`ls: cannot access '${args[0]}': No such file or directory`);
    }
    if (current[part].__file) {
      return errorOutput(`ls: cannot open '${args[0]}': Not a directory`);
    }
    current = current[part];
  }

  const items = Object.entries(current).sort(([a], [b]) => a.localeCompare(b));
  const now = new Date().toDateString();

  const htmlItems = items.map(([name, value]) => {
    const isDir = !value.__file;
    const displayName = isDir ? name + '/' : name + '.md';
    const href = '/' + (args[0] ? args[0] + '/' : '') + name;
    const date = now;

    return `
      <div class="flex">
        <span class="w-32 text-terminal-muted">${date}</span>
        <a href="${href}" class="text-terminal-accent">${displayName}</a>
      </div>
    `;
  });

  return `
    <h2 class="text-terminal-accent text-xl mb-4">Directory Contents${args[0] ? `: ${args[0]}` : ''}</h2>
    <div class="grid grid-cols-1 gap-1">
      ${htmlItems.join('\n')}
    </div>
  `;
}

async function generateCatOutput(filename) {
  const entry = contentEntries.find(e => {
    const file = e.file;
    return file.endsWith(filename);
  });
  if (entry) {
    const html = await entry.module.compiledContent();
    return html;
  }

  return errorOutput(`File '${filename}' not found.`);
}

function generateManOutput(command) {
  const cmd = commandRegistry[command];

  if (!cmd) {
    return errorOutput(`No manual entry for ${command}`);
  }

  return `
    <h2 class="text-terminal-accent text-xl mb-4">Manual: ${command}</h2>
    <div class="space-y-2">
      <p><span class="text-terminal-text font-bold">NAME</span></p>
      <p class="ml-4">${command} - ${cmd.description}</p>

      <p><span class="text-terminal-text font-bold">SYNOPSIS</span></p>
      <p class="ml-4">${getCommandSynopsis(command)}</p>

      <p><span class="text-terminal-text font-bold">DESCRIPTION</span></p>
      <p class="ml-4">${getCommandDescription(command)}</p>
    </div>
  `;
}

function getCommandSynopsis(command) {
  const synopses = {
    ls: 'ls [directory]',
    cat: 'cat filename',
    cd: 'cd [directory]',
    whoami: 'whoami',
    clear: 'clear',
    github: 'github',
    pwd: 'pwd',
    date: 'date',
    echo: 'echo [text]',
    history: 'history',
    man: 'man command',
    uname: 'uname',
    neofetch: 'neofetch',
    help: 'help',
  };

  return synopses[command] || command;
}

function getCommandDescription(command) {
  const descriptions = {
    ls: 'List information about the files and directories in the current directory.',
    cat: 'Concatenate and display the content of files.',
    cd: 'Change the current directory. Use "cd .." to go up one level.',
    whoami: 'Display information about the user.',
    clear: 'Clear the terminal screen.',
    github: 'Open the GitHub profile in a new tab.',
    pwd: 'Print the current working directory.',
    date: 'Display the current date and time.',
    echo: 'Display a line of text.',
    history: 'Display the command history.',
    man: 'Display the manual page for a command.',
    uname: 'Print system information.',
    neofetch: 'Display system information in a visually pleasing way.',
    help: 'Display a list of available commands.',
  };

  return descriptions[command] || commandRegistry[command].description;
}

function generateNeofetchOutput() {
  return `
    <div class="flex flex-col md:flex-row gap-4 text-sm font-mono text-terminal-primary">
  <pre class="text-terminal-blue">
      /\\
     /  \\
    /\\   \\
   /      \\
  /   ,,   \\
 /   |  |  -\\
/_-''    ''-_\\
  </pre>
  <div class="flex flex-col justify-center space-y-1">
    <div>
      <span class="text-terminal-accent font-bold w-24 inline-block">Platform:</span>
      Powered by Astro
    </div>
    <div>
      <span class="text-terminal-accent font-bold w-24 inline-block">Host:</span>
      x0
    </div>
    <div>
      <span class="text-terminal-accent font-bold w-24 inline-block">Package Manager:</span>
      pnpm
    </div>
    <div>
      <span class="text-terminal-accent font-bold w-24 inline-block">Shell:</span>
      x0sh
    </div>
    <div>
      <span class="text-terminal-accent font-bold w-24 inline-block">Environment:</span>
      Browser-based
    </div>
    <div>
      <span class="text-terminal-accent font-bold w-24 inline-block">Font:</span>
      IBM Plex Mono
    </div>
    <div>
      <span class="text-terminal-accent font-bold w-24 inline-block">Engine:</span>
      JavaScript
    </div>
  </div>
</div>

  `;
}
export { commandRegistry, textOutput, errorOutput };
