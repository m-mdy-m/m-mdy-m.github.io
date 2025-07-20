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
  fortune: {
    description: 'Display a random fortune or quote',
    execute: async () => {
      const fortunes = [
        '"The only way to do great work is to love what you do." - Steve Jobs',
        '"Life is what happens to you while you\'re busy making other plans." - John Lennon',
        '"The future belongs to those who believe in the beauty of their dreams." - Eleanor Roosevelt',
        '"It is during our darkest moments that we must focus to see the light." - Aristotle',
        '"The only impossible journey is the one you never begin." - Tony Robbins',
        '"In the middle of difficulty lies opportunity." - Albert Einstein',
        '"Code is like humor. When you have to explain it, it\'s bad." - Cory House',
        '"First, solve the problem. Then, write the code." - John Johnson',
        '"Experience is the name everyone gives to their mistakes." - Oscar Wilde',
        '"The best time to plant a tree was 20 years ago. The second best time is now." - Chinese Proverb'
      ];
      
      const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      return `
        <div class="border-l-4 border-terminal-accent pl-4 py-2">
          <span class="text-terminal-text">${randomFortune}</span>
        </div>
      `;
    },
  },

  matrix: {
    description: 'Enter the Matrix (animated green text)',
    execute: async () => {
      const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
      let output = '<div class="matrix-rain font-mono text-green-400 text-sm leading-tight overflow-hidden h-64">';
      
      for (let i = 0; i < 20; i++) {
        output += '<div class="matrix-column inline-block w-4 align-top">';
        for (let j = 0; j < 30; j++) {
          const randomChar = chars[Math.floor(Math.random() * chars.length)];
          const opacity = Math.random() * 0.8 + 0.2;
          output += `<div style="opacity: ${opacity}; animation-delay: ${Math.random() * 2}s">${randomChar}</div>`;
        }
        output += '</div>';
      }
      
      output += '</div>';
      output += `
        <div class="mt-4 text-center">
          <span class="text-terminal-accent">Welcome to the Matrix, Neo...</span>
        </div>
        <style>
          .matrix-rain div {
            animation: matrix-fall 3s linear infinite;
          }
          @keyframes matrix-fall {
            0% { transform: translateY(-100px); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(100px); opacity: 0; }
          }
        </style>
      `;
      
      return output;
    },
  },

  tree: {
    description: 'Display directory tree structure',
    execute: async args => {
      const virtualFS = buildVirtualFS(contentEntries);
      
      function buildTree(obj, prefix = '', isLast = true) {
        let result = '';
        const entries = Object.entries(obj).filter(([key]) => key !== '__file');
        
        entries.forEach(([key, value], index) => {
          const isLastEntry = index === entries.length - 1;
          const connector = isLastEntry ? '└── ' : '├── ';
          const isDir = !value.__file;
          const displayName = isDir ? `📁 ${key}/` : `📄 ${key}.md`;
          
          result += `${prefix}${connector}<span class="text-terminal-accent">${displayName}</span>\n`;
          
          if (isDir && Object.keys(value).length > 1) {
            const newPrefix = prefix + (isLastEntry ? '    ' : '│   ');
            result += buildTree(value, newPrefix, isLastEntry);
          }
        });
        
        return result;
      }
      
      const treeOutput = buildTree(virtualFS);
      
      return `
        <div class="font-mono text-sm">
          <h3 class="text-terminal-accent text-lg mb-3">📂 Project Structure</h3>
          <pre class="whitespace-pre-wrap">${treeOutput}</pre>
        </div>
      `;
    },
  },

  cowsay: {
    description: 'Make a cow say something',
    execute: async args => {
      const message = args.length > 0 ? args.join(' ') : 'Hello World!';
      const messageLength = message.length;
      const topBorder = ' ' + '_'.repeat(messageLength + 2);
      const bottomBorder = ' ' + '-'.repeat(messageLength + 2);
      
      return `
        <pre class="text-terminal-text font-mono text-sm">
${topBorder}
< ${message} >
${bottomBorder}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
        </pre>
      `;
    },
  },

  figlet: {
    description: 'Create ASCII art text',
    execute: async args => {
      const text = args.length > 0 ? args.join(' ').toUpperCase() : 'X0';
      
      const asciiMap = {
        'A': ['  ██  ', ' ████ ', '██  ██', '██████', '██  ██'],
        'B': ['██████', '██  ██', '██████', '██████', '██████'],
        'C': [' █████', '██    ', '██    ', '██    ', ' █████'],
        'H': ['██  ██', '██  ██', '██████', '██  ██', '██  ██'],
        'E': ['██████', '██    ', '█████ ', '██    ', '██████'],
        'L': ['██    ', '██    ', '██    ', '██    ', '██████'],
        'O': [' █████', '██  ██', '██  ██', '██  ██', ' █████'],
        'X': ['██  ██', ' ████ ', '  ██  ', ' ████ ', '██  ██'],
        '0': [' █████', '██  ██', '██ ███', '██  ██', ' █████'],
        ' ': ['      ', '      ', '      ', '      ', '      ']
      };
      
      let result = '<pre class="text-terminal-accent font-mono text-xs leading-tight">';
      
      for (let row = 0; row < 5; row++) {
        let line = '';
        for (let char of text) {
          if (asciiMap[char]) {
            line += asciiMap[char][row] + ' ';
          } else {
            line += '██████ '; // Default block for unknown chars
          }
        }
        result += line + '\n';
      }
      
      result += '</pre>';
      return result;
    },
  },

  calc: {
    description: 'Simple calculator',
    execute: async args => {
      if (!args || args.length === 0) {
        return errorOutput('Usage: calc [expression] (e.g., calc 2 + 3 * 4)');
      }
      
      try {
        const expression = args.join(' ');
        // Simple math evaluation (be careful with eval in real applications!)
        const result = Function(`"use strict"; return (${expression})`)();
        
        return `
          <div class="space-y-2">
            <div><span class="text-terminal-text">Expression:</span> <span class="text-terminal-text">${expression}</span></div>
            <div><span class="text-terminal-text">Result:</span> <span class="text-terminal-accent text-lg">${result}</span></div>
          </div>
        `;
      } catch (error) {
        return errorOutput(`Invalid expression: ${error.message}`);
      }
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
    <div class="flex flex-col lg:flex-row gap-6 text-sm font-mono text-terminal-primary">
      <div class="flex-shrink-0">
        <pre class="text-terminal-blue text-xs leading-tight">
    ╭─────────────────────────╮
    │ ◈ ░░░░░░░░░░░░░░░░░░░░ ◈ │
    │ ░ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ░ │
    │ ░ ▓                ▓ ░ │
    │ ░ ▓  ╭──────────╮  ▓ ░ │
    │ ░ ▓  │ ▪▪    ▪▪ │  ▓ ░ │
    │ ░ ▓  │    ──    │  ▓ ░ │
    │ ░ ▓  ╰──────────╯  ▓ ░ │
    │ ░ ▓                ▓ ░ │
    │ ░ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ░ │
    │ ◈ ░░░░░░░░░░░░░░░░░░░░ ◈ │
    ╰─────────────────────────╯
        </pre>
      </div>
      
      <div class="flex flex-col justify-center space-y-2 min-w-0 flex-1">
        <div class="flex flex-wrap">
          <span class="text-terminal-accent font-bold w-20 flex-shrink-0">OS:</span>
          <span class="text-terminal-text">Void Linux x86_64</span>
        </div>
        
        <div class="flex flex-wrap">
          <span class="text-terminal-accent font-bold w-20 flex-shrink-0">Host:</span>
          <span class="text-terminal-text">x0 Terminal</span>
        </div>
        
        <div class="flex flex-wrap">
          <span class="text-terminal-accent font-bold w-20 flex-shrink-0">Kernel:</span>
          <span class="text-terminal-text">6.6.52_1</span>
        </div>
        
        <div class="flex flex-wrap">
          <span class="text-terminal-accent font-bold w-20 flex-shrink-0">Packages:</span>
          <span class="text-terminal-text">xbps</span>
        </div>
        
        <div class="flex flex-wrap">
          <span class="text-terminal-accent font-bold w-20 flex-shrink-0">WM:</span>
          <span class="text-terminal-text">i3wm</span>
        </div>
        
        <div class="flex flex-wrap">
          <span class="text-terminal-accent font-bold w-20 flex-shrink-0">Theme:</span>
          <span class="text-terminal-text">Terminal Dark</span>
        </div>
        
        <div class="flex flex-wrap">
          <span class="text-terminal-accent font-bold w-20 flex-shrink-0">Terminal:</span>
          <span class="text-terminal-text">Web-based Terminal</span>
        </div>
        
        <div class="flex flex-wrap">
          <span class="text-terminal-accent font-bold w-20 flex-shrink-0">CPU:</span>
          <span class="text-terminal-text">JavaScript Engine</span>
        </div>
        
        <div class="flex flex-wrap">
          <span class="text-terminal-accent font-bold w-20 flex-shrink-0">Memory:</span>
          <span class="text-terminal-text">Browser Memory Pool</span>
        </div>
      </div>
    </div>
  `;
}
export { commandRegistry, textOutput, errorOutput };
