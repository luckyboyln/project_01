$(function () {


    //调用getUserInfo函数获取用户的基本信息
    getUserInfo();
    var layer = layui.layer
    //实现点击退出按钮功能
    $('#btnLogout').on('click', function () {
        layer.confirm('确定要离开了嘛?', {
            icon: 5,
            title: '提示'
        }, function (index) {
            //do something
            //1.清空本地的token
            localStorage.removeItem('token')
            //2.退出到登录login页面
            location.href = '/login.html'
            //关闭confirm窗口
            layer.close(index);
        });
    })
})


//获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        //headers就是请求头的配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            //调用渲染用户头像函数
            renderAvatar(res.data);
        }
        // 无论成功还是失败都会执行的complete函数
        // complete: function (res) {
        //     // console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         //1.强制清空token
        //         localStorage.removeItem('token')
        //         //强制退出到登录页面
        //         location.href = '/login.html'
        //     }
        // }

    })
}

//渲染用户头像函数
function renderAvatar(user) {
    // 获取用户的名称
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    //按需求渲染头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show().siblings('.text-avatar').hide();
    } else {
        var first = name[0].toUpperCase();
        $('.layui-nav-img').hide().siblings('.text-avatar').html(first).show();
    }
}