/**
 * 目标1：渲染图书列表
 *  1.1 获取数据
 *  1.2 渲染数据
 */

const creator = "laolicina";

// 1.1 获取数据： 封装数据渲染的函数，便于多次调用
function getBookList() {
  // 使用axio从服务端获取数据
  axios({
    url: "http://hmajax.itheima.net/api/books",
    params: {
      creator,
    },
  }).then((res) => {
    // console.log(res.data.data);
    const booklist = res.data.data;
    // console.log(booklist);
    // 把数据渲染到页面,映射数据使用map方法
    const htmlStr = booklist
      .map((item, index) => {
        const { id, bookname, author, publisher } = item;
        return `
      <tr>
          <td>${index + 1}</td>
          <td>${bookname}</td>
          <td>${author}</td>
          <td>${publisher}</td>
          <td data-id=${id}>
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
// 1.2 渲染数据:调用渲染的函数，页面初始，渲染1次
getBookList();

/**
 * 目标2：添加图书列表
 *  2.1 添加弹框的显示和隐藏
 *  2.2 点击保存按钮，写入数据到服务器
 *  2.3 刷新页面
 */
// 2.1 添加弹框的显示和隐藏
/* 
2.1.1 显示弹窗的功能已经通过css样式实现：通过添加bootstrap自定义属性.
显示：data-bs-toggle="modal"和data-bs-target=".add-moda；
隐藏（关闭）： data-bs-dismiss='modal'
 */
// 2.1.2 点击保存按钮时，隐藏弹框，使用js来实现
// 创建modal对象，并调用hide方法
const addDom = document.querySelector(".add-modal");
const addModal = new bootstrap.Modal(addDom);

// 2.2 点击保存按钮，写入数据到服务器
document.querySelector(".add-btn").addEventListener("click", () => {
  // console.log(11);
  // 批量获取表单数据
  const addForm = document.querySelector(".add-form");
  const bookObj = serialize(addForm, { hash: true, empty: true });
  // console.log(bookObj);
  // 使用axios添加数据到服务器
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
      // 刷新页面
      getBookList();
      // 重置表单（清空表单中上一次提交的数据）
      addForm.reset();
      // 隐藏弹框
      addModal.hide();
    })
    .catch((err) => {
      console.log(err);
    });
});

/**
 * 目标3：删除图书列表
 *  3.1 点击删除元素，获取当前列表的id
 *  3.2 从服务器中删除数据
 *  3.3 刷新页面
 */

// 3.1 点击删除元素，获取当前列表的id
// 注册事件：事件委托
document.querySelector(".list").addEventListener("click", (e) => {
  // console.log(e);
  // 判断获取删除元素
  if (e.target.classList.contains("del")) {
    // console.log(11);
    // 获取当前列表的id: 给当前删除元素的父元素添加自定义属性data-id: 将服务器数据中的id绑定到自定义属性中，然后通过获取自定义属性中id的值来关联到数据中的id
    /* 
     <td data-id=${id}>
      <span class="del">删除</span>
      <span class="edit">编辑</span>
    </td>
     */

    const theId = e.target.parentNode.dataset.id;
    // console.log(theId);

    // 3.2 从服务器中删除数据
    axios({
      url: `http://hmajax.itheima.net/api/books/${theId}`,
      method: "DELETE",
    })
      .then((res) => {
        // console.log(res);
        // 3.3 刷新页面
        getBookList();
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

/**
 * 目标 4：编辑图书列表
 *  4.1 点击编辑元素，处理编辑弹框的显示和隐藏
 *  4.2 在弹框中显示当前列表的数据
 *  4.3 服务器中更新编辑后的表单数据
 *  4.4 刷新页面
 */

// 4.1 点击编辑元素，处理编辑弹框的显示和隐藏
const editDom = document.querySelector(".edit-modal");
const editModal = new bootstrap.Modal(editDom);

// 注册事件：事件委托
document.querySelector(".list").addEventListener("click", (e) => {
  // console.log(111);
  // 判断获取编辑元素
  if (e.target.classList.contains("edit")) {
    // console.log(11);
    // 显示弹框
    editModal.show();
    // 获取当前列表的id
    const theId = e.target.parentNode.dataset.id;
    // 获取当前列表在服务器中的数据
    axios({
      url: `http://hmajax.itheima.net/api/books/${theId}`,
    }).then((res) => {
      // console.log(res.data.data);
      // 4.2 在弹框中显示当前列表的数据
      const bookObj = res.data.data;
      // document.querySelector(".edit-form [name=bookname]").value =
      //   bookObj.bookname;
      // document.querySelector(".edit-form [name=author]").value = bookObj.author;
      // document.querySelector(".edit-form [name=publisher]").value =
      //   bookObj.publisher;
      const lists = Object.keys(bookObj);
      // console.log(lists);
      lists.forEach((list) => {
        document.querySelector(`.edit-form [name=${list}]`).value =
          bookObj[list];
      });
    });
  }
});

// 4.3 服务器中更新编辑后的表单数据
// 注册事件：点击修改按钮
document
  .querySelector(".edit-modal .edit-btn")
  .addEventListener("click", () => {
    // 批量获取表单数据
    const editForm = document.querySelector(".edit-modal .edit-form");
    const bookObj = serialize(editForm, { hash: true, empty: true });
    // console.log(bookObj);
    // 4.3 服务器中更新编辑后的表单数据
    axios({
      url: `http://hmajax.itheima.net/api/books/${bookObj.id}`,
      method: "PUT",
      data: {
        ...bookObj,
        creator,
      },
    })
      .then((res) => {
        // console.log(res);
        // 隐藏弹框
        editModal.hide();
        // 4.4 刷新页面
        getBookList();
      })
      .catch((err) => {
        console.log(err);
      });
  });
