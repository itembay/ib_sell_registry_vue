<template>
    <div class="login_wrap">        
        <p class="login_logo">아이템베이</p>
        <div class="login_box">
            <input type="text" v-model="memberId" placeholder="Id"><input type="password" v-model="password" placeholder="Password"  @keyup.enter="GetToken"><button class="token_btn" @click="GetToken">토큰발행</button>
        </div>       
    </div>
</template>
<script>
export default {
	props:{
		'parentUrl' : String
	},
    data() {
        return {
            memberId : '',
            password : '',
            msg : '' ,
            tokenShow : true,   
			hideLogin : false,
        }
    },
    methods: {
        GetToken(memberId, password){
            this.$axios.post(`${this.parentUrl}common/token`, {memberId : this.memberId, password : this.password})
			.then(res => { 
				this.msg = res.data.message;
				this.$emit('hideLoginBox', this.tokenShow, this.hideLogin, this.msg);
			})
			.catch(e => {
				alert(e.response.data.message);
			})			
        },  
    }
}
</script>

<style scoped>
.login_wrap {overflow:hidden;position:absolute;left:400px;width:700px;height:300px;margin:250px auto 390px;background:rgb(255,255,255,0.5);border-radius:10px;text-align:center}
.login_logo {width:113px;height:26px;margin:70px auto 0;background:url(https://www.itembaycorp.com/resources/images/common/ico_logo.png) 0 0 no-repeat;font-size:0;text-indent:-9999px}
.login_box {margin:45px 0 10px;}
.login_box input {width:150px;height:32px;margin-right:5px;border:1px solid #c5c5c5;border-radius:5px;text-indent:5px;color:#2d2d2d}
.token_btn {
    width:90px;
	-moz-box-shadow:inset 0px 1px 0px 0px #faeebe;
	-webkit-box-shadow:inset 0px 1px 0px 0px #faeebe;
	box-shadow:inset 0px 1px 0px 0px #faeebe;
	background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #ebeb63), color-stop(1, #e6d40e));
	background:-moz-linear-gradient(top, #ebeb63 5%, #e6d40e 100%);
	background:-webkit-linear-gradient(top, #ebeb63 5%, #e6d40e 100%);
	background:-o-linear-gradient(top, #ebeb63 5%, #e6d40e 100%);
	background:-ms-linear-gradient(top, #ebeb63 5%, #e6d40e 100%);
	background:linear-gradient(to bottom, #ebeb63 5%, #e6d40e 100%);
	filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ebeb63', endColorstr='#e6d40e',GradientType=0);
	background-color:#ebeb63;
	-moz-border-radius:6px;
	-webkit-border-radius:6px;
	border-radius:6px;
	border:1px solid #ccc431;
	display:inline-block;
	cursor:pointer;
	color:#6c6c6c;
	font-family:nanum;
	font-size:13px;
    font-weight:600;
	padding:8px 15px;
	text-decoration:none;
}
.token_btn:hover {
	background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #e6d40e), color-stop(1, #ebeb63));
	background:-moz-linear-gradient(top, #e6d40e 5%, #ebeb63 100%);
	background:-webkit-linear-gradient(top, #e6d40e 5%, #ebeb63 100%);
	background:-o-linear-gradient(top, #e6d40e 5%, #ebeb63 100%);
	background:-ms-linear-gradient(top, #e6d40e 5%, #ebeb63 100%);
	background:linear-gradient(to bottom, #e6d40e 5%, #ebeb63 100%);
	filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#e6d40e', endColorstr='#ebeb63',GradientType=0);
	background-color:#e6d40e;
}
.token_btn:active {position:relative;top:1px;}
</style>