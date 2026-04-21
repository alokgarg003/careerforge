# Contributing to CareerForge

Thanks for your interest in contributing! Here's how you can help.

## Development Setup

```bash
git clone https://github.com/alokgarg003/careerforge.git
cd careerforge
bun install
cp .env.example .env
mkdir -p db && bun run db:push
bunx prisma db seed
bun run dev
```

## Code Standards

- TypeScript strict mode
- ESLint with Next.js config
- shadcn/ui components preferred
- Follow existing naming conventions

## Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `bun run lint` to check for errors
5. Open a Pull Request with a clear description
