$(function () {
    var layer = layui.layer
    var form = layui.form
    initCate();
    // 初始化富文本编辑器
    initEditor()

    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                var strHtml = template('tpl-table', res)
                $('[name=cate_id]').html(strHtml)
                form.render()
            }
        })
    }


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 为选封面的按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    // 监听coverFile的change事件，并获得用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        var files = e.target.files
        if (files.length === 0) {
            return
        }

        // 拿到用户选择的文件
        var file = e.target.files[0]
        // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file)
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义一个变量， 承接文章的状态
    var art_statu = '已发布'

    // 为存为草稿按钮绑定事件
    $('#artSave2').on('click', function () {
        art_statu = '草稿'
    })

    // 监听form表单的submit事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()

        // 创建formData对象, 把JQ对象转换为原生dom对象
        var fd = new FormData($(this)[0])
        // 将文章的状态存到fd中
        fd.append('state', art_statu)

        // 将封面图片存为文件再添加到fd中
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作、
                fd.append('cover_img', blob)

                // 最后发起Ajax请求, 提交表单数据
                publishArticle(fd)
            })
    })

    // 定义一个发表文章Ajax的请求函数方法
    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            //发送formDate格式的数据，不许添加这两项配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                location.href = '/article/art_list.html'
            }

        })
    }
})