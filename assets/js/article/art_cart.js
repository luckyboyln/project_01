$(function () {
    var layer = layui.layer
    var form = layui.form
    //获取文章分类列表并加以渲染
    initArticleList();

    function initArticleList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败了噢')
                }
                var strHtml = template('tpl-table', res)
                $('tbody').html(strHtml)

            }
        })
    }

    //给添加类别按钮绑定click事件，使用layer.open弹出层
    var closeAdd = null
    $('#btnAddCate').on('click', function () {
        closeAdd = layer.open({
            type: 1,
            skin: 'layui-layer-molv',
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dailog-add').html()
        });
    })

    //给动态添加上去得form-add表单代理submit事件
    //然后请求服务器，把数据提交上去再渲染页面
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $('#form-add').serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败了噢')
                }
                layer.msg('新增文章分类成功了噢！')
                //layer.close方法关闭弹出层
                layer.close(closeAdd)
                initArticleList();
            }
        })
    })


    //给编辑类别按钮绑定click事件，使用layer.open弹出层
    var closeEdit = null
    $('tbody').on('click', '.btnEdit', function () {
        closeEdit = layer.open({
            type: 1,
            skin: 'layui-layer-molv',
            area: ['500px', '250px'],
            title: '编辑文章分类',
            content: $('#dailog-edit').html()
        });

        //点击按钮获取对应数据得ID值(自定义属性得方法)
        var id = $(this).attr('data-id')
        // console.log(id);
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })

    //通过代理方式监听弹出层的submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败了')
                }
                layer.msg('更新分类信息成功了噢!')
                layer.close(closeEdit)
                initArticleList()
            }
        })
    })

    //
    $('tbody').on("click", '.btn-delete', function () {
        var id = $(this).attr("data-id")
        $.ajax({
            method: 'GET',
            url: '/my/article/deletecate/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('删除分类失败！')
                }
                layer.confirm('确认删除吗？？？', {
                    icon: 5,
                    title: '提示'
                }, function (index) {
                    //do something
                    layer.msg('删除成功了噢！')
                    initArticleList()
                    layer.close(index);
                });
            }
        })
    })
})