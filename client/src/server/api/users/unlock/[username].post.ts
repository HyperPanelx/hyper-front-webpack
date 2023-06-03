import {getCookie, sendNoContent} from "h3";


export default defineEventHandler(async (ev : any)=>{
    const username=ev.context.params.username
    const {apiBase,cookieName}=useRuntimeConfig();
    const cookie=getCookie(ev,cookieName);
    if(username){
        try {
            const lockUserRequest=await $fetch(apiBase+'unlock-user',{
                query:{username:username},
                headers:{
                    'Content-Type':'application/json',
                    Authorization:`Bearer ${cookie}`
                },
            })
            sendNoContent(ev,200)
        }catch (err) {
            sendNoContent(ev,401)
        }
    }else{
        sendNoContent(ev,401)
    }


})