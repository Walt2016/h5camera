 // wx.config({
        //     debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        //     appId: 'wx60005649efa58d7d', // 必填，公众号的唯一标识
        //     // timestamp: , // 必填，生成签名的时间戳
        //     // nonceStr: '', // 必填，生成签名的随机串
        //     // signature: '', // 必填，签名
        //     jsApiList: ['openLocation'] // 必填，需要使用的JS接口列表 这里填写需要用到的微信api openlocation为使用微信内置地图查看位置接口
        // });
        // wx.ready(function () {
        //     wx.checkJsApi({
        //         jsApiList: ['checkJsApi', 'openLocation'],
        //         success: function (res) {}
        //     });
        // });
        // wx.error(function (res) {
        //     console.log(res);
        // });
        // document.querySelector('.weixin').addEventListener('click',function () {
        //     wx.openLocation({
        //         latitude: 22.545538, // 纬度，浮点数，范围为90 ~ -90。如果是动态获取的数据，使用parseFloat()处理数据
        //         longitude: 114.054565, // 经度，浮点数，范围为180 ~ -180。如果是动态获取的数据，使用parseFloat()处理数据；
        //         name: '这里填写位置名', // 位置名
        //         address: '位置名的详情说明', // 地址详情说明
        //         scale: 10, // 地图缩放级别,整形值,范围从1~28。默认为最大
        //     });
        // });
        // window.navigator.getUserMedia = navigator.getUserMedia || navigator.webKitGetUserMedia || navigator
        //     .mozGetUserMedia || navigator.msGetUserMedia;


        (function () {
            var lastTime = 0;
            var vendors = ['webkit', 'moz'];
            for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
                    // name has changed in Webkit
                    window[vendors[x] + 'CancelRequestAnimationFrame'];
            }
            if (!window.requestAnimationFrame) {
                window.requestAnimationFrame = function (callback, element) {
                    var currTime = new Date().getTime();
                    var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
                    var id = window.setTimeout(function () {
                        callback(currTime + timeToCall);
                    }, timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };
            }
            if (!window.cancelAnimationFrame) {
                window.cancelAnimationFrame = function (id) {
                    clearTimeout(id);
                };
            }
        }());


        var video = document.querySelector('video');
        var origialCanvas = document.getElementById("origialCanvas");
        origialCanvas.width = 320, origialCanvas.height = 456;
        var canvas = document.getElementById("canvas");
        canvas.width = 320, canvas.height = 456;
        var ctx2 = canvas.getContext('2d');
        var ctx = origialCanvas.getContext('2d');
        var capture = document.querySelector(".capture")

        var stop = document.querySelector(".stop")
        // var videoObj = {
        //     "video": true,
        //     "audio":false
        // };

        var videoObj = {
            video: {
                // facingMode: {
                //     exact: "environment"
                // }
                facingMode: 'user'
            }

            // 
        }
        // var errBack = function (error) {
        //     console.log("Video capture error: ", error.code);
        // };
        function getFail(error) {
            console.log("Video capture error: ", error.code);
        }


        //拍照
        capture.addEventListener("click", function () {
            var img = document.createElement("img")
            var tempSrc = origialCanvas.toDataURL("image/png");
            img.src = tempSrc;
            document.querySelector(".album").appendChild(img)
        });

        stop.addEventListener("click", function () {
            // var img = document.createElement("img")
            // var tempSrc = origialCanvas.toDataURL("image/png");
            // img.src = tempSrc;
            // document.querySelector(".album").appendChild(img)
            closeCamera(currentStream)
        });



        function drawGrid(ctx, color, stepx, stepy) {
            ctx.font = "30px sans-serif";
            ctx.fillStyle = "blue";
            ctx.fillText("请眨眼", 50, 50);
            ctx.save()

            ctx.strokeStyle = color;
            ctx.lineWidth = 0.5;
            // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            for (var i = stepx + 0.5; i < ctx.canvas.width; i += stepx) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, ctx.canvas.height);
                ctx.stroke();
            }

            for (var i = stepy + 0.5; i < ctx.canvas.height; i += stepy) {
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(ctx.canvas.width, i);
                ctx.stroke();
            }
            ctx.restore();
        }

        var videoToCanvas = function (video) {
            if (video) {
                ctx.drawImage(video, 0, 0, origialCanvas.width, origialCanvas.height)
                ctx2.drawImage(origialCanvas, 0, 0, canvas.width, canvas.height)
            }
            drawGrid(ctx2, '#000', 30, 30);
        }

        var timer;
        var loop = function () {
            videoToCanvas(video)
            timer = requestAnimationFrame(loop)

            // timer = setInterval(function () {
            //                     videoToCanvas(video)
            //                 }, 30)
        }

        var clear = function () {
            cancelAnimationFrame(timer);
            // clearInterval(timer)
        }
        //调用成功

        var currentStream;

        function getVideoStream(stream) {
            currentStream = stream;
            // buffer = stream;
            // if(video.mozSrcObject !== undefined){
            //     video.mozSrcObject = buffer;
            // }else{

            // [Deprecation] URL.createObjectURL with media streams is deprecated and will be removed in M71, around December 2018.
            //  Please use HTMLMediaElement.srcObject instead.


            // Older browsers may not have srcObject
            if ('mozSrcObject' in video) {
                video.mozSrcObject = stream;
            } else if ('srcObject' in video) {
                video.srcObject = stream;
            } else {
                // Avoid using this in new browsers, as it is going away.
                video.src = window.URL && window.URL.createObjectURL(stream) || stream;
            }

            video.onloadedmetadata = function (e) {
                video.play();
            };

            video.addEventListener('play', function () {
                loop()
            }, false);
            // video.addEventListener('pause', function () {

            // }, false);
            // video.addEventListener('ended', function () {
            //     clear();
            // }, false);

            // }

            // console.log(navigator.mediaDevices.enumerateDevices())
            // ;
        }
        const button = document.getElementById('button');
        const select = document.getElementById('select');


        //选摄像头
        function gotDevices(mediaDevices) {
            select.innerHTML = '';
            select.appendChild(document.createElement('option'));
            let count = 1;
            mediaDevices.forEach(mediaDevice => {
                if (mediaDevice.kind === 'videoinput') {
                    const option = document.createElement('option');
                    option.value = mediaDevice.deviceId;
                    const label = mediaDevice.label || `Camera ${count++} `;
                    const textNode = document.createTextNode(label);
                    option.appendChild(textNode);
                    select.appendChild(option);
                }
            });
        }





        function invokingCamera() {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                //新API MediaDevices.getUserMedia可以通过video的facingMode属性指定调用手机的前置或后置摄像头
                // console.log(222);
                navigator.mediaDevices.getUserMedia(videoObj)
                    .then(function (mediaVideo) {
                        getVideoStream(mediaVideo)
                        return navigator.mediaDevices.enumerateDevices();
                    }).then(gotDevices)
                    .catch(getFail)
            } else if (navigator.getUserMedia) {
                //navigator.getUserMediau已经从 Web 标准中删除，部分浏览器可以使用
                navigator.getUserMedia(videoObj, getVideoStream, getFail)
            } // 添加video 监听器
            else if (navigator.webkitGetUserMedia) { // WebKit 前缀
                navigator.webkitGetUserMedia(videoObj, getVideoStream, getFail);
            } else if (navigator.mozGetUserMedia) { // Firefox 前缀
                navigator.mozGetUserMedia(videoObj, getVideoStream, getFail);
            } else {
                alert('不支持摄像头调用！')
            }
        }

        // function stopMediaTracks(stream) {

        //     // stream.getTracks().forEach(track => {
        //     //     track.stop();
        //     // });

        //     stream.getTracks().forEach(function (t) {
        //         t.stop();
        //     })

        // }





        function closeCamera(stream) {
            if (stream) {
                stream.getTracks().forEach(function (t) {
                    t.stop();
                })
            }

            // buffer && buffer.getTracks()[1].stop(); //关闭摄像头
            // var video = document.querySelector('video');
            // video.close();
        }

        window.addEventListener("DOMContentLoaded", function () {
            invokingCamera()
            // videoToCanvas()
        })