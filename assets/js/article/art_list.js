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
            curr: q.cate_id
        })
    }

})