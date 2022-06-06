/*Vue.config.productionTip = false
axios.defaults.baseURL = 'http://localhost:8080/';
Vue.prototype.$axios = axios;
axios.defaults.withCredentials = true;

axios.interceptors.request.use(request => {
    console.log('Starting Request: ', request)
    return request
  })
*/

var waitLoading = function(callback) {
    setTimeout(function() {callback();}, 1200) 
}

//WebAPI経由で情報を取得したようにする
//カテゴリ取得
var getCategoryList = function(category, callback) {
    var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
    req.open("get", "./config/category.csv", true); // アクセスするファイルを指定
    req.send(null); // HTTPリクエストの発行
    var result = [];

    req.onload = function() {
        //取得したCSVを配列に変換
        result = convertCSVtoArray(req.responseText);
        //カテゴリ1が一致する項目のみ取得
        result = result.filter(function(value) {
            return value[0] === category;  
        })
    }
    setTimeout(function() {
        callback(result)
    }, 800)
}
//画像取得
var getImages = async function(category1, category2,  callback) {
    var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
    req.open("get", "./config/imgInfo.csv", true); // アクセスするファイルを指定
    req.send(null); // HTTPリクエストの発行
    var result = [];

    var promise = new Promise(function(resolve) {
        req.onload = function() {
            //取得したCSVを配列に変換
            result = convertCSVtoArray(req.responseText);
            //カテゴリが一致する項目のみ取得
            if(category2 === "all") {
                result = result.filter(function(value) {
                    return value[4] == category1;  
                }) 
            } else {
                result = result.filter(function(value) {
                    return (value[4] === category1 && value[6] === category2);  
                })
            }
            //日付順で並び替え
            result.sort(function(a,b){
                if(a[3] < b[3]) return 1;
                if(a[3] > b[3]) return -1;
                return 0;
            })
            resolve();
        }
    });
    await promise;
    //サムネイル画像追加
    // for(let i = 0; i < result.length; i++) {
    //     result[i][8] = await resizeImg(result[i][1])
    // }
    setTimeout(function() {
        callback(result)
    }, 800)
}

function convertCSVtoArray(str){ // 読み込んだCSVデータが文字列として渡される
    var result = []; // 最終的な二次元配列を入れるための配列
    var tmp = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成
 
    // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
    //ヘッダー行は除外
    for(var i=1;i<tmp.length;++i){
        result[i] = tmp[i].split("\",\"");
        result[i].forEach((e, idx) => {
            result[i][idx] = e.replace("\"", "");
        });
    }
    return result;
}
//サムネイル用画像生成
var resizeImg = async function(imgPath) {
    //画像読み込み
    var img = new Image();
    img.src = imgPath;
    var retImg = "";
    var maxWidth = 400;
    var promise = new Promise(function(resolve) {
        img.onload = () => {
            var width = img.width;
            var height = img.height;
            if(width > maxWidth) {
                height = Math.round(height * maxWidth / width);
                width = maxWidth;
            }
            let canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            console.log(canvas.width , canvas.height)
            let ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            // canvasを画像に変換して出力
            retImg = canvas.toDataURL("image/jpeg");
            resolve();
        };
    })
    await promise;
    return retImg;
}

var getMessages = function(axios, callback) {
    // axios.get('/messages')
    //      .then(response => {
    //         callback(null, response.data);
    //      })
    //      .catch(error => {
    //         callback(error, null)
    //      })
}
var getUser = function(axios, userId, callback) {
    setTimeout(function() {
        // axios.get('/user/' + userId)
        //      .then(response => {
        //         callback(null, response.data[0]);
        //      })
        //      .catch(error => {
        //         callback(error, null)
        //      }) 
    }, 1200)
}

var getIconBackgrounds = function(axios, callback) {
    // axios.get('/iconBackgrounds')
    //      .then(response => {
    //         callback(null, response.data);
    //      })
    //      .catch(error => {
    //         console.log(error)
    //      }) 
}
//API経由で情報を更新したようにする
var postMsg = function(to, params, callback) {
    // const axiosApi = axios.create({
    //     headers: {
    //         /* JSON形式にすると何故か失敗するのでtext形式で送る */
    //         'Content-Type':'text/plain;charset=utf-8'
    //     }
    // }) 

    // axiosApi.post(to, params)
    //         .then(response => {
    //             callback(null, response.data[0]);
    //         })
    //         .catch(error => {
    //             callback(error, null)
    //         }) 
}
var postUser = function(to, params, callback) {
    // const axiosApi = axios.create({
    //     headers: {
    //         /* JSON形式にすると何故か失敗するのでtext形式で送る */
    //         'Content-Type':'text/plain;charset=utf-8'
    //     }
    // }) 

    // axiosApi.post(to, params)
    //         .then(response => {
    //             callback(null, response.data);
    //         })
    //         .catch(error => {
    //             callback(error, null)
    //         }) 
    
}

// var Messages = {
//     template: '#top',

//     data: function() {
//         return {
//             loading: false,
//             displaying: false,
//             sending: false,
//             messages: function(){return []}, //初期値の空配列
//             message: this.defaultMessage(),
//             error: null,
//             isFirst: false,
//             composing: false,
//             users: function(){return []}, //初期値の空配列
//             file: null,
//             isModalActive: false,
//             modalImg: null
//         }
//     },
//     //初期化時にデータを取得
//     created: function() {
//         this.fetchData()
//         this.isFirst = true
        
//     },
//     updated: function(){
//         if(!this.isFirst) {
//             var element = document.documentElement
//             var bottom = element.scrollHeight - element.clientHeight
//             window.scroll(0, bottom)
//         }  
//     },
//     watch: {
//         '$route': 'fetchData'
//     },
//     methods: {
//         fetchData: function() {
//             this.loading = true
//             this.displaying = false
            
//             getUsers(this.$axios, (function(err, resUsers) {
//                 this.loading = false
//                 this.displaying = true
//                 if (err) {
//                     this.error = err.toString()
//                 } else {
//                     this.users = resUsers;

//                     getMessages(this.$axios, (async function(err, messages) {
//                         this.loading = false
//                         if (err) {
//                             this.error = err.toString()
//                         } else {
//                             this.messages = messages
//                         }
//                     }).bind(this))    
//                 }
//             }
//             ).bind(this))
            

//         },
//         defaultMessage: function() {
//             return {
//                 id: '',
//                 userId: myId,
//                 message: '',
//                 isImage: false
//             }
//         },
//         createMessage: function(){
//             this.isFirst = false
//             var textarea = document.getElementById('textarea');
//             var messagesArea = document.getElementById('messages');
//             var inputArea = document.getElementsByClassName('input-message-inner');
//             textarea.style.height = '24px'
//             messagesArea.style.paddingBottom = '88px'
//             inputArea[0].style.alignItems = "center"
//             this.message.isImage = false
//             if(this.message.message.trim() === ''){
//                 return
//             }
//             postMsg("/addMessage", this.message, (function(err, resMsg) {
//                 this.sending = false
//                 if(err) {
//                     this.error = err.toString()
//                 } else {
//                     this.error = null
//                     this.messages.push({
//                         id: resMsg.id,
//                         userId: resMsg.userId,
//                         message: resMsg.message,
//                         isImage: false
//                     });
//                     this.message = this.defaultMessage() 
//                 }
//             }).bind(this)) 
//         },
//         deleteMessage: function(id){
//             var selectMessage = this.messages.filter(msg => msg.id === id)
//             var index = this.messages.indexOf(selectMessage[0])

//             postMsg("/deleteMessage", this.messages[index], (function(err, resMsg) {
//                 if(err) {
//                     this.error = err.toString()
//                 } else {
//                     this.error = null 
//                     this.messages.splice(index, 1); 
//                 }
//             }).bind(this)) 

//         },

//         iconColor: function(userId) {
//             if(this.users[0]) {
//                 var selectUser = this.users.filter(user => user.id === userId)
//                 return selectUser[0].icon
//             }
//             return null; 
//         },
//         iconBackground: function(userId) {
//             if(this.users[0]) {
//                 var selectUser = this.users.filter(user => user.id === userId)
//                 var selectColor = iconBackgrounds.filter(color => color.id === selectUser[0].iconBackground)
//                 return selectColor[0].color
//             }
//             return null; 
//         },

//         keyEnter: function(event) {
//             if (event.keyCode !== 13) return
//             var ut = navigator.userAgent;
//             if(ut.indexOf('iPhone') > 0 || ut.indexOf('iPod') > 0 || ut.indexOf('iPad') > 0 || ut.indexOf('Android') > 0 && ut.indexOf('Mobile') > 0) {
//                 if(this.composing) {
//                     return
//                 }
//                 else {
//                     this.setTextareaHeight()
//                     return
//                 }
//             }
//             this.createMessage()
//         },
//         keyEnterShift: function(event) {
//             var ut = navigator.userAgent;
//             if(ut.indexOf('iPhone') > 0 || ut.indexOf('iPod') > 0 || ut.indexOf('iPad') > 0 || ut.indexOf('Android') > 0 && ut.indexOf('Mobile') > 0) return
//             this.setTextareaHeight()
//         },
//         setTextareaHeight: function(event) {     
//             var textarea = document.getElementById('textarea');
//             var messages = document.getElementById('messages');
//             var inputArea = document.getElementsByClassName('input-message-inner');
//             var height = parseInt(window.getComputedStyle(textarea).height);
//             var margin = parseInt(window.getComputedStyle(messages).paddingBottom);

//             height += 24
//             if(height <  parseInt(window.getComputedStyle(textarea).maxHeight)) {
//                 margin += 24
//             }
//             textarea.style.height = height + 'px'
//             messages.style.paddingBottom = margin + 'px'
//             inputArea[0].style.alignItems = "flex-end"
//         },

//         // トランジション開始でインデックス*100ms分のディレイを付与
//         beforeEnter: function(el) {
//             if (!this.isFirst) {el.dataset.index = 0}
//             el.style.transitionDelay = 100 * parseInt(el.dataset.index, 10) + 'ms'
//         },
//         // トランジション完了またはキャンセルでディレイを削除
//         afterEnter(el) {
//             el.style.transitionDelay = ''
//         },

//         //画像投稿
//         async upload(event) {
//             const files = event.target.files || event.dataTransfer.files
//             const file = files[0]

//             //選択されたファイルが条件を満たしているかチェック
//             if (this.checkFile(file)) {
//                 //getBase64が終わるまで待つ
//                 const picture = await this.getBase64(file)

//                 this.isFirst = false
//                 var imgMsg = {
//                     id: null,
//                     userId: myId,
//                     message: picture,
//                     isImage: true
//                 }

//                 postMsg("/addMessage", imgMsg , (function(err, resMsg) {
//                     this.sending = false
//                     if(err) {
//                         this.error = err.toString()
//                     } else {
//                         this.error = null
//                         this.messages.push({
//                             id: resMsg.id,
//                             userId: resMsg.userId,
//                             message: picture,
//                             isImage: true
//                         });
//                     }
//                 }).bind(this)) 
//             }
//         },
//         getBase64(file) {
//             /*
//              * resolve：処理が成功したときのメッセージを表示する関数
//              * reject：処理が失敗したときのメッセージを表示する関数
//              */
//             return new Promise((resolve, reject) => {
//                 const reader = new FileReader()
//                 //resultにァイルのデータを表すURLが格納される
//                 reader.readAsDataURL(file)

//                 reader.onload = () => resolve(reader.result)
//                 reader.onerror = error => reject(error)
//             })
//         },
//         checkFile(file) {
//             let result = true
//             const SIZE_LIMIT = 5000000 // 5MB
//             // キャンセルしたら処理中断
//             if (!file) {
//                 result = false
//             }
//             // jpeg か png 関連ファイル以外は受付けない
//             if (file.type !== 'image/jpeg' && file.type !== 'image/jpg'　&& file.type !== 'image/png') {
//                 result = false
//             }
//             // 上限サイズより大きければ受付けない
//             if (file.size > SIZE_LIMIT) {
//                 result = false
//             }
//             return result
//         },
//         openModal: function(img) {
//             this.modalImg = img
//             this.isModalActive = true;
//         },
//         closeModal: function() {
//             modalImg = null
//             this.isModalActive = false;
//         }
//     },
//     computed: {
//         checkMyMessage: function() {
//             return function(userId) {
//                 if(userId === myId) return "myMessage"
//                 return
//             }    
//         }
//     }
// }

/*************
  トップページ
**************/
var TopMenu = {
    template: '#top',
    data: function() {
        return {
            loading: false,
            displaying: false,
            error: null,
        }
    },
    //初期化時にデータを取得
    created: function() {
        this.fetchData()
    },
    watch: {
        '$route': 'fetchData'
    },
    methods: {
        fetchData: function() {
            this.loading = true
            waitLoading((function() {
                this.loading = false
                this.displaying = true
            }).bind(this))
            
        }
    }
}

/******************
  イラスト表示ページ
*******************/
var Illustration = {
    template: '#illustration',
    data: function() {
        return {
            loading: false,
            displaying: false,
            selectedCategory: "",
            categoryList: "",
            imageList: "",
            checked: false,
            error: null,
        }
    },
    //初期化時にデータを取得
    created: function() {
        this.displaying = false;
        this.fetchData()
    },
    watch: {
        '$route': 'fetchData'
    },
    methods: {
        fetchData: async function() {
            this.imageList = "";
            this.selectedCategory = ""
            //ローディングアニメーションの表示
            this.loading = true
            var compGetCategoryList = false
            var compGetImages = false
            //ドロップダウンメニュー非表示
            this.checked = false;
            //カテゴリー取得
            var resCategoryList = [];
            getCategoryList("illustration", (function(res){
                //this.loading = false
                //this.displaying = true

                resCategoryList.push({
                    name: "All",
                    urlParams: "all"
                });
                res.forEach(element => {
                    resCategoryList.push({
                        name: element[1],
                        urlParams: element[2]
                    });
                })
                var selectedCategoryInfo = resCategoryList.find((v) => v.urlParams === this.$route.params.category)
                this.categoryList = resCategoryList
                this.selectedCategory = selectedCategoryInfo.name
                compGetCategoryList = true
                if(compGetCategoryList && compGetImages) {
                    this.loading = false
                    this.displaying = true
                }
            }).bind(this));
            //画像取得
            var resImageList = [];

            getImages("illustration", this.$route.params.category, (async function(res){
                var itemNum = res.length
                for(let i = 0; i < itemNum; i++) {
                    element = res[i]
                    console.log(element);
                    // 圧縮した画像を取得
                    //var thumbnail = await resizeImg(element[1]);
                    //console.log("thumbnail = " +  thumbnail);
                    resImageList.push({
                        idx: element[0],
                        path: element[1],
                        fileName: element[2],
                        day: element[3],
                        category1: element[4],
                        category2: element[5],
                        category3: element[6],
                        detail: element[7],
                        thumbnail: element[8]
                    });
                    console.log(i)
                    console.log(itemNum)
                }
                this.imageList = resImageList;
                compGetImages = true
                if(compGetCategoryList && compGetImages) {
                    this.loading = false
                    this.displaying = true
                }
            }).bind(this));
        },


         // トランジション開始でインデックス*100ms分のディレイを付与
        beforeEnter: function(el) {
            el.style.transitionDelay = 100 * parseInt(el.dataset.index, 10) + 'ms'
        },
        // トランジション完了またはキャンセルでディレイを削除
        afterEnter(el) {
            el.style.transitionDelay = ''
        },
        
    }
}

var UserList = {
    template: '#user-list',
    data: function() {
        return {
            loading: false,
            users: function(){return []}, //初期値の空配列
            error: null,
        }
    },
    //初期化時にデータを取得
    created: function() {
        this.fetchData()
    },
    watch: {
        '$route': 'fetchData'
    },
    methods: {
        fetchData: function() {
            this.loading = true
            getUsers(this.$axios, (function(err, res) {
                this.loading = false
                if (err) {
                    this.error = err.toString()
                } else {
                    /* responseのデータを一度resUsersにセットしてからフィルターをかける */
                    var resUsers = [];
                    res.forEach(element => {
                        resUsers.push({
                            id: element.id,
                            name: element.name,
                            description: element.description,
                            icon: element.icon,
                            iconBackground: element.iconBackground
                        });
                    })
                    /* 自分は表示しない */
                    this.users = resUsers.filter(user => user.id !== myId);
                }
            }
            ).bind(this))
        },
        iconColor: function(userId) {
            var user = this.users.filter(user => user.id === userId)
            return user[0].icon
        },
        iconBackground: function(userId) {
            var selectUser = this.users.filter(user => user.id === userId)
            var selectColor = iconBackgrounds.filter(color => color.id === selectUser[0].iconBackground)
            return selectColor[0].color
        },

         // トランジション開始でインデックス*100ms分のディレイを付与
        beforeEnter: function(el) {
            el.style.transitionDelay = 100 * parseInt(el.dataset.index, 10) + 'ms'
        },
        // トランジション完了またはキャンセルでディレイを削除
        afterEnter(el) {
            el.style.transitionDelay = ''
        },
        
    }
}

var UserDetail = {
    template: '#user-detail',
    data: function() {
        return {
            loading: false,
            user: null,
            error: null,
            result: null,
        }
    },
    created: function() {
        this.fetchData()
    },
    watch: {
        '$route': 'fetchData'
    },
    methods: {
        fetchData: function() {
            this.loading = true
            getUser(this.$axios, this.$route.params.userId, (function(err, user) {
                this.loading = false
                if (err) {
                    this.error = err.toString()
                } else {
                    this.user = user;
                }
            }).bind(this))
        },
        iconColor: function(userId) {return this.user.icon},
        iconBackground: function(userId) {
            var selectColor = iconBackgrounds.filter(color => color.id === this.user.iconBackground)
            return selectColor[0].color
        },
        // トランジション開始でインデックス*100ms分のディレイを付与
        beforeEnter: function(el) {
            if (!this.isFirst) {el.dataset.index = 0}
            el.style.transitionDelay = 100 * parseInt(el.dataset.index, 10) + 'ms'
        },
        // トランジション完了またはキャンセルでディレイを削除
        afterEnter(el) {
            el.style.transitionDelay = ''
        },
    },
}

var UserInfo = {
    template: '#user-info',
    data: function() {
        return {
            sending: false,
            user: null,
            error: null,
            iconBackgrounds: iconBackgrounds, //初期値の空配列
            users: null, //初期値の空配列
        }
    },
    //初期化時にデータを取得
    created: function() {
        this.fetchData()
    },
    watch: {
        '$route': 'fetchData'
    },
    methods: {
        fetchData: function() {
            this.loading = true
            getUser(this.$axios, myId, (function(err, user) {
                this.loading = false
                if (err) {
                    this.error = err.toString()
                } else {
                    this.user = user;
                }
            }).bind(this))
            getUsers(this.$axios, (function(err, res) {
                this.loading = false
                if (err) {
                    this.error = err.toString()
                } else {
                    var resUsers = [];
                    res.forEach(element => {
                        resUsers.push({
                            id: element.id,
                            name: element.name,
                            description: element.description,
                            icon: element.icon,
                            iconBackground: element.iconBackground
                        });
                    })
                    /* 自分は表示しない */
                    this.users = resUsers;
                }
            }
            ).bind(this))
        },        
        iconColor: function(userId) {
            if(this.users[0]) {
                var selectUser = this.users.filter(user => user.id === userId)
                return selectUser[0].icon
            }
            return null; 
        },
        iconBackground: function(userId) {
            if(this.users[0]) {
                var selectUser = this.users.filter(user => user.id === userId)
                var selectColor = iconBackgrounds.filter(color => color.id === selectUser[0].iconBackground)
                return selectColor[0].color
            }
            return null; 
        },
        changeIconbackground: function(color) {
            var selectUser = this.users.filter(user => user.id === myId)
            selectUser[0].iconBackground = color
            this.user.iconBackground = color;

            postUser('/changeBackground', this.user, (function(err, message) {
                if(err) {
                    this.error = err.toString()
                } else {
                    this.error = null
                }
            }).bind(this))
        },
        setDescription: function() {
            var selectUser = this.users.filter(user => user.id === myId)

            if(selectUser[0].description !== this.user.description)
            {
                selectUser[0].description = this.user.description;

                postUser('/changeDescription', this.user, (function(err, message) {
                    if(err) {
                        this.error = err.toString()
                    } else {
                        this.error = null
                    }
                }).bind(this))
            }
        },
        setName: function() {
            var selectUser = this.users.filter(user => user.id === myId)

            if(selectUser[0].name !== this.user.name)
            {    
                selectUser[0].name = this.user.name;

                postUser('/changeName', this.user, (function(err, message) {
                    if(err) {
                        this.error = err.toString()
                    } else {
                        this.error = null
                    }
                }).bind(this))
            }
        },
        changeUser: function(user) {
            myId = user
            this.user = null
            this.loading = true
            getUser(this.$axios, myId, (function(err, user) {
                　//this.loading = false
                if (err) {
                    this.error = err.toString()
                } else {
                    this.user = user;
                }
            }).bind(this))
        },
        // トランジション開始でインデックス*100ms分のディレイを付与
        beforeEnter: function(el) {
            el.style.transitionDelay = 100 * parseInt(el.dataset.index, 10) + 'ms'
        },
        // トランジション完了またはキャンセルでディレイを削除
        afterEnter(el) {
            el.style.transitionDelay = ''
        }
    }
}


var router = new VueRouter({
    //ルート定義を配列で渡す
    routes: [
        {
            path: '/',
            redirect: '/top',
        },
        {
            path: '/top',   //URLの指定。ファイル名#/topでアクセスできる。
            component: TopMenu
        },
        {
            path: '/illustration',
            redirect: '/illustration/all',
        },
        {
            path: '/illustration/:category', 
            name: 'illustration',
            component: Illustration,
        },
        {
            path: '/users',   //URLの指定。ファイル名#/usersでアクセスできる。
            component: UserList,
        },
        {
            path: '/user/info',
            component: UserInfo
        },
        {
            path: '/user/:userId',  
            name: 'user', 
            component: UserDetail
        }
    ] 
})

var iconBackgrounds = []
var iconBackgroundsClass = []

var app = new Vue({
    el: '#app',
    router: router,
    created: function() {
        console.log("Hello!");
        getIconBackgrounds(this.$axios, function(err, res) {
            if (err) {
                console.log(err)
            } else {
                res.forEach(element => {
                    iconBackgrounds.push({
                        id: element.id,
                        name: element.name,
                        color: {background: element.color},
                    });
                })
            }
        })
        

    },
})
