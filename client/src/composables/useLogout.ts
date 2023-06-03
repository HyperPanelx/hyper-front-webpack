

export const useLogout=()=>{
    const {isLogin}=useStates()
    const {public:{internalApiKey,internalApiBase}}=useRuntimeConfig()

    const logoutHandler = async () => {
      try {
          const logoutRequest=await $fetch('/api/auth/logout',{
              headers:{
                  Authorization:internalApiKey
              },
              credentials: "include",
              baseURL:internalApiBase
          })
          isLogin.value=false
          return navigateTo({name:'LOGIN'})
      }catch (err) {
          console.log(err)
      }
    }


    return{
        logoutHandler
    }
}