import {getCookie, readBody, sendNoContent,send} from "h3";
import {ICreate_User} from "~/utils/Types";
// @ts-ignore
export default defineEventHandler(async ev=>{
    const body:ICreate_User=await readBody(ev);
    const {apiBase,cookieName}=useRuntimeConfig();
    const cookie=getCookie(ev,cookieName);
    try {
        const createUserRequest=await $fetch(apiBase+'add-user',{
            headers:{
                'Content-Type':'application/json',
                Authorization:`Bearer ${cookie}`
            },
            query:{
                username:body.username,
                multi:body.concurrent_user,
                exdate:body.expiration_date,
                telegram_id:body.telegram_id,
                phone:body.phone
            }
        })
        return createUserRequest
    }catch (err) {
        sendNoContent(ev,401)
    }

})