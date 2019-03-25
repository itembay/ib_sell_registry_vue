export const sellSelect = {
    data(){
        return {
            sellText1 : '※ 물품을 한 번에 판매 하실 때 선택하세요.', 
            sellText2 : '게임머니', 
        }
    },
    methods : {
        // 일반, 분할
        selectCnt1(){   
            if (this.sellChecked == 0){
                this.sellText1 = '※ 물품을 한 번에 판매 하실 때 선택하세요.';              
            }else if(this.sellChecked == 1){
                this.sellText1 = '※ 물품을 여러 번 나누어 판매 하실 때 선택하세요.';
            }            
        },  
        // 게임머니 , 아이템, 기타
        selectCnt2(){   
            if (this.itemType == 3){
                this.data = 0;
                this.sellText2 = '게임머니';              
            }else if(this.itemType == 0){
                this.sellText2 = '개';
            }else if(this.itemType == 6){
                this.sellText2 = '개';
            }             
        }
    }
}