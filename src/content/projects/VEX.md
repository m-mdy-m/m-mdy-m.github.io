---
title: "VEX"
description: "A minimal, dark-themed Vim configuration with handpicked plugins, custom keybindings, and LSP support—built for speed and productivity."
date: 2025-07-19
tags: ['Vim', 'Editor', 'Configuration', 'LSP', 'Productivity', 'CLI']
image: "https://raw.githubusercontent.com/m-mdy-m/.vimrc/main/screenshots/home.png"
repository: "https://github.com/m-mdy-m/.vimrc"
status: "active"
---

# VEX: Vim Ecosystem Extension

A clean, minimal Vim setup designed for developers who want power without complexity. VEX combines modern LSP support, intelligent plugins, and intuitive keybindings into a dark-themed workflow that just works.

## The Philosophy

Most Vim configurations are either too minimal (bare bones) or too bloated (kitchen sink). VEX strikes a balance—handpicked plugins that solve real problems, keybindings that feel natural, and a setup script that gets you coding in seconds.

Built for:
- Fast navigation and editing
- LSP-powered autocomplete and diagnostics  
- Git integration without leaving Vim
- Terminal access within your editor
- Visual consistency with a modern dark theme

## Quick Start

```bash
git clone https://github.com/m-mdy-m/.vimrc.git
cd .vimrc
./script/setup
```

The setup script handles everything:
1. Checks/installs Vim
2. Links your `.vimrc` configuration
3. Installs [vim-plug](https://github.com/junegunn/vim-plug)
4. Auto-installs all plugins
5. Optionally sets up LSP servers

## Project Structure

```
.vimrc/
├── src/
│   ├── .vimrc              # Main configuration entry point
│   ├── appearance.vim      # Color scheme & UI
│   ├── keys.vim            # All keybindings
│   ├── editorconfig.vim    # EditorConfig integration
│   ├── plugins/
│   │   ├── install.vim     # Plugin declarations
│   │   └── settings.vim    # Plugin configurations
│   └── lsp/
│       └── settings.vim    # LSP & completion setup
├── script/
│   ├── setup               # Main installation script
│   └── install-lsp         # Language server installer
└── .editorconfig.default   # Default EditorConfig template
```

---

## Complete Keybindings Reference

### Basic Editing

| Keybinding | Action | Notes |
|------------|--------|-------|
| `Ctrl+Z` | Undo | Works in normal & insert mode |
| `Ctrl+Y` | Redo | Standard redo operation |
| `Ctrl+X` | Cut line | Cuts to system clipboard |
| `Ctrl+C` | Copy line | Copies to system clipboard |
| `Ctrl+V` | Paste | Pastes from system clipboard |
| `Ctrl+Shift+V` | Paste before cursor | Alternative paste position |
| `Ctrl+A` | Select all | Selects entire buffer |
| `Ctrl+S` | Save file | Quick save in all modes |

### Text Selection

| Keybinding | Action | Notes |
|------------|--------|-------|
| `Shift+Left/Right/Up/Down` | Character selection | Visual selection by char |
| `Ctrl+Shift+Left/Right` | Word selection | Select by word boundaries |
| `Shift+Home` | Select to line start | From cursor to beginning |
| `Shift+End` | Select to line end | From cursor to end |

### Navigation

| Keybinding | Action | Notes |
|------------|--------|-------|
| `Home` | Jump to line start | Beginning of line (column 0) |
| `End` | Jump to line end | End of line |
| `Ctrl+Left` | Previous word | Word-based navigation |
| `Ctrl+Right` | Next word | Jump forward by word |
| `Ctrl+Delete` | Delete word forward | Removes next word |
| `Ctrl+Backspace` | Delete word backward | Removes previous word |

### Line Operations

| Keybinding | Action | Notes |
|------------|--------|-------|
| `Ctrl+L` | Select entire line | Quick line selection |
| `Alt+Shift+Down` | Duplicate line down | Like VSCode |
| `Alt+Up` | Move line up | Swap with line above |
| `Alt+Down` | Move line down | Swap with line below |

### Indentation

| Keybinding | Action | Notes |
|------------|--------|-------|
| `Tab` | Indent right | In normal/visual mode |
| `Shift+Tab` | Indent left | Un-indent selection |

### Search & Replace

| Keybinding | Action | Notes |
|------------|--------|-------|
| `Ctrl+F` | Start search | Opens search prompt |
| `F3` | Find next | Jump to next match |
| `Shift+F3` | Find previous | Jump to previous match |
| `Ctrl+H` | Find & replace | Interactive replacement |

### Window Management

| Keybinding | Action | Notes |
|------------|--------|-------|
| `Ctrl+\` | Vertical split | Split window vertically |
| `Ctrl+Shift+\` | Horizontal split | Split window horizontally |
| `Ctrl+Shift+W` | Close window | Close current split |
| `Ctrl+Shift+H/J/K/L` | Navigate splits | Vim-style window nav |
| `Ctrl+Shift+Left/Right` | Resize horizontal | Adjust split width |
| `Ctrl+Shift+Up/Down` | Resize vertical | Adjust split height |

### Tab Management

| Keybinding | Action | Notes |
|------------|--------|-------|
| `Ctrl+T` | New tab | Opens empty tab |
| `Ctrl+W` | Close tab | Closes current tab |
| `Ctrl+Tab` | Next tab | Cycle tabs forward |
| `Ctrl+Shift+Tab` | Previous tab | Cycle tabs backward |
| `Alt+1` through `Alt+9` | Jump to tab N | Direct tab access |

### File Explorer (NERDTree)

| Keybinding | Action | Notes |
|------------|--------|-------|
| `F2` | Toggle NERDTree | Show/hide file tree |
| `F3` | Focus NERDTree | Jump to file explorer |
| `Ctrl+E` | Toggle NERDTree | Alternative toggle |
| `Leader+N` | Find current file | Locate in tree |
| `Leader+F` | Find file in tree | Navigate to file |

### LSP (Language Server Protocol)

| Keybinding | Action | Notes |
|------------|--------|-------|
| `F12` | Go to definition | Jump to symbol definition |
| `Shift+F12` | Find references | Show all references |
| `F2` | Rename symbol | Intelligent rename |
| `Ctrl+K Ctrl+I` | Show documentation | Hover info popup |
| `Leader+CA` | Code actions | Quick fixes & refactors |
| `Leader+QF` | Quick fix | Apply first suggestion |
| `Shift+Alt+F` | Format document | Auto-format code |
| `Leader+D` | Document diagnostics | Show all errors/warnings |
| `Leader+E` | Next diagnostic | Jump to next issue |
| `Leader+Shift+E` | Previous diagnostic | Jump to previous issue |
| `K` | Hover documentation | LSP hover info |
| `GD` | Go to definition | Alternative binding |
| `GR` | Go to references | Find all references |
| `GI` | Go to implementation | Jump to implementation |
| `GT` | Go to type definition | Jump to type |

### Git Integration

| Keybinding | Action | Notes |
|------------|--------|-------|
| `Leader+GS` | Git status | Show status in terminal |
| `Leader+GL` | Git log | Visual commit history |
| `Leader+GD` | Git diff | Show changes |
| `Leader+GB` | Git blame | Line-by-line blame |
| `Leader+GM` | Git messenger | Commit info popup |
| `Leader+GA` | Git add all | Stage all changes |
| `Leader+GC` | Git commit | Interactive commit |
| `Leader+GP` | Git push | Push to remote |
| `Leader+Shift+GP` | Git pull | Pull from remote |
| `Leader+GAF` | Git add current file | Stage current file |
| `]H` | Next hunk | Jump to next change |
| `[H` | Previous hunk | Jump to previous change |
| `Leader+HP` | Preview hunk | Show diff inline |
| `Leader+HS` | Stage hunk | Stage current change |
| `Leader+HU` | Undo hunk | Revert change |
| `Leader+GCO` | Git checkout | Switch branch |
| `Leader+GNB` | New branch | Create & switch branch |
| `Leader+GST` | Git stash | Stash changes |
| `Leader+GSP` | Git stash pop | Apply stashed changes |
| `Leader+GSL` | Git stash list | View stash stack |
| `Leader+GV` | Git viewer | Visual commit browser |

**Semantic Commit Types:**

| Keybinding | Commit Type | Usage |
|------------|-------------|-------|
| `Leader+GCF` | `feat:` | New features |
| `Leader+GCX` | `fix:` | Bug fixes |
| `Leader+GCD` | `docs:` | Documentation |
| `Leader+GCR` | `refactor:` | Code refactoring |

### Terminal (FloaTerm)

| Keybinding | Action | Notes |
|------------|--------|-------|
| `Ctrl+Shift+T` | Toggle terminal | Show/hide floating terminal |
| `Leader+TT` | New terminal | Create new terminal |
| `Leader+TH` | Toggle terminal | Alternative toggle |
| `Leader+TK` | Kill terminal | Close current terminal |
| `Leader+TN` | Next terminal | Switch to next |
| `Leader+TP` | Previous terminal | Switch to previous |
| `Leader+TR` | Run command | Execute in terminal |
| `Leader+TG` | Git terminal | Terminal with git context |
| `Esc` | Exit terminal mode | Return to normal mode |
| `Alt+H/J/K/L` | Navigate from terminal | Switch splits from terminal |

### FZF (Fuzzy Finder)

| Keybinding | Action | Notes |
|------------|--------|-------|
| `Ctrl+P` | Find files | Fuzzy file search |
| `Ctrl+F` | Find in files | Content search (Ripgrep) |

### Comments

| Keybinding | Action | Notes |
|------------|--------|-------|
| `Ctrl+/` | Toggle comment | Comment/uncomment lines |

### Productivity Tools

| Keybinding | Action | Notes |
|------------|--------|-------|
| `Leader+U` | Undo tree | Visual undo history |
| `F12` | Reload .vimrc | Apply config changes |

### Special Keys Reference

- `Leader` key is set to `\` (backslash)
- Timeout: 3000ms for leader combinations
- All clipboard operations use system clipboard (`+` register)

---

## Plugin Stack

### LSP & Completion
- **vim-lsp** - Native LSP client
- **vim-lsp-settings** - Auto language server installer
- **asyncomplete** - Async completion framework
- **asyncomplete-lsp** - LSP integration for completion

### File & Project Management
- **NERDTree** - Visual file explorer with icons
- **NERDCommenter** - Quick comment toggling
- **FZF** + **fzf.vim** - Fuzzy file/content search

### Editor Enhancement
- **vim-surround** - Manipulate surrounding characters
- **vim-repeat** - Enhanced `.` repeat
- **auto-pairs** - Auto-close brackets/quotes
- **vim-multiple-cursors** - Multi-cursor editing
- **vim-easymotion** - Jump anywhere fast
- **syntastic** - Syntax error checking
- **editorconfig-vim** - EditorConfig support
- **indentLine** - Visual indent guides

### UI & Status
- **vim-airline** - Enhanced status/tabline
- **vim-airline-themes** - Airline color schemes
- **vim-startify** - Custom start screen
- **vim-css-color** - Color preview in files

### Language Support
- **vim-polyglot** - 100+ language packs

### Formatting
- **tabular** - Text alignment tool
- **neoformat** - Universal code formatter

### Sessions & State
- **vim-session** + **vim-misc** - Project sessions
- **vim-obsession** - Auto session tracking
- **undotree** - Visual undo tree browser

### Git Integration
- **vim-fugitive** - Git commands in Vim
- **vim-gitgutter** - Git diff in sign column
- **gv.vim** - Commit browser
- **git-messenger.vim** - Blame popup
- **vim-mergetool** - Conflict resolution

### Terminal
- **vim-floaterm** - Floating terminal windows

---

## Theme & Appearance

VEX uses a custom dark theme optimized for long coding sessions:

**Color Palette:**
- Background: `#0a0a0a` (true black)
- Foreground: `#d4d4d8` (light gray)
- Accent: `#c084fc` (purple)
- Comments: `#6b8e6b` (muted green)
- Strings: `#8b9d8b` (soft green)
- Keywords: `#b8b4d8` (light purple)
- Functions: `#e0e7f5` (white-blue)

**Features:**
- Syntax highlighting for 100+ languages
- Git diff colors in gutter
- LSP diagnostic signs (✗ ⚠ ℹ)
- Semantic token highlighting
- Custom FZF color integration
- Transparent backgrounds for floating windows

---

## LSP Configuration

VEX includes pre-configured LSP support for major languages:

**Supported Languages:**
- JavaScript/TypeScript (typescript-language-server)
- Python (pyright / python-lsp-server)
- Go (gopls)
- Rust (rust-analyzer)
- C/C++ (clangd)
- HTML/CSS/JSON (vscode-langservers-extracted)
- YAML (yaml-language-server)
- Bash (bash-language-server)
- Docker (dockerfile-language-server)
- Ruby (solargraph)
- PHP (php-language-server)
- Lua (lua-language-server)

**LSP Features:**
- Real-time diagnostics with error/warning signs
- Intelligent code completion (no autoselect)
- Signature help in insert mode
- Go to definition/references/implementation
- Symbol renaming across files
- Code actions & quick fixes
- Document/workspace symbols
- Hover documentation
- Document formatting

**Install LSP Servers:**
```bash
./script/install-lsp
```

The script detects your system and installs all available language servers automatically.

---

## EditorConfig Integration

VEX respects `.editorconfig` files with priority:
1. Project `.editorconfig`
2. VEX defaults
3. Vim defaults

**Create default config:**
```vim
:EditorConfigCreate
```

**Check current settings:**
```vim
:EditorConfigStatus
```

**Keybindings:**
- `Leader+EC` - Show EditorConfig status
- `Leader+EN` - Create new .editorconfig
- `Leader+EE` - Edit .editorconfig

---

## Git Features

### GitGutter
Real-time diff markers in the sign column:
- `+` Added lines (green)
- `~` Modified lines (yellow)
- `-` Removed lines (red)

### Git Messenger
Hover over any line and press `Leader+GM` to see:
- Commit hash
- Author & date
- Full commit message
- Optional diff view

### GV (Git Viewer)
Visual commit browser:
- `Leader+GV` - All commits
- `Leader+Shift+GV` - Current file history
- `Leader+GVF` - Search commits

---

## Terminal Integration

FloaTerm provides a floating terminal overlay:

**Layouts:**
- Center: `0.8` width × `0.7` height
- Custom positioning via commands

**Features:**
- Multiple terminal instances
- Navigate between terminals
- Auto-close on success
- Git-aware commands
- Custom borders & styling

---

## Custom Commands

| Command | Description |
|---------|-------------|
| `:EditorConfigCreate` | Create default .editorconfig |
| `:EditorConfigStatus` | Show current EditorConfig settings |
| `:LspStatus` | Display LSP server status |
| `:LspRestart` | Restart all LSP servers |
| `:LspInstallServer` | Install language servers |
| `:GitStatus` | Open git status in terminal |
| `:GitLog` | View commit history |
| `:GitDiff` | Show changes |
| `:GitAdd` | Stage changes interactively |
| `:GitCommit` | Interactive commit |

---

## Performance Features

- Lazy plugin loading where possible
- Async completion (no UI blocking)
- Timed updates: 300ms
- Efficient undo file storage
- No swap/backup files (configurable)
- Fast redraw with `lazyredraw`

---

## System Requirements

**Minimum:**
- Vim 8.0+ or Neovim 0.5+
- Git
- curl or wget

**Recommended:**
- Vim 9.0+ or Neovim 0.9+
- Node.js (for many LSP servers)
- Python 3.8+ (for Python LSP)
- Ripgrep (for FZF content search)

**Supported Systems:**
- Linux (Debian, Arch, Fedora, RHEL, openSUSE, Alpine, Void)
- macOS (with Homebrew)
- Windows (via WSL)

---

## Screenshots

**Home Screen:**
![VEX Home](https://raw.githubusercontent.com/m-mdy-m/.vimrc/main/screenshots/home.png)

**Code Editing:**
![VEX Code](https://raw.githubusercontent.com/m-mdy-m/.vimrc/main/screenshots/code.png)

---

## Installation Details

The setup script performs:

1. **System Check** - Detects OS and package manager
2. **Vim Installation** - Installs if missing
3. **Backup** - Preserves existing config to `~/.vim/backups/`
4. **Directory Structure** - Creates required folders
5. **vim-plug** - Installs plugin manager
6. **Config Linking** - Symlinks `.vimrc` to VEX source
7. **EditorConfig** - Copies default template
8. **Plugin Installation** - Auto-installs all plugins
9. **LSP Setup** (optional) - Installs language servers

**Backup Location:**
```
~/.vim/backups/
├── .vimrc.backup.20250119_143022
└── .vim.backup.20250119_143022/
```

---

## Configuration Files

**Main Config:**
- `src/.vimrc` - Entry point with basic settings

**Modular Components:**
- `src/appearance.vim` - Theme & colors
- `src/keys.vim` - All keybindings
- `src/editorconfig.vim` - EditorConfig logic
- `src/plugins/install.vim` - Plugin list
- `src/plugins/settings.vim` - Plugin configs
- `src/lsp/settings.vim` - LSP setup

---

## Customization

### Change Leader Key
Edit `src/.vimrc`:
```vim
let mapleader = ','  " Use comma instead of backslash
```

### Add Plugins
Edit `src/plugins/install.vim`:
```vim
Plug 'author/plugin-name'
```
Then run `:PlugInstall`

### Modify Theme
Edit `src/appearance.vim` - All highlight groups are defined here.

### Custom Keybindings
Add to `src/keys.vim`:
```vim
nnoremap <Leader>custom :YourCommand<CR>
```

---

## Troubleshooting

**Plugins not installing:**
```vim
:PlugInstall
:PlugUpdate
```

**LSP not working:**
```vim
:LspStatus
:LspLog
:LspInstallServer
```

**Permission issues:**
```bash
chmod +x ./script/setup
chmod +x ./script/install-lsp
```

**Config not loading:**
```vim
:so $MYVIMRC
" or press F12
```

---

## Philosophy

VEX follows these principles:

1. **Minimal but Complete** - Only what you actually use
2. **Intuitive Keybindings** - Muscle memory from other editors
3. **LSP First** - Modern language support out of the box
4. **Git Integrated** - Version control without context switching
5. **Terminal Native** - Work within Vim, not alongside it
6. **Dark by Default** - Easy on the eyes, focus on code
7. **Fast Setup** - One command to working environment
8. **Modular Config** - Easy to understand and customize

---

## Links

- **Repository:** [github.com/m-mdy-m/.vimrc](https://github.com/m-mdy-m/.vimrc)
- **Screenshots:** [View Gallery](https://github.com/m-mdy-m/.vimrc/tree/main/screenshots)
- **Issues:** [Report Bug](https://github.com/m-mdy-m/.vimrc/issues)
- **License:** MIT

---

## Contributing

Found a bug? Have a suggestion? Want to add a feature?

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

All contributions welcome—especially:
- New language LSP configs
- Keybinding improvements
- Theme variations
- Documentation fixes

---

## Credits

VEX builds on the work of countless Vim plugin authors. Special thanks to:
- **vim-plug** - junegunn
- **vim-lsp** - prabirshrestha
- **vim-airline** - vim-airline contributors
- **NERDTree** - preservim
- **fzf.vim** - junegunn
- All other plugin maintainers

---

*VEX: Vim Ecosystem Extension - Because your editor should work for you, not against you.*
