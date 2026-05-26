---
"@evolonix/react-router-next": patch
---

Document the dev-only "descendant `<Routes>` … no trailing `*`" warning emitted by parallel-route (`@slot`) layouts. It's a benign false positive (the generated layout route keeps matching at deeper URLs via its path children), is absent from production builds, and should not be "fixed" with `/*`. Explained in the package README, CONTRIBUTING, and a source comment at `SlotElement`.
