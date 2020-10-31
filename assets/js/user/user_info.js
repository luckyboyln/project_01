$(function () {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1 ~ 6之间'
            }
        }
    })

    initUserInfo()
    //初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                // console.log(res);
                //调用from.val()为表单快速赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    //表单的重置事件
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        initUserInfo()
    })

    //监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('修改用户信息失败了噢');
                }
                layer.msg('修改用户信息成功了噢!');

                //调用父页面中的方法重新渲染用户的昵称与头像
                window.parent.getUserInfo();
            }
        })
    })
})