# 博客字体修改说明

当前网站字体由下面两个文件控制：

- `_includes/metadata-hook.html`：把自定义字体样式引入网页。
- `assets/css/custom-font.css`：真正设置字体。

## 当前字体方案

网站会按顺序尝试这些字体：

1. 在线加载的 `Noto Sans SC` / `Noto Serif SC`；
2. 访客电脑本地已有的 `Microsoft YaHei`、`PingFang SC`、`Hiragino Sans GB` 等中文字体；
3. 系统默认字体。

所以即使在线字体加载失败，网页也不会“没字体”，只是会自动回退到本机字体。

## 想换字体时改哪里？

打开：

```text
assets/css/custom-font.css
```

主要改这三组变量：

```css
--dr-font-sans: 正文字体;
--dr-font-heading: 标题字体;
--dr-font-mono: 代码字体;
```

字体名字之间用英文逗号分隔，越靠前优先级越高。

## 想关闭在线字体

在 `assets/css/custom-font.css` 里找到这一行：

```css
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700&family=Noto+Serif+SC:wght@500;700&display=swap");
```

在前后加上注释：

```css
/* @import url("https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700&family=Noto+Serif+SC:wght@500;700&display=swap"); */
```

这样网站就只使用本地字体和系统字体，加载速度更稳定。

## 想完全恢复 Chirpy 默认字体

打开：

```text
_includes/metadata-hook.html
```

把这一行删除或注释掉：

```html
<link rel="stylesheet" href="{{ '/assets/css/custom-font.css' | relative_url }}">
```

保存后重新构建网站即可恢复主题默认字体。
