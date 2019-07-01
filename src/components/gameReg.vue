<template>
    <div class="gameReg" :id="'gameReg'+ (parentGameNum)"> 
        <!-- 자동동록중 일 때-->    
        <div class="game_wrap_loading" v-if="gameLoading">
            <pacman-loader class="loading_img" :color="load_color" :loading="gameLoading" :size="25"></pacman-loader>
            <p>등록이 <b>{{ongoing_txt}}</b> 번  남았습니다. </p>
        </div>  
        <!-- 등록이 끝난 후 팝업 -->
        <div class="reg_pop" v-if="regFinish" @click="regFinish=false">
            <p>확인</p>
        </div>
        <div class="table">
            <div class="tb">
                <p class="tb_title">카테고리{{parentGameNum}}</p>
                <div class="tb_txt">
                    <select @change="GameServer($event)" class="gameSelect1" v-model="gameSeq" :name="'gameSelect' + parentGameNum">
                        <option disabled value>게임검색</option>
                        <option v-for="game in parentGame" :key="game.gameSeq" :value="game.gameSeq">
                            {{game.gameName}}
                        </option>
                    </select>
                    <select class="gameSelect2" @change="gameTabTitle(parentGameNum,)" v-model="gameServerSeq" :name="'gameServerSelect' + parentGameNum"> 
                        <option disabled value>서버검색</option>
                        <option v-for="gameServer in gameServers" :key="gameServer.gameServerSeq" :value="gameServer.gameServerSeq">
                            {{gameServer.serverName}}
                        </option>
                    </select>
                </div>            
            </div>
            <div class="tb">
                <p class="tb_title">물품등록방법</p>
                <div class="tb_txt">
                    <p class="trade_type1">
                        <input type="radio" :id="'tiSellTradeType'+ parentGameNum" :name="'tiTradeType' + parentGameNum" @change="selectCnt1" v-model="sellChecked" v-bind:value="sell" />
                        <label slot="type2" :for="'tiSellTradeType'+ parentGameNum">일반판매</label>
                    </p>
                    <p class="trade_type1">
                    <p class="trade_type1">
                        <input type="radio" :id="'tiDivisionTradeType'+ parentGameNum" :name="'tiTradeType' + parentGameNum" @change="selectCnt1" v-model="sellChecked" v-bind:value="sellDiv" />
                        <label :for="'tiDivisionTradeType' + parentGameNum">분할판매</label>
                    </p>
                    <p class="f_comment1">{{sellText1}}</p>
                </div>            
            </div>          
            <div class="tb">
                <p class="tb_title">종류</p>
                <div class="tb_txt">
                    <p class="trade_type1" v-if="etcGameType == false">
                        <input type="radio" :id="'rdbItemType_Money' + parentGameNum" :name="'rdbItemType' + parentGameNum" @change="selectCnt2" v-model="itemType"  v-bind:value="sellGameMoney" />
                        <label :for="'rdbItemType_Money' + parentGameNum">게임머니</label>
                    </p>
                    <p class="trade_type1" v-if="etcGameType == false">
                        <input type="radio" :id="'rdbItemType_Item' + parentGameNum" :name="'rdbItemType' + parentGameNum" @change="selectCnt2" v-model="itemType" v-bind:value="sellItem" />
                        <label :for="'rdbItemType_Item' + parentGameNum">아이템</label>
                    </p>
                    <p class="trade_type1">
                        <input type="radio" :id="'rdbItemType_Etc' + parentGameNum" :name="'rdbItemType' + parentGameNum" @change="selectCnt2"  v-model="itemType" v-bind:value="sellEtc"/>
                        <label :for="'rdbItemType_Etc' + parentGameNum">기타</label>
                    </p>
                </div>            
            </div> 
            <div class="tb">
                <p class="tb_title">자동등록횟수</p>
                <div class="tb_txt">
                    <p class="trade_type1">
                        <input type="radio" :id="'autoRegNO' + parentGameNum" :name="'autoReg' + parentGameNum" v-model="autoReg" v-bind:value="0" />
                        <label :for="'autoRegNO' + parentGameNum">설정안함</label>
                    </p>
                    <p class="trade_type1">
                        <input type="radio" :id="'autoRegOk' + parentGameNum" :name="'autoReg' + parentGameNum" v-model="autoReg" v-bind:value="1" />
                        <label :for="'autoRegOk' + parentGameNum">설정함</label>
                    </p>                    
                    <select v-model="time" class="selec_time" v-if="autoReg == 1">
                        <option disabled value>시간</option>
                        <option :value="16">16초 마다</option>
                        <option :value="20">20초 마다</option>
                        <option :value="25">25초 마다</option>
                        <option :value="30">30초 마다</option>
                        <option :value="60">1분 마다</option>
                    </select>                   
                    <input type="text" style="width:60px;" v-model="num" placeholder="등록 횟수 입력하세요"  v-if="autoReg == 1"/>
                </div>        
            </div>
            <div class="tb_wrap">
                <div class="tb" v-if="sellChecked == 0">
                    <p class="tb_title">수량</p>
                    <div class="tb_txt">
                        <input type="text" :id="'txtWantQuantity' + parentGameNum" :name="'txtWantQuantity' + parentGameNum" v-model="wantQuantity" @change="numberComma(wantQuantity,1)"/>
                        <span>{{sellText2}}</span>
                    </div>
                </div>               
                <div class="tb" v-if="sellChecked == 0">
                    <p class="tb_title">판매가격</p>
                    <div class="tb_txt">
                        <input type="text" :id="'txtWantPrice' + parentGameNum" :name="'txtWantPrice' + parentGameNum" v-model="price"  @change="numberComma(price,2)"  />
                    </div>
                </div>
                 <div class="tb" v-if="sellChecked == 1">
                    <p class="tb_title">분할단위/가격</p>
                    <div class="tb_txt">
                        <input type="text" class="inp_1" :id="'txtWantQuantity' + parentGameNum" :name="'tiBasePriceUnit' + parentGameNum" v-model="baseQuantity"  @change="numberComma(baseQuantity,3)" /> <span>{{sellText2}} 당</span> <input type="text" class="inp_1" :id="'txtWantQuantity' + parentGameNum" :name="'tiBasePriceUnit' + parentGameNum" v-model="price" @change="numberComma(price,2)"/> <span>원에 판매 합니다</span>
                    </div>
                </div>
                <div class="tb" v-if="sellChecked == 1">
                    <p class="tb_title">수량</p>
                    <div class="tb_txt">
                        <span><b class="f_blue">최소</b> {{baseQuantity}} *</span> <input type="text" class="inp_2" :id="'txtWantQuantity' + parentGameNum" :name="'tiBasePriceUnit' + parentGameNum" v-model="minimumQuantity" @change="numberComma(minimumQuantity,4)"/> <span> = {{ baseQuantity * minimumQuantity }} ~ <b class="f_blue">최대</b> {{baseQuantity}} * <input type="text" class="inp_2" :id="'txtWantQuantity' + parentGameNum" :name="'tiBasePriceUnit' + parentGameNum" v-model="maximumQuantity"  @change="numberComma(maximumQuantity,5)" /> = {{ baseQuantity * maximumQuantity }}</span>
                    </div>
                </div>
                <div class="tb">
                    <p class="tb_title">물품제목</p>
                    <div class="tb_txt">
                        <input type="text" class="title_inp" :id="'txtSubject' + parentGameNum" :name="'txtSubject' + parentGameNum" maxlength="50" size="70" v-model="subject" />
                    </div>
                </div>
                <div class="tb" v-if="etcGameType == false">
                    <p class="tb_title">판매자 캐릭터명</p>
                    <div class="tb_txt">
                        <input type="text" class="char_inp" :id="'txtSellCharacter' + parentGameNum" :name="'txtSellCharacter' + parentGameNum" maxlength="50" v-model="sellCharacter" />
                        <span class="f_common2">물품을 인계하실 <b>본인</b>의 캐릭터명 </span> 
                    </div>            
                </div>
                <div class="tb">
                    <p class="tb_title tb_txtarea_title">상세설명</p>
                    <div class="tb_txt td_txtarea">
                        <textarea :id="'txtContents' + parentGameNum" :name="'txtContents' + parentGameNum" placeholder="게임머니 판매 합니다." v-model="contents" ></textarea>
                    </div>            
                </div>
            </div>
            <button class="submit_btn" v-if="sellChecked == 0" @click="AutoReg1()" >일반등록</button>
            <button class="submit_btn" v-else @click="AutoReg2()">분할등록</button>
        </div> 
    </div>
</template>

<script>  
import { gameSearch } from '../mixins/gameSearch'
import { register } from '../mixins/register'
import { sellSelect } from '../mixins/sellSelect'
import { PacmanLoader } from '@saeris/vue-spinners'
import numeral from 'numeral';

  export default {
    props : {
        'parentUrl' : String,
        'tokenCode' : String,
        'parentGame' : Array,
        'parentGameNum' : Number,
        'parentCurrentPage' : Number,
        'parentMypage' : Function
     },
     data(){
        return {                
            gameServers : [],   
            gameSeq : '',// 게임 일련번호       
            gameNmae : '',
            serverName : '',    
            gameServerSeq : '', // 게임서버 일련번호            
            sellChecked : '0',
            itemType : '0',// 0:아이템, 3:게임머니, 6:기타
            sell: '0', // 일반판매
            sellDiv: '1', // 분할판매
            sellGameMoney : '3', // 게임머니
            sellItem : '0', // 아이템
            sellEtc : '6', // 기타
            itemType : '3', // 종류
            wantQuantity :'', // 수량
            price:'', // 가격
            subject : '', // 물품제목
            contents: '', // 상세설명
            sellCharacter : '', // 판매자 캐릭터명
            baseQuantity: '1', // 분할단위
            minimumQuantity: '', // 최소
            maximumQuantity: '', // 최대   
            load_color : '#07B6AF',
            gameLoading : false,
            ongoing_txt : '',
            intervalReg : '',
            regFinish : false,
            msg : '',
            autoReg : '0',
            num : '',
            time : '',
            totalCount : 1,
            etcGameType : false
          }
    },
    methods:{
        // 게임탭 명 변경
        gameTabTitle(e){
            this.gameName = this.gameServers[0].gameName;
            let serverNameFind = this.gameServers.filter(gameServer =>{
               return gameServer.gameServerSeq == this.gameServerSeq
           });
            this.serverName = serverNameFind[0].serverName
            this.$emit('gameTabTitle', this.gameName, this.serverName, this.parentGameNum);           
        },
        // 숫자 콤마
        numberComma(val,eventNum){
            if(eventNum == 1){
                this.wantQuantity = numeral(val).format('0,0');
            }else if(eventNum == 2) {
                this.price = numeral(val).format('0,0');  
            }else if(eventNum == 3) {
                this.baseQuantity = numeral(val).format('0,0');  
            }else if(eventNum == 4) {
                this.minimumQuantity = numeral(val).format('0,0');  
            }else {
                this.maximumQuantity = numeral(val).format('0,0');  
            }      
        },
    },
    mixins : [gameSearch , register, sellSelect],
    components : {
        PacmanLoader
    }
}
</script>

<style>
/* game wrap */
.gameReg {position:relative;}
.game_wrap_loading {position:absolute;top:0;left:0;width:700px;height:773px}
.game_wrap_loading:before {display:block;content:'';width:700px;height:773px;background:#000;border-radius:5px;opacity:0.6}
.game_wrap_loading .loading_img {position:absolute;top:250px;left:292px;width:115px;height:50px;}
.game_wrap_loading p {position:absolute;top:320px;left:250px;width:200px;font-size:14px;font-weight:600;text-align:center;line-height:23px;color:#fff;}
.game_wrap_loading p b {font-size:15px;color:#0ec6be}
.reg_pop {position:absolute;top:150px;left:230px;width:240px;height:150px;background:#000;opacity:0.7;border-radius:5px;border:1px solid #dfdfdf;cursor:pointer}
.reg_pop:after {position:absolute;top:0;left:0;content:'등록되었습니다.';width:240px;height:150px;font-weight:600;text-align:center;line-height:135px;color:#fff;}
.reg_pop p {position:absolute;top:90px;left:71px;width:100px;padding:2px 0;background:#0ec6be;border-radius:5px;font-family:dotum;font-size:12px;font-weight:700;text-align:center;color:#000;}
.table {clear:right;width:700px;margin:0 auto;font-size:15px;}
.tb_wrap {overflow:visible}
.tb {overflow:hidden;width:100%;margin:0 0 10px;padding:0;/*background:#0ec6be;*/border-spacing:0;/*border:1px solid #dfdfdf;border-radius:30px;*/box-sizing:border-box;}
.tb_title {float:left;width:98px;min-height:34px;padding:10px 10px 10px 10px;background:#0ec6be;border:1px solid #fff;color:#fff;text-shadow:1px 1px 1px #0099af;font-size:13px;font-weight:600;text-align:center;line-height:32px;border-radius:5px;}
.tb_txt {float:left;width:570px;min-height:32px;margin-left:10px;padding:10px;border:1px solid #dfdfdf;text-align:left;line-height:32px;border-radius:5px;box-sizing:border-box;}
.tb_txt select {width:200px;height:32px;background:rgb(255, 255, 255, 0.5);border:1px solid #c5c5c5;color:#2d2d2d;vertical-align:top;border-radius:5px;}
.tb_txt button {
    height:32px;
    padding:0 10px;
    font-size:11px;
    border:1px solid #dcdcdc;
    border-radius:10px;
    background: -moz-linear-gradient(top,  #ffffff 0%, #f1f1f1 50%, #e1e1e1 51%, #f6f6f6 100%);
    background: -webkit-linear-gradient(top,  #ffffff 0%,#f1f1f1 50%,#e1e1e1 51%,#f6f6f6 100%); 
    background: linear-gradient(to bottom,  #ffffff 0%,#f1f1f1 50%,#e1e1e1 51%,#f6f6f6 100%); 
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#f6f6f6',GradientType=0 ); 
    vertical-align:top;   
    box-sizing:border-box; 
}
.tb_txt input[type=text] {height:30px;background:rgb(255, 255, 255, 1);border:1px solid #c5c5c5;border-radius:5px;color:#2d2d2d;text-indent:5px}
.trade_type1 {float:left;margin-right:10px}
.f_comment1 {font-size:12px;color:#763dc5;line-height:32px;}
.submit_btn {
    display:block;
    width:700px;
    height:40px;
    margin:25px auto 35px;
    border-radius:5px;
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
	border:1px solid #dcdcdc;
	cursor:pointer;
	color:#666666;
	font-family:Arial;
	font-size:15px;
	font-weight:bold;
	padding:6px 24px;
	text-decoration:none;
	text-shadow:0px 1px 0px #ffffff;
}
.submit_btn:hover{
    background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #e9e9e9), color-stop(1, #f9f9f9));
	background:-moz-linear-gradient(top, #e9e9e9 5%, #f9f9f9 100%);
	background:-webkit-linear-gradient(top, #e9e9e9 5%, #f9f9f9 100%);
	background:-o-linear-gradient(top, #e9e9e9 5%, #f9f9f9 100%);
	background:-ms-linear-gradient(top, #e9e9e9 5%, #f9f9f9 100%);
	background:linear-gradient(to bottom, #e9e9e9 5%, #f9f9f9 100%);
	filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#e9e9e9', endColorstr='#f9f9f9',GradientType=0);
	background-color:#e9e9e9;
}
.submit_btn:active {position:relative;top:1px;}
.inp_1 {width:130px;}
.inp_2 {width:80px;}
.selec_time {width:100px !important;}
.title_inp {width:515px;}
.char_inp {width:300px;}
.tb_txtarea_title {height:154px;line-height:154px;}
.td_txtarea {line-height:0;}
.td_txtarea textarea {width:535px;height:140px;padding:5px;background:rgb(255, 255, 255, 1);border:1px solid #c5c5c5;border-radius:5px;color:#2d2d2d;}
</style>
