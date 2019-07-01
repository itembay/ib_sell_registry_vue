export const gameSearch = {  
    methods: {
          // 서버 검색  불러오기
          GameServer(event){
                
                if(event.target.value == '3360' || event.target.value == '3361' || event.target.value == '3362'){
                    this.etcGameType = true;
                } else {
                    this.etcGameType = false;
                }

                this.$axios.get(`${this.parentUrl}common/games/${event.target.value}/servers`, {
                    headers : {Authorization : 'Bearer ' +  this.tokenCode}                   
                })
                .then(response => {
                    var searchTotalCount = response.data.searchTotalCount;
                    var searchData = response.data;
                    
                    this.gameServers = [];
                    for(var i = 0; i < searchTotalCount; i++){
                        this.gameServers.push(searchData.gameServerList[i])
                    }                    
                })
                .catch(e => {
                    alert(e.response.data.message);
                })
            
        },
    }
}