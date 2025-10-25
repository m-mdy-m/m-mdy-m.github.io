import { buildVirtualFS } from './tree';

const contentModules = import.meta.glob('/src/content/**/*.md', { eager: true });

const contentEntries = Object.entries(contentModules).map(([file, mod]) => ({
  file,
  module: mod,
}));

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

  uname: {
    description: 'Print system information',
    execute: async () => {
      return textOutput('AstroOS Terminal v1.0.0');
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
      const virtualFS = buildVirtualFS(contentEntries);
      
      function buildTree(obj, prefix = '', isLast = true) {
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
            result += buildTree(value, newPrefix, isLastEntry);
          }
        });
        
        return result;
      }
      
      const treeOutput = buildTree(virtualFS);
      
      return `
        <div class="font-mono text-sm animate-fade-in">
          <h3 class="text-gray-400 text-lg mb-3 flex items-center gap-2">
            <span class="text-gray-600">▶</span> Project Structure
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

  figlet: {
    description: 'Create ASCII art text',
    execute: async args => {
      const text = args.length > 0 ? args.join(' ').toUpperCase() : 'X0';
      
      const asciiMap = {
        'A': ['  ██  ', ' ████ ', '██  ██', '██████', '██  ██'],
        'B': ['█████ ', '██  ██', '█████ ', '██  ██', '█████ '],
        'C': [' ████ ', '██    ', '██    ', '██    ', ' ████ '],
        'D': ['█████ ', '██  ██', '██  ██', '██  ██', '█████ '],
        'E': ['██████', '██    ', '████  ', '██    ', '██████'],
        'F': ['██████', '██    ', '████  ', '██    ', '██    '],
        'G': [' ████ ', '██    ', '██ ███', '██  ██', ' ████ '],
        'H': ['██  ██', '██  ██', '██████', '██  ██', '██  ██'],
        'I': ['██████', '  ██  ', '  ██  ', '  ██  ', '██████'],
        'J': ['██████', '    ██', '    ██', '██  ██', ' ████ '],
        'K': ['██  ██', '██ ██ ', '████  ', '██ ██ ', '██  ██'],
        'L': ['██    ', '██    ', '██    ', '██    ', '██████'],
        'M': ['██   ██', '███ ███', '██ █ ██', '██   ██', '██   ██'],
        'N': ['██   ██', '███  ██', '██ █ ██', '██  ███', '██   ██'],
        'O': [' ████ ', '██  ██', '██  ██', '██  ██', ' ████ '],
        'P': ['█████ ', '██  ██', '█████ ', '██    ', '██    '],
        'Q': [' ████ ', '██  ██', '██  ██', '██ ███', ' ██ ██'],
        'R': ['█████ ', '██  ██', '█████ ', '██ ██ ', '██  ██'],
        'S': [' ████ ', '██    ', ' ████ ', '    ██', '█████ '],
        'T': ['██████', '  ██  ', '  ██  ', '  ██  ', '  ██  '],
        'U': ['██  ██', '██  ██', '██  ██', '██  ██', ' ████ '],
        'V': ['██  ██', '██  ██', '██  ██', ' ████ ', '  ██  '],
        'W': ['██   ██', '██   ██', '██ █ ██', '███ ███', '██   ██'],
        'X': ['██  ██', ' ████ ', '  ██  ', ' ████ ', '██  ██'],
        'Y': ['██  ██', ' ████ ', '  ██  ', '  ██  ', '  ██  '],
        'Z': ['██████', '   ██ ', '  ██  ', ' ██   ', '██████'],
        '0': [' ████ ', '██  ██', '██ ███', '██  ██', ' ████ '],
        '1': ['  ██  ', ' ███  ', '  ██  ', '  ██  ', '██████'],
        '2': [' ████ ', '██  ██', '   ██ ', ' ██   ', '██████'],
        '3': ['█████ ', '    ██', ' ████ ', '    ██', '█████ '],
        '4': ['██  ██', '██  ██', '██████', '    ██', '    ██'],
        '5': ['██████', '██    ', '█████ ', '    ██', '█████ '],
        '6': [' ████ ', '██    ', '█████ ', '██  ██', ' ████ '],
        '7': ['██████', '    ██', '   ██ ', '  ██  ', '  ██  '],
        '8': [' ████ ', '██  ██', ' ████ ', '██  ██', ' ████ '],
        '9': [' ████ ', '██  ██', ' █████', '    ██', ' ████ '],
        ' ': ['      ', '      ', '      ', '      ', '      ']
      };
      
      let result = '<div class="animate-typewriter"><pre class="text-gray-500 font-mono text-xs leading-tight">';
      
      for (let row = 0; row < 5; row++) {
        let line = '';
        for (let char of text) {
          if (asciiMap[char]) {
            line += asciiMap[char][row] + ' ';
          } else {
            line += '▓▓▓▓▓ ';
          }
        }
        result += line + '\n';
      }
      
      result += '</pre></div>';
      
      result += `
        <style>
          @keyframes typewriter {
            from { 
              width: 0;
              opacity: 0;
            }
            to { 
              width: 100%;
              opacity: 1;
            }
          }
          .animate-typewriter {
            overflow: hidden;
            animation: typewriter 1s steps(40) forwards;
          }
        </style>
      `;
      
      return result;
    },
  },

  resume: {
    description: 'Display resume',
    execute: async args => {
      const lang = args && args.length > 0 ? args[0].toLowerCase() : 'en';
      const validLangs = ['en', 'fa'];
      
      if (!validLangs.includes(lang)) {
        return errorOutput(`Invalid language. Use: resume [en|fa]`);
      }
      
      return generateResumeOutput(lang);
    },
  },

  curl: {
    description: 'Download files',
    execute: async args => {
      if (!args || args.length < 2) {
        return errorOutput('Usage: curl -s [filename]');
      }

      const flags = args[0];
      const filename = args[1];

      if (flags !== '-s') {
        return errorOutput('Only -s flag is supported. Usage: curl -s [filename]');
      }

      if (filename !== 'resume.pdf' && filename !== 'resume-en.pdf') {
        return errorOutput(`File '${filename}' not found.`);
      }

      const repoFileName = filename === 'resume.pdf' ? 'resume.pdf' : 'resume-en.pdf';
      const rawUrl = `https://raw.githubusercontent.com/m-mdy-m/m-mdy-m.github.io/main/src/resume/${encodeURIComponent(repoFileName)}`;

      fetch(rawUrl)
        .then(response => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.blob();
        })
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'Mahdi_Mamashli_Resume.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch(err => console.error('Download failed:', err));

      return `
        <div class="space-y-2 animate-fade-in">
          <div class="flex items-center gap-2">
            <span class="text-gray-600 animate-pulse">●</span>
            <span class="text-gray-400">Connecting to server...</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-gray-600 animate-pulse" style="animation-delay: 0.5s">●</span>
            <span class="text-gray-400">Downloading ${repoFileName}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-green-600">✓</span>
            <span class="text-gray-300">Download started — check your Downloads folder</span>
          </div>
        </div>
      `;
    },
  },

  hack: {
    description: 'Simulate hacking sequence',
    execute: async () => {
      const sequences = [
        'Initializing connection...',
        'Bypassing firewall...',
        'Accessing mainframe...',
        'Downloading database...',
        'Extracting credentials...',
        'Covering tracks...',
        'Access granted. You\'re in.'
      ];
      
      let output = '<div class="space-y-2 font-mono text-sm">';
      
      sequences.forEach((seq, i) => {
        const delay = i * 0.6;
        const color = i === sequences.length - 1 ? 'text-green-500' : 'text-gray-500';
        output += `
          <div class="flex items-center gap-2 opacity-0" style="animation: fadeInUp 0.5s ease-out ${delay}s forwards">
            <span class="${color}">▶</span>
            <span class="${color}">${seq}</span>
          </div>
        `;
      });
      
      output += `
        </div>
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
      `;
      
      return output;
    },
  },

  glitch: {
    description: 'Glitch effect text',
    execute: async args => {
      const text = args.length > 0 ? args.join(' ') : 'SYSTEM ERROR';
      
      return `
        <div class="glitch-container">
          <div class="glitch" data-text="${text}">${text}</div>
        </div>
        <style>
          .glitch-container {
            padding: 2rem;
            text-align: center;
          }
          
          .glitch {
            font-size: 3rem;
            font-weight: bold;
            text-transform: uppercase;
            position: relative;
            color: #fff;
            letter-spacing: 0.5em;
            animation: glitch-skew 1s infinite;
          }
          
          .glitch::before,
          .glitch::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
          
          .glitch::before {
            left: 2px;
            text-shadow: -2px 0 #ff00c1;
            clip: rect(44px, 450px, 56px, 0);
            animation: glitch-anim 5s infinite linear alternate-reverse;
          }
          
          .glitch::after {
            left: -2px;
            text-shadow: -2px 0 #00fff9, 2px 2px #ff00c1;
            animation: glitch-anim2 1s infinite linear alternate-reverse;
          }
          
          @keyframes glitch-anim {
            0% { clip: rect(31px, 9999px, 94px, 0); }
            20% { clip: rect(60px, 9999px, 64px, 0); }
            40% { clip: rect(37px, 9999px, 20px, 0); }
            60% { clip: rect(39px, 9999px, 77px, 0); }
            80% { clip: rect(62px, 9999px, 74px, 0); }
            100% { clip: rect(30px, 9999px, 68px, 0); }
          }
          
          @keyframes glitch-anim2 {
            0% { clip: rect(65px, 9999px, 119px, 0); }
            20% { clip: rect(52px, 9999px, 74px, 0); }
            40% { clip: rect(79px, 9999px, 85px, 0); }
            60% { clip: rect(106px, 9999px, 88px, 0); }
            80% { clip: rect(45px, 9999px, 43px, 0); }
            100% { clip: rect(19px, 9999px, 20px, 0); }
          }
          
          @keyframes glitch-skew {
            0% { transform: skew(0deg); }
            10% { transform: skew(2deg); }
            20% { transform: skew(-2deg); }
            30% { transform: skew(1deg); }
            40% { transform: skew(-1deg); }
            50% { transform: skew(0deg); }
            100% { transform: skew(0deg); }
          }
        </style>
      `;
    },
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
    'System': ['whoami', 'uname', 'pwd', 'date', 'clear'],
    'Navigation': ['ls', 'cd', 'cat', 'tree'],
    'Information': ['help', 'man', 'history', 'neofetch'],
    'Tools': ['resume', 'curl', 'echo'],
    'Fun': ['fortune', 'cowsay', 'figlet', 'matrix', 'hack', 'glitch'],
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

  const htmlItems = items.map(([name, value], index) => {
    const isDir = !value.__file;
    const displayName = isDir ? name + '/' : name + '.md';
    const href = '/' + (args[0] ? args[0] + '/' : '') + name;
    const date = now;
    const icon = isDir ? '📁' : '📄';
    const delay = index * 0.05;

    return `
      <div class="flex items-center gap-3 py-2 px-3 rounded hover:bg-gray-900/30 transition-all duration-200" style="animation: fadeInUp 0.4s ease-out ${delay}s both">
        <span class="text-gray-600 text-xs w-28">${date}</span>
        <span class="text-gray-600">${icon}</span>
        <a href="${href}" class="text-gray-400 hover:text-gray-300 transition-colors">${displayName}</a>
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
        <span class="text-gray-600">▶</span> ${args[0] ? args[0] : 'Current Directory'}
      </h2>
      <div class="space-y-1">
        ${htmlItems.join('\n')}
      </div>
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
    return `<div class="animate-fade-in">${html}</div>`;
  }

  return errorOutput(`File '${filename}' not found.`);
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
    uname: 'uname',
    neofetch: 'neofetch',
    help: 'help',
    resume: 'resume [en|fa]',
    curl: 'curl -s [filename]',
    fortune: 'fortune',
    cowsay: 'cowsay [message]',
    figlet: 'figlet [text]',
    matrix: 'matrix',
    tree: 'tree [directory]',
    hack: 'hack',
    glitch: 'glitch [text]'
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
    uname: 'Print system information.',
    neofetch: 'Display system information in a visually pleasing way.',
    help: 'Display a list of available commands.',
    resume: 'Display resume in terminal format.',
    curl: 'Download files from the server.',
    fortune: 'Display a random programming quote.',
    cowsay: 'Make an ASCII cow say your message.',
    figlet: 'Create large ASCII art text.',
    matrix: 'Enter the Matrix with falling characters.',
    tree: 'Display directory structure as a tree.',
    hack: 'Simulate a hacking sequence.',
    glitch: 'Display text with glitch effect.'
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

function generateResumeOutput(lang = 'en') {
  if (lang === 'fa') {
    return `<div class="text-gray-500 text-center py-8">Persian version coming soon...</div>`;
  }
  
  return `
    <style>
      .resume-section { 
        animation: slideInUp 0.5s ease-out forwards; 
        opacity: 0; 
      }
      .resume-section:nth-child(1) { animation-delay: 0.1s; }
      .resume-section:nth-child(2) { animation-delay: 0.2s; }
      .resume-section:nth-child(3) { animation-delay: 0.3s; }
      .resume-section:nth-child(4) { animation-delay: 0.4s; }
      .resume-section:nth-child(5) { animation-delay: 0.5s; }
      .resume-section:nth-child(6) { animation-delay: 0.6s; }
      
      @keyframes slideInUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      .skill-badge {
        transition: all 0.3s ease;
      }
      
      .skill-badge:hover {
        transform: translateX(5px);
        color: #9ca3af;
      }
      
      .project-item {
        transition: all 0.3s ease;
        border-left: 2px solid transparent;
        padding-left: 1rem;
      }
      
      .project-item:hover {
        border-left-color: #6b7280;
        padding-left: 1.5rem;
      }
    </style>

    <div class="resume-container font-mono max-w-5xl mx-auto">
      
      <!-- Header -->
      <div class="resume-section mb-8 text-center border-b border-gray-800 pb-6">
        <pre class="text-gray-600 text-xs leading-tight mb-3 inline-block">
╔═══════════════════════════════════════════════════╗
║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ║
║  ▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓  ║
║  ▓░  BACKEND DEVELOPER | OPEN SOURCE       ░▓  ║
║  ▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓  ║
║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ║
╚═══════════════════════════════════════════════════╝
        </pre>
        <h1 class="text-3xl font-bold text-gray-400 mb-2">MAHDI MAMASHLI</h1>
        <p class="text-gray-500 text-sm mb-3">Backend Developer | Open Source Contributor</p>
        <div class="flex flex-wrap justify-center gap-4 text-xs">
          <span class="flex items-center gap-1">
            <span class="text-gray-600">@</span>
            <a href="mailto:bitsgenix@gmail.com" class="hover:text-gray-400 transition text-gray-500">bitsgenix@gmail.com</a>
          </span>
          <span class="flex items-center gap-1">
            <span class="text-gray-600">⚡</span>
            <a href="https://github.com/m-mdy-m" class="hover:text-gray-400 transition text-gray-500">github.com/m-mdy-m</a>
          </span>
          <span class="flex items-center gap-1">
            <span class="text-gray-600">📍</span>
            <span class="text-gray-500">Iran</span>
          </span>
        </div>
      </div>

      <!-- Summary -->
      <div class="resume-section mb-6">
        <h2 class="text-gray-400 text-lg font-bold mb-3 flex items-center gap-2">
          <span class="text-gray-600">▶</span> SUMMARY
        </h2>
        <p class="text-gray-500 text-sm leading-relaxed pl-6">
          Backend Developer specializing in event-driven architecture and modular system design. Creator of Gland framework 
          with hands-on experience building scalable backend applications using TypeScript/Node.js. Strong focus on performance 
          optimization, caching strategies, and clean architectural patterns. Active open-source contributor with 15+ published 
          technical articles on algorithms and system design.
        </p>
      </div>

      <!-- Skills -->
      <div class="resume-section mb-6">
        <h2 class="text-gray-400 text-lg font-bold mb-3 flex items-center gap-2">
          <span class="text-gray-600">▶</span> SKILLS
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 text-xs">
          <div>
            <h3 class="text-gray-500 font-bold mb-2">Languages</h3>
            <div class="space-y-1 text-gray-600">
              <div class="skill-badge">▪ TypeScript, JavaScript, Python</div>
            </div>
          </div>
          <div>
            <h3 class="text-gray-500 font-bold mb-2">Backend</h3>
            <div class="space-y-1 text-gray-600">
              <div class="skill-badge">▪ Node.js, Bun, Express.js</div>
              <div class="skill-badge">▪ Event-driven architectures, WebSocket</div>
            </div>
          </div>
          <div>
            <h3 class="text-gray-500 font-bold mb-2">Databases</h3>
            <div class="space-y-1 text-gray-600">
              <div class="skill-badge">▪ PostgreSQL, MongoDB, Redis</div>
            </div>
          </div>
          <div>
            <h3 class="text-gray-500 font-bold mb-2">System Design</h3>
            <div class="space-y-1 text-gray-600">
              <div class="skill-badge">▪ Event brokers, CQRS patterns</div>
              <div class="skill-badge">▪ Dependency injection, pub/sub</div>
            </div>
          </div>
          <div>
            <h3 class="text-gray-500 font-bold mb-2">Tools</h3>
            <div class="space-y-1 text-gray-600">
              <div class="skill-badge">▪ Docker, Git, Linux/Unix</div>
            </div>
          </div>
          <div>
            <h3 class="text-gray-500 font-bold mb-2">Specializations</h3>
            <div class="space-y-1 text-gray-600">
              <div class="skill-badge">▪ Performance optimization</div>
              <div class="skill-badge">▪ Algorithm complexity analysis</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Experience -->
      <div class="resume-section mb-6">
        <h2 class="text-gray-400 text-lg font-bold mb-3 flex items-center gap-2">
          <span class="text-gray-600">▶</span> EXPERIENCE
        </h2>
        <div class="pl-6 space-y-4">
          <div class="project-item">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-gray-400 font-bold">Open Source Developer</h3>
              <span class="text-gray-600 text-xs">Jan 2023 – Present</span>
            </div>
            <p class="text-gray-600 text-xs italic mb-2">Independent Contributor</p>
            <ul class="text-xs space-y-1 list-none text-gray-600">
              <li class="flex items-start gap-2">
                <span class="text-gray-700">•</span>
                <span>Designed and implemented Gland, an event-driven backend framework with broker-based architecture supporting protocol-agnostic communication (HTTP, WebSocket) and modular component isolation</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-gray-700">•</span>
                <span>Built QIKS caching system achieving 1M+ ops/sec with O(1) complexity, implementing LRU/LFU/MRU eviction policies, cascade invalidation via dependency graphs, and TTL-based expiration</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-gray-700">•</span>
                <span>Developed TideityIQ complexity analyzer in C, parsing JavaScript AST to calculate Big O/Theta/Omega notations for recursive algorithms</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-gray-700">•</span>
                <span>Authored 15+ technical articles on Dev.to and Medium covering event-driven patterns, caching strategies, algorithm analysis, and backend architecture</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Projects -->
      <div class="resume-section mb-6">
        <h2 class="text-gray-400 text-lg font-bold mb-3 flex items-center gap-2">
          <span class="text-gray-600">▶</span> PROJECTS
        </h2>
        <div class="pl-6 space-y-4 text-xs">
          <div class="project-item">
            <div class="flex justify-between items-start mb-1">
              <h3 class="text-gray-400 font-bold">Gland Framework</h3>
              <a href="https://github.com/m-mdy-m/gland" class="text-gray-600 hover:text-gray-500 transition">github</a>
            </div>
            <p class="text-gray-600 text-xs mb-2">TypeScript, Event-Driven Architecture</p>
            <ul class="space-y-1 list-none text-gray-600">
              <li class="flex items-start gap-2">
                <span class="text-gray-700">•</span>
                <span>Event broker system with radix tree-based routing, namespace isolation, and wildcard pattern matching</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-gray-700">•</span>
                <span>Dependency injection container with reflection-based metadata scanning for automatic controller/channel registration</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-gray-700">•</span>
                <span>Protocol adapters (Express, WebSocket) connecting via central broker with strategy-based execution</span>
              </li>
            </ul>
          </div>

          <div class="project-item">
            <div class="flex justify-between items-start mb-1">
              <h3 class="text-gray-400 font-bold">QIKS Caching System</h3>
              <a href="https://github.com/medishen/qiks" class="text-gray-600 hover:text-gray-500 transition">github</a>
            </div>
            <p class="text-gray-600 text-xs mb-2">TypeScript, Performance Engineering</p>
            <ul class="space-y-1 list-none text-gray-600">
              <li class="flex items-start gap-2">
                <span class="text-gray-700">•</span>
                <span>In-memory cache with Map/WeakMap adapters achieving microsecond-level operations through optimized data structures</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-gray-700">•</span>
                <span>Multiple eviction policies (LRU, LFU, MRU) with hybrid expiration (TTL, idle timeout) and configurable capacity management</span>
              </li>
            </ul>
          </div>

          <div class="project-item">
            <div class="flex justify-between items-start mb-1">
              <h3 class="text-gray-400 font-bold">TideityIQ</h3>
              <a href="https://github.com/medishen/TideityIQ" class="text-gray-600 hover:text-gray-500 transition">github</a>
            </div>
            <p class="text-gray-600 text-xs mb-2">C, Compiler Design</p>
            <ul class="space-y-1 list-none text-gray-600">
              <li class="flex items-start gap-2">
                <span class="text-gray-700">•</span>
                <span>CLI tool parsing JavaScript source files to analyze recursive function complexity using AST traversal</span>
              </li>
            </ul>
          </div>

          <div class="project-item">
            <div class="flex justify-between items-start mb-1">
              <h3 class="text-gray-400 font-bold">Additional Projects</h3>
            </div>
            <ul class="space-y-1 list-none text-gray-600">
              <li class="flex items-start gap-2">
                <span class="text-gray-700">•</span>
                <span><strong class="text-gray-500">ARLIZ:</strong> Comprehensive guide to data structures and algorithms with historical context (LaTeX)</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-gray-700">•</span>
                <span><strong class="text-gray-500">Cop:</strong> Telegram bot for automated group moderation using Grammy framework and PostgreSQL</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-gray-700">•</span>
                <span><strong class="text-gray-500">AGAS:</strong> Bun-powered HTTP client with event-driven request/response lifecycle</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Education -->
      <div class="resume-section mb-6">
        <h2 class="text-gray-400 text-lg font-bold mb-3 flex items-center gap-2">
          <span class="text-gray-600">▶</span> EDUCATION
        </h2>
        <div class="pl-6">
          <div class="flex justify-between items-start mb-1">
            <h3 class="text-gray-400 font-bold text-sm">BSc in Computer Engineering</h3>
            <span class="text-gray-600 text-xs">Sep 2022 – Present</span>
          </div>
          <p class="text-gray-600 text-xs">Azad University, Iran</p>
        </div>
      </div>

      <!-- Recognition -->
      <div class="resume-section mb-6">
        <h2 class="text-gray-400 text-lg font-bold mb-3 flex items-center gap-2">
          <span class="text-gray-600">▶</span> RECOGNITION
        </h2>
        <div class="pl-6 space-y-2 text-xs text-gray-600">
          <div class="project-item">
            <span class="text-gray-700">▪</span> Top 10 GitHub Contributor in Iran
          </div>
          <div class="project-item">
            <span class="text-gray-700">▪</span> 15+ Published Technical Articles on Dev.to and Medium
          </div>
          <div class="project-item">
            <span class="text-gray-700">▪</span> Framework Creator — Gland framework with modular event-driven architecture
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="resume-section border-t border-gray-800 pt-4 text-center">
        <p class="text-gray-600 text-xs mb-2">
          Download PDF: <span class="text-gray-500 cursor-pointer hover:text-gray-400 transition" onclick="window.open('https://raw.githubusercontent.com/m-mdy-m/m-mdy-m.github.io/main/src/resume/resume-en.pdf', '_blank')">curl -s resume.pdf</span>
        </p>
        <p class="text-gray-700 text-xs">
          Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
        </p>
      </div>
    </div>
  `;
}

export { commandRegistry, textOutput, errorOutput };