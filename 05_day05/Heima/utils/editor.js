// 富文本编辑器
// 创建编辑器函数，创建工具栏函数

// 对象结构两个函数
const { createEditor, createToolbar } = window.wangEditor;

// 编辑器的配置对象
const editorConfig = {
  // 编辑器占位符
  placeholder: "请输入内容......",
  // 编辑器输入内容变化的回调
  onChange(editor) {
    const html = editor.getHtml();
    // console.log("editor content", html);
    // 也可以同步到 <textarea>
    document.querySelector(".publish-content").innerHTML = html;
  },
};

// 创建编辑器
const editor = createEditor({
  selector: "#editor-container",
  html: "<p><br></p>",
  config: editorConfig,
  mode: "default", // or 'simple'
});

// 编辑工具的配置对象
const toolbarConfig = {};

// 创建编辑工具
const toolbar = createToolbar({
  editor,
  selector: "#toolbar-container",
  config: toolbarConfig,
  mode: "default", // or 'simple'
});
