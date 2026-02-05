# Ubuntu 24.x Pro Personal + GT 730 Safe Setup

আপনার মেশিন (Ubuntu 24.04 Pro Personal, i5-4590, 8GB RAM, NVIDIA GT 730) অনুযায়ী script এখন **safe-default** ভাবে তৈরি করা হয়েছে।

## Final Command File

- `ubuntu24-pro-dev-setup.sh`

## Run

```bash
chmod +x ubuntu24-pro-dev-setup.sh
./ubuntu24-pro-dev-setup.sh
```

## Why this version is safer for your PC

- 8GB RAM friendly defaults (heavy AI package by default install করে না)
- NVIDIA GT 730-এর জন্য legacy-friendly driver path (`nvidia-driver-470`)
- Cloud/repo/snap installs-এ fail-safe warnings
- Docker group check bug fix + post-setup reboot guidance
- Ubuntu Pro status hint included

## Optional flags

```bash
# Heavy AI packages চাইলে
INSTALL_HEAVY_AI=1 ./ubuntu24-pro-dev-setup.sh

# Security tools (Burp/ZAP/Hashcat etc.) চাইলে
INSTALL_SECURITY_TOOLS=1 ./ubuntu24-pro-dev-setup.sh

# Flatpak চাইলে
INSTALL_FLATPAK=1 ./ubuntu24-pro-dev-setup.sh
```

## After install (important)

```bash
reboot
```

তারপর টার্মিনালে:

```bash
docker run hello-world
nvidia-smi
```

যদি Ubuntu Pro attach না করা থাকে:

```bash
sudo pro attach <YOUR_TOKEN>
```
