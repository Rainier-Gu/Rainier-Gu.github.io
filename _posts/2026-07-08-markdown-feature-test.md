---
title: Markdown 功能测试
date: 2026-07-08 00:00:00 +0800
categories: [写作, 测试]
tags: [markdown, mermaid, code]
description: 验证代码块、引用、表格、图片和 Mermaid 图。
mermaid: true
pin: true
image:
  path: /assets/img/posts/research-writing-cover.svg
  alt: 蓝色渐变背景上的科研写作与数据图形
---

## 代码块

```python
def kinetic_energy(mass: float, velocity: float) -> float:
    """Return classical kinetic energy."""
    return 0.5 * mass * velocity**2
```

## 引用

> 清楚记录假设，往往比漂亮地写出结论更重要。

## 表格

| 量 | 符号 | SI 单位 |
| --- | --- | --- |
| 质量 | `m` | kg |
| 速度 | `v` | m/s |
| 能量 | `E` | J |

## 图片

![科研写作与数据可视化示例](/assets/img/posts/research-writing-cover.svg){: width="640" height="360" }
_图片资源统一保存在 `assets/img/posts/`。_

## Mermaid

```mermaid
flowchart LR
    A[提出问题] --> B[建立模型]
    B --> C[实验或计算]
    C --> D[分析结果]
    D --> E[记录与复现]
```
