# Lektion 28: pet - Snippet Manager

## Berechtigung

**pet** ist ein einfaches, aber leistungsstarkes Command-Line Snippet-Management-Tool, geschrieben in Go, zum Speichern, Organisieren und Abrufen von häufig genutzten Befehlen, Code-Snippets und Scripts. Es bietet eine interaktive Suche und unterstützt Tags für bessere Organisation.

### Was pet macht:
- **Snippet-Verwaltung**: Häufig genutzte Befehle und Code-Snippets speichern
- **Interaktive Suche**: Mit fuzzy-finder (fzf/peco) schnell Snippets finden
- **Tag-System**: Snippets mit Tags organisieren für bessere Kategorisierung
- **Sync**: Snippets mit Git/GitHub synchronisieren (Cloud-Backup)
- **Variablen-Support**: Parameter in Snippets mit `<variable>` Platzhaltern
- **Execution**: Snippets direkt ausführen oder in Shell einfügen

### Typische Anwendungsfälle:
- Komplexe Git-Befehle speichern
- Docker-Commands mit vielen Optionen
- Database-Queries
- CI/CD-Pipeline-Commands
- SSH-Tunnel-Setups
- Regex-Patterns
- Häufig genutzte API-Aufrufe (curl)

---

> 🚀 **Claude Code Relevanz**: pet speichert deine haeufigsten CLI-Snippets und macht sie in Sekunden abrufbar - perfekt fuer wiederkehrende Claude Code Workflows.

## Zwecke

### 1. **Command-History-Alternative**
Statt `Ctrl+R` oder `history | grep`:
- Snippets mit beschreibenden Namen
- Strukturierte Organisation mit Tags
- Snippets über Maschinen hinweg synchronisieren
- Bessere Suchbarkeit

### 2. **Knowledge-Base für Commands**
- Komplexe Commands einmal richtig konfigurieren
- Mit Notizen und Beschreibungen versehen
- Team-weit teilen via Git
- Onboarding neuer Team-Mitglieder vereinfachen

### 3. **Parameterisierte Commands**
- Platzhalter für häufig wechselnde Werte
- Interaktive Eingabe beim Ausführen
- Keine Tippfehler mehr bei komplexen Options

### 4. **Produktivitäts-Boost**
- Weniger Zeit mit Command-Suche verschwenden
- Konsistente Befehlsausführung
- Dokumentation und Ausführung in einem Tool
- Shell-agnostisch (bash, zsh, fish)

---

## Verwendung

Dieser Abschnitt fuehrt dich durch Installation, Konfiguration und taegliche Nutzung von pet -- vom ersten Snippet bis zur Shell-Integration.

### Installation

pet ist ueber Homebrew, als Binary-Download oder ueber Go installierbar.

#### macOS (via Homebrew):
Homebrew bietet den einfachsten Installationsweg auf macOS:
```bash
# pet installieren
brew install knqyf263/pet/pet

# Version prüfen
pet version

# Initialisierung
pet configure
```

#### Linux (Binary-Download):
Lade das vorkompilierte Binary von GitHub herunter und verschiebe es in den PATH:
```bash
# Neueste Release herunterladen
wget https://github.com/knqyf263/pet/releases/download/v0.6.0/pet_0.6.0_linux_amd64.tar.gz
tar xzf pet_0.6.0_linux_amd64.tar.gz
sudo mv pet /usr/local/bin/

# Version prüfen
pet version

# Initialisierung
pet configure
```

#### Via Go:
Wenn Go installiert ist, kannst du pet direkt ueber den Go-Paketmanager installieren:
```bash
# Via Go installieren (neueste Version)
go install github.com/knqyf263/pet@latest

# Version prüfen
pet version

# Initialisierung
pet configure
```

### Initiale Konfiguration

Beim ersten Start muss pet konfiguriert werden. Der Wizard fragt nach dem bevorzugten Editor und Fuzzy-Finder (fzf oder peco):

```bash
# Konfigurations-Wizard starten
pet configure

# Erstellt ~/.config/pet/config.toml
# Wichtige Einstellungen:
# - backend: fzf oder peco (fuzzy finder)
# - selectcmd: Befehl für Auswahl-Interface
# - editor: Editor für Snippet-Bearbeitung
```

Die folgende Beispielkonfiguration zeigt die wichtigsten Einstellungen -- vom Snippet-Pfad ueber den Editor bis zur Gist-Synchronisation:

**Beispiel ~/.config/pet/config.toml:**
```toml
[General]
  snippetfile = "/Users/cosmo/.config/pet/snippet.toml"
  editor = "vim"
  column = 40
  selectcmd = "fzf"
  backend = "fzf"
  sortby = ""

[Gist]
  file_name = "pet-snippet.toml"
  access_token = ""
  gist_id = ""
  public = false
  auto_sync = false

[GitLab]
  file_name = "pet-snippet.toml"
  access_token = ""
  url = "https://gitlab.com"
  id = ""
  visibility = "private"
  auto_sync = false
```

### Basis-Verwendung

Die wichtigsten pet-Befehle fuer den Alltag -- Snippets hinzufuegen, suchen, ausfuehren und synchronisieren:

```bash
# Neues Snippet hinzufügen
pet new

# Interaktiv:
# Command: docker ps -a --format "table {{.Names}}\t{{.Status}}"
# Description: Show all Docker containers with formatting
# Tag: docker,containers

# Snippet-Liste anzeigen
pet list

# Snippet suchen (interaktiv mit fzf/peco)
pet search

# Snippet ausführen (nach Auswahl)
pet exec

# Snippet in Shell einfügen (ohne Ausführung)
pet search

# Snippet bearbeiten
pet edit

# Snippet löschen
pet delete

# Config anzeigen
pet configure

# Sync mit Gist/GitLab
pet sync
```

### Erweiterte Befehle

Fuer Power-User: Tag-basierte Suche, Snippets mit Variablen, und direktes Hinzufuegen aus der Command-Line ohne interaktiven Editor:

```bash
# Snippets mit Tags filtern
pet search --tag docker

# Snippet direkt aus Command-Line hinzufügen
pet new --command 'git log --oneline --graph --all' \
        --description 'Git log tree view' \
        --tag git,log

# Snippet mit Variablen hinzufügen
pet new --command 'ssh -L <local_port>:localhost:<remote_port> user@<host>' \
        --description 'SSH tunnel with port forwarding' \
        --tag ssh,tunnel

# Letzten Command aus History zu pet hinzufügen
pet prev

# Snippet-Datei direkt bearbeiten
vim ~/.config/pet/snippet.toml

# Alle Snippets exportieren
cat ~/.config/pet/snippet.toml

# Snippets importieren
cp backup-snippet.toml ~/.config/pet/snippet.toml
```

### Shell-Integration

Die Shell-Integration ermoeglicht den schnellen Zugriff auf Snippets per Tastenkuerzel direkt in deiner Shell. Waehle die passende Konfiguration fuer deine Shell:

#### Bash (~/.bashrc):
Binde pet an Ctrl+S fuer die Snippet-Suche und erstelle einen Alias `pp` zum schnellen Speichern des letzten Befehls:
```bash
# pet search mit Ctrl+S
function pet-select() {
  BUFFER=$(pet search --query "$READLINE_LINE")
  READLINE_LINE=$BUFFER
  READLINE_POINT=${#BUFFER}
}
bind -x '"\C-s": pet-select'

# pet prev: Letzten Command zu pet hinzufügen
function pet-prev() {
  PREV=$(fc -lrn | head -n 1)
  sh -c "pet new `printf %q "$PREV"`"
}
alias pp='pet-prev'
```

#### Zsh (~/.zshrc):
Die Zsh-Integration funktioniert aehnlich, verwendet aber zle-Widgets fuer die Tastenbindung:
```zsh
# pet search mit Ctrl+S
function pet-select() {
  BUFFER=$(pet search --query "$LBUFFER")
  CURSOR=$#BUFFER
  zle redisplay
}
zle -N pet-select
stty -ixon
bindkey '^s' pet-select

# pet prev
function pet-prev() {
  PREV=$(fc -lrn | head -n 1)
  sh -c "pet new `printf %q "$PREV"`"
}
alias pp='pet-prev'
```

#### Fish (~/.config/fish/config.fish):
Fish verwendet eine eigene Syntax fuer Keybindings und Funktionen:
```fish
# pet search mit Ctrl+S
function fish_user_key_bindings
  bind \cs pet-select
end

function pet-select
  set -l query (commandline)
  pet search --query "$query" | read -l cmd
  commandline -- $cmd
end

# pet prev
function pet-prev
  set -l prev (history --max 1)
  pet new --command "$prev"
end
alias pp='pet-prev'
```

---

## Best Practices

### 1. **Snippet-Naming-Konventionen**
Gute Beschreibungen sind entscheidend fuer die Wiederauffindbarkeit deiner Snippets. Eine Beschreibung wie "docker ps" sagt dir nichts ueber den Kontext oder die Optionen des Befehls. Stattdessen beschreibst du was der Befehl tut und in welchem Szenario er nuetzlich ist. Stell dir vor, du hast 100 Snippets und suchst per Fuzzy-Search nach einem bestimmten -- je praeziser die Beschreibung, desto schneller findest du das richtige Snippet. Die Beschreibung sollte die Aktion, das Ziel und optional den Kontext enthalten. Vermeide generische Woerter wie "stuff" oder "misc", die beim Suchen nicht helfen.
```bash
# Gute Beschreibungen:
Description: "Show all Docker containers with formatting"
Description: "SSH tunnel: local 8080 → remote 5432 (postgres)"
Description: "Git: Interactive rebase last 5 commits"

# Schlechte Beschreibungen:
Description: "docker ps"  # Zu kurz, keine Kontext
Description: "stuff"      # Nicht hilfreich
```

### 2. **Tag-Strategie**
Eine konsistente Tag-Strategie macht den Unterschied zwischen einer nuetzlichen und einer chaotischen Snippet-Sammlung. Verwende mehrstufige Tags, die das Tool, die Aktion und den Kontext beschreiben -- z.B. "docker,containers,debug" statt nur "docker". So kannst du spaeter nach verschiedenen Dimensionen filtern: alle Docker-Snippets, alle Debug-Snippets, oder alle Docker-Debug-Snippets. Stell dir vor, du hast 200 Snippets und suchst gezielt nach Kubernetes-Debugging-Befehlen -- mit gut strukturierten Tags findest du sie in Sekunden ueber `pet search --tag k8s,debug`. Einige dich frueh auf einheitliche Tag-Namen (z.B. "k8s" statt "kubernetes") und halte dich konsequent daran.
```bash
# Multi-Level-Tags verwenden:
Tags: docker,containers,debug
Tags: git,rebase,interactive
Tags: ssh,tunnel,postgres
Tags: kubernetes,pods,logs

# Damit kann man suchen:
pet search --tag docker
pet search --tag git,rebase
```

### 3. **Variablen für Parametrisierung**
Variablen sind eines der maechtigsten Features von pet, da sie einen Befehl wiederverwendbar machen, ohne ihn jedes Mal manuell anpassen zu muessen. Du definierst Variablen im Format `<variable_name>` innerhalb des Befehls, und pet fragt beim Ausfuehren automatisch nach den Werten. Stell dir vor, du hast einen Docker-exec-Befehl, bei dem sich nur der Container-Name aendert -- statt den Befehl jedes Mal manuell zu tippen, nutzt du eine Variable und gibst nur den Namen ein. Das eliminiert Tippfehler und spart Zeit bei komplexen Befehlen mit vielen Optionen. Die Variablen-Syntax ist bewusst einfach gehalten: spitze Klammern um den Variablennamen, keine weiteren Sonderzeichen noetig.
```bash
# Snippet mit Variablen:
Command: docker exec -it <container_name> /bin/bash
Description: Enter Docker container bash
Tags: docker,exec,bash

# Beim Ausführen: pet exec
# → Prompt: container_name = [eingabe]
# → Ausführt: docker exec -it mycontainer /bin/bash
```

### 4. **Git-Sync für Team-Sharing**
Die Synchronisation ueber Git ist ideal, wenn du Snippets im Team teilen oder ueber mehrere Rechner hinweg nutzen willst. Dazu initialisierst du ein Git-Repository im pet-Konfigurationsverzeichnis und pushst die snippet.toml-Datei zu einem privaten GitHub-Repository. Stell dir vor, ein neues Team-Mitglied fangt an und muss sich mit 50 verschiedenen Deployment-Befehlen vertraut machen -- statt alles muehsam zu dokumentieren, klont er einfach das Snippet-Repo und hat sofort Zugriff auf alle bewaherten Befehle mit Beschreibungen und Tags. Die Alternative zu Git ist die eingebaute Gist-Synchronisation, die allerdings weniger Kontrolle ueber Zugriff und Versionierung bietet. Achte darauf, keine Passwörter oder Tokens direkt in Snippets zu speichern -- nutze stattdessen Umgebungsvariablen.
```bash
# 1. Private GitHub-Repo erstellen
# 2. Snippet-File als Git-Repo
cd ~/.config/pet
git init
git add snippet.toml
git commit -m "Initial pet snippets"
git remote add origin git@github.com:username/pet-snippets.git
git push -u origin main

# Auf anderem Rechner:
cd ~/.config/pet
git clone git@github.com:username/pet-snippets.git .
```

### 5. **Snippet-Kategorien**
Eine klare Kategorisierung durch Tags hilft dir, den Ueberblick ueber deine wachsende Snippet-Sammlung zu behalten. Gruppiere deine Tags nach Funktionsbereichen: Development fuer Build- und Test-Befehle, Infrastructure fuer Docker und Kubernetes, Database fuer Abfragen und Backups. Stell dir vor, du betreust sowohl die Entwicklung als auch die Infrastruktur eines Projekts und brauchst schnell einen Terraform-Befehl -- mit Tags wie "infra,terraform" findest du ihn sofort, ohne durch hundert unrelated Snippets zu scrollen. Eine gut durchdachte Kategorisierung zahlt sich besonders dann aus, wenn deine Snippet-Sammlung auf ueber 50 Eintraege waechst.
```bash
# Snippets nach Zweck organisieren:

# Development
Tags: dev,build,test,deploy

# Infrastructure
Tags: infra,docker,k8s,terraform

# Database
Tags: db,postgres,mysql,queries

# Monitoring
Tags: monitoring,logs,metrics

# Security
Tags: security,ssh,gpg,certificates
```

### 6. **Komplexe Multi-Line-Snippets**
pet unterstuetzt auch mehrzeilige Befehle, was besonders bei Docker-Run-Befehlen mit vielen Flags oder bei Konfigurationsdatei-Generatoren nuetzlich ist. In der TOML-Snippet-Datei nutzt du den Pipe-Operator (|) fuer mehrzeilige Strings, und Backslashes fuer Zeilenumbrueche im Befehl selbst. Stell dir vor, du startest regelmaessig einen PostgreSQL-Container mit spezifischen Umgebungsvariablen und Port-Mappings -- der Befehl ist zu lang fuer eine Zeile, laesst sich aber als Multi-Line-Snippet sauber formatieren. Auch Heredoc-basierte Befehle zum Generieren von Konfigurationsdateien lassen sich so speichern. Achte darauf, die Einrueckung in der TOML-Datei konsistent zu halten, damit die Datei gueltig bleibt.
```bash
# Multi-line mit Backslash:
Command: |
  docker run -d \
    --name postgres \
    -e POSTGRES_PASSWORD=<password> \
    -p 5432:5432 \
    postgres:14
Description: Start PostgreSQL in Docker
Tags: docker,postgres,database

# Oder mit Heredoc:
Command: |
  cat <<EOF > config.yml
  database:
    host: <db_host>
    port: 5432
    user: <db_user>
  EOF
Description: Generate database config
Tags: config,database
```

### 7. **Snippet-Review und Cleanup**
Wie jede Sammlung braucht auch deine Snippet-Bibliothek regelmaessige Pflege. Ueber die Zeit sammeln sich doppelte Eintraege, veraltete Befehle und schlecht benannte Snippets an. Plane alle 2-3 Monate einen kurzen Review ein, bei dem du deine Snippets durchgehst und aufraaumst. Stell dir vor, du hast vor 6 Monaten einen Docker-Befehl fuer eine alte Image-Version gespeichert, der laengst nicht mehr funktioniert -- solche toten Snippets machen die Suche langsamer und fuehren zu Verwirrung. Mit dem grep-Befehl unten findest du schnell Duplikate, und `pet edit` oeffnet die gesamte Snippet-Datei im Editor zur manuellen Bereinigung.
```bash
# Regelmäßig ungenutzte Snippets entfernen
pet list | less

# Duplikate identifizieren
cat ~/.config/pet/snippet.toml | grep "command = " | sort | uniq -d

# Alte/veraltete Tags aufräumen
pet edit  # Manuell durchgehen
```

### 8. **CI/CD-Integration**
CI/CD-Befehle gehoeren zu den komplexesten und am haeufigsten wiederverwendeten Befehlen im Entwicklungsalltag. Von GitHub PR-Erstellung ueber Kubernetes-Deployments bis zu Pipeline-Retries -- diese Befehle haben oft viele Flags und sind leicht falsch einzutippen. Stell dir vor, du musst ein Kubernetes-Deployment neu starten und tippst den Deployment-Namen falsch -- mit einem pet-Snippet mit Variable `<deployment_name>` wirst du zur Eingabe aufgefordert und der Rest des Befehls ist korrekt. Speichere besonders CI/CD-Befehle als Snippets, da sie seltener ausgefuehrt werden und deshalb schwerer zu merken sind.
```bash
# Snippets für CI/CD-Befehle:
Command: gh pr create --title "<title>" --body "<body>" --base main
Description: Create GitHub PR from CLI
Tags: ci,github,pr

Command: kubectl rollout restart deployment <deployment_name>
Description: Restart Kubernetes deployment
Tags: k8s,deployment,restart
```

### 9. **Snippet-Backup-Strategie**
Deine Snippet-Sammlung ist ueber Monate gewachsen und enthaelt wertvolles Wissen -- ein Datenverlust waere aergerlich. Richte daher ein automatisches Backup ein, entweder per Cron-Job in einen Cloud-Ordner (Dropbox, iCloud) oder ueber Git (siehe Best Practice 4). Der Cron-Job unten erstellt taeglich um Mitternacht eine Kopie der Snippet-Datei mit Datumsstempel. Stell dir vor, du wechselst den Laptop oder dein Home-Verzeichnis wird versehentlich geloescht -- mit einem aktuellen Backup verlierst du keines deiner muehsam zusammengetragenen Snippets. Die Git-Variante hat den zusaetzlichen Vorteil, dass du Aenderungen an Snippets nachverfolgen kannst.
```bash
# Automatisches Backup (Cron)
# crontab -e:
0 0 * * * cp ~/.config/pet/snippet.toml ~/Dropbox/backups/pet-$(date +\%Y\%m\%d).toml

# Oder mit Git (siehe Best Practice #4)
```

### 10. **pet mit fzf für bessere UX**
fzf als Backend bietet die beste Benutzererfahrung fuer die Snippet-Suche, da es Fuzzy-Matching, eine Live-Preview und eine ansprechende Oberflaache bietet. In der config.toml stellst du fzf als selectcmd und backend ein. Stell dir vor, du tippst "dock cont" und fzf findet automatisch "Docker Container starten" -- das ist viel schneller als eine exakte Textsuche. Die erweiterte selectcmd-Konfiguration mit --preview zeigt dir den vollstaendigen Befehl in einem Preview-Fenster, bevor du ihn auswaehlst. So siehst du auf einen Blick, ob es das richtige Snippet ist, ohne es oeffnen zu muessen.
```bash
# fzf als selectcmd in config.toml:
[General]
  selectcmd = "fzf"
  backend = "fzf"

# fzf Preview-Feature:
selectcmd = "fzf --preview 'echo {}' --preview-window=down:3:wrap"
```

---

## Beispiele

### Beispiel 1: Docker-Commands speichern

Docker-Befehle gehoeren zu den haeufigsten Kandidaten fuer pet-Snippets, da sie oft viele Flags und Optionen enthalten, die schwer zu merken sind. In diesem Beispiel speicherst du drei gaengige Docker-Befehle: Container auflisten mit Formatierung, in einen Container einsteigen und Container-Logs verfolgen. Besonders der Container-Logs-Befehl nutzt eine Variable `<container_name>`, die pet beim Ausfuehren automatisch abfragt. Stell dir vor, du arbeitest taeglich mit 5 verschiedenen Docker-Containern und tippst die Docker-Befehle hundertmal pro Woche -- mit pet reduzierst du das auf eine Fuzzy-Suche und eine Variable. Das Beispiel zeigt auch den typischen Workflow: Snippet suchen, auswaehlen, Variable eingeben, ausfuehren.

```bash
# Docker-Container auflisten
pet new
Command: docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
Description: Show all containers with name, status, ports
Tags: docker,containers,list

# In Container einsteigen
pet new
Command: docker exec -it <container_name> /bin/bash
Description: Enter Docker container bash
Tags: docker,exec,bash

# Container-Logs anzeigen
pet new
Command: docker logs -f --tail 100 <container_name>
Description: Follow container logs (last 100 lines)
Tags: docker,logs

# Suchen und Ausführen:
pet search
# → Fuzzy-Search mit fzf
# → "docker logs" eingeben
# → Snippet auswählen
# → container_name eingeben: "myapp"
# → Ausführt: docker logs -f --tail 100 myapp
```

### Beispiel 2: Git-Workflows

Git-Befehle sind ein weiterer klassischer Anwendungsfall fuer pet, da komplexere Git-Operationen wie Interactive Rebase oder Force Push with Lease leicht falsch eingetippt werden koennen. Besonders der Befehl `git push --force-with-lease` ist sicherer als `git push --force`, aber schwerer zu merken -- perfekt als Snippet. Die Variable `<n>` beim Interactive Rebase fragt dich nach der Anzahl der Commits, die du umordnen willst, und `<branch>` beim Force Push nach dem Zielbranch. Stell dir vor, du musst einen Commit rueckgaengig machen und erinnerst dich nicht genau an den Reset-Befehl -- statt Stack Overflow zu durchsuchen, findest du ihn in Sekunden ueber `pet search`. Tags wie "git,rebase,interactive" ermoeglichen gezielte Suchen.

```bash
# Interactive Rebase
pet new
Command: git rebase -i HEAD~<n>
Description: Interactive rebase last N commits
Tags: git,rebase,interactive

# Git log mit Graph
pet new
Command: git log --oneline --graph --all --decorate
Description: Git log tree view
Tags: git,log,graph

# Undo last commit (keep changes)
pet new
Command: git reset --soft HEAD~1
Description: Undo last commit but keep changes staged
Tags: git,reset,undo

# Force push with lease (safer)
pet new
Command: git push --force-with-lease origin <branch>
Description: Safer force push (checks remote state)
Tags: git,push,force
```

### Beispiel 3: SSH-Tunneling

SSH-Tunnel-Befehle sind beruehmt dafuer, dass man sie nie im Kopf hat, wenn man sie braucht. Die Syntax mit -L (Local Port Forwarding) oder -D (SOCKS Proxy) ist nicht intuitiv und wird schnell verwechselt. Mit pet speicherst du die Befehle einmal korrekt und rufst sie bei Bedarf ab. Stell dir vor, du musst dich von zu Hause aus mit der PostgreSQL-Datenbank im Firmennetzwerk verbinden -- der SSH-Tunnel leitet den lokalen Port 5433 an den Remote-Port 5432 weiter. Ohne Snippet wuerdest du jedes Mal die Syntax nachschlagen. Das zweite Snippet zeigt auch, wie du einen konkreten Befehl mit festen Werten (als Referenz) neben dem parametrisierten Snippet speichern kannst.

```bash
# SSH Tunnel für DB
pet new
Command: ssh -L <local_port>:localhost:<remote_port> <user>@<host> -N
Description: SSH tunnel: local → remote port
Tags: ssh,tunnel,port-forwarding

# Beispiel mit konkreten Werten als Beschreibung:
Command: ssh -L 5433:localhost:5432 user@prod-db.example.com -N
Description: SSH tunnel to production PostgreSQL (local 5433 → remote 5432)
Tags: ssh,tunnel,postgres,production

# SOCKS-Proxy
pet new
Command: ssh -D <local_port> <user>@<host> -N
Description: Create SOCKS proxy via SSH
Tags: ssh,proxy,socks
```

### Beispiel 4: Kubernetes-Operationen

Kubernetes-Befehle sind komplex, lang und enthalten viele Flags, die leicht vergessen werden. Die Kombination aus Ressource-Typ, Name, Namespace und Optionen macht kubectl-Befehle zu perfekten Snippet-Kandidaten. Besonders das Debugging von Pods erfordert eine Kette von Befehlen (Logs anzeigen, Port-Forwarding, Exec in Pod), die du als einzelne Snippets schnell abrufen kannst. Stell dir vor, ein Pod in deinem Kubernetes-Cluster faellt aus und du musst schnell die Logs pruefen, dann in den Pod einsteigen, und anschliessend den Port forwarden -- mit pet findest du jeden Befehl in Sekunden ueber die Tags "k8s,logs" oder "k8s,exec". Die Variablen wie `<pod_name>` und `<service_name>` werden beim Ausfuehren abgefragt.

```bash
# Pod-Logs mit Label-Selector
pet new
Command: kubectl logs -f -l app=<app_name> --all-containers=true
Description: Follow logs for all pods with label
Tags: k8s,logs,pods,label

# Execute in Pod
pet new
Command: kubectl exec -it <pod_name> -- /bin/bash
Description: Enter pod bash
Tags: k8s,exec,pod

# Port-Forward
pet new
Command: kubectl port-forward service/<service_name> <local_port>:<remote_port>
Description: Port-forward to Kubernetes service
Tags: k8s,port-forward,service

# Get resource YAML
pet new
Command: kubectl get <resource> <name> -o yaml
Description: Get Kubernetes resource as YAML
Tags: k8s,get,yaml
```

### Beispiel 5: Database-Queries

Datenbank-Befehle werden selten genug ausgefuehrt, um die exakte Syntax zu vergessen, aber haeufig genug, um sie griffbereit haben zu wollen. Besonders Dump- und Restore-Befehle mit ihren vielen Flags sind fehleranfaellig. Stell dir vor, dein Produktionsserver hat ein Problem und du musst schnell ein Datenbank-Backup erstellen -- mit dem pg_dump-Snippet gibst du nur Host, User und Datenbankname ein und der Rest des Befehls ist korrekt formatiert, inklusive Zeitstempel im Dateinamen. Die Redis- und MySQL-Snippets sind ebenso nuetzlich, da diese Befehle ebenfalls selten getippt werden und die Syntax leicht verwechselt wird.

```bash
# PostgreSQL: Dump Database
pet new
Command: pg_dump -h <host> -U <user> -d <database> > dump-$(date +%Y%m%d).sql
Description: Dump PostgreSQL database with timestamp
Tags: postgres,dump,backup

# MySQL: Show running queries
pet new
Command: mysql -u <user> -p -e "SHOW FULL PROCESSLIST;"
Description: Show all running MySQL queries
Tags: mysql,queries,debug

# Redis: Get all keys
pet new
Command: redis-cli --scan --pattern "<pattern>"
Description: Scan Redis keys by pattern
Tags: redis,keys,search
```

### Beispiel 6: Snippet mit mehreren Variablen

Dieses Beispiel zeigt, wie pet mit mehreren Variablen in einem einzigen Befehl umgeht. Der curl-Befehl fuer einen API-POST-Request enthaelt drei Variablen: endpoint, token und value. Beim Ausfuehren fragt pet nacheinander nach jedem Wert und setzt ihn in den Befehl ein. Stell dir vor, du testest regelmaessig verschiedene API-Endpoints mit wechselnden Auth-Tokens -- statt den langen curl-Befehl jedes Mal manuell zusammenzubauen, fuellst du nur die drei Felder aus. Das spart nicht nur Zeit, sondern verhindert auch Syntaxfehler bei den komplexen Header- und Datenkonstrukten. Beachte, dass pet die Variablen in der Reihenfolge abfragt, in der sie im Befehl erscheinen.

```bash
pet new
Command: curl -X POST https://api.example.com/<endpoint> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"key": "<value>"}'
Description: POST request to API with auth
Tags: api,curl,post,auth

# Beim Ausführen (pet exec):
# endpoint = [users]
# token = [eyJhbGc...]
# value = [test]
# → Führt aus: curl -X POST https://api.example.com/users ...
```

### Beispiel 7: Build-Commands

Build-Befehle gehoeren zu den laengsten und komplexesten Kommandos im Entwicklungsalltag. Ein Docker-Build mit Timestamp-Tag, ein optimierter Rust-Build oder ein sauberer npm-Install -- diese Befehle bestehen aus mehreren verketteten Kommandos mit spezifischen Flags. Stell dir vor, du brauchst einen Docker-Build mit einem eindeutigen Tag fuer jedes Image -- der Befehl unten nutzt das aktuelle Datum und die Uhrzeit als Tag, was du unmoeglich jedes Mal manuell tippen willst. Das Rust-Snippet setzt sogar eine Umgebungsvariable (RUSTFLAGS) fuer CPU-native Optimierungen und fuehrt anschliessend das kompilierte Binary aus. Der Clean-Install fuer Node.js loescht erst node_modules und package-lock.json, bevor ein frischer Install gestartet wird.

```bash
# Docker Build mit Timestamp-Tag
pet new
Command: docker build -t <image_name>:$(date +%Y%m%d-%H%M%S) .
Description: Build Docker image with timestamp tag
Tags: docker,build,timestamp

# Rust: Build + Run mit Optimizations
pet new
Command: RUSTFLAGS="-C target-cpu=native" cargo build --release && ./target/release/<binary_name>
Description: Build Rust with native optimizations and run
Tags: rust,build,optimize

# Node: Clean install
pet new
Command: rm -rf node_modules package-lock.json && npm install
Description: Clean npm install
Tags: node,npm,install,clean
```

### Beispiel 8: Netzwerk-Debugging

Netzwerk-Debugging-Befehle werden selten benoetigt, aber wenn, dann dringend -- und genau dann erinnert man sich nicht an die Syntax. Port-Scans mit netcat, DNS-Lookups mit dig und HTTP-Header-Abfragen mit curl sind klassische Diagnosetools, die jeder Entwickler kennen sollte. Stell dir vor, ein Web-Service ist nicht erreichbar und du musst schnell pruefen, ob der Port ueberhaupt offen ist -- das netcat-Snippet scannt einen Port-Bereich und zeigt, welche Ports antworten. Der curl-Befehl mit -I zeigt nur die HTTP-Header, was nuetzlich ist, um Redirects, Caching-Header oder den Serverstatus zu pruefen, ohne den gesamten Response-Body herunterzuladen.

```bash
# Port-Scan mit nc
pet new
Command: nc -zv <host> <port_start>-<port_end>
Description: Scan port range with netcat
Tags: network,port-scan,debug

# DNS-Lookup mit dig
pet new
Command: dig +short <domain>
Description: DNS lookup (short format)
Tags: dns,dig,lookup

# HTTP-Headers abrufen
pet new
Command: curl -I <url>
Description: Get HTTP headers only
Tags: http,curl,headers,debug
```

### Beispiel 9: File-Operations

Dateioperationen wie gezieltes Suchen-und-Loeschen, Archivierung und Speicherplatzanalyse sind alltaegliche Aufgaben, die mit den richtigen Flags praezise und sicher ablaufen. Der find-Befehl mit -exec rm -i fragt vor dem Loeschen jeder Datei nach Bestaetigung -- das ist sicherer als ein blindes rm -rf. Das tar-Snippet erstellt ein komprimiertes Archiv mit automatischem Zeitstempel, sodass du immer weisst, wann das Backup erstellt wurde. Stell dir vor, du musst vor einem grossen Refactoring ein Backup des Projektordners machen -- mit dem tar-Snippet tippst du nur den Verzeichnisnamen ein und bekommst ein sauber benanntes Archiv. Der du-Befehl zeigt die 10 groessten Verzeichnisse, sortiert nach Groesse.

```bash
# Find und Delete (mit Bestätigung)
pet new
Command: find <path> -name "<pattern>" -type f -exec rm -i {} \;
Description: Find files by pattern and delete with confirmation
Tags: find,delete,files

# Archive mit Timestamp
pet new
Command: tar -czf archive-$(date +%Y%m%d).tar.gz <directory>
Description: Create gzipped tarball with timestamp
Tags: tar,archive,backup

# Disk Usage: Top 10 directories
pet new
Command: du -h <path> | sort -rh | head -10
Description: Top 10 largest directories
Tags: disk,usage,du,sort
```

### Beispiel 10: CI/CD-Snippets

CI/CD-Befehle sind oft die komplexesten Kommandos, die du ausfuehrst, und gleichzeitig die am seltensten benutzten -- eine gefaehrliche Kombination. Von GitHub Actions Workflow-Triggering ueber GitLab Pipeline-Retries bis zu Docker-Build-und-Push-Ketten enthalten diese Befehle viele Parameter, die korrekt sein muessen. Stell dir vor, ein Deployment schlaegt fehl und du musst schnell die Pipeline manuell neu starten -- statt in der GitLab-Dokumentation nach dem curl-Befehl zu suchen, hast du ihn als Snippet mit den noetigen Variablen (Token, Project-ID, Pipeline-ID) parat. Auch der Docker-Build-und-Push-Workflow ist ein idealer Kandidat, da er Registry-URL, Image-Name und Tag als Variablen enthaelt.

```bash
# GitHub Actions: Rerun workflow
pet new
Command: gh workflow run <workflow_name> --ref <branch>
Description: Manually trigger GitHub Actions workflow
Tags: ci,github-actions,workflow

# GitLab CI: Retry pipeline
pet new
Command: curl -X POST --header "PRIVATE-TOKEN: <token>" \
  "https://gitlab.com/api/v4/projects/<project_id>/pipelines/<pipeline_id>/retry"
Description: Retry GitLab CI pipeline via API
Tags: ci,gitlab,pipeline,retry

# Docker: Build + Push
pet new
Command: docker build -t <registry>/<image>:<tag> . && docker push <registry>/<image>:<tag>
Description: Build and push Docker image
Tags: docker,build,push,ci
```

### Beispiel 11: Security-Related

Sicherheitsbezogene Befehle wie SSH-Key-Generierung, GPG-Verschluesselung und SSL-Zertifikatspruefung fuehrt man selten aus, aber wenn, muessen sie korrekt sein -- ein falsch generierter SSH-Key oder ein vergessenes GPG-Flag kann ernste Konsequenzen haben. Stell dir vor, du musst fuer einen neuen Server einen Ed25519-SSH-Key erstellen -- der Befehl enthalt den Key-Typ (-t ed25519), eine Kommentar-E-Mail (-C) und den Dateinamen (-f). Ohne Snippet wuerdest du jedes Mal die Manpage konsultieren. Das SSL-Zertifikat-Snippet ist besonders nuetzlich, wenn du pruefen willst, ob ein Zertifikat bald ablaeuft -- der openssl-Befehl zeigt die Gueltigkeitsdaten an, und du siehst sofort, ob eine Erneuerung noetig ist.

```bash
# Generate SSH Key
pet new
Command: ssh-keygen -t ed25519 -C "<email>" -f ~/.ssh/<key_name>
Description: Generate Ed25519 SSH key
Tags: ssh,security,keygen

# GPG: Encrypt file
pet new
Command: gpg --encrypt --recipient <email> <file>
Description: Encrypt file with GPG for recipient
Tags: gpg,encrypt,security

# Check SSL Certificate
pet new
Command: openssl s_client -connect <domain>:443 -servername <domain> < /dev/null | openssl x509 -noout -dates
Description: Check SSL certificate validity dates
Tags: ssl,certificate,openssl,security
```

### Beispiel 12: pet prev - Letzten Command speichern

Die pet-prev-Funktion (ueber den Alias `pp`) ist einer der produktivsten Workflows in pet. Statt einen Befehl vorher als Snippet zu planen, fuehrst du ihn einfach aus und speicherst ihn anschliessend, wenn er funktioniert hat. Das ist besonders nuetzlich, wenn du einen komplexen Befehl muehsam zusammengebaut hast und ihn nicht verlieren willst. Stell dir vor, du hast 5 Minuten damit verbracht, einen Docker-Run-Befehl mit genau den richtigen Port-Mappings und Umgebungsvariablen zusammenzustellen -- mit `pp` speicherst du ihn sofort als Snippet, fügst eine Beschreibung und Tags hinzu, und hast ihn fuer immer griffbereit. Der Editor oeffnet sich mit dem letzten Befehl vorausgefuellt, sodass du nur noch Beschreibung und Tags ergaenzen musst.

```bash
# Komplexen Command ausführen:
$ docker run -d --name redis -p 6379:6379 redis:alpine

# Dann sofort mit Alias speichern:
$ pp
# pet öffnet Editor:
# Command: docker run -d --name redis -p 6379:6379 redis:alpine
# Description: [leer - jetzt ausfüllen]
# Tags: [leer - jetzt ausfüllen]

# Ausfüllen:
# Description: Start Redis in Docker (Alpine)
# Tags: docker,redis,start
# Speichern und schließen

# Jetzt ist der Command als Snippet verfügbar!
```

---

## Integration mit Claude Code

### Workflow 1: Snippet-Generierung mit Claude

```bash
# Claude Prompt:
"""
Generate pet snippets for the following use-cases:
1. Deploy Node.js app to production
2. Backup PostgreSQL database
3. Kubernetes pod debugging
4. Git cleanup (branches, tags)

Format as pet TOML:
[[snippets]]
  description = "..."
  command = "..."
  tag = ["...", "..."]
  output = ""
"""
```

**Claude-Output:**
```toml
[[snippets]]
  description = "Deploy Node.js app to production"
  command = "git pull && npm install --production && pm2 restart <app_name>"
  tag = ["deploy", "node", "pm2", "production"]
  output = ""

[[snippets]]
  description = "Backup PostgreSQL database to S3"
  command = "pg_dump -h <host> -U <user> -d <database> | gzip | aws s3 cp - s3://<bucket>/backup-$(date +%Y%m%d).sql.gz"
  tag = ["postgres", "backup", "s3", "database"]
  output = ""

[[snippets]]
  description = "Debug Kubernetes pod (logs + describe + events)"
  command = "kubectl logs <pod> && kubectl describe pod <pod> && kubectl get events --field-selector involvedObject.name=<pod>"
  tag = ["k8s", "debug", "pod", "logs"]
  output = ""

[[snippets]]
  description = "Git cleanup: delete merged branches"
  command = "git branch --merged | grep -v '\\*\\|main\\|master' | xargs -n 1 git branch -d"
  tag = ["git", "cleanup", "branches"]
  output = ""
```

**Import:**
```bash
# Append to snippet file
cat claude-snippets.toml >> ~/.config/pet/snippet.toml

# Oder manuell kopieren
vim ~/.config/pet/snippet.toml
```

### Workflow 2: Snippet-Optimierung mit Claude

```bash
# Snippet-File an Claude senden
cat ~/.config/pet/snippet.toml

# Claude Prompt:
"""
Analyze my pet snippets and suggest:
1. Duplicates or similar snippets to merge
2. Missing error handling
3. Better tag organization
4. Commands that should use variables instead of hardcoded values

Snippets:
[paste snippets]
"""
```

**Claude-Analyse:**
```
Findings:

1. Duplicates:
   - "docker ps -a" appears 3 times with slight variations
   - Suggestion: Merge into one with optional format variable

2. Missing Error Handling:
   - "rm -rf <dir>" has no confirmation
   - Suggestion: Add "-i" flag or use "rm -rf" only with specific paths

3. Tag Organization:
   - Inconsistent: some use "k8s", others "kubernetes"
   - Suggestion: Standardize to "k8s"

4. Should Use Variables:
   - "ssh user@prod-db.example.com" hardcodes host
   - Suggestion: "ssh <user>@<host>"
```

### Workflow 3: Command-to-Snippet-Automation

```python
# command_to_snippet.py
import subprocess
import anthropic

def analyze_command(command):
    """Analyze command with Claude and generate pet snippet"""
    client = anthropic.Anthropic(api_key="your-api-key")

    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=512,
        messages=[{
            "role": "user",
            "content": f"""
            Analyze this command and generate a pet snippet:

            Command: {command}

            Output as JSON:
            {{
              "description": "...",
              "tags": ["...", "..."],
              "variables": ["var1", "var2"]
            }}

            - description: Clear, helpful description
            - tags: 2-4 relevant tags
            - variables: Parts that should be <variable>
            """
        }]
    )

    import json
    result = json.loads(message.content[0].text)

    # Replace variables
    cmd_with_vars = command
    for var in result['variables']:
        # Heuristic: Replace values that look like variables
        # (e.g., specific IDs, names, etc.)
        pass  # Simplified for example

    return result

def add_to_pet(command, description, tags):
    """Add snippet to pet"""
    tags_str = ','.join(tags)
    subprocess.run([
        'pet', 'new',
        '--command', command,
        '--description', description,
        '--tag', tags_str
    ])

if __name__ == '__main__':
    import sys

    if len(sys.argv) < 2:
        print("Usage: python command_to_snippet.py '<command>'")
        sys.exit(1)

    command = sys.argv[1]
    result = analyze_command(command)

    print(f"Description: {result['description']}")
    print(f"Tags: {', '.join(result['tags'])}")
    print(f"Variables: {result['variables']}")

    response = input("\nAdd to pet? (y/n): ")
    if response.lower() == 'y':
        add_to_pet(command, result['description'], result['tags'])
        print("✓ Added to pet!")
```

**Usage:**
```bash
python command_to_snippet.py 'docker run -d --name myapp -p 8080:8080 myapp:latest'

# Output:
# Description: Run Docker container with port mapping
# Tags: docker, run, container, port
# Variables: ['myapp', '8080', 'myapp:latest']
#
# Add to pet? (y/n): y
# ✓ Added to pet!
```

### Workflow 4: Snippet-Discovery aus Codebase

```python
# discover_snippets.py
import os
import re
import anthropic

def find_complex_commands(directory):
    """Find shell scripts in codebase"""
    commands = []

    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.sh', '.bash', '.zsh')):
                with open(os.path.join(root, file)) as f:
                    content = f.read()
                    # Extract commands (simplified heuristic)
                    for line in content.split('\n'):
                        if len(line) > 50 and not line.startswith('#'):
                            commands.append(line.strip())

    return commands

def suggest_snippets(commands):
    """Suggest which commands should be pet snippets"""
    client = anthropic.Anthropic(api_key="your-api-key")

    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=2048,
        messages=[{
            "role": "user",
            "content": f"""
            These commands were found in a codebase.
            Which ones would be useful as pet snippets?

            For each useful command, suggest:
            - description
            - tags
            - which parts should be variables

            Commands:
            {chr(10).join(commands)}

            Output as JSON array.
            """
        }]
    )

    import json
    return json.loads(message.content[0].text)

if __name__ == '__main__':
    commands = find_complex_commands('.')
    suggestions = suggest_snippets(commands[:20])  # Limit to 20

    print(f"Found {len(suggestions)} useful snippets:\n")
    for i, snippet in enumerate(suggestions, 1):
        print(f"{i}. {snippet['description']}")
        print(f"   Command: {snippet['command']}")
        print(f"   Tags: {', '.join(snippet['tags'])}\n")
```

### Workflow 5: Team-Snippet-Library mit Claude-Curation

```python
# curate_team_snippets.py
import anthropic

def curate_snippets(team_snippets_file):
    """Curate team snippets with Claude"""
    with open(team_snippets_file) as f:
        snippets = f.read()

    client = anthropic.Anthropic(api_key="your-api-key")

    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=4096,
        messages=[{
            "role": "user",
            "content": f"""
            Curate this team snippet library:

            1. Remove duplicates
            2. Improve descriptions
            3. Standardize tags
            4. Add missing useful snippets for a full-stack dev team
            5. Organize by category (Development, Operations, Database, CI/CD, Security)

            Current snippets:
            {snippets}

            Output as valid TOML.
            """
        }]
    )

    return message.content[0].text

if __name__ == '__main__':
    curated = curate_snippets('~/.config/pet/snippet.toml')

    with open('snippet-curated.toml', 'w') as f:
        f.write(curated)

    print("✓ Curated snippets saved to snippet-curated.toml")
    print("Review and then: cp snippet-curated.toml ~/.config/pet/snippet.toml")
```

---

## 🤖 Claude Code Integration

### Workflow 1: Claude Code Befehle als Snippets speichern
Wenn du haeufig die gleichen Claude Code Prompts verwendest, speichere sie als pet-Snippets. So hast du deine besten Prompts immer griffbereit und musst sie nicht jedes Mal neu formulieren. Stell dir vor, du startest jede Woche ein neues Feature basierend auf einem GitHub-Issue -- statt den Claude-Code-Befehl jedes Mal neu zu tippen, rufst du das Snippet auf und aenderst nur die Issue-Nummer. Das spart Zeit und stellt sicher, dass deine Prompts konsistent und optimiert bleiben. Besonders fuer Team-Workflows ist das wertvoll, da alle Team-Mitglieder die gleichen bewaehrten Prompts nutzen koennen.
```bash
pet new -t "Claude Code: Neues Feature starten" -c "claude 'Implementiere Feature X basierend auf Issue #42'"
```

### Workflow 2: Haeufige Entwicklungs-Workflows
Nach einer Claude Code Session muessen oft Tests und Linting durchgefuehrt werden, um sicherzustellen, dass der generierte Code den Qualitaetsstandards entspricht. Statt diese Befehle jedes Mal manuell zu tippen, speichere die gesamte Kette als ein einziges Snippet. Stell dir vor, du laesst Claude Code einen neuen API-Endpoint implementieren und willst danach sofort pruefen, ob alle Tests bestehen und der Code den Linting-Regeln folgt -- ein Aufruf von `pet exec` genuegt. Die verketteten Befehle mit `&&` stellen sicher, dass der Linter nur laeuft, wenn die Tests bestanden haben.
```bash
pet new -t "Test + Lint nach Claude Code" -c "npm test && npx eslint src/ --fix"
```

### Workflow 3: Snippets mit Parametern
Parametrisierte Claude Code Prompts ermoeglichen es, bewhrte Prompt-Strukturen mit wechselnden Inhalten zu fuellen. In diesem Beispiel hat das Snippet zwei Parameter: den Branch-Namen und eine Beschreibung des zu erstellenden Pull Requests. Stell dir vor, du erstellst woechentlich 3-5 Pull Requests und willst sicherstellen, dass Claude Code jedes Mal die gleiche strukturierte PR-Beschreibung generiert -- mit dem parametrisierten Snippet gibst du nur Branch und Beschreibung ein, und der Rest des Prompts ist optimiert und konsistent. So entwickelst du ueber die Zeit eine Bibliothek bewaehrter Claude Code Prompts.
```bash
pet new -t "Claude Code PR erstellen" -c "claude 'Erstelle PR fuer <branch=feature>: <beschreibung>'"
```

> 💡 **Tipp**: Speichere deine erfolgreichsten Claude Code Prompts als pet-Snippets fuer spaetere Wiederverwendung.

---

## Troubleshooting

### Problem 1: pet command not found

**Symptome:**
```bash
$ pet version
pet: command not found
```

**Lösung:**
```bash
# Installation prüfen
which pet

# Neu installieren (macOS)
brew install knqyf263/pet/pet

# Oder via Go
go install github.com/knqyf263/pet@latest

# PATH prüfen
echo $PATH
# Go-Binaries sollten in ~/go/bin sein
export PATH=$PATH:~/go/bin
```

### Problem 2: pet search öffnet sich nicht

**Symptome:**
```bash
$ pet search
Error: selectcmd not found
```

**Lösung:**
```bash
# fzf oder peco installieren
brew install fzf  # macOS
sudo apt install fzf  # Linux

# Config prüfen
cat ~/.config/pet/config.toml
# Sollte enthalten:
# selectcmd = "fzf"
# backend = "fzf"

# Neu konfigurieren
pet configure
```

### Problem 3: Snippet-File nicht gefunden

**Symptome:**
```bash
$ pet list
Error: cannot open snippet file
```

**Lösung:**
```bash
# Snippet-File erstellen
mkdir -p ~/.config/pet
touch ~/.config/pet/snippet.toml

# Oder Konfiguration neu durchführen
pet configure

# File-Pfad prüfen
cat ~/.config/pet/config.toml | grep snippetfile
```

### Problem 4: pet exec führt falschen Command aus

**Symptome:**
```bash
Snippet wird nicht mit Variablen-Eingabe ausgeführt
```

**Lösung:**
```bash
# Prüfen ob Variablen richtig formatiert sind:
# Korrekt: <variable_name>
# Falsch: {variable_name}, $variable_name, [variable_name]

# Snippet bearbeiten
pet edit
# → Variablen-Syntax prüfen und korrigieren
```

### Problem 5: pet prev funktioniert nicht

**Symptome:**
```bash
$ pp
pp: command not found
```

**Lösung:**
```bash
# Shell-Integration prüfen
# Für Bash: ~/.bashrc
# Für Zsh: ~/.zshrc
# Für Fish: ~/.config/fish/config.fish

# Beispiel für Zsh:
cat ~/.zshrc | grep "pet-prev"
# Sollte vorhanden sein

# Wenn nicht: Shell-Integration aus "Verwendung" Sektion kopieren

# Shell neu laden
source ~/.zshrc  # oder ~/.bashrc
```

### Problem 6: Sync mit Gist schlägt fehl

**Symptome:**
```bash
$ pet sync
Error: GitHub API error
```

**Lösung:**
```bash
# GitHub Personal Access Token erstellen:
# 1. https://github.com/settings/tokens/new
# 2. Scope: "gist" auswählen
# 3. Token generieren

# In Config eintragen
vim ~/.config/pet/config.toml
# [Gist]
#   access_token = "ghp_..."
#   public = false
#   auto_sync = false

# Gist erstellen
pet sync
# → Erstellt neuen Gist und trägt gist_id ein
```

### Problem 7: Editor öffnet sich nicht

**Symptome:**
```bash
$ pet edit
[kein Editor öffnet sich]
```

**Lösung:**
```bash
# Editor in Config setzen
vim ~/.config/pet/config.toml
# [General]
#   editor = "vim"  # oder "nano", "code", "subl"

# Oder EDITOR-Variable setzen
export EDITOR=vim
# In ~/.bashrc oder ~/.zshrc permanent machen
```

### Problem 8: Variablen werden nicht ersetzt

**Symptome:**
```bash
Command wird mit "<variable>" ausgeführt statt mit Wert
```

**Lösung:**
```bash
# pet exec verwenden (nicht pet search)
pet exec  # Fragt nach Variablen-Werten

# Oder: Snippet-Syntax prüfen
pet edit
# Variablen müssen Format haben: <name>
# NICHT: {name}, $name, [name]
```

### Problem 9: Tags funktionieren nicht

**Symptome:**
```bash
$ pet search --tag docker
[keine Ergebnisse]
```

**Lösung:**
```bash
# Tags prüfen
pet list | grep -A 2 docker

# Tag-Format in snippet.toml prüfen
cat ~/.config/pet/snippet.toml
# Sollte sein:
# tag = ["docker", "container"]
# NICHT:
# tag = "docker,container"

# Falls falsch: pet edit und korrigieren
```

### Problem 10: pet ist langsam

**Symptome:**
```bash
pet search braucht mehrere Sekunden
```

**Lösung:**
```bash
# Snippet-File-Größe prüfen
wc -l ~/.config/pet/snippet.toml

# Falls sehr groß (>1000 Zeilen): Cleanup
# Alte/ungenutzte Snippets entfernen
pet edit

# fzf als Backend verwenden (schneller)
# ~/.config/pet/config.toml:
# backend = "fzf"
# selectcmd = "fzf"
```

---

## Vergleich mit Alternativen

### pet vs. bash history (Ctrl+R)

| Feature                | pet                           | bash history                 |
|------------------------|-------------------------------|------------------------------|
| **Suche**              | ✓✓✓ Fuzzy-Search mit fzf    | ✓ Reverse-I-Search           |
| **Beschreibungen**     | ✓✓✓ Ja                       | ✗ Nein                       |
| **Tags**               | ✓✓✓ Ja                       | ✗ Nein                       |
| **Variablen**          | ✓✓✓ Ja                       | ✗ Nein (manuell editieren)   |
| **Sync**               | ✓✓✓ Git/Gist/GitLab          | ✗ Nur lokal                  |
| **Team-Sharing**       | ✓✓✓ Ja                       | ✗ Kompliziert                |
| **Organisation**       | ✓✓✓ Tags + Kategorien        | ✗ Chronologisch              |

**Empfehlung:**
- **pet**: Für wichtige, wiederverwendbare Commands mit Dokumentation
- **history**: Für einmalige, simple Commands

### pet vs. cheat (cheat.sh)

| Feature                | pet                           | cheat                        |
|------------------------|-------------------------------|------------------------------|
| **Quelle**             | Eigene Snippets               | Community-Cheatsheets        |
| **Anpassbar**          | ✓✓✓ Vollständig              | ✓ Begrenzt                   |
| **Offline**            | ✓✓✓ Ja                       | ✓ Cached                     |
| **Variablen**          | ✓✓✓ Ja                       | ✗ Nein                       |
| **Execution**          | ✓✓✓ Direktes Ausführen       | ✗ Nur Anzeige                |
| **Team-Specific**      | ✓✓✓ Ja                       | ✗ Generisch                  |

**Empfehlung:**
- **pet**: Für team-/projekt-spezifische Commands
- **cheat**: Für generische Syntax-Referenzen

### pet vs. navi

| Feature                | pet                           | navi                         |
|------------------------|-------------------------------|------------------------------|
| **Format**             | TOML                          | Markdown-ähnlich (.cheat)    |
| **Variablen**          | ✓✓✓ Interaktive Eingabe      | ✓✓✓ Mit Suggestions          |
| **UI**                 | ✓✓ fzf/peco                  | ✓✓✓ Eigene TUI               |
| **Community-Sheets**   | ✗ Nein                       | ✓✓✓ Ja (Repo-Import)         |
| **Sprache**            | Go                            | Rust                         |
| **Komplexität**        | ✓✓✓ Einfach                  | ✓✓ Mittelmäßig               |

**Empfehlung:**
- **pet**: Für einfaches Snippet-Management
- **navi**: Für erweiterte Features (Auto-Completion, Community-Sheets)

---

## Nützliche Links

### Offizielle Ressourcen:
- **GitHub Repo**: https://github.com/knqyf263/pet
- **Releases**: https://github.com/knqyf263/pet/releases
- **Documentation**: https://github.com/knqyf263/pet/blob/master/README.md

### Alternative Tools:
- **navi**: https://github.com/denisidoro/navi (Rust, erweiterte Features)
- **cheat.sh**: https://cheat.sh (Community-Cheatsheets)
- **tldr**: https://tldr.sh (Simplified man pages)
- **bro pages**: http://bropages.org (Community-driven help)

### Shell-Integration:
- **fzf**: https://github.com/junegunn/fzf (Fuzzy finder)
- **peco**: https://github.com/peco/peco (Alternative zu fzf)

### Tutorials:
- **Qiita Article** (Japanese): https://qiita.com/knqyf263/items/4dd9685f0057f8ec7e3c

---

## Pro-Tipps

### 1. **Snippet-Templates für häufige Patterns**
Template-Snippets sind wiederverwendbare Befehlsgerüste, bei denen du nur die variablen Teile ausfuellst. Statt fuer jeden API-Aufruf oder Docker-Container ein neues Snippet zu erstellen, definierst du ein Template mit allen gaengigen Optionen und Variablen. Stell dir vor, du testest taeglich verschiedene APIs -- statt jedes Mal den curl-Befehl mit Headers und Body manuell zusammenzubauen, fuellst du nur Method, URL, Token und Daten in das Template ein. Der Docker-Run-Template ist ebenso nuetzlich, da er Name, Port, Umgebungsvariable und Image als Variablen enthaelt. Tagge Templates mit "template", damit du sie schnell ueber `pet search --tag template` findest.
```bash
# Template-Snippets erstellen für wiederkehrende Muster:

# API-Call-Template
Command: curl -X <method> <url> -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '<data>'
Description: API call template
Tags: api,curl,template

# Docker-Run-Template
Command: docker run -d --name <name> -p <port>:<port> -e <env_var>=<value> <image>
Description: Docker run template
Tags: docker,run,template
```

### 2. **Snippet-Aliase in Shell**
Kurze Shell-Aliase fuer die pet-Befehle machen den Zugriff noch schneller. Statt `pet search` tippst du nur `ps`, statt `pet exec` nur `pe`. Stell dir vor, du nutzt pet dutzende Male am Tag -- die eingesparten Tastenanschlaege summieren sich. Achte allerdings darauf, dass `ps` moeglicherweise mit dem System-Befehl `ps` (Process Status) kollidiert -- waehle in dem Fall einen anderen Alias wie `pss`. Die Aliase funktionieren in Bash, Zsh und den meisten anderen Shells.
```bash
# ~/.bashrc oder ~/.zshrc
alias ps='pet search'
alias pe='pet exec'
alias pn='pet new'
alias pl='pet list'
```

### 3. **Snippet-Export für Team**
Wenn du bestimmte Snippet-Kategorien mit deinem Team teilen willst, kannst du sie gezielt aus deiner Snippet-Datei extrahieren. Der grep-Befehl filtert alle Docker-bezogenen Snippets heraus und schreibt sie in eine separate Datei. Stell dir vor, ein neuer Backend-Entwickler fangt in deinem Team an und braucht alle Docker-Befehle -- du exportierst deine Docker-Snippets und er importiert sie in seine pet-Installation. So profitiert das ganze Team von der Erfahrung jedes einzelnen Mitglieds. Beachte, dass der grep-Ansatz vereinfacht ist -- fuer praezisere Extraktion nutze ein TOML-Parser oder bearbeite die Datei manuell.
```bash
# Alle Docker-Snippets exportieren
cat ~/.config/pet/snippet.toml | grep -A 5 'tag.*docker' > docker-snippets.toml

# Team-Mitglieder können importieren:
cat docker-snippets.toml >> ~/.config/pet/snippet.toml
```

### 4. **Snippet-Validation-Script**
```python
#!/usr/bin/env python3
# validate_snippets.py
import toml

with open('/Users/username/.config/pet/snippet.toml') as f:
    data = toml.load(f)

print(f"Total snippets: {len(data['snippets'])}\n")

# Check for duplicates
commands = [s['command'] for s in data['snippets']]
duplicates = [c for c in commands if commands.count(c) > 1]
if duplicates:
    print(f"⚠️  Duplicate commands found: {len(set(duplicates))}")

# Check for missing descriptions
no_desc = [s for s in data['snippets'] if not s.get('description')]
if no_desc:
    print(f"⚠️  Snippets without description: {len(no_desc)}")

# Check for untagged
no_tags = [s for s in data['snippets'] if not s.get('tag')]
if no_tags:
    print(f"⚠️  Snippets without tags: {len(no_tags)}")

print("\n✓ Validation complete")
```

### 5. **Snippet-Search-Optimization**
```bash
# In ~/.config/pet/config.toml:
[General]
  # fzf mit Preview
  selectcmd = "fzf --preview 'echo {}' --preview-window=down:3:wrap --height 60%"
  backend = "fzf"

  # Sortierung nach Häufigkeit
  sortby = "frequency"
```

### 6. **Snippet-Hotkeys in tmux**
```bash
# ~/.tmux.conf
# Prefix + p → pet search
bind-key p run-shell "tmux send-keys -t #{pane_id} '$(pet search)'"

# Prefix + P → pet new
bind-key P run-shell "tmux split-window -v 'pet new && read'"
```

### 7. **Snippet-Generator-Funktion**
```bash
# ~/.bashrc
function snippet-from-history() {
  local last_cmd=$(fc -ln -1)
  echo "Last command: $last_cmd"
  read -p "Description: " desc
  read -p "Tags (comma-separated): " tags
  pet new --command "$last_cmd" --description "$desc" --tag "$tags"
}
alias sfh='snippet-from-history'
```

### 8. **Snippet-Backup-Rotation**
```bash
#!/bin/bash
# backup_snippets.sh

BACKUP_DIR=~/Dropbox/pet-backups
mkdir -p $BACKUP_DIR

# Keep last 10 backups
ls -t $BACKUP_DIR/snippet-*.toml | tail -n +11 | xargs rm -f

# Create new backup
cp ~/.config/pet/snippet.toml $BACKUP_DIR/snippet-$(date +%Y%m%d).toml

echo "✓ Backup created: $BACKUP_DIR/snippet-$(date +%Y%m%d).toml"
```

### 9. **Snippet-Stats**
```bash
#!/bin/bash
# snippet_stats.sh

echo "=== Pet Snippet Statistics ==="
echo
echo "Total Snippets: $(grep -c '^\[\[snippets\]\]' ~/.config/pet/snippet.toml)"
echo
echo "Top 5 Tags:"
grep 'tag = ' ~/.config/pet/snippet.toml | \
  sed 's/.*tag = \[//;s/\]//' | \
  tr ',' '\n' | \
  tr -d ' "' | \
  sort | uniq -c | sort -rn | head -5
```

### 10. **Integration mit VS Code**
```json
// .vscode/settings.json
{
  "terminal.integrated.shellIntegration.enabled": true,
  "terminal.integrated.commandsToSkipShell": [
    "pet.search"
  ],
  "keybindings": [
    {
      "key": "ctrl+shift+s",
      "command": "workbench.action.terminal.sendSequence",
      "args": { "text": "pet search\n" }
    }
  ]
}
```

---

## Zusammenfassung

**pet** ist ein einfaches, aber leistungsstarkes Command-Line Snippet-Management-Tool für das Speichern, Organisieren und Abrufen von häufig genutzten Befehlen und Code-Snippets mit interaktiver Suche und Tag-System.

### Key-Takeaways:

1. **Snippet-Verwaltung**: Commands mit Beschreibungen und Tags speichern
2. **Interaktive Suche**: Fuzzy-Search mit fzf/peco
3. **Variablen-Support**: Parametrisierte Commands mit `<variable>`
4. **Sync**: Git/Gist/GitLab für Team-Sharing und Backup
5. **Shell-Integration**: Hotkeys für schnellen Zugriff (Ctrl+S)

### Wann pet nutzen:

- ✓ **Komplexe Commands**: Docker, K8s, Git, SSH mit vielen Optionen
- ✓ **Team-Knowledge**: Befehle dokumentieren und teilen
- ✓ **Parametrisierte Commands**: Wiederverwendbare Befehle mit Variablen
- ✓ **Produktivität**: Weniger Zeit mit Command-Suche
- ✓ **Cross-Machine**: Snippets über Rechner hinweg synchronisieren

### Vorteile gegenüber `history | grep`:

- **Dokumentation**: Beschreibungen und Tags
- **Organisation**: Tag-basierte Kategorisierung
- **Variablen**: Parametrisierte Commands
- **Sync**: Cloud-Backup und Team-Sharing
- **Fuzzy-Search**: Schnellere Suche mit fzf

### Best Practice:

1. **Installation**: Via Homebrew oder Go
2. **Konfiguration**: fzf als Backend, vim als Editor
3. **Shell-Integration**: Ctrl+S für pet search, pp für pet prev
4. **Tag-Strategie**: Konsistente, hierarchische Tags
5. **Variablen**: Für wiederverwendbare Commands mit Parametern
6. **Sync**: Git-Repo für Backup und Team-Sharing
7. **Integration**: Mit Claude Code für intelligente Snippet-Generierung

**Next Steps**: Installiere pet, füge erste Snippets hinzu, richte Shell-Integration ein, und nutze Claude für automatische Snippet-Generierung!
