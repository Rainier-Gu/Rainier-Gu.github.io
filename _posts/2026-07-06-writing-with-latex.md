---
title: 在文章中书写 LaTeX 公式
date: 2026-07-06 10:00:00 +0800
categories: [写作, 技术]
tags: [latex, math, markdown]
description: 用行内、行间和多行公式验证 Chirpy 的数学排版能力。
math: true
---

物理笔记常常需要公式。行内公式使用 `\(...\)`，例如质能关系 \(E=mc^2\)。

行间公式使用双美元符号包围：

$$
\nabla \cdot \mathbf{E} = \frac{\rho}{\varepsilon_0}
$$

多行推导可以使用 `aligned` 环境：

$$
\begin{aligned}
L &= T - V \\
\frac{d}{dt}\left(\frac{\partial L}{\partial \dot q_i}\right)
  - \frac{\partial L}{\partial q_i} &= 0
\end{aligned}
$$

为避免 Markdown 解析歧义，本站约定不使用单美元符号书写行内公式。
