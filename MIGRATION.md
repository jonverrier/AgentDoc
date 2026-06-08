# Migration: C4-Diagrammer to AgentDoc

AgentDoc is the new name for the interactive MCP documentation server formerly published as `@jonverrier/c4-diagrammer` (repository: C4-Agent).

## Package and CLI

| Before | After |
|--------|-------|
| `@jonverrier/c4-diagrammer` | `@jonverrier/agent-doc` |
| `c4_diagrammer` CLI | `agent-doc` CLI (preferred) |
| — | `c4_diagrammer` CLI alias still available in v1.0.0 |
| MCP server key `C4-Agent` | MCP server key `AgentDoc` |

## Upgrade steps

1. Update `package.json`:

```json
{
  "devDependencies": {
    "@jonverrier/agent-doc": "^1.0.0"
  }
}
```

2. Update MCP host configuration:

```json
{
  "mcpServers": {
    "AgentDoc": {
      "command": "node",
      "args": ["path/to/agent-doc/dist/src/index.js", "YourCodeRoot"]
    }
  }
}
```

3. Prompts now refer to the **AgentDoc** tool name. Generated documentation filenames are unchanged for compatibility:

- `README.C4Diagrammer.md`
- `C4Component.C4Diagrammer.md`
- `C4Context.C4Diagrammer.md` / `C4Container.C4Diagrammer.md`

Existing repos with `*.C4Diagrammer.md` files continue to work without renaming artifacts.

## Compatibility decision (v1.0.0)

- **Branding:** MCP server name, package name, and prompt tool references use **AgentDoc**.
- **Filenames:** Generated doc suffix remains **C4Diagrammer** to avoid breaking existing documentation trees.
- **Future:** A later release may introduce `README.AgentDoc.md` style names with lookup compatibility for legacy files.

## Related

- [AutoDoc MIGRATION.md](../C4-Auto/MIGRATION.md) — automated CLI sibling rename.
- [AgentDoc README](README.md) — usage and prompts.
