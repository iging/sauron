---
name: ebpf-kernel-telemetry
description: Low-overhead Linux kernel network tracing, syscall monitoring, and runtime observability via eBPF instrumentation.
department: devops
ownerAgent: pippin
triggerCommand: /ebpf-kernel-telemetry
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
  - AP-26
---

# eBPF Kernel Telemetry

## 0. Identity

- **Role:** Systems Telemetry & Observability Engineer. Traces kernel syscalls, network socket lifecycles, and CPU profiling using eBPF programs.
- **Authority:** Normative specification under `skills/devops/ebpf-kernel-telemetry/`.
- **Must not define:** Application UI display components.
- **Normative base:** `core/fellowship/pippin.md`, `rules/engineering/architecture-boundaries.md`, `rules/common/code-style-standards.md`, `references/anti-patterns.md`.

## 1. Intent (9 Dimensions)

| #   | Dimension        | Value                                                                                       |
| --- | ---------------- | ------------------------------------------------------------------------------------------- |
| 1   | Task             | Deploy high-frequency, low-overhead kernel telemetry probes using safe eBPF bytecode.       |
| 2   | Target Tool      | Linux BPF, Cilium, Tetragon, bpftrace, BCC, libbpf.                                         |
| 3   | Output Format    | C eBPF kernel probes, userspace Go/Rust loaders, OpenTelemetry metrics.                     |
| 4   | Constraints      | All programs must pass Linux BPF verifier. Zero memory allocations in kernel probe context. |
| 5   | Input            | Performance profiling targets, latency metrics, security audit requirements.                |
| 6   | Context          | Prevents production overhead while delivering kernel-level observability for microservices. |
| 7   | Audience         | SREs, kernel engineers, and infrastructure performance teams.                               |
| 8   | Success Criteria | Verifier verification pass on target kernels, sub-1% CPU runtime overhead.                  |
| 9   | Examples         | See Section 5.                                                                              |

## 2. Kernel Instrumentation Directives

1. **Zero User-Space Overhead:** Offload packet filtering and socket tracking directly to kernel verifier-approved bytecode.
2. **Ring Buffer Streaming:** Stream event telemetry via high-performance BPF ring buffers rather than legacy perf event arrays.
3. **Safety Verification:** Ensure all loops are bounded and memory pointers validated to satisfy the Linux kernel BPF verifier.
4. **CO-RE Portability:** Compile with Compile Once - Run Everywhere (CO-RE) using BTF (BPF Type Format) enabled kernels.

## 3. Reference eBPF Probe

```c
#include <vmlinux.h>
#include <bpf/bpf_helpers.h>
#include <bpf/bpf_tracing.h>

struct event_t {
  u32 pid;
  char comm[16];
  u64 duration_ns;
};

struct {
  __uint(type, BPF_MAP_TYPE_RINGBUF);
  __uint(max_entries, 256 * 1024);
} events SEC(".maps");

SEC("kprobe/sys_enter_connect")
int BPF_KPROBE(trace_connect_entry) {
  struct event_t *event;
  event = bpf_ringbuf_reserve(&events, sizeof(*event), 0);
  if (!event) return 0;

  event->pid = bpf_get_current_pid_tgid() >> 32;
  bpf_get_current_comm(&event->comm, sizeof(event->comm));
  bpf_ringbuf_submit(event, 0);
  return 0;
}

char LICENSE[] SEC("license") = "GPL";
```
