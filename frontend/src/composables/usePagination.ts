import {IUsers_Data,Response} from "../utils/Types";
import {useTableStore,envVariable,useAuthStore,useDashboardStore} from "./useStates";
import {reactive,watch} from "vue";
import { useNotification } from "@kyvg/vue3-notification";
import {useRouter,useRoute} from "vue-router";


export const usePagination=()=>{
    const router=useRouter()
    const route=useRoute()
    const { notify }  = useNotification()
    const {tableStore}=useTableStore()
    const {apiBase}=envVariable()
    const {token}=useAuthStore()
    const {dashboardStore}=useDashboardStore()
    const modalData=reactive({
        on:false,
        name:''
    })
    const paginationDataInitialValue={
        itemPerPage:5,
        allPages:0,
        sourceData:[] as IUsers_Data['rows'],
        currentPageData:[] as IUsers_Data['rows'],
        startIdx:0,
        endIdx:0,
        currentPage:1,
        searchResultFlag:false,
        maxShowButton:3,
        startShowPaginationButton:1,
        endShowPaginationButton:3,
    }
    tableStore.paginationData=paginationDataInitialValue


    const changePerPageHandler = (value:any) => {
        tableStore.paginationData.itemPerPage=value.per_page
        changePage(1)
        paginationUpdate()
    }

    const paginationUpdate = () => {
        tableStore.paginationData.allPages=Math.ceil(tableStore.paginationData.sourceData.length/tableStore.paginationData.itemPerPage);
        tableStore.paginationData.currentPageData=[...tableStore.paginationData.sourceData].slice(0,tableStore.paginationData.itemPerPage)
    }

    const changePage = (pageNumber:number) => {
        if(pageNumber> tableStore.paginationData.allPages){
            tableStore.paginationData.currentPage=1
        }else if(pageNumber<1){
            tableStore.paginationData.currentPage=tableStore.paginationData.allPages
        }else{
            tableStore.paginationData.currentPage=pageNumber
        }
        tableStore.paginationData.endIdx=tableStore.paginationData.currentPage*tableStore.paginationData.itemPerPage
        tableStore.paginationData.startIdx=tableStore.paginationData.endIdx-tableStore.paginationData.itemPerPage
        tableStore.paginationData.currentPageData=[...tableStore.paginationData.sourceData].slice(tableStore.paginationData.startIdx,tableStore.paginationData.endIdx)

    }
    const nextPage = () => {
      changePage(tableStore.paginationData.currentPage+1)
        goToCurrentButton(tableStore.paginationData.currentPage)
    }
    const previousPage = () => {
        changePage(tableStore.paginationData.currentPage-1)
        goToCurrentButton(tableStore.paginationData.currentPage)
    }
    const searchHandler = () => {
        tableStore.paginationData.sourceData=tableStore.tableData.rows
        const searchResult=[...tableStore.paginationData.sourceData].filter(item=>{
            return item.user.toLowerCase().startsWith(tableStore.searchText.toLowerCase())
        });
        tableStore.paginationData.sourceData=searchResult
        tableStore.paginationData.searchResultFlag = searchResult.length === 0;
        paginationUpdate()
    }

    const searchThroughQuery = () => {
        const username=route.query.username as string
        if(username){
            tableStore.searchText=username
            searchHandler()
        }
    }


    watch(
        ()=>tableStore.fetchTableDataFlag,
        ()=>{
            if(tableStore.fetchTableDataFlag){
                tableStore.paginationData=null
                tableStore.selectedUserToDelete=[]
                tableStore.selectedOnlineUserToKill=[]
                tableStore.paginationData=paginationDataInitialValue
                tableStore.paginationData.sourceData=tableStore.tableData.rows
                tableStore.searchText=''
                paginationUpdate();
                searchThroughQuery();
            }
        },
        {
            immediate:true
        }
    )
    watch(
        ()=>route.query,
        ()=>{
            searchThroughQuery();
        }
    )

    const resetSearch = () => {
        tableStore.paginationData.sourceData=tableStore.tableData.rows
        tableStore.searchText=''
        paginationUpdate()
        changePage(1)
        tableStore.paginationData.searchResultFlag=false
        router.replace({query:null})
    }
    const showMoreButton = () => {
      tableStore.paginationData.startShowPaginationButton+=tableStore.paginationData.maxShowButton
      tableStore.paginationData.endShowPaginationButton+=tableStore.paginationData.maxShowButton
    }
    const showLessButton = () => {
        tableStore.paginationData.startShowPaginationButton-=tableStore.paginationData.maxShowButton
        tableStore.paginationData.endShowPaginationButton-=tableStore.paginationData.maxShowButton
    }

    const goToCurrentButton = (currentPage:number) => {
        const allButtonPage=Math.ceil(tableStore.paginationData.allPages/tableStore.paginationData.maxShowButton)
        for(let i=1;i<allButtonPage+1;i++){
            const max=i*tableStore.paginationData.maxShowButton
            const min=(max-tableStore.paginationData.maxShowButton)+1
           if(max>=currentPage && min<=currentPage){
               tableStore.paginationData.startShowPaginationButton=min
               tableStore.paginationData.endShowPaginationButton=max
               break
           }
        }
    }


    const deleteSelectedUsers = async () => {
        tableStore.fetchTableDataFlag=false
        dashboardStore.showPreloaderFlag=true
        fetch(apiBase+'del-kill-users?mode=del',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                Authorization:`Bearer ${token.value}`
            },
            body:JSON.stringify(tableStore.selectedUserToDelete)
        }).
        then(response=>response.json()).
        then((response)=>{
            if(response.detail){
                notify({
                    type:'error',
                    title:'Delete Users Operation',
                    text:response.detail
                })
            }else{
                tableStore.selectedUserToDelete=[]
                notify({
                    type:'warn',
                    title:'Delete Users Operation',
                    text:'Users deleted successfully!'
                })
            }
        }).
        catch(err=>{
            console.log(err)
            notify({
                type:'error',
                title:'Delete Users Operation',
                text:'Operation failed! Error in connecting to server.'
            })
        }).
        finally(()=>{
            tableStore.getUsersList()
            modalData.on=false
        })
    }


    const killSelectedUsers =async () => {
        tableStore.fetchTableDataFlag=false
        dashboardStore.showPreloaderFlag=true
        fetch(apiBase+'del-kill-users?mode=kill',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                Authorization:`Bearer ${token.value}`
            },
            body:JSON.stringify(tableStore.selectedOnlineUserToKill)
        }).
        then(response=>response.json()).
        then((response)=>{
            if(response.detail){
                notify({
                    type:'error',
                    title:'Kill Users Operation',
                    text:response.detail
                })
            }else{
                tableStore.selectedOnlineUserToKill=[]
                notify({
                    type:'warn',
                    title:'Kill Users Operation',
                    text:'Users are killed successfully!'
                })
            }
        }).
        catch(err=>{
            console.log(err)
            notify({
                type:'error',
                title:'Kill Users Operation',
                text:'Operation failed! Error in connecting to server.'
            })
        }).
        finally(()=>{
            modalData.on=false
            tableStore.getOnlineUsers()
        })

    }

    const selectOperation = (name:string) => {
        modalData.on=true
        modalData.name=name
    }

    return{
        changePerPageHandler,changePage,nextPage,previousPage,searchHandler,resetSearch,showMoreButton,showLessButton,deleteSelectedUsers,killSelectedUsers,selectOperation,modalData
    }
}