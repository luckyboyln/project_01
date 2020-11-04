$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    //定义一个查询参数对象
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: '' //文章发布的状态
    }
    initTable();
    initCate()
    //通过template.defaults.import格式化时间
    template.defaults.imports.dateFormat = function (data) {
        var df = new Date(data)

        var y = df.getFullYear()
        var m = padZero(df.getMonth() + 1)
        var d = padZero(df.getDate())

        var h = padZero(df.getHours())
        var mm = padZero(df.getMinutes())
        var s = padZero(df.getSeconds())

        return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s
    }

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //获取文章列表
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }

                //使用模板引擎渲染页面
                var strHtml = template('tpl-tabel', res)
                $('tbody').html(strHtml)

                renderPage(res.total);
            }
        })
    }

    //获取分类信息去渲染下拉框
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类信息失败！')
                }
                var strHtml = template('tpl-cate', res)
                $('[name=cate_id]').html(strHtml)
                form.render()
            }
        })
    }

    //监听筛选区得提交事件，然后根据用户输入的数据，再请求接口获取数据渲染页面
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        initTable();
    })

    //定义渲染分页的方法
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox' //注意，这里的pageBox是ID，不用加 # 号
                ,
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //自定义分页区域样式
            limits: [2, 3, 5, 10],
            //当分页发生切换时，就会触发jump回调函数
            jump: function (obj, first) {
                // console.log(obj.curr)
                //把最新的页码值传给q，再去发起请求获取数据渲染页面
                q.pagenum = obj.curr
                //把最新的页码条数传给q，再去发起请求获取数据渲染页面
                q.pagesize = obj.limit
                // initTable()  直接调用该方法会出现死循环
                //如何解决
                if (!first) {
                    //do something
                    initTable()
                }
            }
        })
    }

    // 通过代理的方式为动态添加的删除按钮绑定事件
    $('tbody').on('click', '.btn-delete', function () {
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        layer.confirm('确定删除吗?', {
            icon: 5,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')

                    if (len === 1) {
                        // 页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            //do something

            layer.close(index);
        });
    })

})