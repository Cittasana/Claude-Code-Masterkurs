# Lektion 30: zellij - Moderne Terminal Multiplexer Alternative

## 🎯 Berechtigung

**zellij** ist ein moderner Terminal-Multiplexer, der als zeitgemäße Alternative zu tmux entwickelt wurde. Mit seiner intuitiven Benutzeroberfläche, eingebauten Layouts, Plugin-System und benutzerfreundlichen Defaults macht zellij komplexe Terminal-Workflows zugänglich, ohne dass umfangreiche Konfiguration erforderlich ist.

### Was ist zellij?

zellij ist ein in Rust geschriebener Terminal-Multiplexer der nächsten Generation mit folgenden Eigenschaften:

- **Moderne UX**: Intuitive Bedienung mit eingeblendeten Shortcuts und visueller Orientierung
- **Layout-System**: Vordefinierte und benutzerdefinierte Layouts für verschiedene Workflows
- **Plugin-Architektur**: Erweiterbar durch WebAssembly-Plugins
- **Persistent Sessions**: Sessions überleben Terminal-Schließungen und SSH-Disconnects
- **Floating Panes**: Schwebende Fenster zusätzlich zu gekachelten Layouts
- **Session-Manager**: Integriertes Session-Management ohne externe Tools
- **Copy-Mode**: Vim-like Scrolling und Text-Selektion
- **Tabs & Panes**: Flexible Organisation mit Tabs und Split-Panes

### Warum zellij für Claude Code?

1. **Einsteigerfreundlich**: Weniger Lernkurve als tmux durch visuelle Hilfen
2. **Layout-Effizienz**: Schnelles Umschalten zwischen vordefinierten Workflows
3. **Plugin-Integration**: Erweiterbar für Claude Code spezifische Workflows
4. **Session-Persistenz**: Code-Sessions überleben Neustarts und Verbindungsabbrüche
5. **Modern Design**: Zeitgemäße Features wie floating windows und bessere Mouse-Support

---

> 🚀 **Claude Code Relevanz**: zellij ermoeglicht es, Claude Code in einem Pane laufen zu lassen, waehrend Tests, Logs und Server parallel in anderen Panes sichtbar bleiben -- ideal fuer komplexe Multi-Task-Entwicklung.

## 🎓 Zwecke

### Primäre Anwendungsfälle

1. **Multi-Task Development**: Mehrere Terminal-Sessions parallel managen
2. **Persistent Workflows**: Sessions überleben SSH-Disconnects und System-Reboots
3. **Layout-basierte Entwicklung**: Vordefinierte Layouts für verschiedene Projekte
4. **Remote Development**: Sichere Arbeit an Remote-Systemen ohne Verbindungsverlust
5. **Code + Monitor**: Editor in einem Pane, Logs/Tests in anderen
6. **Pair Programming**: Geteilte Sessions für Zusammenarbeit

### Typische Workflows

- **Full-Stack Development**: Frontend, Backend, Database in verschiedenen Panes
- **DevOps Operations**: Server-Monitoring in mehreren Tabs organisieren
- **Data Science**: Jupyter Notebook + Python REPL + Data Viewer parallel
- **Testing Workflow**: Code-Editor + Test-Runner + Log-Output gleichzeitig
- **Documentation**: Editor + Live-Preview + Terminal parallel

---

## 💻 Verwendung

> 💡 **Tipp**: zellij zeigt Tastenkuerzel direkt in der Statusleiste an -- perfekt fuer Einsteiger, die sich keine Keybindings merken muessen.

### Installation

zellij kann ueber verschiedene Paketmanager installiert werden. Auf macOS ist Homebrew die einfachste Methode, auf Linux stehen offizielle Releases und Cargo zur Verfuegung:

```bash
# macOS
brew install zellij

# Ubuntu/Debian
# Download latest release
wget https://github.com/zellij-org/zellij/releases/latest/download/zellij-x86_64-unknown-linux-musl.tar.gz
tar -xzf zellij-x86_64-unknown-linux-musl.tar.gz
sudo mv zellij /usr/local/bin/

# Arch Linux
pacman -S zellij

# Via Cargo (alle Plattformen)
cargo install zellij

# Version überprüfen
zellij --version
```

### Grundlegende Verwendung

Die wichtigsten Befehle fuer den Einstieg: Sessions erstellen, auflisten, wiederherstellen und loeschen. Named Sessions helfen, mehrere Projekte parallel zu verwalten:

```bash
# Neue Session starten
zellij

# Named Session starten
zellij --session my-project

# Session mit spezifischem Layout
zellij --layout compact

# Alle Sessions auflisten
zellij list-sessions

# An existierende Session anhängen
zellij attach my-project

# Session löschen
zellij delete-session my-project

# Alle Sessions löschen
zellij delete-all-sessions

# Session im Hintergrund starten
zellij --session background-task --daemon
```

### Wichtigste Tastenkombinationen

zellij organisiert seine Keybindings in Modi (aehnlich wie vim). Die Statusleiste zeigt dir immer, welche Tasten gerade verfuegbar sind.

**Session Management:**

Wenn du eine Session verlassen willst ohne sie zu beenden, nutze Detach. Die Session laeuft im Hintergrund weiter und kann spaeter wieder aufgenommen werden:

```
Ctrl+o d     Detach von Session (Session läuft weiter)
Ctrl+o q     Quit und Session beenden
Ctrl+o w     Session-Manager öffnen
```

**Pane Management:**

Panes teilen dein Terminal in mehrere Bereiche auf. Du kannst horizontal (unten) oder vertikal (rechts) splitten und einzelne Panes in den Vollbildmodus schalten:

```
Ctrl+p n     Neues Pane unten
Ctrl+p r     Neues Pane rechts
Ctrl+p f     Fullscreen Toggle für aktuelles Pane
Ctrl+p x     Pane schließen
Ctrl+p z     Zoom Pane (fullscreen)
```

**Navigation:**

Zwischen den Panes wechselst du mit Pfeiltasten oder Vim-Shortcuts. Die Groesse einzelner Panes kannst du mit Alt + Pfeiltasten anpassen:

```
Ctrl+p ←→↑↓  Zwischen Panes navigieren
Ctrl+p h/j/k/l  Vim-style Navigation
Alt+←→↑↓     Pane-Größe anpassen
```

**Tabs:**

Tabs gruppieren mehrere Panes zu logischen Einheiten. Nutze Tabs um verschiedene Aufgaben zu trennen, zum Beispiel einen Tab fuer Code und einen fuer Tests:

```
Ctrl+t n     Neuer Tab
Ctrl+t x     Tab schließen
Ctrl+t →     Nächster Tab
Ctrl+t ←     Vorheriger Tab
Ctrl+t r     Tab umbenennen
```

**Floating Panes:**

Floating Panes schweben ueber dem normalen Layout und eignen sich fuer schnelle, temporaere Aufgaben, ohne die bestehende Pane-Anordnung zu veraendern:

```
Ctrl+p w     Floating Pane öffnen
Ctrl+p e     Floating Pane zu/aus Toggle
```

**Copy Mode:**

Im Copy Mode kannst du durch den Scrollback-Buffer navigieren, Text suchen und in die Zwischenablage kopieren -- aehnlich wie im Vim-Visual-Mode:

```
Ctrl+s       Copy Mode aktivieren
/            Suchen in Copy Mode
n/N          Nächster/Vorheriger Treffer
y            Text kopieren (nach Selektion)
q            Copy Mode verlassen
```

### Konfiguration

zellij verwendet YAML oder KDL fuer die Konfiguration. KDL ist das empfohlene Format und bietet eine lesbare, verschachtelte Syntax. Mit dem folgenden Befehl generierst du eine Vorlage:

```bash
# Config-Datei generieren
zellij setup --generate-config

# Config-Location
~/.config/zellij/config.yaml  # YAML
# oder
~/.config/zellij/config.kdl   # KDL (empfohlen)
```

**Beispiel-Config (config.kdl):**

Diese Beispiel-Konfiguration setzt ein Theme, aktiviert Maus-Support und definiert benutzerdefinierte Keybindings. Die Optionen `copy_command` und `scrollback_editor` passen das Clipboard- und Scroll-Verhalten an:

```kdl
// ~/.config/zellij/config.kdl

// Theme
theme "dracula"

// Default Shell
default_shell "zsh"

// Copy-Befehl für Clipboard
copy_command "pbcopy"  // macOS
// copy_command "xclip -selection clipboard"  // Linux

// Mouse-Mode
mouse_mode true

// Scrollback
scrollback_editor "nvim"

// Pane Frames
pane_frames true

// Simplified UI
simplified_ui false

// Default Layout
default_layout "compact"

// Keybindings
keybinds {
    normal {
        bind "Ctrl g" { SwitchToMode "locked"; }
        bind "Alt n" { NewPane; }
        bind "Alt h" { MoveFocus "Left"; }
        bind "Alt l" { MoveFocus "Right"; }
        bind "Alt j" { MoveFocus "Down"; }
        bind "Alt k" { MoveFocus "Up"; }
    }
}

// Themes
themes {
    custom {
        fg 200 200 200
        bg 20 20 20
        black 0 0 0
        red 255 0 0
        green 0 255 0
        yellow 255 255 0
        blue 0 0 255
        magenta 255 0 255
        cyan 0 255 255
        white 255 255 255
        orange 255 165 0
    }
}
```

> 🚀 **Beispiel**: Mit `zellij --layout dev` kannst du ein vordefiniertes Layout starten, das Editor, Terminal und Test-Runner sofort korrekt anordnet -- kein manuelles Aufteilen noetig.

### Custom Layouts

Layouts definieren Pane-Anordnungen fuer verschiedene Workflows und koennen beim Start automatisch geladen werden. So musst du Panes nicht jedes Mal manuell aufteilen:

Das folgende Layout teilt das Terminal vertikal in einen grossen Editor-Bereich (60%) und einen kleineren Bereich fuer Terminal und Logs (40%):

```kdl
// ~/.config/zellij/layouts/dev.kdl
layout {
    pane split_direction="vertical" {
        pane size="60%" {
            // Editor
        }
        pane split_direction="horizontal" size="40%" {
            pane {
                // Terminal
            }
            pane {
                // Tests/Logs
            }
        }
    }

    pane size=1 borderless=true {
        plugin location="zellij:tab-bar"
    }
    pane size=1 borderless=true {
        plugin location="zellij:status-bar"
    }
}
```

Weitere Layout-Beispiele:

**Full-Stack Layout:**

Dieses Layout startet Frontend, Backend und Datenbank automatisch in separaten Panes -- ideal fuer Full-Stack-Projekte, bei denen alle drei Komponenten gleichzeitig laufen muessen:

```kdl
// ~/.config/zellij/layouts/fullstack.kdl
layout {
    pane split_direction="horizontal" {
        pane name="Frontend" size="33%" {
            command "npm"
            args "run" "dev"
            cwd "/path/to/frontend"
        }
        pane name="Backend" size="34%" {
            command "python"
            args "manage.py" "runserver"
            cwd "/path/to/backend"
        }
        pane name="Database" size="33%" {
            command "mongod"
        }
    }
}
```

**Data Science Layout:**

Fuer Data-Science-Workflows: Jupyter Notebook nimmt den Hauptbereich ein, waehrend eine Python-REPL und ein Systemmonitor (htop) nebeneinander laufen:

```kdl
// ~/.config/zellij/layouts/datascience.kdl
layout {
    pane split_direction="vertical" {
        pane size="70%" {
            command "jupyter"
            args "notebook"
        }
        pane split_direction="horizontal" size="30%" {
            pane {
                command "python3"
            }
            pane {
                command "htop"
            }
        }
    }
}
```

Layout verwenden:

Ein Layout wird entweder beim Start per Kommandozeile geladen oder in einer laufenden Session ueber das Menue ausgewaehlt:

```bash
# Layout beim Start
zellij --layout dev

# Layout in laufender Session
# Ctrl+p l -> Layout auswählen
```

### Plugins

zellij unterstuetzt WebAssembly-Plugins, die direkt in Layouts eingebettet werden koennen. Es gibt eingebaute Plugins wie die Status-Bar und Tab-Bar, sowie externe Plugins als .wasm-Dateien:

```kdl
// Plugin laden in Layout
pane {
    plugin location="file:/path/to/plugin.wasm"
}

// Oder eingebaute Plugins
pane {
    plugin location="zellij:status-bar"
}
pane {
    plugin location="zellij:tab-bar"
}
pane {
    plugin location="zellij:strider"  // File browser
}
```

---

## 🎯 Best Practices

Die folgenden Best Practices helfen dir, zellij effizient in deinen Alltag zu integrieren und typische Probleme zu vermeiden.

### 1. Session-Organisation

Strukturierte Session-Namen erleichtern das Wiederfinden und Verwalten. Eine konsistente Namenskonvention ist besonders wichtig, wenn du viele Sessions parallel betreibst:

```bash
# Projekt-spezifische Sessions
zellij --session project-alpha
zellij --session project-beta

# Workflow-Sessions
zellij --session development
zellij --session monitoring
zellij --session testing

# Session-Namenskonvention
<projektname>-<typ>
# Beispiele:
zellij --session webapp-dev
zellij --session webapp-debug
zellij --session webapp-prod
```

### 2. Layout-Strategie

Erstelle fuer jeden Workflow-Typ ein eigenes Layout. So kannst du sofort mit der passenden Pane-Anordnung starten, ohne jedes Mal manuell splitten zu muessen:

```bash
# Layouts für verschiedene Tasks
~/.config/zellij/layouts/
├── dev.kdl           # Standard Development
├── debug.kdl         # Debugging Session
├── review.kdl        # Code Review
├── fullstack.kdl     # Full-Stack Development
└── ops.kdl           # DevOps/Monitoring
```

### 3. Session-Workflow

Automatisiere den Tagesstart mit einem Script, das alle benoetigten Sessions im Hintergrund startet. So stehen deine Arbeitsumgebungen sofort bereit:

```bash
# Morning Routine: Alle Projekt-Sessions starten
#!/bin/bash
zellij --session work-main --layout dev --daemon
zellij --session work-api --layout fullstack --daemon
zellij --session monitoring --layout ops --daemon

# Attach zu Haupt-Session
zellij attach work-main

# Session-Switch Script
alias zs='zellij attach $(zellij list-sessions | fzf | cut -d" " -f1)'
```

> ⚠️ **Warnung**: Verwende nicht mehr als 6-8 Panes pro Session -- zu viele Panes fuehren zu hoher CPU-Last und unuebersichtlichen Layouts. Erstelle lieber mehrere Sessions.

### 4. Floating Panes für schnelle Tasks

Floating Panes eignen sich hervorragend fuer einmalige Aktionen, die das bestehende Layout nicht stoeren sollen. Das Pane schliesst sich automatisch beim Beenden des Befehls:

```bash
# Floating Pane für schnelle Befehle
Ctrl+p w    # Floating Terminal öffnen
# Command ausführen
exit        # Pane schließt automatisch

# Use Cases:
# - Schneller git status
# - File suchen mit fd
# - Logs prüfen mit tail
# - Quick calculations
```

### 5. Persistenz nutzen

Sessions ueberleben Detach-Vorgaenge und koennen spaeter nahtlos wieder aufgenommen werden. Das ist besonders nuetzlich bei Remote-Arbeit ueber SSH, wo Verbindungsabbrueche haeufig vorkommen:

```bash
# Session starten und verlassen
zellij --session longrun
# Arbeit machen...
Ctrl+o d    # Detach

# Später wieder anhängen
zellij attach longrun

# Sessions überleben sogar System-Reboots
# (wenn mit --daemon gestartet)
```

### 6. Custom Keybindings

Eigene Keybindings beschleunigen haeufige Aktionen erheblich. Im folgenden Beispiel werden Alt-Tasten fuer Window-Management verwendet, aehnlich wie in i3 oder sway:

```kdl
// Eigene Shortcuts für häufige Tasks
keybinds {
    normal {
        // Quick layouts
        bind "Alt 1" {
            NewTab {
                layout "dev"
                name "Development"
            }
        }
        bind "Alt 2" {
            NewTab {
                layout "debug"
                name "Debug"
            }
        }

        // Window management wie in i3/sway
        bind "Alt Enter" { NewPane; }
        bind "Alt h" { MoveFocus "Left"; }
        bind "Alt j" { MoveFocus "Down"; }
        bind "Alt k" { MoveFocus "Up"; }
        bind "Alt l" { MoveFocus "Right"; }

        // Floating toggle
        bind "Alt f" { ToggleFloatingPanes; }
    }
}
```

---

## 📚 Beispiele

Die folgenden Beispiele zeigen typische zellij-Workflows vom einfachen Development-Setup bis hin zu komplexen Multi-Projekt-Szenarien.

### Beispiel 1: Basic Development Session

Dieses Beispiel zeigt den typischen Einstieg in eine zellij-Session fuer Web Development. Du startest eine benannte Session, splittest das Terminal in mehrere Bereiche und ordnest jedem Bereich eine Aufgabe zu. Das ist besonders nuetzlich, wenn du gleichzeitig Code editieren, den Dev-Server beobachten und Git-Status im Blick behalten willst. Ohne Multiplexer muessstest du staendig zwischen Terminals wechseln oder mehrere Fenster offen haben. Mit zellij hast du alles auf einem Blick und kannst mit Keybindings sofort zwischen den Panes wechseln. Im Terminal siehst du nach dem Start die zellij-Statusleiste mit den verfuegbaren Shortcuts.

```bash
# Session für Web Development starten
zellij --session webapp-dev

# Im zellij:
# 1. Split horizontal (Ctrl+p r)
# 2. In linkem Pane: nvim öffnen
# 3. In rechtem Pane: npm run dev
# 4. Neuer Tab (Ctrl+t n): git status monitoring
```

### Beispiel 2: Full-Stack mit Layout

Bei einem Full-Stack-Projekt brauchst du typischerweise drei Services gleichzeitig: Datenbank, Backend-API und Frontend. Manuell jedes Mal Panes zu erstellen und die richtigen Befehle einzugeben ist zeitaufwaendig und fehleranfaellig. Mit einem zellij-Layout definierst du die gesamte Anordnung einmal in einer KDL-Datei, und beim Start werden alle Panes automatisch erstellt und die Services gestartet. Stell dir vor, du arbeitest an einem MERN-Stack-Projekt (MongoDB, Express, React, Node): MongoDB laeuft links, die Express-API in der Mitte und die React-App rechts. Wenn du am naechsten Morgen weiterarbeitest, startest du mit einem einzigen Befehl die komplette Umgebung. Das spart taeglich mehrere Minuten Setup-Zeit und verhindert, dass du einen Service vergisst zu starten.

**Layout erstellen:**
```kdl
// ~/.config/zellij/layouts/mern.kdl
layout {
    pane split_direction="horizontal" {
        pane name="MongoDB" size="25%" {
            command "mongod"
            args "--dbpath" "/data/db"
        }
        pane split_direction="vertical" size="75%" {
            pane name="Express API" size="50%" {
                command "npm"
                args "run" "server"
                cwd "/path/to/backend"
            }
            pane name="React App" size="50%" {
                command "npm"
                args "start"
                cwd "/path/to/frontend"
            }
        }
    }
    pane size=2 borderless=true {
        plugin location="zellij:tab-bar"
    }
}
```

**Session starten:**

Nachdem du das Layout als KDL-Datei gespeichert hast, startest du die gesamte Full-Stack-Umgebung mit einem einzigen Befehl. zellij liest die Layout-Datei, erstellt alle definierten Panes und fuehrt die angegebenen Commands automatisch aus. Du siehst sofort alle drei Services laufen -- MongoDB, die Express-API und die React-App. Falls ein Service nicht startet, erkennst du das direkt im entsprechenden Pane, ohne zwischen Terminals wechseln zu muessen. Diesen Befehl kannst du auch als Shell-Alias abspeichern, damit du die Umgebung noch schneller starten kannst.

```bash
zellij --session mern-stack --layout mern
```

### Beispiel 3: DevOps Monitoring Dashboard

Ein DevOps-Monitoring-Dashboard zeigt dir System-Ressourcen, Docker-Container und Logs gleichzeitig auf einem Bildschirm. Das ist besonders wertvoll, wenn du einen Deployment-Prozess ueberwachst oder nach der Ursache eines Produktions-Problems suchst. Stell dir vor, eine Anwendung wird langsam und du musst schnell pruefen, ob die CPU-Last zu hoch ist, ob ein Docker-Container abgestuerzt ist, oder ob Fehlermeldungen in den Logs auftauchen. Mit diesem Layout siehst du btop fuer Systemressourcen links, Docker-Container-Status rechts oben und Live-Logs rechts unten. Du kannst zwischen den Panes wechseln und bei Bedarf einzelne Bereiche im Vollbildmodus ansehen. Das erwartet dich im Terminal: Drei Live-Ansichten, die sich automatisch aktualisieren.

```kdl
// ~/.config/zellij/layouts/devops.kdl
layout {
    pane split_direction="vertical" {
        pane size="50%" {
            pane name="System" {
                command "btop"
            }
        }
        pane split_direction="horizontal" size="50%" {
            pane name="Docker" {
                command "watch"
                args "-n" "2" "docker" "ps"
            }
            pane name="Logs" {
                command "tail"
                args "-f" "/var/log/syslog"
            }
        }
    }
}
```

### Beispiel 4: Remote Development Session

Remote Development ueber SSH ist einer der wichtigsten Anwendungsfaelle fuer Terminal Multiplexer. Wenn du auf einem Server arbeitest und die SSH-Verbindung abbricht -- sei es durch ein instabiles Netzwerk, einen Laptop der in den Schlafmodus geht, oder einen Router-Neustart -- verlierst du normalerweise deine gesamte Arbeit. Mit zellij laeuft deine Session auf dem Server weiter, egal was mit deiner lokalen Verbindung passiert. Stell dir vor, du fuehrst ein Datenbank-Schema-Update auf einem Produktionsserver durch, das 20 Minuten dauert. Ohne zellij muessstest du den gesamten Prozess neu starten, wenn die Verbindung abbricht. Mit zellij verbindest du dich einfach per SSH erneut, fuehrst `zellij attach` aus, und siehst genau den Stand, an dem du aufgehoert hast. Im Terminal siehst du nach dem Attach die vollstaendige Session mit allen Panes und ihrer Ausgabe.

```bash
# SSH in Remote-Server
ssh user@remote-server

# zellij auf Remote-Server starten
zellij --session project-work

# Arbeit erledigen...
# Bei Verbindungsabbruch:

# Erneut SSH
ssh user@remote-server

# Session wieder aufnehmen
zellij attach project-work
# Alles ist noch da!
```

### Beispiel 5: Pair Programming Setup

Pair Programming ueber die Kommandozeile funktioniert mit zellij besonders einfach. Der Host startet eine benannte Session, und der Kollege verbindet sich per SSH auf die gleiche Maschine und attachet sich an dieselbe Session. Beide sehen exakt den gleichen Bildschirminhalt und koennen gleichzeitig tippen -- perfekt fuer Code Reviews, gemeinsames Debugging oder das Einarbeiten neuer Teammitglieder. Im Vergleich zu Screen-Sharing-Tools wie Zoom gibt es keine Verzoegerung bei der Bildschirmaktualisierung, da beide direkt mit dem gleichen Terminal-Prozess verbunden sind. Das funktioniert besonders gut in Kombination mit einem Editor wie neovim, wo beide Personen in Echtzeit Aenderungen sehen. Beachte, dass der Gast SSH-Zugriff auf die Host-Maschine benoetigt.

```bash
# Host startet geteilte Session
zellij --session pair-coding

# Kollege verbindet sich (SSH + zellij attach)
ssh user@host-machine
zellij attach pair-coding

# Beide sehen und steuern die gleiche Session
# Perfekt für:
# - Code Reviews
# - Debugging Sessions
# - Pair Programming
# - Teaching/Mentoring
```

### Beispiel 6: Multi-Project Workflow

Wenn du an mehreren Projekten gleichzeitig arbeitest, kannst du jedes Projekt in einer eigenen zellij-Session mit eigenem Layout verwalten. Dieses Script automatisiert den morgendlichen Arbeitsstart: Es erstellt Sessions fuer jedes Projekt im Hintergrund (--daemon), jede mit dem passenden Layout. So stehen dir sofort alle Arbeitsumgebungen zur Verfuegung, ohne dass du sie manuell aufsetzen musst. Stell dir vor, du arbeitest an einer Haupt-App, einer API und einer Dokumentation gleichzeitig. Statt jeden Morgen 10 Minuten mit dem Setup zu verbringen, fuehrst du ein einziges Script aus und bist sofort arbeitsfaehig. Das Script attached am Ende automatisch zur Haupt-Session, und du kannst mit `zellij attach` jederzeit zu einer anderen Session wechseln. Tipp: Lege dieses Script als Alias in deiner Shell-Konfiguration ab.

```bash
# Script für Morning Setup
#!/bin/bash
# ~/scripts/start-work.sh

echo "Starting work sessions..."

# Project 1: Main App
zellij --session main-app --layout dev --daemon
echo "✓ Main app session"

# Project 2: API Service
zellij --session api-service --layout fullstack --daemon
echo "✓ API service session"

# Project 3: Documentation
zellij --session docs --layout simple --daemon
echo "✓ Docs session"

# Monitoring
zellij --session monitoring --layout ops --daemon
echo "✓ Monitoring session"

# Attach to main
echo "Attaching to main-app..."
zellij attach main-app
```

### Beispiel 7: Testing Workflow

Ein Testing-Layout ist essenziell fuer testgetriebene Entwicklung (TDD). Mit diesem Layout siehst du deinen Code-Editor links (60% der Breite), den Test-Runner rechts oben und die Code-Coverage rechts unten. Der Test-Runner laeuft im Watch-Modus und fuehrt Tests automatisch aus, sobald du eine Datei speicherst. Die Coverage wird alle 5 Sekunden aktualisiert, sodass du sofort siehst, welche Bereiche deines Codes noch nicht getestet sind. Dieses Setup eliminiert den staendigen Wechsel zwischen Editor und Terminal und gibt dir sofortiges Feedback zu deinen Aenderungen. Im Terminal siehst du nach dem Start drei Panes: links einen leeren Editor-Bereich, rechts oben die laufenden Tests und rechts unten die Coverage-Uebersicht.

```kdl
// ~/.config/zellij/layouts/testing.kdl
layout {
    pane split_direction="vertical" {
        pane size="60%" name="Editor" {
            // Code Editor
        }
        pane split_direction="horizontal" size="40%" {
            pane name="Test Runner" {
                command "npm"
                args "test" "--" "--watch"
            }
            pane name="Coverage" {
                command "watch"
                args "-n" "5" "npm" "run" "coverage"
            }
        }
    }
}
```

Mit dem folgenden Befehl startest du die Testing-Session. Im Editor-Pane oeffnest du deine Quellcode-Dateien, waehrend der Test-Runner und die Coverage-Ansicht automatisch im Hintergrund aktualisiert werden. Du kannst mit den zellij-Keybindings zwischen den Panes wechseln, um Test-Ergebnisse im Detail zu pruefen. Besonders praktisch: Wenn ein Test fehlschlaegt, siehst du die Fehlermeldung sofort im Test-Runner-Pane, ohne den Editor zu verlassen. Durch den Watch-Modus wird jede Aenderung sofort validiert.

```bash
zellij --session testing --layout testing

# In Editor Pane: Code ändern
# Test Runner Pane: Tests laufen automatisch
# Coverage Pane: Coverage aktualisiert sich alle 5s
```

### Beispiel 8: Data Science Workflow

Data-Science-Projekte erfordern oft mehrere Tools gleichzeitig: Jupyter fuer interaktive Analyse, eine Python-REPL fuer schnelle Experimente, ein Daten-Viewer fuer CSV-Dateien und einen Systemmonitor um die Ressourcen-Auslastung zu beobachten. Dieses Layout organisiert alle vier Komponenten in einem einzigen Terminal-Fenster. Jupyter Lab nimmt den groessten Bereich ein (40%), da es das Hauptwerkzeug ist. Rechts daneben findest du IPython fuer schnelle Code-Snippets, VisiData fuer tabellarische Datenansicht und btop zur Ueberwachung der CPU- und RAM-Auslastung -- besonders wichtig bei grossen Datensaetzen. Stell dir vor, du trainierst ein Machine-Learning-Modell: Im Jupyter-Pane laeuft das Training, im btop-Pane siehst du ob der RAM knapp wird, und in der Python-REPL kannst du schnell Zwischenergebnisse inspizieren.

```kdl
// ~/.config/zellij/layouts/ds.kdl
layout {
    pane split_direction="horizontal" {
        pane size="40%" name="Jupyter" {
            command "jupyter"
            args "lab"
            cwd "/path/to/notebooks"
        }
        pane split_direction="vertical" size="60%" {
            pane size="50%" name="Python REPL" {
                command "ipython"
            }
            pane split_direction="horizontal" size="50%" {
                pane name="Data Viewer" {
                    command "visidata"
                    args "data.csv"
                }
                pane name="Resources" {
                    command "btop"
                }
            }
        }
    }
}
```

### Beispiel 9: Git Workflow Integration

Git-intensive Arbeit profitiert enorm von einem Multi-Pane-Setup. In diesem Workflow hast du drei Bereiche: den Code-Editor fuer Aenderungen, lazygit als interaktive Git-Oberflaeche fuer Staging und Commits, und eine Live-Ansicht des Git-Graphen fuer den Branch-Ueberblick. Das ist besonders nuetzlich bei komplexen Merge-Situationen oder wenn du an mehreren Feature-Branches arbeitest. Stell dir vor, du reviewst Aenderungen vor einem Merge: Im Editor siehst du den Code, in lazygit kannst du einzelne Hunks stagen, und im Graph siehst du, wie sich die Branches zueinander verhalten. Durch das schnelle Umschalten zwischen den Panes kannst du in Sekunden zwischen Code-Aenderung, Commit und History-Pruefung wechseln.

```bash
# Session für Git-intensive Arbeit
zellij --session git-work

# Layout:
# Pane 1: Code Editor
# Pane 2: lazygit (interactive git UI)
# Pane 3: git log --oneline --graph --all

# Schnelles Umschalten zwischen:
# - Code editieren (Pane 1)
# - Commits machen (Pane 2)
# - History prüfen (Pane 3)
```

### Beispiel 10: Docker Development

Docker-basierte Entwicklung erfordert staendige Sichtbarkeit auf Container-Status, Logs und den eigentlichen Code. Dieses Layout zeigt dir links den Editor fuer Code-Aenderungen und rechts drei Panes fuer Docker Compose (Container starten), Live-Logs aller Container und eine aktualisierte Uebersicht aller laufenden Container. Das ist besonders hilfreich beim Debugging von Multi-Container-Anwendungen, wo du sehen musst, welcher Container Fehler wirft oder welcher nicht startet. Stell dir vor, du entwickelst eine Microservice-Architektur mit 5 Services: Wenn du einen Service aenderst und neu startest, siehst du sofort in den Logs ob er korrekt hochfaehrt, und im Container-Status ob er healthy wird. Der watch-Befehl aktualisiert die Container-Liste alle 3 Sekunden automatisch.

```kdl
// ~/.config/zellij/layouts/docker-dev.kdl
layout {
    pane split_direction="vertical" {
        pane size="50%" name="Editor" {
            // Code Editor
        }
        pane split_direction="horizontal" size="50%" {
            pane name="Docker Compose" {
                command "docker-compose"
                args "up"
            }
            pane name="Logs" {
                command "docker-compose"
                args "logs" "-f"
            }
            pane name="Containers" {
                command "watch"
                args "-n" "3" "docker" "ps" "-a"
            }
        }
    }
}
```

### Beispiel 11: Floating Panes fuer Quick Tasks

Floating Panes sind temporaere Fenster, die ueber dem bestehenden Layout schweben und sich perfekt fuer schnelle Einmal-Aktionen eignen. Anders als regulaere Panes veraendern sie die bestehende Anordnung nicht. Du oeffnest ein Floating Pane mit Ctrl+p w, fuehrst deinen Befehl aus und schliesst es mit exit -- dein Layout bleibt unberuehrt. Das ist besonders nuetzlich, wenn du mitten in der Arbeit kurz etwas nachschauen musst: den Git-Status pruefen, eine Datei suchen oder einen API-Endpunkt testen. Stell dir vor, du editierst gerade eine Datei und willst schnell pruefen, ob ein bestimmtes File im Projekt existiert. Statt ein neues Pane zu splitten und danach wieder zusammenzufuegen, nutzt du einfach ein Floating Pane. Es verschwindet nach dem Schliessen spurlos.

```bash
# In laufender Session:

# Quick git status
Ctrl+p w
git status
exit

# Quick file search
Ctrl+p w
fd "*.rs" | fzf
exit

# Quick command test
Ctrl+p w
curl -X POST http://localhost:3000/api/test
exit

# Floating Panes sind perfekt für:
# - Schnelle Checks
# - One-off Commands
# - Temporäre Terminals
# - Nicht-störende Informationen
```

> 💡 **Tipp**: Floating Panes (Ctrl+p w) eignen sich hervorragend fuer schnelle Git-Checks oder Log-Abfragen, ohne das aktuelle Layout zu stoeren.

### Beispiel 12: Session als Daemon fuer Background Tasks

Der Daemon-Modus startet eine zellij-Session im Hintergrund, ohne ein Terminal-Fenster zu blockieren. Das ist ideal fuer langlebige Prozesse wie Build-Watcher, die kontinuierlich laufen sollen waehrend du in anderen Terminals arbeitest. Der Befehl startet den Build-Watch-Prozess in einer eigenen Session und gibt dir sofort die Kontrolle zurueck. Du kannst jederzeit mit `zellij attach` die Session oeffnen und den Output inspizieren, und mit Ctrl+o d wieder detachen. Stell dir vor, du hast ein grosses TypeScript-Projekt: Der Build-Watcher kompiliert bei jeder Datei-Aenderung automatisch, und du kannst bei Bedarf in die Session schauen, um Compile-Errors zu pruefen. Mit `zellij list-sessions` siehst du alle laufenden Daemon-Sessions auf einen Blick.

```bash
# Long-running Process im Hintergrund
zellij --session build-daemon --daemon -- bash -c "npm run build:watch"

# Session läuft, ohne Terminal zu blockieren

# Status prüfen
zellij list-sessions

# Bei Bedarf attach
zellij attach build-daemon

# Output prüfen, dann detach
Ctrl+o d
```

---

## 🔄 Integration mit Claude Code

### Claude kann zellij nutzen für:

1. **Persistent Development Sessions**

Claude Code kann in einer zellij-Session laufen, die Neustarts und Verbindungsabbrueche ueberlebt. Das ist besonders wertvoll bei langen Refactoring-Aufgaben oder Code-Analysen, die Stunden dauern koennen. Du startest die Session einmal, und selbst wenn dein Terminal abstuerzt oder du den Laptop zuklappt, laeuft Claude Code auf dem Server weiter. Beim naechsten Attach siehst du den gesamten bisherigen Output und kannst nahtlos weiterarbeiten. Das eliminiert das Risiko, Arbeit durch Verbindungsabbrueche zu verlieren.

```bash
# Claude startet Development-Session
zellij --session claude-dev --layout dev

# Session überlebt Neustarts
# Claude kann jederzeit wieder attached werden
```

2. **Multi-Pane Code Analysis**

Ein Multi-Pane-Setup ist ideal, wenn Claude Code Aenderungen vornimmt, die du sofort validieren willst. In Pane 1 editierst du Code oder beobachtest Claude Codes Aenderungen, in Pane 2 laufen die Tests automatisch im Watch-Modus, und in Pane 3 siehst du die Anwendungs-Logs. So erkennst du sofort, ob eine Aenderung Tests bricht oder Laufzeitfehler verursacht. Dieses Setup beschleunigt den Feedback-Zyklus erheblich, da du nicht zwischen verschiedenen Terminals wechseln musst.

```python
# In Pane 1: Code editieren
# In Pane 2: Tests laufen
# In Pane 3: Logs beobachten
# Claude koordiniert alle Panes
```

3. **Layout-basierte Workflows**

Ein speziell fuer Claude Code optimiertes Layout teilt den Bildschirm in einen grossen Code-Bereich und kleinere Bereiche fuer Ausfuehrung und Analyse. Der Code-Bereich nimmt 60% der Breite ein, da dort die meiste visuelle Aufmerksamkeit benoetigt wird. Die rechte Seite ist horizontal geteilt: oben laufen die Befehle, die Claude Code ausfuehrt, und unten siehst du die Analyse-Ergebnisse. Dieses Layout laesst sich als KDL-Datei speichern und bei jedem Projektstart automatisch laden. Du sparst dir so das manuelle Aufteilen und hast sofort eine produktive Arbeitsumgebung.

```kdl
// Claude-optimiertes Layout
layout {
    pane split_direction="vertical" {
        pane size="60%" name="Code" {
            // Code Editor für Claude
        }
        pane split_direction="horizontal" size="40%" {
            pane name="Execution" {
                // Claude führt Code aus
            }
            pane name="Analysis" {
                // Claude analysiert Output
            }
        }
    }
}
```

4. **Automatisierte Session-Management**

Dieses Script automatisiert das Erstellen von Projekt-Sessions mit dem passenden Layout. Du uebergibst den Projektnamen und optional ein Layout, und das Script startet eine benannte zellij-Session. Das ist besonders nuetzlich, wenn du haeufig zwischen Projekten wechselst und jedes Projekt ein anderes Layout braucht. Lege das Script in deinem PATH ab und rufe es einfach mit `start-session myproject fullstack` auf. Ohne Layout-Angabe wird das Standard-Layout "dev" verwendet.

```bash
# Claude Script für Session-Setup
#!/bin/bash

PROJECT=$1
LAYOUT=${2:-dev}

# Session starten mit custom layout
zellij --session "$PROJECT" --layout "$LAYOUT"

# Claude arbeitet in strukturierter Umgebung
```

5. **Floating Panes fuer Quick Checks**

Floating Panes eignen sich ideal fuer kurze Pruefungen, die Claude Code zwischendurch ausfuehren muss, ohne das bestehende Layout zu veraendern. Du oeffnest ein schwebendes Fenster, fuehrst schnell einen Test, eine Dateisuche oder einen Git-Status-Check durch und schliesst es wieder. Das Hauptlayout bleibt dabei vollstaendig erhalten. Das ist besonders nuetzlich bei iterativen Entwicklungsprozessen, wo du haeufig kleine Validierungen brauchst. Tipp: Nutze Ctrl+p w zum Oeffnen und tippe einfach exit wenn du fertig bist.

```bash
# Claude öffnet floating pane für:
# - Quick tests
# - File searches
# - Git status
# - Dependency checks
```

### Workflow-Beispiel: Claude Code Review

Ein Code-Review-Workflow in zellij nutzt vier Panes, um verschiedene Perspektiven auf die Aenderungen gleichzeitig zu zeigen. Im ersten Pane siehst du den Original-Code, im zweiten die modifizierte Version, im dritten eine Diff-Ansicht mit delta fuer farbkodierte Unterschiede, und im vierten den Test-Output. Claude Code navigiert zwischen diesen Panes und kann so fundiertes Feedback geben, das sowohl den Code-Stil als auch die funktionale Korrektheit beruecksichtigt. Dieses Setup ist besonders wertvoll bei grossen Pull Requests mit vielen geaenderten Dateien, wo ein einzelnes Terminal-Fenster nicht ausreicht.

```bash
# 1. Session für Code Review starten
zellij --session code-review --layout review

# 2. Layout:
# - Pane 1: Source Code (vor Änderungen)
# - Pane 2: Modified Code (nach Änderungen)
# - Pane 3: Diff-Ansicht (delta)
# - Pane 4: Test-Output

# 3. Claude navigiert durch Panes und analysiert
# 4. Claude gibt Feedback basierend auf allen Panes
```

---

## 🤖 Claude Code Integration

### Workflow 1: Claude Code + Test-Runner parallel

Dieser Workflow zeigt die effektivste Art, Claude Code mit automatisierten Tests zu kombinieren. Du startest zellij mit zwei Panes: links laeuft Claude Code und nimmt Code-Aenderungen vor, rechts laufen die Tests im Watch-Modus. Sobald Claude Code eine Datei aendert, erkennt der Test-Runner die Aenderung und fuehrt die betroffenen Tests automatisch aus. So siehst du sofort, ob die Aenderung Tests bricht. Dieses Setup ist besonders wertvoll bei testgetriebener Entwicklung, wo schnelles Feedback der Schluessel zu Qualitaet ist.

```bash
# zellij starten mit zwei Panes: Claude Code links, Tests rechts
zellij --session claude-dev
# Pane 1: Claude Code ausfuehren
claude
# Pane 2 (Ctrl+p r): Tests im Watch-Modus
npm test -- --watch
```

### Workflow 2: Layout fuer Claude Code Reviews

Fuer Code Reviews laedst du ein spezielles Review-Layout, das drei Panes bereitstellt: eines fuer die Git-Diff-Ansicht, eines fuer Claude Code zur Analyse und eines fuer die Test-Ergebnisse. Claude Code kann die Aenderungen im Diff-Pane sehen und gleichzeitig die Test-Ergebnisse beruecksichtigen, um fundierte Review-Kommentare zu geben. Dieses Layout eignet sich besonders gut fuer Pull-Request-Reviews, wo du den Kontext der Aenderungen und deren Auswirkungen auf die Tests gleichzeitig sehen musst. Speichere das Layout als review.kdl in deinem zellij-Konfigurationsverzeichnis.

```bash
# Review-Layout: Code-Aenderungen, Diff und Claude Code parallel
zellij --layout ~/.config/zellij/layouts/review.kdl --session code-review
# Pane 1: git diff anzeigen
# Pane 2: Claude Code fuer Analyse starten
# Pane 3: Test-Output beobachten
```

### Workflow 3: Persistente Claude Code Session fuer lange Aufgaben

Fuer langfristige Aufgaben wie das Refactoring eines gesamten Moduls startest du eine zellij-Session im Daemon-Modus. Die Session laeuft im Hintergrund auf dem Server weiter, auch wenn du dein Terminal schliesst oder die SSH-Verbindung abbricht. Claude Code kann darin stundenlang arbeiten, waehrend du andere Dinge erledigst. Wenn du den Fortschritt pruefen willst, verbindest du dich einfach mit `zellij attach` und siehst den gesamten bisherigen Output. Beachte, dass Sessions mit --daemon keinen Terminal-Fokus benoetigen und auch System-Neustarts ueberleben koennen.

```bash
# Session im Hintergrund starten fuer langfristige Aufgaben
zellij --session claude-longrun --daemon
zellij attach claude-longrun
# Claude Code kann hier stundenlanf arbeiten -- Session ueberlebt Disconnects
claude "Refactore das gesamte Auth-Modul"
```

> 💡 **Tipp**: Claude Code kann zellij automatisch in Multi-Pane-Workflows einsetzen, um Code-Aenderungen sofort in einem Test-Pane zu validieren.

## 📺 Video-Tutorial

[Zellij - Powerful Productivity in Your Terminal](https://www.youtube.com/watch?v=gtjPeTCkm-8)
Umfassende Einfuehrung in zellij mit Pane-Management, Tab-Organisation, Layouts und Plugin-System -- ideal fuer den Einstieg.

---

## 🔧 Troubleshooting

Hier findest du Loesungen fuer die haeufigsten Probleme mit zellij. Die meisten Fehler lassen sich durch Config-Reset oder Session-Bereinigung beheben.

### Problem: zellij startet nicht

Wenn zellij sich nicht starten laesst, liegt das oft an einer inkompatiblen Config-Datei nach einem Update. Eine neue Config generieren behebt das Problem:

```bash
# Ursache: Alte Config-Datei
# Lösung: Config neu generieren
mv ~/.config/zellij/config.kdl ~/.config/zellij/config.kdl.backup
zellij setup --generate-config

# Oder alte Sessions löschen
zellij delete-all-sessions
```

### Problem: Tastenkombinationen funktionieren nicht

Manche Terminals senden nicht alle Key-Codes korrekt weiter. Das passiert haeufig bei aelteren Terminal-Emulatoren oder falschen TERM-Einstellungen:

```bash
# Check: Terminal unterstützt alle Key-Codes
echo $TERM  # sollte xterm-256color oder ähnlich sein

# In ~/.zshrc oder ~/.bashrc:
export TERM=xterm-256color

# zellij neu starten
```

### Problem: Session nicht gefunden

Session-Namen sind case-sensitive. Wenn `zellij attach` die Session nicht findet, pruefe die genaue Schreibweise mit `list-sessions`:

```bash
# Sessions auflisten
zellij list-sessions

# Session-Name genau prüfen (case-sensitive!)

# Session existiert nicht mehr?
# Neu erstellen:
zellij --session my-project
```

### Problem: Layout lädt nicht

Wenn ein Layout nicht geladen wird, liegt es meistens an einem Syntaxfehler in der KDL-Datei oder einem falschen Pfad:

```bash
# Check: Layout-Datei existiert
ls ~/.config/zellij/layouts/

# Check: Layout-Syntax korrekt
zellij --layout dev --check

# Layout-Pfad explizit angeben
zellij --layout ~/.config/zellij/layouts/dev.kdl
```

### Problem: Clipboard funktioniert nicht

Die Clipboard-Integration haengt vom Betriebssystem ab. zellij braucht ein externes Tool (`pbcopy`, `xclip` oder `wl-copy`), um Text in die Systemzwischenablage zu kopieren:

```bash
# macOS: pbcopy installiert?
which pbcopy

# Linux: xclip installieren
sudo apt install xclip

# Config anpassen
copy_command "xclip -selection clipboard"  # Linux
copy_command "pbcopy"  # macOS
copy_command "wl-copy"  # Wayland
```

### Problem: Hohe CPU-Nutzung

Hohe CPU-Last tritt oft auf, wenn zu viele Panes in einer Session geoeffnet sind oder Plugins viel Output verarbeiten. Die Loesung ist, die Anzahl der Panes zu reduzieren und stattdessen mehrere Sessions zu verwenden:

```bash
# Ursache oft: Plugin oder viele Panes

# Plugins deaktivieren zum Testen
# In config.kdl: Plugins auskommentieren

# Pane-Anzahl reduzieren
# Maximal 6-8 Panes pro Session empfohlen

# Alternative: Sessions trennen
# Statt 10 Panes in einer Session:
# 2-3 Sessions mit je 3-4 Panes
```

### Problem: Session "freezed"

Eine eingefrorene Session liegt oft am versehentlich aktivierten Locked Mode. Wenn das nicht hilft, kann die Session von aussen beendet werden:

```bash
# Locked Mode? Entsperren mit:
Ctrl+g  # Toggle locked mode

# Session komplett hängt?
# Von außen killen:
zellij delete-session stuck-session

# Im Notfall: alle zellij-Prozesse killen
pkill zellij
```

### Problem: Colors falsch dargestellt

Falsche Farben deuten auf fehlenden True-Color-Support im Terminal hin. Setze die COLORTERM-Variable und waehle ein kompatibles Theme:

```bash
# Terminal True Color Support prüfen
echo $COLORTERM  # sollte "truecolor" sein

# In ~/.zshrc oder ~/.bashrc:
export COLORTERM=truecolor

# zellij Theme wechseln
# In config.kdl:
theme "default"  # oder "dracula", "nord", etc.
```

---

## 📊 Vergleich mit Alternativen

| Feature | zellij | tmux | screen | byobu |
|---------|--------|------|--------|-------|
| **Intuitivität** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Built-in UI Hints** | ✅ | ❌ | ❌ | ✅ |
| **Layout System** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐ | ⭐⭐⭐ |
| **Floating Panes** | ✅ | ❌ | ❌ | ❌ |
| **Plugin System** | ⭐⭐⭐⭐ (WASM) | ⭐⭐ | ❌ | ⭐ |
| **Configuration** | YAML/KDL | Config File | .screenrc | Config |
| **Session Persist** | ✅ | ✅ | ✅ | ✅ |
| **Performance** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Memory Usage** | ~15-30 MB | ~5-10 MB | ~3-5 MB | ~8-15 MB |
| **Startup Time** | ~100-200ms | ~50ms | ~30ms | ~100ms |
| **Mouse Support** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Copy Mode** | Vim-like | Vim-like | Basic | Enhanced |
| **Scripting** | KDL | Shell | .screenrc | Python |
| **Community** | 🆕 Growing | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Documentation** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Learning Curve** | Niedrig | Mittel-Hoch | Mittel | Niedrig-Mittel |
| **Modernität** | 2021+ | 2007+ | 1987+ | 2008+ |
| **Cross-Platform** | ✅ | ✅ | ✅ (primär Linux) | ✅ |

### Wann zellij wählen?

**✅ Verwende zellij wenn:**
- Du einen modernen, intuitiven Multiplexer willst
- Layouts und Floating Panes wichtig sind
- Plugin-Erweiterbarkeit gewünscht ist
- Du Einsteiger bist (niedrige Lernkurve)
- Moderne Features wichtiger als maximale Performance

**❌ Verwende tmux wenn:**
- Maximale Performance und Stabilität Priorität haben
- Du bereits tmux kennst und konfiguriert hast
- Umfangreiche Plugin-Ökosystem (TPM) benötigt wird
- Absolute Zuverlässigkeit auf Legacy-Systemen wichtig ist

**❌ Verwende screen wenn:**
- Du auf sehr alten Systemen arbeitest
- Minimaler Memory-Footprint kritisch ist
- Legacy-System-Support erforderlich ist

---

## 🔗 Nützliche Links

### Offizielle Ressourcen
- **Website**: https://zellij.dev
- **GitHub**: https://github.com/zellij-org/zellij
- **Documentation**: https://zellij.dev/documentation
- **Changelog**: https://github.com/zellij-org/zellij/releases

### Community & Tutorials
- **Discord**: https://discord.gg/CrUAFH3
- **Reddit**: r/zellij
- **Awesome Zellij**: https://github.com/zellij-org/awesome-zellij
- **Tutorial Video**: YouTube "Getting Started with Zellij"

### Plugins & Layouts
- **Plugin Directory**: https://github.com/zellij-org/awesome-zellij#plugins
- **Layout Examples**: https://github.com/zellij-org/zellij/tree/main/example/layouts
- **Community Layouts**: https://github.com/topics/zellij-layouts

### Vergleiche & Artikel
- "Zellij vs tmux: Modern Terminal Multiplexing"
- "Why I Switched from tmux to Zellij"
- "Terminal Multiplexers in 2024: A Comparison"

---

## 💡 Pro-Tipps

### Tipp 1: Layouts fuer jeden Workflow

Eine gut organisierte Layout-Bibliothek ist das Fundament fuer produktive Arbeit mit zellij. Erstelle fuer jeden Workflow-Typ ein eigenes Layout und lege alle Dateien in einem zentralen Verzeichnis ab. So kannst du mit einem kurzen Alias-Befehl sofort das passende Layout starten. Die Layouts decken verschiedene Szenarien ab: Standard-Entwicklung, Full-Stack mit mehreren Services, Debugging mit Extra-Panes fuer Logs, Code Review mit Diff-Ansichten, und DevOps-Monitoring. Mit Shell-Aliases wie `zd` fuer Development oder `zf` fuer Fullstack sparst du weitere Tipparbeit. Im Laufe der Zeit wirst du deine Layouts verfeinern und an deine Beduerfnisse anpassen.

```bash
# Erstelle Layout-Bibliothek
~/.config/zellij/layouts/
├── dev.kdl          # Standard Development
├── fullstack.kdl    # Frontend + Backend + DB
├── debug.kdl        # Debugging Setup
├── review.kdl       # Code Review
├── ops.kdl          # DevOps/Monitoring
├── data.kdl         # Data Science
└── simple.kdl       # Minimales Layout

# Quick-Switch Alias
alias zd='zellij --layout dev'
alias zf='zellij --layout fullstack'
alias zo='zellij --layout ops'
```

### Tipp 2: Session-Namenkonvention

Konsistente Session-Namen sind entscheidend, wenn du viele Sessions parallel betreibst. Zwei bewaehrte Formate sind `<project>-<context>-<date>` fuer zeitbezogene Sessions und `<team>-<project>-<type>` fuer Team-Umgebungen. So siehst du bei `zellij list-sessions` sofort, welche Session zu welchem Projekt und welchem Zweck gehoert. Das Datum im Namen ist besonders nuetzlich bei Debug-Sessions, die du nach einigen Tagen aufraumen willst. Vermeide generische Namen wie "dev" oder "work", da diese bei mehreren Projekten schnell zu Verwechslungen fuehren.

```bash
# Format: <project>-<context>-<date>
zellij --session webapp-dev-20240215
zellij --session api-debug-20240215
zellij --session docs-review-20240215

# Oder: <team>-<project>-<type>
zellij --session frontend-dashboard-dev
zellij --session backend-api-prod
zellij --session devops-monitoring-main
```

### Tipp 3: Floating Panes als Scratchpad

Ein Floating Pane als Scratchpad ist wie ein digitaler Notizblock, den du mit einem Tastendruck oeffnest. Mit dem Keybinding Alt+Space startest du sofort ein schwebendes Terminal-Fenster, in dem du schnelle Berechnungen mit bc durchfuehren, temporaere Notizen machen, den Git-Status pruefen oder Dateien in der Vorschau betrachten kannst. Das Scratchpad blockiert dein Hauptlayout nicht und schliesst sich beim Beenden automatisch. Im Gegensatz zu einem regulaeren Split wird die bestehende Pane-Anordnung nicht veraendert. Definiere den Keybinding in deiner config.kdl, um dieses Feature zu aktivieren.

```bash
# Keybinding für instant scratchpad
# In config.kdl:
bind "Alt Space" {
    NewFloatingPane {
        command "zsh"
    }
}

# Nutze für:
# - Quick calculations (bc)
# - Temporary notes
# - Fast git status
# - File previews
```

### Tipp 4: Auto-Start Sessions

Mit diesem Snippet in deiner Shell-Konfiguration startest du automatisch eine zellij-Session, sobald du ein Terminal oeffnest. Das Script prueft zuerst, ob du bereits in einer zellij-Session bist (Variable ZELLIJ), um verschachtelte Sessions zu vermeiden. Dann schaut es, ob eine Session namens "main" existiert, und verbindet sich entweder damit oder erstellt eine neue mit dem dev-Layout. So arbeitest du immer innerhalb von zellij, ohne es manuell starten zu muessen. Das ist besonders nuetzlich, wenn du dein Terminal haeufig oeffnest und schliesst -- du landest immer in deiner bestehenden Arbeitsumgebung. Beachte, dass du die ZELLIJ-Variable pruefst, um Endlos-Schleifen zu vermeiden.

```bash
# In ~/.zshrc oder ~/.bashrc
if [[ -z "$ZELLIJ" ]]; then
    # Automatisch in Session einloggen
    if zellij list-sessions | grep -q "main"; then
        zellij attach main
    else
        zellij --session main --layout dev
    fi
fi
```

### Tipp 5: Session-Backup-Script

Dieses Script sichert die Namen aller laufenden Sessions in eine Textdatei und kann sie nach einem System-Restart wieder erstellen. Das ist besonders nuetzlich auf Workstations, die regelmaessig neu gestartet werden, oder als Teil eines Backup-Workflows. Die Session-Namen werden in eine Backup-Datei geschrieben, und beim Wiederherstellen liest das Script die Datei Zeile fuer Zeile und erstellt jede Session im Daemon-Modus. Beachte, dass dabei nur die Session-Namen wiederhergestellt werden, nicht der Inhalt der Panes -- dafuer muessstest du die Sessions mit Layouts kombinieren. Fuehre das Backup-Script regelmaessig aus, z.B. als Cronjob vor dem Herunterfahren.

```bash
#!/bin/bash
# ~/.local/bin/zellij-backup

# Aktuell laufende Sessions sichern
zellij list-sessions > ~/.config/zellij/sessions-backup.txt

# Bei System-Restart:
# Sessions aus Backup neu erstellen
while IFS= read -r session; do
    name=$(echo "$session" | cut -d' ' -f1)
    zellij --session "$name" --daemon
done < ~/.config/zellij/sessions-backup.txt
```

### Tipp 6: Custom Status Bar

Die Status-Bar in zellij laesst sich umfangreich anpassen, um genau die Informationen anzuzeigen, die du brauchst. Im folgenden Beispiel wird links der aktuelle Modus und die Tab-Liste angezeigt, in der Mitte Benachrichtigungen und rechts Datum und Uhrzeit. Die Farben werden mit Hex-Codes definiert -- hier Blau fuer Tabs und Pink fuer die Zeit. Das ist besonders nuetzlich, wenn du sofort sehen willst, in welchem Modus du bist oder welcher Tab aktiv ist. Experimentiere mit den Format-Strings, um deine perfekte Status-Bar zu finden.

```kdl
// Eigene Status-Informationen
pane {
    plugin location="zellij:status-bar" {
        format_left "{mode} #[fg=#89B4FA,bold] {tabs}"
        format_center "{notifications}"
        format_right "#[fg=#FF79C6] {datetime}"
    }
}
```

### Tipp 7: Copy Mode Mastery

Der Copy Mode in zellij funktioniert wie der Visual Mode in vim und erlaubt es dir, durch den Scrollback-Buffer zu navigieren, Text zu suchen und in die Zwischenablage zu kopieren. Du aktivierst ihn mit Ctrl+s und kannst dann mit vim-artigen Keybindings navigieren. Die Wort-Navigation mit w und b ist besonders nuetzlich, um schnell durch Logzeilen zu springen. Mit / kannst du nach Patterns suchen und mit n/N zwischen den Treffern wechseln. Fuer das Kopieren drueckst du v fuer den Visual Mode, markierst den gewuenschten Text und drueckst y zum Kopieren. Der kopierte Text landet in der System-Zwischenablage, wenn du `copy_command` in deiner Config korrekt eingestellt hast.

```bash
# In Copy Mode (Ctrl+s):
# Navigation wie in Vim
h, j, k, l     # Char/Line navigation
w, b           # Word forward/backward
0, $           # Line start/end
gg, G          # Buffer start/end
/pattern       # Search
n, N           # Next/Previous match

# Selection
v              # Visual mode
V              # Visual line mode
y              # Copy selection
q              # Quit copy mode
```

### Tipp 8: zellij + fzf Integration

Die Kombination von zellij mit fzf (Fuzzy Finder) ermoeglicht blitzschnelles Wechseln zwischen Sessions und Layouts. Die Funktion `zs` listet alle laufenden Sessions auf, zeigt sie in einer fzf-Auswahl an und verbindet dich mit der ausgewaehlten Session. Die Funktion `zl` macht dasselbe fuer Layouts: Sie listet alle KDL-Dateien im Layout-Verzeichnis, laesst dich per Fuzzy-Search auswaehlen und startet zellij mit dem gewaehlten Layout. Das ist besonders nuetzlich, wenn du viele Sessions oder Layouts hast und den genauen Namen nicht im Kopf hast. Fuge diese Funktionen in deine Shell-Konfiguration ein, um sie dauerhaft verfuegbar zu machen.

```bash
# Fuzzy session switcher
function zs() {
    local session
    session=$(zellij list-sessions 2>/dev/null | \
              fzf --height 40% --reverse | \
              cut -d' ' -f1)

    if [[ -n "$session" ]]; then
        zellij attach "$session"
    fi
}

# Fuzzy layout switcher
function zl() {
    local layout
    layout=$(ls ~/.config/zellij/layouts/*.kdl 2>/dev/null | \
             xargs -n1 basename | \
             sed 's/.kdl$//' | \
             fzf --height 40% --reverse)

    if [[ -n "$layout" ]]; then
        zellij --layout "$layout"
    fi
}
```

### Tipp 9: Resize Shortcuts

Im Resize-Modus von zellij kannst du die Groesse einzelner Panes anpassen. Mit diesen Keybindings verwendest du vim-artige Buchstaben (H, J, K, L) fuer die Richtung und = / - fuer allgemeines Vergroessern bzw. Verkleinern. Das ist schneller als die Standard-Methode mit Pfeiltasten und fuehlt sich fuer vim-Nutzer natuerlich an. Du aktivierst den Resize-Modus in zellij und verwendest dann diese Bindings, um Panes pixelgenau anzupassen. Das ist besonders nuetzlich, wenn du einem Pane temporaer mehr Platz geben willst, z.B. um eine lange Log-Ausgabe zu lesen.

```kdl
// Schnelleres Resize
keybinds {
    resize {
        bind "H" { Resize "Left"; }
        bind "J" { Resize "Down"; }
        bind "K" { Resize "Up"; }
        bind "L" { Resize "Right"; }
        bind "=" { Resize "Increase"; }
        bind "-" { Resize "Decrease"; }
    }
}
```

### Tipp 10: Project-Specific Configs

Projekt-spezifische zellij-Konfigurationen erlauben es dir, fuer jedes Projekt eigene Settings und Layouts zu definieren. Erstelle dafuer ein `.zellij/`-Verzeichnis im Projekt-Root mit einer config.kdl und einer layout.kdl. Wenn du zellij aus dem Projektverzeichnis startest und die Config-Dateien angibst, werden die projektspezifischen Einstellungen verwendet. Das ist besonders nuetzlich, wenn verschiedene Projekte unterschiedliche Layout-Anforderungen haben -- ein Frontend-Projekt braucht vielleicht einen Dev-Server-Pane, waehrend ein Backend-Projekt einen Datenbank-Pane benoetigt. Committe das `.zellij/`-Verzeichnis in dein Repository, damit auch Teammitglieder die gleiche Konfiguration verwenden koennen.

```bash
# Per-Project zellij config
project/
├── .zellij/
│   ├── config.kdl
│   └── layout.kdl
└── src/

# Session mit project config starten
cd project
zellij --config .zellij/config.kdl --layout .zellij/layout.kdl
```

---

## 🎓 Zusammenfassung

**zellij** ist der moderne, benutzerfreundliche Terminal-Multiplexer für das Jahr 2024 und darüber hinaus. Mit intuitiver Bedienung, eingebauten UI-Hints, flexiblen Layouts und WebAssembly-Plugins macht zellij komplexe Terminal-Workflows zugänglich.

**Hauptvorteile:**
- ✅ Niedrige Lernkurve durch visuelle Hilfen
- ✅ Flexible Layouts für verschiedene Workflows
- ✅ Floating Panes für temporäre Tasks
- ✅ Plugin-System für Erweiterbarkeit
- ✅ Persistent Sessions überleben Disconnects
- ✅ Modern und aktiv entwickelt

**Ideal für:**
- Entwickler die von tmux umsteigen wollen
- Einsteiger in Terminal-Multiplexer
- Multi-Task Development Workflows
- Remote Development mit Session-Persistenz
- Team-Collaboration via shared sessions

**Alternativen:**
- **tmux**: Wenn Performance und Stabilität Priorität haben
- **screen**: Für Legacy-Systeme mit minimalem Footprint
- **Terminal Tabs**: Wenn Multiplexing nicht essentiell ist

**Nächste Schritte:**
1. zellij installieren und erste Session starten
2. Standard-Keybindings lernen (werden angezeigt!)
3. Custom Layouts für deine Workflows erstellen
4. Session-Management in tägliche Routine integrieren
5. Plugins und floating panes für advanced workflows nutzen

zellij macht Terminal-Multiplexing endlich intuitiv und modern – perfekt für den produktiven Entwickler-Workflow mit Claude Code! 🚀
