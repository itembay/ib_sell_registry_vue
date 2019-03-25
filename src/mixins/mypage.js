export const mypage = {
    methods: {
        // 마이페이지 로딩액션 
        LoadingAct(){
            this.loading = true;
            
            this.$nextTick(() => {
                setTimeout(() => {
                    this.loading = false;
                    this.loadingPage = false;
                },400)
            })
        },
        // 판매등록한 물품
        Mypage1(index){
            this.LoadingAct();
            
            if(index !== undefined){
                this.currentPage1 = index;                
            }                     
            this.$axios.get(`${this.baseURI}v1/mypage/sell/registration`,{
                params : {limit : this.limit , pageNo : this.currentPage1},
                headers : {Authorization : 'Bearer ' +  this.token},           
            })
            .then(response => {              
                let listTotalCount = response.data.list.length;
                this.totalCount = response.data.totalCount;
                this.sellList1=[];
                for(let i = 0; i < listTotalCount; i++){
                    this.sellList1.push(response.data.list[i])
                }                    
                if( this.totalCount % this.limit !== 0 ){
                    this.pageNum = parseInt(this.totalCount / this.limit + 1)
                }else if (this.totalCount % this.limit == 0){
                    this.pageNum = this.totalCount / this.limit
                }                    
            }) 
            .catch(e => {
				alert(e.response.data.message);
			})     
        },
        // 결제 대기 중 물품
        Mypage2(index){
            this.LoadingAct();
            
            if(index !== undefined){
                this.currentPage2 = index;                
            }     
            this.$axios.get(`${this.baseURI}v1/mypage/sell/approve-wait`,{
                params : {limit : this.limit , pageNo : this.currentPage2},
                headers : {Authorization : 'Bearer ' +  this.token}
            })
            .then(response => {
                let listTotalCount = response.data.list.length;
                this.totalCount = response.data.totalCount;
                this.sellList2=[];
                for(let i = 0; i < listTotalCount; i++){
                    this.sellList2.push(response.data.list[i])
                }                    
                if( this.totalCount % this.limit !== 0 ){
                    this.pageNum = parseInt(this.totalCount / this.limit + 1)
                }else if (this.totalCount % this.limit == 0){
                    this.pageNum = this.totalCount / this.limit
                }     
            })
            .catch(e => {
				alert(e.response.data.message);
			})
        },
        // 판매진행 중 물품
        Mypage3(index){
            this.LoadingAct();
            
            if(index !== undefined){
                this.currentPage3 = index;                
            }     
            this.$axios.get(`${this.baseURI}v1/mypage/sell/on-sale`,{
                params : {limit : this.limit , pageNo : this.currentPage3 },
                headers : {Authorization : 'Bearer ' +  this.token},                
            })
            .then(response => {
                let listTotalCount = response.data.list.length;
                this.totalCount = response.data.totalCount;
                this.sellList3=[];
                for(let i = 0; i < listTotalCount; i++){
                    this.sellList3.push(response.data.list[i])
                }                    
                if( this.totalCount % this.limit !== 0 ){
                    this.pageNum = parseInt(this.totalCount / this.limit + 1)
                }else if (this.totalCount % this.limit == 0){
                    this.pageNum = this.totalCount / this.limit
                }     
            })
            .catch(e => {
				alert(e.response.data.message);
			})
        },
        // 판매완료된 물품
        Mypage4(index){
            this.LoadingAct();
           
            if(index !== undefined){
                this.currentPage4 = index;                
            }     
            this.$axios.get(`${this.baseURI}v1/mypage/sell/complete`,{
                params : {limit : this.limit , pageNo : this.currentPage4 },
                headers : {Authorization : 'Bearer ' +  this.token},                
            })
            .then(response => {
                let listTotalCount = response.data.list.length;
                this.totalCount = response.data.totalCount;
                this.sellList4=[];
                for(let i = 0; i < listTotalCount; i++){
                    this.sellList4.push(response.data.list[i])
                }                    
                if( this.totalCount % this.limit !== 0 ){
                    this.pageNum = parseInt(this.totalCount / this.limit + 1)
                }else if (this.totalCount % this.limit == 0){
                    this.pageNum = this.totalCount / this.limit
                }    
            })
            .catch(e => {
				alert(e.response.data.message);
			})
        },
    }
}