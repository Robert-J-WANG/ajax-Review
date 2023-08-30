/**
 * 目标1：渲染图书列表
 *  1.1 获取数据
 *  1.2 渲染数据
 */

const creator = "lwang";
// 封装渲染函数
function getBooklists() {
  // 1.1 获取数据
  axios({
    url: "http://hmajax.itheima.net/api/books",
    params: { creator },
  }).then((res) => {
    // console.log(res);
    const booklists = res.data.data;
    // console.log(booklists);
    // 1.2 渲染数据 数组映射map
    const htmlStr = booklists
      .map((item, index) => {
        return `
      <tr>
          <td>${index + 1}</td>
          <td>${item.bookname}</td>
          <td>${item.author}</td>
          <td>${item.publisher}</td>
          <td data-id=${item.id}>
            <span class="del">删除</span>
            <span class="edit">编辑</span>
          </td>
        </tr>
      `;
      })
      .join("");

    document.querySelector(".list").innerHTML = htmlStr;
  });
}

// 页面初次加载，渲染数据creator
getBooklists();

/**
 * 目标2：新增图书列表
 *  2.1 新增弹框的显示和隐藏
 *  2.2 收集表达数据，并提交到服务器中
 *  2.3 刷新图书列表
 */

// 2.1 新增弹框的显示和隐藏
//  创建弹框对象, 用于设置显示和隐藏
const addModalDom = document.querySelector(".add-modal");
const addModal = new bootstrap.Modal(addModalDom);
// console.log(addModal);

// 点击保存按钮后，隐藏弹框
document.querySelector(".add-btn").addEventListener("click", () => {
  // 2.2 收集表达数据，并提交到服务器中
  // 获取表单对象
  const addForm = document.querySelector(".add-form");
  // 使用插件批量获取表单数据
  const bookObj = serialize(addForm, { hash: true, empty: true });
  // console.log(bookObj);
  // 把数据提交到服务器中
  axios({
    url: "http://hmajax.itheima.net/api/books",
    method: "POST",
    data: {
      ...bookObj,
      creator,
    },
  })
    .then((res) => {
      // console.log(res.data.data);
      getBooklists();
      addForm.reset(); // 重置表单
      addModal.hide(); //隐藏弹框
    })
    .catch((err) => {
      console.log(err);
    });
});

/**
 * 目标3：删除图书列表
 *  3.1 删除元素绑定点击事件->获取图书id
 *  3.2 调用删除接口
 *  3.3 刷新图书列表
 */

// 3.1 删除元素绑定点击事件->获取图书id
// 删除元素使动态生成的，所以采用事件委托给其父元素
document.querySelector(".list").addEventListener("click", (e) => {
  // console.log(11);
  // 只选择删除元素
  if (e.target.classList.contains("del")) {
    // console.log(111);
    // 获取图书id:给当前列表添加自定义属性
    const theId = e.target.parentNode.dataset.id;
    // console.log(theId);

    // 3.2 调用删除接口
    axios({
      url: `http://hmajax.itheima.net/api/books/${theId}`,
      method: "DELETE",
    }).then(() => {
      // 3.3 刷新图书列表
      getBooklists();
    });
  }
});

/**
 * 目标4：编辑图书列表
 *  4.1 编辑弹框-》显示和隐藏
 *  4.2 获取当前编辑图书的数据-》回显到编辑列表中
 *  4.3 提交保存修改，并刷新页面
 */
// 4.1 编辑弹框-》显示和隐藏
const editDom = document.querySelector(".edit-modal");
// 创建Modal对象
const editModal = new bootstrap.Modal(editDom);
// console.log(editModal);
// 注册点击事件
document.querySelector(".list").addEventListener("click", (e) => {
  // 选出编辑元素
  if (e.target.classList.contains("edit")) {
    // console.log(111);
    // 显示弹框
    editModal.show();
    // 4.2 获取当前编辑图书的数据-》回显到编辑列表中
    const theId = e.target.parentNode.dataset.id;
    // console.log(theId);
    axios({
      url: `http://hmajax.itheima.net/api/books/${theId}`,
    }).then((res) => {
      console.log(res.data.data);
      const bookObj = res.data.data;
      // 回显到编辑列表中
      // document.querySelector(".edit-form .bookname").value = bookObj.bookname;
      // document.querySelector(".edit-form .author").value = bookObj.author;
      // 遍历显示所有表单数据
      const keys = Object.keys(bookObj);
      // console.log(keys); //['id', 'bookname', 'author', 'publisher']
      keys.forEach((key) => {
        document.querySelector(`.edit-form .${key}`).value = bookObj[key];
      });
    });
  }
});

// 点击保存按钮，隐藏弹框
document.querySelector(".edit-btn").addEventListener("click", (e) => {
  // 4.3 提交保存修改，并刷新页面
  // 获取修改后的表单数据
  const editForm = document.querySelector(".edit-form");
  // 使用插件获取所以数据
  const { id, bookname, author, publisher } = serialize(editForm, {
    hash: true,
    empty: true,
  });
  // 提交数据
  axios({
    url: ` http://hmajax.itheima.net/api/books/${id}`,
    method: "PUT",
    data: {
      bookname,
      author,
      publisher,
      creator,
    },
  }).then((res) => {
    // console.log(res);
    // 修改成功后刷新页面
    getBooklists();
    editModal.hide();
  });
});
