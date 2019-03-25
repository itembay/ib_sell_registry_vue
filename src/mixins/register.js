export const register = {
    methods: {
        // 일반 등록
        Register1() {         
            return this.$axios.post(`${this.parentUrl}v1/items/sell`, {
                gameSeq: this.gameSeq,
                gameServerSeq: this.gameServerSeq,
                itemType: this.itemType,
                wantQuantity: this.wantQuantity.replace(/[^0-9]/g,""),
                price: this.price.replace(/[^0-9]/g,""),
                subject: this.subject,
                contents: this.contents,
                sellCharacter: this.sellCharacter,
                recompenseMark: '0',
                paidRegistrationService: {
                    powerZoneService: '0',
                    bluePenService: '0',
                    boldPenService: '0',
                    iconService: '0',
                    reRegistrationServiceCount: '0',
                    reRegistrationServiceTime: '0',
                    chargeMileage : '0',
                    chargePoint : '0',
                    servicePaymentType: 'N'
                }                
            },
            {headers : {Authorization : 'Bearer ' +  this.tokenCode}})
            .then(response => {         
                this.parentMypage();    
                if (this.autoReg == 0) this.regFinish = true;
                
            })
            .catch(e => {          
                this.gameLoading = false;                       
                clearInterval(this.intervalReg);  
                alert(e.response.data.message); 
            })
        },
        // 분할 등록
        Register2(){
            this.$axios.post(`${this.parentUrl}v1/items/sell/division`, {
                gameSeq: this.gameSeq,
                gameServerSeq: this.gameServerSeq,
                itemType: this.itemType,
                baseQuantity: this.baseQuantity.replace(/[^0-9]/g,""),
                price: this.price.replace(/[^0-9]/g,""),
                minimumQuantity: this.minimumQuantity.replace(/[^0-9]/g,""),
                maximumQuantity: this.maximumQuantity.replace(/[^0-9]/g,""),
                subject: this.subject,
                contents: this.contents,
                sellCharacter: this.sellChatacter,
                recompenseMark: 0,
                paidRegistrationService: {
                    powerZoneService: 0,
                    bluePenService: 0,
                    boldPenService: 0,
                    iconService: 0,
                    reRegistrationServiceCount: 0,
                    reRegistrationServiceTime: 0,
                    chargeMileage: 0,
                    chargePoint: 0,
                    servicePaymentType:'N'
                }               
            },
            {headers : {Authorization : 'Bearer ' +  this.tokenCode}})
            .then(response => {           
                this.parentMypage();                 
                if (this.autoReg == 0) this.regFinish = true;
                
            })
            .catch(e => {
                this.gameLoading = false;  
                clearInterval(this.intervalReg); 
                alert(e.response.data.message);   
            })
        }, 
        // 자동등록
        SelecAutoReg(){
            if(this.sellChecked == 0){          //일반      
                this.Register1();
                this.gameLoading = true;
                this.ongoing_txt = this.num-1; 
                let repeat = 1;
                this.intervalReg = setInterval(() => {
                    this.Register1(); 
                    this.ongoing_txt = (this.num-1) - repeat;                       
                    repeat++;  
                    if(repeat >= (this.num)){
                        clearInterval(this.intervalReg); 
                        this.gameLoading = false;      
                        this.regFinish = true;           
                    }                    
                },this.time * 1000);    
            }else if(this.sellChecked == 1){    // 분할            
                this.Register2();
                this.gameLoading = true;
                this.ongoing_txt = this.num-1; 
                let repeat = 1;
                this.intervalReg = setInterval(() => {  
                    this.Register2();         
                    this.ongoing_txt = this.num-1 - repeat;
                    repeat++;   

                    if(repeat == (this.num-1)){
                        clearInterval(this.intervalReg);
                        this.gameLoading = false;     
                        this.regFinish = true;                           
                    }
                },this.time * 1000);     
            }
        }, 
        //  일반 최종 등록
        AutoReg1(){ 
            if(this.autoReg == '1'){
                this.SelecAutoReg();                                     
            }else{
                this.Register1();            
            }      
        },
        // 분할 최종 등록
        AutoReg2(){
            if(this.autoReg == '1'){
                this.SelecAutoReg();  
            }else{
                this.Register2();
            }  
        },
    }
}