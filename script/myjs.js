Vue.config.productionTip = false
axios.defaults.baseURL = 'http://localhost:8080/';
Vue.prototype.$axios = axios;
axios.defaults.withCredentials = true;

axios.interceptors.request.use(request => {
    console.log('Starting Request: ', request)
    return request
  })

var myId = 1

//WebAPI経由で情報を取得したようにする
var getMessages = function(axios, callback) {
    axios.get('/messages')
         .then(response => {
            callback(null, response.data);
         })
         .catch(error => {
            callback(error, null)
         })
}
var getUser = function(axios, userId, callback) {
    setTimeout(function() {
        axios.get('/user/' + userId)
             .then(response => {
                callback(null, response.data[0]);
             })
             .catch(error => {
                callback(error, null)
             }) 
    }, 1600)
}
var getUsers = function(axios, callback) {
    setTimeout(function() {
        axios.get('/users')
             .then(response => {
                callback(null, response.data);
             })
             .catch(error => {
                callback(error, null)
             }) 
    }, 1600) 
}
var getIconBackgrounds = function(axios, callback) {
    axios.get('/iconBackgrounds')
         .then(response => {
            callback(null, response.data);
         })
         .catch(error => {
            console.log(error)
         }) 
}
//API経由で情報を更新したようにする
var postMsg = function(to, params, callback) {
    const axiosApi = axios.create({
        headers: {
            /* JSON形式にすると何故か失敗するのでtext形式で送る */
            'Content-Type':'text/plain;charset=utf-8'
        }
    }) 

    axiosApi.post(to, params)
            .then(response => {
                callback(null, response.data[0]);
            })
            .catch(error => {
                callback(error, null)
            }) 
}
var postUser = function(to, params, callback) {
    const axiosApi = axios.create({
        headers: {
            /* JSON形式にすると何故か失敗するのでtext形式で送る */
            'Content-Type':'text/plain;charset=utf-8'
        }
    }) 

    axiosApi.post(to, params)
            .then(response => {
                callback(null, response.data);
            })
            .catch(error => {
                callback(error, null)
            }) 
}

var Messages = {
    template: '#top',

    data: function() {
        return {
            loading: false,
            displaying: false,
            sending: false,
            messages: function(){return []}, //初期値の空配列
            message: this.defaultMessage(),
            error: null,
            isFirst: false,
            composing: false,
            users: function(){return []}, //初期値の空配列
            file: null,
            isModalActive: false,
            modalImg: null
        }
    },
    //初期化時にデータを取得
    created: function() {
        this.fetchData()
        this.isFirst = true
        
    },
    updated: function(){
        if(!this.isFirst) {
            var element = document.documentElement
            var bottom = element.scrollHeight - element.clientHeight
            window.scroll(0, bottom)
        }  
    },
    watch: {
        '$route': 'fetchData'
    },
    methods: {
        fetchData: function() {
            this.loading = true
            this.displaying = false
            
            getUsers(this.$axios, (function(err, resUsers) {
                this.loading = false
                this.displaying = true
                if (err) {
                    this.error = err.toString()
                } else {
                    this.users = resUsers;

                    getMessages(this.$axios, (async function(err, messages) {
                        this.loading = false
                        if (err) {
                            this.error = err.toString()
                        } else {
                            this.messages = messages
                        }
                    }).bind(this))    
                }
            }
            ).bind(this))
            

        },
        defaultMessage: function() {
            return {
                id: '',
                userId: myId,
                message: '',
                isImage: false
            }
        },
        createMessage: function(){
            this.isFirst = false
            var textarea = document.getElementById('textarea');
            var messagesArea = document.getElementById('messages');
            var inputArea = document.getElementsByClassName('input-message-inner');
            textarea.style.height = '24px'
            messagesArea.style.paddingBottom = '88px'
            inputArea[0].style.alignItems = "center"
            this.message.isImage = false
            if(this.message.message.trim() === ''){
                return
            }
            postMsg("/addMessage", this.message, (function(err, resMsg) {
                this.sending = false
                if(err) {
                    this.error = err.toString()
                } else {
                    this.error = null
                    this.messages.push({
                        id: resMsg.id,
                        userId: resMsg.userId,
                        message: resMsg.message,
                        isImage: false
                    });
                    this.message = this.defaultMessage() 
                }
            }).bind(this)) 
        },
        deleteMessage: function(id){
            var selectMessage = this.messages.filter(msg => msg.id === id)
            var index = this.messages.indexOf(selectMessage[0])

            postMsg("/deleteMessage", this.messages[index], (function(err, resMsg) {
                if(err) {
                    this.error = err.toString()
                } else {
                    this.error = null 
                    this.messages.splice(index, 1); 
                }
            }).bind(this)) 

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

        keyEnter: function(event) {
            if (event.keyCode !== 13) return
            var ut = navigator.userAgent;
            if(ut.indexOf('iPhone') > 0 || ut.indexOf('iPod') > 0 || ut.indexOf('iPad') > 0 || ut.indexOf('Android') > 0 && ut.indexOf('Mobile') > 0) {
                if(this.composing) {
                    return
                }
                else {
                    this.setTextareaHeight()
                    return
                }
            }
            this.createMessage()
        },
        keyEnterShift: function(event) {
            var ut = navigator.userAgent;
            if(ut.indexOf('iPhone') > 0 || ut.indexOf('iPod') > 0 || ut.indexOf('iPad') > 0 || ut.indexOf('Android') > 0 && ut.indexOf('Mobile') > 0) return
            this.setTextareaHeight()
        },
        setTextareaHeight: function(event) {     
            var textarea = document.getElementById('textarea');
            var messages = document.getElementById('messages');
            var inputArea = document.getElementsByClassName('input-message-inner');
            var height = parseInt(window.getComputedStyle(textarea).height);
            var margin = parseInt(window.getComputedStyle(messages).paddingBottom);

            height += 24
            if(height <  parseInt(window.getComputedStyle(textarea).maxHeight)) {
                margin += 24
            }
            textarea.style.height = height + 'px'
            messages.style.paddingBottom = margin + 'px'
            inputArea[0].style.alignItems = "flex-end"
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

        //画像投稿
        async upload(event) {
            const files = event.target.files || event.dataTransfer.files
            const file = files[0]

            //選択されたファイルが条件を満たしているかチェック
            if (this.checkFile(file)) {
                //getBase64が終わるまで待つ
                const picture = await this.getBase64(file)

                this.isFirst = false
                var imgMsg = {
                    id: null,
                    userId: myId,
                    message: picture,
                    isImage: true
                }

                postMsg("/addMessage", imgMsg , (function(err, resMsg) {
                    this.sending = false
                    if(err) {
                        this.error = err.toString()
                    } else {
                        this.error = null
                        this.messages.push({
                            id: resMsg.id,
                            userId: resMsg.userId,
                            message: picture,
                            isImage: true
                        });
                    }
                }).bind(this)) 
            }
        },
        getBase64(file) {
            /*
             * resolve：処理が成功したときのメッセージを表示する関数
             * reject：処理が失敗したときのメッセージを表示する関数
             */
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                //resultにァイルのデータを表すURLが格納される
                reader.readAsDataURL(file)

                reader.onload = () => resolve(reader.result)
                reader.onerror = error => reject(error)
            })
        },
        checkFile(file) {
            let result = true
            const SIZE_LIMIT = 5000000 // 5MB
            // キャンセルしたら処理中断
            if (!file) {
                result = false
            }
            // jpeg か png 関連ファイル以外は受付けない
            if (file.type !== 'image/jpeg' && file.type !== 'image/jpg'　&& file.type !== 'image/png') {
                result = false
            }
            // 上限サイズより大きければ受付けない
            if (file.size > SIZE_LIMIT) {
                result = false
            }
            return result
        },
        openModal: function(img) {
            this.modalImg = img
            this.isModalActive = true;
        },
        closeModal: function() {
            modalImg = null
            this.isModalActive = false;
        }
    },
    computed: {
        checkMyMessage: function() {
            return function(userId) {
                if(userId === myId) return "myMessage"
                return
            }    
        }
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
            component: Messages
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
