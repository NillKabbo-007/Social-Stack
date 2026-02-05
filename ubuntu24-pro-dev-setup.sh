#!/usr/bin/env bash
set -Eeuo pipefail

# Ubuntu 24.04/24.10 Pro Developer Setup Script (Hardware-aware)
# Target: Older desktop class machines (e.g. i5-4590, 8GB RAM), optional NVIDIA GT 730
#
# Usage:
#   chmod +x ubuntu24-pro-dev-setup.sh
#   ./ubuntu24-pro-dev-setup.sh
#
# Optional environment flags:
#   INSTALL_HEAVY_AI=1        # install heavy ML packages (NOT recommended on 8GB RAM by default)
#   INSTALL_SECURITY_TOOLS=1  # install offensive security tools
#   INSTALL_FLATPAK=1         # install flatpak runtime

if [[ ${EUID:-$(id -u)} -eq 0 ]]; then
  echo "Run this script as a normal sudo user, not root."
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive

# ---------- logging ----------
log()  { printf '\n\033[1;34m[INFO]\033[0m %s\n' "$*"; }
ok()   { printf '\033[1;32m[OK]\033[0m %s\n' "$*"; }
warn() { printf '\n\033[1;33m[WARN]\033[0m %s\n' "$*"; }
err()  { printf '\n\033[1;31m[ERR ]\033[0m %s\n' "$*"; }

trap 'err "Line $LINENO failed. Command: $BASH_COMMAND"' ERR

have_cmd() { command -v "$1" >/dev/null 2>&1; }

safe_apt_install() {
  local pkg
  for pkg in "$@"; do
    if dpkg -s "$pkg" >/dev/null 2>&1; then
      ok "$pkg already installed"
    else
      sudo apt-get install -y "$pkg" || warn "Failed to install apt package: $pkg"
    fi
  done
}

safe_snap_install() {
  local name="$1" mode="${2:-strict}"

  if ! have_cmd snap; then
    warn "snap is not installed, skipping snap package: $name"
    return
  fi

  if snap list "$name" >/dev/null 2>&1; then
    ok "snap $name already installed"
    return
  fi

  if [[ "$mode" == "classic" ]]; then
    sudo snap install "$name" --classic || warn "Failed to install snap: $name"
  else
    sudo snap install "$name" || warn "Failed to install snap: $name"
  fi
}

apt_update_once() {
  log "Refreshing apt metadata"
  sudo apt-get update
}

install_base() {
  log "Installing base dependencies"
  apt_update_once
  sudo apt-get upgrade -y

  safe_apt_install \
    curl wget git unzip zip build-essential software-properties-common \
    apt-transport-https ca-certificates gnupg lsb-release \
    jq yq make cmake pkg-config
}

# ---------- repo setup ----------
setup_vscode_repo() {
  log "Configuring VS Code repo"
  sudo install -d -m 0755 /etc/apt/keyrings
  curl -fsSL https://packages.microsoft.com/keys/microsoft.asc \
    | gpg --dearmor | sudo tee /etc/apt/keyrings/packages.microsoft.gpg >/dev/null
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" \
    | sudo tee /etc/apt/sources.list.d/vscode.list >/dev/null
}

setup_docker_repo() {
  log "Configuring Docker repo"
  sudo install -d -m 0755 /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
    | gpg --dearmor | sudo tee /etc/apt/keyrings/docker.gpg >/dev/null
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
    | sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
}

setup_hashicorp_repo() {
  log "Configuring HashiCorp repo"
  sudo install -d -m 0755 /etc/apt/keyrings
  curl -fsSL https://apt.releases.hashicorp.com/gpg \
    | gpg --dearmor | sudo tee /etc/apt/keyrings/hashicorp.gpg >/dev/null
  echo "deb [signed-by=/etc/apt/keyrings/hashicorp.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" \
    | sudo tee /etc/apt/sources.list.d/hashicorp.list >/dev/null
}

setup_gcloud_repo() {
  log "Configuring Google Cloud SDK repo"
  sudo install -d -m 0755 /etc/apt/keyrings
  curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg \
    | gpg --dearmor | sudo tee /etc/apt/keyrings/google-cloud.gpg >/dev/null
  echo "deb [signed-by=/etc/apt/keyrings/google-cloud.gpg] https://packages.cloud.google.com/apt cloud-sdk main" \
    | sudo tee /etc/apt/sources.list.d/google-cloud-sdk.list >/dev/null
}

setup_nodesource_repo() {
  log "Configuring NodeSource LTS repo"
  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
}

setup_azure_repo() {
  log "Configuring Azure CLI repo"
  curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash || warn "Azure repo setup failed"
}

# ---------- hardware / OS specific ----------
show_system_summary() {
  log "Detected system summary"
  echo "CPU: $(lscpu | awk -F: '/Model name/ {gsub(/^ +/,"",$2); print $2; exit}')"
  echo "RAM: $(free -h | awk '/Mem:/ {print $2}')"
  echo "OS:  $(. /etc/os-release && echo "$PRETTY_NAME")"
}

setup_ubuntu_pro_hint() {
  log "Ubuntu Pro check"
  if have_cmd pro; then
    if pro status >/tmp/pro-status.log 2>&1; then
      ok "Ubuntu Pro CLI available"
      if ! grep -qi "attached" /tmp/pro-status.log; then
        warn "Ubuntu Pro may not be attached. If needed, run: sudo pro attach <TOKEN>"
      fi
    else
      warn "Could not read Ubuntu Pro status"
    fi
  else
    warn "pro CLI not found. Install with: sudo apt install ubuntu-advantage-tools"
  fi
}

install_nvidia_gt730_safe() {
  log "NVIDIA check (GT 730 safe path)"

  if ! lspci | grep -Ei 'VGA|3D' | grep -qi nvidia; then
    ok "No NVIDIA GPU detected, skipping NVIDIA driver section"
    return
  fi

  warn "Detected NVIDIA GPU. For GT 730, 470-series driver is usually the stable choice."
  safe_apt_install ubuntu-drivers-common

  # Prefer pinned legacy branch for GT 730 compatibility on Ubuntu 24.x.
  safe_apt_install nvidia-driver-470

  # helpful utilities
  safe_apt_install nvidia-settings

  warn "Reboot is required after NVIDIA driver install."
}

# ---------- installation groups ----------
install_essentials() {
  log "Installing essential daily tools"

  setup_vscode_repo
  setup_docker_repo
  setup_hashicorp_repo
  setup_gcloud_repo
  setup_nodesource_repo

  apt_update_once

  safe_apt_install \
    code docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin \
    nodejs npm python3 python3-pip python3-venv pipx postgresql postgresql-contrib \
    neovim zsh redis-tools mysql-client nginx httpie podman \
    tmux screen fzf ripgrep bat zoxide htop \
    wireshark tcpdump apache2 caddy certbot \
    python3-certbot-nginx python3-certbot-apache ansible terraform

  # kubectl + helm are more reliable via snap/script than distro apt variants
  safe_snap_install kubectl classic
  if ! have_cmd helm; then
    curl -fsSL https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash || warn "Helm installation failed"
  fi

  # Chrome
  if ! have_cmd google-chrome; then
    log "Installing Google Chrome"
    wget -q -O /tmp/google-chrome.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb || true
    if [[ -f /tmp/google-chrome.deb ]]; then
      sudo apt-get install -y /tmp/google-chrome.deb || warn "Google Chrome install failed"
    fi
  fi

  # Docker non-root usage
  if ! id -nG "$USER" | grep -qw docker; then
    sudo usermod -aG docker "$USER" || warn "Could not add user to docker group"
  else
    ok "User already in docker group"
  fi

  # Zsh default shell
  if have_cmd zsh; then
    if [[ "${SHELL:-}" != "$(command -v zsh)" ]]; then
      chsh -s "$(command -v zsh)" "$USER" || warn "Could not change default shell to zsh"
    fi
  fi
}

install_snap_tools() {
  log "Installing snap-based apps"
  safe_snap_install postman
  safe_snap_install mongosh
  safe_snap_install dbeaver-ce
  safe_snap_install redisinsight
  safe_snap_install mongodb-compass
  safe_snap_install drawio
  safe_snap_install obsidian classic
  safe_snap_install joplin-desktop
  safe_snap_install android-studio classic
  safe_snap_install flutter classic
  safe_snap_install blender classic
  safe_snap_install gimp
  safe_snap_install inkscape
}

install_cloud_clis() {
  log "Installing cloud CLIs"
  setup_azure_repo
  apt_update_once
  safe_apt_install azure-cli google-cloud-cli

  if ! have_cmd aws; then
    curl -fsSL "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o /tmp/awscliv2.zip || warn "AWS CLI download failed"
    if [[ -f /tmp/awscliv2.zip ]]; then
      rm -rf /tmp/aws
      unzip -q /tmp/awscliv2.zip -d /tmp && sudo /tmp/aws/install --update || warn "AWS CLI install failed"
    fi
  fi
}

install_lang_tooling() {
  log "Installing language tooling"

  npm install -g npm@latest || warn "npm self-update failed"
  npm install -g \
    yarn pnpm typescript ts-node eslint prettier vite webpack webpack-cli \
    pm2 express-generator jest mocha react-native-cli expo-cli \
    lighthouse create-docusaurus

  # Cypress can fail on low-memory and missing system libs; keep non-fatal
  npm install -g cypress || warn "Cypress install failed (often expected on minimal systems)"

  python3 -m pip install --upgrade pip setuptools wheel
  python3 -m pip install --user fastapi uvicorn selenium jupyter numpy pandas scikit-learn opencv-python

  if [[ "${INSTALL_HEAVY_AI:-0}" == "1" ]]; then
    warn "Installing heavy AI packages (can be slow/heavy on 8GB RAM)"
    python3 -m pip install --user tensorflow torch torchvision torchaudio || warn "Some heavy AI packages failed"
  else
    warn "Skipping heavy AI packages by default. Use INSTALL_HEAVY_AI=1 to enable."
  fi

  if ! have_cmd composer; then
    safe_apt_install php-cli
    curl -fsSL https://getcomposer.org/installer -o /tmp/composer-setup.php
    php /tmp/composer-setup.php --quiet --install-dir=/tmp --filename=composer
    sudo mv /tmp/composer /usr/local/bin/composer
  fi
}

install_gui_db_tools() {
  log "Installing database GUI tools"

  sudo install -d -m 0755 /etc/apt/keyrings
  curl -fsSL https://www.pgadmin.org/static/packages_pgadmin_org.pub \
    | gpg --dearmor | sudo tee /etc/apt/keyrings/pgadmin.gpg >/dev/null
  echo "deb [signed-by=/etc/apt/keyrings/pgadmin.gpg] https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" \
    | sudo tee /etc/apt/sources.list.d/pgadmin4.list >/dev/null

  apt_update_once
  safe_apt_install pgadmin4 mysql-workbench
}

install_security_tools_optional() {
  if [[ "${INSTALL_SECURITY_TOOLS:-0}" != "1" ]]; then
    warn "Skipping offensive security tools by default. Set INSTALL_SECURITY_TOOLS=1 to enable."
    return
  fi

  log "Installing security tools"
  safe_apt_install nmap wireshark john hashcat
  safe_snap_install burpsuite
  safe_snap_install zaproxy classic
}

install_productivity_extras() {
  log "Installing extra productivity tools"
  safe_apt_install fd-find btop lazygit tree silversearcher-ag
}

install_vscode_extensions() {
  log "Installing VS Code extensions"
  if ! have_cmd code; then
    warn "code command not found, skipping VS Code extensions"
    return
  fi

  code --install-extension dbaeumer.vscode-eslint || true
  code --install-extension esbenp.prettier-vscode || true
  code --install-extension bradlc.vscode-tailwindcss || true
  code --install-extension bierner.markdown-mermaid || true
}

install_flatpak_optional() {
  if [[ "${INSTALL_FLATPAK:-0}" == "1" ]]; then
    safe_apt_install flatpak
  fi
}

verify_installation() {
  log "Running verification checks"
  local checks=(
    "git --version"
    "node --version"
    "npm --version"
    "python3 --version"
    "pip3 --version"
    "docker --version"
    "docker compose version"
    "psql --version"
    "code --version"
    "nvim --version | head -n 1"
    "kubectl version --client"
    "helm version"
    "terraform version"
    "aws --version"
    "az version"
    "gcloud version"
    "composer --version"
    "pm2 --version"
    "nvidia-smi"
  )

  for cmd in "${checks[@]}"; do
    if bash -lc "$cmd" >/tmp/setup-check.log 2>&1; then
      ok "$cmd"
    else
      warn "$cmd failed: $(head -n 1 /tmp/setup-check.log)"
    fi
  done
}

print_next_steps() {
  cat <<'TXT'

Next steps:
1) Reboot to apply NVIDIA driver / docker group / shell changes.
2) Re-open terminal and test:
   docker run hello-world
   nvidia-smi
3) If Ubuntu Pro is not attached yet:
   sudo pro attach <YOUR_TOKEN>

TXT
}

main() {
  log "Starting Ubuntu 24.x pro developer setup"
  show_system_summary
  setup_ubuntu_pro_hint
  install_base
  install_essentials
  install_snap_tools
  install_cloud_clis
  install_lang_tooling
  install_gui_db_tools
  install_security_tools_optional
  install_productivity_extras
  install_vscode_extensions
  install_flatpak_optional
  install_nvidia_gt730_safe
  verify_installation
  print_next_steps

  ok "Setup completed with safe defaults."
}

main "$@"
