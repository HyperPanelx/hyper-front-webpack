import {defineStore} from "pinia";
import {IUsers_Data,IServer_Status,Response} from "../utils/Types";
import {useLogout} from "../composables/useLogout";
import {envVariable, useAuthStore} from "../composables/useStates";



export const Dashboard=defineStore('dashboard',{
    state:()=>{
        return{
            sidebarCollapseFlag:false as boolean,
            showPreloaderFlag:false as boolean,
            fetchDashboardDataFlag:false as boolean,
            usersStatusData:[] as IUsers_Data[],
            serverStatus:{
                cpu:0,
                ram:0,
                disk:0,
                bandWidth:{
                    download:0,
                    upload:0,
                    downloadSpeed:0,
                    uploadSpeed:0,
                    speedUnit:''
                }
            } as IServer_Status
        }
    },
    actions:{
         async getServerUsageData (){
             ///.env
             const {apiBase}=envVariable()
             /// logout func
             const {logoutHandler}=useLogout()
             /// token for auth header
             const {token}=useAuthStore()
             /// turn on loader flag
            this.fetchDashboardDataFlag=false
            fetch(apiBase+'resource-usage',{
                headers:{
                    'Content-Type':'application/json',
                    Authorization:`Bearer ${token.value}`
                }
            }).
            then(response=>response.json()).
            then((response)=>{
                if(response.detail){
                    ///// if token is not valid user must be logged out and response = false
                    logoutHandler()
                }else{
                    const uploadSpeed=response[1]['Upload Speed']
                    const downloadSpeed=response[1]['Download Speed']
                    const download=response[1]['Download']
                    const upload=response[1]['Upload']
                    this.serverStatus={
                        cpu:response[0].cpu,
                        ram:response[0].mem,
                        disk:response[0].hdd,
                        bandWidth:{
                            download:Number(download.slice(0,download.length-2)) ,
                            upload: Number(upload.slice(0,upload.length-2)) ,
                            downloadSpeed:Number(downloadSpeed.slice(0,downloadSpeed.length-2)),
                            uploadSpeed:Number(uploadSpeed.slice(0,uploadSpeed.length-2)),
                            speedUnit:downloadSpeed.slice(downloadSpeed.length-2),
                        }
                    } as IServer_Status
                }
            }).catch(err=>{
                console.log(err)
            }).finally(()=>{
                // turn off loader flag
                this.fetchDashboardDataFlag=true
            })
        },
        async triggerInitialFetchData(){
            const {logoutHandler}=useLogout()
            ///.env
            const {apiBase}=envVariable()
            /// token for auth header
            const {token}=useAuthStore()
            /// turn on page loader flag
            this.showPreloaderFlag=true
            await this.getServerUsageData()
            await fetch(apiBase+'status-clients',{
                headers:{
                    'Content-Type':'application/json',
                    Authorization:`Bearer ${token.value}`
                }
            }).
            then(response=>response.json()).
            then((response)=>{
                if(response.detail){
                    logoutHandler()
                }else{
                    this.usersStatusData=[
                        {title:'All Users', number:response.all_users,theme:'indigo'},
                        {title:'Active Users', number:response.active_users, theme:'green'},
                        {title:'Online Users', number:response.active_users, theme:'blue'},
                        {title:'Blocked Users', number:response.disabled_users,theme:'red'},
                    ]
                }
            }).
            catch(err=>console.log(err)).
            finally(()=>{
                /// turn off page loader flag
                this.showPreloaderFlag=false
            })

        }
    }
})