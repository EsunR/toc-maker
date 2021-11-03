# 说明

![toc-maker](http://img.cdn.esunr.xyz/markdown/20191115145233.png)

toc-maker 可以帮你生成文章目录用于你的博客、wiki、文章阅读项目中

# 安装

```sh
$ npm install toc-maker
```

# 使用

```js
import Toc from 'toc-maker';

let options = {
  nullTitle: "空标题"
}

var toc = new Toc(document.querySelector("#post"), options)
document.querySelector("#toc").append(toc.tocEl)
```

# options

### nullTitle:String

> default： ""

父级标题为空时，父级标题显示的内容，默认为空，当设置文字时会被解析为文字内容，如：

```
## 二级标题
## 二级标题
#### 四级标题
```

会被解析为：

```html
<ul>
  <li>
    <a href="#空标题">空标题</a>
    <ul>
      <li>
        <a href="#二级标题">二级标题</a>
      </li>
      <li>
        <a href="#二级标题">二级标题</a>
        <ul>
          <li>
            <a href="#空标题">空标题</a>
            <ul>
              <li>
                <a href="#四级标题">四级标题</a>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </li>
</ul>
```

效果为：

```
- 空标题
  - 二级标题
  - 二级标题
  - 空标题
    - 四级标题
```

### autoCompletion:Boolean

> default: true

是否严格补全 heading 级别，如果设置为 `false` 后，如果文章的标题顺序不正确，则无法渲染标题

### deep:Number

> default: 6 (max)

目录可显示的深度，最多仅在目录中显示到 H6

### scrollContainer:Element

> default: window

滚动元素的容器，如果没有正确设置，跳转与平滑效果会失效

### hashMode:Boolean

> default: true

是否启用路由 Hash，开启后会自动监听用户滚动到的文章位置，并将当前的文章标题写入路由 Hash；同时如果用户进入当前页面时，路由存在 Hash，会自动定位到标题位置。

但是如果你使用了 Hash 模式作为你 SPA 应用的路由路径（如 vue-router 的 Hash 模式），开启 hashMode 后会对你的路由造成影响，你可以选择关闭此选项。

### smoothScroll:Boolean

> default: true

是否启用平滑跳转

### tocActiveClass:String

> default: "toc-active"

当文章滚动到某一标题时，目录中对应的该项会被添加上该 class