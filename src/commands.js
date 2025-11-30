import { buildVirtualFS } from './tree';

const contentModules = import.meta.glob('/src/content/**/*.md', { eager: true });

const contentEntries = Object.entries(contentModules).map(([file, mod]) => ({
  file,
  module: mod,
}));

let currentDirectory = '/';

function normalizePath(path) {
  if (!path) return '/';
  
  if (path.startsWith('/')) {
    return path === '/' ? '/' : path.replace(/\/$/, '');
  }
  
  if (path === '.') return currentDirectory;
  if (path === '..') {
    if (currentDirectory === '/') return '/';
    const parts = currentDirectory.split('/').filter(Boolean);
    parts.pop();
    return '/' + parts.join('/');
  }
  
  const combined = currentDirectory === '/' 
    ? '/' + path 
    : currentDirectory + '/' + path;
  
  return combined.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
}

function getCurrentDirectory() {
  const pathname = window.location.pathname;
  if (pathname === '/' || pathname === '') return '/';
  return pathname.replace(/\/$/, '');
}

const commandRegistry = {
  help: {
    description: 'Display available commands',
    execute: async () => {
      return generateHelpOutput();
    },
  },

  ls: {
    description: 'List directory contents',
    execute: async args => {
      currentDirectory = getCurrentDirectory();
      const targetPath = args && args.length > 0 ? normalizePath(args[0]) : currentDirectory;
      return generateLsOutput(targetPath);
    },
  },

  cat: {
    description: 'Display file contents',
    execute: async args => {
      if (!args || args.length === 0) {
        return errorOutput('Missing filename. Usage: cat [filename]');
      }
      
      currentDirectory = getCurrentDirectory();
      const targetPath = normalizePath(args[0]);
      return generateCatOutput(targetPath);
    },
  },

  cd: {
    description: 'Change directory',
    execute: async args => {
      currentDirectory = getCurrentDirectory();
      
      if (!args || args.length === 0) {
        window.location.href = '/';
        return textOutput('Navigating to home...');
      }

      const targetPath = normalizePath(args[0]);
      
      if (args[0] === '.') {
        return textOutput(`Current directory: ${currentDirectory}`);
      }
      
      window.location.href = targetPath === '/' ? '/' : targetPath;
      return textOutput(`Navigating to ${targetPath}...`);
    },
  },

  pwd: {
    description: 'Print working directory',
    execute: async () => {
      currentDirectory = getCurrentDirectory();
      return textOutput(`/home/x0${currentDirectory}`);
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

  github: {
    description: 'Open GitHub profile',
    execute: async () => {
      window.open('https://github.com/m-mdy-m', '_blank');
      return textOutput('Opening GitHub profile...');
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
        <div class="space-y-2 animate-fade-in">
          <h2 class="text-gray-400 text-lg mb-3 flex items-center gap-2">
            <span class="text-gray-500">▶</span> Command History
          </h2>
      `;

      commandHistory.forEach((cmd, index) => {
        historyOutput += `
          <div class="flex items-center gap-3 hover:bg-gray-900/30 transition-all duration-200 px-2 py-1 rounded">
            <span class="text-gray-600 font-mono text-xs w-8">${index + 1}</span>
            <span class="text-gray-300 font-mono text-sm">${cmd}</span>
          </div>
        `;
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

  neofetch: {
    description: 'Display system information',
    execute: async () => {
      return generateNeofetchOutput();
    },
  },

  fortune: {
    description: 'Display a random quote',
    execute: async () => {
      const fortunes = [
        'Code is poetry written in semicolons.',
        'Debugging: Being the detective in a crime movie where you are also the murderer.',
        'There are two ways to write error-free programs; only the third one works.',
        'It works on my machine. ¯\\_(ツ)_/¯',
        'Writing code is easy. Writing code that works is the hard part.',
        'Real programmers count from 0.',
        'Hofstadter\'s Law: It always takes longer than you expect, even when you take into account Hofstadter\'s Law.',
        'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
        'First, solve the problem. Then, write the code.',
        'The best error message is the one that never shows up.',
        'A good programmer is someone who always looks both ways before crossing a one-way street.',
        'Programming is 10% writing code and 90% understanding why it\'s not working.',
        'If debugging is the process of removing bugs, then programming must be the process of putting them in.',
        'Theory is when you know something, but it doesn\'t work. Practice is when something works, but you don\'t know why.',
        'Talk is cheap. Show me the code. - Linus Torvalds'
      ];
      
      const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      
      return `
        <div class="animate-slide-in-right">
          <div class="border-l-2 border-gray-600 pl-4 py-3 bg-gray-900/30 rounded-r">
            <pre class="text-gray-400 font-mono text-sm leading-relaxed whitespace-pre-wrap">${randomFortune}</pre>
          </div>
        </div>
        <style>
          @keyframes slide-in-right {
            from { 
              transform: translateX(-20px); 
              opacity: 0; 
            }
            to { 
              transform: translateX(0); 
              opacity: 1; 
            }
          }
          .animate-slide-in-right {
            animation: slide-in-right 0.5s ease-out;
          }
        </style>
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
      currentDirectory = getCurrentDirectory();
      const targetPath = args && args.length > 0 ? normalizePath(args[0]) : currentDirectory;
      
      const virtualFS = buildVirtualFS(contentEntries);
      
      function buildTree(obj, prefix = '', isLast = true, basePath = '') {
        let result = '';
        const entries = Object.entries(obj).filter(([key]) => key !== '__file');
        
        entries.forEach(([key, value], index) => {
          const isLastEntry = index === entries.length - 1;
          const connector = isLastEntry ? '└── ' : '├── ';
          const isDir = !value.__file;
          const icon = isDir ? '📁' : '📄';
          const displayName = isDir ? `${key}/` : `${key}.md`;
          
          result += `${prefix}${connector}<span class="text-gray-400">${icon} ${displayName}</span>\n`;
          
          if (isDir && Object.keys(value).length > 1) {
            const newPrefix = prefix + (isLastEntry ? '    ' : '│   ');
            result += buildTree(value, newPrefix, isLastEntry, basePath + '/' + key);
          }
        });
        
        return result;
      }
      
      // Navigate to target path in virtual FS
      let targetNode = virtualFS;
      if (targetPath !== '/') {
        const parts = targetPath.split('/').filter(Boolean);
        for (const part of parts) {
          if (!targetNode[part]) {
            return errorOutput(`tree: ${targetPath}: No such file or directory`);
          }
          targetNode = targetNode[part];
        }
      }
      
      const treeOutput = buildTree(targetNode, '', true, targetPath);
      
      return `
        <div class="font-mono text-sm animate-fade-in">
          <h3 class="text-gray-400 text-lg mb-3 flex items-center gap-2">
            <span class="text-gray-600">▶</span> ${targetPath === '/' ? 'Root' : targetPath}
          </h3>
          <pre class="text-gray-500 leading-relaxed whitespace-pre-wrap">${treeOutput}</pre>
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
        <div class="animate-bounce-in">
          <pre class="text-gray-400 font-mono text-sm">
${topBorder}
< ${message} >
${bottomBorder}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
          </pre>
        </div>
        <style>
          @keyframes bounce-in {
            0% { 
              transform: scale(0.3); 
              opacity: 0; 
            }
            50% { 
              transform: scale(1.05); 
            }
            70% { 
              transform: scale(0.9); 
            }
            100% { 
              transform: scale(1); 
              opacity: 1; 
            }
          }
          .animate-bounce-in {
            animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          }
        </style>
      `;
    },
  },


  books: {
    description: 'Display available books',
    execute: async () => generateBooksOutput(),
  },
};

// Helper functions
function textOutput(text) {
  return `<div class="text-gray-400">${text}</div>`;
}

function errorOutput(text) {
  return `<div class="text-red-500 font-mono">${text}</div>`;
}

function generateHelpOutput() {
  const categories = {
    'System': ['whoami', 'pwd', 'date', 'clear'],
    'Navigation': ['ls', 'cd', 'cat', 'tree'],
    'Information': ['help', 'man', 'history', 'neofetch', 'skills'],
    'Tools': [ 'echo'],
    'Fun': ['fortune', 'cowsay', 'matrix',],
    'External': ['github']
  };

  let output = `
    <style>
      .help-container {
        animation: slideDown 0.5s ease-out;
      }
      
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .help-category {
        opacity: 0;
        animation: fadeIn 0.6s ease-out forwards;
      }
      
      .help-category:nth-child(1) { animation-delay: 0.1s; }
      .help-category:nth-child(2) { animation-delay: 0.2s; }
      .help-category:nth-child(3) { animation-delay: 0.3s; }
      .help-category:nth-child(4) { animation-delay: 0.4s; }
      .help-category:nth-child(5) { animation-delay: 0.5s; }
      .help-category:nth-child(6) { animation-delay: 0.6s; }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateX(-10px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      .cmd-item {
        transition: all 0.2s ease;
      }
      
      .cmd-item:hover {
        background: rgba(107, 114, 128, 0.1);
        padding-left: 0.75rem;
        border-left: 2px solid #6b7280;
      }
    </style>
    
    <div class="help-container font-mono">
      <div class="mb-6">
        <h2 class="text-gray-400 text-xl mb-2 flex items-center gap-2">
          <span class="text-gray-600">▶</span> Available Commands
        </h2>
        <p class="text-gray-600 text-sm">Type 'man [command]' for detailed information</p>
      </div>
  `;

  Object.entries(categories).forEach(([category, commands]) => {
    output += `
      <div class="help-category mb-5">
        <h3 class="text-gray-500 text-sm font-bold mb-2 uppercase tracking-wider">${category}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
    `;
    
    commands.forEach(cmd => {
      const info = commandRegistry[cmd];
      if (info) {
        output += `
          <div class="cmd-item rounded p-2">
            <div class="flex items-start gap-3">
              <span class="text-gray-400 font-bold min-w-[80px]">${cmd}</span>
              <span class="text-gray-600 text-sm">${info.description}</span>
            </div>
          </div>
        `;
      }
    });
    
    output += '</div></div>';
  });

  output += `
    <div class="mt-6 pt-4 border-t border-gray-800">
      <p class="text-gray-600 text-sm">
        <span class="text-gray-500">Tip:</span> Use <span class="text-gray-400">Tab</span> for autocompletion
      </p>
    </div>
  </div>
  `;
  
  return output;
}

function generateLsOutput(targetPath) {
  const virtualFS = buildVirtualFS(contentEntries);

  // Navigate to target path
  let current = virtualFS;
  if (targetPath !== '/') {
    const parts = targetPath.split('/').filter(Boolean);
    for (const part of parts) {
      if (!current[part]) {
        return errorOutput(`ls: cannot access '${targetPath}': No such file or directory`);
      }
      if (current[part].__file) {
        return errorOutput(`ls: cannot access '${targetPath}': Not a directory`);
      }
      current = current[part];
    }
  }

  const items = Object.entries(current).filter(([key]) => key !== '__file').sort(([a], [b]) => a.localeCompare(b));
  const now = new Date().toDateString();

  const htmlItems = items.map(([name, value], index) => {
    const isDir = !value.__file;
    const displayName = isDir ? name + '/' : name + '.md';
    const fullPath = targetPath === '/' ? '/' + name : targetPath + '/' + name;
    const date = now;
    const icon = isDir ? '📁' : '📄';
    const delay = index * 0.05;

    return `
      <div class="flex items-center gap-3 py-2 px-3 rounded hover:bg-gray-900/30 transition-all duration-200" style="animation: fadeInUp 0.4s ease-out ${delay}s both">
        <span class="text-gray-600 text-xs w-28">${date}</span>
        <span class="text-gray-600">${icon}</span>
        <a href="${fullPath}" class="text-gray-400 hover:text-gray-300 transition-colors">${displayName}</a>
      </div>
    `;
  });

  return `
    <style>
      @keyframes fadeInUp {
        from { 
          opacity: 0; 
          transform: translateY(10px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
    </style>
    <div class="font-mono">
      <h2 class="text-gray-400 text-lg mb-4 flex items-center gap-2">
        <span class="text-gray-600">▶</span> ${targetPath}
      </h2>
      <div class="space-y-1">
        ${htmlItems.join('\n')}
      </div>
    </div>
  `;
}

function generateBooksOutput() {
  return `
    <div class="books-display animate-fade-in">
      <h2 class="text-gray-400 text-2xl mb-6 flex items-center gap-2">
        <span class="text-gray-600">📚</span> Published Works
      </h2>
      
      <div class="space-y-8">
        <!-- MATHESIS -->
        <div class="book-card border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-all">
          <div class="flex gap-6 flex-col md:flex-row">
            <div class="flex-shrink-0">
              <img src="/books/books/MATHESIS/cover.svg" alt="MATHESIS Cover" class="w-48 h-64 object-contain" />
            </div>
            <div class="flex-1">
              <h3 class="text-xl text-gray-300 font-bold mb-2">MATHESIS</h3>
              <p class="text-sm text-gray-500 mb-3">The Mathematical Foundations of Computing</p>
              <p class="text-gray-400 text-sm mb-4">A comprehensive journey through the mathematical concepts underlying computer science—from ancient number systems through modern discrete mathematics, set theory, logic, and beyond.</p>
              <div class="flex gap-2 mb-4">
                <span class="px-3 py-1 bg-gray-800 text-gray-400 rounded text-xs">Mathematics</span>
                <span class="px-3 py-1 bg-gray-800 text-gray-400 rounded text-xs">10 Parts</span>
                <span class="px-3 py-1 bg-green-900/30 text-green-400 rounded text-xs">Living Edition</span>
              </div>
              <div class="flex gap-3">
                <a href="https://github.com/m-mdy-m/algorithms-data-structures/tree/main/books/books/MATHESIS" target="_blank" class="text-gray-400 hover:text-gray-300 text-sm">View Source →</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Art of Algorithmic Analysis -->
        <div class="book-card border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-all">
          <div class="flex gap-6 flex-col md:flex-row">
            <div class="flex-shrink-0">
              <img src="/books/books/The Art of Algorithmic Analysis/cover.svg" alt="Art of Algorithmic Analysis Cover" class="w-48 h-64 object-contain" />
            </div>
            <div class="flex-1">
              <h3 class="text-xl text-gray-300 font-bold mb-2">The Art of Algorithmic Analysis</h3>
              <p class="text-sm text-gray-500 mb-3">From Foundations to Practice</p>
              <p class="text-gray-400 text-sm mb-4">A rigorous exploration of algorithm analysis techniques—asymptotic notation, recurrence relations, amortized analysis, and complexity theory. Built for those who seek deep understanding.</p>
              <div class="flex gap-2 mb-4">
                <span class="px-3 py-1 bg-gray-800 text-gray-400 rounded text-xs">Algorithms</span>
                <span class="px-3 py-1 bg-gray-800 text-gray-400 rounded text-xs">6 Parts</span>
                <span class="px-3 py-1 bg-green-900/30 text-green-400 rounded text-xs">Living Edition</span>
              </div>
              <div class="flex gap-3">
                <a href="https://github.com/m-mdy-m/algorithms-data-structures/tree/main/books/books/The%20Art%20of%20Algorithmic%20Analysis" target="_blank" class="text-gray-400 hover:text-gray-300 text-sm">View Source →</a>
              </div>
            </div>
          </div>
        </div>

        <!-- ARLIZ -->
        <div class="book-card border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-all">
          <div class="flex gap-6 flex-col md:flex-row">
            <div class="flex-shrink-0">
              <div class="w-48 h-64 bg-gray-800 rounded flex items-center justify-center">
                <span class="text-4xl">📖</span>
              </div>
            </div>
            <div class="flex-1">
              <h3 class="text-xl text-gray-300 font-bold mb-2">ARLIZ</h3>
              <p class="text-sm text-gray-500 mb-3">Arrays, Reasoning, Logic, Identity, Zero</p>
              <p class="text-gray-400 text-sm mb-4">A comprehensive exploration of data structures starting from their historical origins. Understanding the 'why' behind arrays, stacks, queues, and beyond.</p>
              <div class="flex gap-2 mb-4">
                <span class="px-3 py-1 bg-gray-800 text-gray-400 rounded text-xs">Data Structures</span>
                <span class="px-3 py-1 bg-gray-800 text-gray-400 rounded text-xs">5 Parts</span>
                <span class="px-3 py-1 bg-yellow-900/30 text-yellow-400 rounded text-xs">In Progress</span>
              </div>
              <div class="flex gap-3">
                <a href="https://github.com/m-mdy-m/Arliz" target="_blank" class="text-gray-400 hover:text-gray-300 text-sm">View Source →</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 p-4 border border-gray-800 rounded">
        <p class="text-gray-500 text-sm">
          <span class="text-gray-400">💡 Tip:</span> All books are freely available and continuously updated. 
          These are "living editions"—they grow and improve as understanding deepens.
        </p>
      </div>
    </div>
  `;
}

async function generateCatOutput(targetPath) {
  // Remove leading slash and .md extension for searching
  const searchPath = targetPath.replace(/^\//, '').replace(/\.md$/, '');
  
  const entry = contentEntries.find(e => {
    const file = e.file.replace('/src/content/', '');
    return file === searchPath + '.md' || file.replace(/\.md$/, '') === searchPath;
  });
  
  if (entry) {
    const html = await entry.module.compiledContent();
    return `<div class="animate-fade-in">${html}</div>`;
  }

  return errorOutput(`cat: ${targetPath}: No such file or directory`);
}

function generateManOutput(command) {
  const cmd = commandRegistry[command];

  if (!cmd) {
    return errorOutput(`No manual entry for ${command}`);
  }

  return `
    <div class="font-mono animate-slide-in-right">
      <h2 class="text-gray-400 text-xl mb-4 flex items-center gap-2">
        <span class="text-gray-600">▶</span> Manual: ${command}
      </h2>
      <div class="space-y-4 pl-4">
        <div>
          <p class="text-gray-500 font-bold mb-1">NAME</p>
          <p class="text-gray-400 pl-4">${command} - ${cmd.description}</p>
        </div>

        <div>
          <p class="text-gray-500 font-bold mb-1">SYNOPSIS</p>
          <p class="text-gray-400 pl-4">${getCommandSynopsis(command)}</p>
        </div>

        <div>
          <p class="text-gray-500 font-bold mb-1">DESCRIPTION</p>
          <p class="text-gray-400 pl-4">${getCommandDescription(command)}</p>
        </div>
      </div>
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
    neofetch: 'neofetch',
    help: 'help',
    fortune: 'fortune',
    cowsay: 'cowsay [message]',
    matrix: 'matrix',
    tree: 'tree [directory]',
  };

  return synopses[command] || command;
}

function getCommandDescription(command) {
  const descriptions = {
    ls: 'List information about the files and directories.',
    cat: 'Concatenate and display the content of files.',
    cd: 'Change the current directory. Use "cd .." to go up.',
    whoami: 'Display information about the user.',
    clear: 'Clear the terminal screen.',
    github: 'Open the GitHub profile in a new tab.',
    pwd: 'Print the current working directory.',
    date: 'Display the current date and time.',
    echo: 'Display a line of text.',
    history: 'Display the command history.',
    man: 'Display the manual page for a command.',
    neofetch: 'Display system information in a visually pleasing way.',
    help: 'Display a list of available commands.',
    fortune: 'Display a random programming quote.',
    cowsay: 'Make an ASCII cow say your message.',
    matrix: 'Enter the Matrix with falling characters.',
    tree: 'Display directory structure as a tree.',
  };

  return descriptions[command] || commandRegistry[command].description;
}

function generateNeofetchOutput() {
  return `
    <style>
      .neofetch-container {
        animation: slideInLeft 0.6s ease-out;
      }
      
      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      .neofetch-item {
        opacity: 0;
        animation: fadeIn 0.4s ease-out forwards;
      }
      
      .neofetch-item:nth-child(1) { animation-delay: 0.1s; }
      .neofetch-item:nth-child(2) { animation-delay: 0.2s; }
      .neofetch-item:nth-child(3) { animation-delay: 0.3s; }
      .neofetch-item:nth-child(4) { animation-delay: 0.4s; }
      .neofetch-item:nth-child(5) { animation-delay: 0.5s; }
      .neofetch-item:nth-child(6) { animation-delay: 0.6s; }
      .neofetch-item:nth-child(7) { animation-delay: 0.7s; }
      .neofetch-item:nth-child(8) { animation-delay: 0.8s; }
      .neofetch-item:nth-child(9) { animation-delay: 0.9s; }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
      }
    </style>
    
    <div class="neofetch-container flex flex-col lg:flex-row gap-6 text-sm font-mono">
      <div class="flex-shrink-0">
        <pre class="text-gray-600 text-xs leading-tight">
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
        <div class="neofetch-item flex flex-wrap">
          <span class="text-gray-500 font-bold w-20 flex-shrink-0">OS:</span>
          <span class="text-gray-400">Void Linux x86_64</span>
        </div>
        
        <div class="neofetch-item flex flex-wrap">
          <span class="text-gray-500 font-bold w-20 flex-shrink-0">Host:</span>
          <span class="text-gray-400">x0 Terminal</span>
        </div>
        
        <div class="neofetch-item flex flex-wrap">
          <span class="text-gray-500 font-bold w-20 flex-shrink-0">Kernel:</span>
          <span class="text-gray-400">6.6.52_1</span>
        </div>
        
        <div class="neofetch-item flex flex-wrap">
          <span class="text-gray-500 font-bold w-20 flex-shrink-0">Packages:</span>
          <span class="text-gray-400">xbps</span>
        </div>
        
        <div class="neofetch-item flex flex-wrap">
          <span class="text-gray-500 font-bold w-20 flex-shrink-0">WM:</span>
          <span class="text-gray-400">i3wm</span>
        </div>
        
        <div class="neofetch-item flex flex-wrap">
          <span class="text-gray-500 font-bold w-20 flex-shrink-0">Theme:</span>
          <span class="text-gray-400">Hacker Dark</span>
        </div>
        
        <div class="neofetch-item flex flex-wrap">
          <span class="text-gray-500 font-bold w-20 flex-shrink-0">Terminal:</span>
          <span class="text-gray-400">Web Terminal</span>
        </div>
        
        <div class="neofetch-item flex flex-wrap">
          <span class="text-gray-500 font-bold w-20 flex-shrink-0">CPU:</span>
          <span class="text-gray-400">JS Engine</span>
        </div>
        
        <div class="neofetch-item flex flex-wrap">
          <span class="text-gray-500 font-bold w-20 flex-shrink-0">Memory:</span>
          <span class="text-gray-400">Browser Pool</span>
        </div>
      </div>
    </div>
  `;
}

export { commandRegistry, textOutput, errorOutput }