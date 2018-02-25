$( document ).ready(function() {
    var deviceIdentifyNumber = null;
    var timer = null;

    var steps = [
        {
            title: 'Bước 1: Vào chế độ cài đặt',
            content: 'Bạn hãy ấn và giữ nút reset trên thiết bị để vào chế độ cài đặt.',
            action: function () {
            },
            buttonAction: function() {
                setStep(1);
            },
        },
        {
            title: 'Bước 2: Kết nối device wifi',
            content: 'Bạn hãy kết nối vào wifi có tên dạng <em>gara-xxx</em>',
            action: function () {
                var handleResponse = function (result) {
                    // {"identify_number":"gara-1","status":"ok"}
                    deviceIdentifyNumber = result.identify_number;
                    setStep(2);
                };
                timer = setInterval(function() {
                    $.ajax({
                        url: 'http://69.69.69.69/status',
                        type: 'GET',
                        contentType: 'application/json; charset=utf-8',
                        success: function(result){
                            console.log(result);
                            handleResponse(result);
                            if (timer) {
                                clearInterval(timer);
                            }
                        },
                        error: function(result) {
                            console.log('error');
                            console.log(result);
                            console.log(timer);
                        }
                    });
                }, 5000);
                $.ajax({
                    url: 'http://69.69.69.69/status',
                    type: 'GET',
                    contentType: 'application/json; charset=utf-8',
                    success: function(result){
                        console.log(result);
                        handleResponse(result);
                        if (timer) {
                            clearInterval(timer);
                        }
                    },
                    error: function(result) {
                        console.log('error');
                        console.log(result);
                        console.log(timer);
                    }
                });

                $('#button').off('click');
                $('#button').css('background-color', 'gray');
                $('#button').css('cursor', 'not-allowed');
            },
            buttonAction: function() {
                // if (timer) {
                //     clearInterval(timer);
                // }
                // setStep(2);
            },
        },
        {
            title: 'Bước 3: Nhập mật khẩu wifi',
            content: '',
            action: function () {
                var handleResponse = function (result) {
                    // result = [{"name":"wifi1","quality":"1"},{"name":"wifi2","quality":"5"}];
                    var wifiContent = '';
                    $.map(result, function(val, i) {
                        var wifi = '';
                        wifi += '<div style="margin: 10px 0">';
                        wifi += '<span>';
                        wifi += val.name;
                        wifi += '</span>';
                        wifi += '<span style="padding: 3px; background-color: green; border-radius: 50%; margin: 4px;">';
                        wifi += val.quality;
                        wifi += '</span>';
                        wifi += '<input ';
                        wifi += 'type="text" ';
                        wifi += 'name="password" ';
                        wifi += 'style="margin: 0 5px;" ';
                        wifi += 'placeholder="password" ';
                        wifi += 'id="wifi-' + i + '"';
                        wifi += '/>';
                        wifi += '<input type="submit" ';
                        wifi += 'name="submit" ';
                        wifi += 'value="OK" ';
                        wifi += 'class="wifi-submit" ';
                        wifi += 'data-id="wifi-' + i + '" ';
                        wifi += 'data-name="' + val.name + '"';
                        wifi += '/>';
                        wifi += '</div>';
                        wifiContent += wifi;
                        return val;
                    });
                    $('#content').html(wifiContent);
                    $('.wifi-submit').on('click', function(event) {
                        event.preventDefault();
                        var name = $(this).data('name');
                        var password = $('#' + $(this).data('id')).val();
                        console.log('name', name, 'password', password);
                        $.ajax({
                            url: 'http://69.69.69.69/connect-to',
                            type: 'POST',
                            data: {
                                ssid:name,
                                pass:password,
                                user_id:1
                            },
                            contentType: 'application/json; charset=utf-8',
                            dataType: 'json',
                            success: function(result){
                                console.log(result);
                                setStep(3);
                            },
                            error: function(result) {
                                console.log('error');
                                console.log(result);
                            }
                        });
                    });
                };
                // timer = setInterval(function() {
                //     $.ajax({
                //         url: 'http://69.69.69.69/wifis',
                //         type: 'GET',
                //         contentType: 'application/json; charset=utf-8',
                //         dataType: 'text json',
                //         success: handleResponse,
                //         error: function(result) {
                //             console.log('error');
                //             console.log(result);
                //         }
                //     });
                // }, 20000);
                $.ajax({
                    url: 'http://69.69.69.69/wifis',
                    type: 'GET',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'text json',
                    success: handleResponse,
                    error: function(result) {
                        console.log('error');
                        console.log(result);
                    }
                });
            },
            buttonAction: function() {
                setStep(3);
            },
        },
        {
            title: 'Bước 4: Device config',
            content: 'Thiết bị đang cài đặt. Xin chờ một vài phút.',
            action: function () {
                $('#button').off('click');
                $('#button').css('background-color', 'gray');
                $('#button').css('cursor', 'not-allowed');
            },
            buttonAction: function() {
            },
        },
    ];
    function setStep(step) {
        $('#title').html(steps[step].title);
        $('#content').html(steps[step].content);
        $('#button').css('background-color', 'green');
        $('#button').css('cursor', 'pointer');
        $('#button').on('click', steps[step].buttonAction);
        if (typeof steps[step].action == 'function') {
            steps[step].action();
        }
    }

    setStep(0);
    $('#reset').on('click', function() {
        setStep(0);
        if (timer) {
            clearInterval(timer);
        }
    });
});
