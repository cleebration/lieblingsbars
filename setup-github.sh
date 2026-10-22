#!/bin/bash
# ============================================================
# Lieblingsbars → GitHub Setup-Skript
# Einmal ausführen: sh ~/Desktop/setup-github.sh
# ============================================================

set -e
cd ~/Projekte/lieblingsbars

echo ""
echo "🍺  Lieblingsbars → GitHub Setup"
echo "================================="
echo ""

# 1. gh installieren (via Homebrew)
if ! command -v gh &> /dev/null; then
  echo "📦 Installiere GitHub CLI (gh) via Homebrew..."
  brew install gh
else
  echo "✅ gh bereits installiert: $(gh --version | head -1)"
fi

# 2. GitHub Login
echo ""
echo "🔐 GitHub Login (Browser öffnet sich)..."
gh auth login --web --hostname github.com

# 3. Repo erstellen und pushen
echo ""
echo "🚀 Erstelle GitHub Repo 'lieblingsbars' und pushe..."
gh repo create lieblingsbars \
  --public \
  --description "299 fiktive Bars – jede benannt nach einem deutschen Adjektiv auf -bar" \
  --source=. \
  --remote=origin \
  --push

echo ""
echo "✅ Fertig! Dein Repo ist live:"
gh repo view --web
