# Rust Marona A2A

This example uses the official [`marona`](https://crates.io/crates/marona)
Rust client from crates.io.

Start the deterministic flight peer:

```bash
cargo run -- server
```

Call it safely from a second terminal:

```bash
cargo run -- peer
```

The peer permits localhost HTTP for development, requires the
`travel.route.read` permission, and redacts the configured identity fields.
No local SDK path or Git dependency is required.
