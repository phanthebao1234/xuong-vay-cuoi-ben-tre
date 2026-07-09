# Xưởng Váy Cưới Bến Tre

Luxury editorial bridal fashion website for Bến Tre — wedding dresses, groom suits, áo dài cưới, rental inquiry and fitting appointments. Independent Next.js frontend consuming the shared FOXIE Studio backend API (read-only, public endpoints).

## Quick start

```bash
cp .env.example .env.local   # point NEXT_PUBLIC_API_URL at the shared backend
npm install
npm run dev                  # http://localhost:3100
```

## Documentation

Start with [CLAUDE.md](CLAUDE.md) (project handbook), then `docs/`:
[ARCHITECTURE](docs/ARCHITECTURE.md) · [API_INTEGRATION](docs/API_INTEGRATION.md) · [DESIGN_SYSTEM](docs/DESIGN_SYSTEM.md) · [HOMEPAGE_STRATEGY](docs/HOMEPAGE_STRATEGY.md) · [ROADMAP](docs/ROADMAP.md) · [PROJECT_STATUS](docs/PROJECT_STATUS.md)

Cross-project rules (FOXIE relationship): [`../WORKSPACE.md`](../WORKSPACE.md)

**Critical rule:** never modify FOXIE Studio (`D:\LEARN\foxie`) or the shared backend from this project without explicit authorization.
