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
      
      if (filename === 'resume.pdf' || filename === 'resume-en.pdf') {
        fetch('https://raw.githubusercontent.com/m-mdy-m/m-mdy-m.github.io/main/src/resume/resume-en.pdf')
          .then(response => response.blob())
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
              <span class="text-terminal-accent">●</span>
              <span class="text-terminal-text">Connecting to server...</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-terminal-accent">●</span>
              <span class="text-terminal-text">Downloading resume-en.pdf</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-terminal-accent">✓</span>
              <span class="text-terminal-primary">Download complete!</span>
            </div>
          </div>
        `;
      } else {
        return errorOutput(`File '${filename}' not found.`);
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
     resume: 'Display resume in terminal format.',
    curl: 'Download files from the server.',
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


function generateResumeOutput(lang = 'en') {
  if (lang === 'fa') {
    return `<div class="text-terminal-muted text-center py-8">Persian version coming soon...</div>`;
  }
  
  return `
    <div class="resume-container font-mono text-terminal-primary max-w-5xl mx-auto">
      <style>
        .resume-section { animation: slideIn 0.5s ease-out forwards; opacity: 0; }
        .resume-section:nth-child(1) { animation-delay: 0.1s; }
        .resume-section:nth-child(2) { animation-delay: 0.2s; }
        .resume-section:nth-child(3) { animation-delay: 0.3s; }
        .resume-section:nth-child(4) { animation-delay: 0.4s; }
        .resume-section:nth-child(5) { animation-delay: 0.5s; }
        .resume-section:nth-child(6) { animation-delay: 0.6s; }
        
        @keyframes slideIn {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .skill-badge {
          transition: all 0.3s ease;
        }
        
        .skill-badge:hover {
          transform: translateX(5px);
          color: #666666;
        }
        
        .project-item {
          transition: all 0.3s ease;
          border-left: 2px solid transparent;
          padding-left: 1rem;
        }
        
        .project-item:hover {
          border-left-color: #666666;
          padding-left: 1.5rem;
        }
      </style>

      <!-- Header -->
      <div class="resume-section mb-8 text-center border-b border-terminal-accent pb-6">
        <pre class="text-terminal-accent text-xs leading-tight mb-3 inline-block">
╔═══════════════════════════════════════════════════╗
║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ║
║  ▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓  ║
║  ▓░  BACKEND DEVELOPER | OPEN SOURCE       ░▓  ║
║  ▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓  ║
║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ║
╚═══════════════════════════════════════════════════╝
        </pre>
        <h1 class="text-3xl font-bold text-terminal-accent mb-2">MAHDI MAMASHLI</h1>
        <p class="text-terminal-text text-sm mb-3">Backend Developer | Open Source Contributor</p>
        <div class="flex flex-wrap justify-center gap-4 text-xs">
          <span class="flex items-center gap-1">
            <span class="text-terminal-accent">@</span>
            <a href="mailto:bitsgenix@gmail.com" class="hover:text-terminal-accent transition">bitsgenix@gmail.com</a>
          </span>
          <span class="flex items-center gap-1">
            <span class="text-terminal-accent">⚡</span>
            <a href="https://github.com/m-mdy-m" class="hover:text-terminal-accent transition">github.com/m-mdy-m</a>
          </span>
          <span class="flex items-center gap-1">
            <span class="text-terminal-accent">📍</span>
            <span>Iran</span>
          </span>
        </div>
      </div>

      <!-- Summary -->
      <div class="resume-section mb-6">
        <h2 class="text-terminal-accent text-lg font-bold mb-3 flex items-center gap-2">
          <span class="text-terminal-accent">▶</span> SUMMARY
        </h2>
        <p class="text-terminal-text text-sm leading-relaxed pl-6">
          Backend developer with experience in scalable architectures, event-driven systems, and developer tooling. 
          Passionate about open-source contribution and building robust backend applications.
        </p>
      </div>

      <!-- Skills -->
      <div class="resume-section mb-6">
        <h2 class="text-terminal-accent text-lg font-bold mb-3 flex items-center gap-2">
          <span class="text-terminal-accent">▶</span> SKILLS
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 text-xs">
          <div>
            <h3 class="text-terminal-text font-bold mb-2">Languages</h3>
            <div class="space-y-1">
              <div class="skill-badge">▪ TypeScript, JavaScript</div>
            </div>
          </div>
          <div>
            <h3 class="text-terminal-text font-bold mb-2">Frameworks</h3>
            <div class="space-y-1">
              <div class="skill-badge">▪ Express.js, Nest.js</div>
            </div>
          </div>
          <div>
            <h3 class="text-terminal-text font-bold mb-2">Databases</h3>
            <div class="space-y-1">
              <div class="skill-badge">▪ MongoDB, MySQL/MariaDB, Redis</div>
            </div>
          </div>
          <div>
            <h3 class="text-terminal-text font-bold mb-2">DevOps</h3>
            <div class="space-y-1">
              <div class="skill-badge">▪ Docker, Git, CI/CD</div>
            </div>
          </div>
          <div class="md:col-span-2">
            <h3 class="text-terminal-text font-bold mb-2">Architecture</h3>
            <div class="space-y-1">
              <div class="skill-badge">▪ Event-Driven, Microservices, RESTful APIs, Caching Strategies</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Experience -->
      <div class="resume-section mb-6">
        <h2 class="text-terminal-accent text-lg font-bold mb-3 flex items-center gap-2">
          <span class="text-terminal-accent">▶</span> PROFESSIONAL EXPERIENCE
        </h2>
        <div class="pl-6 space-y-4">
          <div class="project-item">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-terminal-text font-bold">Open Source Developer</h3>
              <span class="text-terminal-muted text-xs">2023 – Present</span>
            </div>
            <p class="text-terminal-muted text-xs italic mb-2">Independent Contributor</p>
            <ul class="text-xs space-y-1 list-none">
              <li class="flex items-start gap-2">
                <span class="text-terminal-accent">•</span>
                <span>Developed open-source backend frameworks and developer tools, improving performance and modularity</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-terminal-accent">•</span>
                <span>Designed scalable backend architectures using Node.js, TypeScript, and event-driven patterns</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-terminal-accent">•</span>
                <span>Contributed to multiple open-source projects, enhancing engineering best practices</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-terminal-accent">•</span>
                <span>Published 15+ technical articles on advanced programming topics with significant community engagement</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Projects -->
      <div class="resume-section mb-6">
        <h2 class="text-terminal-accent text-lg font-bold mb-3 flex items-center gap-2">
          <span class="text-terminal-accent">▶</span> PROJECTS
        </h2>
        <div class="pl-6 space-y-4 text-xs">
          <div class="project-item">
            <div class="flex justify-between items-start mb-1">
              <h3 class="text-terminal-text font-bold">Gland | Backend Framework</h3>
              <a href="https://github.com/m-mdy-m/gland" class="text-terminal-accent hover:underline">github</a>
            </div>
            <ul class="space-y-1 list-none">
              <li class="flex items-start gap-2">
                <span class="text-terminal-accent">•</span>
                <span>Developed event-driven backend framework</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-terminal-accent">•</span>
                <span>Implemented modular architecture</span>
              </li>
            </ul>
          </div>

          <div class="project-item">
            <div class="flex justify-between items-start mb-1">
              <h3 class="text-terminal-text font-bold">Qiks | Caching System</h3>
              <a href="https://github.com/medishen/qiks" class="text-terminal-accent hover:underline">github</a>
            </div>
            <ul class="space-y-1 list-none">
              <li class="flex items-start gap-2">
                <span class="text-terminal-accent">•</span>
                <span>Designed in-memory caching system for JavaScript/TypeScript applications to improve performance</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-terminal-accent">•</span>
                <span>Implemented LRU, LFU, and TTL-based eviction policies with configurable parameters</span>
              </li>
            </ul>
          </div>

          <div class="project-item">
            <div class="flex justify-between items-start mb-1">
              <h3 class="text-terminal-text font-bold">TideityIQ | Developer Tool</h3>
              <a href="https://github.com/medishen/TideityIQ" class="text-terminal-accent hover:underline">github</a>
            </div>
            <ul class="space-y-1 list-none">
              <li class="flex items-start gap-2">
                <span class="text-terminal-accent">•</span>
                <span>Created a CLI tool for analyzing algorithmic time complexity</span>
              </li>
            </ul>
          </div>

          <div class="project-item">
            <div class="flex justify-between items-start mb-1">
              <h3 class="text-terminal-text font-bold">Cop | Telegram Bot</h3>
              <a href="https://github.com/CodeModule-ir/cop" class="text-terminal-accent hover:underline">github</a>
            </div>
            <ul class="space-y-1 list-none">
              <li class="flex items-start gap-2">
                <span class="text-terminal-accent">•</span>
                <span>Developed a Telegram bot for managing group activities</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Education -->
      <div class="resume-section mb-6">
        <h2 class="text-terminal-accent text-lg font-bold mb-3 flex items-center gap-2">
          <span class="text-terminal-accent">▶</span> EDUCATION
        </h2>
        <div class="pl-6">
          <div class="flex justify-between items-start mb-1">
            <h3 class="text-terminal-text font-bold">BSc in Computer Engineering</h3>
            <span class="text-terminal-muted text-xs">2022 – Present</span>
          </div>
          <p class="text-terminal-muted text-xs">Azad University</p>
        </div>
      </div>

      <!-- Achievements -->
      <div class="resume-section mb-6">
        <h2 class="text-terminal-accent text-lg font-bold mb-3 flex items-center gap-2">
          <span class="text-terminal-accent">▶</span> ACHIEVEMENTS & COMMUNITY
        </h2>
        <div class="pl-6 space-y-3 text-xs">
          <div class="project-item">
            <h3 class="text-terminal-text font-bold mb-1">Published Articles</h3>
            <p>Authored widely-read technical articles on programming, algorithms, and backend development</p>
          </div>
          <div class="project-item">
            <h3 class="text-terminal-text font-bold mb-1">Top Contributor</h3>
            <p>Among the top 10 GitHub contributors in Iran</p>
          </div>
          <div class="project-item">
            <h3 class="text-terminal-text font-bold mb-1">Leading Open-Source Contributor</h3>
            <p>Developed and maintained Gland, a modular backend framework used in scalable applications</p>
          </div>
          <div class="project-item">
            <h3 class="text-terminal-text font-bold mb-1">Active Developer Community Engagement</h3>
            <p>Actively contributed to Stack Overflow and open-source projects, sharing technical knowledge</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="resume-section border-t border-terminal-accent pt-4 text-center">
        <p class="text-terminal-muted text-xs mb-2">
          Download PDF version: <span class="text-terminal-accent cursor-pointer hover:underline" onclick="window.open('https://raw.githubusercontent.com/m-mdy-m/m-mdy-m.github.io/main/src/resume/resume-en.pdf', '_blank')">curl -s resume.pdf</span>
        </p>
        <p class="text-terminal-muted text-xs">
          Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
        </p>
      </div>
    </div>
  `;
}
export { commandRegistry, textOutput, errorOutput };
