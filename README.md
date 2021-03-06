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

### anch:Boolean

> default: true

是否自动为 HTML 添加锚点

### href:Boolean

> default: true

是否为生成的目录生成 href 属性，自动生成 href 会改写url，这一点对 SPA 应用很不友好，可以选择手动关闭该选项。依据生成的 `<a>` 标签的 `data-header` 属性也可以追踪到对应的标题 id。

### autoCompletion:Boolean

> default: true

是否严格补全header级别

### deep:Number

> default: 6 (max)

目录可显示的深度
