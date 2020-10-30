$(function () {


    //调用getUserInfo函数获取用户的基本信息
    getUserInfo();
})


//获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        //headers就是请求头的配置对象
        headers: {
            Authorization: localStorage.getItem('token') || ''
        },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }

            //调用渲染用户头像函数
            renderAvatar(res.data);
        }
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