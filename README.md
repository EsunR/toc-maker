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

var toc = new Toc(document.getElementsByClassName('post')[0], options)
document.querySelector("#toc").append(toc.dom)
```

# options

**nullTitle: string**

父级标题为空时，父级标题显示的内容，默认为空，档设置文字时会被解析为文字内容，如：

```
## 二级标题
## 二级标题
#### 四级标题
```

会被解析为：

```html

```


```
- 空标题
  - 二级标题
  - 二级标题
  - 空标题
    - 四级标题
```

