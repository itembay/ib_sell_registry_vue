<template>
  <div id="app">   
    <div id="member_header" style="width: auto;">
        <a href="http://itembay.com" class="wbg member_logo"><span>아이템베이 바로가기</span></a>
        <a href="javascript:;" class="wbg member_tg" @click="topNav=!topNav" :class="{close : topNav}">toggle</a>
        <div class="top_nav_wrap">
        <transition name="topNavLi" >           
           <ul  class="member_tg_ul topNavLi" v-show="topNav">
            <li><a href="http://www.itembay.com" title="아이템거래" target="_blank">아이템거래</a> &nbsp;|&nbsp;</li>
            <li><a href="/mybay/mybayMainView" title="마이페이지" target="_blank">마이페이지</a> &nbsp;|&nbsp;</li>
            <li><a href="/help/helpMainView" title="고객센터" target="_blank">고객센터</a></li>          
          </ul>
        </transition>
        </div>
     </div>
    <div class="wrap">     
     <!-- login -->
     <transition name="fadeLogin">  
        <login @hideLoginBox="HideFade" :parentUrl="baseURI" v-if="hideLogin"></login>  
     </transition> 
      <!-- register --> 
     <transition name="fade-table">
        <div class="reg_wrap" v-if="tokenShow">    
            <div class="token_area">       
                <div class="top_area">
                    <div class="top_lef_area">
                        <h1>간편등록</h1> | 
                        <span> 오픈API 샘플</span>
                    </div>
                    <div class="top_rig_area">                        
                        <a href="#">API Documents</a>
                        <a href="#">오픈 API 안내</a>
                    </div>
                </div>
                <input type="text" v-model="token" v-if="!loadingShow"/>         
                <p class="token_txt" v-if="loadingShow">
                    {{token}}
                </p> 
                <button class="token_btn" @click="Games()" v-if="!loadingShow">토큰확인</button>  
                <button class="goLogin_btn" @click="goLogin()" v-if="loadingShow">첫화면으로</button>              
            </div>  
            <p class="token_msg" v-if="!loadingShow">
               {{msg}}
            </p>   
            <!-- game tab  -->
            <ul class="reg_tab_wrap" v-if="loadingShow">
                <li v-for="tab in cmpnTab" :key="tab" @click="gameTabOver=tab" :class="[gameTabOver == tab ? 'on' : '']" ><span :title="gameTabData[tab-1].gameName+'-'+gameTabData[tab-1].serverName">  {{gameTabData[tab-1].gameName}} - {{gameTabData[tab-1].serverName}}</span></li>
                <li @click="AddGame()"> + </li>
            </ul>             
            <!-- game add  -->  
            <div class="game_wrap" >
                <component v-for="(cmpn, index) in cmpns" :is="cmpn" :key="cmpn.index" v-show="gameTabOver == (index+1)"
                    :parentUrl="baseURI"
                    :tokenCode="token" 
                    :parentGame="games"
                    :parentGameNum="index+1"
                    :parentMypage="Mypage1"
                    :parentCurrentPage="currentPage1"
                    @gameTabTitle="gameTabName"
                > 
                </component> 
                
            </div>
        </div>
     </transition>
     <!-- my page -->
     <transition name="fade-table">  
        <div class="reg_wrap" v-if="tokenShow">
            <p class="my_title"><img src="http://trade.itembay.com/resources/image/leftMenu/lnb_mypage.gif" alt="마이페이지"></p>
            <div class="tb" v-if="loadingShow">                
                <ul class="my_tab_wrap" >
                    <li @click="tabOver=1,Mypage1()" :class="[tabOver == 1 ? 'on' : '']">판매등록 한 물품</li>
                    <li @click="tabOver=2,Mypage2()" :class="[tabOver == 2 ? 'on' : '']">결제대기 중 물품</li>
                    <li @click="tabOver=3,Mypage3()" :class="[tabOver == 3 ? 'on' : '']">판매진행 중 물품</li>
                    <li @click="tabOver=4,Mypage4()" :class="[tabOver == 4 ? 'on' : '']">판매완료 된 물품</li>
                </ul>
                <div class="my_cnt_wrap">                    
                    <!--판매등록 한 물품-->                    
                    <div class="my_cnt" v-if="tabOver == 1">                               
                        <div class="my_table">
                            <table class="cnt_list_wrap" id="cntListWrap1">
                                <colgroup>
                                    <col style="width:12%" />
                                    <col style="width:6%" />
                                    <col style="width:10%" />
                                    <col style="width:35%" />
                                    <col style="width:14%" />
                                    <col style="width:10%" />
                                    <col style="width:12%" />
                                </colgroup>
                                <thead class="cnt_list_title">
                                    <tr>
                                        <th class="li_wd1_1">물품번호</th>
                                        <th class="li_wd1_2">유형</th>
                                        <th class="li_wd1_3">종류</th>
                                        <th class="li_wd1_4">물품제목</th>
                                        <th class="li_wd1_5">수량</th>
                                        <th class="li_wd1_6">가격</th>
                                        <th class="li_wd1_7">등록일시</th>
                                    </tr>
                                </thead>   
                                <tbody class="loading_area" v-if="loading">
                                    <tr>
                                        <td colspan="7">
                                            <beat-loader class="loading_img" :color="color" :loading="loading" :size="10"></beat-loader>
                                        </td>           
                                    </tr>
                                </tbody>                             
                                <tbody  v-if="loading == false">                                    
                                    <tr v-for="sell in sellList1" :key="sell.index">
                                        <td class="li_wd1_1">{{sell.itemSeq}}</td>
                                        <td class="li_wd1_2">{{sell.itemAddType}}</td>
                                        <td class="li_wd1_3">{{sell.itemType}}</td>
                                        <td class="li_wd1_4">
                                            {{sell.subject}}<br/><b>{{sell.gameName}} - {{sell.gameServerName}}</b>
                                        </td>
                                        <td class="li_wd1_5" v-if="sell.itemAddType == '일반'">
                                            {{sell.unit}}
                                        </td>
                                        <td class="li_wd1_5" v-else>
                                           {{sell.minQuantity}} ~ {{sell.maxQuantity}}
                                        </td>
                                        <td class="li_wd1_6">{{sell.price}}</td>
                                        <td class="li_wd1_7">{{sell.regDate}}</td>
                                    </tr>
                                    <tr v-if="totalCount == 0">
                                        <td colspan="7" style="height:440px;">리스트가 없습니다.</td>
                                    </tr>                            
                                </tbody>
                            </table>
                        </div>
                        <Paginate v-show="totalCount !== 0 && loadingPage== false"
                            :page-count="pageNum"
                            :page-range="3"
                                :click-handler="Mypage1"   
                                :prev-text="'◀'"
                                :next-text="'▶'"
                                :container-class="'containerClass'"
                                :forcePage="currentPage1"
                            >
                            </Paginate> 
                        </div>
                        <!--결제대기 중 물품-->
                        <div class="my_cnt" v-if="tabOver == 2">
                            <div class="my_table">
                                <table class="cnt_list_wrap" id="cntListWrap2">
                                    <colgroup>
                                        <col style="width:11%" />
                                        <col style="width:11%" />
                                        <col style="width:10%" />
                                        <col style="width:31%" />
                                        <col style="width:14%" />
                                        <col style="width:10%" />
                                        <col style="width:12%" />
                                    </colgroup>
                                    <thead class="cnt_list_title">
                                        <tr>
                                            <th class="li_wd1_1">거래번호</th>
                                            <th class="li_wd1_2">물품번호</th>
                                            <th class="li_wd1_3">종류</th>
                                            <th class="li_wd1_4">물품제목</th>
                                            <th class="li_wd1_5">수량</th>
                                            <th class="li_wd1_6">가격</th>
                                            <th class="li_wd1_7">마감일시</th>
                                        </tr>
                                    </thead>
                                    <tbody class="loading_area" v-if="loading">
                                        <tr>
                                            <td colspan="7">
                                                <beat-loader class="loading_img" :color="color" :loading="loading" :size="10"></beat-loader>
                                            </td>           
                                        </tr>
                                    </tbody>  
                                    <tbody v-if="loading == false">
                                        <tr v-for="sell in sellList2" :key="sell.index">
                                            <td class="li_wd1_1">{{sell.tranSeq}}</td>
                                            <td class="li_wd1_2">{{sell.itemSeq}}</td>
                                            <td class="li_wd1_3">{{sell.itemType}}</td>
                                            <td class="li_wd1_4">
                                            {{sell.subject}}<br/><b>{{sell.gameName}} - {{sell.gameServerName}}</b>
                                            </td>
                                            <td class="li_wd1_5">{{sell.wantQuantity}}</td>
                                            <td class="li_wd1_6">{{sell.price}}</td>
                                            <td class="li_wd1_7">{{sell.tranEndDate}}</td>
                                        </tr>
                                        <tr v-if="totalCount == 0">
                                            <td colspan="7" style="height:440px;">리스트가 없습니다.</td>
                                        </tr>  
                                    </tbody>
                                </table>
                            </div>
                            <Paginate v-show="totalCount !== 0 && loadingPage == false"
                                :page-count="pageNum"
                                :page-range="3"
                                :click-handler="Mypage2"   
                                :prev-text="'◀'"
                                :next-text="'▶'"
                                :container-class="'containerClass'"
                                :forcePage="currentPage2"
                                >
                            </Paginate>
                        </div>
                        <!--판매진행 중 물품-->
                        <div class="my_cnt" v-if="tabOver == 3">
                            <div class="my_table">
                                <table class="cnt_list_wrap" id="cntListWrap3">
                                    <colgroup>
                                        <col style="width:11%" />
                                        <col style="width:11%" />
                                        <col style="width:10%" />
                                        <col style="width:31%" />
                                        <col style="width:14%" />
                                        <col style="width:10%" />
                                        <col style="width:12%" />
                                    </colgroup>
                                    <thead class="cnt_list_title">
                                        <tr>
                                            <th class="li_wd1_1">거래번호</th>
                                            <th class="li_wd1_2">물품번호</th>
                                            <th class="li_wd1_3">종류</th>
                                            <th class="li_wd1_4">물품제목</th>
                                            <th class="li_wd1_5">수량</th>
                                            <th class="li_wd1_6">가격</th>
                                            <th class="li_wd1_7">마감일시</th>
                                        </tr>
                                    </thead>
                                    <tbody class="loading_area" v-if="loading">
                                        <tr>
                                            <td colspan="7">
                                                <beat-loader class="loading_img" :color="color" :loading="loading" :size="10"></beat-loader>
                                            </td>           
                                        </tr>
                                    </tbody> 
                                    <tbody v-if="loading == false">
                                        <tr v-for="sell in sellList3" :key="sell.index">
                                            <td class="li_wd1_1">{{sell.tranSeq}}</td>
                                            <td class="li_wd1_2">{{sell.itemSeq}}</td>
                                            <td class="li_wd1_3">{{sell.itemType}}</td>
                                            <td class="li_wd1_4">
                                            {{sell.subject}}<br/><b>{{sell.gameName}} - {{sell.gameServerName}}</b>
                                            </td>
                                            <td class="li_wd1_5">{{sell.wantQuantity}}</td>
                                            <td class="li_wd1_6">{{sell.price}}</td>
                                            <td class="li_wd1_7">{{sell.tranEndDate}}</td>
                                        </tr>
                                        <tr v-if="totalCount == 0">
                                            <td colspan="7" style="height:440px;">리스트가 없습니다.</td>
                                        </tr>  
                                    </tbody>
                                </table>
                            </div>        
                            <Paginate v-show="totalCount !== 0 && loadingPage == false"
                                :page-count="pageNum"
                                :page-range="3"
                                :click-handler="Mypage3"   
                                :prev-text="'◀'"
                                :next-text="'▶'"
                                :container-class="'containerClass'"
                                :forcePage="currentPage3"                            
                                >
                            </Paginate>
                        </div>
                        <!--판매완료 된 물품-->
                        <div class="my_cnt" v-if="tabOver == 4">
                            <div class="my_table">
                                <table class="cnt_list_wrap" id="cntListWrap4">
                                    <colgroup>
                                        <col style="width:11%" />
                                        <col style="width:11%" />
                                        <col style="width:10%" />
                                        <col style="width:31%" />
                                        <col style="width:14%" />
                                        <col style="width:10%" />
                                        <col style="width:12%" />
                                    </colgroup>
                                    <thead class="cnt_list_title">
                                        <tr>
                                            <th class="li_wd1_1">거래번호</th>
                                            <th class="li_wd1_2">물품번호</th>
                                            <th class="li_wd1_3">종류</th>
                                            <th class="li_wd1_4">물품제목</th>
                                            <th class="li_wd1_5">수량</th>
                                            <th class="li_wd1_6">가격</th>
                                            <th class="li_wd1_7">결제완료일시</th>
                                        </tr>
                                    </thead>
                                    <tbody class="loading_area" v-if="loading">
                                        <tr>
                                            <td colspan="8">
                                                <beat-loader class="loading_img" :color="color" :loading="loading" :size="10"></beat-loader>
                                            </td>           
                                        </tr>
                                    </tbody> 
                                    <tbody v-if="loading == false">
                                        <tr v-for="sell in sellList4" :key="sell.index">
                                            <td class="li_wd1_1">{{sell.tranSeq}}</td>
                                            <td class="li_wd1_2">{{sell.itemSeq}}</td>
                                            <td class="li_wd1_3">{{sell.itemType}}</td>
                                            <td class="li_wd1_4">
                                            {{sell.subject}}<br/><b>{{sell.gameName}} - {{sell.serverName}}</b>
                                            </td>
                                            <td class="li_wd1_5">{{sell.wantQuantity}}</td>
                                            <td class="li_wd1_6">{{sell.price}}</td>
                                            <td class="li_wd1_7">{{sell.tranStartDate}}</td>
                                        </tr>
                                        <tr v-if="totalCount == 0">
                                            <td colspan="7" style="height:440px;">리스트가 없습니다.</td>
                                        </tr>  
                                    </tbody>
                                </table>
                            </div>
                            <Paginate v-show="totalCount !== 0 && loadingPage == false" 
                                :page-count="pageNum"
                                :page-range="3"
                                :click-handler="Mypage4"   
                                :prev-text="'◀'"
                                :next-text="'▶'"
                                :container-class="'containerClass'"
                                :forcePage="currentPage4"
                                >
                            </Paginate> 
                        </div>
                    </div> 
                    <div class="how_img_wrap">
                        <p class="how1">팝니다 게시판에 판매물품이 등록된 상태입니다.</p>
                        <p class="how2">구매자의 구매 신청 후 결제하기 전 단계 입니다.</p>
                        <p class="how3">구매자가 결제를 완료한 단계로 판매자에게 SMS가 발송되며, 구매자의 정보확인이 가능합니다.게임상에서 물품거래를 진행해 주세요.</p>
                        <p class="how4">구매자에게 물품을 전달하고 판매확정 버튼을 클릭하세요.</p>
                        <p class="how5">구매자가 구매확정을 완료하면 거래가 종료됩니다.</p>
                    </div>           
                </div>
            </div>       
        </transition>
     </div>
  </div>
</template>

<script>
import login from './components/login'
import gameReg from './components/gameReg'
import { mypage } from './mixins/mypage.js'
import Paginate from './components/Paginate'
import { BeatLoader } from '@saeris/vue-spinners'

export default {
    data(){
        return {
            baseURI : 'https://openapi.itembay.com/',
            token : '', 
            hideLogin : true, 
            tokenShow : false,  
            msg : '',
            games : [],               
            loadingShow: false,
            regNum : 1,
            cmpns : [],
            cmpnTab : [1],     
            gameTabData: [],
            gameNum : 1,
            sellList1: [],
            sellList2: [],
            sellList3: [],
            sellList4: [],
            tabOver: 1,
            gameTabOver : 1,
            totalCount: 1,          
            limit : 10,
            pageNum : 1,
            currentPage1 : 1,
            currentPage2 : 1,
            currentPage3 : 1,
            currentPage4 : 1,
            page : 1,
            loading : true,
            loadingPage : true,
            color : '#9013fe',
            topNav : false,
        }
    },
    methods:{
       
        // login
        HideFade(tokenShow, hideLogin, msg){
            this.tokenShow = tokenShow;
            this.hideLogin = hideLogin;
            this.msg = msg;
        },  
         // 게임 검색  불러오기 
        Games(){    
            this.$nextTick(function(){
                this.$axios.get(`${this.baseURI}common/games`, {
                    headers : {Authorization : 'Bearer ' +  this.token}
                })
                .then(response => {
                    let searchTotal = response.data.searchTotalCount;               
                
                    for(let i=0; i < searchTotal; i++){
                    this.games.push(response.data.gameList[i])
                    }            
                    this.loadingShow = true;    
                    this.cmpns.push('gameReg');
                    this.Mypage1();  
                })     
                .catch(e => {
                    alert(e.response.data.message);
                })
            })            
        },
        // 첫화면으로   
        goLogin(){
           location.reload(true);
        },
        // 게임추가
        AddGame(){
            this.gameNum++;
            if(this.gameNum < 5){
                this.cmpns.push('gameReg') //컴퍼넌트 네임
                this.cmpnTab.push(this.gameNum)   
                this.gameTabData.push({gameName:'게임', serverName:'서버'})
            }else{
                alert('탭은 4개까지만 가능합니다.')
            };
        },  
        // 탭 네임변경
        gameTabName(gameName,serverName,gameTabNum){
            if (this.gameTabData[gameTabNum-1] === undefined) {
                this.gameTabData.push({gameName:gameName, serverName:serverName, gameTabNum:gameTabNum});
            } else {
                this.gameTabData.splice(parseInt(gameTabNum, 10) - 1, 1,{gameName:gameName, serverName:serverName, gameTabNum:gameTabNum});
            }
        },
    },     
    created() {
        this.gameTabData.push({gameName:'게임', serverName:'서버'})
    },
    components:{
       login,
       gameReg,
       Paginate,
       BeatLoader,
    },     
    mixins : [mypage]
}
</script>

<style>
* {margin:0;padding:0;font-family:nanum;font-size:13px;letter-spacing:-1px;color:#2d2d2d;}
body  {
    width:100%;
    min-width:1500px;
    margin:0;
    padding:0;
    background: #49d0a0;
    background: -moz-linear-gradient(-45deg, #49d0a0 0%, #7b60b3 62%, #7434c9 100%);
    background: -webkit-linear-gradient(-45deg, #49d0a0 0%,#7b60b3 62%,#7434c9 100%);
    background: linear-gradient(135deg, #49d0a0 0%,#7b60b3 62%,#7434c9 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#49d0a0', endColorstr='#7434c9',GradientType=1 );    
    }
#app {overflow:hidden;width:100%;}
.wrap {position:relative;width:1500px;min-height:902px;margin:50px auto 0;padding:0;}
div#member_header {position:relative;height:20px; padding:20px 30px;background:#fff;border-bottom:1px solid #dedede;}
div#member_header a.member_logo {display:block;width:285px;height:24px;background:url('http://trade.itembay.com/resources/image/design/main/20140411/logo20181108.png') no-repeat 0 0 !important}
div#member_header a.member_tg {float:right;width:24px; height:24px;background-image:url('http://trade.itembay.com/resources/image/design/main/20140411/layout20141119.png');background-repeat:no-repeat;background-position:-976px -68px; text-indent:-9999px; font-size:0px;}
div#member_header a.member_tg.close {background-position:-976px -91px !important; }
div#member_header .top_nav_wrap {overflow:hidden;float:right;width:255px;margin-right:5px;}
div#member_header ul.member_tg_ul {overflow:hidden;width:260px; margin:5px 10px 0 0; height:15px;list-style:none}
div#member_header ul.member_tg_ul li {float:left;padding:0 2px;}
a.wbg{ overflow:hidden}
a.wbg span{ position:absolute;z-index:-1;top:-200px}
.wbg{float:left;position:relative;zoom:1}

.topNavLi {transition: all 0.6s ease;}
.topNavLi-enter-active {transition:0s ease;transform: translateX(250px);}
.topNavLi-leave-active {transition: all 0.6s ease;transform: translateX(280px);}


.top_area {overflow:hidden;}
.top_lef_area {overflow:hidden;float:left;margin:0 0 10px 5px;line-height:25px;}
.top_lef_area h1 {float:left;margin-right:10px;font-family:notoKR;font-size:18px;color:#383838;}
.top_lef_area span {height:24px;margin:0 0 0 5px;font-family:notoKR;font-size:15px;font-weight:500;color:#383838;}
.top_rig_area {overflow:hidden;float:right;}
.top_rig_area a {display:block;float:right;width:107px;height:26px;line-height:26px;margin-left:5px;font-family:dotum;font-size:12px;border:1px solid #d3d3d3;text-align:center;color:#787878;text-decoration:none;letter-spacing:0;}
.top_rig_area a:hover {background:#495161;border:1px solid #495161;color:#fff;}

.reg_wrap {float:left;width:700px;min-height:1115px;padding:15px 15px 0;margin:10px;background:#fff;border-radius:10px;}
.fadeLogin-enter-active, .fadeLogin-leave-active {transition: opacity 0.7s ease-out;}
.fadeLogin-enter, .fadeLogin-leave-to {opacity: 0;}
.token_area {overflow:hidden;width:700px;clear:both;margin:50px auto 10px;}
.token_area .token_txt {width:700px;padding:10px;border-radius:5px;background:rgb(255, 255, 255, 1);border:1px solid #c5c5c5;word-break:break-all;text-align:justify;white-space:normal;color:#2d2d2d;box-sizing:border-box}
.token_area input {float:left;width:610px;height:30px;padding:5px;text-indent:5px;border-radius:5px;background:rgb(255, 255, 255, 1);border:1px solid #c5c5c5;color:#2d2d2d;box-sizing:border-box;}
.token_area button {
    display:block;    
    width:85px;
    height:30px;
    padding:0;
    margin:0 0 0 5px;
    border:0;
    line-height:25px;
    -moz-box-shadow:inset 0px 1px 0px 0px #ffffff;
	-webkit-box-shadow:inset 0px 1px 0px 0px #ffffff;
	box-shadow:inset 0px 1px 0px 0px #ffffff;
	background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #f9f9f9), color-stop(1, #e9e9e9));
	background:-moz-linear-gradient(top, #f9f9f9 5%, #e9e9e9 100%);
	background:-webkit-linear-gradient(top, #f9f9f9 5%, #e9e9e9 100%);
	background:-o-linear-gradient(top, #f9f9f9 5%, #e9e9e9 100%);
	background:-ms-linear-gradient(top, #f9f9f9 5%, #e9e9e9 100%);
	background:linear-gradient(to bottom, #f9f9f9 5%, #e9e9e9 100%);
	filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#f9f9f9', endColorstr='#e9e9e9',GradientType=0);
	background-color:#f9f9f9;
	-moz-border-radius:6px;
	-webkit-border-radius:6px;
	border-radius:6px;
	border:1px solid #dcdcdc;
	display:inline-block;
	cursor:pointer;
	color:#666666;
	font-family:Arial;
	font-size:13px;
	font-weight:600;
	text-decoration:none;
	text-shadow:0px 1px 0px #ffffff;
}
.token_area .token_btn {float:left;}
.token_area .goLogin_btn {margin:5px 0 0;float:right;}
.token_msg {height:16px;margin-bottom:20px;font-size:12px;font-weight:600;text-align:center;color:#ff0000}
.fade-table-enter-active {transition:opacity 1.3s;}
.fade-table-enter {opacity:0}
/* game tab */
.reg_tab_wrap {overflow:hidden;margin-bottom:10px;list-style:none;}
.reg_tab_wrap li {position:relative;overflow:hidden;float:left;min-width:100px;height:30px;margin:0 2px 3px 0;padding:5px 10px;border-bottom:1px solid #c5c5c5;line-height:30px;text-align:center;border-top-left-radius:5px;border-top-right-radius:5px;border-top:1px solid #c5c5c5;border-left:1px solid #c5c5c5;border-right:1px solid #c5c5c5;cursor:pointer}
.reg_tab_wrap li .close_btn {display:block;position:absolute;top:0px;right:0px;width:15px;height:15px;font-family:nanum;font-size:11px;line-height:15px;}
.reg_tab_wrap li.on {background:#727272;}
.reg_tab_wrap li.on span {color:#fff;}
.reg_tab_wrap li b {color:#0ec6be}
/* mypage */
.my_title {width:87px;margin:50px auto 0;}
.my_tab_wrap {overflow:hidden;width:652px;margin:18px 24px 0;list-style:none;}
.my_tab_wrap li {position:relative;float:left;width:161px;height:35px;margin:0 1px;background:#fff;border:1px solid #c5c5c5;border-top-left-radius:5px;border-top-right-radius:5px;font-size:13px;font-weight:600;color:#979797;text-align:center;line-height:35px;box-sizing:border-box;cursor:pointer}
.my_tab_wrap li.on {border:0 none;background:#9681d5;color:#fff;}
.my_tab_wrap li:before {position:absolute;top:1px;left:1px;content:'';width:167px;height:33px;background: -moz-linear-gradient(-45deg,  rgba(255,255,255,1) 0%, rgba(255,255,255,0.3) 19%, rgba(255,255,255,0) 100%);background: -webkit-linear-gradient(-45deg,  rgba(255,255,255,1) 0%,rgba(255,255,255,0.3) 19%,rgba(255,255,255,0) 100%);background: linear-gradient(135deg,  rgba(255,255,255,1) 0%,rgba(255,255,255,0.3) 19%,rgba(255,255,255,0) 100%);filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#00ffffff',GradientType=1 );border-radius:5px;text-shadow:1px 1px 1px #6d498e;}
.my_cnt_wrap {overflow:hidden;width:652px;min-height:605px;margin:0 24px;}
.my_cnt {margin-top:20px;}
.my_table {min-height:490px}
.cnt_list_wrap {overflow:hidden;width:100%;border-spacing:0;border-collapse:collapse;}
.cnt_list_wrap .cnt_list_title {width:652px;height:38px;background:#e8e9f6;border-top:1px solid #c5c5c5;border-bottom:1px solid #c5c5c5;line-height:38px;list-style:none}
.cnt_list_wrap .cnt_list_title th {font-weight:600;font-size:12px;text-align:center;color:#596196;}
.cnt_list_wrap tbody {overflow:hidden;list-style:none;}
.cnt_list_wrap tbody td {padding:5px 0;font-size:12px;border-bottom:1px solid #c5c5c5;text-align:center;vertical-align:middle}
.cnt_list_wrap tbody td.li_wd1_2 {color:#3fc7c7}
.cnt_list_wrap tbody td.li_wd1_4 {overflow:hidden;min-width:176px;text-align:left;padding-left:5px;text-overflow:ellipsis;white-space:normal}
.cnt_list_wrap tbody td.li_wd1_4 b {font-weight:500;color:#00a0dd}
.cnt_list_wrap tbody td.li_wd1_5 {color:#cd0e04}
.cnt_list_wrap tbody td.li_wd1_6 {color:#ff7b2b}
.loading_area {height:440px;line-height:440px;text-align:center}
.loading_area tr td {border-bottom:0 none}
.how_img_wrap {position:relative;overflow:hidden;width:692px;height:280px;margin:0 auto;background:url('./assets/sell_bg.jpg')}
.how_img_wrap p {position:absolute;font-family:dotum;font-size:11px;color:#2d2d2d;text-align:justify;line-height:16px;}
.how1 {top:170px;left:12px;width:120px}
.how2 {top:170px;left:145px;width:120px}
.how3 {top:170px;left:278px;width:120px}
.how4 {top:170px;left:410px;width:120px}
.how5 {top:170px;left:545px;width:120px}
</style>
